import './scss/styles.scss';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {API_URL, CDN_URL} from "./utils/constants";
import {IId, ICatalog, ICart, IPayment, IOrderData, StateChangedEvent, OrderErrors} from "./types";
import {EventEmitter} from "./components/base/events";
import {transitions} from "./components/transitions";
import {ShopStates} from "./components/ShopStates";
import {ShopModel} from "./components/ShopModel";
import {ShopAPI} from "./components/ShopAPI";
import {Page} from "./components/Page";
import {ItemCard} from "./components/ItemCard";
import {Modal} from "./components/common/Modal";
import {Cart} from "./components/Cart";
import {OrderForm} from "./components/OrderForm";
import {ContactForm} from "./components/ContactForm";
import {OrderSuccess} from "./components/OrderSuccess";


const events = new EventEmitter();
const states = new ShopStates(events, transitions);
const api = new ShopAPI(CDN_URL, API_URL);

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const catalogItemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewItemTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const shop = new ShopModel(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const preview = new ItemCard(cloneTemplate(previewItemTemplate), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactFormTemplate), events);
const orderSuccess = new OrderSuccess(cloneTemplate(orderSuccessTemplate), events);


const renderCartContent = (): ICart => ({
    items: shop.cart.map(item => {
        const card = new ItemCard(cloneTemplate(cartItemTemplate), events);
        return card.render({
            ...shop.getItem(item),
            index: (shop.cart.indexOf(item) + 1)
        });
    }),
    total: shop.getCartTotal()
});

events.onAll(({ eventName, data }) => {
    states.dispatch(`${eventName}`, data);
})

events.on('state:changed', ({ state, data }: StateChangedEvent) => {
    switch (state) {
        case 'preview':
            modal.render({content: preview.render({
                ...shop.getItem(data.id),
                inCart: shop.inCart(data.id)
            })});
            break;
        case 'cart':
            modal.render({content: cart.render(renderCartContent())});
            break;
        case 'order_form':
            modal.render({content: orderForm.render({
                payment: undefined,
                address: '',
                errors: [],
                valid: false
            })});
            break;
        case 'contact_form':
            modal.render({content: contactForm.render({
                phone: '',
                email: '',
                errors: [],
                valid: false
            })});
            break;
        case 'order_success':
            modal.render({content: orderSuccess.render({total: data.total})});
        case 'browsing':
            if (states.getPreviousState() === 'order_form' || states.getPreviousState() === 'contact_form') {
                shop.clearOrderInfo()
            }
            break;
        default:
            states.setState('browsing');
    }
  });

events.on<ICatalog>('items:changed', () => {
    page.items = shop.items.map(item => {
        const card = new ItemCard(cloneTemplate(catalogItemTemplate), events);
        return card.render(item);
    });
    page.cartAmount = shop.getCartAmount();
});

events.on('cart:changed', () => {
    shop.setOrderField('items', shop.cart);
    shop.setOrderField('total', shop.getCartTotal());
    
    page.render({cartAmount: shop.getCartAmount()});

    if (states.getState() === 'preview') {
        preview.render({inCart: shop.inCart(preview.getId())});
    }

    if (states.getState() === 'cart') {
        cart.render(renderCartContent());
    }
});

events.on('item:cart-action', (data: IId) => {
    if (!shop.inCart(data.id)) {
        shop.addToCart(data.id)
    }
    else {
        shop.removeFromCart(data.id);
    }
});

events.on('payment:select', (data: IPayment) => {
    shop.setOrderField('payment', data.payment);

    if (states.getState() === 'order_form') {
        orderForm.payment = data.payment;
    }
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderData, value: string }) => {
    shop.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderData, value: string }) => {
    shop.setOrderField(data.field, data.value);
});

events.on('orderErrors:change', (errors: Partial<OrderErrors>) => {
    const { payment, address, email, phone } = errors;
    orderForm.valid = !address && !payment;
    contactForm.valid = !phone && !email;

    const orderErrorMessages = Object.values({ payment, address }).filter(Boolean).join('; ');
    const contactErrorMessages = Object.values({ email, phone }).filter(Boolean).join('; ');
    orderForm.errors = orderErrorMessages;
    contactForm.errors = contactErrorMessages;
});

events.on('contacts:submit', () => {
    api.placeOrder(shop.order)
        .then((res) => {
            events.emit('order:sent', {total: res.total});
            shop.clearCart();
            shop.clearOrderInfo();
        })
        .catch(err => {
            console.error(err);
        });
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getItemList()
   .then(data => shop.setItems(data))
   .catch(err => console.error(err));
import './scss/styles.scss';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {API_URL, CDN_URL} from "./utils/constants";
import {IId, ICatalog, TransitionMap, StateChangedEvent} from "./types";
import {EventEmitter} from "./components/base/events";
import {ShopStates} from "./components/ShopStates";
import {ShopModel} from "./components/ShopModel";
import {ShopAPI} from "./components/ShopAPI";
import {Page} from "./components/Page";
import {ItemCard} from "./components/ItemCard";
import {Modal} from "./components/common/Modal";

const transitions: TransitionMap = {
    browsing: {
        'item:clicked': 'preview',
        'cart:clicked': 'cart',
    },
    preview: {
        'modal:close': 'browsing',
    },
    cart: {
        'order:open': 'order_form',
        'modal:close': 'browsing',
    },
    order_form: {
        'form:submit': 'contact_form',
        'modal:close': 'browsing',
    },
    contact_form: {
        'form:submit': 'order_success',
        'modal:close': 'browsing',
    },
    order_success: {
        'modal:close': 'browsing',
    }
}

const events = new EventEmitter();
const states = new ShopStates(events, transitions);
const api = new ShopAPI(CDN_URL, API_URL);

//ДЕБАГ
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})
//ДЕБАГ

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
});

events.on('item:cart-action', (data: IId) => {
    if (!shop.inCart(data.id)) {
        shop.addToCart(data.id)
    }
    else {
        shop.removeFromCart(data.id);
    }
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getItemList()
   .then(data => shop.setItems(data))
   .catch(err => console.log(err));
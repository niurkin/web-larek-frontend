import {IShopItem, IOrderData, OrderErrors} from "../types";
import {IEvents} from "./base/events";

export class ShopModel {
    items: IShopItem[] = [];
    cart: string[] = [];
    order: IOrderData = {
        payment: 'card',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };
    orderErrors: OrderErrors = {};

    constructor (protected events: IEvents) {}

    setItems(items: IShopItem[]) {
        this.items = items;
        this.events.emit('items:changed', {items: this.items});
    }

    getItem(id: string): IShopItem {   
        return this.items.find(item => item.id === id);
    }

    addToCart(id: string) {
        this.cart.push(id);
        this.events.emit('cart:changed');
    }

    removeFromCart(id: string) {
        this.cart = this.cart.filter(item => item !== id);
        this.events.emit('cart:changed');
    }

    clearCart() {
        this.cart.length = 0;
        this.events.emit('cart:changed');
    }

    getCartAmount(): number {
        return this.cart.length;
    }

    getCartTotal(): number {
        return this.cart.reduce((total, id) => {
            const item = this.items.find(item => item.id === id);
            return total + (item.price ?? 0);
        }, 0);
    }

    setOrderField<K extends keyof IOrderData>(field: K, value: IOrderData[K]) {
        this.order[field] = value;
    }

    inCart(id: string): boolean {
        return this.cart.includes(id);
    }

    validateOrder() {
        const errors: typeof this.orderErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.orderErrors = errors;
        this.events.emit('orderErrors:change', this.orderErrors);
        return Object.keys(errors).length === 0;
    }
}
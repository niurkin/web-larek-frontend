export type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type Price = number | null;

export type Payment = 'card' | 'cash';

export interface IId {
    id: string;
}

export interface ITotalPrice {
    total: Price;
}

export interface ICartCheck {
    inCart: boolean;
}

export interface IShopItem extends IId {
    description: string;
    image: string;
    title: string;
    category: ItemCategory;
    price: Price;
}

export type ICartItem = Pick<IShopItem, "title" | "price" | "id">;

export type IItemPreview = IShopItem & ICartCheck;

export interface IProductList {
    total: number;
    items: IShopItem[];
}

export interface IUserData {
    email: string;
    phone: string;
    address: string;
}

export interface IOrderData extends IUserData, ITotalPrice {
    payment: Payment;
    items: string[];
}

export type IOrderResult = ITotalPrice & IId;

export interface IElementCollection {
    items: HTMLElement[];
}

export interface IPage extends IElementCollection {
    cartAmount: number;
}

export interface IModal {
    content: HTMLElement;
}

export interface IButton {
    buttonActive: boolean;
    buttonText: string;
}

export type ICart = IElementCollection & ITotalPrice;

export interface IToggler {
    selected: string;
}

export interface IFormState {
    valid: boolean;
    errors: keyof IOrderData[];
}
export type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type Price = number | null;

export type Payment = 'card' | 'cash';

export interface IId {
    id: string;
}

export interface IPayment {
    payment: Payment;
}

export interface ITotalAmount {
    total: number;
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

export interface ICatalog {
    items: IShopItem[];
}

export interface IItemCard extends IShopItem, ICartCheck {
    index: number;
}


export interface IUserData {
    email: string;
    phone: string;
    address: string;
}

export interface IOrderData extends IUserData, ITotalAmount {
    items: string[];
    payment: Payment | undefined;
}

export type OrderInfo = Pick<IOrderData, 'payment' | 'address'>;

export type ContactInfo = Pick<IUserData, 'email' | 'phone'>;

export type OrderErrors = Partial<Record<keyof IOrderData, string>>;

export interface IOrderResult extends ITotalAmount, IId {}

export interface IElementCollection {
    items: HTMLElement[];
}

export interface IPage extends IElementCollection {
    cartAmount: number;
    locked: boolean;
}

export interface ICart extends IElementCollection, ITotalAmount {}

export type State = 'browsing' | 'preview' | 'cart' | 'order_form' | 'contact_form' | 'order_success';

export type TransitionMap = Record<State, Partial<Record<string, State>>>;

export type StateDataMap = {
    preview: IId;
    order_success: ITotalAmount;
}

export type StateChangedEvent = {
    [K in State]: K extends keyof StateDataMap
      ? { state: K; data: StateDataMap[K] }
      : { state: K; data?: unknown };
  }[State];
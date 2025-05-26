import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";
import {IPage} from "../types";

export class Page extends Component<IPage> {
    protected _wrapper: HTMLElement;
    protected _items: HTMLElement;
    protected _cartIcon: HTMLElement;
    protected _cartCounter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._items = ensureElement<HTMLElement>('.gallery');
        this._cartIcon = ensureElement<HTMLElement>('.header__basket');
        this._cartCounter = ensureElement<HTMLElement>('.header__basket-counter');

        this._cartIcon.addEventListener('click', () => {
            this.events.emit('cart:open');
        });
    }

    set items(items: HTMLElement[]) {
        this._items.replaceChildren(...items);
    }

    set cartAmount(value: number) {
        this.setText(this._cartCounter, String(value));
    }


    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
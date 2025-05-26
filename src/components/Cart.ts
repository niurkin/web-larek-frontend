import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import {IEvents} from "./base/events";
import {ICart} from "../types";

export class Cart extends Component<ICart> {
    protected _items: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._items = ensureElement<HTMLElement>('.basket__list', this.container);
        this._button = this.container.querySelector('.basket__button');
        this._total = this.container.querySelector('.basket__price');

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }

        this.items = [];
        this.total = 0;
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._items.replaceChildren(...items);
            this.setDisabled(this._button, false);
        }
        else {
            this._items.replaceChildren();
            this.setDisabled(this._button, true);
            this.setText(this._total, 'Корзина пуста');
        }
    }

    set total(value: number) {
        if (value !== 0) {
            this.setText(this._total, `${value} синапсов`);
        }
    }
}
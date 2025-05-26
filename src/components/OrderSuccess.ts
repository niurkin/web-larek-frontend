import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";
import {ITotalAmount} from "../types";

export class OrderSuccess extends Component<ITotalAmount> {
    protected _spent: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._spent = ensureElement<HTMLElement>('.order-success__description', this.container)
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._button.addEventListener('click', () => this.events.emit('success:close'));
    }

    set total(value: number) {
        this.setText(this._spent, `Списано ${value} синапсов`);
    }
}
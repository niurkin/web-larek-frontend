import {Form} from './common/Form';
import {IEvents} from './base/events';
import {Payment, OrderInfo} from "../types";
import {ensureAllElements} from "../utils/utils";

export class OrderForm extends Form<OrderInfo> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('payment:select', {payment: button.name});
            });
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: Payment) {
        this._buttons.forEach(button => this.toggleClass(button, 'button_alt-active', button.name === value));
    }
}
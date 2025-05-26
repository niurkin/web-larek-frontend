import {Form} from './common/Form';
import {IEvents} from './base/events';
import {ContactInfo} from "../types";

export class ContactForm extends Form<ContactInfo> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}
import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ItemCategory, Price, IItemCard} from "../types";
import {ensureElement} from "../utils/utils";

export class ItemCard extends Component<IItemCard> {
    protected _id: string;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _index?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._description = container.querySelector(`.card__text`);
        this._image = container.querySelector(`.card__image`);
        this._category = container.querySelector(`.card__category`);
        this._index = container.querySelector(`.card__index`);
        this._button = container.querySelector(`.card__button`);

        if (this._button) {
            this._button.addEventListener('click', () => this.events.emit('item:cart-action', {id: this._id}));
        }
        else {
            container.addEventListener('click', () => this.events.emit('preview:open', {id: this._id}));
        }
    }

    set id (value: string) {
        this._id = value;
    }

    set title (value: string) {
        this.setText(this._title, value);
    }

    set price (value: Price) {
        const nullPrice = (value === 0 || value === null);

        if (nullPrice) {
            this.setText(this._price, 'Бесценно')
        }
        else {
            this.setText(this._price, `${value} синапсов`)
        }

        this.setDisabled(this._button, nullPrice);
    }

    set description (value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set image (value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title)
        }
    }

    set category (value: ItemCategory) {
        if (this._category) {
            this.setText(this._category, value);
            
            let categoryClass: string = '';
            switch (value) {
                case 'софт-скил':
                    categoryClass = 'card__category_soft';
                    break;
                case 'другое':
                    categoryClass = 'card__category_other';
                    break;
                case 'дополнительное':
                    categoryClass = 'card__category_additional';
                    break;
                case 'кнопка':
                    categoryClass = 'card__category_button';
                    break;
                case 'хард-скил':
                    categoryClass = 'card__category_hard';
                    break;
                default:
                    categoryClass = 'card__category_other';
            }

            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set inCart(value: boolean) {
        if (this._button) {
            if (!value) {
                this.setText(this._button, 'В корзину');
            }
            else {
                this.setText(this._button, 'Удалить');
            }
        }
    }

    set index(value: number) {
        if (this._index) {
            this.setText(this._index, value);
        }
    }

    getId(): string {
        return this._id;
    }
}
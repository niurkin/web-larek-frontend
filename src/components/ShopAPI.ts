import {Api, ApiListResponse} from './base/api';
import {IShopItem, IOrderData, IOrderResult} from "../types";

export class ShopAPI extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItemList(): Promise<IShopItem[]> {
        return this.get('/product').then((data: ApiListResponse<IShopItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image.replace(".svg", ".png")
            }))
        );
    }

    getItem(id: string): Promise<IShopItem> {
        return this.get(`/product/${id}`).then(
            (item: IShopItem) => ({
                ...item,
                image: this.cdn + item.image.replace(".svg", ".png")
            })
        );
    }

    placeOrder(order: IOrderData): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}
import {TransitionMap} from "../types";

export const transitions: TransitionMap = {
    browsing: {
        'preview:open': 'preview',
        'cart:open': 'cart',
    },
    preview: {
        'modal:close': 'browsing',
    },
    cart: {
        'order:open': 'order_form',
        'modal:close': 'browsing',
    },
    order_form: {
        'order:submit': 'contact_form',
        'modal:close': 'browsing',
    },
    contact_form: {
        'order:sent': 'order_success',
        'modal:close': 'browsing',
    },
    order_success: {
        'modal:close': 'browsing',
    }
}
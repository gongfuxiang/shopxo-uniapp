import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "cart-page": "购物车"
    }
};
var en = {
    pages: {
        "cart-page": "shopping cart"
    }
};
export default createPageLocaleMixin({ zh, en });

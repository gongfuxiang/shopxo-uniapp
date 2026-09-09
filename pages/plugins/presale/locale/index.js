import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-presale-index": "预售",
        "plugins-presale-buy": "订单确认",
        "plugins-presale-order": "预售订单"
    }
};
var en = {
    "pages": {
        "plugins-presale-index": "Presale",
        "plugins-presale-buy": "Confirm Order",
        "plugins-presale-order": "Presale Orders"
    }
};
export default createPageLocaleMixin({ zh, en });

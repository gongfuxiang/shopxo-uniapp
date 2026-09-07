import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "plugins-exchangerate-currency": "货币切换"
    }
};
var en = {
    pages: {
        "plugins-exchangerate-currency": "Currency Switch"
    }
};
var spa = {
    pages: {
        "plugins-exchangerate-currency": "Cambiar moneda"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

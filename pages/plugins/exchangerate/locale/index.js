import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "plugins-exchangerate-currency": "货币切换"
    }
};
var en = {
    pages: {
        "plugins-exchangerate-currency": "Currency switching"
    }
};
export default createPageLocaleMixin({ zh, en });

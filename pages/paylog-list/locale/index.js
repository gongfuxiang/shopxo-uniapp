import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "paylog-list": "支付订单列表"
    }
};
var en = {
    pages: {
        "paylog-list": "Payment Order list"
    }
};
export default createPageLocaleMixin({ zh, en });

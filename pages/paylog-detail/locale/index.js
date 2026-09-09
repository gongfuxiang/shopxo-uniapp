import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "paylog-detail": "支付订单详情"
    }
};
var en = {
    pages: {
        "paylog-detail": "Payment Order Details"
    }
};
export default createPageLocaleMixin({ zh, en });

import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-scanpay-index": "扫码付款",
        "plugins-scanpay-tips": "支付结果"
    },
    "tips": {
        "total_payment_amount": "支付总额",
        "end_page": "退出页面"
    },
    "index": {
        "add_notes": "添加备注",
        "enter_consumption_amount": "请输入消费金额"
    }
};
var en = {
    "pages": {
        "plugins-scanpay-index": "Scan code payment",
        "plugins-scanpay-tips": "Payment results"
    },
    "tips": {
        "total_payment_amount": "Total payment amount",
        "end_page": "end page"
    },
    "index": {
        "add_notes": "Add notes",
        "enter_consumption_amount": "Please enter the consumption amount"
    }
};
export default createPageLocaleMixin({ zh, en });

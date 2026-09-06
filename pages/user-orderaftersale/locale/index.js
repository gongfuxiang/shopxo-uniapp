import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "user-orderaftersale": "退款/售后"
    },
    "user-orderaftersale": {
        "confirmed": "待确认",
        "returned": "待退货",
        "pending_review": "待审核",
        "rejected": "已拒绝"
    }
};
var en = {
    "pages": {
        "user-orderaftersale": "Refund/After sales"
    },
    "user-orderaftersale": {
        "confirmed": "To be confirmed",
        "returned": "To be returned",
        "pending_review": "Pending review",
        "rejected": "Rejected"
    }
};
export default createPageLocaleMixin({ zh, en });

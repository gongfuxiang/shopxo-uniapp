import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-payvoucher-form": "上传支付凭证"
    },
    "payvoucher": {
        "source_type": "来源类型",
        "merge_order": "合并订单",
        "order_unit": "笔",
        "pay_total": "应付合计",
        "payable_amount": "应付金额",
        "voucher_status": "凭证状态",
        "receive_info": "收款信息",
        "pay_voucher": "支付凭证",
        "no_voucher": "暂无凭证",
        "submit_voucher": "提交凭证",
        "upload_transfer_screenshot": "请上传转账截图，最多10张",
        "upload_voucher_image": "请上传支付凭证图片"
    }
};
var en = {
    "pages": {
        "plugins-payvoucher-form": "Upload payment voucher"
    },
    "payvoucher": {
        "source_type": "Source type",
        "merge_order": "Combined orders",
        "order_unit": "orders",
        "pay_total": "Amount due",
        "payable_amount": "Amount due",
        "voucher_status": "Voucher status",
        "receive_info": "Payment info",
        "pay_voucher": "Payment voucher",
        "no_voucher": "No voucher",
        "submit_voucher": "Submit voucher",
        "upload_transfer_screenshot": "Please upload transfer screenshots, up to 10 images",
        "upload_voucher_image": "Please upload payment voucher images"
    }
};
export default createPageLocaleMixin({ zh, en });

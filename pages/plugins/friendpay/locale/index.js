import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-friendpay-share": "邀请代付",
        "plugins-friendpay-list": "代付记录",
        "plugins-friendpay-pay": "朋友代付",
        "plugins-friendpay-success": "代付成功"
    },
    "friendpay": {
        "pay_mode_title": "邀请朋友代付",
        "share_page_title": "邀请朋友代付",
        "pay_page_title": "朋友代付",
        "share_amount": "代付金额",
        "pay_amount": "应付金额",
        "select_payment": "选择支付方式",
        "invite_fallback_pay": "${name} 请您帮忙支付订单",
        "share_link": "代付链接",
        "share_qrcode": "分享二维码",
        "invite_qrcode": "邀请二维码",
        "invite_fallback": "好友 ${name} 请您帮忙支付",
        "expire_tips": "链接有效期至：",
        "refresh_link": "刷新链接",
        "refresh_confirm": "刷新后将生成新的代付链接，已发出的原支付链接将失效，确定继续吗？",
        "refresh_success": "刷新成功",
        "list_owner": "我发起的",
        "list_payer": "我代付的",
        "go_share": "去分享",
        "login_to_pay": "登录后代付",
        "confirm_pay": "确认代付",
        "link_error": "代付链接无效",
        "order_id_error": "订单id有误",
        "pay_success_title": "代付成功",
        "pay_success_tips": "感谢您的帮助，订单已支付完成",
        "view_records": "查看代付记录"
    }
};
var en = {
    "pages": {
        "plugins-friendpay-share": "Friend Pay Invite",
        "plugins-friendpay-list": "Friend Pay Records",
        "plugins-friendpay-pay": "Friend Pay",
        "plugins-friendpay-success": "Pay Success"
    },
    "friendpay": {
        "pay_mode_title": "Invite friend to pay",
        "share_page_title": "Invite friend to pay",
        "pay_page_title": "Friend pay",
        "share_amount": "Amount",
        "pay_amount": "Pay amount",
        "select_payment": "Select payment method",
        "invite_fallback_pay": "${name} asks you to pay for this order",
        "share_link": "Pay link",
        "share_qrcode": "Share QR code",
        "invite_qrcode": "Invite QR code",
        "invite_fallback": "Your friend ${name} asks you to pay",
        "expire_tips": "Valid until: ",
        "refresh_link": "Refresh link",
        "refresh_confirm": "Refreshing will invalidate the old link. Continue?",
        "refresh_success": "Refreshed",
        "list_owner": "I initiated",
        "list_payer": "I paid for",
        "go_share": "Share",
        "login_to_pay": "Login to pay",
        "confirm_pay": "Confirm pay",
        "link_error": "Invalid pay link",
        "order_id_error": "Invalid order id",
        "pay_success_title": "Pay success",
        "pay_success_tips": "Thank you, the order has been paid",
        "view_records": "View records"
    }
};
export default createPageLocaleMixin({ zh, en });

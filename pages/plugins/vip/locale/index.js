import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-vip-index": "会员VIP",
        "plugins-vip-buy": "开通会员",
        "plugins-vip-user": "我的会员",
        "plugins-vip-order": "开通订单",
        "plugins-vip-order-detail": "订单详情",
        "plugins-vip-profit": "收益明细",
        "plugins-vip-profit-detail": "收益详情",
        "plugins-vip-poster": "推广奖励",
        "plugins-vip-team": "我的团队",
        "plugins-vip-member-code": "会员码",
        "plugins-vip-apply": "会员申请",
        "plugins-vip-apply-form": "填写申请"
    },
    "apply": {
        "vip_application_been_approved": "您的会员申请已通过",
        "level": "，等级：",
        "review_time": "审核时间：",
        "application_time": "申请时间：",
        "application_info": "申请信息",
        "vip_application_under_review_wait_patie": "您的会员申请正在审核中，请耐心等待。",
        "modify_info_submit_again": "可修改信息后重新提交申请",
        "tap_go_fill_fill_application_info": "请点击去填写页面填写申请信息后提交审核",
        "go_fill": "去填写",
        "reapply": "重新申请",
        "fill_application_form_now": "是否立即填写申请表单？",
        "previous_application_not_approved": "上次申请未通过"
    },
    "apply-form": {
        "modifications_resubmitted_review_confirm_info_co": "修改后将重新提交审核，请确认信息无误。",
        "application_form_configured_yet_contact_administ": "申请表单暂未配置，请联系管理员",
        "submit_application": "提交申请",
        "save_changes": "保存修改"
    },
    "buy": {
        "card_type_selection": "卡种选择",
        "active": "立即开通",
        "all_orders": "所有订单",
        "select_duration_activation": "请选择开通时长",
        "incorrect_activation_duration": "开通时长有误",
        "purchase_duration_not_configured": "购买时长未配置",
        "member_level_not_configured": "未配置会员等级"
    },
    "index": {
        "join": "加入会员"
    },
    "user": {
        "rebate_overview": "返利概况",
        "activate_membership": "开通会员",
        "apply_vip": "会员申请",
        "renewal_membership": "续费会员",
        "continuous_activation": "连续开通",
        "promote_customers": "推广客户"
    },
    "order": {
        "opening_order_number": "开通单号",
        "opening_duration": "开通时长"
    },
    "order-detail": {
        "type": "类型"
    },
    "profit": {
        "rebate_amount": "返佣金额"
    },
    "profit-detail": {
        "rebate_rules": "返佣规则"
    },
    "team": {
        "joined": "加入时间"
    },
    "member-code": {
        "member_code_empty": "会员码为空"
    }
};
var en = {
    "pages": {
        "plugins-vip-index": "Member VIP",
        "plugins-vip-buy": "Activate membership",
        "plugins-vip-user": "My Members",
        "plugins-vip-order": "VIP Order",
        "plugins-vip-order-detail": "Order details",
        "plugins-vip-profit": "Profit",
        "plugins-vip-profit-detail": "Revenue details",
        "plugins-vip-poster": "Promotion",
        "plugins-vip-team": "My Team",
        "plugins-vip-member-code": "Member Code",
        "plugins-vip-apply": "VIP Apply",
        "plugins-vip-apply-form": "Fill in application"
    },
    "apply": {
        "vip_application_been_approved": "Your VIP application has been approved",
        "level": ", level: ",
        "review_time": "Review time: ",
        "application_time": "Application time: ",
        "application_info": "Application info",
        "vip_application_under_review_wait_patie": "Your VIP application is under review. Please wait patiently.",
        "modify_info_submit_again": "You can modify the info and submit again",
        "tap_go_fill_fill_application_info": "Please tap \"Go fill in\" to fill in the application info and submit for review",
        "go_fill": "Go fill in",
        "reapply": "Reapply",
        "fill_application_form_now": "Fill in the application form now?",
        "previous_application_not_approved": "The previous application was not approved"
    },
    "apply-form": {
        "modifications_resubmitted_review_confirm_info_co": "Modifications will be resubmitted for review. Please confirm the info is correct.",
        "application_form_configured_yet_contact_administ": "The application form is not configured yet. Please contact the administrator",
        "submit_application": "Submit application",
        "save_changes": "Save changes"
    },
    "buy": {
        "card_type_selection": "Card type selection",
        "active": "Active",
        "all_orders": "All orders",
        "select_duration_activation": "Please select the duration of activation",
        "incorrect_activation_duration": "Incorrect activation duration",
        "purchase_duration_not_configured": "Purchase duration not configured",
        "member_level_not_configured": "Member level not configured"
    },
    "index": {
        "join": "Join"
    },
    "user": {
        "rebate_overview": "Rebate Overview",
        "activate_membership": "Join VIP",
        "apply_vip": "VIP Apply",
        "renewal_membership": "Renewal of membership",
        "continuous_activation": "Continuous activation",
        "promote_customers": "Promote customers"
    },
    "order": {
        "opening_order_number": "Opening order number",
        "opening_duration": "Opening duration"
    },
    "order-detail": {
        "type": "type"
    },
    "profit": {
        "rebate_amount": "Rebate amount"
    },
    "profit-detail": {
        "rebate_rules": "Rebate rules"
    },
    "team": {
        "joined": "Joined at"
    },
    "member-code": {
        "member_code_empty": "The member code is empty"
    }
};
export default createPageLocaleMixin({ zh, en });

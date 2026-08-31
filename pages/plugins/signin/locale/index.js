var zh = {
    "pages": {
        "plugins-signin-user": "签到",
        "plugins-signin-detail": "签到",
        "plugins-signin-user-qrcode-detail": "签到码详情",
        "plugins-signin-user-qrcode-saveinfo": "签到码编辑",
        "plugins-signin-user-coming-list": "用户签到"
    },
    "user-qrcode-detail": {
        "share_block": "推广",
        "specified_time_incomplete_tip": "（未填全，签到时不计额外奖励）",
        "share_link_label": "分享链接",
        "heaven_flip": "天，翻",
        "detail_specificed_time_reward_timeend_additional": " - {{ detail.specified_time_reward.time_end }}，额外奖励 ",
        "double_reward_consecutive_attendance": "连续签到翻倍奖励",
        "continuity": "连续",
        "times": "倍",
        "additional_rewards_during_designated_time_period": "指定时段额外奖励",
        "time_interval": "时段",
        "inviter_rewards": "邀请人奖励",
        "invitee_rewards": "受邀人奖励",
        "contact_name": "联系人姓名",
        "contact_phone_number": "联系人电话",
        "contact_address": "联系人地址"
    },
    "user-qrcode-saveinfo": {
        "contact_name_format_between_30_characters": "联系人姓名格式 2~30 个字符之间",
        "contact_phone_number_15_characters": "联系人电话 6~15 个字符",
        "contact_address_up_230_characters": "联系人地址、最多230个字符",
        "sign_code": "签到码",
        "fill_contact_name_format_between_30": "请填写联系人姓名格式 2~30 个字符之间",
        "fill_contact_phone_number_which_should": "请填写联系人电话 6~15 个字符",
        "fill_contact_address_maximum_230_characters": "请填写联系人地址、最多230个字符"
    },
    "user-qrcode": {
        "team_up_check": "组队签到"
    },
    "detail": {
        "person_sign_total": "人签到，共",
        "integral_total": "积分，共",
        "organize_team": "组队",
        "signed": "已签到",
        "sign_immediately": "立即签到",
        "my_check": "我的签到",
        "today": "今天",
        "today_2": "今日",
        "not": "未",
        "sign_obtain": "签到，获得",
        "rule_description": "规则说明",
        "successful_check": "签到成功",
        "congratulations_obtaining": "恭喜您获得",
        "use_now": "立即使用",
        "day": "日",
        "one": "一",
        "two": "二",
        "three": "三",
        "four": "四",
        "five": "五",
        "six": "六",
        "year": "年",
        "sign": "签到"
    }
};
var en = {
    "pages": {
        "plugins-signin-user": "Sign in",
        "plugins-signin-detail": "Sign in",
        "plugins-signin-user-qrcode-detail": "Sign in code details",
        "plugins-signin-user-qrcode-saveinfo": "Sign in code editing",
        "plugins-signin-user-coming-list": "User check-in"
    },
    "user-qrcode-detail": {
        "share_block": "Promotion",
        "specified_time_incomplete_tip": "(Incomplete: no extra reward at check-in)",
        "share_link_label": "Share link",
        "heaven_flip": "Heaven, flip",
        "detail_specificed_time_reward_timeend_additional": "-{detail. specificed_time_reward. timeend}}, additional reward",
        "double_reward_consecutive_attendance": "Double the reward for consecutive attendance",
        "continuity": "continuity",
        "times": "times",
        "additional_rewards_during_designated_time_period": "Additional rewards during designated time periods",
        "time_interval": "time interval",
        "inviter_rewards": "Inviter Rewards",
        "invitee_rewards": "Invitee rewards",
        "contact_name": "Contact Name",
        "contact_phone_number": "Contact phone number",
        "contact_address": "Contact address"
    },
    "user-qrcode-saveinfo": {
        "contact_name_format_between_30_characters": "Contact name format between 2 and 30 characters",
        "contact_phone_number_15_characters": "Contact phone number 6-15 characters",
        "contact_address_up_230_characters": "Contact address, up to 230 characters",
        "sign_code": "Sign in code",
        "fill_contact_name_format_between_30": "Please fill in the contact name format between 2 and 30 characters",
        "fill_contact_phone_number_which_should": "Please fill in the contact phone number, which should be 6-15 characters long",
        "fill_contact_address_maximum_230_characters": "Please fill in the contact address, with a maximum of 230 characters"
    },
    "user-qrcode": {
        "team_up_check": "Team up check-in"
    },
    "detail": {
        "person_sign_total": "Person sign in, total",
        "integral_total": "Integral, total",
        "organize_team": "organize a team",
        "signed": "Signed in",
        "sign_immediately": "Sign in immediately",
        "my_check": "My check-in",
        "today": "today",
        "today_2": "today",
        "not": "not",
        "sign_obtain": "Sign in and obtain",
        "rule_description": "Rule Description",
        "successful_check": "Successful check-in",
        "congratulations_obtaining": "Congratulations on obtaining",
        "use_now": "Use Now",
        "day": "day",
        "one": "one",
        "two": "two",
        "three": "three",
        "four": "four",
        "five": "five",
        "six": "six",
        "year": "year",
        "sign": "Sign in"
    }
};
var merged = false;
function usePluginLocale(i18n) {
    if (merged || !i18n || typeof i18n.mergeLocaleMessage != 'function') {
        return;
    }
    merged = true;
    i18n.mergeLocaleMessage('zh', zh);
    i18n.mergeLocaleMessage('zh-Hans', zh);
    i18n.mergeLocaleMessage('en', en);
}

export default {
    beforeCreate() {
        usePluginLocale(this.$i18n);
    }
};

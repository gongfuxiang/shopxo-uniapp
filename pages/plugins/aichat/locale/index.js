var zh = {
    "pages": {
        "plugins-aichat-index": "智能客服助手"
    },
    "aichat": {
        "disabled_title": "智能客服咨询功能未开启",
        "disabled_desc": "请在后台【AI智能客服 → 基础配置】中开启「用户咨询页」",
        "new_chat": "开启新对话",
        "history": "对话历史",
        "history_empty": "暂无历史对话",
        "revised_answer": "已重新回答",
        "placeholder": "有什么问题尽管问我",
        "thinking": "正在思考，请稍候...",
        "session_loading": "正在加载对话...",
        "new_session": "新对话",
        "revision_prefix": "第",
        "revision_suffix": "版",
        "load_session_fail": "加载对话失败",
        "load_session_fail_retry": "加载对话失败，请稍后重试",
        "delete_confirm": "确定删除该对话吗？",
        "no_answer": "暂时无法回答，请稍后再试。",
        "request_fail": "请求失败，请稍后再试。",
        "no_question_regenerate": "没有找到对应的问题，无法重新生成"
    }
};
var en = {
    "pages": {
        "plugins-aichat-index": "AI Customer Service Assistant"
    },
    "aichat": {
        "disabled_title": "AI customer service is not enabled",
        "disabled_desc": "Please enable User Consult Page in Admin → AI Customer Service → Basic Settings",
        "new_chat": "New chat",
        "history": "Chat history",
        "history_empty": "No chat history",
        "revised_answer": "Regenerated",
        "placeholder": "Ask me anything",
        "thinking": "Thinking, please wait...",
        "session_loading": "Loading conversation...",
        "new_session": "New chat",
        "revision_prefix": "Version",
        "revision_suffix": "",
        "load_session_fail": "Failed to load conversation",
        "load_session_fail_retry": "Failed to load conversation, please try again later",
        "delete_confirm": "Delete this conversation?",
        "no_answer": "Unable to answer right now, please try again later.",
        "request_fail": "Request failed, please try again later.",
        "no_question_regenerate": "The original question was not found, cannot regenerate"
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

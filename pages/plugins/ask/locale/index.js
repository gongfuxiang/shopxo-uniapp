import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-ask-index": "问答",
        "plugins-ask-detail": "问答详情",
        "plugins-ask-form": "我要提问",
        "plugins-ask-user-detail": "提问详情",
        "plugins-ask-user-list": "我的提问",
        "plugins-ask-goods-list": "问答专区",
        "plugins-ask-comments": "全部问答"
    },
    "ask-comments-goods": {
        "answers": "条回答",
        "any_questions_ask_other_classmates": "有疑问就问问其他同学吧～"
    },
    "ask": {
        "question_content": "提问内容",
        "question_category": "提问分类",
        "email_notice": "回复邮件通知",
        "mobile_notice": "回复手机通知",
        "reply_content": "回复内容"
    },
    "index": {
        "returned": "已回",
        "unreturned": "未回",
        "missing_tab_data": "缺失tab数据！"
    },
    "detail": {
        "message_time": "留言时间:",
        "administrator_reply": "管理员回复",
        "reply_time": "回复时间:",
        "my_question": "我的提问"
    },
    "form": {
        "fill_content": "请填写内容"
    },
    "goods-list": {
        "questions": "的提问",
        "ask": "问",
        "answer": "答",
        "answers": "个回答",
        "put_away_answer": "收起回答"
    }
};
var en = {
    "pages": {
        "plugins-ask-index": "Q&A",
        "plugins-ask-detail": "Q&A details",
        "plugins-ask-form": "I need to ask a question",
        "plugins-ask-user-detail": "Question details",
        "plugins-ask-user-list": "My question",
        "plugins-ask-goods-list": "Q&A section",
        "plugins-ask-comments": "All Q&A"
    },
    "ask-comments-goods": {
        "answers": "Answers",
        "any_questions_ask_other_classmates": "If you have any questions, please ask other classmates~"
    },
    "ask": {
        "question_content": "Question",
        "question_category": "Category",
        "email_notice": "Email notification",
        "mobile_notice": "Mobile notification",
        "reply_content": "Reply content"
    },
    "index": {
        "returned": "Returned",
        "unreturned": "Unreturned",
        "missing_tab_data": "Missing tab data!"
    },
    "detail": {
        "message_time": "Message time:",
        "administrator_reply": "Administrator's reply",
        "reply_time": "Reply time:",
        "my_question": "My question"
    },
    "form": {
        "fill_content": "Please fill in the content"
    },
    "goods-list": {
        "questions": "Questions from",
        "ask": "ask",
        "answer": "answer",
        "answers": "Answers",
        "put_away_answer": "Put away the answer"
    }
};
export default createPageLocaleMixin({ zh, en });

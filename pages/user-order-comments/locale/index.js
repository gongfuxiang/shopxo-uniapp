import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "user-order-comments": "订单评价"
    },
    "user-order-comments": {
        "anonymous": "匿名",
        "does_baby_meet_expectations_let_talk": "宝贝满足你的期待吗？说说它的优点和美中不足的地方吧",
        "very_poor": "非常差",
        "difference": "差",
        "commonly": "一般",
        "good": "好",
        "very_good": "非常好",
        "comment_presented_anonymously": "你写的评论会以匿名的形式展现",
        "comment_presented_form_nickname": "你写的评论会以昵称的形式展现",
        "rate_first": "请先评分",
        "there_still_ratings_left": "还有未评分",
        "comment_content_should_between_230_characters": "评论内容 6~230 个字符之间",
        "each_comment_image_cannot_exceed_images": "每项评论图片不能超过3张"
    }
};
var en = {
    "pages": {
        "user-order-comments": "Order evaluation"
    },
    "user-order-comments": {
        "anonymous": "anonymous",
        "does_baby_meet_expectations_let_talk": "Does the baby meet your expectations? Let's talk about its advantages and shortcomings in beauty",
        "very_poor": "Very poor",
        "difference": "difference",
        "commonly": "commonly",
        "good": "good",
        "very_good": "Very good",
        "comment_presented_anonymously": "Your comment will be presented anonymously",
        "comment_presented_form_nickname": "Your comment will be presented in the form of a nickname",
        "rate_first": "Please rate first",
        "there_still_ratings_left": "There are still no ratings left",
        "comment_content_should_between_230_characters": "Comment content should be between 6 and 230 characters long",
        "each_comment_image_cannot_exceed_images": "Each comment image cannot exceed 3 images"
    }
};
export default createPageLocaleMixin({ zh, en });

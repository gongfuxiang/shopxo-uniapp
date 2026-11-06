import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-userhome-home": "个人主页",
        "plugins-userhome-follow-list": "关注粉丝",
        "plugins-userhome-moment-form": "发布动态"
    },
    "home": {
        "follow": "关注",
        "unfollow": "取消关注",
        "fans": "粉丝",
        "moment": "动态",
        "blog": "博文",
        "ask": "问答",
        "video": "短视频",
        "publish_moment": "发动态",
        "no_signature": "这个人很懒，什么都没写"
    },
    "moment-form": {
        "content_placeholder": "分享此刻心情...",
        "submit": "发布"
    }
};
var en = {
    "pages": {
        "plugins-userhome-home": "Profile",
        "plugins-userhome-follow-list": "Follow / Fans",
        "plugins-userhome-moment-form": "New Moment"
    },
    "home": {
        "follow": "Follow",
        "unfollow": "Unfollow",
        "fans": "Fans",
        "moment": "Moments",
        "blog": "Blog",
        "ask": "Q&A",
        "video": "Video",
        "publish_moment": "Post",
        "no_signature": "No signature yet"
    },
    "moment-form": {
        "content_placeholder": "Share your moment...",
        "submit": "Publish"
    }
};
export default createPageLocaleMixin({ zh, en });

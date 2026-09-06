import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "user-goods-browse": "我的足迹"
    }
};
var en = {
    pages: {
        "user-goods-browse": "My Tracks"
    }
};
export default createPageLocaleMixin({ zh, en });

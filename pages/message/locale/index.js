import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        message: "消息"
    }
};
var en = {
    pages: {
        message: "news"
    }
};
export default createPageLocaleMixin({ zh, en });

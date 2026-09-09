import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "article-detail": "文章详情"
    }
};
var en = {
    pages: {
        "article-detail": "Article details"
    }
};
export default createPageLocaleMixin({ zh, en });

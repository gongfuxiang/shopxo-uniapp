import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "article-category": "所有文章"
    },
    "article-category": {
        "view_volume": "浏览量"
    }
};
var en = {
    "pages": {
        "article-category": "All articles"
    },
    "article-category": {
        "view_volume": "View volume"
    }
};
export default createPageLocaleMixin({ zh, en });

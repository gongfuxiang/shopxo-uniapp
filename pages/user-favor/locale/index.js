import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "user-favor": "商品收藏"
    }
};
var en = {
    pages: {
        "user-favor": "Product Collection"
    }
};
export default createPageLocaleMixin({ zh, en });

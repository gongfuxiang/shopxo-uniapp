import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "goods-search": "商品搜索"
    }
};
var en = {
    pages: {
        "goods-search": "Product search"
    }
};
export default createPageLocaleMixin({ zh, en });

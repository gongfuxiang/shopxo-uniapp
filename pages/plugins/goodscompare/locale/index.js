import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "plugins-goodscompare-index": "商品对比"
    }
};
var en = {
    pages: {
        "plugins-goodscompare-index": "Goods Compare"
    }
};
var spa = {
    pages: {
        "plugins-goodscompare-index": "Comparación de productos"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

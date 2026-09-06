import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "plugins-brand-index": "品牌"
    }
};
var en = {
    pages: {
        "plugins-brand-index": "brand"
    }
};
export default createPageLocaleMixin({ zh, en });

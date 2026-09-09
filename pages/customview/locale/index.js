import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "customview-customview": "自定义页面"
    }
};
var en = {
    pages: {
        "customview-customview": "Custom Page"
    }
};
export default createPageLocaleMixin({ zh, en });

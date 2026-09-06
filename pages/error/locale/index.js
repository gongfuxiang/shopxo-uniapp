import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        error: "温馨提示"
    }
};
var en = {
    pages: {
        error: "Kind reminder"
    }
};
export default createPageLocaleMixin({ zh, en });

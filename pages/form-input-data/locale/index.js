import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "form-input-data": "表单数据"
    }
};
var en = {
    pages: {
        "form-input-data": "Form input data"
    }
};
export default createPageLocaleMixin({ zh, en });

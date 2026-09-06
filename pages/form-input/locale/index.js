import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "form-input": "表单"
    }
};
var en = {
    pages: {
        "form-input": "Form input"
    }
};
export default createPageLocaleMixin({ zh, en });

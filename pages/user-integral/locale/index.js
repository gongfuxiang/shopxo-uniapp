import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "user-integral": "积分明细"
    }
};
var en = {
    pages: {
        "user-integral": "Points details"
    }
};
export default createPageLocaleMixin({ zh, en });

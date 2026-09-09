import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "extraction-address": "自提地址"
    }
};
var en = {
    pages: {
        "extraction-address": "Self pickup address"
    }
};
export default createPageLocaleMixin({ zh, en });

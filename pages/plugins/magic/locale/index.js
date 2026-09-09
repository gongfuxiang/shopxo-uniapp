import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "plugins-magic-detail": "详情"
    }
};
var en = {
    pages: {
        "plugins-magic-detail": "Details"
    }
};
var spa = {
    pages: {
        "plugins-magic-detail": "Detalle"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

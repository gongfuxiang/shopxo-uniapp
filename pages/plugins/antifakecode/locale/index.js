import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        "plugins-antifakecode-index": "正品查询"
    }
};
var en = {
    pages: {
        "plugins-antifakecode-index": "Authenticity check"
    }
};
var spa = {
    pages: {
        "plugins-antifakecode-index": "Consulta de autenticidad"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

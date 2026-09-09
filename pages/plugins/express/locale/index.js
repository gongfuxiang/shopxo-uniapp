import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-express-detail": "物流详情"
    },
    "detail": {
        "there_currently_logistics_info_available": "暂无物流信息"
    }
};
var en = {
    "pages": {
        "plugins-express-detail": "Logistics details"
    },
    "detail": {
        "there_currently_logistics_info_available": "There is currently no logistics info available"
    }
};
var spa = {
    "pages": {
        "plugins-express-detail": "Detalles de logística"
    },
    "detail": {
        "there_currently_logistics_info_available": "No hay información de logística disponible"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

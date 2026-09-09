import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-label-detail": "标签详情"
    },
    "detail": {
        "related_products_2": "条相关商品",
        "label_data_does_exist": "标签数据不存在"
    }
};
var en = {
    "pages": {
        "plugins-label-detail": "Label details"
    },
    "detail": {
        "related_products_2": "related goods",
        "label_data_does_exist": "The label data does not exist"
    }
};
var spa = {
    "pages": {
        "plugins-label-detail": "Detalle de etiqueta"
    },
    "detail": {
        "related_products_2": "productos relacionados",
        "label_data_does_exist": "Los datos de la etiqueta no existen"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

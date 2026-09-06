import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-ordergoodsform-order": "商品表单"
    },
    "order": {
        "form_data": "无表单数据"
    }
};
var en = {
    "pages": {
        "plugins-ordergoodsform-order": "Product Form"
    },
    "order": {
        "form_data": "No form data"
    }
};
var spa = {
    "pages": {
        "plugins-ordergoodsform-order": "Formulario de producto"
    },
    "order": {
        "form_data": "Sin datos de formulario"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

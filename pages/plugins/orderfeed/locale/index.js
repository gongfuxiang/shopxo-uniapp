import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-orderfeed-user": "反馈数据列表",
        "plugins-orderfeed-form": "反馈数据"
    },
    "orderfeed-form": {
        "choose_other_products": "选择其他商品",
        "feedback_product": "反馈该商品"
    }
};
var en = {
    "pages": {
        "plugins-orderfeed-user": "Feed List",
        "plugins-orderfeed-form": "Feed Data"
    },
    "orderfeed-form": {
        "choose_other_products": "Choose other products",
        "feedback_product": "Feedback on this product"
    }
};
var spa = {
    "pages": {
        "plugins-orderfeed-user": "Lista de comentarios",
        "plugins-orderfeed-form": "Datos de comentarios"
    },
    "orderfeed-form": {
        "choose_other_products": "Elegir otro producto",
        "feedback_product": "Comentar este producto"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

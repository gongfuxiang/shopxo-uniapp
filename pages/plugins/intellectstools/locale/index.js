import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-intellectstools-goods-comments": "商品评价"
    },
    "form": {
        "add_image": "添加图片("
    }
};
var en = {
    "pages": {
        "plugins-intellectstools-goods-comments": "Product evaluation"
    },
    "form": {
        "add_image": "Add image（"
    }
};
var spa = {
    "pages": {
        "plugins-intellectstools-goods-comments": "Evaluación del producto"
    },
    "form": {
        "add_image": "Añadir imagen ("
    }
};
export default createPageLocaleMixin({ zh, en, spa });

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
        "related_products_2": "Related products",
        "label_data_does_exist": "The label data does not exist"
    }
};
export default createPageLocaleMixin({ zh, en });

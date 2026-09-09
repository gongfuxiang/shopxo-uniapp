import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-seckill-index": "限时秒杀"
    },
    "index": {
        "about_start_robbery": "即将开抢",
        "second_price_reduction": "秒杀价"
    }
};
var en = {
    "pages": {
        "plugins-seckill-index": "Flash Sale"
    },
    "index": {
        "about_start_robbery": "Coming soon",
        "second_price_reduction": "Flash Price"
    }
};
var spa = {
    "pages": {
        "plugins-seckill-index": "Oferta relámpago"
    },
    "index": {
        "about_start_robbery": "Próximamente",
        "second_price_reduction": "Precio flash"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

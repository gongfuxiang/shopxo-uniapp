import Vue from 'vue';
import App from './App';

// 全局mixins
import base from './common/js/common/base';
import share from './common/js/common/share';

// 多语言引入并初始化
import messages from './lang/index'
import VueI18n from 'vue-i18n';
let i18nConfig = {
    locale: uni.getLocale(),
    silentTranslationWarn: true,
    messages
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

// 全局icon组件
import iconfont from './components/iconfont/iconfont.vue'
Vue.component("iconfont", iconfont);

Vue.mixin(base);
Vue.mixin(share);

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue({
    i18n,
    ...App
});
app.$mount();
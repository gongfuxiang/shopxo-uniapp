import Vue from 'vue';
import App from './App';

// 全局mixins
import base from './common/js/common/base';
import share from './common/js/common/share';

// 多语言引入并初始化
import i18n from './locale/index'

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
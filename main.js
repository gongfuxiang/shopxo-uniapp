import Vue from 'vue';
import App from './App';

// 全局mixins
import base from './common/js/common/base';
import share from './common/js/common/share';
Vue.mixin(base);
Vue.mixin(share);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
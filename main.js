import Vue from 'vue';
import App from './App';

// 全局mixins
import base from './common/js/common/base';
import share from './common/js/common/share';

import iconfont from './components/iconfont/iconfont.vue'
Vue.mixin(base);
Vue.mixin(share);

Vue.config.productionTip = false;
// 注册到全局
Vue.component("iconfont", iconfont);
App.mpType = 'app';

const app = new Vue({
	...App
});
app.$mount();
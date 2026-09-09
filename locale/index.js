import VueI18n from 'vue-i18n';
import Vue from 'vue';

import zh from './zh.json';
import en from './en.json';

let i18nConfig = {
    locale: uni.getLocale() || 'zh',
    fallbackLocale: 'zh',
    silentTranslationWarn: true,
    messages: {
        "zh": zh,
        "zh-Hans": zh,
        "zh-CN": zh,
        "en": en,
        "en-US": en
    }
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.prototype._i18n = i18n
// 挂到 uni 全局，避免分包复制 Vue 后 Vue.prototype._i18n 不是同一份
try {
    uni.$shopxoI18n = i18n
} catch (e) {}
export default i18n

import VueI18n from 'vue-i18n';
import Vue from 'vue';

import zh from './zh.json';
import en from './en.json';

let i18nConfig = {
    locale: uni.getLocale(),
    silentTranslationWarn: true,
    messages: {
        "zh": zh,
        "en": en
    }
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.prototype._i18n = i18n
export default i18n

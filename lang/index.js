import VueI18n from 'vue-i18n';
import Vue from 'vue';

import zhHans from './zh.json'
import zhHant from './cht.json'
import en from './en.json'
import spa from './spa.json'

let i18nConfig = {
    locale: uni.getLocale(),
    silentTranslationWarn: true,
    messages: {
        "zh-Hans": zhHans,
        "zh-Hant": zhHant,
        "en": en,
        "es": spa
    }
}
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.prototype._i18n = i18n
export default i18n

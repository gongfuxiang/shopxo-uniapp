import Vue from 'vue';

/**
 * 分包/页面语言包合并到【主包真正在用的】vue-i18n。
 * 微信分包会复制主包 JS，Vue.prototype._i18n 可能是另一份空实例；
 * 必须优先用 uni.$shopxoI18n / getApp().$i18n，否则 $t 仍读不到分包 key。
 */
var LOCALE_ALIAS = {
    zh: ['zh', 'zh-Hans', 'zh-CN'],
    en: ['en', 'en-US'],
    spa: ['spa', 'es']
};

function getGlobalI18n() {
    if (typeof uni !== 'undefined' && uni.$shopxoI18n) {
        return uni.$shopxoI18n;
    }
    try {
        var app = typeof getApp === 'function' ? getApp() : null;
        if (app) {
            if (app.$i18n) {
                return app.$i18n;
            }
            if (app.$vm && app.$vm.$i18n) {
                return app.$vm.$i18n;
            }
        }
    } catch (e) {}
    return (Vue.prototype && Vue.prototype._i18n) || null;
}

export function createPageLocaleMixin(packs) {
    packs = packs || {};
    var merged = false;

    function apply() {
        if (merged) {
            return;
        }
        var i18n = getGlobalI18n();
        if (!i18n || typeof i18n.mergeLocaleMessage != 'function') {
            return;
        }
        Object.keys(LOCALE_ALIAS).forEach(function (pack) {
            var msg = packs[pack];
            if (!msg) {
                return;
            }
            LOCALE_ALIAS[pack].forEach(function (locale) {
                i18n.mergeLocaleMessage(locale, msg);
            });
        });
        var current = i18n.locale;
        if (current) {
            var currentPack = packs.zh;
            if (current.indexOf('en') === 0) {
                currentPack = packs.en || currentPack;
            } else if (current === 'spa' || current.indexOf('es') === 0) {
                currentPack = packs.spa || currentPack;
            } else if (current.indexOf('zh') !== 0) {
                currentPack = packs[current] || currentPack;
            }
            if (currentPack) {
                i18n.mergeLocaleMessage(current, currentPack);
            }
        }
        merged = true;
    }

    apply();

    return {
        beforeCreate() {
            apply();
        },
        created() {
            apply();
        }
    };
}

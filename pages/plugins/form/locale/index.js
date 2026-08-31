var zh = {
    "pages": {},
    "form": {
        "provide_detailed_description_problem_answer_soon": "请详细描述问题，我们将尽快为您解答！"
    }
};
var en = {
    "pages": {},
    "form": {
        "provide_detailed_description_problem_answer_soon": "Please provide a detailed description of the problem, and we will answer it as soon as possible!"
    }
};
var merged = false;
function usePluginLocale(i18n) {
    if (merged || !i18n || typeof i18n.mergeLocaleMessage != 'function') {
        return;
    }
    merged = true;
    i18n.mergeLocaleMessage('zh', zh);
    i18n.mergeLocaleMessage('zh-Hans', zh);
    i18n.mergeLocaleMessage('en', en);
}

export default {
    beforeCreate() {
        usePluginLocale(this.$i18n);
    }
};

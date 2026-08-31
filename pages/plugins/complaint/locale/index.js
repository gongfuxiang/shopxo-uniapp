var zh = {
    "pages": {
        "plugins-complaint-form": "投诉/举报",
        "plugins-complaint-user": "投诉/举报列表"
    },
    "complaint-form": {
        "complaint_report_type": "投诉/举报类型",
        "select_type_complaint_report": "请选择投诉/举报类型",
        "proof_image": "证明图片"
    }
};
var en = {
    "pages": {
        "plugins-complaint-form": "Complaint/Report",
        "plugins-complaint-user": "Complaint/Report List"
    },
    "complaint-form": {
        "complaint_report_type": "Complaint/Report Type",
        "select_type_complaint_report": "Please select the type of complaint/report",
        "proof_image": "proof image"
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

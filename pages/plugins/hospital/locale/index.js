var zh = {
    "pages": {
        "plugins-hospital-patient": "就诊人添加/编辑",
        "plugins-hospital-patient-list": "就诊人列表",
        "plugins-hospital-prescription": "问诊开方"
    },
    "hospital-patient": {
        "fill_allergy_history": "请填写过敏史",
        "fill_disease_history": "请填写疾病史"
    },
    "hospital": {
        "add_patient": "添加就诊人",
        "medicine_user": "用药人",
        "switch_patient": "切换用药人",
        "select_patient": "选择用药人",
        "chief_complaint": "主诉",
        "chief_complaint_example": "例如: 感冒, 胃炎, 头疼, 肚子疼",
        "chief_complaint_length": "主诉格式1～230个字符",
        "free_consult": "免费问诊开方",
        "please_select_patient": "请选择就诊人",
        "real_name": "真实姓名",
        "mobile": "手机号码",
        "gender": "性别",
        "please_select_gender": "请选择请别",
        "age": "年龄",
        "weight": "体重",
        "health_info": "健康信息",
        "health_info_placeholder": "可填写健康信息",
        "relation_tag": "关系标签",
        "relation_tag_placeholder": "可选择关系标签",
        "allergy_history": "过敏史",
        "sickness_history": "疾病史",
        "liver_abnormal": "肝功能异常",
        "kidney_abnormal": "肾功能异常",
        "pregnancy": "妊娠哺乳",
        "allergy_history_label": "过敏史:",
        "no_allergy": "无过敏史",
        "sickness_history_label": "疾病史:",
        "no_sickness": "无疾病史",
        "no_liver_issue": "无肝功能",
        "no_kidney_issue": "无肾功能",
        "pregnancy_label": "妊娠哺乳:",
        "id_number": "身份证号码"
    }
};
var en = {
    "pages": {
        "plugins-hospital-patient": "Add/Edit Patient",
        "plugins-hospital-patient-list": "Patient List",
        "plugins-hospital-prescription": "Consultation and prescription"
    },
    "hospital-patient": {
        "fill_allergy_history": "Please fill in allergy history",
        "fill_disease_history": "Please fill in disease history"
    },
    "hospital": {
        "add_patient": "Add patient",
        "medicine_user": "Patient",
        "switch_patient": "Switch patient",
        "select_patient": "Select patient",
        "chief_complaint": "Chief complaint",
        "chief_complaint_example": "e.g. cold, gastritis, headache",
        "chief_complaint_length": "1-230 characters",
        "free_consult": "Free consultation",
        "please_select_patient": "Please select patient",
        "real_name": "Real name",
        "mobile": "Mobile",
        "gender": "Gender",
        "please_select_gender": "Please select gender",
        "age": "Age",
        "weight": "Weight",
        "health_info": "Health info",
        "health_info_placeholder": "Enter health info",
        "relation_tag": "Relation tag",
        "relation_tag_placeholder": "Select relation tag",
        "allergy_history": "Allergy history",
        "sickness_history": "Medical history",
        "liver_abnormal": "Liver abnormality",
        "kidney_abnormal": "Kidney abnormality",
        "pregnancy": "Pregnancy/nursing",
        "allergy_history_label": "Allergy history",
        "no_allergy": "No allergy history",
        "sickness_history_label": "Medical history",
        "no_sickness": "No medical history",
        "no_liver_issue": "No liver issue",
        "no_kidney_issue": "No kidney issue",
        "pregnancy_label": "Pregnancy/nursing",
        "id_number": "ID number"
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

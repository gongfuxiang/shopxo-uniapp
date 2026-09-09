import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "user-address-save": "地址编辑"
    },
    "user-address-save": {
        "label": "标签",
        "address_id_incorrect": "地址ID有误",
        "region": "地区",
        "click_select_geographical_location": "点击选择地理位置",
        "retrieval": "检索",
        "address": "地址",
        "scan": "识别",
        "address_pasting_board": "地址粘贴板",
        "default_address": "设为默认地址",
        "id_card_name": "身份证姓名",
        "id": "身份证号码",
        "id_card_photo": "身份证照片",
        "fill_original_id_card_shooting_clear": "请填使用身份证原件进行拍摄，图片清晰",
        "contact_person_16": "联系人2~16个字符",
        "number": "地址编号",
        "detailed_address_80": "详细地址1~80个字符",
        "paste_entire_address_segment_automatically_split": "粘贴整段地址，自动拆分姓名、电话及地址",
        "enter_label_name": "请输入标签名称",
        "fill_real_name": "请填写真实姓名",
        "fill_id_number_number": "请填写身份证号",
        "home": "家",
        "company": "公司",
        "school": "学校",
        "province_info_failed": "省份信息失败",
        "form_name_type_incorrect": "表单名称类型有误",
        "enter_address_info_first": "请先输入地址信息",
        "fill_id_card_name": "请填写身份证姓名",
        "fill_id_card_number": "请填写身份证号码",
        "upload_photo_front_id_card": "请上传身份证正面照片",
        "upload_photo_back_id_card": "请上传身份证背面照片",
        "enter_data": "请输入数据"
    }
};
var en = {
    "pages": {
        "user-address-save": "Address editing"
    },
    "user-address-save": {
        "label": "label",
        "address_id_incorrect": "The address ID is incorrect",
        "region": "region",
        "click_select_geographical_location": "Click to select geographical location",
        "retrieval": "retrieval",
        "address": "address",
        "scan": "Scan",
        "address_pasting_board": "Address Pasting Board",
        "default_address": "default address",
        "id_card_name": "ID card name",
        "id": "ID No",
        "id_card_photo": "ID card photo",
        "fill_original_id_card_shooting_clear": "Please fill in the original ID card for shooting, with clear images",
        "contact_person_16": "Contact person 2~16",
        "number": "Number",
        "detailed_address_80": "Detailed address of 1-80",
        "paste_entire_address_segment_automatically_split": "Paste the entire address segment, automatically split the name, phone number, and address",
        "enter_label_name": "Please enter the label name",
        "fill_real_name": "Please fill in your real name",
        "fill_id_number_number": "Please fill in the ID number number",
        "home": "home",
        "company": "company",
        "school": "school",
        "province_info_failed": "Province info failed",
        "form_name_type_incorrect": "The form name type is incorrect",
        "enter_address_info_first": "Please enter the address info first",
        "fill_id_card_name": "Please fill in your ID card name",
        "fill_id_card_number": "Please fill in the ID card number",
        "upload_photo_front_id_card": "Please upload a photo of the front of your ID card",
        "upload_photo_back_id_card": "Please upload a photo of the back of your ID card",
        "enter_data": "Please enter data"
    }
};
export default createPageLocaleMixin({ zh, en });

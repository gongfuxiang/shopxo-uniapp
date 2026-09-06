import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-imagesearch-index": "以图搜款"
    },
    "imagesearch": {
        "upload_image": "上传图片",
        "change_image": "换图",
        "similar_goods": "相似商品",
        "total_prefix": "共 ",
        "total_suffix": " 件",
        "boot_title": "上传图片，找同款商品",
        "boot_desc": "支持商品主图、实拍图，智能识别后匹配相似商品",
        "upload_search": "上传图片搜同款",
        "boot_step1": "上传图片",
        "boot_step2": "智能识图",
        "boot_step3": "匹配同款",
        "empty_tips": "暂无相似商品，请换一张图试试",
        "image_fail": "图片处理失败，请重试",
        "confirm_title": "确定搜索这张图片吗？",
        "recognizing_title": "智能识图中",
        "recognizing_btn": "正在识别图片..."
    }
};
var en = {
    "pages": {
        "plugins-imagesearch-index": "Image Search"
    },
    "imagesearch": {
        "upload_image": "Upload image",
        "change_image": "Change",
        "similar_goods": "Similar goods",
        "total_prefix": "",
        "total_suffix": " items",
        "boot_title": "Upload a photo to find similar items",
        "boot_desc": "Product or real photos work. We match similar goods for you.",
        "upload_search": "Search by image",
        "boot_step1": "Upload",
        "boot_step2": "Recognize",
        "boot_step3": "Match",
        "empty_tips": "No similar goods found. Try another image.",
        "image_fail": "Failed to process image",
        "confirm_title": "Search with this image?",
        "recognizing_title": "Recognizing",
        "recognizing_btn": "Recognizing image..."
    }
};
export default createPageLocaleMixin({ zh, en });

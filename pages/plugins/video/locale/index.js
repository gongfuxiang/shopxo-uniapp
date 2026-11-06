import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-video-index": "短视频列表",
        "plugins-video-detail": "短视频详情",
        "plugins-video-search": "短视频搜索",
        "plugins-video-search-record": "短视频搜索记录",
        "plugins-video-user-list": "我的短视频",
        "plugins-video-form": "发布短视频"
    },
    "user-list": {
        "sure_want_delete_video": "确定要删除这条短视频吗？",
        "sure_want_submit_audit": "提交后将进入平台审核，确定提审吗？",
        "sure_want_revoke_audit": "确定要撤审吗？",
        "submit_audit": "提审",
        "revoke_audit": "撤审",
        "enabled": "已启用",
        "disabled": "未启用"
    },
    "form": {
        "cover_photo": "封面图片",
        "video_file": "视频文件",
        "upload_video": "上传视频",
        "duration": "时长(分钟)",
        "duration_placeholder": "请输入时长",
        "video_category": "视频分类",
        "select": "请选择",
        "enter_title": "请输入标题",
        "select_category": "请选择分类",
        "select_video": "请上传视频",
        "select_cover": "请上传封面",
        "enter_duration": "请输入时长",
        "related_goods": "关联商品",
        "select_goods": "+ 选择商品",
        "search_goods_first": "请先搜索商品",
        "searching": "搜索中..."
    },
    "video-detail": {
        "reason_reporting": "举报原因",
        "choose_specific_type": "请选择具体的类型",
        "enter_wonderful_comment": "请输入您的精彩评论",
        "already_first_video": "已经是第一个视频了",
        "already_last_video": "已经是最后一个视频了"
    },
    "video-search": {
        "release_time": "发布时间",
        "video_duration": "视频时长"
    }
};
var en = {
    "pages": {
        "plugins-video-index": "Short Videos",
        "plugins-video-detail": "Video Details",
        "plugins-video-search": "Search Videos",
        "plugins-video-search-record": "Search History",
        "plugins-video-user-list": "My Short Videos",
        "plugins-video-form": "Publish Short Video"
    },
    "user-list": {
        "sure_want_delete_video": "Are you sure you want to delete this video?",
        "sure_want_submit_audit": "This will be submitted for platform review. Continue?",
        "sure_want_revoke_audit": "Revoke this audit submission?",
        "submit_audit": "Submit",
        "revoke_audit": "Revoke",
        "enabled": "Enabled",
        "disabled": "Not enabled"
    },
    "form": {
        "cover_photo": "Cover image",
        "video_file": "Video file",
        "upload_video": "Upload video",
        "duration": "Duration (min)",
        "duration_placeholder": "Enter duration",
        "video_category": "Video category",
        "select": "Please select",
        "enter_title": "Please enter a title",
        "select_category": "Please select a category",
        "select_video": "Please upload a video",
        "select_cover": "Please upload a cover",
        "enter_duration": "Please enter duration",
        "related_goods": "Related goods",
        "select_goods": "+ Select goods",
        "search_goods_first": "Please search for goods first",
        "searching": "Searching..."
    },
    "video-detail": {
        "reason_reporting": "Report reason",
        "choose_specific_type": "Please select a specific type",
        "enter_wonderful_comment": "Write a comment",
        "already_first_video": "This is already the first video",
        "already_last_video": "This is already the last video"
    },
    "video-search": {
        "release_time": "Publish time",
        "video_duration": "Video duration"
    }
};
export default createPageLocaleMixin({ zh, en });

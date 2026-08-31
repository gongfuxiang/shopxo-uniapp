var zh = {
    "pages": {
        "plugins-blog-index": "博客",
        "plugins-blog-search": "博文搜索",
        "plugins-blog-detail": "博文详情",
        "plugins-blog-comments": "评论列表",
        "plugins-blog-user-list": "我的帖子",
        "plugins-blog-form": "发布博文"
    },
    "user-list": {
        "sure_want_delete_post": "确定要删除这条帖子吗？"
    },
    "detail": {
        "recommendation": "推荐",
        "related_products": "相关商品",
        "bowen": "博文",
        "release": "发布"
    },
    "form": {
        "cover_photo": "封面图片",
        "seo_title": "SEO标题",
        "seo_keywords": "SEO关键字",
        "seo_description": "SEO描述",
        "post_classification": "帖子分类",
        "select": "请选择",
        "pack_up_more": "收起更多",
        "expand_more": "展开更多",
        "enter_title": "请输入标题",
        "select_category": "请选择分类",
        "enter_content": "请输入内容"
    },
    "user-detail": {
        "content": "内容"
    }
};
var en = {
    "pages": {
        "plugins-blog-index": "Blog",
        "plugins-blog-search": "Blog search",
        "plugins-blog-detail": "Blog details",
        "plugins-blog-comments": "Comment List",
        "plugins-blog-user-list": "My post",
        "plugins-blog-form": "Posting a blog post"
    },
    "user-list": {
        "sure_want_delete_post": "Are you sure you want to delete this post?"
    },
    "detail": {
        "recommendation": "recommendation",
        "related_products": "Related products",
        "bowen": "Bowen",
        "release": "release"
    },
    "form": {
        "cover_photo": "cover photo",
        "seo_title": "SEO Title",
        "seo_keywords": "SEO keywords",
        "seo_description": "SEO Description",
        "post_classification": "Post classification",
        "select": "Please select",
        "pack_up_more": "Pack up more",
        "expand_more": "Expand more",
        "enter_title": "Please enter a title",
        "select_category": "Please select a category",
        "enter_content": "Please enter the content"
    },
    "user-detail": {
        "content": "content"
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

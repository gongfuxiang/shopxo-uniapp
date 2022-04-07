export default {
    data(){
        return {
            // 设置默认的分享参数、页面可自定义以下数据
            // 如果页面不设置share，就触发这个默认的分享
            // 标题、关键字、描述、地址、参数、封面图片、视频
            share_info: {
                title: '',
                kds: '',
                desc: '',
                path: '',
                query: '',
                img: '',
                video: ''
            }
        }
    },

    // 分享给好友
    onShareAppMessage() {
        var app = getApp();
        var share = app.globalData.share_content_handle(this.share_info || {});
        var data = {
            title: share.title,
            desc: share.desc,
            path: share.path + share.query
        }
        if(app.globalData.data.is_share_use_image == 1) {
            data['imageUrl'] = share.img;
        }
        return data;
    },

    // 分享朋友圈
    onShareTimeline() {
        var app = getApp();
        var share = app.globalData.share_content_handle(this.share_info || {});
        var data = {
            title: share.title,
            query: ((share.query || null) != null && share.query.substr(0, 1) == '?') ? share.query.slice(1) : share.query
        };
        if(app.globalData.data.is_share_use_image == 1) {
            data['imageUrl'] = share.img;
        }
        return data;
    }
}
<template>
    <view>
        <view v-if="(data || null) != null && (data_base || null) != null" class="padding-vertical-main">
            <view class="padding-horizontal-main">
                <!-- 点赞、评论、分享 -->
                <view v-if="propType == 'detail'" class="tc padding-vertical-main blog-comments-bottom-container">
                    <view v-if="(data_base.is_blog_comments_show || 0) == 1" class="item dis-inline-block" :data-value="'/pages/plugins/blog/comments/comments?id='+data.id" @tap="url_event">
                        <view class="va-m dis-inline-block">
                            <uni-icons type="chat" size="30rpx" color="#999"></uni-icons>
                        </view>
                        <text class="cr-gray va-m text-size-xs">评论({{data.comments_count}})</text>
                    </view>
                    <view v-if="(data_base.is_blog_give_thumbs || 0) == 1" class="item dis-inline-block" :data-blogid="data.id" @tap="give_thumbs_event">
                        <view class="va-m dis-inline-block">
                            <uni-icons type="hand-up" size="30rpx" :styleClass="'cr-'+((data.is_give_thumbs || 0) == 1 ? 'main' : 'gray')"></uni-icons>
                        </view>
                        <text :class="'va-m text-size-xs cr-'+((data.is_give_thumbs || 0) == 1 ? 'main' : 'gray')">点赞({{data.give_thumbs_count}})</text>
                    </view>
                    <view class="item dis-inline-block" @tap="popup_share_event">
                        <view class="va-m dis-inline-block">
                            <uni-icons type="redo" size="30rpx" color="#999"></uni-icons>
                        </view>
                        <text class="cr-gray va-m text-size-xs">分享</text>
                    </view>
                </view>
                <!-- 评论回复表单 -->
                <view v-if="(data_base.is_blog_comments_add || 0) == 1 && !input_comments_modal_status" class="padding-top-lg margin-bottom-xl oh padding-bottom-xl blog-comments-reply-container">
                    <image :src="avatar" mode="aspectFill" class="user-avatar fl circle"></image>
                    <view class="right-base fr">
                        <view class="bg-white border-radius-main padding-main">
                            <textarea placeholder="期待您的发言..." placeholder-class="cr-grey" class="wh-auto" :value="input_comments_value" :maxlength="input_comments_length_max" @input="comments_input_event" @blur="comments_input_event"></textarea>
                        </view>
                        <view class="margin-top-lg oh">
                            <image :src="common_static_url+'emoji-icon.png'" mode="aspectFill" class="emoji-icon va-m" @tap="emoji_event"></image>
                            <view class="fr">
                                <text class="va-m text-size-xs cr-grey margin-right-lg">剩余{{input_comments_length_value}}字</text>
                                <button type="default" size="mini" class="bg-main br-main cr-white round text-size-xs va-m" @tap="comments_event">评论</button>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 评论回复内容 -->
                <view v-if="(data_base.is_blog_comments_show || 0) == 1 && (data.comments_list || null) != null && data.comments_list.length > 0" class="blog-comments-list bg-white border-radius-main margin-bottom-xxxl">
                    <block v-for="(item, index) in data.comments_list" :key="index">
                        <view class="item oh padding-horizontal-main padding-top-xxl padding-bottom-xxl text-size-xs">
                            <image :src="item.user.avatar" mode="aspectFill" class="user-avatar circle fl"></image>
                            <view class="fr right-content">
                                <view class="comments-base oh">
                                    <span class="username cr-base">{{item.user.user_name_view}}</span>
                                    <span class="cr-grey margin-left-lg">{{item.add_time}}</span>
                                    <view class="fr blog-comments-right-content-operate">
                                        <view v-if="(data_base.is_blog_comments_show || 0) == 1" class="item dis-inline-block" :data-index="index" :data-username="item.user.user_name_view" :data-blogcommentsid="item.id" @tap="modal_open_event">
                                            <view class="va-m dis-inline-block">
                                                <uni-icons type="chat" size="30rpx" color="#999"></uni-icons>
                                            </view>
                                            <text class="cr-gray va-m">回复({{item.comments_count}})</text>
                                        </view>
                                        <view v-if="(data_base.is_blog_give_thumbs || 0) == 1" class="item dis-inline-block">
                                            <view class="va-m dis-inline-block">
                                                <uni-icons type="hand-up" size="30rpx" :styleClass="'cr-'+((item.is_give_thumbs || 0) == 1 ? 'main' : 'gray')"></uni-icons>
                                            </view>
                                            <text :class="'va-m cr-'+((item.is_give_thumbs || 0) == 1 ? 'main' : 'gray')" data-type="1" :data-index="index" :data-blogid="item.blog_id" :data-blogcommentsid="item.id" @tap="give_thumbs_event">点赞({{item.give_thumbs_count}})</text>
                                        </view>
                                    </view>
                                </view>
                                <view class="margin-top-xs cr-base comments-content">{{item.content}}</view>
                                <view v-if="(item.reply_comments_list || null) != null && item.reply_comments_list.length > 0" class="reply-blog-comments-list">
                                    <block v-for="(comments, index2) in item.reply_comments_list" :key="index2">
                                        <view class="item margin-top-xl padding-bottom-lg oh">
                                            <image :src="comments.user.avatar" mode="aspectFill" class="user-avatar circle fl"></image>
                                            <view class="fr right-content">
                                                <view class="comments-reply-base oh">
                                                    <span class="username cr-base">{{comments.user.user_name_view}}</span>
                                                    <span class="cr-grey margin-left-sm">{{comments.add_time}}</span>
                                                    <view class="fr blog-comments-right-content-operate">
                                                        <view v-if="(data_base.is_blog_comments_show || 0) == 1" class="item dis-inline-block" :data-index="index" :data-username="comments.user.user_name_view" :data-blogcommentsid="comments.blog_comments_id" :data-replycommentsid="comments.id" @tap="modal_open_event">
                                                            <view class="va-m dis-inline-block">
                                                                <uni-icons type="chat" size="30rpx" color="#999"></uni-icons>
                                                            </view>
                                                            <text class="cr-gray va-m text-size-xs">回复({{comments.comments_count}})</text>
                                                        </view>
                                                        <view v-if="(data_base.is_blog_give_thumbs || 0) == 1" class="item dis-inline-block">
                                                            <view class="va-m dis-inline-block">
                                                                <uni-icons type="hand-up" size="30rpx" :styleClass="'cr-'+((comments.is_give_thumbs || 0) == 1 ? 'main' : 'gray')"></uni-icons>
                                                            </view>
                                                            <text :class="'va-m cr-'+((comments.is_give_thumbs || 0) == 1 ? 'main' : 'gray')" data-type="2" :data-index="index" :data-indexs="index2" :data-blogid="comments.blog_id" :data-blogcommentsid="comments.id" :data-replycommentsid="comments.blog_comments_id" @tap="give_thumbs_event">点赞({{comments.give_thumbs_count}})</text>
                                                        </view>
                                                    </view>
                                                </view>
                                                <view v-if="(comments.reply_comments_text || null) != null" class="margin-top-sm border-radius-main padding-main reply-content">{{comments.reply_comments_text}}</view>
                                                <view class="margin-top-sm cr-base">{{comments.content}}</view>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                                <view v-if="(item.comments_count || 0) > 0 && (item.is_comments_list_submit == undefined || item.is_comments_list_submit == 1)" class="margin-top-lg">
                                    <text :data-index="index" :data-blogid="item.blog_id" :data-blogcommentsid="item.id" @tap="comments_list_reply_event">
                                        <text v-if="item.is_comments_list_submit == undefined" class="cr-grey">查看全部{{item.comments_count}}条回复</text>
                                        <text v-else class="cr-grey">查看更多回复</text>
                                        <text class="arrow-bottom padding-horizontal-main"></text>
                                    </text>
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-if="((data_base.blog_detail_comments_more_page_number || 0) == 0 && (data.comments_count || 0) > 20) || ((data_base.blog_detail_comments_more_page_number || 0) > 0 && data.comments_count > data_base.blog_detail_comments_more_page_number)">
                        <view v-if="propType == 'detail'" class="margin-top-xxl tc padding-bottom-xxl">
                            <text :data-value="'/pages/plugins/blog/comments/comments?id='+data.id" @tap="url_event">
                                <text class="cr-base fw-b">查看全部{{data.comments_count}}条评论</text>
                                <text class="arrow-right padding-horizontal-main"></text>
                            </text>
                        </view>
                        <view v-if="propType == 'comments' && (data.is_comments_list_submit == undefined || data.is_comments_list_submit == 1)" class="margin-top-xxl tc padding-bottom-xxl">
                            <text :data-blogid="data.id" @tap="comments_list_reply_event">
                                <text class="cr-base fw-b">查看更多评论</text>
                                <text class="arrow-bottom padding-horizontal-main"></text>
                            </text>
                        </view>
                    </block>
                </view>
            </view>
            <!-- 回复弹窗 -->
            <view v-if="input_comments_modal_status" class="blog-comments-modal pf">
                <view class="blog-comments-modal-content bg-white border-radius-main pr">
                    <view class="tc margin-bottom-lg">
                        <text>回复 @{{input_comments_modal_username}}</text>
                        <view class="close pa">
                            <view @tap.stop="modal_close_event">
                                <icon type="clear" size="20"></icon>
                            </view>
                        </view>
                    </view>
                    <textarea placeholder="期待您的发言..." placeholder-class="cr-grey" class="wh-auto br padding-main" :value="input_comments_value" :maxlength="input_comments_length_max" @input="comments_input_event" @blur="comments_input_event"></textarea>
                    <view class="margin-top-lg oh">
                        <image :src="common_static_url+'emoji-icon.png'" mode="aspectFill" class="emoji-icon va-m" @tap="emoji_event"></image>
                        <view class="fr">
                            <text class="va-m text-size-xs cr-grey margin-right-lg">剩余{{input_comments_length_value}}字</text>
                            <button type="default" size="mini" class="bg-main br-main cr-white round text-size-xs va-m" @tap="comments_event">评论</button>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 表情弹窗 -->
            <component-emoji-popup ref="emoji" v-on:choiceConfirmEvent="emoji_choice_confirm_event"></component-emoji-popup>

            <!-- 分享弹窗 -->
            <component-share-popup ref="share"></component-share-popup>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    import componentPopup from "../../components/popup/popup";
    import componentSharePopup from "../../components/share-popup/share-popup";
    import componentEmojiPopup from "../../components/emoji-popup/emoji-popup";
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                avatar: app.globalData.data.default_user_head_src,
                user: null,
                data_base: null,
                data: null,
                emoji_list: [],
                input_comments_value: '',
                input_comments_cursor: 0,
                input_comments_length_value: 500,
                input_comments_length_max: 500,
                input_comments_modal_status: false,
                input_comments_modal_index: 0,
                input_comments_modal_username: '',
                input_comments_modal_blog_comments_id: 0,
                input_comments_modal_reply_comments_id: 0
            };
        },
        props: {
            propType: {
            	type: String,
            	default: 'detail'
            },
            propData: {
            	type: [Object,null],
            	default: null
            },
            propDataBase: {
            	type: [Object,null],
            	default: null
            },
            propEmojiList: {
            	type: [Array,null],
            	default: []
            }
        },
        components: {
            componentPopup,
            componentSharePopup,
            componentEmojiPopup
        },

        // 页面被展示
        created: function(e) {
            var avatar = app.globalData.data.default_user_head_src;
            var user = app.globalData.get_user_cache_info() || null;
            this.setData({
                user: user,
                avatar: (user == null) ? avatar : (user.avatar || avatar),
                data: this.propData,
                data_base: this.propDataBase,
                emoji_list: this.propEmojiList
            });
        },

        methods: {
            // 分享开启弹层
            popup_share_event(e) {
                if((this.$refs.share || null) != null) {
                    this.$refs.share.init();
                }
            },

            // 评论弹窗关闭
            modal_close_event(e) {
                this.setData({
                    input_comments_modal_status: false,
                    input_comments_modal_index: 0,
                    input_comments_modal_username: '',
                    input_comments_modal_blog_comments_id: 0,
                    input_comments_modal_reply_comments_id: 0
                });
            },

            // 评论弹窗开启
            modal_open_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info();
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=favor_event"
                        });
                        return false;
                    } else {
                        var index = parseInt(e.currentTarget.dataset.index || 0);
                        var username = e.currentTarget.dataset.username;
                        var blog_comments_id = e.currentTarget.dataset.blogcommentsid || 0;
                        var reply_comments_id = e.currentTarget.dataset.replycommentsid || 0;
                        this.setData({
                            input_comments_modal_status: true,
                            input_comments_modal_index: index,
                            input_comments_modal_username: username,
                            input_comments_modal_blog_comments_id: blog_comments_id,
                            input_comments_modal_reply_comments_id: reply_comments_id
                        });
                    }
                }
            },

            // 表情选择事件
            emoji_event() {
                if(this.input_comments_length_value == 0) {
                    app.globalData.showToast('已超过最大输入字符限制');
                    return false;
                }
                if((this.$refs.emoji || null) != null) {
                    this.$refs.emoji.init({emoji_list: this.emoji_list});
                }
            },
            
            // 评论输入和失去焦点事件
            comments_input_event(e) {
                var value = e.detail.value.trim();
                var length = this.input_comments_length_max-value.length;
                this.setData({
                    input_comments_cursor: e.detail.cursor || 0,
                    input_comments_value: value,
                    input_comments_length_value: (length <= 0) ? 0 : length
                });
            },
            
            // 表情选择确认事件
            emoji_choice_confirm_event(emoji) {
                var value = this.input_comments_value;
                var cursor = parseInt(this.input_comments_cursor || 0);
                if(value != '') {
                    if(cursor == 0) {
                        value = emoji+value;
                    } else {
                        var first = value.substr(0, cursor);
                        var last = value.substr(cursor, value.length);
                        value = first+emoji+last;
                    }
                } else {
                    value = emoji;
                }
                var length = this.input_comments_length_max-value.length;
                this.setData({
                    input_comments_value: value,
                    input_comments_length_value: (length <= 0) ? 0 : length
                });
            },

            // 获取评论列表
            comments_list_reply_event(e) {
                var temp_data = this.data;
                var page = 1;
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var blog_id = e.currentTarget.dataset.blogid;
                var blog_comments_id = e.currentTarget.dataset.blogcommentsid || 0;
                if(blog_comments_id == 0) {
                    if((temp_data['page'] || null) == null) {
                        temp_data['page'] = 1;
                    } else {
                        temp_data['page'] += 1;
                    }
                    page = temp_data['page'];
                } else {
                    if((temp_data['comments_list'][index]['page'] || null) == null) {
                        temp_data['comments_list'][index]['page'] = 1;
                    } else {
                        temp_data['comments_list'][index]['page'] += 1;
                    }
                    page = temp_data['comments_list'][index]['page'];
                }
                uni.showLoading({
                    title: '加载中...'
                });
                uni.request({
                    url: app.globalData.get_request_url("commentsreplylist", "index", "blog"),
                    method: 'POST',
                    data: {
                        blog_id: blog_id,
                        blog_comments_id: blog_comments_id,
                        page: page
                    },
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            if(blog_comments_id == 0) {
                                var temp_list = temp_data['comments_list'] || [];
                            } else {
                                var temp_list = temp_data['comments_list'][index]['reply_comments_list'] || [];
                            }
                            var data = res.data.data.data;
                            for (var i in data) {
                                temp_list.push(data[i]);
                            }
                            if(blog_comments_id == 0) {
                                temp_data['comments_list'] = temp_list;
                                temp_data['is_comments_list_submit'] = (res.data.data.page >= res.data.data.page_total) ? 0 : 1;
                            } else {
                                temp_data['comments_list'][index]['reply_comments_list'] = temp_list;
                                temp_data['comments_list'][index]['is_comments_list_submit'] = (res.data.data.page >= res.data.data.page_total) ? 0 : 1;
                            }
                            this.setData({data: temp_data});
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    }
                });
            },

            // 评论
            comments_event() {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info();
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=favor_event"
                        });
                        return false;
                    } else {
                        if(this.input_comments_value == '') {
                            app.globalData.showToast('请填写评论内容');
                            return false;
                        }
                        uni.showLoading({
                            title: '提交中...'
                        });
                        uni.request({
                            url: app.globalData.get_request_url("comments", "index", "blog"),
                            method: 'POST',
                            data: {
                                blog_id: this.data.id,
                                content: this.input_comments_value,
                                blog_comments_id: this.input_comments_modal_blog_comments_id,
                                reply_comments_id: this.input_comments_modal_reply_comments_id
                            },
                            dataType: 'json',
                            success: res => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    var temp_data = this.data;
                                    if((this.input_comments_modal_blog_comments_id || 0) == 0) {
                                        var temp_list = temp_data.comments_list || [];
                                        temp_list.splice(0, 0, res.data.data);
                                        temp_data['comments_list'] = temp_list;
                                        temp_data['comments_count'] = parseInt(temp_data['comments_count'])+1;
                                    } else {
                                        var index = this.input_comments_modal_index;
                                        var temp_list = temp_data.comments_list[index]['reply_comments_list'] || [];
                                        temp_list.splice(0, 0, res.data.data);
                                        if((this.input_comments_modal_reply_comments_id || 0) != 0) {
                                            for(var i in temp_list) {
                                                if(temp_list[i]['id'] == this.input_comments_modal_reply_comments_id) {
                                                    temp_list[i]['comments_count'] = parseInt(temp_list[i]['comments_count'])+1;
                                                    break;
                                                }
                                            }
                                        }
                                        temp_data.comments_list[index]['reply_comments_list'] = temp_list;
                                        temp_data.comments_list[index]['comments_count'] = parseInt(temp_data.comments_list[index]['comments_count'])+1;
                                    }
                                    this.setData({
                                        data: temp_data,
                                        input_comments_value: '',
                                        input_comments_length_value: this.input_comments_length_max,
                                        input_comments_modal_status: false
                                    });
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
                }
            },

            // 点赞
            give_thumbs_event(e) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info();
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.navigateTo({
                            url: "/pages/login/login?event_callback=favor_event"
                        });
                        return false;
                    } else {
                        var type = parseInt(e.currentTarget.dataset.type || 0);
                        var blog_id = e.currentTarget.dataset.blogid;
                        var blog_comments_id = e.currentTarget.dataset.blogcommentsid || 0;
                        var reply_comments_id = e.currentTarget.dataset.replycommentsid || 0;
                        uni.request({
                            url: app.globalData.get_request_url("givethumbs", "index", "blog"),
                            method: 'POST',
                            data: {
                                blog_id: blog_id,
                                blog_comments_id: blog_comments_id,
                                reply_comments_id: reply_comments_id
                            },
                            dataType: 'json',
                            success: res => {
                                if (res.data.code == 0) {
                                    var data = res.data.data;
                                    var temp_data = this.data;
                                    switch(type) {
                                        // 博客
                                        case 0 :
                                            temp_data.is_give_thumbs = data.is_active;
                                            temp_data.give_thumbs_count = data.count;
                                            break;
                                        // 博客评论
                                        case 1 :
                                            var index = parseInt(e.currentTarget.dataset.index || 0);
                                            temp_data['comments_list'][index]['is_give_thumbs'] = data.is_active;
                                            temp_data['comments_list'][index]['give_thumbs_count'] = data.count;
                                            break;
                                        // 博客评论回复
                                        case 2 :
                                            var index = parseInt(e.currentTarget.dataset.index || 0);
                                            var indexs = parseInt(e.currentTarget.dataset.indexs || 0);
                                            temp_data['comments_list'][index]['reply_comments_list'][indexs]['is_give_thumbs'] = data.is_active;
                                            temp_data['comments_list'][index]['reply_comments_list'][indexs]['give_thumbs_count'] = data.count;
                                            break;
                                    }
                                    this.setData({data: temp_data});
                                } else {
                                    if (app.globalData.is_login_check(res.data)) {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                }
                            },
                            fail: () => {
                                app.globalData.showToast('服务器请求出错');
                            }
                        });
                    }
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    /**
     * 聚合点赞、评论、分享
     */
    .blog-comments-bottom-container .item:not(:last-child) {
        margin-right: 50rpx;
    }
    .blog-comments-reply-container .emoji-icon,
    .blog-comments-modal .emoji-icon {
        width: 40rpx;
        height: 40rpx !important;
    }
    .blog-comments-reply-container .user-avatar {
        width: 100rpx;
        height: 100rpx !important;
        border:1px solid #eee;
    }
    .blog-comments-reply-container .right-base {
        width: calc(100% - 130rpx);
    }
    .blog-comments-reply-container .right-base textarea {
        height: 120rpx;
    }
    .blog-comments-modal {
        top: 0;
        left: 0;
        width: calc(100% - 80rpx);
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        padding: 40rpx;
        z-index: 10;
    }
    .blog-comments-modal-content {
        padding: 10px;
        border-radius: 10px;
        margin: 0 auto;
        margin-top: 30%;
        max-width: calc(800px - 180rpx);
    }
    .blog-comments-modal-content textarea {
        height: 200rpx;
    }
    .blog-comments-modal-content .close {
        top: 8rpx;
        right: 14rpx;
    }
    
    /**
     * 评论列表
     */
    .blog-comments-list > .item .user-avatar {
        width: 50rpx;
        height: 50rpx;
        border:1px solid #eee;
    }
    .blog-comments-list > .item:not(:last-child) {
        border-bottom: 1px dashed #f6f6f6;
    }
    .blog-comments-list > .item .right-content {
        width: calc(100% - 70rpx);
    }
    .blog-comments-list > .item .right-content .reply-content {
        background: #f3fafc;
        border: 1px solid #e5f6ff;
        color: #617580;
    }
    .blog-comments-right-content-operate > .item:not(:last-child) {
        margin-right: 30rpx;
    }
</style>
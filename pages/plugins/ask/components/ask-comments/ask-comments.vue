<template>
    <view :class="theme_view">
        <view v-if="(data || null) != null && (data_base || null) != null">
            <view class="flex-row jc-sb align-c">
                <view v-if="(data_base.is_ask_comments_show || 0) == 1" class="fw-b">{{$t('user-order-detail.user-order-detail.423rmr')}}{{ data.comments_count || 0 }}{{$t('goods-list.goods-list.8y3cc7')}}</view>
                <!-- 点赞、评论、分享 -->
                <view v-if="propType == 'detail'" class="tr ask-comments-bottom-container cr-base">
                    <view v-if="(data_base.is_ask_comments_show || 0) == 1" class="item dis-inline-block cr-base" :data-value="'/pages/plugins/ask/comments/comments?id=' + data.id" @tap="url_event">
                        <iconfont name="icon-message-square" size="28rpx" propClass="pr top-sm margin-right-xs"></iconfont>
                        <text class="text-size-xs">{{$t('ask-comments.ask-comments.2zlnb5')}}{{ data.comments_count }})</text>
                    </view>
                    <view v-if="(data_base.is_ask_give_thumbs || 0) == 1" :class="'item dis-inline-block cr-' + ((data.is_give_thumbs || 0) == 1 ? 'main' : 'base')" :data-askid="data.id" @tap="give_thumbs_event">
                        <iconfont :name="(data.is_give_thumbs || 0) == 1 ? 'icon-givealike' : 'icon-givealike-o'" size="28rpx" propClass="pr top-sm margin-right-xs"></iconfont>
                        <text class="va-m text-size-xs">{{$t('ask-comments.ask-comments.du7rcv')}}{{ data.give_thumbs_count }})</text>
                    </view>
                    <view class="item dis-inline-block cr-base" @tap="popup_share_event">
                        <iconfont name="icon-share" size="28rpx" propClass="pr top-sm margin-right-xs"></iconfont>
                        <text class="text-size-xs">{{$t('common.share')}}</text>
                    </view>
                </view>
            </view>
            <!-- 评论回复表单 -->
            <view v-if="(data_base.is_ask_comments_add || 0) == 1 && !input_comments_modal_status" class="padding-top-xxxl padding-bottom-xxl ask-comments-reply-container flex-row jc-sb spacing-mb">
                <image :src="avatar" mode="aspectFill" class="user-avatar fl circle"></image>
                <view class="right-base flex-1 flex-width">
                    <view class="comments border-radius-main padding-main">
                        <textarea :placeholder="$t('ask-comments.ask-comments.m67961')" placeholder-class="cr-base" class="textarea wh-auto bg-grey-f8" :value="input_comments_value" :maxlength="input_comments_length_max" @input="comments_input_event" @blur="comments_input_event"></textarea>
                        <view class="oh flex-row jc-sb align-e">
                            <image :src="common_static_url + 'emoji-icon.png'" mode="aspectFill" class="emoji-icon va-m" @tap="emoji_event"></image>
                            <view class="flex-row align-e">
                                <!-- #ifndef MP-ALIPAY -->
                                <text class="text-size-xs cr-grey-d margin-right-sm">{{$t('login.login.n24i5u')}}{{ input_comments_length_value }}{{$t('ask-comments.ask-comments.6l6vz7')}}</text>
                                <!-- #endif  -->
                                <button type="default" size="mini" class="comment-btn cr-white border-radius-sm text-size-md va-m" :class="input_comments_value.length > 0 ? 'bg-main br-main ' : 'comment-btn-default'" @tap="comments_event">{{$t('user-order.user-order.twc3r7')}}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 评论回复内容 -->
            <view v-if="(data_base.is_ask_comments_show || 0) == 1 && (data.comments_list || null) != null && data.comments_list.length > 0" class="ask-comments-list">
                <block v-for="(item, index) in data.comments_list" :key="index">
                    <view class="item oh flex-row jc-sb">
                        <image :src="item.user.avatar" mode="aspectFill" class="user-avatar circle fl"></image>
                        <view class="right-content flex-1 flex-width" :class="data.comments_list.length > index + 1 ? 'br-b-e padding-bottom-main margin-bottom-main' : ''">
                            <view class="comments-base oh">
                                <text class="username fw-b">{{ item.user.user_name_view }}</text>
                                <text class="cr-grey-9 margin-left-main">{{ item.add_time }}</text>
                            </view>
                            <view class="margin-top-sm comments-content">
                                <mp-html :content="item.content" />
                            </view>
                            <view class="ask-comments-right-content-operate margin-top-main flex-row jc-e align-c text-size-xs cr-grey-9">
                                <view v-if="(data_base.is_ask_comments_show || 0) == 1" class="item dis-inline-block" :data-index="index" :data-username="item.user.user_name_view" :data-askcommentsid="item.id" @tap="modal_open_event">
                                    <iconfont name="icon-message-square" size="28rpx" propClass="pr top-md margin-right-xs"></iconfont>
                                    <text class="va-m">{{$t('ask-comments.ask-comments.3fcnme')}}{{ item.comments_count }})</text>
                                </view>
                                <view v-if="(data_base.is_ask_give_thumbs || 0) == 1" :class="'item dis-inline-block margin-left-xxxl padding-left-sm cr-' + ((item.is_give_thumbs || 0) == 1 ? 'main' : '')" data-type="1" :data-index="index" :data-askid="item.ask_id" :data-askcommentsid="item.id" @tap="give_thumbs_event">
                                    <iconfont :name="(item.is_give_thumbs || 0) == 1 ? 'icon-givealike' : 'icon-givealike-o'" size="28rpx" propClass="pr top-md margin-right-xs"></iconfont>
                                    <text class="va-m">{{$t('ask-comments.ask-comments.du7rcv')}}{{ item.give_thumbs_count }})</text>
                                </view>
                            </view>
                            <view v-if="(item.reply_comments_list || null) != null && item.reply_comments_list.length > 0" class="reply-ask-comments-list">
                                <block v-for="(comments, index2) in item.reply_comments_list" :key="index2">
                                    <view class="bg-grey-e">
                                        <view class="item padding-main oh flex-row jc-sb">
                                            <image :src="comments.user.avatar" mode="aspectFill" class="user-avatar circle fl"></image>
                                            <view class="right-content flex-1 flex-width">
                                                <view class="comments-reply-base oh">
                                                    <text class="username fw-b">{{ comments.user.user_name_view }}</text>
                                                    <text class="cr-grey-9 margin-left-main">{{ comments.add_time }}</text>
                                                </view>
                                                <view v-if="(comments.reply_comments_text || null) != null" class="margin-top-sm reply-content">{{ comments.reply_comments_text }}</view>
                                                <view class="margin-top-sm">{{ comments.content }}</view>
                                                <view class="ask-comments-right-content-operate flex-row jc-e align-c text-size-xs cr-grey-9 padding-0">
                                                    <view v-if="(data_base.is_ask_comments_show || 0) == 1" class="item dis-inline-block" :data-index="index" :data-username="comments.user.user_name_view" :data-askcommentsid="comments.ask_comments_id" :data-replycommentsid="comments.id" @tap="modal_open_event">
                                                        <iconfont name="icon-message-square" size="28rpx" propClass="pr top-md margin-right-xs"></iconfont>
                                                        <text class="va-m">{{$t('ask-comments.ask-comments.3fcnme')}}{{ comments.comments_count }})</text>
                                                    </view>
                                                    <view v-if="(data_base.is_ask_give_thumbs || 0) == 1" :class="'item dis-inline-block margin-left-xxxl padding-left-sm cr-' + ((comments.is_give_thumbs || 0) == 1 ? 'main' : '')" data-type="2" :data-index="index" :data-indexs="index2" :data-askid="comments.ask_id" :data-askcommentsid="comments.id" :data-replycommentsid="comments.ask_comments_id" @tap="give_thumbs_event">
                                                        <iconfont :name="(comments.is_give_thumbs || 0) == 1 ? 'icon-givealike' : 'icon-givealike-o'" size="28rpx" propClass="pr top-md margin-right-xs"></iconfont>
                                                        <text class="va-m">{{$t('ask-comments.ask-comments.du7rcv')}}{{ comments.give_thumbs_count }})</text>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                            </view>
                            <view v-if="(item.comments_count || 0) > 0 && (item.is_comments_list_submit == undefined || item.is_comments_list_submit == 1)" class="margin-top-lg text-size-xs">
                                <text :data-index="index" :data-askid="item.ask_id" :data-askcommentsid="item.id" @tap="comments_list_reply_event">
                                    <text v-if="item.is_comments_list_submit == undefined" class="cr-base">{{$t('goods-list.goods-list.278qr1')}}{{ item.comments_count }}{{$t('ask-comments.ask-comments.ymmd24')}}</text>
                                    <text v-else class="cr-base">{{$t('ask-comments.ask-comments.dfhg54')}}</text>
                                    <iconfont name="icon-arrow-bottom" size="24rpx" propClass="margin-left-xs pr top-xs"></iconfont>
                                </text>
                            </view>
                        </view>
                    </view>
                </block>
                <block v-if="((data_base.ask_detail_comments_more_page_number || 0) == 0 && (data.comments_count || 0) > 20) || ((data_base.ask_detail_comments_more_page_number || 0) > 0 && data.comments_count > data_base.ask_detail_comments_more_page_number)">
                    <view v-if="propType == 'detail'" class="margin-top-xxxl tc padding-vertical-main bg-grey-f8 border-radius-sm">
                        <text :data-value="'/pages/plugins/ask/comments/comments?id=' + data.id" @tap="url_event">
                            <text class="cr-base">{{$t('goods-list.goods-list.278qr1')}}{{ data.comments_count }}{{$t('ask-comments.ask-comments.5401r1')}}</text>
                            <iconfont name="icon-arrow-right" size="24rpx" propClass="margin-left-xs pr top-xs"></iconfont>
                        </text>
                    </view>
                    <view v-if="propType == 'comments' && (data.is_comments_list_submit == undefined || data.is_comments_list_submit == 1)" class="margin-top-xxxl tc padding-vertical-main bg-grey-f8 border-radius-sm">
                        <text :data-askid="data.id" @tap="comments_list_reply_event">
                            <text class="cr-base">{{$t('ask-comments.ask-comments.4l77wt')}}</text>
                            <iconfont name="icon-arrow-bottom" size="24rpx" propClass="margin-left-xs pr top-xs"></iconfont>
                        </text>
                    </view>
                </block>
            </view>
            <!-- 回复弹窗 -->
            <view v-if="input_comments_modal_status" class="ask-comments-modal pf">
                <view class="ask-comments-modal-content bg-white border-radius-main pr">
                    <view class="tc margin-bottom-lg">
                        <text>{{$t('ask-comments.ask-comments.8sjar6')}}{{ input_comments_modal_username }}</text>
                        <view class="close pa">
                            <view @tap.stop="modal_close_event">
                                <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                            </view>
                        </view>
                    </view>
                    <textarea :placeholder="$t('ask-comments.ask-comments.m67961')" placeholder-class="cr-base" class="textarea wh-auto br padding-main" :value="input_comments_value" :maxlength="input_comments_length_max" @input="comments_input_event" @blur="comments_input_event"></textarea>
                    <view class="margin-top-lg oh">
                        <image :src="common_static_url + 'emoji-icon.png'" mode="aspectFill" class="emoji-icon va-m" @tap="emoji_event"></image>
                        <view class="fr">
                            <text class="va-m text-size-xs cr-base margin-right-lg">{{$t('login.login.n24i5u')}}{{ input_comments_length_value }}{{$t('ask-comments.ask-comments.6l6vz7')}}</text>
                            <button type="default" size="mini" class="comment-btn cr-white border-radius-sm text-size-xs va-m" :class="input_comments_value.length > 0 ? 'bg-main br-main ' : 'comment-btn-default'" @tap="comments_event">{{$t('user-order.user-order.twc3r7')}}</button>
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
    import componentPopup from '@/components/popup/popup';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentEmojiPopup from '@/components/emoji-popup/emoji-popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
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
                input_comments_modal_ask_comments_id: 0,
                input_comments_modal_reply_comments_id: 0,
            };
        },
        props: {
            propType: {
                type: String,
                default: 'detail',
            },
            propData: {
                type: [Object, null],
                default: null,
            },
            propDataBase: {
                type: [Object, null],
                default: null,
            },
            propEmojiList: {
                type: [Array, null],
                default: [],
            },
            propShareInfo: {
                type: [Object, null],
                default: {},
            }
        },
        components: {
            componentPopup,
            componentSharePopup,
            componentEmojiPopup,
        },

        // 页面被展示
        created: function (e) {
            var avatar = app.globalData.data.default_user_head_src;
            var user = app.globalData.get_user_cache_info() || null;
            this.setData({
                user: user,
                avatar: user == null ? avatar : user.avatar || avatar,
                data: this.propData,
                data_base: this.propDataBase,
                emoji_list: this.propEmojiList,
            });
        },

        methods: {
            // 分享开启弹层
            popup_share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.propShareInfo
                    });
                }
            },

            // 评论弹窗关闭
            modal_close_event(e) {
                this.setData({
                    input_comments_modal_status: false,
                    input_comments_modal_index: 0,
                    input_comments_modal_username: '',
                    input_comments_modal_ask_comments_id: 0,
                    input_comments_modal_reply_comments_id: 0,
                    input_comments_value: '',
                });
            },

            // 评论弹窗开启
            modal_open_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'modal_open_event', e);
                if (user != false) {
                    var index = parseInt(e.currentTarget.dataset.index || 0);
                    var username = e.currentTarget.dataset.username;
                    var ask_comments_id = e.currentTarget.dataset.askcommentsid || 0;
                    var reply_comments_id = e.currentTarget.dataset.replycommentsid || 0;
                    this.setData({
                        input_comments_modal_status: true,
                        input_comments_value: '',
                        input_comments_modal_index: index,
                        input_comments_modal_username: username,
                        input_comments_modal_ask_comments_id: ask_comments_id,
                        input_comments_modal_reply_comments_id: reply_comments_id,
                    });
                }
            },

            // 表情选择事件
            emoji_event() {
                if (this.input_comments_length_value == 0) {
                    app.globalData.showToast(this.$t('ask-comments.ask-comments.3o1rq6'));
                    return false;
                }
                if ((this.$refs.emoji || null) != null) {
                    this.$refs.emoji.init({ emoji_list: this.emoji_list });
                }
            },

            // 评论输入和失去焦点事件
            comments_input_event(e) {
                var value = e.detail.value.trim();
                var length = this.input_comments_length_max - value.length;
                this.setData({
                    input_comments_cursor: e.detail.cursor || 0,
                    input_comments_value: value,
                    input_comments_length_value: length <= 0 ? 0 : length,
                });
            },

            // 表情选择确认事件
            emoji_choice_confirm_event(emoji) {
                var value = this.input_comments_value;
                var cursor = parseInt(this.input_comments_cursor || 0);
                if (value != '') {
                    if (cursor == 0) {
                        value = emoji + value;
                    } else {
                        var first = value.substr(0, cursor);
                        var last = value.substr(cursor, value.length);
                        value = first + emoji + last;
                    }
                } else {
                    value = emoji;
                }
                var length = this.input_comments_length_max - value.length;
                this.setData({
                    input_comments_value: value,
                    input_comments_length_value: length <= 0 ? 0 : length,
                });
            },

            // 获取评论列表
            comments_list_reply_event(e) {
                var temp_data = this.data;
                var page = 1;
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var ask_id = e.currentTarget.dataset.askid;
                var ask_comments_id = e.currentTarget.dataset.askcommentsid || 0;
                if (ask_comments_id == 0) {
                    if ((temp_data['page'] || null) == null) {
                        temp_data['page'] = 1;
                    } else {
                        temp_data['page'] += 1;
                    }
                    page = temp_data['page'];
                } else {
                    if ((temp_data['comments_list'][index]['page'] || null) == null) {
                        temp_data['comments_list'][index]['page'] = 1;
                    } else {
                        temp_data['comments_list'][index]['page'] += 1;
                    }
                    page = temp_data['comments_list'][index]['page'];
                }
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('commentsreplylist', 'index', 'ask'),
                    method: 'POST',
                    data: {
                        ask_id: ask_id,
                        ask_comments_id: ask_comments_id,
                        page: page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            if (ask_comments_id == 0) {
                                var temp_list = temp_data['comments_list'] || [];
                            } else {
                                var temp_list = temp_data['comments_list'][index]['reply_comments_list'] || [];
                            }
                            var data = res.data.data.data;
                            for (var i in data) {
                                temp_list.push(data[i]);
                            }
                            if (ask_comments_id == 0) {
                                temp_data['comments_list'] = temp_list;
                                temp_data['is_comments_list_submit'] = res.data.data.page >= res.data.data.page_total ? 0 : 1;
                            } else {
                                temp_data['comments_list'][index]['reply_comments_list'] = temp_list;
                                temp_data['comments_list'][index]['is_comments_list_submit'] = res.data.data.page >= res.data.data.page_total ? 0 : 1;
                            }
                            this.setData({ data: temp_data });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 评论
            comments_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'comments_event', e);
                if (user != false) {
                    if (this.input_comments_value == '') {
                        app.globalData.showToast(this.$t('user-order-comments.user-order-comments.8f303u'));
                        return false;
                    }
                    uni.showLoading({
                        title: this.$t('buy.buy.r79t77'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('comments', 'index', 'ask'),
                        method: 'POST',
                        data: {
                            ask_id: this.data.id,
                            content: this.input_comments_value,
                            ask_comments_id: this.input_comments_modal_ask_comments_id,
                            reply_comments_id: this.input_comments_modal_reply_comments_id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var temp_data = this.data;
                                if ((this.input_comments_modal_ask_comments_id || 0) == 0) {
                                    var temp_list = temp_data.comments_list || [];
                                    temp_list.splice(0, 0, res.data.data);
                                    temp_data['comments_list'] = temp_list;
                                    temp_data['comments_count'] = parseInt(temp_data['comments_count']) + 1;
                                } else {
                                    var index = this.input_comments_modal_index;
                                    var temp_list = temp_data.comments_list[index]['reply_comments_list'] || [];
                                    temp_list.splice(0, 0, res.data.data);
                                    if ((this.input_comments_modal_reply_comments_id || 0) != 0) {
                                        for (var i in temp_list) {
                                            if (temp_list[i]['id'] == this.input_comments_modal_reply_comments_id) {
                                                temp_list[i]['comments_count'] = parseInt(temp_list[i]['comments_count']) + 1;
                                                break;
                                            }
                                        }
                                    }
                                    temp_data.comments_list[index]['reply_comments_list'] = temp_list;
                                    temp_data.comments_list[index]['comments_count'] = parseInt(temp_data.comments_list[index]['comments_count']) + 1;
                                }
                                this.setData({
                                    data: temp_data,
                                    input_comments_value: '',
                                    input_comments_length_value: this.input_comments_length_max,
                                    input_comments_modal_status: false,
                                    input_comments_modal_index: 0,
                                    input_comments_modal_username: '',
                                    input_comments_modal_ask_comments_id: 0,
                                    input_comments_modal_reply_comments_id: 0,
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 点赞
            give_thumbs_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'give_thumbs_event', e);
                if (user != false) {
                    var type = parseInt(e.currentTarget.dataset.type || 0);
                    var ask_id = e.currentTarget.dataset.askid;
                    var ask_comments_id = e.currentTarget.dataset.askcommentsid || 0;
                    var reply_comments_id = e.currentTarget.dataset.replycommentsid || 0;
                    uni.request({
                        url: app.globalData.get_request_url('givethumbs', 'index', 'ask'),
                        method: 'POST',
                        data: {
                            ask_id: ask_id,
                            ask_comments_id: ask_comments_id,
                            reply_comments_id: reply_comments_id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                var temp_data = this.data;
                                switch (type) {
                                    // 博客
                                    case 0:
                                        temp_data.is_give_thumbs = data.is_active;
                                        temp_data.give_thumbs_count = data.count;
                                        break;
                                    // 博客评论
                                    case 1:
                                        var index = parseInt(e.currentTarget.dataset.index || 0);
                                        temp_data['comments_list'][index]['is_give_thumbs'] = data.is_active;
                                        temp_data['comments_list'][index]['give_thumbs_count'] = data.count;
                                        break;
                                    // 博客评论回复
                                    case 2:
                                        var index = parseInt(e.currentTarget.dataset.index || 0);
                                        var indexs = parseInt(e.currentTarget.dataset.indexs || 0);
                                        temp_data['comments_list'][index]['reply_comments_list'][indexs]['is_give_thumbs'] = data.is_active;
                                        temp_data['comments_list'][index]['reply_comments_list'][indexs]['give_thumbs_count'] = data.count;
                                        break;
                                }
                                this.setData({ data: temp_data });
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style scoped>
    /**
     * 聚合点赞、评论、分享
     */
    .ask-comments-bottom-container .item:not(:last-child) {
        margin-right: 64rpx;
    }
    .ask-comments-reply-container .emoji-icon,
    .ask-comments-modal .emoji-icon {
        width: 40rpx;
        height: 40rpx !important;
    }
    .ask-comments-reply-container .user-avatar {
        width: 72rpx;
        height: 72rpx !important;
        border: 1px solid #eee;
    }
    .ask-comments-reply-container .right-base {
        padding-left: 16rpx;
    }
    .ask-comments-reply-container .right-base .comments {
        background-color: #f8f8f8;
    }
    .ask-comments-reply-container .right-base .textarea {
        height: 120rpx;
    }
    .ask-comments-modal {
        top: 0;
        left: 0;
        width: calc(100% - 80rpx);
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        padding: 40rpx;
        z-index: 10;
    }
    .ask-comments-modal-content {
        padding: 10px;
        border-radius: 10px;
        margin: 0 auto;
        margin-top: 30%;
        max-width: calc(800px - 180rpx);
    }
    .ask-comments-modal-content .textarea {
        height: 200rpx;
    }
    .ask-comments-modal-content .close {
        top: 20rpx;
        right: 20rpx;
    }
    .comment-btn {
        height: 56rpx;
        line-height: 56rpx;
        padding: 0 24rpx;
    }
    .comment-btn-default {
        border: 2rpx solid #d8dadc;
        background-color: #d8dadc;
    }

    /**
     * 评论列表
     */
    .ask-comments-list > .item .user-avatar {
        width: 72rpx;
        height: 72rpx;
        border: 1px solid #eee;
    }
    .ask-comments-list .comments-base,
    .ask-comments-list .comments-content {
        padding-left: 16rpx;
        padding-right: 20rpx;
    }
    .reply-ask-comments-list {
        margin-top: 28rpx;
    }
    .reply-ask-comments-list .right-content {
        padding-left: 16rpx;
    }
</style>

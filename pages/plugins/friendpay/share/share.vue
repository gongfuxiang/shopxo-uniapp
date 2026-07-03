<template>
    <view :class="theme_view">
        <view v-if="(friendpay || null) != null" class="padding-main">
            <!-- 基础信息 -->
            <view class="bg-white border-radius-main padding-main spacing-mb">
                <view class="tc fw-b text-size">{{ pageTitle }}</view>
                <view v-if="(status_tips || null) != null" class="tc margin-top-sm text-size-sm" :class="status_tips_class">{{ status_tips.msg }}</view>
                <view v-if="has_buyer_name" class="flex-row align-c jc-c margin-top-main cr-grey text-size-sm">
                    <image :src="buyer_avatar" mode="aspectFill" class="buyer-avatar circle margin-right-sm"></image>
                    <view>{{ invite_text_plain || buyer_invite_fallback }}</view>
                </view>
                <view class="tc margin-top-sm">
                    <text class="cr-grey">{{ $t('friendpay.friendpay.share_amount') }}</text>
                    <text class="sales-price text-size-xl margin-left-sm">{{ currency_symbol }}{{ friendpay.total_price }}</text>
                </view>
                <component-friendpay-goods-list :propGoodsList="order_goods_list"></component-friendpay-goods-list>
            </view>

            <block v-if="friendpay.status == 0">
                <!-- 代付链接 + 邀请二维码 -->
                <view class="bg-white border-radius-main padding-main spacing-mb">
                    <view v-if="(friendpay.expire_time_text || null) != null" class="cr-grey text-size-xs tc">{{ $t('friendpay.friendpay.expire_tips') }}{{ friendpay.expire_time_text }}</view>
                    <view v-if="(friendpay.expire_time_text || null) != null" class="br-b margin-top-sm margin-bottom-main"></view>
                    <view class="fw-b text-size-sm">{{ $t('friendpay.friendpay.share_link') }}</view>
                    <view class="share-link-row flex-row align-stretch gap-10 margin-top-xs">
                        <view class="share-link-group br-main radius flex-1 flex-width flex-row align-stretch oh">
                            <input class="share-link-input flex-1 flex-width text-size-xs cr-base" :value="friendpay.share_url" disabled />
                            <button class="share-link-btn margin-0 bg-main br-main cr-white text-size-xs" type="default" hover-class="none" @tap="copy_event" :data-value="friendpay.share_url">{{ $t('common.copy') }}</button>
                        </view>
                        <view class="share-link-share br-main radius oh">
                            <button class="share-link-btn margin-0 bg-main cr-white text-size-xs" type="default" hover-class="none" @tap="popup_share_event">{{ $t('common.share') }}</button>
                        </view>
                    </view>
                    <block v-if="(qrcode_data || null) != null && (qrcode_data.qrcode || null) != null && qrcode_data.qrcode.length > 0">
                        <view class="fw-b text-size-sm margin-top-main">{{ $t('friendpay.friendpay.invite_qrcode') }}</view>
                        <view class="qrcode-content margin-top-sm">
                            <view class="qrcode-list flex-row flex-wrap">
                                <view v-for="(item, index) in qrcode_data.qrcode" :key="index" class="qrcode-item">
                                    <image v-if="(item.qrcode || null) != null" :src="item.qrcode" mode="aspectFit" class="qrcode-image radius" @tap="preview_qrcode_event" :data-value="item.qrcode"></image>
                                    <view class="margin-top-xs tc">
                                        <text class="cr-grey text-size-xs">{{ item.name }}</text>
                                        <text v-if="(item.url || null) != null && item.url != ''" class="cr-blue text-size-xs margin-left-xs" @tap="copy_url_event" :data-value="item.url">{{ $t('common.copy') }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </block>

            <view class="footer-actions flex-row jc-c align-c gap-20 margin-top-main">
                <button v-if="friendpay.status == 0 || friendpay.status == 3" class="margin-0 bg-white cr-base br-grey round" size="mini" hover-class="none" @tap="refresh_event">{{ $t('friendpay.friendpay.refresh_link') }}</button>
                <button v-if="(order_back_url || null) != null" class="margin-0 bg-white br-main cr-main round" size="mini" hover-class="none" @tap="url_open_event" :data-value="order_back_url">{{ order_back_name || $t('common.back') }}</button>
            </view>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentFriendpayGoodsList from '@/pages/plugins/friendpay/components/goods-list/goods-list';
    export default {
        components: {
            componentCommon,
            componentNoData,
            componentSharePopup,
            componentFriendpayGoodsList,
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                currency_symbol: app.globalData.currency_symbol(),
                default_avatar: app.globalData.data.default_user_head_src,
                params: {},
                friendpay: null,
                order_data: null,
                qrcode_data: null,
                status_tips: null,
                invite_text: '',
                invite_text_plain: '',
                page_text: {},
                order_back_url: '',
                order_back_name: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                share_info: {},
            };
        },
        computed: {
            // 页面标题
            pageTitle() {
                return (this.page_text.share_page_title || this.$t('friendpay.friendpay.share_page_title'));
            },
            // 买家头像
            buyer_avatar() {
                var avatar = ((this.order_data || {}).buyer_avatar || '').trim();
                return avatar != '' ? avatar : this.default_avatar;
            },
            // 邀请文案兜底
            buyer_invite_fallback() {
                var name = (this.order_data || {}).buyer_name || '';
                return this.$t('friendpay.friendpay.invite_fallback').replace('${name}', name);
            },
            // 是否展示下单人信息
            has_buyer_name() {
                var order_data = this.order_data;
                return order_data != null && (order_data.buyer_name || '') != '';
            },
            // 商品列表
            order_goods_list() {
                var order_data = this.order_data;
                return order_data != null ? (order_data.goods_list || []) : [];
            },
            // 状态提示样式
            status_tips_class() {
                return ((this.friendpay || {}).status == 1) ? 'cr-green' : 'cr-red';
            },
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 初始化
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle(this.share_info);
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({ data_list_loding_status: 0 });
                }
            },

            // 获取数据
            get_data() {
                this.setData({ data_list_loding_status: 1 });
                uni.request({
                    url: app.globalData.get_request_url('index', 'share', 'friendpay'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var share_info = this.build_share_info(data);
                            this.setData({
                                friendpay: data.friendpay || null,
                                order_data: data.order_data || null,
                                qrcode_data: data.qrcode_data || null,
                                status_tips: data.status_tips || null,
                                invite_text: data.invite_text || '',
                                invite_text_plain: data.invite_text_plain || '',
                                page_text: data.page_text || {},
                                order_back_url: data.order_back_url || '',
                                order_back_name: data.order_back_name || '',
                                data_list_loding_status: (data.friendpay || null) != null ? 3 : 0,
                                data_list_loding_msg: '',
                                share_info: share_info,
                            });
                            uni.setNavigationBarTitle({ title: this.pageTitle });
                            app.globalData.page_share_handle(share_info);
                        } else {
                            if (res.data.code == -400) {
                                app.globalData.is_login_check(res.data, this, 'init');
                                return;
                            }
                            this.setData({
                                friendpay: null,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg || '',
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 分享信息
            build_share_info(data) {
                data = data || {};
                var friendpay = data.friendpay || {};
                var order_data = data.order_data || {};
                var page_text = data.page_text || {};
                return {
                    title: page_text.share_page_title || this.$t('friendpay.friendpay.share_page_title'),
                    desc: data.invite_text_plain || '',
                    path: '/pages/plugins/friendpay/pay/index',
                    query: (friendpay.unique_key || '') != '' ? ('id=' + friendpay.unique_key) : '',
                    img: ((order_data.goods_list || [])[0] || {}).images || '',
                    url: friendpay.share_url || '',
                };
            },

            // 分享弹窗
            popup_share_event() {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info,
                    });
                }
            },

            // 复制文本
            copy_text(value) {
                if ((value || '') == '') {
                    return;
                }
                uni.setClipboardData({
                    data: value,
                    success: () => {
                        app.globalData.showToast(this.$t('common.copy_success'));
                    },
                });
            },

            // 复制链接
            copy_event(e) {
                this.copy_text(e.currentTarget.dataset.value || ((this.friendpay || {}).share_url || ''));
            },

            // 复制二维码链接
            copy_url_event(e) {
                this.copy_text(e.currentTarget.dataset.value || '');
            },

            // 预览二维码
            preview_qrcode_event(e) {
                var url = e.currentTarget.dataset.value;
                if ((url || null) != null) {
                    uni.previewImage({ current: url, urls: [url] });
                }
            },

            // 刷新代付链接
            refresh_event() {
                if ((this.friendpay || null) == null) {
                    return;
                }
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('friendpay.friendpay.refresh_confirm'),
                    success(res) {
                        if (res.confirm) {
                            uni.showLoading({ title: self.$t('common.loading_in_text') });
                            uni.request({
                                url: app.globalData.get_request_url('refresh', 'share', 'friendpay'),
                                method: 'POST',
                                data: { id: self.friendpay.id },
                                dataType: 'json',
                                success: (r) => {
                                    uni.hideLoading();
                                    if (r.data.code == 0) {
                                        app.globalData.showToast(self.$t('friendpay.friendpay.refresh_success'));
                                        self.get_data();
                                    } else {
                                        app.globalData.showToast(r.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(self.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // url事件
            url_open_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
    .buyer-avatar {
        width: 60rpx;
        height: 60rpx;
        flex-shrink: 0;
    }
    .share-link-group,
    .share-link-share {
        overflow: hidden;
        box-sizing: border-box;
        height: 72rpx;
        flex-shrink: 0;
    }
    .share-link-input {
        height: 72rpx;
        line-height: 72rpx;
        padding: 0 20rpx;
        background: #fff;
        box-sizing: border-box;
    }
    .share-link-btn {
        height: 72rpx;
        line-height: 72rpx;
        border-radius: 0;
        margin: 0;
        padding: 0 24rpx;
        flex-shrink: 0;
        box-sizing: border-box;
    }
    .qrcode-content {
        max-width: 720rpx;
        margin: 0 auto;
    }
    .qrcode-item {
        width: 50%;
        box-sizing: border-box;
        padding: 12rpx;
        text-align: center;
    }
    .qrcode-image {
        width: 240rpx;
        height: 240rpx;
        margin: 0 auto;
        display: block;
    }
</style>

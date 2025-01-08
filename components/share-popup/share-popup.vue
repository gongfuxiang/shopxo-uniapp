<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="share-popup bg-white">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="share-popup-content">
                    <!-- #ifdef MP-ALIPAY -->
                    <view class="share-items oh cp" @tap="share_base_event">
                        <image class="image" :src="common_static_url + 'share-user-icon.png'" mode="scaleToFill"></image>
                        <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.h04xiy') }}</text>
                    </view>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-KUAISHOU -->
                    <view class="share-items oh cp">
                        <button class="btn dis-block br-0 ht-auto" type="default" size="mini" open-type="share" hover-class="none" @tap="popup_close_event">
                            <image class="image" :src="common_static_url + 'share-user-icon.png'" mode="scaleToFill"></image>
                            <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.h04xiy') }}</text>
                        </button>
                    </view>
                    <!-- #endif -->
                    <!-- #ifdef APP -->
                    <block v-if="is_app_weixin">
                        <view class="share-items oh cp" data-scene="WXSceneSession" data-provider="weixin" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-user-icon.png'" mode="scaleToFill"></image>
                            <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.rhs2c5') }}</text>
                        </view>
                        <view class="share-items oh cp" data-scene="WXSceneTimeline" data-provider="weixin" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-friend-icon.png'" mode="scaleToFill"></image>
                            <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.mv9l10') }}</text>
                        </view>
                        <view class="share-items oh cp" data-scene="WXSceneFavorite" data-provider="weixin" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-favor-icon.png'" mode="scaleToFill"></image>
                            <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.f08y38') }}</text>
                        </view>
                    </block>
                    <block v-if="is_app_qq">
                        <view class="share-items oh cp" data-provider="qq" @tap="share_app_event">
                            <image class="image":src="common_static_url + 'share-qq-icon.png'" mode="scaleToFill"></image>
                            <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.1242w9') }}</text>
                        </view>
                    </block>
                    <!-- #endif -->
                    <!-- #ifdef H5 || APP -->
                    <view class="share-items oh cp" @tap="share_url_copy_event">
                        <image class="image" :src="common_static_url + 'share-url-icon.png'" mode="scaleToFill"></image>
                        <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.1oh013') }}</text>
                    </view>
                    <!-- #endif -->
                    <view v-if="is_goods_poster == 1 && (goods_id || 0) != 0" class="share-items oh cp" @tap="poster_event">
                        <image class="image" :src="common_static_url + 'share-poster-icon.png'" mode="scaleToFill"></image>
                        <text class="cr-grey text-size-xs single-text">{{ $t('share-popup.share-popup.dcp2qu') }}</text>
                    </view>
                </view>
            </view>
        </component-popup>

        <!-- 用户基础 -->
        <component-user-base ref="user_base"></component-user-base>
    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    import componentPopup from '@/components/popup/popup';
    import componentUserBase from '@/components/user-base/user-base';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                popup_status: false,
                type: null,
                is_goods_poster: 0,
                goods_id: 0,
                url: null,
                images: null,
                title: null,
                summary: null,
                is_app_weixin: true,
                is_app_qq: true,
                share_info: {},
            };
        },

        components: {
            componentPopup,
            componentUserBase,
        },

        created: function () {},

        methods: {
            // 初始配置
            init(config = {}) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                this.setData({
                    popup_status: config.status == undefined ? true : config.status,
                    type: config.type == undefined ? null : config.type,
                    is_goods_poster: config.is_goods_poster || 0,
                    goods_id: config.goods_id || 0,
                    goods_id: config.goods_id || 0,
                    url: config.url || null,
                    images: config.images || null,
                    title: config.title || null,
                    summary: config.summary || null,
                    share_info: config.share_info || {},
                });

                // 用户头像和昵称设置提示
                if ((this.$refs.user_base || null) != null) {
                    this.$refs.user_base.init('share');
                }

                // #ifdef APP
                // app分享通道隔离
                uni.getProvider({
                    service: 'share',
                    success: (result) => {
                        var provider = result.provider || [];
                        this.setData({
                            is_app_weixin: provider.indexOf('weixin') != -1,
                            is_app_qq: provider.indexOf('qq') != -1,
                        });
                    },
                    fail: (error) => {},
                });
                // #endif
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // url链接地址复制分享
            share_url_copy_event() {
                var url = app.globalData.get_page_url();
                // 增加分享标识
                if(url.indexOf('referrer') == -1) {
                    var uid = app.globalData.get_user_cache_info('id') || null;
                    if(uid != null) {
                        var join = url.indexOf('?') == -1 ? '?' : '&';
                        url += join+'referrer='+uid;
                    }
                }
                app.globalData.text_copy_event(url);
            },

            // 基础分享事件
            share_base_event() {
                this.setData({
                    popup_status: false,
                });
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300,
                    complete: (res) => {
                        setTimeout(function () {
                            uni.showShareMenu();
                        }, 500);
                    },
                });
            },

            // 商品海报分享
            poster_event() {
                var user = app.globalData.get_user_info(this, 'poster_event');
                if (user != false) {
                    uni.showLoading({
                        title: this.$t('detail.detail.6xvl35'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('goodsposter', 'distribution', 'distribution'),
                        method: 'POST',
                        data: { goods_id: this.goods_id },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();

                            if (res.data.code == 0) {
                                uni.previewImage({
                                    current: res.data.data,
                                    urls: [res.data.data],
                                });
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'poster_event')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // app分享
            share_app_event(e) {
                // 分享参数
                var provider = e.currentTarget.dataset.provider;
                var scene = e.currentTarget.dataset.scene || null;
                // 分享基础数据
                var share = app.globalData.share_content_handle(this.share_info || {});
                var img = this.images || share.img;
                var url = this.url || share.url;
                var title = this.title || share.title;
                var summary = this.summary || share.desc;
                var type = this.type === null ? ((img || null) == null ? 1 : 0) : this.type;
                var miniProgram = {};

                // #ifdef APP
                // 分享到好友，是否走微信小程序，则获取微信小程序原始id
                if (scene == 'WXSceneSession') {
                    var weixin_original_id = app.globalData.get_config('config.common_app_mini_weixin_share_original_id') || null;
                    if (weixin_original_id != null) {
                        type = 5;
                        miniProgram = {
                            id: weixin_original_id,
                            path: url.split('#')[1],
                            type: 0,
                            webUrl: url,
                        };
                    }
                }
                // #endif

                // 关闭分享弹窗
                this.setData({
                    popup_status: false,
                });
                // 调用分享组件
                uni.share({
                    provider: provider,
                    scene: scene,
                    type: type,
                    href: url,
                    title: title,
                    summary: summary,
                    imageUrl: img,
                    miniProgram: miniProgram,
                    success: function (res) {},
                    fail: function (err) {},
                });
            },
        },
    };
</script>
<style>
    .share-popup {
        padding: 20rpx 10rpx 0 10rpx;
        position: relative;
    }
    .share-popup .close {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        padding: 20rpx;
    }
    .share-popup-content {
        padding: 0 20rpx;
        text-align: left;
    }
    .share-popup-content .share-items {
        padding: 30rpx 0;
        min-height: 85rpx;
        display: flex;
    }
    .share-popup-content .share-items:not(:first-child) {
        border-top: 1px solid #f0f0f0;
    }
    .share-popup-content .share-items .btn {
        background: transparent;
        padding: 0;
        width: 100%;
        text-align: left;
        margin: 0;
    }
    .share-popup-content .share-items .image {
        width: 80rpx;
        height: 80rpx;
        vertical-align: middle;
        margin-right: 20rpx;
    }
    .share-popup-content .share-items .single-text {
        width: calc(100% - 100rpx);
        line-height: 85rpx;
    }
</style>

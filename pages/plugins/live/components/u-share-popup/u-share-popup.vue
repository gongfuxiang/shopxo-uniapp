<template>
    <view :class="theme_view">
        <component-u-popup ref="popupShareRef" propType="bottom" :propCloseable="false">
            <view class="share-popup bg-white">
                <view class="share-popup-content">
                    <!-- #ifdef MP-ALIPAY -->
                    <view class="share-items oh cp" @tap="share_base_event">
                        <image class="image" :src="common_static_url + 'share-user-icon.png'" mode="scaleToFill"></image>
                        <text class="cr-grey text-size-xs single-text" :style="{ 'width': single_text_width }">{{ $t('common.one_click_sharing_friends_group_chat') }}</text>
                    </view>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-KUAISHOU -->
                    <view class="share-items oh cp">
                        <button class="btn br-0" type="default" size="default" open-type="share" hover-class="none" @tap="popup_close_event">
                            <view class="share-item-inner">
                                <image class="image" :src="common_static_url + 'share-user-icon.png'" mode="aspectFit"></image>
                                <text class="cr-grey text-size-xs single-text" :style="{ 'width': single_text_width }">{{ $t('common.one_click_sharing_friends_group_chat') }}</text>
                            </view>
                        </button>
                    </view>
                    <!-- #endif -->
                    <!-- #ifdef APP -->
                    <block v-if="is_app_weixin">
                        <view class="share-items oh cp" data-scene="WXSceneSession" data-provider="weixin" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-user-icon.png'" mode="scaleToFill"></image>
                            <text class="single-text" :style="share_text_style">{{ $t('common.one_click_sharing_wechat_friends_group') }}</text>
                        </view>
                        <view class="share-items oh cp" data-scene="WXSceneTimeline" data-provider="weixin" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-friend-icon.png'" mode="scaleToFill"></image>
                            <text class="single-text" :style="share_text_style">{{ $t('common.one_click_sharing_wechat_moments') }}</text>
                        </view>
                        <view class="share-items oh cp" data-scene="WXSceneFavorite" data-provider="weixin" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-favor-icon.png'" mode="scaleToFill"></image>
                            <text class="single-text" :style="share_text_style">{{ $t('common.one_click_share_wechat_favorites') }}</text>
                        </view>
                    </block>
                    <block v-if="is_app_qq">
                        <view class="share-items oh cp" data-provider="qq" @tap="share_app_event">
                            <image class="image" :src="common_static_url + 'share-qq-icon.png'" mode="scaleToFill"></image>
                            <text class="single-text" :style="share_text_style">{{ $t('common.one_click_sharing_qq_friends_spaces') }}</text>
                        </view>
                    </block>
                    <!-- #endif -->
                    <!-- #ifdef H5 || APP -->
                    <view class="share-items oh cp" :style="{ 'width': single_text_width }" @tap="share_url_copy_event">
                        <image class="image" :src="common_static_url + 'share-url-icon.png'" mode="scaleToFill"></image>
                        <text class="flex-1 cr-grey text-size-xs single-text" :style="share_text_style">{{ $t('common.click_copy_address_share_friends_group') }}</text>
                    </view>
                    <!-- #endif -->
                    <view v-if="is_goods_poster == 1 && (goods_id || 0) != 0" class="share-items oh cp" @tap="poster_event">
                        <image class="image" :src="common_static_url + 'share-poster-icon.png'" mode="scaleToFill"></image>
                        <text class="cr-grey text-size-xs single-text" :style="share_text_style">{{ $t('common.generate_posters_share_them_social_media') }}</text>
                    </view>
                </view>
                <view class="share-popup-close" @tap.stop="popup_close_event">
                    <component-u-icon propName="close-line" propSize="28rpx" propColor="#999999"></component-u-icon>
                </view>
            </view>
        </component-u-popup>
        <!-- #ifndef APP-NVUE -->
        <!-- 用户基础 -->
        <component-user-base ref="user_base"></component-user-base>
        <!-- #endif -->
    </view>
</template>
<script>
    const app = getApp();
    //#ifdef APP-NVUE  
    import i18n from '@/locale/index.js';
    //#endif
    var common_static_url = app.globalData.get_static_url('common');
    import componentUserBase from '@/components/user-base/user-base';
    import componentUPopup from '@/pages/plugins/live/components/u-popup/u-popup';
    import componentUIcon from '@/pages/plugins/live/components/u-icon/u-icon';
    export default {
        //#ifdef APP-NVUE  
        i18n,
        //#endif
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
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
                single_text_width: '0px',
            };
        },

        components: {
            componentUserBase,
            componentUPopup,
            componentUIcon,
        },

        computed: {
            share_text_style() {
                var style = {
                    color: '#999',
                    width: this.single_text_width,
                };
                // #ifdef APP
                style.fontSize = '12px';
                style.lineHeight = '18px';
                // #endif
                return style;
            },
        },

        created: function () {
            const data = uni.getWindowInfo();
            const del_width = app.globalData.rpx_to_px(100);
            this.single_text_width = (data.windowWidth - del_width) + 'px';
        },

        methods: {
            /**
             * 初始化分享配置
             * @param {Object} config - 配置参数
             * @param {String} config.type - 分享类型
             * @param {Number} config.is_goods_poster - 是否为商品海报分享 (0|1)
             * @param {Number} config.goods_id - 商品ID
             * @param {String} config.url - 分享链接
             * @param {String} config.images - 分享图片
             * @param {String} config.title - 分享标题
             * @param {String} config.summary - 分享摘要
             * @param {Object} config.share_info - 分享信息
             * @param {Boolean} config.status - 是否显示分享弹窗
             * @returns {Boolean} 初始化结果
             */
            init(config = {}) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                
                if (config.status == undefined || config.status) {
                    this.$refs.popupShareRef.open();
                }

                // #ifndef APP-NVUE
                this.setData({
                    type: config.type == undefined ? null : config.type,
                    is_goods_poster: config.is_goods_poster || 0,
                    goods_id: config.goods_id || 0,
                    url: config.url || null,
                    images: config.images || null,
                    title: config.title || null,
                    summary: config.summary || null,
                    share_info: config.share_info || {}
                });
                // #endif
                // #ifdef APP-NVUE
                // 更新配置信息
                this.type = config.type == undefined ? null : config.type;
                this.is_goods_poster = config.is_goods_poster || 0;
                this.goods_id = config.goods_id || 0;
                this.url = config.url || null;
                this.images = config.images || null;
                this.title = config.title || null;
                this.summary = config.summary || null;
                this.share_info = config.share_info || {};
                // #endif

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
                        // #ifndef APP-NVUE
                        this.setData({
                            is_app_weixin: provider.indexOf('weixin') != -1,
                            is_app_qq: provider.indexOf('qq') != -1,
                        });
                        // #endif
                        // #ifdef APP-NVUE
                        this.is_app_weixin = provider.indexOf('weixin') != -1;
                        this.is_app_qq = provider.indexOf('qq') != -1;
                        // #endif
                    },
                    fail: (error) => {},
                });
                // #endif
            },

            /**
             * 关闭分享弹窗
             */
            popup_close_event(e) {
                this.$refs.popupShareRef.close();
            },

            /**
             * 复制链接分享
             */
            share_url_copy_event() {
                var share = app.globalData.share_content_handle(this.share_info || {});
                var url = (share.url || null) != null && share.url != '' ? share.url : app.globalData.get_page_url();
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

            /**
             * 基础分享事件（支付宝小程序）
             */
            share_base_event() {
                this.$refs.popupShareRef.close();
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

            /**
             * 商品海报分享
             */
            poster_event() {
                var user = app.globalData.get_user_info(this, 'poster_event');
                if (user != false) {
                    uni.showLoading({
                        title: this.$t('common.generating'),
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

            /**
             * APP端分享事件
             * @param {Object} e - 事件对象
             * @param {Object} e.currentTarget.dataset - 事件数据集
             * @param {String} e.currentTarget.dataset.provider - 分享提供商（如：weixin、qq）
             * @param {String} e.currentTarget.dataset.scene - 分享场景（如：WXSceneSession、WXSceneTimeline等）
             */
            share_app_event(e) {
                // 分享参数
                var provider = e.currentTarget.dataset.provider;
                var scene = e.currentTarget.dataset.scene || null;
                // 分享基础数据
                var share = app.globalData.share_content_handle(this.share_info || {});
                var img = this.images || share.img;
                var url = app.globalData.page_url_protocol((this.url || null) == null ? share.url : app.globalData.share_query_handle(this.url))
                var title = this.title || share.title;
                var summary = this.summary || share.desc;
                var type = this.type === null ? ((img || null) == null ? 1 : 0) : this.type;
                var mini_program = {};

                // #ifdef APP
                // 分享到好友，是否走微信小程序，则获取微信小程序原始id
                if (scene == 'WXSceneSession') {
                    var weixin_original_id = app.globalData.get_config('config.common_app_mini_weixin_share_original_id') || null;
                    if (weixin_original_id != null) {
                        type = 5;
                        mini_program = {
                            id: weixin_original_id,
                            path: url.split('#')[1],
                            type: 0,
                            webUrl: url,
                        };
                    }
                }
                // #endif

                // 关闭分享弹窗
                this.$refs.popupShareRef.close();
                // 调用分享组件
                uni.share({
                    provider: provider,
                    scene: scene,
                    type: type,
                    href: url,
                    title: title,
                    summary: summary,
                    imageUrl: img,
                    miniProgram: mini_program,
                    success: function (res) {},
                    fail: function (err) {},
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .share-popup {
        padding: 20rpx 10rpx;
        position: relative;
        /* #ifdef APP */
        padding: 28rpx 10rpx 20rpx 10rpx;
        /* #endif */
    }
    .share-popup-close {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        width: 72rpx;
        height: 72rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .share-popup-content {
        padding: 0 20rpx;
        padding-right: 72rpx;
        text-align: left;
        /* #ifdef APP */
        padding-top: 16rpx;
        /* #endif */
    }
    .share-items {
        padding: 24rpx 0;
        /* #ifndef APP-NVUE */
        min-height: 85rpx;
        /* #endif */
        display: flex;
        flex-direction: row;
        align-items: center;
        /* #ifdef APP */
        padding: 14rpx 0;
        /* #endif */
    }
    .share-item-inner {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .share-items .image {
        width: 80rpx;
        height: 80rpx;
        margin-right: 20rpx;
        flex-shrink: 0;
        vertical-align: middle;
    }
    /* #ifndef APP-NVUE */
    .share-items text {
        color: #999;
        /* #ifndef APP */
        font-size: 24rpx;
        line-height: 80rpx;
        /* #endif */
    }
    /* #endif */
    /* #ifndef APP-NVUE */
    .share-items:not(:first-child) {
        border-top: 1px solid #f0f0f0;
    }
    /* #endif */
    .share-items .btn {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100%;
        height: auto !important;
        min-height: 0 !important;
        line-height: normal !important;
        text-align: left;
        font-size: inherit;
        display: block;
        box-sizing: border-box;
    }
    /* #ifdef MP */
    .share-items .btn::after {
        border: none;
    }
    /* #endif */
    .single-text {
        /* #ifndef APP-NVUE */
        line-height: 80rpx;
        /* #endif */
    }
</style>

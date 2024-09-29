<template>
    <view :class="theme_view">
        <view class="collection">
            <view class="padding-main pr">
                <block v-if="(params.accounts_key || null) != null">
                    <view class="padding-lg bg-white radius-md margin-bottom-main tc">
                        <view class="flex-row jc-c qrcode">
                            <w-qrcode :options="qrcode"></w-qrcode>
                        </view>
                        <view class="code br-c radius flex-row">
                            <view class="num flex-1 flex-width flex-row align-c text-size-md">{{ params.accounts_key }}</view>
                            <view class="copy br-l-c text-size fw-b" :data-value="params.accounts_key" @tap.stop="text_copy_event">{{$t('collection.collection.856g12')}}</view>
                        </view>
                    </view>
                    <view class="cr-grey-9 margin-top-xxl flex-row">
                        <view class="pr">
                            <iconfont name="icon-sigh-o" size="32rpx"></iconfont>
                        </view>
                        <text class="margin-left-sm text-size-xs">{{$t('collection.collection.9p43lu')}}</text>
                    </view>
                </block>
                <block v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0"></component-no-data>
                </block>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                qrcode: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 设置参数
            this.setData({
                params: params,
                qrcode: {
                    code: params.accounts_key || null,
                    size: 280,
                }
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 复制文本
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            }
        },
    };
</script>
<style>
    @import './collection.css';
</style>

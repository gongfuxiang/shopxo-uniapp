<template>
    <view :class="theme_view">
        <view class="more cr-black padding-top-main padding-bottom-sm flex-row flex-wrap align-c" :class="propClass" @tap="open_popup">
            <text v-if="isMoreText">{{ $t('common.more_null') }}</text>
            <iconfont name="icon-category-more"></iconfont>
        </view>
        <!-- 弹窗 -->
        <component-popup :propShow="popup_status" :propIsBar="propIsBar" propPosition="top" :propMask="true" :propTop="propTop" @onclose="quick_close_event">
            <view class="padding-top-lg">
                <view class="padding-left-main padding-bottom-main">{{ $t('recommend-form.recommend-form.7gc30l') }}</view>
                <view class="divider-b">
                    <slot></slot>
                </view>
                <view class="tc padding-vertical-lg" @tap="quick_close_event">
                    <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                    <iconfont name="icon-arrow-top" color="#ccc"></iconfont>
                </view>
            </view>
        </component-popup>
    </view>
</template>

<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    export default {
        name: 'more',
        components: {
            componentPopup,
        },
        props: {
            propData: {
                type: Array,
                default: () => {
                    return [];
                },
            },
            // 顶部定位的距离
            propTop: {
                type: String,
                default: '',
            },
            propStatus: {
                type: Boolean,
                default: false,
            },
            propClass: {
                type: String,
                default: '',
            },
            themeBtn: {
                type: String,
                default: '1',
            },
            isMoreText: {
                type: Boolean,
                default: true,
            },
        },
        watch: {
            propStatus(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.setData({
                        popup_status: newVal,
                    });
                }
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: false,
                propIsBar: false,
            };
        },
        methods: {
            // 打开弹窗
            open_popup() {
                this.$emit('open-popup', true);
            },
            // 关闭弹窗
            quick_close_event(e) {
                this.$emit('open-popup', false);
            },
        },
    };
</script>

<style scoped>
    .more {
        width: 30rpx;
        padding: 15rpx 20rpx;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 101;
        white-space: normal;
        word-break: break-all;
    }
</style>

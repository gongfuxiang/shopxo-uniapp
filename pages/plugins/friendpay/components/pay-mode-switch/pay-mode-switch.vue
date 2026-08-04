<template>
    <view v-if="(pluginsData || null) != null && pluginsData.is_enable == 1" class="friendpay-mode-switch">
        <view class="friendpay-mode-card border-radius-main bg-white padding-main cp" :class="isFriendPay ? 'friendpay-mode-card-selected' : ''" @tap="toggle_event">
            <view class="flex-row align-c">
                <!-- pointer-events:none 避免小程序里自定义组件拦截点击导致无法冒泡到外层 -->
                <view class="friendpay-mode-icon-wrap margin-right-sm">
                    <iconfont name="icon-share" size="32rpx" color="#999"></iconfont>
                </view>
                <text class="fw-b text-size">{{ titleText }}</text>
                <view class="flex-1"></view>
                <view class="friendpay-mode-icon-wrap">
                    <iconfont :name="isFriendPay ? 'icon-selected-solid' : 'icon-not-selected'" size="40rpx" :color="isFriendPay ? theme_color : '#ccc'"></iconfont>
                </view>
            </view>
            <view v-if="contentLines.length > 0" class="margin-top-sm">
                <view v-for="(line, index) in contentLines" :key="index" class="cr-grey text-size-xs" :class="index > 0 ? 'margin-top-xs' : ''">{{ line }}</view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        name: 'component-friendpay-mode-switch',
        props: {
            propPluginsData: {
                type: Object,
                default: null,
            },
            propIsFriendPay: {
                type: [Number, Boolean],
                default: 0,
            },
        },
        data() {
            return {
                theme_color: app.globalData.get_theme_color(),
            };
        },
        computed: {
            // 插件数据
            pluginsData() {
                return this.propPluginsData;
            },
            // 是否朋友代付
            isFriendPay() {
                return parseInt(this.propIsFriendPay || 0) === 1;
            },
            // 页面文案
            pageText() {
                return (this.pluginsData || {}).page_text || {};
            },
            // 标题文案
            titleText() {
                return this.pageText.pay_mode_title || this.$t('friendpay.friendpay.pay_mode_title');
            },
            // 说明文案
            contentLines() {
                var lines = this.pageText.pay_mode_content;
                return Array.isArray(lines) ? lines : [];
            },
        },
        methods: {
            // 切换代付模式
            // 不用原生事件名 change，避免小程序端自定义事件与原生事件冲突
            toggle_event() {
                var value = this.isFriendPay ? 0 : 1;
                this.$emit('modeChange', value);
            },
        },
    };
</script>
<style scoped>
    .friendpay-mode-card {
        border: 2rpx solid #eee;
    }
    .friendpay-mode-card-selected {
        border-color: #E22C08;
        background: #fff9f7;
    }
    .friendpay-mode-icon-wrap {
        pointer-events: none;
    }
</style>

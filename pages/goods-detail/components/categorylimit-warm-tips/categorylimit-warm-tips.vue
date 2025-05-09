<template>
    <view :class="theme_view">
        <view v-if="popup_status && (propData || null) != null">
            <view class="plugins-categorylimit-warm-tips-mask wh-auto ht-auto pf"></view>
            <view class="plugins-categorylimit-warm-tips-content pf bg-white border-radius-main padding-xxl tc">
                <image :src="propData.warm_tips_alert_images" class="dis-block wh-auto radius" mode="aspectFit"></image>
                <view v-if="(propData.warm_tips_alert_msg || null) != null" class="margin-top-lg cr-base">{{propData.warm_tips_alert_msg}}</view>
                <button type="button" class="bg-main br-main cr-white round text-size-md margin-top-xxxl" @tap="close_event">{{$t('common.confirm')}}</button>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: true,
            };
        },
        props: {
            propData: {
            	type: [String,Object],
            	default: ''
            }
        },
        methods: {
            // 关闭弹窗
            close_event(e) {
                this.setData({
                    popup_status: false
                });
            }
        }
    };
</script>
<style scoped>
    .plugins-categorylimit-warm-tips-mask {
        left: 0;
        top: 0;
        background: rgb(0, 0, 0, 0.6);
        z-index: 10;
    }
    .plugins-categorylimit-warm-tips-content {
        z-index: 11;
        width: calc(100% - 240rpx);
        left: 50%;
        top: 50%;
        height: -webkit-max-content;
        height: max-content;
        transform: translate(-50%, -50%);
    }
</style>
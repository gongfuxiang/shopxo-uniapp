<template>
    <view v-if="propData.length > 0">
        <view class="data-list">
            <view v-for="(item, index) in propData" :key="index" class="items">
                <view class="items-content" :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" :style="'background-color:' + (item.bg_color || '#fff')">
                    <image :src="item.images_url" mode="aspectFit"></image>
                </view>
                <view class="title">{{item.name}}</view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {};
        },
        components: {},
        props: {
            propData: Array
        },
        methods: {
            navigation_event(e) {
                app.globalData.operation_event(e);
            }
        }
    };
</script>
<style>
    .data-list {
        overflow: hidden;
        margin-bottom: 20rpx;
    }
    .data-list .items {
        width: calc(20% - 40rpx);
        float: left;
        padding: 20rpx 20rpx 0 20rpx;
    }
    .items-content {
        border-radius: 50%;
        padding: 20rpx;
        text-align: center;
        width: 50rpx;
        height: 50rpx;
        margin: 0 auto;
        -webkit-box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
        box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
    }
    .data-list .items image {
        width: 50rpx !important;
        height: 50rpx !important;
    }
    .data-list .items .title {
        margin-top: 6rpx;
        font-size: 30rpx;
        text-align: center;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
        color: #888;
    }
</style>
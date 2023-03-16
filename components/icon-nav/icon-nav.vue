<template>
    <view>
        <view v-if="propData.length > 0" class="icon-nav-list">
            <view v-for="(item, index) in propData" :key="index" class="item">
                <view :class="'item-content '+((item.bg_color || null) == null ? 'item-exposed' : '')" :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" :style="((item.bg_color || null) == null ? '' : 'background-color:'+item.bg_color+';')">
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
    .icon-nav-list {
        overflow: hidden;
        margin-bottom: 20rpx;
    }
    .icon-nav-list .item {
        width: calc(20% - 20rpx);
        float: left;
        padding: 20rpx 10rpx 0 10rpx;
        /* #ifdef H5 */
        cursor: pointer;
        /* #endif */
    }
    .icon-nav-list .item .item-content {
        border-radius: 50%;
        padding: 20rpx;
        text-align: center;
        margin: 0 auto;
        -webkit-box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
        box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
    }
	.icon-nav-list .item .item-content,
    .icon-nav-list .item image {
        width: 50rpx !important;
        height: 50rpx !important;
    }
	.icon-nav-list .item .item-exposed {
		padding: 0;
		-webkit-box-shadow: none;
		box-shadow: none;
	}
	.icon-nav-list .item .item-exposed,
	.icon-nav-list .item .item-exposed image {
		width: 90rpx !important;
		height: 90rpx !important;
	}
    .icon-nav-list .item .title {
        margin-top: 6rpx;
        font-size: 28rpx;
        text-align: center;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
        color: #888;
    }
</style>
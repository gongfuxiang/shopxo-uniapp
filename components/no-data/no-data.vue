<template>
    <view>
        <!-- 1 加载中 -->
        <view v-if="propStatus == 1" class="no-data-box no-data-loading">
            <text>加载中...</text>
        </view>
        
        <!-- 2 处理错误 -->
        <view v-else-if="propStatus == 2" class="no-data-box">
            <image :src="error_images" mode="widthFix"></image>
            <view class="no-data-tips">{{propMsg || '处理错误'}}</view>
        </view>
        
        <!-- 0 默认没有数据 -->
        <view v-else-if="propStatus == 0" class="no-data-box">
            <image :src="empty_images" mode="widthFix"></image>
            <view class="no-data-tips">{{propMsg || '没有相关数据'}}</view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    var static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                error_images: static_url+'error.png',
                empty_images: static_url+'empty.png',
            };
        },
        components: {},
        props: {
            propStatus: Number,
            propMsg: String
        },
        methods: {}
    };
</script>
<style>
    .no-data-box {
        padding: 50% 0 60rpx 0;
        text-align: center;
    }
    .no-data-box image {
        width: 160rpx;
        margin-bottom: 30rpx;
    }
    .no-data-box .no-data-tips {
        font-size: 28rpx;
        color: #a6a6a6;
    }
    .no-data-loading text {
        color: #999;
    }
</style>

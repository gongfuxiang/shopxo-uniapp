<template>
    <view>
        <!-- 1 加载中 -->
        <view v-if="propStatus == 1" class="no-data-box no-data-loading">
            <text>加载中...</text>
        </view>
        
        <!-- 2 处理错误 -->
        <view v-else-if="propStatus == 2" class="no-data-box">
            <image :src="static_dir+'error.png'" mode="widthFix"></image>
            <view class="no-data-tips">{{propMsg || '处理错误'}}</view>
        </view>
        
        <!-- 0 默认没有数据 -->
        <view v-else-if="propStatus == 0" class="no-data-box">
            <image :src="static_dir+'empty.png'" mode="widthFix"></image>
            <view class="no-data-tips">{{propMsg || '没有相关数据'}}</view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                static_dir: '/static/images/common/',
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
        padding: 10% 0;
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
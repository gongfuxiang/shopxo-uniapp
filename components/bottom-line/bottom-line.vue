<template>
    <view :class="theme_view">
        <view v-if="(propStatus || false)" class="data-bottom-line">
            <view class="bottom-exclude">
                <view class="line-item left"></view>
                <view class="line-item msg">{{propMsg || $t('bottom-line.bottom-line.44bct2')}}</view>
                <view class="line-item right"></view>
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
            };
        },
        components: {},
        props: {
            propStatus: Boolean,
            propMsg: String
        },
        methods: {}
    };
</script>
<style>
    .data-bottom-line {
        padding: 40rpx;
        overflow: hidden;
    }
    .data-bottom-line .bottom-exclude {
        padding-bottom: env(safe-area-inset-bottom);
    }
    .data-bottom-line .line-item {
        width: 33.3%;
    }
    .data-bottom-line .line-item.left,
    .data-bottom-line .line-item.right {
        margin-top: 8px;
        border-bottom: 1px solid #e1e1e1;
    }
    .data-bottom-line .line-item.msg {
        color: #999;
        text-align: center;
        font-size: 24rpx;
    }
    .data-bottom-line .line-item.left,
    .data-bottom-line .line-item.msg {
        float: left;
    }
    .data-bottom-line .line-item.right {
        float: right;
    }
</style>
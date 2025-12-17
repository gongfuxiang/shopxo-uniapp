<template>
    <view :class="theme_view">
        <view v-if="(propStatus || false)" class="data-bottom-line">
            <view class="bottom-exclude flex-row align-c jc-c" :style="'width:' + new_width">
                <view class="line-item left line-item-left" :style="'width:' + split_width"></view>
                <text class="line-item msg" :style="'width:' + split_width">{{propMsg || $t('bottom-line.bottom-line.44bct2')}}</text>
                <view class="line-item right line-item-right" :style="'width:' + split_width"></view>
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
                split_width: '33%',
                new_width: '100%'
            };
        },
        components: {},
        props: {
            propStatus: Boolean,
            propMsg: String,
            propWidth: {
                type: Number,
                default: 0
            }
        },
        mounted() {
            if (this.propWidth > 0) {
                this.new_width = this.propWidth + 'px';
                this.split_width = ((this.propWidth - 40) / 3) + 'px';
            }
        },
        methods: {}
    };
</script>
<style lang="scss">
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
        margin-top: 16rpx;
        border-bottom: 2rpx solid #e1e1e1;
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

<template>
    <view class="search-hot-location flex-col align-c jc-c">
        <view v-if="propValue.length > 0" class="search-hot flex-row align-c gap-10 bg-white flex-wrap box-shadow-md">
            <view v-for="(item, index) in propValue" :key="index" class="text-size-md" :style="{ color: !isEmpty(prophotWordsColor) ? prophotWordsColor : item.color }" :data-value="item.value" @tap.stop="url_event">{{ item.value }}</view>
        </view>
        <view class="flex-col align-c">
            <view class="icon-top" />
            <iconfont name="icon-qiandao-tancguanbi" size="56rpx" color="#666" @tap="search_hot_close"></iconfont>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { isEmpty} from '@/common/js/common/common.js';
export default {
        props: {
            propValue: {
                type: Array,
                default: () => {
                    return [];
                },
            },
            prophotWordsColor: {
                type: String,
                default: () => {
                    return '';
                },
            }
        },
        data() {
            return {};
        },
        methods: {
            isEmpty,
            search_hot_close() {
                this.$emit('search_hot_close');
            },
            url_event(e) {
                if (!isEmpty(e.currentTarget.dataset.value)) {
                    this.$emit('search_hot_close');
                    app.globalData.url_open('/pages/goods-search/goods-search?keywords=' + e.currentTarget.dataset.value);
                }
            }
        },
    };
</script>

<style scoped lang="scss">
.search-hot {
    width: 100%;
    padding: 20rpx;
    min-height: 20rpx;
    transition: all 1s;
}
.search-hot-location {
    padding-left: 20rpx;
    padding-right: 20rpx;
    width: 100%;
    position: absolute;
    z-index: 1;
    box-sizing: content-box;
}
// 阴影
.box-shadow-md {
    box-shadow: 0 16rpx 32rpx -16rpx rgba(50, 55, 58, 0.1);
}
.icon-top {
    width: 4rpx;
    height: 20rpx;
    background: #666;
    position: relative;
    bottom: -1px;
}
</style>
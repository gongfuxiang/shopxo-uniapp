<template> 
    <view class="search-bar pr" :style="search_width_style">
        <view class="flex-1 search-bar-w">
            <view class="search-iconfont-container">
                <u-icon propName="search-fine"></u-icon>
            </view>
            <!-- #ifndef APP-NVUE-->
            <input class="flex-1" type="text" v-model="search_keywords" :adjust-position="false" placeholder-style="font-size:28rpx" :placeholder="$t('search.search.ic9b89')" @input="handle_search" @confirm="perform_search" />
            <!-- #endif-->
            <!-- #ifdef APP-NVUE-->
            <input class="flex-1" type="text" v-model="search_keywords" :adjust-position="false" placeholder-style="font-size:14px" :placeholder="$t('search.search.ic9b89')" @input="handle_search" @confirm="perform_search" />
            <!-- #endif-->
            <view class="search-line"></view>
            <text class="search-button" @tap="perform_search">{{$t('common.search')}}</text>
        </view>
        <!-- 禁用搜索时的蒙层，nvue页面不支持z-index属性 是按照顺序来判断层级-->
        <view v-if="propIsDisabled" class="search-mask" :style="search_width_style" @tap="disabled_search"></view>
    </view>
</template>

<script>
//#ifdef APP-NVUE
import i18n from '@/locale/index.js';
//#endif
export default {
    //#ifdef APP-NVUE
    i18n,
    //#endif
    props: {
        propSearchQuery: {
            type: String,
            default: ''
        },
        propIsDisabled: {
            type: Boolean,
            default: false
        },
        propWidth: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            search_keywords: '',
            search_width_style: '',
        }
    },
    watch: {
        propSearchQuery: {
            handler(newVal, oldVal) {
                this.search_keywords = newVal;
            },
            immediate: true
        },
        propWidth: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal && newVal > 0) {
                    this.search_width_style = 'width:' + newVal - 40 + 'px !important ;';
                }
            },
            immediate: true
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.search_keywords = this.search_keywords;
        },
        handle_search(event) {
            this.search_keywords = event.target.value;
        },
        perform_search() {
            // 这里可以添加搜索逻辑
            this.$emit('search', this.search_keywords);
        },
        disabled_search() {
            this.$emit('disabledSearch');
        }
    }
}
</script>

<style lang="scss" scoped>
.search-bar-w {
    width: 100%;
    height: 80rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
}
/* 搜索框 */
.search-bar {
	background: rgba(255,255,255,0.5);
	border-radius: 38rpx;
	border: 2rpx solid #313131;
    height: 80rpx;
	margin: 0 24rpx 0 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}
.search-iconfont-container {
    padding: 16rpx 30rpx;
    padding-right: 20rpx;
}
input {
    flex: 1;
    height: 76rpx;
    padding: 16rpx 0;
    box-sizing: border-box;
    background: transparent;
}
.search-line {
    width: 2rpx;
    height: 44rpx;
    margin: 16rpx 0;
    margin-left: 20rpx;
    box-sizing: border-box;
    background-color: #666;
}
.search-button { 
    font-weight: 500;
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
    padding: 16rpx 30rpx 16rpx 20rpx;
}
.search-mask {
    position: absolute;
    top: 0;
    left: 0;
    //#ifdef APP-NVUE
    width: 750rpx;
    //#endif
    //#ifndef APP-NVUE
    width: 100%;
    //#endif
    height: 80rpx;
    z-index: 99;
}
</style>

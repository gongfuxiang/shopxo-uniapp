<template> 
    <view class="search-bar pr">
        <view v-if="propIsDisabled" class="search-mask" @tap="disabled_search"></view>
        <view class="search-iconfont-container">
            <iconfont name="icon-search-fine"></iconfont>
        </view>
        <input type="text" v-model="search_query" :adjust-position="false" placeholder="请输入您的搜索内容" @input="handle_search" />
        <view class="search-line"></view>
        <view class="search-button" @tap="perform_search">搜索</view>
    </view>
</template>

<script>
export default {
    props: {
        propSearchQuery: {
            type: String,
            default: ''
        },
        propIsDisabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search_query: ''
        }
    },
    watch: {
        propSearchQuery: {
            handler(newVal, oldVal) {
                this.search_query = newVal;
            },
            immediate: true
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.setData({
                search_query: this.search_query
            })
        },
        handle_search(event) {
            this.setData({
                search_query: event.target.value,
            });
        },
        perform_search() {
            // 这里可以添加搜索逻辑
            this.$emit('search', this.search_query);
        },
        disabled_search() {
            this.$emit('disabledSearch');
        }
    }
}
</script>

<style lang="scss" scoped>
/* 搜索框 */
.search-bar {
	display: flex;
	align-items: center;
	background: rgba(255,255,255,0.5);
	border-radius: 38rpx;
	border: 2rpx solid #313131;
    height: 100%;
	margin: 0 24rpx;
	.search-iconfont-container {
		padding: 16rpx 30rpx;
		padding-right: 20rpx;
	}
	input {
		flex: 1;
		height: 100%;
		padding: 16rpx 0;
		box-sizing: border-box;
        background: transparent;
	}
	.search-line {
		width: 2rpx;
		height: 100%;
		padding: 16rpx 0;
		margin-left: 20rpx;
		background-color: #eee;
	}
	.search-button { 
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
		line-height: 20px;
		padding: 16rpx 30rpx 16rpx 20rpx;
	}
    .search-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
}
</style>
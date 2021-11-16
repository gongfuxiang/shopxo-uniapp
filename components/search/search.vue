<template>
    <view>
        <view class="search-content">
            <icon type="search" size="12"></icon>
            <input type="text" confirm-type="search" :placeholder="propPlaceholder" placeholder-class="cr-grey" class="cr-base round wh-auto dis-block" @confirm="search_input_event" :style="'background:'+propBgColor+';'+((propBrColor || null) != null ? 'border:1px solid '+propBrColor+';' : '')">
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
            propUrl: {
            	type: String,
            	default: '/pages/goods-search/goods-search'
            },
            propFormName: {
            	type: String,
            	default: 'keywords'
            },
            propPlaceholder: {
            	type: String,
            	default: '其实搜索很简单 ^_^!'
            },
            propBgColor: {
            	type: String,
            	default: '#f0f0f0'
            },
            propBrColor: {
            	type: String,
            	default: ''
            }
        },
        methods: {
            // 搜索事件
            search_input_event(e) {
                var keywords = e.detail.value || null;
                if (keywords == null) {
                    app.globalData.showToast("请输入搜索关键字");
                    return false;
                }
            
                // 进入搜索页面
                uni.navigateTo({
                    url: this.propUrl+'?'+this.propFormName+'=' + keywords
                });
            },
        }
    };
</script>
<style>
    .search-content {
        position: relative;
    }
    .search-content icon {
        position: absolute;
        left: 30rpx;
        top: calc(50% - 6px);
    }
    .search-content input {
        font-size: 26rpx;
        padding: 0 30rpx 0 76rpx;
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
    }
</style>
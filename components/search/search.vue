<template>
    <view>
        <view class="search-content pr">
            <view class="search-icon dis-inline-block pa" @tap="search_icon_event">
                <uni-icons :type="propIcon" size="12" :color="propIconColor"></uni-icons>
            </view>
            <input type="text" confirm-type="search" class="round wh-auto dis-block" :placeholder="propPlaceholder" :placeholder-class="propPlaceholderClass" @confirm="search_input_event" :style="'color:'+propTextColor+';background:'+propBgColor+';'+((propBrColor || null) != null ? 'border:1px solid '+propBrColor+';' : '')">
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
            propPlaceholderClass: {
            	type: String,
            	default: 'cr-grey'
            },
            propTextColor: {
            	type: String,
            	default: '#666'
            },
            propBgColor: {
            	type: String,
            	default: '#f0f0f0'
            },
            propBrColor: {
            	type: String,
            	default: ''
            },
            propIsRequired: {
            	type: Boolean,
            	default: true
            },
            propIsOnEvent: {
            	type: Boolean,
            	default: false
            },
            propIcon: {
            	type: String,
            	default: 'search'
            },
            propIconColor: {
            	type: String,
            	default: '#b7b7b7'
            },
            propIsIconOnEvent: {
            	type: Boolean,
            	default: false
            },
        },
        methods: {
            // 搜索事件
            search_input_event(e) {
                var keywords = e.detail.value || null;
                
                // 是否验证必须要传值
                if (this.propIsRequired && keywords == null) {
                    app.globalData.showToast("请输入搜索关键字");
                    return false;
                }
                
                // 是否回调事件
                if(this.propIsOnEvent) {
                    this.$emit('onsearch', keywords);
                } else {
                    // 进入搜索页面
                    uni.navigateTo({
                        url: this.propUrl+'?'+this.propFormName+'=' + keywords
                    });
                }
            },
            
            // icon事件
            search_icon_event(e) {
                // 是否回调事件
                if(this.propIsIconOnEvent) {
                    this.$emit('onicon', {});
                }
            }
        }
    };
</script>
<style>
    .search-content .search-icon {
        line-height: 12px;
        left: 10px;
        top: calc(50% - 11px);
        z-index: 1;
        padding: 5px;
    }
    .search-content input {
        font-size: 12px;
        padding: 0 15px 0 38px;
        box-sizing: border-box;
        height: 30px;
        line-height: 30px;
    }
</style>
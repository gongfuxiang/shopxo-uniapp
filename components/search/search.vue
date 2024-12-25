<template>
    <view :class="theme_view">
        <view :class="'search-content pr round '+propSize" :style="'background:' + propBgColor + ';' + ((propBrColor || null) != null ? 'border:1px solid ' + propBrColor + ';' : '')">
            <view class="search-icon dis-inline-block pa" :style="'padding:' + propPadding" @tap="search_icon_event">
                <iconfont :name="propIcon" :color="propIconColor" size="24rpx"></iconfont>
            </view>
            <input
                type="text"
                confirm-type="search"
                :class="'input round wh-auto dis-block '+propClass"
                :placeholder="(propPlaceholder || propPlaceholderValue || this.$t('search.search.660us5'))"
                :placeholder-class="propPlaceholderClass"
                :value="propDefaultValue"
                :focus="propFocus"
                @input="search_input_value_event"
                @confirm="search_submit_confirm_event"
                @focus="search_input_focus_event"
                @blur="search_input_blur_event"
                :style="'color:' + propTextColor + ';'"
            />
            <button v-if="propIsBtn" class="search-btn pa bg-main" size="mini" type="default" @tap="search_submit_confirm_event">{{$t('common.search')}}</button>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                input_value: '',
            };
        },
        components: {},
        props: {
            propUrl: {
                type: String,
                default: '/pages/goods-search/goods-search',
            },
            propFormName: {
                type: String,
                default: 'keywords',
            },
            propDefaultValue: {
                type: String,
                default: '',
            },
            propPlaceholder: {
                type: String,
                default: '',
            },
            propPlaceholderValue: {
                type: String,
                default: '',
            },
            propPlaceholderClass: {
                type: String,
                default: 'cr-grey-c',
            },
            propClass: {
                type: String,
                default: '',
            },
            propTextColor: {
                type: String,
                default: '#666',
            },
            propBgColor: {
                type: String,
                default: '#fff',
            },
            propBrColor: {
                type: String,
                default: '',
            },
            propIsRequired: {
                type: Boolean,
                default: true,
            },
            propIsOnEvent: {
                type: Boolean,
                default: false,
            },
            propIsOnFocusEvent: {
                type: Boolean,
                default: false,
            },
            propIsOnBlurEvent: {
                type: Boolean,
                default: false,
            },
            propIsOnInputEvent: {
                type: Boolean,
                default: false,
            },
            propIcon: {
                type: String,
                default: 'icon-search-max',
            },
            propIconColor: {
                type: String,
                default: '#ccc',
            },
            propIsIconOnEvent: {
                type: Boolean,
                default: false,
            },
            propIsBtn: {
                type: Boolean,
                default: false,
            },
            propSize: {
                type: String,
                default: '',
            },
            propFocus: {
                type: Boolean,
                default: false,
            },
            propPadding: {
                type: String,
                default: '16rpx 20rpx 0 20rpx;',
            },
        },
        // 属性值改变监听
        watch: {
            // 默认值
            propDefaultValue(value, old_value) {
                this.setData({
                    input_value: value,
                });
            }
        },
        // 页面被展示
        created: function () {
            this.setData({
                input_value: this.propDefaultValue
            });
        },
        methods: {
            // 搜索输入事件
            search_input_value_event(e) {
                this.setData({
                    input_value: e.detail.value,
                });
                // 是否回调事件
                if (this.propIsOnInputEvent) {
                    this.$emit('oninput', e.detail.value);
                }
            },

            // 搜索失去焦点事件
            search_input_blur_event(e) {
                this.setData({
                    input_value: e.detail.value,
                });
                // 是否回调事件
                if (this.propIsOnBlurEvent) {
                    this.$emit('onblur', e.detail.value);
                }
            },

            // 搜索获取焦点事件
            search_input_focus_event(e) {
                this.setData({
                    input_value: e.detail.value,
                });
                // 是否回调事件
                if (this.propIsOnFocusEvent) {
                    this.$emit('onfocus', e.detail.value);
                }
            },

            // 搜索确认事件
            search_submit_confirm_event() {
                // 是否验证必须要传值
                var value = this.input_value || this.propPlaceholderValue;
                if (this.propIsRequired && value === '') {
                    app.globalData.showToast(this.$t('search.search.ic9b89'));
                    return false;
                }

                // 是否回调事件
                if (this.propIsOnEvent) {
                    this.$emit('onsearch', value);
                } else {
                    // 进入搜索页面
                    app.globalData.url_open(this.propUrl + '?' + this.propFormName + '=' + value);
                }
            },

            // 搜索确认（外部调用直接跳转搜索）
            search_submit_confirm(value = '') {
                app.globalData.url_open(this.propUrl + '?' + this.propFormName + '=' + value);
            },

            // icon事件
            search_icon_event() {
                // 是否回调事件
                if (this.propIsIconOnEvent) {
                    this.$emit('onicon', {});
                }
            },
        },
    };
</script>
<style scoped>
    .search-content .search-icon {
        z-index: 1;
        left: 0;
        top: 0;
        line-height: 28rpx;
        height: 42rpx;
    }
    .search-content .input {
        box-sizing: border-box;
        font-size: 24rpx;
        padding: 0 32rpx 0 64rpx;
        height: 56rpx;
        line-height: 56rpx;
        background: transparent;
    }
    .search-content .search-btn {
        width: 106rpx;
        height: 46rpx;
        line-height: 46rpx;
        font-size: 28rpx;
        border-radius: 30rpx;
        padding: 0;
        color: #fff;
        right: 6rpx;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
    }

    .search-content.sm .search-icon {
        padding-top: 18rpx;
    }
    .search-content.sm .input {
        height: 60rpx;
        line-height: 60rpx;
        font-size: 26rpx;
    }
    .search-content.sm .search-btn {
        height: 50rpx;
        line-height: 50rpx;
    }

    .search-content.md .search-icon {
        padding-top: 22rpx;
    }
    .search-content.md .input {
        height: 66rpx;
        line-height: 66rpx;
        font-size: 28rpx;
    }
    .search-content.md .search-btn {
        height: 56rpx;
        line-height: 56rpx;
    }
</style>

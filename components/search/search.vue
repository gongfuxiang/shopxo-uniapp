<template>
    <view :class="theme_view">
        <view :class="'search-content pr round '+propSize+(propRightIcon ? ' has-right-icon' : '')+(propIsBtn ? ' has-search-btn' : '')" :style="'background:' + propBgColor + ';' + ((propBrColor || null) != null ? 'border:1px solid ' + propBrColor + ';' : '')">
            <slot name="left"></slot>
            <view v-if="propIsIcon" class="search-icon dis-inline-block pa" :style="'padding:' + propPadding" @tap="search_icon_event">
                <iconfont :name="propIcon" :color="propIconColor" size="24rpx"></iconfont>
            </view>
            <view v-if="propIsEnterSearchStart" @tap="seat_input_event" :class="'input '+propClass+' '+propPlaceholderClass+' '+(propIsIcon ? ' input-left-icon' : '')+' '+(propIsBtn ? ' input-search-btn' : '')+(propRightIcon ? ' input-right-icon' : '')">{{propPlaceholder || propPlaceholderValue || this.$t('search.search.660us5')}}</view>
            <input
                v-else
                type="text"
                confirm-type="search"
                :class="'input round dis-block '+propClass+' '+(propIsIcon ? ' input-left-icon' : '')+' '+(propIsBtn ? ' input-search-btn' : '')+(propRightIcon ? ' input-right-icon' : '')"
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
            <view v-if="propRightIcon" class="search-right-icon pa flex-row align-c jc-c" @tap.stop="search_right_icon_event">
                <iconfont :name="propRightIcon" :color="propRightIconColor" :size="propRightIconSize"></iconfont>
            </view>
            <button v-if="propIsBtn" :class="'search-btn pa '+propBtnClass"  size="mini" type="default" @tap="search_submit_confirm_event">{{$t('common.search')}}</button>
            <slot name="right"></slot>
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
            propIsIcon: {
                type: Boolean,
                default: true,
            },
            propIsIconOnEvent: {
                type: Boolean,
                default: false,
            },
            // 右侧自定义图标（如以图搜款相机）
            propRightIcon: {
                type: String,
                default: '',
            },
            propRightIconColor: {
                type: String,
                default: '#999',
            },
            propRightIconSize: {
                type: String,
                default: '32rpx',
            },
            propIsRightIconOnEvent: {
                type: Boolean,
                default: true,
            },
            propIsBtn: {
                type: Boolean,
                default: false,
            },
            propBtnClass: {
                type: String,
                default: 'bg-main cr-white text-size-md',
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
            propIsEnterSearchStart: {
                type: Boolean,
                default: false,
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
                if(this.propIsEnterSearchStart) {
                    this.seat_input_event();
                } else {
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
                } else {
                    // 图标没有事件，开启了进入占位搜索页面则直接进去
                    if(this.propIsEnterSearchStart) {
                        this.seat_input_event();
                    }
                }
            },

            // 右侧图标事件
            search_right_icon_event() {
                if (this.propIsRightIconOnEvent) {
                    this.$emit('onrighticon', {});
                }
            },

            // 占位搜索事件
            seat_input_event(e) {
                app.globalData.url_open('/pages/goods-search-start/goods-search-start');
            }
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
        padding: 0;
        height: 56rpx;
        line-height: 56rpx;
        background: transparent;
    }
    .search-content .input.input-left-icon.input-search-btn {
        width: calc(100% - 184rpx);
        margin-left: 64rpx;
    }
    .search-content .input:not(.input-left-icon) {
        margin-left: 20rpx;
        width: calc(100% - 136rpx);
    }
    .search-content .input:not(.input-search-btn) {
        margin-left: 64rpx;
        width: calc(100% - 84rpx);
    }
    .search-content .input:not(.input-left-icon):not(.input-search-btn) {
        width: calc(100% - 40rpx);
        margin-left: 20rpx;
    }
    /* 有右侧图标时，为图标预留空间 */
    .search-content.has-right-icon.has-search-btn .input.input-left-icon.input-search-btn {
        width: calc(100% - 248rpx);
    }
    .search-content.has-right-icon.has-search-btn .input:not(.input-left-icon).input-search-btn {
        width: calc(100% - 200rpx);
    }
    .search-content.has-right-icon:not(.has-search-btn) .input.input-left-icon {
        width: calc(100% - 132rpx);
    }
    .search-content.has-right-icon:not(.has-search-btn) .input:not(.input-left-icon) {
        width: calc(100% - 88rpx);
    }
    .search-content .search-right-icon {
        width: 56rpx;
        height: 100%;
        top: 0;
        right: 6rpx;
        z-index: 2;
    }
    .search-content.has-search-btn .search-right-icon {
        right: 118rpx;
    }
    .search-content .search-btn {
        width: 106rpx;
        height: 46rpx;
        line-height: 46rpx;
        border-radius: 30rpx;
        padding: 0;
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

<template>
    <view :class="theme_view">
        <!-- 弹窗 -->
        <component-popup :propShow="popup_status" :propIsBar="propIsBar" propPosition="bottom" @onclose="lang_close_event">
            <view class="lang-popup-container">
                <view class="close oh flex-row">
                    <view class="fr" @tap="lang_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <div class="lang-popup-title">{{ $t('common.multilingual') }}</div>
                <view class="lang-popup-content">
                    <view v-if="!isEmpty(language_list)" class="nav-data-list">
                        <view v-for="(value, key) in language_list" :key="key" class="lang-popup-list flex-row jc-sb align-c" :class="language_key == key ? 'cr-main' : ''" :data-key="key" :data-value="value" @tap.stop="checked_language_event">
                            {{ value }}
                            <iconfont v-if="language_key == key" name="icon-checked" size="32rpx"></iconfont>
                        </view>
                        <view class="margin-top-xxxl">
                            <view class="bottom-line-exclude oh">
                                <button type="default" class="bg-main br-main cr-white round text-size " @tap="popup_sub_language_event">{{ $t('common.confirm') }}</button>
                            </view>
                        </view>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="0"></component-no-data>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        components: {
            componentPopup,
            componentNoData
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: false,
                propIsBar: false,
                language_list: [],
                language_key: '',
            };
        },
        methods: {
            isEmpty,
            lang_open_event() {
                var language_key = app.globalData.get_language_value();
                console.log(language_key)
                var language_list = this.$t('language');
                this.setData({
                    language_list: language_list,
                    language_key: language_key,
                    popup_status: true,
                });  
            },
            lang_close_event() {
                this.setData({
                    popup_status: false,
                });
            },
            checked_language_event(e) {
                this.setData({
                    language_key: e.currentTarget.dataset.key,
                });
            },
            popup_sub_language_event() {
                this.language_change(this.language_key);
                this.setData({
                    popup_status: false,
                });
                var language_list = this.$t('language');
                this.$emit('popup_sub_language_event', language_list[this.language_key]);
            },
            // 多语言切换
            language_change(key) {
                uni.setLocale(key);
                this.$i18n.locale = key;
            },
        }
    };
</script>
<style scoped>
    /**
     * 弹窗
     */
    .lang-popup-container {
        padding: 20rpx 10rpx 0 10rpx;
        background: #fff;
    }

    .lang-popup-container .close {
        position: absolute;
        top: 24rpx;
        right: 20rpx;
        z-index: 2;
    }
    .lang-popup-title {
        position: absolute;
        top: 20rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        font-size: 32rpx;
    }

    .lang-popup-content {
        max-height: 80vh;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 50rpx 20rpx;
        padding-bottom: 40rpx;
    }
    .lang-popup-list {
        padding: 20rpx 0;
        border-bottom: 1px solid #f5f5f5;
        font-size: 32rpx;
    }
</style>
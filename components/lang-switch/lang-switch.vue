<template>
    <view :class="theme_view">
        <!-- 弹窗 -->
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="lang_close_event">
            <view class="lang-popup-container">
                <!--弹出框关闭按钮 -->
                <view class="close oh flex-row">
                    <view class="fr" @tap="lang_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <!--弹出框标题 -->
                <div class="lang-popup-title">{{ $t('common.multilingual') }}</div>
                <view class="lang-popup-content">
                    <view v-if="!isEmpty(language_list)" class="nav-data-list">
                        <view v-for="(value, key) in language_list" :key="key" class="lang-popup-list flex-row jc-sb align-c" :class="language_key == key ? 'cr-main' : ''" :data-key="key" :data-value="value" @tap.stop="checked_language_event">
                            {{ value }}
                            <iconfont v-if="language_key == key" name="icon-checked" size="32rpx"></iconfont>
                        </view>
                        <!-- 确认按钮 -->
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
                popup_status: false, // 弹出框的开关
                language_list: [], // 多语言数组
                language_key: '', // 选中的多语言
            };
        },
        methods: {
            isEmpty,
            // 打开弹出框
            lang_open_event() {
                // 获取当前的多语言
                var language_key = app.globalData.get_language_value();
                // 获取多语言数组
                var language_list = this.$t('language');
                this.setData({
                    language_list: language_list,
                    language_key: language_key,
                    popup_status: true,
                });  
            },
            // 关闭弹出框
            lang_close_event() {
                this.setData({
                    popup_status: false,
                });
            },
            // 弹出框选中数据更新
            checked_language_event(e) {
                this.setData({
                    language_key: e.currentTarget.dataset.key,
                });
            },
            // 点击确定按钮执行的操作
            popup_sub_language_event() {
                // 多语言切换
                this.language_change(this.language_key);
                // 关闭弹出框
                this.setData({
                    popup_status: false,
                });
                // 将当前选中的多语言返回给父级使用
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
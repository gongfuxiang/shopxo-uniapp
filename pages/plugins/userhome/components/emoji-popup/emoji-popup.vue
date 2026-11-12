<template>
    <view :class="theme_view">
        <!-- z-index 高于发布/评论弹层，避免被盖住 -->
        <component-popup :propShow="popup_status" propPosition="bottom" :propIndex="1000" propStyle="z-index:1001;" @onclose="popup_close_event">
            <view class="emoji-popup bg-white">
                <view class="close oh pa top-0 right-0 z-i-deep">
                    <view class="fr padding-top padding-right padding-left-sm padding-bottom-sm" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="emoji-popup-content oh tc">
                    <block v-if="emoji_list.length > 0">
                        <block v-for="(item, index) in emoji_list" :key="index">
                            <view class="emoji-item fl bs-bb text-size-xxxl" @tap="choice_confirm_event" :data-value="item.emoji">{{ item.emoji }}</view>
                        </block>
                    </block>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: false,
                emoji_list: [],
            };
        },
        components: {
            componentPopup,
        },
        methods: {
            init(config = {}) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                this.setData({
                    popup_status: config.status == undefined ? true : config.status,
                    emoji_list: config.emoji_list || [],
                });
            },
            popup_close_event() {
                this.setData({
                    popup_status: false,
                });
            },
            choice_confirm_event(e) {
                this.setData({
                    popup_status: false,
                });
                var back_data = (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.value) || '';
                uni.setStorageSync(app.globalData.data.cache_emoji_popup_key, back_data);
                this.$emit('choiceConfirmEvent', back_data);
            },
        },
    };
</script>
<style scoped>
    .emoji-popup {
        padding: 20rpx 10rpx 0 10rpx;
        position: relative;
    }
    .emoji-popup-content {
        max-height: 50vh;
        overflow-y: scroll;
        overflow-x: hidden;
        margin-top: 20rpx;
    }
    .emoji-popup-content .emoji-item {
        height: 130rpx;
        line-height: 130rpx;
        width: 25%;
    }
</style>

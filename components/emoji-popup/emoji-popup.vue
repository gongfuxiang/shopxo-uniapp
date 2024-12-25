<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="emoji-popup bg-white">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="emoji-popup-content oh tc">
                    <block v-if="emoji_list.length > 0">
                        <block v-for="(item, index) in emoji_list" :key="index">
                            <view class="emoji-item fl bs-bb text-size-xxxl" @tap="choice_confirm_event" :data-value="item.emoji">{{item.emoji}}</view>
                        </block>
                    </block>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    import componentPopup from "@/components/popup/popup";
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                popup_status: false,
                emoji_list: []
            };
        },

        components: {
            componentPopup
        },

        created: function() {},

        methods: {
            // 初始配置
            init(config = {}) {
                if(!app.globalData.is_single_page_check()) {
                    return false;
                }
                this.setData({
                    popup_status: config.status == undefined ? true : config.status,
                    emoji_list: config.emoji_list || [],
                });
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false
                });
            },

            // 选择确认事件
            choice_confirm_event(e) {            
                // 关闭弹窗
                this.setData({
                    popup_status: false
                });
            
                // 调用父级
                this.$emit('choiceConfirmEvent', e.currentTarget.dataset.value);
            }
        }
    };
</script>
<style>
    .emoji-popup {
        padding: 20rpx 10rpx 0 10rpx;
        position: relative;
    }
    .emoji-popup .close {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        z-index: 2;
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
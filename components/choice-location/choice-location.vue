<template>
    <view :class="theme_view">
        <view v-if="propIsShowAddressChoice" class="choice-location padding-right-xxxl pr" @tap="choose_user_location">
            <view class="dis-inline-block va-m lh">
                <iconfont name="icon-location" :size="propIconLocationSize" propClass="lh" :color="propIconLocationColor"></iconfont>
            </view>
            <view class="va-m dis-inline-block margin-left-xs text-size-md single-text text" :style="'max-width:'+propTextMaxWidth+';'">{{ location.text || '' }}</view>
            <view class="va-m lh dis-inline-block margin-left-xs">
                <iconfont name="icon-arrow-bottom" :size="propIconArrowSize" propClass="lh-xs" :color="propIconArrowColor"></iconfont>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                location: {},
                cloice_location_timer: null
            };
        },
        props: {
            propIsShowAddressChoice: {
                type: Boolean,
                default: true,
            },
            propTextMaxWidth: {
                type: String,
                default: '100%',
            },
            propIconLocationColor: {
                type: String,
                default: '#fff',
            },
            propIconLocationSize: {
                type: String,
                default: '32rpx',
            },
            propIconArrowColor: {
                type: String,
                default: '#fff',
            },
            propIconArrowSize: {
                type: String,
                default: '24rpx',
            },
        },
        // 页面被展示
        created: function () {
            this.init();
        },
        methods: {
            // 初始化
            init() {
                this.setData({
                    location: app.globalData.choice_user_location_init()
                });
            },

            // 选择位置监听
            choose_user_location(e) {
                // 定时任务
                clearInterval(this.cloice_location_timer);
                var self = this;
                var timer = setInterval(function () {
                    var result = app.globalData.choice_user_location_init() || null;
                    if(result != null && (result.status == 1 || result.status == 3)) {
                        self.setData({
                            location: result
                        });
                        clearInterval(self.cloice_location_timer);

                        // 回调事件
                        self.$emit('onback', result);
                    }
                }, 1000);
                this.setData({
                    cloice_location_timer: timer
                });

                // 进入位置选择
                app.globalData.choose_user_location_event();
            }
        }
    };
</script>
<style scoped>
    .choice-location {
        height: 56rpx;
        line-height: 56rpx;
    }
</style>
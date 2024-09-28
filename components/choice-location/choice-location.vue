<template>
    <view :class="theme_view">
        <view class="choice-location single-text padding-right pr" @tap="choose_user_location_event">
            <view class="dis-inline-block va-m lh">
                <iconfont name="icon-location" size="32rpx" propClass="lh" color="#fff"></iconfont>
            </view>
            <text class="va-m margin-left-xs text-size-md">{{ location.text || '' }}</text>
            <view class="lh pa right-0 top-xxxl">
                <iconfont name="icon-arrow-bottom" size="24rpx" propClass="lh-xs" color="#fff"></iconfont>
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
        props: {},
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
                console.log(this.location)
            },

            // 选择位置监听
            choose_user_location_event(e) {
                // 定时任务
                clearInterval(this.cloice_location_timer);
                var self = this;
                var timer = setInterval(function () {
                    var result = app.globalData.choice_user_location_init() || null;
                    console.log(result);
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
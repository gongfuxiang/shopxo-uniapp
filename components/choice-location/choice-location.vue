<template>
    <view :class="theme_view">
        <view v-if="propIsShowAddressChoice" class="choice-location pr wh-auto flex-row gap-2 align-c" @tap="choose_user_location">
            <view v-if="propIsLeftIconArrow" :class="['dis-inline-block va-m lh', { 'wh-auto': propLeftImgValue.length > 0 }]">
                <block v-if="propLeftImgValue.length > 0">
                    <image :src="propLeftImgValue[0].url" class="dis-block wh-auto" mode="aspectFit"></image>
                </block>
                <block v-else>
                    <iconfont :name="propLeftIconValue" :size="propIconLocationSize" propClass="lh" :color="propIconLocationColor || propBaseColor"></iconfont>
                </block>
            </view>
            <view class="va-m dis-inline-block margin-left-xs text-size-md single-text text" :style="'max-width:' + propTextMaxWidth + ';color:' + (propTextColor || propBaseColor) + ';'">{{ location.text || '' }}</view>
            <view v-if="propIsRightIconArrow" :class="['va-m lh dis-inline-block margin-left-xs', { 'wh-auto': propRightImgValue.length }]">
                <block v-if="propRightImgValue.length > 0">
                    <image :src="propRightImgValue[0].url" class="dis-block wh-auto" mode="aspectFit"></image>
                </block>
                <block v-else>
                    <iconfont :name="propRightIconValue" :size="propIconArrowSize" propClass="lh-xs" :color="propIconArrowColor || propBaseColor"></iconfont>
                </block>
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
                cloice_location_timer: null,
            };
        },
        props: {
            propIsShowAddressChoice: {
                type: Boolean,
                default: true,
            },
            propBaseColor: {
                type: String,
                default: '#fff',
            },
            propTextDefaultName: {
                type: String,
                default: '',
            },
            propTextColor: {
                type: String,
                default: '',
            },
            propTextMaxWidth: {
                type: String,
                default: '100%',
            },
            propIconLocationColor: {
                type: String,
                default: '',
            },
            propIconLocationSize: {
                type: String,
                default: '28rpx',
            },
            propIconArrowColor: {
                type: String,
                default: '',
            },
            propIconArrowSize: {
                type: String,
                default: '24rpx',
            },
            propIsLeftIconArrow: {
                type: Boolean,
                default: true,
            },
            propLeftImgValue: {
                type: Array,
                default: [],
            },
            propLeftIconValue: {
                type: String,
                default: 'icon-location',
            },
            propIsRightIconArrow: {
                type: Boolean,
                default: true,
            },
            propRightImgValue: {
                type: Array,
                default: [],
            },
            propRightIconValue: {
                type: String,
                default: 'icon-arrow-bottom',
            },
        },
        // 页面被展示
        created: function () {
            this.init();
        },
        methods: {
            // 初始化
            init() {
                let location = app.globalData.choice_user_location_init();
                if ((this.propTextDefaultName || null) != null) {
                    var default_name = this.$t('shopxo-uniapp.app.4v6q86');
                    if (location.text == default_name) {
                        location.text = this.propTextDefaultName;
                    }
                }
                this.setData({
                    location: location,
                });
            },

            // 选择位置监听
            choose_user_location(e) {
                // 定时任务
                clearInterval(this.cloice_location_timer);
                var self = this;
                var timer = setInterval(function () {
                    var result = app.globalData.choice_user_location_init() || null;
                    if (result != null && (result.status == 1 || result.status == 3)) {
                        self.setData({
                            location: result,
                        });
                        clearInterval(self.cloice_location_timer);

                        // 回调事件
                        self.$emit('onback', result);
                    }
                }, 1000);
                this.setData({
                    cloice_location_timer: timer,
                });

                // 进入位置选择
                app.globalData.choose_user_location_event();
            },
        },
    };
</script>
<style scoped>
    .choice-location {
        height: 56rpx;
        line-height: 56rpx;
    }
    .dis-block {
        height: 56rpx;
    }
</style>

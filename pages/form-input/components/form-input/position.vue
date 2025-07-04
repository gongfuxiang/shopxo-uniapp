<template>
    <view class="flex-col gap-10">
        <!-- 定位 -->
        <view class="pc-disable flex-row align-c jc-c w h" :style="com_data.common_style" @tap="choose_user_location">
            <view class="flex-row align-c jc-c gap-10 pa-5">
                <iconfont name="icon-latitude-location" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                获取定位
            </view>
        </view>
        <view v-if="!isEmpty(form_value)" class="flex-col gap-10 jc-c">
            <view class="flex-row align-c gap-5">
                <iconfont name="icon-location" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                <view class="nowrap">{{ form_value.address }}</view>
            </view>
            <view v-if="com_data.is_longitude_and_latitude == '1'" class="flex-row align-c gap-10">
                <view>经度坐标：{{ form_value.lng }}</view>
                <view>纬度坐标：{{ form_value.lat }}</view>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
            propIsCustom: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                com_data: {},
                form_value: {},
                cloice_location_timer: null,
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                this.setData({
                    com_data: com_data,
                    form_value: com_data?.form_value || {},
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
                            form_value: result,
                        });
                        clearInterval(self.cloice_location_timer);
                        
                        // 回调事件
                        self.$emit('data_change', result, this.propDataIndex);
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

<style lang="scss" scoped>
.pa-5 {
    padding: 10rpx;
}
.gap-10 {
    gap: 20rpx;
}
.gap-5 {
    gap: 10rpx;
}
</style>

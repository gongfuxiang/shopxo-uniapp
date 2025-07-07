<template>
    <view class="wh-auto ht-auto flex-col gap-10">
        <!-- 标题显示处理 -->
        <view class="flex-row align-c jc-sb">
            <view class="flex-1 flex-row align-c gap-10">
                <view class="flex-row align-c" :style="propTitleStyle">{{ com_data.title }}<view v-if="com_data.is_required == '1'" class="required">*</view></view>
                <view v-if="com_data.common_config && com_data.common_config.help_is_show == '1' && !isEmpty(com_data.common_config.help_explain)" :data-value="com_data.common_config.help_explain" @tap="help_icon_event">
                    <iconfont name="icon-miaosha-hdgz" :size="propHelpIconStyle" color="#999"></iconfont>
                </view>
            </view>
            <view class="flex-row align-c gap-10">
                <button class="title_btn">
                    <iconfont name="icon-add" size="24rpx" color="#2196F3" propContainerDisplay="flex"></iconfont>
                </button>    
                <button class="title_btn flex-row align-c gap-10">全部收起<iconfont name="icon-arrow-top" size="24rpx" color="#2196F3" propContainerDisplay="flex"></iconfont></button>
            </view>
        </view>
        <view v-if="mobile.arrange == 'direction'">
            <view v-for="(item, index) in form_value" :key="index" class="direction-style">
                <!-- 标题操作 -->
                <view class="subform-title-btns flex-row align-c jc-sb">
                    <span class="subform-number">{{ index + 1 }}</span>
                    <view class="flex-row align-c gap-10">
                        <view class="cr-blue size-12" :data-index="index">更多</view>
                        <view class="cr-blue size-12" :data-index="index">删除</view>
                        <view class="cr-blue size-12" :data-index="index">展开</view>
                    </view>
                </view>
            </view>
            <view class="direction-bottom flex-row align-c jc-c gap-10 cr-blue">
                <iconfont name="icon-add" size="32rpx" color="#2196F3" propContainerDisplay="flex"></iconfont>
                添加记录
            </view>
        </view>
        <view v-else>

        </view>
    </view>
</template>

<script>
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
            propTitleStyle: {
                type: String,
                default: '',
            },
            propHelpIconStyle: {
                type: String,
                default: '20rpx',
            },
        },
        data() {
            return {
                com_data: {},
                form_value: [],
                mobile: {}
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
                    mobile: com_data.mobile || {},
                    form_value: com_data?.form_value || [],
                    children: com_data?.children || [],
                });
            },
            help_icon_event(e) {
                this.$emit('helpIconEvent', e.currentTarget.dataset.value);
            }
        },
    };
</script>

<style lang="scss" scoped>
.title_btn {
    font-size: 24rpx;
}
.direction-style {
    border: 2rpx solid #ccc;
    border-top-left-radius: 8rpx;
    border-top-right-radius: 8rpx;
    overflow: hidden;
}
.direction-bottom {
    border: 2rpx solid #ccc;
    border-top: 0;
    padding: 20rpx;
    border-bottom-left-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
    overflow: hidden;
}
.subform-title-btns {
    padding: 14rpx;
    background: linear-gradient(180deg, #f4f6f9, #fff);
    .subform-number {
        width: 40rpx;
        background: #2196F3;
        color: #fff;
        border-radius: 50%;
        padding: 4rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

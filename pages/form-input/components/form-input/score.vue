<template>
    <view class="flex-row align-c wh-auto gap-10">
        <view class="flex-row align-c gap-6 flex-wrap">
            <view v-for="(item, index) in Array(com_data.total)" :key="index" class="rate-item">
                <template v-if="com_data.score_type !== '2'">
                    <template v-if="index < new_selected">
                        <view :data-index="index + 1" @mousemove="mousemove" @mouseleave="mouseleave" @tap="icon_click">
                            <iconfont :name="'icon-' + (com_data.score_type == '0' ? 'pointed' : 'heart')" size="32rpx" :color="com_data.select_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </template>
                    <template v-else>
                        <view :data-index="index + 1" @mousemove="mousemove" @mouseleave="mouseleave" @tap="icon_click">
                            <iconfont :name="'icon-' + (com_data.score_type == '0' ? 'five-pointed' : 'the-heart')" size="32rpx" :color="com_data.select_color" propContainerDisplay="flex"></iconfont>
                        </view>
                    </template>
                </template>
                <template v-else>
                    <template v-if="index + 1 == new_selected">
                        <span class="rate-divide-name nowrap" :data-index="index + 1" :style="'color:' + com_data.select_color" @tap="icon_click">{{ index + 1 }}分</span>
                    </template>
                    <template v-else>
                        <span class="rate-divide-name nowrap" :data-index="index + 1" @tap="icon_click">{{ index + 1 }}分</span>
                    </template>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty } from '@/common/js/common/common.js';
    const app = getApp();
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
            }
        },
        data() {
            return {
                form_value: 0,
                com_data: {},
                new_selected: 0,
            };
        },
        watch: {
            propValue: {
                handler(newVal) {
                    this.init();
                },
                deep: true
            },
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
            init() {
                const com_data = this.propValue;
                this.setData({
                    com_data: com_data,
                    form_value: com_data.form_value,
                    new_selected: JSON.stringify(JSON.parse(com_data.form_value)),
                    is_show: true,
                });
            },
            eye_change() {
                this.setData({
                    is_show: !this.is_show
                });
            },
            mousemove(e) {
                this.setData({
                    new_selected: e.currentTarget.dataset.index,
                });
            },
            mouseleave() {
                this.setData({
                    form_value: JSON.stringify(JSON.parse(this.new_selected)),
                });
            },
            icon_click(e) {
                const index = e.currentTarget.dataset.index || 0;
                // 重新编辑一下历史数据
                this.setData({
                    form_value: index,
                });
                this.$emit('dataChange', { value: index, id: this.propDataId });
            }
        }
    }
</script>

<style lang="scss" scoped>
.rate-item {
    height: 32rpx;
}
.gap-6 {
    gap: 12rpx;
}
.rate-divide-name {
	font-weight: 400;
	font-size: 32rpx;
	color: #666666;
	line-height: 28rpx;
	text-align: right;
	font-style: normal;
}
</style>
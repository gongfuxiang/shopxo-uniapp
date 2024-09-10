<template>
    <!-- 用户信息 -->
    <view :style="style_container">
        <view class="pr padding-xxl" :style="style">
            <view class="flex-row jc-sb align-c margin-bottom-xxl">
                <view class="flex-1 flex-row align-c gap-12">
                    <img class="circle" src="@/static/images/common/user.png" :width="base_data.user_avatar_size" :height="base_data.user_avatar_size" />
                    <view class="flex-col gap-8">
                        <view class="text-size fw-b" :style="user_name_style">昵称</view>
                        <view v-if="id_bool" class="padding-horizontal-sm padding-vertical-xsss border-radius-sm" :style="user_id_style">ID:88888888</view>
                    </view>
                </view>
                <view class="flex-row align-c" :style="'gap:' + base_data.img_space * 2 + 'rpx;'">
                    <view v-for="(item, index) in icon_setting" :key="index" :style="{ width: base_data.img_size + 'px', height: base_data.img_size + 'px' }">
                        <image v-if="item.img.length > 0" :src="item.img[0].url" class="border-radius-sm" mode="scaleToFill" :style="{ width: base_data.img_size + 'px', height: base_data.img_size + 'px' }" />
                        <iconfont v-else :name="'icon-' + item.icon" :size="base_data.img_size + 'rpx'" color="#666"></iconfont>
                    </view>
                </view>
            </view>
            <view class="flex-row jc-sa align-c">
                <template v-for="(item, index) in stats_list">
                    <view v-if="user_info.includes(item.id)" :key="index" class="tc">
                        <view class="text-size fw-b margin-bottom-sm" :style="stats_number_style">{{ item.value }}</view>
                        <view class="text-size-xs" :style="stats_name_style">{{ item.name }}</view>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, gradient_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                style_container: '',
                style: '',
                id_bool: true,
                stats_list: [
                    { id: 'order_count', name: '订单总数', value: '100' },
                    { id: 'goods_favor_count', name: '商品收藏', value: '10' },
                    { id: 'goods_browse_count', name: '我的足迹', value: '1000' },
                    { id: 'integral_number', name: '我的积分', value: '10000' },
                ],
                user_info: ['order_count', 'goods_favor_count', 'goods_browse_count', 'integral_number'],
                icon_setting: [
                    { id: '1', img: [], icon: '', link: {} },
                    { id: '2', img: [], icon: '', link: {} },
                ],
                base_data: {},
                // 样式
                user_name_style: '',
                user_id_style: '',
                stats_name_style: '',
                stats_number_style: '',
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                if (new_content) {
                    this.user_info = new_content.user_info;
                    this.icon_setting = new_content.icon_setting;
                    this.id_bool = this.user_info ? this.user_info.includes('user_id') : true;
                    this.stats_list.map((item) => {
                        if (this.user_info.includes(item.id)) {
                            item.value = new_content[item.id];
                        }
                    });
                }
                if (new_style) {
                    this.base_data = {
                        // 头像
                        user_avatar_size: new_style.user_avatar_size,
                        // 人物
                        user_name_color: new_style.user_name_color,
                        user_name_weight: new_style.user_name_weight,
                        user_name_size: new_style.user_name_size,
                        // id
                        user_id_color_list: new_style.user_id_color_list,
                        user_id_color: new_style.user_id_color,
                        user_id_direction: new_style.user_id_direction,
                        user_id_weight: new_style.user_id_weight,
                        user_id_size: new_style.user_id_size,
                        // 图标设置
                        img_size: new_style.img_size,
                        img_space: new_style.img_space,
                        stats_name_color: new_style.stats_name_color,
                        stats_name_weight: new_style.stats_name_weight,
                        stats_name_size: new_style.stats_name_size,
                        stats_number_color: new_style.stats_number_color,
                        stats_number_weight: new_style.stats_number_weight,
                        stats_number_size: new_style.stats_number_size,
                    };
                    this.style_container = common_styles_computer(new_style.common_style);
                }
                // 人物名称样式
                this.user_name_style = 'color:' + this.base_data.user_name_color + ';' + 'font-size:' + this.base_data.user_name_size * 2 + 'rpx;' + 'font-weight:' + this.base_data.user_name_weight + ';';
                // id样式
                const new_gradient_obj = {
                    color_list: this.base_data.user_id_color_list,
                    direction: this.base_data.user_id_direction,
                };
                this.user_id_style = gradient_computer(new_gradient_obj) + 'color:' + this.base_data.user_id_color + ';' + 'font-size:' + this.base_data.user_id_size * 2 + 'rpx;' + 'font-weight:' + this.base_data.user_id_weight + ';';

                // 统计名称样式
                this.stats_name_style = 'color:' + this.base_data.stats_name_color + ';' + 'font-size:' + this.base_data.stats_name_size * 2 + 'rpx;' + 'font-weight:' + this.base_data.stats_name_weight + ';';
                this.stats_number_style = 'color:' + this.base_data.stats_number_color + ';' + 'font-size:' + this.base_data.stats_number_size * 2 + 'rpx;' + 'font-weight:' + this.base_data.stats_number_weight + ';';
            },
        },
    };
</script>
<style></style>

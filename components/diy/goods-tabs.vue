<template>
    <view :style="style_container">
        <componentDiyModulesTabsView :value="goods_tabs" @tabs-click="tabs_click_event"></componentDiyModulesTabsView>
        <view class="padding-top">
            <componentGoodsList :key="key" :value="goods_tabs" :is-common-style="false"></componentGoodsList>
        </view>
    </view>
        <view :class="outer_class" :style="onter_style">
            <block v-if="!['5'].includes(theme)">
                <view v-for="(item, index) in list" :key="index" class="re" :class="layout_type" :style="layout_style">
                    <block v-if="theme == '6'">
                        <view :class="['flex-row align-c jc-sb ptb-15 mlr-10 gap-20', { 'br-b-e': index != list.length - 1 }]">
                            <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                            <view v-if="is_show('price')" class="num nowrap" :style="'color:' + new_style.shop_price_color">
                                <span class="identifying">{{ item.show_price_symbol }}</span><span :style="price_style">{{ item.min_price }}</span>
                                <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <block v-if="!isEmpty(item)">
                            <block v-if="!isEmpty(item.new_cover)">
                                <image-empty :image-src="item.new_cover[0]" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                            </block>
                            <block v-else>
                                <image-empty :image-src="item.images" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                            </block>
                        </block>
                        <view class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                            <view class="flex-col gap-10 top-title">
                                <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                <view v-if="show_content && is_show('plugins_view_icon') && !isEmpty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                    <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius text-size-xsss padding-horizontal-xs" :style="{background: icon_data.bg_color, color: icon_data.color, border: '1rpx solid' + (!isEmpty(icon_data.br_color) ? icon_data.br_color : icon_data.bg_color)}">{{ icon_data.name }}</view>
                                </view>
                            </view>
                            <view v-if="!['3', '4', '5'].includes(form.theme)" class="flex-col gap-5 oh">
                                <view :class="[form.is_price_solo == '1' ? 'flex-row align-c nowrap' : 'flex-col gap-5']">
                                    <view v-if="is_show('price')" class="num" :style="'color:' + new_style.shop_price_color">
                                        <span class="identifying">{{ item.show_price_symbol }}</span><span :style="price_style">{{ item.min_price }}</span>
                                        <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                    </view>
                                    <view v-if="show_content && is_show('original_price')" class="text-size-xss flex-row">
                                        <span class="original-price-left"></span><span :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]">{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                            <block v-if="is_show('original_price_unit')">
                                                {{ item.show_original_price_unit }}
                                            </block>
                                        </span>
                                    </view>
                                </view>
                                <view class="flex-row jc-sb align-e">
                                    <view>
                                        <view v-if="show_content" class="flex-row align-c text-size-xss">
                                            <view v-if="is_show('sales_count')" class="pr-5" :style="sold_number_style">已售{{ item.sales_count }}件</view>
                                            <!-- <view v-if="is_show('sales_count')" :class="['pr-5', {'br-r-e': is_show('sales_count') && is_show('4')}]" :style="sold_number_style>已售{{ item.sales_count }}件</view> -->
                                            <!-- <view v-if="is_show('4')" class="pl-5" :style="score_style">评分0</view> -->
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'">
                                        <block v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                        </block>
                                        <block v-else>
                                            <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                        </block>
                                    </view>
                                </view>
                            </view>
                            <view v-else class="flex-row align-c jc-sb">
                                <view class="flex-row align-c nowrap">
                                    <view v-if="is_show('price')" class="num" :style="'color:' + new_style.shop_price_color">
                                        <span class="identifying">{{ item.show_price_symbol }}</span><span :style="price_style">{{ item.min_price }}</span>
                                        <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                    </view>
                                    <view v-if="show_content && is_show('original_price')" class="text-size-xss flex-row">
                                        <span class="original-price-left"></span><span :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]">{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                            <block v-if="is_show('original_price_unit')">
                                                {{ item.show_original_price_unit }}
                                            </block>
                                        </span>
                                    </view>
                                </view>
                                <view v-if="form.is_shop_show == '1'">
                                    <block v-if="form.shop_type == 'text'">
                                        <view class="plr-11 ptb-3 round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                    </block>
                                    <block v-else>
                                        <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                    </block>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </block>
            <block v-else>
                <swiper circular="true" :autoplay="new_style.is_roll == '1'" :interval="new_style.interval_time * 1000" :duration="500" :style="{ width:'100%', height: new_style.content_outer_height * 2 + 'rpx' }">
                    <swiper-item v-for="(item1, index1) in shop_content_list" :key="index1" class="flex-row" :style="onter_style">
                        <view v-for="(item, index) in item1.split_list" :key="index" class="pr" :class="layout_type" :style="layout_style">
                            <block v-if="!isEmpty(item)">
                                <block v-if="!isEmpty(item.new_cover)">
                                    <image-empty :image-src="item.new_cover[0]" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                                </block>
                                <block v-else>
                                    <image-empty :image-src="item.images" :class="'flex-img' + theme" :style="content_img_radius" error-style="width: 100rpx;height: 100rpx;"></image-empty>
                                </block>
                            </block>
                            <view class="flex-col flex-1 jc-sb content gap-10" :style="content_style">
                                <view class="flex-col gap-10 top-title">
                                    <view v-if="is_show('title')" :class="text_line" :style="title_style">{{ item.title }}</view>
                                    <view v-if="show_content && is_show('plugins_view_icon') && !isEmpty(item.plugins_view_icon_data)" class="flex-row gap-5 align-c">
                                        <view v-for="(icon_data, icon_index) in item.plugins_view_icon_data" :key="icon_index" class="radius text-size-xsss padding-horizontal-xs" :style="{background: icon_data.bg_color, color: icon_data.color, border: '1rpx solid' + (!isEmpty(icon_data.br_color) ? icon_data.br_color : icon_data.bg_color)}">{{ icon_data.name }}</view>
                                    </view>
                                </view>
                                <view class="flex-row align-c jc-sb">
                                    <view class="flex-row align-c nowrap">
                                        <view v-if="is_show('price')" class="num" :style="'color:' + new_style.shop_price_color">
                                            <span class="identifying">{{ item.show_price_symbol }}</span><span :style="price_style">{{ item.min_price }}</span>
                                            <span v-if="is_show('price_unit')" class="identifying">{{ item.show_price_unit }}</span>
                                        </view>
                                        <view v-if="show_content && is_show('original_price')" class="text-size-xss flex">
                                            <span class="original-price-left"></span><span :class="['original-price text-line-1', { 'flex-1': form.is_price_solo == '1' }]">{{ item.show_original_price_symbol }}{{ item.min_original_price }}
                                                <block v-if="is_show('original_price_unit')">
                                                    {{ item.show_original_price_unit }}
                                                </block>
                                            </span>
                                        </view>
                                    </view>
                                    <view v-if="form.is_shop_show == '1'">
                                        <block v-if="form.shop_type == 'text'">
                                            <view class="plr-11 ptb-3 round" :style="button_style + ('color:' + new_style.shop_button_text_color)">{{ form.shop_button_text }}</view>
                                        </block>
                                        <block v-else>
                                            <icon class="round plr-6 ptb-5" :name="!isEmpty(form.shop_button_icon_class) ? form.shop_button_icon_class : 'cart'" :color="new_style.shop_icon_color" :size="new_style.shop_icon_size + ''" :styles="button_gradient()"></icon>
                                        </block>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
            </block>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer, get_math } from '@/common/js/common/common.js';
    import componentDiyModulesTabsView from '@/components/diy/modules/tabs-view';
    import componentGoodsList from '@/components/diy/goods-list';
    export default {
        components: {
            componentDiyModulesTabsView,
            componentGoodsList
        },
        props: {
            value: {
                type: Object,
                default: () => {
                    return {};
                },
            }
        },
        data() {
            return {
                style_container: '',
                goods_tabs: {},
                key: 1,
            };
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                const new_style = this.value.style || {};
                let new_data = JSON.parse(JSON.stringify(this.value));
                // 产品的值
                new_data.content.data_type = new_data.content.tabs_list[0].data_type;
                new_data.content.category = new_data.content.tabs_list[0].category;
                new_data.content.brand = new_data.content.tabs_list[0].brand;
                new_data.content.number = new_data.content.tabs_list[0].number;
                new_data.content.sort = new_data.content.tabs_list[0].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[0].sort_rules;
                new_data.content.data_list = new_data.content.tabs_list[0].data_list;
                this.setData({
                    goods_tabs: new_data,
                    style_container: common_styles_computer(new_style.common_style),
                });
            },
            tabs_click_event(index) {
                let new_data = JSON.parse(JSON.stringify(this.value));
                new_data.content.data_type = new_data.content.tabs_list[index].data_type;
                new_data.content.category = new_data.content.tabs_list[index].category;
                new_data.content.brand = new_data.content.tabs_list[index].brand;
                new_data.content.number = new_data.content.tabs_list[index].number;
                new_data.content.sort = new_data.content.tabs_list[index].sort;
                new_data.content.sort_rules = new_data.content.tabs_list[index].sort_rules;
                new_data.content.data_list = new_data.content.tabs_list[index].data_list;
                this.setData({
                    goods_tabs: new_data,
                    key: get_math(),
                });
            },
        },
    };
</script>

<style scoped lang="scss">
</style>
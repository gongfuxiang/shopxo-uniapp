<template>
    <view :class="theme_view">
        <view v-if="(data_goods_list || null) != null && data_goods_list.length > 0">
            <view v-for="(item, index) in data_goods_list" :key="index" class="border-radius-main oh spacing-mb">
                <block v-if="(item.data || null) != null && item.data.length > 0">
                    <!-- 上下滚动 -->
                    <view v-if="item.show_style == 0" class="hot-list flex-row flex-warp padding-vertical-main" :style="(item.bg_images || null) !== null ? 'background-image: url(' + item.bg_images + ');background-size: auto 100%;' : 'background: #fff;'">
                        <block v-for="(items, indexs) in item.data" :key="indexs">
                            <block v-if="(items.data || null) != null && items.data.length > 0">
                                <view :class="items.data.length % 2 == 0 ? 'flex-width-half' : items.data.length === indexs + 1 ? 'wh-auto' : 'flex-width-half'">
                                    <view class="padding-horizontal-main">
                                        <view class="flex-row align-c margin-bottom-xs" :data-value="items.url" @tap="url_event">
                                            <text class="text-size fw-b single-text">{{ items.title }}</text>
                                            <view class="hot-go margin-left-sm">
                                                <block v-if="(items.icon || null) !== null">
                                                    <image :src="items.icon" mode="heightFix" class="ht-auto"> </image>
                                                </block>
                                            </view>
                                        </view>
                                        <view class="cr-grey-9 text-size-xs margin-bottom-sm">{{ items.describe }}</view>
                                        <swiper :class="items.data.length % 2 == 0 ? 'swiper-2' : items.data.length === indexs + 1 ? 'swiper-1' : 'swiper-2'" circular :autoplay="(items.rolling_time || null) !== null ? true : false" :vertical="propVertical" :interval="(items.rolling_time || null) !== null ? Number(items.rolling_time) * 1000 : '6000'" :duration="propDuration">
                                            <swiper-item v-for="(itemss, indexss) in items.data" :key="indexss">
                                                <view class="swiper-item">
                                                    <view class="flex-row">
                                                        <view v-for="(gv, gi) in itemss" :key="gi" :class="item.data.length % 2 == 0 ? 'flex-width-half' : items.data.length === indexs + 1 ? 'flex-width-half-2' : 'flex-width-half'">
                                                            <view class="tc" :data-index="index" :data-indexs="indexs" :data-indexss="indexss" :data-gi="gi" :data-value="(gv.goods_url || null) !== null ? gv.goods_url : ''" @tap="goods_event">
                                                                <image :src="(gv.images || null) !== null ? gv.images : ''" mode="heightFix" class="swiper-img border-radius-sm"> </image>
                                                                <view v-if="(gv.show_field_price_status || 0) == 1" class="price tc single-text">
                                                                    <text class="sales-price va-m text-size-xss va-b">{{ gv.show_price_symbol }}</text>
                                                                    <text class="sales-price va-m text-size-xs">{{ gv.min_price }}</text>
                                                                    <text class="cr-grey va-m text-size-xss">{{ gv.show_price_unit }}</text>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </swiper-item>
                                        </swiper>
                                    </view>
                                </view>
                            </block>
                        </block>
                    </view>

                    <!-- 1切换滚动、2切换九宫格、3切换滚动 -->
                    <view v-else-if="item.show_style == 1 || item.show_style == 2 || item.show_style == 3" class="switch-tabs-item-list pr padding-top-main" :style="(item.bg_images || null) !== null ? 'background-image: url(' + item.bg_images + ');background-size: auto 100%;' : 'background: linear-gradient(180deg, '+theme_color+' 0%, '+theme_color_light+' 50%);'">
                        <view class="scroll-view-horizontal padding-left-main">
                            <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'switch-tabs-item-' + show_style1_active_index">
                                <block v-for="(items, indexs) in item.data" :key="indexs">
                                    <view :class="'tc cp dis-inline-block '+(indexs > 0 ? 'margin-left-xxl' : '')" :id="'switch-tabs-item-' + indexs" :data-indexs="indexs" @tap="switch_tabs_event">
                                        <image v-if="(items.icon || null) != null" :src="items.icon" class="switch-tabs-item-icon va-m margin-right-xs" mode="aspectFit"></image>
                                        <text class="cr-white text-size-md va-m" :class="show_style1_active_index == indexs ? 'text-size' : ''">{{ items.title }} </text>
                                        <view class="lh-xs">
                                            <iconfont name="icon-down-mark" size="36rpx" :color="show_style1_active_index == indexs ? '#fff' : 'transparent'" propClass="lh-xs"></iconfont>
                                        </view>
                                    </view>
                                </block>
                            </scroll-view>
                        </view>
                        <block v-for="(items, indexs) in item.data" :key="indexs">
                            <view v-if="show_style1_active_index == indexs">
                                <view v-if="(items.url || null) != null" :data-value="items.url" @tap="url_event" class="padding-right cr-white cp pa top-xxxxxl right-0 padding-top-xs">
                                    <text>{{ $t('common.more') }}</text>
                                    <iconfont name="icon-arrow-right" color="#fff"></iconfont>
                                </view>
                                <view v-if="(items.describe || null) != null" class="cr-white text-size-xs single-text padding-vertical-sm padding-horizontal-main">{{items.describe}}</view>
                                <view :class="(item.show_style == 1 || item.show_style == 2) ? 'padding-horizontal-main padding-top-sm' : (item.show_style == 3 ? 'padding-top-xs padding-bottom-main' : '')">
                                    <component-goods-list :propData="{ style_type: parseInt(item.show_style)-1, goods_list: items.goods_list }" :propLabel="propLabel" :propCurrencySymbol="propCurrencySymbol" :propIsAutoPlay="(items.rolling_time || null) != null" :propIsCartParaCurve="true" propSource="index" propStyleTypeTowClass="border-radius-main padding-horizontal-main padding-top-xs"></component-goods-list>
                                </view>
                            </view>
                        </block>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    import componentGoodsList from '@/components/goods-list/goods-list';
    export default {
        name: 'recommend-hot',
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                theme_color_light: app.globalData.get_theme_color(null, true),
                data_goods_list: [],
                show_style1_active_index: 0,
            };
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
            propData: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            propVertical: {
                type: Boolean,
                default: true,
            },
            propDuration: {
                type: Number,
                default: 1000,
            },
            // 标签数据
            propLabel: {
                type: [Array, Object, String],
                default: null,
            }
        },
        components: {
            componentGoodsList
        },
        // 属性值改变监听
        watch: {
            // 数据
            propData(value, old_value) {
                this.set_data(value);
            }
        },
        mounted() {
            this.set_data(this.propData);
        },
        methods: {
            // 商品事件
            goods_event(e) {
                // 商品数据缓存处理
                var index = e.currentTarget.dataset.index;
                var indexs = e.currentTarget.dataset.indexs;
                var indexss = e.currentTarget.dataset.indexss;
                var gi = e.currentTarget.dataset.gi;
                var goods = this.data_goods_list[index]['data'][indexs]['data'][indexss][gi];
                app.globalData.goods_data_cache_handle(goods.id, goods);

                // 调用公共打开url地址
                app.globalData.url_event(e);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // tabs切换
            switch_tabs_event(e) {
                this.setData({
                    show_style1_active_index: e.currentTarget.dataset.indexs
                });
            },

            // 轮播数据处理
            set_data(data) {
                let goods = data.goods;
                goods.forEach((item) => {
                    switch(parseInt(item.show_style || 0)) {
                        // 上下滚动数据处理
                        case 0 :
                            item.data.forEach((items, indexs) => {
                                let swiper_data = [];
                                if (item.data.length % 2 == 0) {
                                    // 偶数
                                    swiper_data = app.globalData.group_arry(items.goods_list, 2);
                                } else {
                                    // 奇数
                                    if (item.data.length === indexs + 1) {
                                        swiper_data = app.globalData.group_arry(items.goods_list, 4);
                                    } else {
                                        swiper_data = app.globalData.group_arry(items.goods_list, 2);
                                    }
                                }
                                items.data = swiper_data;
                            });
                            break;
                    }
                });
                this.setData({
                    data_goods_list: goods,
                });
            },
        },
    };
</script>

<style scoped>
    .hot-list {
        gap: 10rpx 0;
    }
    .hot-list > .flex-width-half {
        margin-bottom: 0;
    }
    .hot-list > .flex-width-half:nth-last-of-type(1),
    .hot-list > .flex-width-half:nth-last-of-type(2) {
        margin-bottom: 0;
    }
    .hot-list > .flex-width-half:nth-child(even) {
        position: relative;
    }
    .hot-list > .flex-width-half:nth-child(even)::before {
        content: '';
        height: 80%;
        width: 2rpx;
        border-left: 2rpx dashed #eeeeee;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .hot-list .swiper-2 {
        height: 176rpx;
    }
    .hot-list .swiper-2 .swiper-img {
        height: 124rpx;
    }
    .hot-list .swiper-1 {
        height: 187rpx;
    }
    .hot-list .swiper-1 .swiper-img {
        height: 135rpx;
    }
    .hot-go {
        height: 34rpx;
        line-height: 34rpx;
    }
    .flex-width-half-2 {
        width: 25%;
    }


    /**
     * 切换滚动、切换九宫格、切换滚动
     */
    .switch-tabs-item-list > .scroll-view-horizontal {
        padding-right: 140rpx;
    }
    .switch-tabs-item-list .switch-tabs-item-icon {
        width: 32rpx !important;
        height: 32rpx !important;
    }
</style>

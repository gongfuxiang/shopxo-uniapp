<template>
    <view :class="theme_view">
        <view v-if="(data_goods_list || null) != null && data_goods_list.length > 0">
            <view v-for="(item, index) in data_goods_list" :key="index" class="plugins-magic-content border-radius-main oh spacing-mb">
                <view v-if="(item.data || null) != null && item.data.length > 0" :style="(item.bg_images || null) !== null ? 'background-image: url(' + item.bg_images + ');background-size: auto 100%;' : (((item.is_text_white || 0) == 1) ? 'background: linear-gradient(180deg, '+theme_color+' 0%, '+theme_color_light+' 80%);' : 'background: #fff;')">
                    <!-- 上下滚动 -->
                    <view v-if="item.show_style == 0" :class="'hot-list flex-row flex-wrap padding-vertical-main '+(((item.is_text_white || 0) == 1) ? 'is-text-white' : '')">
                        <block v-for="(items, indexs) in item.data" :key="indexs">
                            <block v-if="(items.data || null) != null && items.data.length > 0">
                                <view :class="'group-item '+(item.data.length%2 != 0 && item.data.length-1 === indexs ? 'wh-auto' : 'flex-width-half')">
                                    <view class="padding-horizontal-main">
                                        <view class="flex-row align-c" :data-value="items.url" @tap="url_event">
                                            <text :class="'text-size fw-b single-text cr-'+(((item.is_text_white || 0) == 1) ? 'white' : 'black')">{{ items.title }}</text>
                                            <view class="hot-go margin-left-sm">
                                                <block v-if="(items.icon || null) !== null">
                                                    <image :src="items.icon" mode="heightFix" class="ht-auto"></image>
                                                </block>
                                            </view>
                                        </view>
                                        <view :class="'single-text text-size-xs margin-top-xs cr-'+(((item.is_text_white || 0) == 1) ? 'white' : 'grey-9')">{{ items.describe }}</view>
                                        <swiper class="swiper-list border-radius-main oh" circular :autoplay="(items.rolling_time || null) !== null ? true : false" :vertical="propVertical" :interval="(items.rolling_time || null) !== null ? Number(items.rolling_time) * 1000 : '6000'" :duration="propDuration">
                                            <swiper-item v-for="(itemss, indexss) in items.data" :key="indexss">
                                                <view class="swiper-item">
                                                    <view :class="'flex-row gap-10 goods-item-number-'+itemss.length">
                                                        <view v-for="(gv, gi) in itemss" :key="gi" :class="'bg-white border-radius-main oh flex-width-half '+(itemss.length % 2 != 0 && itemss.length-1 == gi ? 'wh-auto' : '')">
                                                            <view class="tc" :data-index="index" :data-indexs="indexs" :data-indexss="indexss" :data-gi="gi" :data-value="(gv.goods_url || null) !== null ? gv.goods_url : ''" @tap="goods_event">
                                                                <image :src="(gv.images || null) !== null ? gv.images : ''" :mode="itemss.length % 2 != 0 && itemss.length-1 == gi ? 'aspectFit' : 'scaleToFill'" :class="'swiper-img wh-auto dis-block '+(((item.is_text_white || 0) == 1) ? '' : 'border-radius-main')"> </image>
                                                                <view v-if="(gv.show_field_price_status || 0) == 1" :class="'price tc single-text text-line-1 '+(((item.is_text_white || 0) == 1) ? 'padding-horizontal-xs padding-bottom-xs' : '')">
                                                                    <text class="sales-price va-m text-size-xss va-b">{{ gv.show_price_symbol }}</text>
                                                                    <text class="sales-price va-m text-size-xs">{{ gv.min_price }}</text>
                                                                    <text class="va-m text-size-xss cr-grey">{{ gv.show_price_unit }}</text>
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
                    <view v-else-if="item.show_style == 1 || item.show_style == 2 || item.show_style == 3" class="switch-tabs-item-list pr padding-top-main">
                        <view class="scroll-view-horizontal padding-left-main">
                            <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'switch-tabs-item-' + (show_style1_active_index[index] || 0)">
                                <block v-for="(items, indexs) in item.data" :key="indexs">
                                    <view :class="'tc cp dis-inline-block '+(indexs > 0 ? 'margin-left-xxl' : '')" :id="'switch-tabs-item-' + indexs" :data-index="index" :data-indexs="indexs" @tap="switch_tabs_event">
                                        <image v-if="(items.icon || null) != null" :src="items.icon" class="switch-tabs-item-icon va-m margin-right-xs" mode="aspectFit"></image>
                                        <text :class="'text-size va-m cr-'+(((item.is_text_white || 0) == 1) ? 'white' : 'black')+' '+((show_style1_active_index[index] || 0) == indexs ? 'fw-b cr-'+(((item.is_text_white || 0) == 1) ? 'white' : 'main') : '')">{{ items.title }} </text>
                                        <view class="lh-xs">
                                            <iconfont name="icon-down-mark" size="36rpx" :color="(show_style1_active_index[index] || 0) == indexs ? (((item.is_text_white || 0) == 1) ? '#fff' : theme_color) : 'transparent'" propClass="lh-xs"></iconfont>
                                        </view>
                                    </view>
                                </block>
                            </scroll-view>
                        </view>
                        <block v-for="(items, indexs) in item.data" :key="indexs">
                            <view v-if="(show_style1_active_index[index] || 0) == indexs">
                                <view v-if="(items.url || null) != null" :data-value="items.url" @tap="url_event" class="padding-right cp pa top-xxxxxl right-0">
                                    <text :class="'text-size-xs va-m cr-'+(((item.is_text_white || 0) == 1) ? 'white' : 'grey')">{{ $t('common.more') }}</text>
                                    <view class="dis-inline-block va-m lh-xs">
                                        <iconfont name="icon-arrow-right" size="24rpx" :color="((item.is_text_white || 0) == 1) ? '#f5f5f5' : '#999'"></iconfont>
                                    </view>
                                </view>
                                <view v-if="(items.describe || null) != null" :class="'text-size-xs single-text padding-vertical-sm padding-horizontal-main cr-'+(((item.is_text_white || 0) == 1) ? 'white' : 'grey')">{{items.describe}}</view>
                                <view :class="(item.show_style == 1 || item.show_style == 2) ? 'padding-horizontal-main padding-top-sm' : (item.show_style == 3 ? 'padding-top-xs padding-bottom-main' : '')">
                                    <component-goods-list :propData="{ style_type: parseInt(item.show_style)-1, goods_list: items.goods_list }" :propLabel="propLabel" :propCurrencySymbol="propCurrencySymbol" :propIsAutoPlay="(items.rolling_time || null) != null" :propIsCartParaCurve="true" propSource="index" propStyleTypeTowClass="border-radius-main padding-horizontal-main padding-top-xs"></component-goods-list>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
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
                show_style1_active_index: {},
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
                var temp = this.show_style1_active_index || {};
                temp[e.currentTarget.dataset.index] = e.currentTarget.dataset.indexs;
                this.setData({
                    show_style1_active_index: temp
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
    .plugins-magic-content .hot-list {
        gap: 10rpx 0;
    }
    .plugins-magic-content .hot-list > .flex-width-half {
        margin-bottom: 0;
    }
    .plugins-magic-content .hot-list > .flex-width-half:nth-last-of-type(1),
    .plugins-magic-content .hot-list > .flex-width-half:nth-last-of-type(2) {
        margin-bottom: 0;
    }
    .plugins-magic-content .hot-list > .flex-width-half:nth-child(even) {
        position: relative;
    }
    .plugins-magic-content .hot-list > .flex-width-half:nth-child(even)::before {
        content: '';
        height: 80%;
        width: 2rpx;
        border-left: 2rpx solid rgb(232 232 232 / 28%);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .plugins-magic-content .hot-list.is-text-white > .flex-width-half:nth-child(even)::before {
        border-left: 2rpx solid rgb(255 245 245 / 9%);
    }
    .plugins-magic-content .hot-list .swiper-list {
        height: 216rpx;
    }
    .plugins-magic-content .hot-list .swiper-list .swiper-item {
        margin-top: 16rpx;
    }
    .plugins-magic-content .hot-list .swiper-list .swiper-img {
        height: 140rpx !important;
    }
    .plugins-magic-content .hot-go {
        height: 34rpx;
        line-height: 34rpx;
    }

    /**
     * 切换滚动、切换九宫格、切换滚动
     */
    .plugins-magic-content .switch-tabs-item-list > .scroll-view-horizontal {
        padding-right: 140rpx;
    }
    .plugins-magic-content .switch-tabs-item-list .switch-tabs-item-icon {
        width: 32rpx !important;
        height: 32rpx !important;
    }
</style>

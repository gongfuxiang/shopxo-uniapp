<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="page-bottom-fixed">
                <view class="groupbuy-detail-hero spacing-mb" :class="photo_list.length <= 0 ? 'groupbuy-detail-hero-no-photo' : ''">
                    <view class="groupbuy-detail-share-fixed pa" @tap="popup_share_event">
                        <view class="groupbuy-detail-share-icon flex-row align-c jc-c round">
                            <iconfont name="icon-share-circle" color="#ffffff" size="36rpx"></iconfont>
                        </view>
                    </view>
                    <view v-if="photo_list.length > 0" class="goods-photo-swiper-wrap">
                        <uni-swiper-dot class="goods-photo-swiper-dot" mode="dot" :dots-styles="photo_dots_styles" :info="photo_list" :current="photo_swiper_current">
                            <swiper class="goods-photo-swiper" circular :indicator-dots="false" @change="photo_swiper_change_event">
                                <swiper-item v-for="(item, index) in photo_list" :key="index">
                                    <image :src="item.images" mode="aspectFill" class="goods-photo-image" :data-value="item.images" @tap="images_view_event"></image>
                                </swiper-item>
                            </swiper>
                        </uni-swiper-dot>
                    </view>
                    <view class="groupbuy-detail-head-float">
                        <view class="groupbuy-detail-price-header" :style="detail_header_bg_style">
                            <view class="groupbuy-detail-price-main flex-row jc-sb align-c">
                                <view class="groupbuy-detail-price-left">
                                    <view class="cr-white text-size-xs">{{ $t('groupbuy.groupbuy.group_price') }}</view>
                                    <view class="groupbuy-detail-price-value cr-white fw-b margin-top-xs">
                                        <text class="text-size-xs">{{ currency_symbol }}</text>
                                        <text class="text-size-xl">{{ display_price }}</text>
                                        <text v-if="show_original_price" class="groupbuy-detail-original-price text-size-xs">{{ currency_symbol }}{{ goods.original_price }}</text>
                                    </view>
                                </view>
                                <view class="groupbuy-detail-team-tag bg-white cr-main text-size-xs padding-horizontal-main padding-vertical-xs">
                                    {{ groupbuy.group_number }}{{ $t('groupbuy.groupbuy.people_team') }}
                                </view>
                            </view>
                        </view>
                        <view class="groupbuy-detail-info-card bg-white">
                            <view class="multi-text text-size-md">{{ groupbuy.title || goods.title }}</view>
                            <view class="groupbuy-detail-status-bar margin-top-main">
                                <view class="groupbuy-detail-status-item flex-row jc-c align-c">
                                    <text class="groupbuy-detail-status-label text-size-xs cr-grey">{{ $t('groupbuy.groupbuy.group_formed') }}</text>
                                    <text class="groupbuy-detail-status-value text-size-sm cr-black margin-left-xs">{{ groupbuy.group_number }}{{ $t('common.person_unit') }}</text>
                                </view>
                                <view class="groupbuy-detail-status-item flex-row jc-c align-c">
                                    <text class="groupbuy-detail-status-label text-size-xs cr-grey">{{ $t('groupbuy.groupbuy.group_count') }}</text>
                                    <text class="groupbuy-detail-status-value text-size-sm cr-black margin-left-xs">{{ groupbuy.team_success_count || 0 }}</text>
                                </view>
                                <view class="groupbuy-detail-status-item flex-row jc-c align-c">
                                    <text class="groupbuy-detail-status-label text-size-xs cr-grey">{{ $t('common.purchase_limit') }}</text>
                                    <text class="groupbuy-detail-status-value text-size-sm cr-black margin-left-xs">{{ limit_buy_display_text }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="padding-horizontal-main">
                    <view v-if="goods.is_exist_many_spec == 1" class="groupbuy-detail-spec-row border-radius-main bg-white spacing-mb flex-row jc-sb align-c" @tap="buy_open_event">
                        <text class="groupbuy-detail-spec-label text-size-sm cr-black">{{ $t('common.spec') }}</text>
                        <view class="groupbuy-detail-spec-value flex-row align-c">
                            <text v-if="(spec_selected_text || null) == null || spec_selected_text == ''" class="groupbuy-detail-spec-text text-size-sm cr-grey single-text">{{ $t('common.please_select_spec') }}</text>
                            <text v-else class="groupbuy-detail-spec-text text-size-sm cr-black single-text">{{ spec_selected_text }}</text>
                            <iconfont name="icon-arrow-right" color="#999" propClass="groupbuy-detail-spec-arrow"></iconfont>
                        </view>
                    </view>

                    <component-groupbuy-play-rules :propConfig="groupbuy_config" :propPlaySideNav="play_side_nav"></component-groupbuy-play-rules>

                    <view class="goods-detail border-radius-main bg-white spacing-mb">
                        <view class="spacing-nav-title groupbuy-detail-goods-title">
                            <text class="text-wrapper title-left-border text-size-xs">{{ $t('common.goods_detail') }}</text>
                        </view>
                        <view class="padding-main">
                            <mp-html v-if="(goods.content_web || null) != null" :content="goods.content_web" />
                        </view>
                    </view>
                </view>

                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

                <view class="bottom-nav bg-white bottom-line-exclude">
                    <view class="flex-row align-c padding-horizontal-main padding-vertical-sm gap-10">
                        <view v-if="detail_buy_nav.length > 0" class="groupbuy-detail-buy-nav-left flex-row align-c">
                            <block v-for="(nav, nav_index) in detail_buy_nav" :key="nav_index">
                                <view
                                    v-if="nav.type == 'home' || nav.type == 'order'"
                                    class="groupbuy-detail-nav-item tc"
                                    :data-value="nav.url"
                                    @tap="url_event">
                                    <iconfont v-if="(nav.icon_app || null) != null" :name="'icon-' + nav.icon_app" size="40rpx" color="#666"></iconfont>
                                    <image v-else-if="(nav.icon || null) != null" :src="nav.icon" mode="aspectFit" class="groupbuy-detail-nav-icon"></image>
                                    <text class="dis-block text-size-xs cr-grey margin-top-xs">{{ nav.name }}</text>
                                </view>
                            </block>
                        </view>
                        <button v-if="(goods.shop_goods_url || null) != null" class="btn round bg-white br-grey cr-grey text-size-sm flex-1" type="default" :data-value="goods.shop_goods_url" @tap="url_event" hover-class="none">{{ $t('common.buy_alone') }}</button>
                        <button class="btn round bg-main cr-white text-size-sm flex-1" type="default" :disabled="buy_disabled" @tap="buy_open_event" hover-class="none">{{ buy_button_text }}</button>
                    </view>
                </view>
            </view>

            <component-goods-buy ref="goods_buy" propPluginsName="groupbuy" v-on:SpecChoiceEvent="goods_spec_choice_event"></component-goods-buy>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentGoodsBuy from '@/components/goods-buy/goods-buy';
    import componentGroupbuyPlayRules from '../components/groupbuy-play-rules/groupbuy-play-rules';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentSharePopup from '@/components/share-popup/share-popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                currency_symbol: app.globalData.currency_symbol(),
                goods: {},
                groupbuy: {},
                groupbuy_config: {},
                play_side_nav: [],
                detail_buy_nav: [],
                join_team_id: 0,
                photo_list: [],
                display_price: '0.00',
                spec_selected_text: '',
                buy_disabled: false,
                buy_button_text: this.$t('groupbuy.groupbuy.open_now'),
                show_original_price: false,
                share_info: {},
                photo_swiper_current: 0,
                photo_dots_styles: {},
            };
        },
        computed: {
            // 详情头部背景样式
            detail_header_bg_style() {
                var url = (this.groupbuy_config || {}).detail_base_bg_app || '';
                if (url == '') {
                    return '';
                }
                return 'background-image:url(' + url + ');';
            },
            // 限购显示文案
            limit_buy_display_text() {
                var limit = parseInt((this.groupbuy || {}).limit_buy_text || (this.groupbuy || {}).buy_max_number || 0);
                if (limit > 0) {
                    return limit;
                }
                if ((this.groupbuy || {}).user_limit_buy_number > 0) {
                    return parseInt(this.groupbuy.user_limit_buy_number);
                }
                return this.$t('common.unlimited');
            },
        },
        components: {
            componentCommon,
            componentNoData,
            componentGoodsBuy,
            componentGroupbuyPlayRules,
            componentBottomLine,
            componentSharePopup,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params || {});
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            this.setData({
                params: params || {},
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

            // 获取数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 分享
        onShareAppMessage() {
            var share = app.globalData.share_content_handle(this.share_info || {});
            return {
                title: share.title,
                path: share.path + share.query,
                imageUrl: share.img,
            };
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        photo_dots_styles: this.get_photo_dots_styles(),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 轮播指示点样式
            get_photo_dots_styles() {
                return {
                    bottom: 36,
                    width: 6,
                    height: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: '0',
                    selectedBackgroundColor: app.globalData.get_theme_color(),
                    selectedBorder: '0',
                };
            },

            // 轮播切换
            photo_swiper_change_event(e) {
                this.setData({
                    photo_swiper_current: e.detail.current,
                });
            },

            // 获取数据
            get_data() {
                var data = {
                    id: this.params.id || this.params.groupbuy_id || 0,
                    team_id: this.params.team_id || 0,
                };
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'groupbuy'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            var goods = result.goods || {};
                            var groupbuy = result.groupbuy || {};
                            var join_team_id = parseInt(result.join_team_id || 0);
                            var photo_list = [];
                            if ((goods.photo || null) != null && goods.photo.length > 0) {
                                photo_list = goods.photo;
                            } else if ((goods.images || null) != null) {
                                photo_list = [{ images: goods.images }];
                            }
                            var buy_display = result.detail_buy_display || {};
                            var inventory = parseInt(goods.inventory || 0);
                            var buy_button_text = buy_display.buy_button_text || (join_team_id > 0 ? this.$t('groupbuy.groupbuy.join_now') : this.$t('groupbuy.groupbuy.open_now'));
                            var buy_disabled = buy_display.buy_disabled == 1;
                            if (inventory <= 0 && !buy_display.buy_button_text) {
                                buy_button_text = this.$t('common.no_stock');
                                buy_disabled = true;
                            }
                            var show_original_price = buy_display.show_original_price == 1;
                            if (!show_original_price && (goods.original_price || null) != null && (groupbuy.min_groupbuy_price || null) != null) {
                                show_original_price = parseFloat(goods.original_price) > parseFloat(groupbuy.min_groupbuy_price);
                            }
                            var share_query = 'id=' + groupbuy.id;
                            if (join_team_id > 0) {
                                share_query += '&team_id=' + join_team_id;
                            }
                            var share_desc = (groupbuy.group_number || 0) + this.$t('groupbuy.groupbuy.people_team');
                            if (join_team_id > 0) {
                                share_desc += this.$t('groupbuy.groupbuy.invite_join');
                            } else {
                                share_desc += this.$t('groupbuy.groupbuy.invite_group');
                            }
                            this.setData({
                                goods: goods,
                                groupbuy: groupbuy,
                                show_original_price: show_original_price,
                                groupbuy_config: result.groupbuy_config || {},
                                play_side_nav: result.play_side_nav || [],
                                detail_buy_nav: result.detail_buy_nav || [],
                                join_team_id: join_team_id,
                                photo_list: photo_list,
                                display_price: groupbuy.groupbuy_price_text || groupbuy.min_groupbuy_price || goods.price || '0.00',
                                buy_disabled: buy_disabled || inventory <= 0,
                                buy_button_text: buy_button_text,
                                spec_selected_text: '',
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                data_bottom_line_status: true,
                                share_info: {
                                    title: groupbuy.title || goods.title,
                                    desc: share_desc,
                                    path: '/pages/plugins/groupbuy/detail/detail',
                                    query: share_query,
                                    img: goods.images || '',
                                },
                            });
                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 规格选择
            goods_spec_choice_event(e) {
                var spec = (e || null) != null ? e.spec || [] : [];
                var text = '';
                if (spec.length > 0) {
                    text = spec.map(function (v) {
                        return v.value;
                    }).join(' ');
                }
                var temp_goods = this.goods;
                if ((temp_goods.specifications || null) != null && (e.goods_spec_choose || null) != null) {
                    temp_goods['specifications']['choose'] = e.goods_spec_choose;
                }
                this.setData({
                    goods: temp_goods,
                    spec_selected_text: text,
                });
            },

            // 打开购买弹窗
            buy_open_event() {
                if (this.buy_disabled) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'buy_open_event');
                if (user == false) {
                    return false;
                }
                var buy_name = this.join_team_id > 0 ? this.$t('groupbuy.groupbuy.join_now') : this.$t('groupbuy.groupbuy.open_now');
                this.$refs.goods_buy.init(
                    Object.assign({}, this.goods, { goods_id: this.goods.id, id: this.groupbuy.id }),
                    {
                    plugins_name: 'groupbuy',
                    buy_event_type: 'buy',
                    is_success_tips: 0,
                    buy_button: {
                        data: [{ type: 'buy', name: buy_name, color: 'main' }],
                    },
                    data_params: {
                        groupbuy_id: this.groupbuy.id,
                        team_id: this.join_team_id,
                        is_team_leader: this.join_team_id > 0 ? 0 : 1,
                    },
                }
                );
            },

            // 图片预览
            images_view_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({ current: value, urls: [value] });
                }
            },

            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 分享开启弹层
            popup_share_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        share_info: this.share_info,
                    });
                }
            },
        },
    };
</script>
<style scoped>
    @import './detail.css';
</style>

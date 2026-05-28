<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="page-bottom-fixed">
                <view class="bargain-detail-hero spacing-mb" :class="photo_list.length <= 0 ? 'bargain-detail-hero-no-photo' : ''">
                    <view class="bargain-detail-share-fixed pa" @tap="popup_share_event">
                        <view class="bargain-detail-share-icon flex-row align-c jc-c round">
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
                    <view class="bargain-detail-head-float">
                        <view class="bargain-detail-price-header pr" :style="detail_header_bg_style">
                            <view v-if="(bargain.bargain_success_tag_text || null) != null" class="bargain-detail-success-tag pa">
                                <text class="bargain-detail-success-tag-text">{{ bargain.bargain_success_tag_text }}</text>
                            </view>
                            <view class="bargain-detail-price-main">
                                <view class="bargain-detail-price-left">
                                    <view class="cr-white text-size-xs">商品售价</view>
                                    <view class="bargain-detail-price-value cr-white fw-b margin-top-xs">
                                        <text class="text-size-xs">{{ currency_symbol }}</text>
                                        <text class="text-size-xl">{{ display_price }}</text>
                                        <text v-if="show_original_price" class="bargain-detail-original-price text-size-xs">{{ currency_symbol }}{{ goods.min_original_price || goods.original_price }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="bargain-detail-info-card bg-white">
                            <view class="multi-text text-size-md">{{ bargain.title || goods.title }}</view>
                            <view class="bargain-detail-status-bar margin-top-main">
                                <view class="bargain-detail-status-item flex-row jc-c align-c">
                                    <text class="bargain-detail-status-label text-size-xs cr-grey">帮砍</text>
                                    <text class="bargain-detail-status-value text-size-sm cr-black margin-left-xs">{{ bargain.help_number_text || bargain.help_number }}人</text>
                                </view>
                                <view class="bargain-detail-status-item flex-row jc-c align-c">
                                    <text class="bargain-detail-status-label text-size-xs cr-grey">参与数</text>
                                    <text class="bargain-detail-status-value text-size-sm cr-black margin-left-xs">{{ bargain.bargain_participant_count || 0 }}</text>
                                </view>
                                <view class="bargain-detail-status-item flex-row jc-c align-c">
                                    <text class="bargain-detail-status-label text-size-xs cr-grey">发起次数</text>
                                    <text class="bargain-detail-status-value text-size-sm cr-black margin-left-xs">{{ bargain.user_start_limit_text || 1 }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="padding-horizontal-main">
                    <view v-if="goods.is_exist_many_spec == 1" class="bargain-detail-spec-row border-radius-main bg-white spacing-mb flex-row jc-sb align-c" @tap="buy_open_event">
                        <text class="bargain-detail-spec-label text-size-sm cr-black">规格</text>
                        <view class="bargain-detail-spec-value flex-row align-c">
                            <text v-if="(spec_selected_text || null) == null || spec_selected_text == ''" class="bargain-detail-spec-text text-size-sm cr-grey single-text">请选择规格</text>
                            <text v-else class="bargain-detail-spec-text text-size-sm cr-black single-text">{{ spec_selected_text }}</text>
                            <iconfont name="icon-arrow-right" color="#999" propClass="bargain-detail-spec-arrow"></iconfont>
                        </view>
                    </view>

                    <component-bargain-play-rules :propConfig="bargain_config" :propPlaySideNav="play_side_nav"></component-bargain-play-rules>

                    <view class="goods-detail border-radius-main bg-white spacing-mb">
                        <view class="bargain-detail-goods-title padding-top-main padding-horizontal-main">
                            <component-bargain-dot-title propTitle="商品详情" propTextClass="text-size-sm"></component-bargain-dot-title>
                        </view>
                        <view class="padding-main padding-top-0">
                            <mp-html v-if="(goods.content_web || null) != null" :content="goods.content_web" />
                        </view>
                    </view>
                </view>

                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>

                <view class="bottom-nav page-width-max bg-white bottom-line-exclude">
                    <view class="flex-row align-c padding-horizontal-main padding-vertical-sm gap-10">
                        <view v-if="detail_buy_nav.length > 0" class="bargain-detail-buy-nav-left flex-row align-c">
                            <block v-for="(nav, nav_index) in detail_buy_nav" :key="nav_index">
                                <view
                                    v-if="nav.type == 'home' || nav.type == 'order'"
                                    class="bargain-detail-nav-item tc"
                                    :data-value="nav.url"
                                    @tap="url_event">
                                    <iconfont v-if="(nav.icon_app || null) != null" :name="'icon-' + nav.icon_app" size="40rpx" color="#666"></iconfont>
                                    <image v-else-if="(nav.icon || null) != null" :src="nav.icon" mode="aspectFit" class="bargain-detail-nav-icon"></image>
                                    <text class="dis-block text-size-xs cr-grey margin-top-xs">{{ nav.name }}</text>
                                </view>
                            </block>
                        </view>
                        <button v-if="(goods.shop_goods_url || null) != null" class="btn round bg-white br-grey cr-grey text-size-sm flex-1" type="default" :data-value="goods.shop_goods_url" @tap="url_event" hover-class="none">单独购买</button>
                        <button class="btn round bg-main cr-white text-size-sm flex-1" type="default" :disabled="buy_disabled" @tap="buy_open_event" hover-class="none">{{ buy_button_text }}</button>
                    </view>
                </view>
            </view>

            <component-goods-buy ref="goods_buy" propPluginsName="bargain" v-on:SpecChoiceEvent="goods_spec_choice_event" v-on:BackSuccessEvent="goods_back_success_event" v-on:BackConfirmEvent="bargain_start_event"></component-goods-buy>
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
    import componentBargainPlayRules from '../components/bargain-play-rules/bargain-play-rules';
    import componentBargainDotTitle from '../components/bargain-dot-title/bargain-dot-title';
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
                bargain: {},
                bargain_config: {},
                play_side_nav: [],
                detail_buy_nav: [],
                photo_list: [],
                display_price: '0.00',
                spec_selected_text: '',
                buy_disabled: false,
                buy_button_text: '参与砍价',
                buy_button_type: 'start',
                buy_record_url: '',
                detail_buy_display_default: null,
                show_original_price: false,
                share_info: {},
                photo_swiper_current: 0,
                photo_dots_styles: {},
            };
        },
        computed: {
            // 详情头部背景样式
            detail_header_bg_style() {
                var url = (this.bargain_config || {}).detail_base_bg_app || '';
                if (url == '') {
                    return '';
                }
                return 'background-image:url(' + url + ');';
            },
        },
        components: {
            componentCommon,
            componentNoData,
            componentGoodsBuy,
            componentBargainPlayRules,
            componentBargainDotTitle,
            componentBottomLine,
            componentSharePopup,
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params || {});
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
                    id: this.params.id || this.params.bargain_id || 0,
                };
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'bargain'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            var goods = result.goods || {};
                            var bargain = result.bargain || {};
                            var photo_list = [];
                            if ((goods.photo || null) != null && goods.photo.length > 0) {
                                photo_list = goods.photo;
                            } else if ((goods.images || null) != null) {
                                photo_list = [{ images: goods.images }];
                            }
                            var buy_display = result.detail_buy_display || {};
                            var inventory = parseInt(goods.inventory || 0);
                            var buy_button_text = buy_display.buy_button_text || '参与砍价';
                            var buy_button_type = buy_display.buy_button_type || 'start';
                            var buy_record_url = buy_display.buy_button_url || '';
                            var buy_disabled = buy_display.buy_disabled == 1;
                            if (inventory <= 0 && !buy_display.buy_button_text) {
                                buy_button_text = '没库存了';
                                buy_disabled = true;
                            }
                            var show_original_price = buy_display.show_original_price == 1;
                            var sale_min = parseFloat(goods.goods_min_price || goods.min_price || goods.price || 0);
                            if (!show_original_price && (goods.min_original_price || goods.original_price) != null && sale_min > 0) {
                                show_original_price = parseFloat(goods.min_original_price || goods.original_price) > sale_min;
                            }
                            var share_desc = (bargain.help_number_text || bargain.help_number || 0) + '人帮砍，' + (bargain.bargain_success_text || '快来一起砍价吧');
                            this.setData({
                                goods: goods,
                                bargain: bargain,
                                show_original_price: show_original_price,
                                bargain_config: result.bargain_config || {},
                                play_side_nav: result.play_side_nav || [],
                                detail_buy_nav: result.detail_buy_nav || [],
                                detail_buy_display_default: buy_display,
                                photo_list: photo_list,
                                display_price: goods.goods_min_price_text || goods.goods_min_price || goods.min_price || goods.price || '0.00',
                                buy_disabled: buy_disabled || inventory <= 0,
                                buy_button_text: buy_button_text,
                                buy_button_type: buy_button_type,
                                buy_record_url: buy_record_url,
                                spec_selected_text: '',
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                data_bottom_line_status: true,
                                share_info: {
                                    title: bargain.title || goods.title,
                                    desc: share_desc,
                                    path: '/pages/plugins/bargain/detail/detail',
                                    query: 'id=' + bargain.id,
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

            // 规格接口返回后更新底部按钮（与 Web 端按规格切换「参与砍价/查看砍价」一致）
            goods_back_success_event(e) {
                var record = ((e || {}).back_data || {}).user_bargain_record || null;
                if (record != null && (record.share_url || null) != null) {
                    this.setData({
                        buy_button_text: '查看砍价',
                        buy_button_type: 'record',
                        buy_record_url: record.share_url,
                        buy_disabled: false,
                    });
                    return;
                }
                var def = this.detail_buy_display_default || {};
                this.setData({
                    buy_button_text: def.buy_button_text || '参与砍价',
                    buy_button_type: def.buy_button_type || 'start',
                    buy_record_url: def.buy_button_url || '',
                    buy_disabled: def.buy_disabled == 1,
                });
            },

            // 参与砍价 / 查看砍价
            buy_open_event() {
                if (this.buy_disabled) {
                    return false;
                }
                if (this.buy_button_type == 'record' && (this.buy_record_url || '') != '') {
                    app.globalData.url_open(this.buy_record_url);
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'buy_open_event');
                if (user == false) {
                    return false;
                }
                this.$refs.goods_buy.init(
                    Object.assign({}, this.goods, { goods_id: this.goods.id, id: this.bargain.id }),
                    {
                    plugins_name: 'bargain',
                    buy_event_type: 'back',
                    is_success_tips: 0,
                    buy_button: {
                        data: [{ type: 'back', name: this.buy_button_text || '参与砍价', color: 'main' }],
                    },
                }
                );
            },

            bargain_start_event(e) {
                var spec = (e || {}).spec || [];
                uni.request({
                    url: app.globalData.get_request_url('start', 'index', 'bargain'),
                    method: 'POST',
                    data: {
                        bargain_id: parseInt(this.bargain.id || 0),
                        stock: parseInt((e || {}).buy_number || 1),
                        spec: JSON.stringify(spec),
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && (res.data.data.url || null) != null) {
                            if ((this.$refs.goods_buy || null) != null) {
                                this.$refs.goods_buy.popup_close_event();
                            }
                            app.globalData.url_open(res.data.data.url);
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'bargain_start_event')) {
                                app.globalData.showToast(res.data.msg || this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
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

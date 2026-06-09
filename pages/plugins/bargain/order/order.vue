<template>
    <view :class="theme_view">
        <!-- 自定义导航 + 搜索 -->
        <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :propName="nav_title" :style="'padding-top:' + status_bar_height + 'px;'">
            <template slot="right" :class="is_mp_env ? 'top-search-width' : ''">
                <view class="margin-left-main" :class="is_mp_env ? '' : 'flex-1 flex-width'">
                    <component-search
                        @onsearch="search_button_event"
                        :propDefaultValue="search_keywords"
                        :propIsOnEvent="true"
                        :propIsRequired="false"
                        :propPlaceholder="$t('plugins-bargain-order.order.gbo001')"
                        propIconColor="#ccc"
                        propPlaceholderClass="cr-grey-c"
                        propBgColor="#f6f6f6"
                    ></component-search>
                </view>
            </template>
        </component-nav-back>
        <view class="bargain-order-header bg-white">
            <view v-if="nav_status_list.length > 0" class="nav-base bargain-order-nav scroll-view-horizontal padding-horizontal-main">
                <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'bargain-nav-' + nav_status_index">
                    <block v-for="(item, index) in nav_status_list" :key="index">
                        <view
                            :id="'bargain-nav-' + index"
                            :class="'item tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : 'cr-grey')"
                            :data-index="index"
                            @tap="nav_event"
                        >{{ item.name }}</view>
                    </block>
                </scroll-view>
            </view>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box-bargain-order" :style="content_style" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                        <text class="cr-grey-9">{{ item.add_time }}</text>
                        <text :class="item.status_class || 'cr-grey-9'">{{ item.status_name }}</text>
                    </view>
                    <block v-for="(items, index2) in item.detail" :key="index2">
                        <view class="oh margin-top flex-row gap-10" :data-value="items.url || items.goods_url" @tap="url_event">
                            <image :src="items.images" mode="aspectFill" class="br-f5 radius goods-cover"></image>
                            <view class="goods-base flex-1 flex-width">
                                <view class="single-text">{{ items.title }}</view>
                                <view class="margin-top-xs cr-grey text-size-xs">
                                    <text>{{ currency_symbol }}{{ items.price }} x{{ items.buy_number }}</text>
                                </view>
                                <view v-if="(items.spec_text || null) != null" class="margin-top-xs cr-grey-9 text-size-xs single-text">{{ items.spec_text }}</view>
                            </view>
                        </view>
                    </block>
                    <component-panel-content :propData="item" :propDataField="field_list" propIsItemShowMax="6" propExcludeField="add_time,status_name" :propIsTerse="true"></component-panel-content>
                    <view v-if="(item.team_url || null) != null || (item.system_order_url || null) != null || (item.is_operate_success_pay || 0) == 1 || (item.is_operate_team_cancel || 0) == 1 || (item.is_operate_cancel || 0) == 1 || (item.is_operate_delete || 0) == 1" class="item-operation tr margin-top-main">
                        <button v-if="(item.team_url || null) != null" class="btn round bg-main br-main cr-white text-size-md margin-bottom-sm" type="default" size="mini" :data-value="item.team_url" @tap="url_event" hover-class="none">{{ $t('bargain.bargain.bargain') }}</button>
                        <button v-if="(item.is_operate_success_pay || 0) == 1" class="btn round bg-main br-main cr-white text-size-md margin-bottom-sm" type="default" size="mini" @tap="success_pay_event" :data-index="index" hover-class="none">{{ $t('common.place_order_text') }}</button>
                        <button v-if="(item.system_order_url || null) != null" class="btn round br-green cr-green bg-white text-size-md margin-bottom-sm" type="default" size="mini" :data-value="item.system_order_url" @tap="url_event" hover-class="none">{{ $t('common.order') }}</button>
                        <button v-if="(item.is_operate_team_cancel || 0) == 1" class="btn round br-grey-9 bg-white text-size-md margin-bottom-sm" type="default" size="mini" @tap="team_cancel_event" :data-value="item.team_cancel_record_id" :data-id="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="(item.is_operate_cancel || 0) == 1" class="btn round br-grey-9 bg-white text-size-md" type="default" size="mini" @tap="cancel_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.cancel')}}</button>
                        <button v-if="(item.is_operate_delete || 0) == 1" class="btn round br-red cr-red bg-white text-size-md" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.del')}}</button>
                    </view>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </scroll-view>
        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentSearch from '@/components/search/search';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from '@/components/panel-content/panel-content';

    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                client_type: app.globalData.application_client_type(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                nav_title: '',
                content_style: '',
                field_list: [],
                params: {},
                currency_symbol: app.globalData.currency_symbol(),
                data_base: null,
                bargain_config: {},
                data_list: [],
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                search_keywords: '',
                nav_status_list: [],
                nav_status_index: 0,
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentSearch,
            componentNoData,
            componentBottomLine,
            componentPanelContent,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params || {});

            this.setData({
                params: params || {},
                search_keywords: params.order_no || params.keywords || '',
                nav_title: this.$t('pages.plugins-bargain-order'),
                content_style: 'height: calc(100vh - 80rpx - ' + (this.status_bar_height + (this.client_type == 'h5' ? 55 : 50)) + 'px);',
            });

            // 初始化配置
            this.init_config();

            // 初始化
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // onShow 可能早于 init 完成，tab 已就绪但列表未拉取时补拉一次
            if (this.nav_status_list.length > 0 && this.data_list.length <= 0 && this.data_is_loading == 0) {
                this.setData({
                    data_page: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            } else if (this.nav_status_list.length <= 0 && this.data_list_loding_status != 1) {
                this.init();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data_base();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_bottom_line_status: false,
                    });
                }
            },

            // 获取基础数据
            get_data_base() {
                uni.request({
                    url: app.globalData.get_request_url('init', 'order', 'bargain'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var nav_list = data.nav_list || [];
                            var nav_status_index = 0;
                            var page_params = this.params || {};
                            if ((page_params.status || null) != null) {
                                for (var i in nav_list) {
                                    if (nav_list[i].value == page_params.status) {
                                        nav_status_index = parseInt(i);
                                        break;
                                    }
                                }
                            }
                            var self = this;
                            this.setData({
                                data_base: data.data_base || null,
                                bargain_config: data.bargain_config || {},
                                nav_status_list: nav_list,
                                nav_status_index: nav_status_index,
                                data_page: 1,
                                data_bottom_line_status: false,
                            }, function () {
                                self.get_data_list(1);
                            });
                            if ((data.data_base || null) != null) {
                                var title = data.data_base.user_menu_name || data.data_base.application_name || '';
                                if (title != '') {
                                    this.setData({
                                        nav_title: title,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_base')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 获取数据列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status == true) {
                    uni.stopPullDownRefresh();
                    return false;
                }
                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                var nav_list = this.nav_status_list || [];
                if (nav_list.length <= 0) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });

                // 请求参数
                var data = { page: this.data_page };
                var nav = nav_list[this.nav_status_index] || nav_list[0] || null;
                if (nav != null && nav.value != -1) {
                    data.status = nav.value;
                }
                if ((this.search_keywords || null) != null && this.search_keywords.length > 0) {
                    data.order_no = this.search_keywords;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'order', 'bargain'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            if (this.data_page <= 1) {
                                var temp_data_list = result.data_list || [];
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = result.data_list || [];
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }
                            temp_data_list = this.format_order_list(temp_data_list);
                            this.setData({
                                field_list: result.field_list || [],
                                data_list: temp_data_list,
                                data_page_total: result.page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                            // 是否还有数据（有列表且已加载完才显示底线，无数据不显示）
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },

            // 导航切换
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            // 砍价成功下单（与帮砍页、PC 订单列表一致）
            success_pay_event(e) {
                var index = e.currentTarget.dataset.index;
                var item = (this.data_list || [])[index] || {};
                if ((item.success_pay_goods_data || '') == '') {
                    return;
                }
                var data = {
                    buy_type: 'goods',
                    goods_data: item.success_pay_goods_data,
                    bargain_id: item.success_pay_bargain_id || item.bargain_id || 0,
                    record_id: item.success_pay_record_id || item.record_id || 0,
                    is_bargain_success_pay: 1,
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },
            // 取消成功后拉取订单详情替换当前项
            order_item_replace_by_detail(order_id, index, success_msg) {
                var self = this;
                if ((order_id || 0) <= 0 || index === undefined || index === null) {
                    uni.hideLoading();
                    if ((success_msg || null) != null) {
                        app.globalData.showToast(success_msg, 'success');
                    }
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('detail', 'order', 'bargain'),
                    method: 'POST',
                    data: { id: order_id },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var result_data = res.data.data || {};
                            var detail_data = (result_data.data || null) != null ? result_data.data : null;
                            if (detail_data == null && (result_data.data_list || null) != null && result_data.data_list.length > 0) {
                                detail_data = result_data.data_list[0];
                            }
                            if (detail_data != null) {
                                var temp_data_list = self.data_list || [];
                                var new_item = Object.assign({}, temp_data_list[index] || {}, detail_data);
                                var formatted_list = self.format_order_list([new_item]);
                                if (formatted_list.length > 0) {
                                    temp_data_list[index] = formatted_list[0];
                                    self.setData({ data_list: temp_data_list });
                                }
                            }
                            if ((success_msg || null) != null) {
                                app.globalData.showToast(success_msg, 'success');
                            }
                        } else if ((success_msg || null) != null) {
                            app.globalData.showToast(success_msg, 'success');
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        if ((success_msg || null) != null) {
                            app.globalData.showToast(success_msg, 'success');
                        } else {
                            app.globalData.showToast(self.$t('common.internet_error_tips'));
                        }
                    },
                });
            },
            // 取消发起砍价
            team_cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    success: (result) => {
                        if (result.confirm) {
                            var record_id = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            uni.showLoading({ title: this.$t('common.processing_in_text') });
                            uni.request({
                                url: app.globalData.get_request_url('teamcancel', 'index', 'bargain'),
                                method: 'POST',
                                data: { record_id: record_id },
                                dataType: 'json',
                                success: (res) => {
                                    if (res.data.code == 0) {
                                        var order_id = e.currentTarget.dataset.id || ((this.data_list[index] || {}).id || 0);
                                        this.order_item_replace_by_detail(order_id, index, res.data.msg);
                                    } else {
                                        uni.hideLoading();
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },
            // 取消
            cancel_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    success: (result) => {
                        if (result.confirm) {
                            var value = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            uni.showLoading({ title: this.$t('common.processing_in_text') });
                            uni.request({
                                url: app.globalData.get_request_url('cancel', 'order', 'bargain'),
                                method: 'POST',
                                data: { ids: value },
                                dataType: 'json',
                                success: (res) => {
                                    if (res.data.code == 0) {
                                        this.order_item_replace_by_detail(value, index, res.data.msg);
                                    } else {
                                        uni.hideLoading();
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },
            // 删除
            delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.delete_confirm_tips'),
                    success: (result) => {
                        if (result.confirm) {
                            var value = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;
                            uni.showLoading({ title: this.$t('common.processing_in_text') });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'order', 'bargain'),
                                method: 'POST',
                                data: { ids: value },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list,
                                            data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                        });
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 列表状态样式
            format_order_list(list) {
                if (list == null || list.length <= 0) {
                    return list || [];
                }
                for (var i = 0; i < list.length; i++) {
                    var s = parseInt(list[i].status);
                    var status_class = 'cr-grey-9';
                    if (s === 2) {
                        status_class = 'cr-green';
                    } else if (s === 3) {
                        status_class = 'cr-yellow';
                    } else if (s === 4 || s === 5) {
                        status_class = 'cr-red';
                    } else if (s === 1) {
                        status_class = 'cr-main';
                    }
                    list[i].status_class = status_class;
                }
                return list;
            },
            // 关键字搜索
            search_button_event(e) {
                this.setData({
                    search_keywords: e,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },
        },
    };
</script>
<style>
    @import './order.css';
</style>

<template>
    <view :class="theme_view">
        <!-- 公告 -->
        <view v-if="(data_base || null) != null && (data_base.invoice_desc || null) != null && data_base.invoice_desc.length > 0" class="padding-horizontal-main padding-vertical-sm bg-white">
            <uni-notice-bar class="padding-0 margin-0" show-icon scrollable :text="data_base.invoice_desc.join('')" background-color="transparent" color="#666" />
        </view>
        <!-- 导航 -->
        <view v-if="nav_status_list.length > 0" class="nav-base bg-white flex-row jc-sa align-c">
            <block v-for="(item, index) in nav_status_list" :key="index">
                <view :class="'item tc cr-grey ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
            </block>
        </view>
        <!-- 列表 -->
        <scroll-view :scroll-y="true" :class="'scroll-box-ece-nav '+((data_base || null) != null && (data_base.invoice_desc || null) != null && data_base.invoice_desc.length > 0 ? 'top-notice' : '')" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="page-bottom-fixed">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                            <text class="cr-grey-9">{{ item.add_time }}</text>
                            <text class="cr-black" :class="item.status == 0 || item.status == 1 ? 'cr-black' : item.status == 2 ? 'cr-grey-c' : 'cr-red'">{{ item.status_name }}</text>
                        </view>
                        <view class="content margin-top-main">
                            <navigator :url="'/pages/plugins/invoice/invoice-detail/invoice-detail?id=' + item.id" hover-class="none">
                                <block v-for="(fv, fi) in content_list" :key="fi">
                                    <view class="single-text margin-top-xs">
                                        <text class="cr-grey-9 margin-right-main">{{ fv.name }}:</text>
                                        <text class="cr-black">{{ item[fv.field] }}</text>
                                        <text v-if="(fv.unit || null) != null" class="cr-grey">{{ fv.unit }}</text>
                                    </view>
                                </block>
                            </navigator>
                        </view>
                        <!-- 0待审核、1待开票、2已开票、3已拒绝, 4已关闭） -->
                        <view v-if="item.status == 0 || item.status == 3 || item.status == 4" class="item-operation tr margin-top-main">
                            <button class="round br-grey-9 bg-white text-size-md" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
                            <button v-if="item.status == 0 || item.status == 3" class="round cr-main br-main bg-white text-size-md" type="default" size="mini" @tap="edit_event" :data-value="item.id" hover-class="none">编辑</button>
                        </view>
                    </view>
                    <view class="bottom-fixed">
                        <view class="bottom-line-exclude">
                            <navigator url="/pages/plugins/invoice/order/order" hover-class="none" class="sub-btn">
                                <button class="round cr-main bg-white br-main text-size wh-auto" type="default" hover-class="none">订单开票</button>
                            </navigator>
                        </view>
                    </view>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data :propStatus="data_list_loding_status"></component-no-data>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
    import componentBottomLine from '../../../../components/bottom-line/bottom-line';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_base: null,
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null,
                nav_status_list: [],
                nav_status_index: 0,
                content_list: [
                    { name: '业务类型', field: 'business_type_name' },
                    { name: '申请类型', field: 'apply_type_name' },
                    { name: '发票类型', field: 'invoice_type_name' },
                    { name: '发票金额', field: 'total_price', unit: '元' },
                    { name: '发票抬头', field: 'invoice_title' },
                ],
            };
        },

        components: {
            componentNoData,
            componentBottomLine,
        },
        props: {},

        onLoad(params) {
            // 是否指定状态
            var nav_status_index = 0;
            if ((params.status || null) != null) {
                for (var i in this.nav_status_list) {
                    if (this.nav_status_list[i]['id'] == params.status) {
                        nav_status_index = i;
                        break;
                    }
                }
            }
            this.setData({
                params: params,
                nav_status_index: nav_status_index,
            });
        },

        onShow() {
            // 初始化配置
            this.init();

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
            // 初始化
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.stopPullDownRefresh();
                        uni.navigateTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                    } else {
                        this.get_data_base();
                    }
                }
            },
            // 获取公告数据
            get_data_base() {
                uni.request({
                    url: app.globalData.get_request_url('center', 'user', 'invoice'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                nav_status_list: data.nav || [],
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                data_page: 1,
                            });
                            this.get_data_list();
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
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
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 获取数据
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });

                // 加载loding
                uni.showLoading({
                    title: '加载中...',
                });

                // 请求数据
                var data = {
                    page: this.data_page,
                };

                // 状态
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['id'];
                if (status != -1) {
                    data['status'] = status;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'invoice'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = res.data.data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = res.data.data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: res.data.data.total,
                                    data_page_total: res.data.data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_list: [],
                                    data_bottom_line_status: false,
                                    data_is_loading: 0,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_is_loading: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // 编辑事件
            edit_event(e) {
                uni.navigateTo({
                    url: '/pages/plugins/invoice/invoice-saveinfo/invoice-saveinfo?id=' + e.currentTarget.dataset.value,
                });
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复，确定继续吗?',
                    confirmText: '确认',
                    cancelText: '不了',
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var value = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;

                            // 加载loding
                            uni.showLoading({
                                title: '处理中...',
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'user', 'invoice'),
                                method: 'POST',
                                data: {
                                    ids: value,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var temp_data_list = this.data_list;
                                        temp_data_list.splice(index, 1);
                                        this.setData({
                                            data_list: temp_data_list,
                                        });
                                        if (temp_data_list.length == 0) {
                                            this.setData({
                                                data_list_loding_status: 0,
                                                data_bottom_line_status: false,
                                            });
                                        }
                                        app.globalData.showToast(res.data.msg, 'success');
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast('网络开小差了哦~');
                                },
                            });
                        }
                    },
                });
            },
        },
    };
</script>
<style>
    @import './invoice.css';
</style>

<template>
    <view :class="theme_view">
        <!-- 列表 -->
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view class="base oh br-b padding-bottom-main">
                        <text class="cr-base">{{ item.add_time }}</text>
                        <text :class="'fr ' + (item.is_enable == 1 ? 'cr-green' : 'cr-grey')">{{ item.is_enable_text }}</text>
                    </view>
                    <view class="content margin-top">
                        <navigator :url="'/pages/plugins/distribution/recommend-detail/recommend-detail?id=' + item.id" hover-class="none">
                            <block v-for="(fv, fi) in content_list" :key="fi">
                                <view class="single-text margin-top-xs">
                                    <text class="cr-grey margin-right-xl">{{ fv.name }}</text>
                                    <text class="cr-base">{{ item[fv.field] }}</text>
                                </view>
                            </block>
                        </navigator>
                    </view>
                    <view class="item-operation tr br-t padding-top-main margin-top-main">
                        <button class="round bg-white br-green cr-green" type="default" size="mini" hover-class="none" @tap="popup_share_event" :data-index="index">分享</button>
                        <navigator :url="'/pages/plugins/distribution/recommend-form/recommend-form?id=' + item.id" hover-class="none" class="dis-inline-block margin-left-lg">
                            <button class="round bg-white br-main cr-main" type="default" size="mini" hover-class="none">编辑</button>
                        </navigator>
                        <button class="round bg-white br-red cr-red margin-left-lg" type="default" size="mini" hover-class="none" @tap="delete_event" :data-index="index">删除</button>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status"></component-no-data>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <!-- 新增入口 -->
        <navigator url="/pages/plugins/distribution/recommend-form/recommend-form" hover-class="none">
            <view class="add-submit bg-main cr-white round tc">+</view>
        </navigator>

        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>
    </view>
</template>
<script>
const app = getApp();
import componentNoData from "../../../../components/no-data/no-data";
import componentBottomLine from "../../../../components/bottom-line/bottom-line";
import componentSharePopup from "../../../../components/share-popup/share-popup";

export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
            data_list: [],
            data_total: 0,
            data_page_total: 0,
            data_page: 1,
            data_list_loding_status: 1,
            data_bottom_line_status: false,
            data_is_loading: 0,
            params: null,
            content_list: [
                { name: "标题", field: "title" },
                { name: "描述", field: "describe" },
                { name: "商品", field: "goods_count" },
                { name: "访问", field: "access_count" },
            ],
            // 自定义分享信息
            share_info: {},
        };
    },

    components: {
        componentNoData,
        componentBottomLine,
        componentSharePopup,
    },
    props: {},

    onShow() {
        // 数据加载
        this.init();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.setData({
            data_page: 1,
        });
        this.get_data_list(1);
    },

    methods: {
        init() {
            var user = app.globalData.get_user_info(this, "init");
            if (user != false) {
                // 用户未绑定手机则转到登录页面
                if (app.globalData.user_is_need_login(user)) {
                    uni.redirectTo({
                        url: "/pages/login/login?event_callback=init",
                    });
                    return false;
                } else {
                    // 获取数据
                    this.get_data_list();
                }
            } else {
                this.setData({
                    data_list_loding_status: 0,
                    data_bottom_line_status: false,
                });
            }
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
                title: "加载中...",
            });

            // 参数
            uni.request({
                url: app.globalData.get_request_url("index", "recommend", "distribution"),
                method: "POST",
                data: {
                    page: this.data_page,
                    is_more: 1,
                },
                dataType: "json",
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
                        if (app.globalData.is_login_check(res.data, this, "get_data_list")) {
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
                    app.globalData.showToast("服务器请求出错");
                },
            });
        },

        // 滚动加载
        scroll_lower(e) {
            this.get_data_list();
        },

        // 分享开启弹层
        popup_share_event(e) {
            var index = e.currentTarget.dataset.index || 0;
            var data = this.data_list[index] || null;
            if (data == null) {
                app.globalData.showToast("数据有误");
                return false;
            }
            this.setData({
                share_info: {
                    title: data.seo_title || data.title,
                    kds: data.seo_keywords || data.describe,
                    desc: data.seo_desc || data.describe,
                    path: "/pages/plugins/distribution/recommend-detail/recommend-detail",
                    query: "id=" + data.id,
                    img: data.icon || "",
                },
            });
            // 分享菜单处理
            app.globalData.page_share_handle(this.share_info);

            // 调取分享弹窗
            if ((this.$refs.share || null) != null) {
                this.$refs.share.init();
            }
        },

        // 删除数据
        delete_event(e) {
            var index = e.currentTarget.dataset.index || 0;
            var temp_data = this.data_list;
            var data = temp_data[index] || null;
            if (data == null) {
                app.globalData.showToast("数据有误");
                return false;
            }
            uni.showModal({
                title: "温馨提示",
                content: "删除后不可恢复，确定继续吗?",
                confirmText: "确认",
                cancelText: "不了",
                success: (result) => {
                    if (result.confirm) {
                        uni.showLoading({
                            title: "处理中...",
                        });
                        uni.request({
                            url: app.globalData.get_request_url("delete", "recommend", "distribution"),
                            method: "POST",
                            data: { ids: data.id },
                            dataType: "json",
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    temp_data.splice(index, 1);
                                    this.setData({
                                        data_list: temp_data,
                                    });
                                    app.globalData.showToast(res.data.msg, "success");
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast("服务器请求出错");
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
@import "./recommend-list.css";
</style>

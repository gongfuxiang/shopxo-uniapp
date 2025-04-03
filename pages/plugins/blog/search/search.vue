<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null">
            <!-- 搜索关键字 -->
            <view class="padding-horizontal-main padding-top-main padding-bottom-sm bg-white">
                <view class="search-keywords pr">
                    <icon type="search" size="12" class="pa"></icon>
                    <input type="text" confirm-type="search" :placeholder="$t('search.search.723rbx')" :value="search_keywords_value" @confirm="search_keywords_event" class="cr-base round wh-auto" placeholder-class="cr-grey" />
                </view>
            </view>

            <!-- 分类 -->
            <scroll-view v-if="(category || null) != null && category.length > 0" class="nav-list scroll-view-horizontal bg-white oh" scroll-x="true">
                <view :class="'item cr-grey dis-inline-block padding-horizontal-main ' + (nav_active_value == 0 ? 'cr-main' : '')" @tap="nav_event" data-value="0">{{ $t('common.all') }}</view>
                <block v-for="(item, index) in category" :key="index">
                    <view :class="'item cr-grey dis-inline-block padding-horizontal-main ' + (nav_active_value == item.id ? 'cr-main' : '')" @tap="nav_event" :data-value="item.id">{{ item.name }}</view>
                </block>
            </scroll-view>

            <!-- 列表 -->
            <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
                <view :class="(data_base.is_user_add_blog || 0) == 1 ? 'page-bottom-fixed' : ''">
                    <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-blog-list padding-horizontal-main padding-top-main oh">
                        <view v-for="(item, index) in data_list" :key="index">
                            <view :data-value="item.url" @tap="url_event" class="item oh cp padding-main border-radius-main bg-white spacing-mb">
                                <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                                <view class="base fr">
                                    <view class="single-text text-size">{{ item.title }}</view>
                                    <view class="cr-grey margin-top-sm">{{ item.add_time_date_cn }}</view>
                                    <view class="cr-base text-size-sm multi-text margin-top-sm">{{ item.describe }}</view>
                                </view>
                            </view>
                        </view>
                        <!-- 结尾 -->
                        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                    </view>
                </view>
            </scroll-view>

            <!-- 发布博文、我的博文入口 -->
            <view v-if="(data_base.is_user_add_blog || 0) == 1" class="bottom-fixed" :style="bottom_fixed_style">
                <view class="bottom-line-exclude">
                    <view class="item flex-row jc-sa align-c text-size fw-b br bg-white round padding-vertical">
                        <view data-value="/pages/plugins/blog/form/form" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                            <view class="divider-r-d wh-auto"> <iconfont name="icon-edit-below-line" size="30rpx" color="#333" propClass="margin-right-sm"></iconfont>{{$t('detail.detail.fn3w01')}}{{ blog_main_name }}</view>
                        </view>
                        <view data-value="/pages/plugins/blog/user-list/user-list" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                            <view class="wh-auto"> <iconfont name="icon-list-dot" size="32rpx" color="#333" propClass="margin-right-sm pr top-xs"></iconfont>{{$t('common.my')}}{{ blog_main_name }}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                bottom_fixed_style: '',
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                params: null,
                data_base: null,
                category: [],
                nav_active_value: 0,
                search_keywords_value: '',
                // 自定义分享信息
                share_info: {},
                blog_main_name: this.$t('detail.detail.e439j9'),
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 设置参数
            this.setData({
                params: params,
                nav_active_value: params.id || 0,
                search_keywords_value: params.keywords || '',
            });

            // 数据加载
            this.get_data();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
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
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'search', 'blog'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 标题
                            var blog_main_name = (data.base || null) == null ? this.$t('detail.detail.e439j9') : data.base.blog_main_name || this.$t('detail.detail.e439j9');
                            this.setData({
                                data_base: data.base || null,
                                category: data.category || [],
                                blog_main_name: blog_main_name,
                            });
                            uni.setNavigationBarTitle({ title: blog_main_name + this.$t('common.search') });

                            // 获取列表数据
                            this.get_data_list(1);
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 获取数据列表
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 基础自定义分享
                this.share_info_handle();

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({ data_is_loading: 1 });

                // 加载loding
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search', 'blog'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        id: this.nav_active_value,
                        bwd: this.search_keywords_value,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            if (data.data.length > 0) {
                                if (this.data_page <= 1) {
                                    var temp_data_list = data.data;
                                } else {
                                    var temp_data_list = this.data_list || [];
                                    var temp_data = data.data;
                                    for (var i in temp_data) {
                                        temp_data_list.push(temp_data[i]);
                                    }
                                }
                                this.setData({
                                    data_list: temp_data_list,
                                    data_total: data.total,
                                    data_page_total: data.page_total,
                                    data_list_loding_status: 3,
                                    data_page: this.data_page + 1,
                                    data_is_loading: 0,
                                });

                                // 是否还有数据
                                this.setData({
                                    data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                                });
                            } else {
                                this.setData({
                                    data_list_loding_status: 0,
                                    data_is_loading: 0,
                                });
                                if (this.data_page <= 1) {
                                    this.setData({
                                        data_list: [],
                                        data_bottom_line_status: false,
                                    });
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        if(this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 分享设置处理
            share_info_handle() {
                // 基础自定义分享
                var info = this.data_base || {};
                if ((this.nav_active_value || 0) != 0 && this.category.length > 0) {
                    for (var i in this.category) {
                        if (this.nav_active_value == this.category[i]['id']) {
                            info = this.category[i];
                            break;
                        }
                    }
                }
                this.setData({
                    share_info: {
                        title: info.seo_title || this.data_base.application_name,
                        desc: info.seo_desc,
                        path: '/pages/plugins/blog/search/search',
                        query: 'id=' + this.nav_active_value + '&keywords=' + this.search_keywords_value,
                    },
                });

                // 分享菜单处理
                app.globalData.page_share_handle(this.share_info);
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false
                });
                this.get_data_list(1);
            },

            // 关键字输入事件
            search_keywords_event(e) {
                this.setData({
                    search_keywords_value: e.detail.value || '',
                    data_page: 1,
                });
                this.get_data_list(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './search.css';
</style>

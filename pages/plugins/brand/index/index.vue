<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null">
            <view class="pr">
                <!-- 分类 -->
                <scroll-view v-if="(brand_category_list || null) != null && brand_category_list.length > 0" :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true" :scroll-into-view="'one-nav-item-' + nav_active_index" class="nav-list scroll-view-horizontal bg-white oh" scroll-x="true">
                    <view class="flex-row flex-nowrap align-c">
                        <block v-for="(item, index) in brand_category_list" :key="index">
                            <view class="item flex-col align-c text-size-xss" :id="'one-nav-item-' + index" :data-index="index" @tap="nav_event" :data-value="item.id">
                                <image :src="item.icon" mode="aspectFit"></image>
                                <view class="padding-left-sm padding-right-sm round" :class="nav_active_value == item.id ? 'bg-main cr-white' : ''">
                                    {{ item.name }}
                                </view>
                            </view>
                        </block>
                    </view>
                </scroll-view>
                <component-nav-more propClass="bg-white" :propStatus="popupStatus" @open-popup="open_popup_event">
                    <view class="nav-list-more">
                        <view class="flex-row flex-wrap align-c">
                            <block v-for="(item, index) in brand_category_list" :key="index">
                                <view class="item flex-col align-c text-size-xss" @tap="nav_event" :id="'one-nav-item-' + index" :data-index="index" :data-value="item.id">
                                    <image :src="item.icon" mode="aspectFit"></image>
                                    <view class="padding-left-sm padding-right-sm round" :class="nav_active_value == item.id ? 'bg-main cr-white' : ''">
                                        {{ item.name }}
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                </component-nav-more>
            </view>

            <!-- 列表 -->
            <view v-if="(brand_list || null) != null && brand_list.length > 0" class="data-list padding-horizontal-main padding-top-main oh">
                <block v-for="(item, index) in brand_list" :key="index">
                    <view v-if="(item.is_not_show || 0) == 0" :data-value="'/pages/goods-search/goods-search?brand=' + item.id" @tap="url_event" class="item border-radius-main bg-white oh cp spacing-mb">
                        <image :src="item.logo" mode="aspectFit"></image>
                        <view class="padding-main tc">
                            <view class="single-text fw-b cr-base">{{ item.name }}</view>
                        </view>
                    </view>
                </block>
            </view>

            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentNavMore from '@/components/nav-more/nav-more';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                data_base: null,
                brand_list: [],
                brand_category_list: [],
                nav_active_value: 0,
                // 自定义分享信息
                share_info: {},
                popupStatus: false,
                nav_active_index: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentNavMore,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
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

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'brand'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var brand_list = data.brand_list || [];
                            this.setData({
                                data_base: data.base || null,
                                brand_list: brand_list,
                                brand_category_list: data.brand_category_list || [],
                                data_list_loding_msg: '',
                                data_list_loding_status: brand_list.length > 0 ? 3 : 0,
                                data_bottom_line_status: brand_list.length > 0,
                            });

                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data_base.seo_title || this.data_base.application_name,
                                    desc: this.data_base.seo_desc,
                                    path: '/pages/plugins/brand/index/index',
                                },
                            });

                            // 导航选中处理
                            this.nav_active_handle();

                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 导航事件
            nav_event(e) {
                this.setData({
                    nav_active_value: e.currentTarget.dataset.value || 0,
                    popupStatus: false,
                    nav_active_index: e.currentTarget.dataset.index,
                });
                this.nav_active_handle();
            },
            // 打开弹窗
            open_popup_event(e) {
                this.setData({
                    popupStatus: e,
                });
            },

            // 导航选中处理
            nav_active_handle() {
                var value = this.nav_active_value;
                var temp_brand_list = this.brand_list;
                var count = 0;
                for (var i in temp_brand_list) {
                    if (value == 0) {
                        temp_brand_list[i]['is_not_show'] = 0;
                        count++;
                    } else {
                        var is_not_show = temp_brand_list[i]['brand_category_ids'].indexOf(value) == -1 ? 1 : 0;
                        temp_brand_list[i]['is_not_show'] = is_not_show;
                        if (is_not_show == 0) {
                            count++;
                        }
                    }
                }

                this.setData({
                    brand_list: temp_brand_list,
                    data_list_loding_status: count > 0 ? 3 : 0,
                    data_bottom_line_status: count > 0,
                });
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
    @import './index.css';
</style>

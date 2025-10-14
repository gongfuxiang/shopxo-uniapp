<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                <view v-for="(item, index) in data_list" :key="index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                    <view :data-value="'/pages/form-input-data-detail/form-input-data-detail?id=' + item.id" @tap="url_event" class="content margin-top-main cp">
                        <component-panel-content :propData="item" :propDataField="field_list" :propIsTerse="true"></component-panel-content>
                    </view>
                    <view class="item-operation tr margin-top-main">
                        <button class="btn round cr-green br-green bg-white text-size-md" type="default" size="mini" :data-value="'/pages/form-input/form-input?id='+item.forminput_id+'&did='+item.id" @tap="url_event" hover-class="none">{{$t('common.edit')}}</button>
                        <button class="btn round cr-red br-red bg-white text-size-md" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">{{$t('common.del')}}</button>
                        <button class="btn round cr-base br-grey-9 bg-white text-size-md" type="default" size="mini" :data-value="'/pages/form-input-data-detail/form-input-data-detail?id='+item.id" @tap="url_event" hover-class="none">{{$t('common.detail_text')}}</button>
                    </view>
                </view>

                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <block v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>
        </scroll-view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from "@/components/panel-content/panel-content";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                field_list: [],
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                params: null
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
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
            // 初始化
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data_list();
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
                if(this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 请求数据
                var data = {
                    page: this.data_page,
                };
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'forminputdata'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            // 数据列表
                            var data = res.data.data;
                            if (this.data_page <= 1) {
                                var temp_data_list = data.data_list || [];
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = data.data_list;
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }
                    
                            this.setData({
                                field_list: data.field_list || [],
                                data_list: temp_data_list,
                                data_total: data.total,
                                data_page_total: data.page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: '',
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                    
                            // 是否还有数据
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 删除
            delete_event(e) {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('recommend-list.recommend-list.54d418'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 参数
                            var value = e.currentTarget.dataset.value;
                            var index = e.currentTarget.dataset.index;

                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'forminputdata'),
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
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style>
</style>
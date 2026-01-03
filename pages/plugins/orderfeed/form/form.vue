<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status !== 1">
            <form v-if="(item || null) != null" @submit="form_submit" class="form-container">
                <view class="page-bottom-fixed padding-main">
                    <view class="business bg-white padding-main border-radius-main flex-row gap-10 pr spacing-mb" :data-value="item.goods_url" @tap="url_event">
                        <image :src="item.images" mode="aspectFit" class="cover br-f5 radius"></image>
                        <view class="base">
                            <view class="multi-text">{{item.title}}</view>
                            <view v-if="(item.spec_text || null) != null" class="cr-grey margin-top-xs">{{item.spec_text}}</view>
                            <text v-if="(order || null) != null && (order.items || null) != null && order.items.length > 1" class="cr-blue cp pa right-0 bottom-0 padding" @tap.stop="order_goods_back_event">选择其他商品 >></text>
                        </view>
                    </view>
                    <view class="form-gorup border-radius-main spacing-mb">
                        <view class="form-gorup-title padding-right-main">{{$t('user-orderaftersale-detail.user-orderaftersale-detail.87tuff')}}<text class="form-group-tips-must">*</text></view>
                        <textarea name="describe" placeholder-class="cr-grey-9" class="cr-base" :placeholder="$t('user-orderaftersale-detail.user-orderaftersale-detail.6uygft')" maxlength="230" :value="data.describe || ''"></textarea>
                    </view>
                    <view class="form-gorup border-radius-main">
                        <view class="form-gorup-title padding-right-main">{{$t('common.image')}}<text class="form-group-tips">{{$t('complaint-form.complaint-form.56ys33')}}</text></view>
                        <view class="margin-top-main">
                            <component-upload :propData="data.images" :propMaxNum="10" :propPathType="editor_path_type" @call-back="retrun_image_event"></component-upload>
                        </view>
                    </view>
                    <view v-if="(tips || null) != null" class="bg-white oh padding-main border-radius-main cr-red spacing-mt">
                        <view>{{tips.title}}</view>
                        <view v-if="(tips.msg || null) != null" class="margin-top-sm">{{tips.msg}}</view>
                    </view>
                </view>
                <!-- 底部操作 -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view v-if="(user || null) != null && params.is_list != 0" class="tr padding-bottom-lg padding-right-sm">
                            <text class="cr-blue cp" @tap="url_event" data-value="/pages/plugins/orderfeed/user/user">{{$t('complaint-form.complaint-form.ssdff4')}} >></text>
                        </view>
                        <button class="item cr-white bg-main round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                    </view>
                </view>
            </form>
            <view v-else>
                <view v-if="(order || null) != null && (order.items || null) != null && order.items.length > 0" class="business padding-main">
                    <block v-for="(item, index) in order.items" :key="index">
                        <view class="bg-white padding-main border-radius-main spacing-mb flex-row gap-10 pr" :data-value="item.goods_url" @tap="url_event">
                            <image :src="item.images" mode="aspectFit" class="cover br-f5 radius"></image>
                            <view class="base">
                                <view class="multi-text">{{item.title}}</view>
                                <view v-if="(item.spec_text || null) != null" class="cr-grey margin-top-xs">{{item.spec_text}}</view>
                                <text class="cr-blue cp pa right-0 bottom-0 padding" :data-index="index" @tap.stop="order_goods_use_event">反馈该商品 >></text>
                            </view>
                        </view>
                    </block>
                </view>
                <block v-else>
                    <component-no-data propStatus="0"></component-no-data>
                </block>
            </view>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentUpload from '@/components/upload/upload';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                bottom_fixed_style: '',
                params: {},
                user: null,
                data: {},
                order: null,
                item: null,
                tips: null,
                editor_path_type: '',
                form_submit_loading: false,
                is_complaint_app_login: false,
            };
        },
        components: {
            componentCommon,
            componentUpload,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
                user: app.globalData.get_user_cache_info() || null,
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
            // 数据加载
            this.get_data();
        },

        // 页面销毁时执行
        onUnload: function () {},

        methods: {
            // 获取数据
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'userfeed', 'orderfeed'),
                    method: 'POST',
                    data: this.params,
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                data: data.data || {},
                                order: data.order || null,
                                item: data.item || null,
                                tips: data.tips || null,
                                editor_path_type: data.editor_path_type,
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
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

            // 订单商品使用事件
            order_goods_use_event(e) {
                var item = this.order.items[e.currentTarget.dataset.index];
                this.setData({
                    params: {...this.params, ...{odid: item.id}},
                });
                this.get_data();
            },

            // 订单商品返回事件
            order_goods_back_event(e) {
                this.setData({
                    params: {...this.params, ...{odid: 0}},
                });
                this.get_data();
            },

            // 上传回调
            retrun_image_event(res) {
                var temp_data = this.data;
                temp_data['images'] = res;
                this.setData({
                    data: temp_data,
                });
            },

            // 表单提交
            form_submit(e) {
                // 是否需要登录
                if(this.is_complaint_app_login) {
                    var user = app.globalData.get_user_info(this, 'form_submit', e);
                    if (user == false) {
                        return;
                    }
                }
                // 数据验证
                var validation = [
                    { fields: 'describe', msg: this.$t('user-orderaftersale-detail.user-orderaftersale-detail.6uygft') },
                ];
                var form_data = {...this.data, ...this.params};
                    form_data['describe'] = e.detail.value.describe;
                if (app.globalData.fields_check(form_data, validation)) {
                    if((this.item || null) != null) {
                        form_data['oid'] = this.item.order_id || 0;
                        form_data['odid'] = this.item.id || 0;
                    }
                    uni.showLoading({
                        title: this.$t('common.submit_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'userfeed', 'orderfeed'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.page_back_prev_event();
                                }, 2000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
    @import './form.css';
</style>

<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <view v-if="data_list_loding_status === 3">
                <form @submit="form_submit" class="form-container">
                    <view class="padding-main oh">
                        <!-- 用户中心公告 -->
                        <view v-if="(data_base.user_auth_tips || null) != null" class="padding-bottom">
                            <uni-notice-bar class="padding-0 margin-0" show-get-more show-icon scrollable :text="data_base.user_auth_tips" background-color="transparent" @click="popup_show_event" />
                        </view>
                        <view v-if="(data_base || null) != null" class="data-list">
                            <block v-for="(item, index) in data_base.user_auth_data" :key="index">
                                <view class="form-gorup border-radius-main pr oh spacing-mb item">
                                    <view class="form-gorup-title padding-right-main">
                                        <text>{{item.name}}</text>
                                        <text v-if="(item.required || 0) == 1" class="form-group-tips-must">*</text>
                                        <text v-if="(item.desc || null) != null" class="cr-grey text-size-xs margin-left-sm">{{item.desc}}</text>
                                        <text v-if="(item.example_images || null) != null" class="cr-blue text-size-xs margin-left-sm" :data-value="item.example_images" @tap="images_show_event">{{$t('common.view_examples')}}</text>
                                    </view>
                                    <view>
                                        <view class="fl margin-top-sm">
                                            <component-upload :propData="(licence_images_data[item.sign] || null) == null ? (((data[item.sign] || null) == null || (data[item.sign]['licence_images'] || null) == null) ? [] : [data[item.sign]['licence_images']]) : [licence_images_data[item.sign]]" :propDelete="(data[item.sign] || null) == null || (data[item.sign]['status'] || 0) != 1" :propMaxNum="1" propDataIndex="1" :propPathType="editor_path_type" :propCallData="item.sign" @call-back="retrun_image_event"></component-upload>
                                            <view v-if="(data[item.sign] || null) != null && (data[item.sign]['status_name'] || null) != null" class="padding-horizontal round dis-inline-block margin-top-sm" :class="data[item.sign]['status'] == 1 ? 'bg-green cr-white' : (data[item.sign]['status'] == 2 ? 'bg-red cr-white' : (data[item.sign]['status'] == 3 ? 'bg-yellow cr-white' : 'bg-grey cr-base'))">
                                                <text>{{data[item.sign]['status_name']}}</text>
                                            </view>
                                        </view>
                                        <view class="fr item-right">
                                            <view class="margin-top-sm">
                                                <view class="name dis-inline-block single-text va-m">{{$t('certificate-userauth.certificate-userauth.678iff')}}</view>
                                                <view class="dis-inline-block va-m">
                                                    <input type="text" :name="item.sign+'-licence_name'" :value="(data[item.sign] || null) == null ? '' : (data[item.sign]['licence_name'] || '')" :disabled="(data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1" placeholder-class="cr-grey" class="value radius padding-horizontal-sm" :class="(data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1 ? 'cr-grey-c br-f5' : 'cr-base br'" :placeholder="$t('certificate-userauth.certificate-userauth.678iff')" maxlength="160" />
                                                </view>
                                            </view>
                                            <view class="margin-top-sm">
                                                <view class="name dis-inline-block single-text">{{$t('certificate-userauth.certificate-userauth.tufg33')}}</view>
                                                <view class="dis-inline-block va-m">
                                                    <input type="text" :name="item.sign+'-licence_number'" :value="(data[item.sign] || null) == null ? '' : (data[item.sign]['licence_number'] || '')" :disabled="(data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1" placeholder-class="cr-grey" class="value radius padding-horizontal-sm" :class="(data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1 ? 'cr-grey-c br-f5' : 'cr-base br'" :placeholder="$t('certificate-userauth.certificate-userauth.tufg33')" maxlength="160" />
                                                </view>
                                            </view>
                                            <view class="margin-top-sm">
                                                <view class="name dis-inline-block single-text">{{$t('certificate-userauth.certificate-userauth.ftyui3')}}</view>
                                                <view class="dis-inline-block va-m">
                                                    <picker :name="item.sign+'-licence_expire_time'" mode="date" :disabled="(data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1" class="wh-auto pr" :value="(data[item.sign] || null) == null ? '' : (data[item.sign]['licence_expire_time'] || '')" :data-sign="item.sign" @change="picker_time_change_event">
                                                        <view :class="'picker value radius tl padding-horizontal-sm '+ ((data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1 ? 'br-f5 cr-grey-c ' : 'cr-base br ') + ((data[item.sign] || null) == null || (data[item.sign]['licence_expire_time'] || null) == null ? 'cr-grey-c' : 'cr-base')">{{ (data[item.sign] || null) == null || (data[item.sign]['licence_expire_time'] || null) == null ? $t('certificate-userauth.certificate-userauth.ftyui3') : data[item.sign]['licence_expire_time'] }}</view>
                                                        <view class="dis-inline-block pa top-xxxl right-xl">
                                                            <iconfont name="icon-arrow-right" size="28rpx" :color="(data[item.sign] || null) != null && (data[item.sign]['status'] || 0) == 1 ? '#ededed' : '#ccc'"></iconfont>
                                                        </view>
                                                    </picker>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <view class="bottom-fixed" :style="bottom_fixed_style">
                            <view class="bottom-line-exclude">
                                <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                            </view>
                        </view>
                    </view>
                </form>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>

        <!-- 用户授权提示信息弹窗 -->
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="user-auth-tips-popup bg-white">
                <view class="close tc oh padding-main">
                    <text>{{$t('common.warm_tips')}}</text>
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="24rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="content padding-main">
                    <view v-if="(data_base || null) != null && (data_base.user_auth_tips || null) != null && data_base.user_auth_tips.length > 0" class="cr-base">
                        <block v-for="(item, index) in data_base.user_auth_tips" :key="index">
                            <view class="padding-vertical-xs">{{item}}</view>
                        </block>
                    </view>
                    <block v-else>
                        <component-no-data propStatus="0"></component-no-data>
                    </block>
                </view>
            </view>
        </component-popup>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentUpload from '@/components/upload/upload';
    import componentPopup from '@/components/popup/popup';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                form_submit_loading: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                bottom_fixed_style: '',
                editor_path_type: '',
                data_base: null,
                data: {},
                licence_images_data: {},
                popup_status: false,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentUpload,
            componentPopup,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'userauth', 'certificate'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var upd_data = {
                                data_base: data.base || null,
                                data: data.data || {},
                                editor_path_type: data.editor_path_type || '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                data_list_loding_msg: '',
                            };
                            this.setData(upd_data);
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_bottom_line_status: false,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_bottom_line_status: false,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 上传回调事件
            retrun_image_event(data, sign) {
                var temp_images_data = this.licence_images_data;
                var temp_data = this.data;
                var value = data[0] || '';
                temp_images_data[sign] = value;
                temp_data[sign] = value;
                this.setData({
                    licence_images_data: temp_images_data,
                    data: temp_data
                });
            },

            // 时间选择事件
            picker_time_change_event(e) {
                var sign = e.currentTarget.dataset.sign;
                var temp_data = this.data;
                if((temp_data[sign] || null) == null) {
                    temp_data[sign] = {};
                }
                temp_data[sign]['licence_expire_time'] = e.detail.value || '';
                this.setData({
                    data: temp_data
                });
            },

            // 图片预览事件
            images_show_event(e) {
                app.globalData.image_show_event(e);
            },

            // 表单提交
            form_submit(e) {
                var data = e.detail.value;
                var auth_data = {};
                for(var i in data) {
                    var temp_arr = i.split('-');
                    var key = temp_arr[0];
                    if((auth_data[key] || null) == null) {
                        auth_data[key] = {
                            unique_key: key,
                            licence_images: (this.licence_images_data[key] || null) == null ? (((this.data[key] || null) == null || (this.data[key]['licence_images'] || null) == null) ? '' : (this.data[key]['licence_images'] || '')) : this.licence_images_data[key],
                        };
                    }
                    auth_data[key][temp_arr[1]] = data[i];
                }

                uni.showLoading({
                    title: this.$t('buy.buy.r79t77'),
                });
                this.setData({
                    form_submit_loading: true,
                });

                // 网络请求
                uni.request({
                    url: app.globalData.get_request_url('save', 'userauth', 'certificate'),
                    method: 'POST',
                    data: {auth_data: auth_data},
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(function () {
                                var prev_page = app.globalData.prev_page();
                                var page = 'pages/plugins/certificate/userauth/userauth';
                                if(prev_page.indexOf(page) == -1) {
                                    app.globalData.url_open('/'+page, true);
                                } else {
                                    app.globalData.page_back_prev_event();
                                }
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
            },

            // 用户授权提示查看事件 - 弹层展示
            popup_show_event(e) {
                this.setData({
                    popup_status: true,
                });
            },

            // 用户授权提示查看事件 - 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            }
        },
    };
</script>
<style>
    @import './userauth-saveinfo.css';
</style>

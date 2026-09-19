<template>
    <view :class="theme_view">
        <view class="padding-main">
            <view v-if="(detail || null) != null">
                <form @submit="form_submit" class="form-container">
                    <view v-if="(detail.items || null) != null && detail.items.length > 0" class="fw-b text-size margin-bottom-sm">{{ $t('orderallot-comments.goods_comments') }}</view>
                    <view v-for="(item, index) in detail.items" :key="'g'+index" class="form-gorup oh border-radius-main spacing-mb bg-white padding-main">
                        <view class="flex-row">
                            <view class="flex-row flex-1 flex-width cp" :data-value="(item.goods_url || null) != null && item.goods_url != '' ? item.goods_url : ('/pages/goods-detail/goods-detail?id=' + item.goods_id)" @tap="url_event">
                                <image class="goods-image radius br margin-right flex-shrink-0" :src="item.images" mode="aspectFill"></image>
                                <view class="item-base flex-1 flex-width">
                                    <view class="text-size-sm multi-text margin-bottom-xs">{{ item.title }}</view>
                                    <block v-for="(tv, ti) in rating_star_list" :key="ti">
                                        <image class="star-icon va-m margin-right" :src="common_static_url + 'stars' + (goods_rating_list[index] != undefined && goods_rating_list[index] >= tv ? '-active' : '') + '-icon.png'" mode="aspectFill" @tap.stop="goods_rating_event" :data-index="index" :data-value="tv"></image>
                                    </block>
                                    <text v-if="goods_rating_list[index] != undefined" class="cr-grey va-m text-size-xss">{{ rating_msg[goods_rating_list[index] - 1] }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="margin-top-main br-t">
                            <textarea @input="goods_content_event" :data-index="index" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-order-comments.does_baby_meet_expectations_let_talk')" maxlength="230"></textarea>
                            <view class="margin-top-sm">
                                <component-upload :propData="goods_images_list[index]" :propCallData="index" :propMaxNum="3" :propPathType="editor_path_type" @call-back="goods_upload_event"></component-upload>
                            </view>
                        </view>
                    </view>

                    <view v-if="(detail.comments_staff_list || null) != null && detail.comments_staff_list.length > 0" class="fw-b text-size margin-bottom-sm margin-top-main">{{ $t('orderallot-comments.staff_comments') }}</view>
                    <view v-for="(item, index) in detail.comments_staff_list" :key="'s'+index" class="form-gorup oh border-radius-main spacing-mb bg-white padding-main">
                        <view class="flex-row align-c">
                            <view class="flex-row align-c flex-1 flex-width cp" :data-value="'/pages/plugins/realstore/staff-detail/staff-detail?id=' + item.staff_id" @tap="url_event">
                                <image v-if="(item.avatar || '') != ''" class="staff-avatar circle br margin-right flex-shrink-0" :src="item.avatar" mode="aspectFill"></image>
                                <view v-else class="staff-avatar staff-avatar-placeholder circle br margin-right flex-shrink-0 flex-row align-c jc-c">
                                    <iconfont name="icon-user" size="40rpx" color="#ccc"></iconfont>
                                </view>
                                <view class="flex-1 flex-width">
                                    <view class="text-size-sm fw-b margin-bottom-xs">{{ item.alias }}</view>
                                    <block v-for="(tv, ti) in rating_star_list" :key="ti">
                                        <image class="star-icon va-m margin-right" :src="common_static_url + 'stars' + (staff_rating_list[index] != undefined && staff_rating_list[index] >= tv ? '-active' : '') + '-icon.png'" mode="aspectFill" @tap.stop="staff_rating_event" :data-index="index" :data-value="tv"></image>
                                    </block>
                                    <text v-if="staff_rating_list[index] != undefined" class="cr-grey va-m text-size-xss">{{ rating_msg[staff_rating_list[index] - 1] }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="margin-top-main br-t">
                            <textarea @input="staff_content_event" :data-index="index" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('orderallot-comments.staff_content_placeholder')" maxlength="230"></textarea>
                            <view class="margin-top-sm">
                                <component-upload :propData="staff_images_list[index]" :propCallData="index" :propMaxNum="3" :propPathType="editor_path_type" @call-back="staff_upload_event"></component-upload>
                            </view>
                        </view>
                    </view>

                    <view class="form-gorup border-radius-main spacing-mb bg-white padding-main">
                        <switch class="va-m" name="is_anonymous" @change="anonymous_event"></switch>
                        <text class="cr-base va-m">{{$t('user-order-comments.anonymous')}}</text>
                    </view>
                    <view class="form-gorup form-gorup-submit">
                        <button form-type="submit" class="bg-main br-main cr-white round text-size" type="default" hover-class="none" :disabled="form_button_disabled">{{$t('common.submit')}}</button>
                    </view>
                </form>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentUpload from '@/components/upload/upload';
    import pluginLocale from '../locale/index.js';
    import pageLocale from './locale/index.js';

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        mixins: [pluginLocale, pageLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                detail: null,
                editor_path_type: '',
                anonymous_value: 0,
                rating_star_list: [1, 2, 3, 4, 5],
                rating_msg: [this.$t('user-order-comments.very_poor'), this.$t('user-order-comments.difference'), this.$t('user-order-comments.commonly'), this.$t('user-order-comments.good'), this.$t('user-order-comments.very_good')],
                goods_rating_list: [],
                goods_images_list: [],
                goods_content_list: [],
                staff_rating_list: [],
                staff_images_list: [],
                staff_content_list: [],
                form_button_disabled: false,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentUpload,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({ params: params });
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.init();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        onPullDownRefresh() {
            this.init();
        },
        methods: {
            // 获取评价表单初始化数据
            init() {
                this.setData({ data_list_loding_status: 1 });
                uni.request({
                    url: app.globalData.get_request_url('comments', 'orderallot', 'realstore'),
                    method: 'POST',
                    data: { id: this.params.id },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                editor_path_type: data.editor_path_type || '',
                                detail: data.data,
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.is_login_check(res.data, this, 'init');
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
            // 商品评分
            goods_rating_event(e) {
                var temp = this.goods_rating_list.slice();
                temp[e.currentTarget.dataset.index] = e.currentTarget.dataset.value;
                this.setData({ goods_rating_list: temp });
            },
            // 员工评分
            staff_rating_event(e) {
                var temp = this.staff_rating_list.slice();
                temp[e.currentTarget.dataset.index] = e.currentTarget.dataset.value;
                this.setData({ staff_rating_list: temp });
            },
            // 商品评价内容输入
            goods_content_event(e) {
                var temp = this.goods_content_list.slice();
                temp[e.currentTarget.dataset.index] = e.detail.value;
                this.setData({ goods_content_list: temp });
            },
            // 员工评价内容输入
            staff_content_event(e) {
                var temp = this.staff_content_list.slice();
                temp[e.currentTarget.dataset.index] = e.detail.value;
                this.setData({ staff_content_list: temp });
            },
            // 商品评价图片上传回调
            goods_upload_event(res, index) {
                var temp = this.goods_images_list.slice();
                temp[index] = res;
                this.setData({ goods_images_list: temp });
            },
            // 员工评价图片上传回调
            staff_upload_event(res, index) {
                var temp = this.staff_images_list.slice();
                temp[index] = res;
                this.setData({ staff_images_list: temp });
            },
            // 是否匿名
            anonymous_event(e) {
                this.setData({ anonymous_value: e.detail.value == true ? 1 : 0 });
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 提交评价
            form_submit() {
                var goods_len = (this.detail.items || []).length;
                var staff_len = (this.detail.comments_staff_list || []).length;
                if (goods_len <= 0 && staff_len <= 0) {
                    app.globalData.showToast(this.$t('common.no_relevant_data_tips'));
                    return false;
                }
                for (var i = 0; i < goods_len; i++) {
                    if ((this.goods_rating_list[i] || 0) < 1) {
                        app.globalData.showToast(this.$t('user-order-comments.rate_first'));
                        return false;
                    }
                    var c = (this.goods_content_list[i] || '').length;
                    if (c < 6 || c > 230) {
                        app.globalData.showToast(this.$t('user-order-comments.comment_content_should_between_230_characters'));
                        return false;
                    }
                }
                for (var i = 0; i < staff_len; i++) {
                    if ((this.staff_rating_list[i] || 0) < 1) {
                        app.globalData.showToast(this.$t('user-order-comments.rate_first'));
                        return false;
                    }
                    var c = (this.staff_content_list[i] || '').length;
                    if (c < 6 || c > 230) {
                        app.globalData.showToast(this.$t('user-order-comments.comment_content_should_between_230_characters'));
                        return false;
                    }
                }
                var form_data = {
                    id: this.detail.id,
                    is_anonymous: this.anonymous_value,
                };
                if (goods_len > 0) {
                    form_data.goods_id = JSON.stringify(this.detail.items.map(function (v) { return v.goods_id; }));
                    form_data.goods_rating = JSON.stringify(this.goods_rating_list);
                    form_data.goods_content = JSON.stringify(this.goods_content_list);
                    form_data.goods_images = this.goods_images_list.length > 0 ? JSON.stringify(this.goods_images_list) : '';
                }
                if (staff_len > 0) {
                    form_data.staff_id = JSON.stringify(this.detail.comments_staff_list.map(function (v) { return v.staff_id; }));
                    form_data.staff_rating = JSON.stringify(this.staff_rating_list);
                    form_data.staff_content = JSON.stringify(this.staff_content_list);
                    form_data.staff_images = this.staff_images_list.length > 0 ? JSON.stringify(this.staff_images_list) : '';
                }
                var self = this;
                uni.showLoading({ title: this.$t('common.processing_in_text') });
                self.setData({ form_button_disabled: true });
                uni.request({
                    url: app.globalData.get_request_url('commentssave', 'orderallot', 'realstore'),
                    method: 'POST',
                    data: form_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(function () { uni.navigateBack(); }, 1500);
                        } else {
                            self.setData({ form_button_disabled: false });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.setData({ form_button_disabled: false });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
    @import './orderallot-comments.css';
</style>

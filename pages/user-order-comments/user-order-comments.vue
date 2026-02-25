<template>
    <view :class="theme_view">
        <view class="padding-main">
            <view v-if="detail != null">
                <form @submit="form_submit" class="form-container">
                    <view v-for="(item, index) in detail.items" :key="index" class="form-gorup oh border-radius-main spacing-mb">
                        <view class="oh">
                            <view :data-value="item.goods_url" @tap="url_event" class="cp">
                                <image class="goods-image fl radius br margin-right-sm" :src="item.images" mode="aspectFill"></image>
                            </view>
                            <view class="item-base fl margin-top-sm">
                                <block v-for="(tv, ti) in [1, 2, 3, 4, 5]" :key="ti">
                                    <image class="star-icon va-m" :src="common_static_url + 'stars' + (form_rating_list[index] != undefined && form_rating_list[index] >= tv ? '-active' : '') + '-icon.png'" mode="aspectFill" @tap="rating_event" :data-index="index" :data-value="tv"></image>
                                </block>
                                <text v-if="form_rating_list[index] != undefined" class="cr-grey va-m margin-left-xs">{{ rating_msg[form_rating_list[index] - 1] }}</text>
                            </view>
                        </view>
                        <view class="margin-top-main br-t">
                            <textarea @input="form_content_event" :data-index="index" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('user-order-comments.user-order-comments.r9r3h0')" maxlength="230"></textarea>
                            <view class="margin-top-sm">
                                <component-upload :propData="form_images_list[index]" :propCallData="index" :propMaxNum="3" :propPathType="editor_path_type" @call-back="upload_image_event"></component-upload>
                            </view>
                        </view>
                    </view>

                    <view class="form-gorup border-radius-main spacing-mb">
                        <switch class="va-m" name="is_anonymous" @change="anonymous_event"></switch>
                        <text class="cr-base va-m">{{$t('user-order-comments.user-order-comments.uboc44')}}</text>
                        <text class="fr cr-grey margin-top-sm">{{ anonymous_msg_list[anonymous_value] }}</text>
                    </view>

                    <view class="form-gorup form-gorup-submit">
                        <button form-type="submit" class="bg-main br-main cr-white round text-size" type="default" hover-class="none" :disabled="form_button_disabled">{{$t('common.submit')}}</button>
                    </view>
                </form>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentBottomLine from "@/components/bottom-line/bottom-line";
    import componentUpload from '@/components/upload/upload';

    var common_static_url = app.globalData.get_static_url("common");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: "",
                params: null,
                detail: null,
                editor_path_type: "",
                rating_msg: [this.$t('user-order-comments.user-order-comments.si255j'), this.$t('user-order-comments.user-order-comments.42b0x1'), this.$t('user-order-comments.user-order-comments.72mov3'), this.$t('user-order-comments.user-order-comments.16cmv6'), this.$t('user-order-comments.user-order-comments.e4i88f')],
                anonymous_value: 0,
                anonymous_msg_list: [this.$t('user-order-comments.user-order-comments.021i2d'), this.$t('user-order-comments.user-order-comments.h2ci83')],
                form_rating_list: [],
                form_images_list: [],
                form_content_list: [],
                form_button_disabled: false,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentUpload
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
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
            this.init();
        },

        methods: {
            init() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url("comments", "order"),
                    method: "POST",
                    data: {
                        id: this.params.id,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                editor_path_type: data.editor_path_type || "",
                                detail: data.data,
                                data_list_loding_status: 3,
                                data_list_loding_msg: "",
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "init")) {
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
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 上传回调
            upload_image_event(res, index) {
                var temp = this.form_images_list;
                temp[index] = res;
                this.setData({
                    form_images_list: temp,
                });
            },

            // 是否匿名事件
            anonymous_event(e) {
                this.setData({
                    anonymous_value: e.detail.value == true ? 1 : 0,
                });
            },

            // 评分事件
            rating_event(e) {
                // 参数
                var index = e.currentTarget.dataset.index;
                var value = e.currentTarget.dataset.value;

                // 数据初始化/赋值
                var temp_list = this.form_rating_list;
                var length = this.detail.items.length;
                for (var i = 0; i < length; i++) {
                    if (index == i) {
                        temp_list[i] = value;
                    }
                }
                this.setData({
                    form_rating_list: temp_list,
                });
            },

            // 评论内容
            form_content_event(e) {
                // 参数
                var index = e.currentTarget.dataset.index;
                var value = e.detail.value;

                // 数据初始化/赋值
                var temp_list = this.form_content_list;
                var length = this.detail.items.length;
                for (var i = 0; i < length; i++) {
                    if (temp_list[i] == undefined) {
                        temp_list[i] = "";
                    }
                    if (index == i) {
                        temp_list[i] = value;
                    }
                }
                this.setData({
                    form_content_list: temp_list,
                });
            },

            // 表单
            form_submit(e) {
                // 商品数量
                var length = this.detail.items.length;

                // 评分校验
                var count = this.form_rating_list.length;
                if (count < length) {
                    app.globalData.showToast(this.$t('user-order-comments.user-order-comments.34ne4c'));
                    return false;
                }
                var max = Math.max.apply(null, this.form_rating_list);
                var min = Math.min.apply(null, this.form_rating_list);

                if (min < 1 || max > 5) {
                    app.globalData.showToast(this.$t('user-order-comments.user-order-comments.x6fwbf'));
                    return false;
                }

                // 内容校验
                var count = this.form_content_list.length;
                if (count < length) {
                    app.globalData.showToast(this.$t('user-order-comments.user-order-comments.8f303u'));
                    return false;
                }

                for (var i in this.form_content_list) {
                    var count = this.form_content_list[i].length;
                    if (count < 6 || count > 230) {
                        app.globalData.showToast(this.$t('user-order-comments.user-order-comments.39y6ym'));
                        return false;
                    }
                }

                // 图片校验
                if (this.form_images_list.length > 0) {
                    for (var i in this.form_images_list) {
                        if (this.form_images_list[i].length > 3) {
                            app.globalData.showToast(this.$t('user-order-comments.user-order-comments.488j15'));
                            return false;
                        }
                    }
                }

                // 表单数据
                var form_data = e.detail.value;
                form_data["is_anonymous"] = form_data["is_anonymous"] == true ? 1 : 0;
                form_data["id"] = this.detail.id;
                form_data["goods_id"] = JSON.stringify(
                    this.detail.items.map(function (v) {
                        return v.goods_id;
                    })
                );
                form_data["rating"] = JSON.stringify(this.form_rating_list);
                form_data["content"] = JSON.stringify(this.form_content_list);
                form_data["images"] = this.form_images_list.length > 0 ? JSON.stringify(this.form_images_list) : "";

                // 提交表单
                var self = this;
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                self.setData({
                    form_button_disabled: true,
                });
                uni.request({
                    url: app.globalData.get_request_url("commentssave", "order"),
                    method: "POST",
                    data: form_data,
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            setTimeout(function () {
                                uni.navigateBack();
                            }, 2000);
                        } else {
                            self.setData({
                                form_button_disabled: false,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.setData({
                            form_button_disabled: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
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
    @import "./user-order-comments.css";
</style>

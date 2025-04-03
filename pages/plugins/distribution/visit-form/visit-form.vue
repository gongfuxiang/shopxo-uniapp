<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status != 1" class="page-bottom-fixed">
            <form @submit="form_submit" class="form-container">
                <view class="padding-main oh border-radius-main">
                    <view class="user-search">
                        <component-search
                            @onsearch="search_submit_event"
                            :propIsOnEvent="true"
                            :propIsRequired="false"
                            :propPlaceholder="$t('user.user.nk3cpq')"
                            propClass="br"
                            propSize="md"
                            :propIsBtn="true"
                            :propDefaultValue="search_input_keywords_value"
                            <!-- #ifdef MP || APP -->
                            propIcon="icon-scan"
                            propIconColor="#333"
                            @onicon="search_icon_event"
                            :propIsIconOnEvent="true"
                            <!-- #endif -->
                        ></component-search>
                        <view class="custom-info margin-top-sm">
                            <block v-if="(custom_data || null) != null && (custom_data.data || null) != null">
                                <image class="custom-avatar circle br va-m" :src="custom_data.data.avatar" mode="aspectFill"></image>
                                <text class="va-m margin-left-sm">{{custom_data.data.user_name_view}}</text>
                                <text class="cr-grey fr">{{custom_data.data.add_time_text || ''}}</text>
                            </block>
                            <view v-else class="cr-red">{{custom_data.error_msg || $t('user.user.iynkpl')}}</view>
                        </view>
                    </view>

                    <view class="form-gorup bg-white border-radius-main margin-top-main">
                        <view class="form-gorup-title">{{$t('visit-form.visit-form.0su017')}}<text class="form-group-tips-must">*</text></view>
                        <textarea class="cr-base" name="content" maxlength="230" auto-height placeholder-class="cr-grey-9" :placeholder="$t('visit-form.visit-form.e9r65a')" :value="data.content || ''"></textarea>
                    </view>

                    <view class="form-gorup form-container-upload oh border-radius-main margin-top-main">
                        <view class="form-gorup-title">{{$t('visit-form.visit-form.6l81lz')}}<text class="form-group-tips-must">*</text><text class="form-group-tips">{{$t('order.order.o11d44')}}{{form_images_max_count}}{{$t('buy.buy.5iuqow')}}</text></view>
                        <view class="form-upload-data oh">
                            <block v-if="form_images_list.length > 0">
                                <view v-for="(item, index) in form_images_list" :key="index" class="item fl">
                                    <text class="delete-icon" @tap="upload_delete_event" :data-index="index">x</text>
                                    <image :src="item" @tap="upload_show_event" :data-index="index" mode="aspectFill"></image>
                                </view>
                            </block>
                            <image v-if="(form_images_list || null) == null || form_images_list.length < form_images_max_count" class="item fl upload-icon" :src="common_static_url + 'upload-icon.png'" mode="aspectFill" @tap="file_upload_event"></image>
                        </view>
                    </view>

                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </form>
        </view>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMag="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from "@/components/no-data/no-data";
    import componentSearch from '@/components/search/search';

    var common_static_url = app.globalData.get_static_url("common");
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                params: {},
                search_input_keywords_value: '',
                data: {},
                form_images_list: [],
                form_images_max_count: 30,
                editor_path_type: '',
                form_submit_disabled_status: false,
                custom_data: null,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentSearch
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });

            // 初始数据
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
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                    });
                }
            },

            // 获取数据
            get_data() {            
                uni.request({
                    url: app.globalData.get_request_url("saveinfo", "visit", "distribution"),
                    method: "POST",
                    data: {...this.params, ...{is_lang: 0}},
                    dataType: "json",
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            var data = result.data || {};
                            this.setData({
                                data: data,
                                form_images_list: data.images || [],
                                custom_data: {data: data.custom_user || null},
                                editor_path_type: result.editor_path_type || '',
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, "get_data")) {
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

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;
                form_data['custom_user_id'] = ((this.custom_data || null) != null && (this.custom_data.data || null) != null) ? this.custom_data.data.id : 0;
                form_data['images'] = this.form_images_list;
                // 是否编辑
                if((this.data || null) != null) {
                    form_data['id'] = this.data.id || 0;
                }

                // 数据校验
                var validation = [
                    { fields: 'custom_user_id', msg: this.$t('visit-form.visit-form.6f63it') },
                    { fields: 'content', msg: this.$t('visit-form.visit-form.5k455y') },
                    { fields: 'images', msg: this.$t('visit-form.visit-form.56vk4m') },
                ];

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_disabled_status: true,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('save', 'visit', 'distribution'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    uni.$emit('refresh');
                                    uni.navigateBack();
                                }, 1000);
                            } else {
                                this.setData({
                                    form_submit_disabled_status: false,
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
                                form_submit_disabled_status: false,
                            });
                            app.globalData.showToast(this.$t('extraction-apply.extraction-apply.h8f437'));
                        },
                    });
                }
            },

            // 搜索关键字事件
            search_input_keywords_event(e) {
                this.setData({
                    search_input_keywords_value: e.detail.value,
                });
            },

            // 搜索确认事件
            search_submit_event(e) {
                this.setData({
                    search_input_keywords_value: e
                });
                this.search_user();
            },

            // icon事件
            search_icon_event(e) {
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        self.setData({
                            search_input_keywords_value: res.result
                        });
                        self.search_user();
                    },
                });
            },

            // 搜索用户
            search_user() {
                uni.showLoading({
                    title: this.$t('recommend-form.recommend-form.e5k407'),
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("userquery", "user", "distribution"),
                    method: "POST",
                    data: {keywords: this.search_input_keywords_value},
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                custom_data: {
                                    data: res.data.data
                                }
                            });
                        } else {
                            this.setData({
                                custom_data: {
                                    error_msg: res.data.msg
                                }
                            });
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.form_images_list[e.currentTarget.dataset.index],
                    urls: this.form_images_list,
                });
            },

            // 图片删除
            upload_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.psi67g'),
                    success(res) {
                        if (res.confirm) {
                            var list = self.form_images_list;
                            list.splice(e.currentTarget.dataset.index, 1);
                            self.setData({
                                form_images_list: list,
                            });
                        }
                    },
                });
            },
            
            // 文件上传
            file_upload_event(e) {
                var self = this;
                uni.chooseImage({
                    count: this.form_images_max_count,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(res.tempFilePaths, success, fail, count, length);
                    },
                });
            },
            
            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length) {
                var self = this;
                if (self.form_images_list.length < this.form_images_max_count) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url("index", "ueditor"),
                        filePath: img_paths[count],
                        name: "upfile",
                        formData: {
                            action: "uploadimage",
                            path_type: self.editor_path_type,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == "object" ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    list.push(data.data.url);
                                    self.setData({
                                        form_images_list: list,
                                    });
                                } else {
                                    app.globalData.showToast(data.msg);
                                }
                            }
                        },
                        fail: function (e) {
                            fail++;
                        },
                        complete: function (e) {
                            count++;
            
                            // 下一张
                            if (count >= length) {
                                // 上传完毕，作一下提示
                                //app.showToast('上传成功' + success +'张', 'success');
                            } else {
                                // 递归调用，上传下一张
                                self.upload_one_by_one(img_paths, success, fail, count, length);
                            }
                        },
                    });
                }
            }
        },
    };
</script>
<style>
    @import "./visit-form.css";
</style>
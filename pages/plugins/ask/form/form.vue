<template>
    <view :class="theme_view">
        <form v-if="data_list_loding_status == 3" @submit="formSubmit" class="form-container">
            <view class="padding-main oh page-bottom-fixed">
                <view class="form-gorup border-radius-main oh flex-row jc-sb align-c margin-bottom-main">
                    <view class=""> 标题 <text class="form-group-tips-must">*</text></view>
                    <view class="flex-row align-c flex-1 flex-width">
                        <input type="text" name="title" :value="data.title" maxlength="16" placeholder-class="cr-grey-9 tr" class="cr-base tr" placeholder="请输入标题" />
                    </view>
                </view>
                <view class="form-gorup border-radius-main margin-bottom-main">
                    <view class="margin-bottom-sm">提问内容 <text class="form-group-tips-must">*</text></view>
                    <sp-editor @init="initEditor" @input="rich_text_event" @upinImage="up_in_image_event"></sp-editor>
                </view>
                <view class="form-gorup border-radius-main oh flex-row jc-sb align-c margin-bottom-main">
                    <view class=""> 提问分类 </view>
                    <view class="flex-row jc-e align-c flex-1 flex-width">
                        <picker @change="select_change_event" :value="category_id_index" :range="ask_category_list" range-key="name" name="category_id" data-field="category_id" class="margin-right-sm wh-auto tr">
                            <view class="uni-input cr-base picker">
                                <template v-if="category_id_index !== -1">
                                    {{ ask_category_list[category_id_index].name || '' }}
                                </template>
                            </view>
                        </picker>
                        <iconfont name="icon-arrow-right" size="34rpx" color="#ccc"></iconfont>
                    </view>
                </view>
                <view v-if="is_show_email_notice == 1" class="form-gorup border-radius-main oh flex-row jc-sb align-c margin-bottom-main">
                    <view class=""> 回复邮件通知 </view>
                    <view class="flex-row align-c flex-1 flex-width">
                        <input type="text" name="email_notice" :value="data.email_notice" placeholder-class="cr-grey-9 tr" class="cr-base tr" placeholder="请输入邮件" />
                    </view>
                </view>
                <view v-if="is_show_mobile_notice == 1" class="form-gorup border-radius-main oh flex-row jc-sb align-c margin-bottom-main">
                    <view class="form-gorup-title"> 回复手机通知 </view>
                    <view class="flex-row align-c flex-1 flex-width">
                        <input type="text" name="mobile_notice" :value="data.mobile_notice" maxlength="16" placeholder-class="cr-grey-9 tr" class="cr-base tr" placeholder="请输入手机号" />
                    </view>
                </view>
                <!-- 匿名发布 -->
                <!-- <view class="form-gorup border-radius-main oh flex-row jc-e align-c">
                    <checkbox-group @change="is_anonymous_change_event">
                        <label class="cr-grey-9">
                            <checkbox value="1" :checked="false" :color="theme_color" style="transform: scale(0.7)" />
                            <text class="pr top-xs">{{ $t('form.form.2f52v3') }}</text>
                        </label>
                    </checkbox-group>
                </view> -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{ $t('common.submit') }}</button>
                    </view>
                </view>
            </view>
        </form>
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
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentUpload from '@/components/upload/upload';
    const theme_color = app.globalData.get_theme_color();

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: theme_color,
                data_list_loding_status: 1,
                data_list_loding_msg: this.$t('form.form.bniyyt'),
                bottom_fixed_style: '',
                params: {},
                form_submit_loading: false,
                is_anonymous: '0',
                editor_path_type: '',

                data: {},
                ask_category_list: [],
                is_show_email_notice: 0,
                is_show_mobile_notice: 0,
                category_id_index: -1,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentUpload,
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

            // 加载数据
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data_list();
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('form.form.8l3ul5'),
                    });
                }
            },

            // 获取初始化信息
            get_data_list() {
                uni.showLoading({
                    title: this.$t('common.loading_in_text'),
                });
                // 网络请求
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'ask', 'ask'),
                    method: 'POST',
                    data: { id: this.params.id || null },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        var data = res.data.data;
                        if (res.data.code == 0) {
                            this.setData({
                                data_bottom_line_status: true,
                                data_list_loding_status: 3,
                                data: data.data || {},
                                ask_category_list: data.ask_category_list || [],
                                editor_path_type: data.editor_path_type,
                                is_show_email_notice: data.is_show_email_notice,
                                is_show_mobile_notice: data.is_show_mobile_notice,
                                category_id_index: (data.ask_category_list || []).length > 0 && data.data != null ? data.ask_category_list.findIndex((item) => item.id === data.data.category_id) : -1,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            data_list_loding_status: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 表单提交
            formSubmit(e) {
                // 数据验证
                var validation = [
                    { fields: 'content', msg: this.$t('form.form.5v5bjs') },
                    { fields: 'title', msg: this.$t('form.form.5v5bjs') },
                ];
                const new_data = {
                    goods_id: this.params.goods_id || 0,
                    id: this.params.id || null,
                    ...e.detail.value,
                    content: this.data.content,
                    category_id: this.data.category_id,
                };
                if (app.globalData.fields_check(new_data, validation)) {
                    uni.showLoading({
                        title: this.$t('buy.buy.r79t77'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'ask', 'ask'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/ask/user-list/user-list', true);
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

            // // 匿名发布
            // is_anonymous_change_event(e) {
            //     this.setData({
            //         is_anonymous: e.detail.value.length > 0 ? e.detail.value[0] : 0,
            //     });
            // },

            initEditor(editor) {
                // 初始化编辑器内容
                editor.setContents({
                    html: (this.data || null) !== null ? this.data.content : '',
                });
            },

            // 回调富文本内容
            rich_text_event(e) {
                var new_data = this.data;
                new_data.content = e.html;
                this.setData({
                    data: new_data,
                });
            },

            // 上传图片
            up_in_image_event(tempFiles, editorCtx) {
                var self = this;
                // 使用 uniCloud.uploadFile 上传图片的示例方法（可适用多选上传）
                tempFiles.forEach(async (item) => {
                    uni.showLoading({
                        title: self.$t('form.form.2e5rv3'),
                        mask: true,
                    });
                    await uni.uploadFile({
                        url: app.globalData.get_request_url('index', 'ueditor'),
                        // #ifdef APP-PLUS || H5
                        filePath: item.path,
                        // #endif
                        // #ifdef MP-WEIXIN
                        filePath: item.tempFilePath,
                        // #endif
                        name: 'upfile',
                        formData: {
                            action: 'uploadimage',
                            path_type: this.editor_path_type, // 路径类型，默认common
                        },
                        success: function (res) {
                            let data = JSON.parse(res.data);
                            if (res.statusCode == 200) {
                                // 上传完成后处理
                                editorCtx.insertImage({
                                    src: data.data.url, // 此处需要将图片地址切换成服务器返回的真实图片地址
                                    // width: '50%',
                                    alt: self.$t('common.video'),
                                    success: function (e) {},
                                });
                                uni.hideLoading();
                            }
                        },
                        fail: function (e) {
                            app.globalData.showToast(e.errMsg);
                            uni.hideLoading();
                        },
                    });
                });
            },

            // 分类选择事件
            select_change_event(e) {
                var temp = this.data;
                const category_id = this.ask_category_list[e.detail.value].id;
                temp[e.currentTarget.dataset.field] = category_id;
                this.setData({
                    data: temp,
                    category_id_index: e.detail.value,
                });
            },
        },
    };
</script>
<style scoped>
    @import './form.css';
</style>

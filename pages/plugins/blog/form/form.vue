<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status !== 1">
            <form @submit="form_submit" class="form-container">
                <view class="page-bottom-fixed padding-main">
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('user-detail.user-detail.uy6lrz')}}<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="title" :value="data.title || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" :placeholder="$t('common.please_input')" />
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('common.category')}}<text class="form-group-tips-must">*</text></view>
                                <view class="flex-1 flex-width tr" @tap="popupOpen">
                                    <text :class="data.blog_category_name ? 'cr-black' : 'cr-grey-9'">{{ data.blog_category_name || $t('form.form.4cbom4') }}</text>
                                    <view class="pr top-sm margin-left-sm dis-inline-block">
                                        <iconfont name="icon-arrow-right" color="#999" size="28rpx"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('form.form.043a10')}}</view>
                                <view class="flex-1 flex-width tr">
                                    <switch :color="theme_color" :checked="(data.is_enable || 0) == 1 ? true : false" @change="is_enable_event" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="form-gorup-title padding-right-main">{{$t('form.form.5hn8k3')}}</view>
                            <view class="margin-top-main">
                                <component-upload :propData="image_list" :propMaxNum="1" :propPathType="editor_path_type" @call-back="retrun_image_event"></component-upload>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh">
                        <view class="form-gorup">
                            <view class="form-gorup-title padding-right-main">{{$t('user-detail.user-detail.7cufw6')}}<text class="form-group-tips-must">*</text></view>
                            <view class="margin-top-main sp-editor">
                                <sp-editor @init="init_editor" @input="rich_text_event" @upinImage="up_in_image_event"></sp-editor>
                            </view>
                        </view>
                    </view>
                    <view class="more oh" :style="'height:' + more_height">
                        <view class="bg-white border-radius-main pr oh spacing-mb spacing-mt">
                            <view class="form-gorup">
                                <view class="form-gorup-title padding-right-main">{{$t('form.form.xy87t8')}}</view>
                                <textarea name="describe" placeholder-class="cr-grey-9" class="cr-base" :placeholder="$t('common.please_input')" maxlength="200" :value="data.describe"></textarea>
                            </view>
                        </view>
                        <view class="bg-white border-radius-main pr oh spacing-mb">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title padding-right-main">{{$t('form.form.kvr2i3')}}</view>
                                    <input type="text" name="seo_title" :value="data.seo_title || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" :placeholder="$t('common.please_input')" />
                                </view>
                            </view>
                        </view>
                        <view class="bg-white border-radius-main pr oh spacing-mb">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title padding-right-main">{{$t('form.form.l87ju1')}}</view>
                                    <input type="text" name="seo_keywords" :value="data.seo_keywords || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" :placeholder="$t('common.please_input')" />
                                </view>
                            </view>
                        </view>
                        <view class="bg-white border-radius-main pr oh">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title padding-right-main">{{$t('form.form.5487bt')}}</view>
                                    <input type="text" name="seo_desc" :value="data.seo_desc || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" :placeholder="$t('common.please_input')" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb spacing-mt">
                        <view class="padding-main flex-row jc-c align-c cr-grey-9" @tap="more_event">
                            <text>{{ is_more ? $t('form.form.4h814w') : $t('form.form.lfwj0g') }}</text>
                            <view class="margin-left-sm dis-inline-block">
                                <iconfont :name="is_more ? 'icon-arrow-top' : 'icon-arrow-bottom'" color="#999" size="24rpx"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 底部操作 -->
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item cr-white bg-main round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                    </view>
                </view>
                <!-- 分类选择 -->
                <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
                    <view class="p-title flex-row jc-sb align-c padding-main br-b-e">
                        <view class="text-size-lg fw-b">{{$t('form.form.4vku7u')}}</view>
                        <view class="popup-colse" @tap="popup_close_event">
                            <iconfont name="icon-close-o" color="#333" size="28rpx"></iconfont>
                        </view>
                    </view>
                    <view class="p-content padding-main">
                        <view v-for="(item, index) in blog_category_list" :key="index">
                            <view class="padding-vertical-main flex-row jc-sb align-c" :class="data.blog_category_id == item.id ? 'cr-main' : ''" :data-value="item.name" :data-id="item.id" @tap="get_type_event">
                                {{ item.name }}
                                <iconfont v-if="data.blog_category_id === item.id" name="icon-checked" color="#333" size="28rpx"></iconfont>
                            </view>
                        </view>
                    </view>
                </component-popup>
            </form>
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
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
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
                data: {},
                index: 0,
                // 分类选择弹窗
                popup_status: false,
                blog_category_list: [],

                // 封面图片
                image_list: [],
                // 路径类型
                editor_path_type: 'common',

                // 内容
                input_length_max: 500,
                input_value: '',
                // 查看更多
                more_height: '0',
                is_more: false,

                // 提交按钮
                form_submit_loading: false,
            };
        },
        components: {
            componentCommon,
            componentPopup,
            componentUpload,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params || {},
            });

            // 数据加载
            this.init();
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
            this.init();
        },

        // 页面销毁时执行
        onUnload: function () {},

        methods: {
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
            get_data_list() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'blog', 'blog'),
                    method: 'POST',
                    data: {...this.params, ...{lang_can_key: 'blog_category_list'}},
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var blog_category_list = res.data.data.blog_category_list || [];
                            if (res.data.data.data) {
                                var data = res.data.data.data || {};
                                // 封面列表
                                var img_list = [];
                                if ((data.cover || null) != null && data.cover.length > 0) {
                                    img_list.push(data.cover);
                                }
                                // 分类名称匹配重新匹配赋值
                                var blog_category_name = '';
                                for(var i in blog_category_list) {
                                    if(blog_category_list[i]['id'] == data.blog_category_id) {
                                        blog_category_name = blog_category_list[i]['name'];
                                        break;
                                    }
                                }
                                data['blog_category_name'] = blog_category_name;
                                // 设置数据
                                this.setData({
                                    data: data,
                                    blog_category_list: blog_category_list,
                                    image_list: img_list,
                                    more_height: data.describe || data.seo_title || data.seo_keywords || data.seo_desc ? '708rpx' : '0',
                                    is_more: data.describe || data.seo_title || data.seo_keywords || data.seo_desc ? 'true' : 'false',
                                    data_list_loding_status: 3,
                                });
                            } else {
                                this.setData({
                                    blog_category_list: blog_category_list,
                                    data_list_loding_status: 3,
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
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
            // 弹层打开
            popupOpen() {
                this.setData({
                    popup_status: true,
                });
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // 是否启用
            is_enable_event(e) {
                var new_data = this.data;
                new_data.is_enable = e.detail.value ? 1 : 0;
                this.setData({
                    data: new_data,
                });
            },

            // 获取选中的分类
            get_type_event(e) {
                var new_data = this.data;
                new_data.blog_category_id = e.currentTarget.dataset.id;
                new_data.blog_category_name = e.currentTarget.dataset.value;
                this.setData({
                    data: new_data,
                    popup_status: false,
                });
            },

            // 上传回调
            retrun_image_event(data) {
                var new_data = this.data;
                new_data.cover = data[0];
                this.setData({
                    data: new_data,
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
            init_editor(editor) {
                // 初始化编辑器内容
                editor.setContents({
                    html: (this.data || null) !== null ? this.data.content : '',
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
                            path_type: 'common', // 路径类型，默认common
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

            // 更多内容
            more_event() {
                this.setData({
                    more_height: !this.is_more ? '708rpx' : '0',
                    is_more: !this.is_more,
                });
            },

            // 表单提交
            form_submit(e) {
                // 数据验证
                var validation = [
                    { fields: 'title', msg: this.$t('form.form.v19gg8') },
                    { fields: 'blog_category_id', msg: this.$t('form.form.gu3x97') },
                    { fields: 'content', msg: this.$t('form.form.adiq70') },
                ];
                var validate = {
                    blog_category_id: this.data.blog_category_id,
                    content: this.data.content,
                    title: e.detail.value.title,
                };
                if (app.globalData.fields_check(validate, validation)) {
                    uni.showLoading({
                        title: this.$t('buy.buy.r79t77'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    var new_data = {
                        ...e.detail.value,
                        ...this.data,
                    };
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'blog', 'blog'),
                        method: 'POST',
                        data: new_data,
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
        },
    };
</script>
<style>
    @import './form.css';
</style>

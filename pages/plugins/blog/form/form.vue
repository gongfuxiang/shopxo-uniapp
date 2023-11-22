<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status !== 0">
            <form @submit="form_submit" class="form-container">
                <view class="page-bottom-fixed padding-main">
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">标题<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="title" :value="data.title || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" placeholder="请输入" />
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">分类<text class="form-group-tips-must">*</text></view>
                                <view class="flex-1 flex-width tr" @tap="popupOpen">
                                    <text :class="data.type ? 'cr-black' : 'cr-grey-9'">{{ data.type || '请选择' }}</text>
                                    <view class="pr top-sm margin-left-sm dis-inline-block">
                                        <iconfont name="icon-qiandao-jiantou2" color="#999" size="28rpx"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">是否启用</view>
                                <view class="flex-1 flex-width tr">
                                    <switch :color="theme_color" :checked="(data.is_open || 0) == 1 ? true : false" @change="is_open_event" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="form-gorup-title padding-right-main">封面图片</view>
                            <view class="margin-top-main">
                                <component-upload :propData="data.image_list" :prop-max-num="1" :prop-path-type="editor_path_type" @call-back="retrun_image_event"></component-upload>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh">
                        <view class="form-gorup">
                            <view class="form-gorup-title padding-right-main">内容<text class="form-group-tips-must">*</text></view>
                            <view class="margin-top-main sp-editor">
                                <sp-editor :templates="data.templates" @input="rich_text_event" @upinImage="up_in_image_event"></sp-editor>
                            </view>
                        </view>
                    </view>
                    <view class="more oh" :style="'height:' + more_height">
                        <view class="bg-white border-radius-main pr oh spacing-mb spacing-mt">
                            <view class="form-gorup">
                                <view class="form-gorup-title padding-right-main">描述</view>
                                <textarea name="desc" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入" maxlength="200" :value="data.desc"></textarea>
                            </view>
                        </view>
                        <view class="bg-white border-radius-main pr oh spacing-mb">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title padding-right-main">SEO标题</view>
                                    <input type="text" name="seo_title" :value="data.seo_title || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" placeholder="请输入" />
                                </view>
                            </view>
                        </view>
                        <view class="bg-white border-radius-main pr oh spacing-mb">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title padding-right-main">SEO关键字</view>
                                    <input type="text" name="seo_key" :value="data.seo_key || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" placeholder="请输入" />
                                </view>
                            </view>
                        </view>
                        <view class="bg-white border-radius-main pr oh">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title padding-right-main">SEO描述</view>
                                    <input type="text" name="seo_desc" :value="data.seo_desc || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" placeholder="请输入" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb spacing-mt">
                        <view class="padding-main flex-row jc-c align-c cr-grey-9" @tap="more_event">
                            <text>{{ is_more ? '收起更多' : '展开更多' }}</text>
                            <view class="margin-left-sm dis-inline-block">
                                <iconfont :name="is_more ? 'icon-fenlei-top' : 'icon-mendian-jiantou2'" color="#999" size="24rpx"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 底部操作 -->
                <view class="bottom-fixed btn-bottom bg-white">
                    <view class="oh bottom-line-exclude">
                        <button class="cr-white bg-main round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
                    </view>
                </view>
                <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
                    <view class="p-title flex-row jc-sb align-c padding-main br-b-e">
                        <view class="text-size-lg fw-b">帖子分类</view>
                        <view class="popup-colse" @tap="popup_close_event">
                            <iconfont name="icon-huiyuan-guanbi" color="#333" size="28rpx"></iconfont>
                        </view>
                    </view>
                    <view class="p-content padding-main">
                        <view v-for="(item, index) in type_list" :key="index">
                            <view class="padding-vertical-main flex-row jc-sb align-c" :class="type_index === index + 1 ? 'cr-main' : ''" :data-value="item" :data-index="index + 1" @tap="get_type_event">
                                {{ item }}
                                <iconfont v-if="type_index === index + 1" name="icon-blog-checked" color="#333" size="28rpx"></iconfont>
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
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentUpload from '@/components/upload/upload';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                blog_id: '',
                data_list_loding_status: 1,
                data: {},
                index: 0,

                // 分类选择弹窗
                popup_status: false,
                type_list: ['国内资讯', '热点博文', '生活八卦', '同城交流'],

                // 分类选中的值
                type_index: 0,

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
            componentPopup,
            componentUpload,
            componentNoData,
        },

        onLoad(params) {
            if (params !== null && params.goods_id) {
                this.setData({
                    blog_id: params.id,
                });
            }
        },

        onShow() {
            // 数据加载
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {},

        // 页面销毁时执行
        onUnload: function () {},

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定手机则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    }
                    this.get_data_list();
                } else {
                    // 提示错误
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '用户未登录',
                    });
                }
            },
            get_data_list() {
                if (this.blog_id) {
                    // 加载loding
                    uni.showLoading({
                        title: '加载中...',
                    });
                    this.setData({
                        data_list_loding_status: 1,
                    });
                    uni.request({
                        url: app.globalData.get_request_url('index', 'goodscomments', 'intellectstools'),
                        method: 'POST',
                        data: { id: this.blog_id },
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    data: res.data.data.data || {},
                                    data_list_loding_status: 3,
                                });
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
                            uni.hideLoading();
                            this.setData({
                                data_list_loding_status: 2,
                            });
                            app.globalData.showToast('网络开小差了哦~');
                        },
                    });
                } else {
                    this.setData({
                        data_list_loding_status: 3,
                    });
                }
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
            is_open_event(e) {
                var new_data = this.data;
                new_data.is_open = e.detail.value ? 1 : 0;
                this.setData({
                    data: new_data,
                });
            },

            // 获取选中的分类
            get_type_event(e) {
                var new_data = this.data;
                new_data.type = e.currentTarget.dataset.value;
                this.setData({
                    data: new_data,
                    type_index: e.currentTarget.dataset.index,
                    popup_status: false,
                });
            },

            // 上传回调
            retrun_image_event(data) {
                var newData = this.data;
                newData.image_list = data;
                this.setData({
                    data: newData,
                });
            },

            // 回调富文本内容
            rich_text_event(e) {
                console.log('==== input :', e);
                var newData = this.data;
                newData.templates = e.html;
                this.setData({
                    data: newData,
                });
            },

            // 上传图片
            up_in_image_event(tempFiles, editorCtx) {
                // 使用 uniCloud.uploadFile 上传图片的示例方法（可适用多选上传）
                tempFiles.forEach(async (item) => {
                    uni.showLoading({
                        title: '上传中请稍后',
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
                            console.log(res);
                            let data = JSON.parse(res.data);
                            if (res.statusCode == 200) {
                                // 上传完成后处理
                                editorCtx.insertImage({
                                    src: data.data.url, // 此处需要将图片地址切换成服务器返回的真实图片地址
                                    // width: '50%',
                                    alt: '图片',
                                    success: function (e) {},
                                });
                                uni.hideLoading();
                            }
                        },
                        fail: function (e) {
                            console.log(e);
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
                console.log(e);
                console.log(this.data);
                // 数据验证
                var validation = [
                    { fields: 'title', msg: '请输入标题' },
                    { fields: 'type', msg: '请选择分类' },
                    { fields: 'templates', msg: '请输入内容' },
                ];
                var validate = {
                    type: this.data.type,
                    templates: this.data.templates,
                    title: e.detail.value.title,
                };
                if (app.globalData.fields_check(validate, validation)) {
                    uni.showLoading({
                        title: '提交中...',
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    var newData = {
                        ...e.detail.value,
                        ...validate,
                    };
                    // 网络请求
                    uni.request({
                        url: app.globalData.get_request_url('save', 'goodscomments', 'intellectstools'),
                        method: 'POST',
                        data: newData,
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
                                    app.globalData.showToast('提交失败，请重试！');
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast('网络开小差了哦~');
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

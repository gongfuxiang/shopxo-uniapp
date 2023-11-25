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
                            propPlaceholder="输入用户名/昵称/会员码/手机/邮箱"
                            propClass="br"
                            :propIsBtn="true"
                            :propDefaultValue="search_input_keywords_value"
                            <!-- #ifdef MP || APP -->
                            propIcon="icon-mendian-sousuosm"
                            propIconColor="#333"
                            @onicon="search_icon_event"
                            :propIsIconOnEvent="true"
                            <!-- #endif -->
                        ></component-search>
                        <view class="custom-info margin-top-sm">
                            <block v-if="(custom_data || null) != null">
                                <block v-if="(custom_data.data || null) != null">
                                    <image class="custom-avatar circle br va-m" :src="custom_data.data.avatar" mode="aspectFill"></image>
                                    <text class="va-m margin-left-sm">{{custom_data.data.user_name_view}}</text>
                                    <text class="cr-grey fr">{{custom_data.data.add_time_text}}</text>
                                </block>
                                <view v-else class="cr-red">{{custom_data.error_msg}}</view>
                            </block>
                            <view v-else class="cr-grey">请先输入用户信息搜索！</view>
                        </view>
                    </view>

                    <view class="form-gorup bg-white border-radius-main margin-top-main">
                        <view class="form-gorup-title">拜访内容<text class="form-group-tips-must">*</text></view>
                        <textarea class="cr-base" name="content" maxlength="230" auto-height placeholder-class="cr-grey-9" placeholder="拜访内容,最多230个字符"></textarea>
                    </view>

                    <view class="form-gorup form-container-upload oh border-radius-main margin-top-main">
                        <view class="form-gorup-title">上传照片<text class="form-group-tips-must">*</text><text class="form-group-tips">最多上传{{form_images_max_count}}张</text></view>
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

                    <view class="bottom-fixed">
                        <view class="bottom-line-exclude">
                            <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">提交</button>
                        </view>
                    </view>
                </view>
            </form>
        </view>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMag="data_list_loding_msg"></component-no-data>
        </block>
    </view>
</template>

<script>
const app = getApp();
import componentNoData from "../../../../components/no-data/no-data";
import componentSearch from '../../../../components/search/search';

var common_static_url = app.globalData.get_static_url("common");
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
            common_static_url: common_static_url,
            data_list_loding_status: 1,
            data_list_loding_msg: '',
            params: null,
            search_input_keywords_value: "",
            form_images_list: [],
            form_images_max_count: 30,
            editor_path_type: "",
            form_submit_disabled_status: false,
            custom_data: null,
        };
    },

    components: {
        componentNoData,
        componentSearch
    },
    props: {},

    onLoad(params) {
        this.setData({
            params: params,
        });

        this.init();
    },

    onShow() {
        // 分享菜单处理
        app.globalData.page_share_handle();
    },

    methods: {
        // 初始化
        init() {
            var user = app.globalData.get_user_info(this, "init");
            if (user != false) {
                // 用户未绑定手机则转到登录页面
                if (app.globalData.user_is_need_login(user)) {
                    uni.redirectTo({
                        url: "/pages/login/login?event_callback=init",
                    });
                    return false;
                } else {
                    // 获取数据
                    this.get_data();
                }
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
                data: this.params,
                dataType: "json",
                success: (res) => {
                    uni.hideLoading();
                    if (res.data.code == 0) {
                        var data = res.data.data;
                        this.setData({
                            data: data.data,
                            editor_path_type: data.editor_path_type || "",
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
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '网络开小差了哦~',
                    });
                    app.globalData.showToast("网络开小差了哦~");
                },
            });
        },

        // 数据提交
        form_submit(e) {
            // 表单数据
            var form_data = e.detail.value;
            form_data['custom_user_id'] = ((this.custom_data || null) != null && (this.custom_data.data || null) != null) ? this.custom_data.data.id : 0;
            form_data['images'] = this.form_images_list;

            // 数据校验
            var validation = [
                { fields: 'custom_user_id', msg: '请选择客户' },
                { fields: 'content', msg: '请填写拜访内容' },
                { fields: 'images', msg: '请上传拜访图片' },
            ];

            // 验证提交表单
            if (app.globalData.fields_check(form_data, validation)) {
                uni.showLoading({
                    title: '处理中...',
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
                                uni.navigateBack();
                            }, 1000);
                        } else {
                            this.setData({
                                form_submit_disabled_status: false,
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
                            form_submit_disabled_status: false,
                        });
                        app.globalData.showToast('获取数据失败');
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
                title: '搜索中...',
                mask: true
            });
            uni.request({
                url: app.globalData.get_request_url("userquery", "visit", "distribution"),
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
                    app.globalData.showToast("网络开小差了哦~");
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
                title: "温馨提示",
                content: "删除后不可恢复、继续吗？",
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
<template>
    <view>
        <view class="padding-main">
            <view v-if="detail != null">
                <form @submit="formSubmit" class="form-container">
                    <view v-for="(item, index) in detail.items" :key="index" class="form-gorup oh">
                        <view class="oh">
                            <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none">
                                <image class="goods-image fl radius br margin-right-lg" :src="item.images" mode="aspectFill"></image>
                            </navigator>
                            <view class="item-base fl margin-top-sm">
                                <block v-for="(item, tx) in [1,2,3,4,5]" :key="tx">
                                    <image class="xingxing-icon va-m" :src="common_static_url+'stars' + (form_rating_list[index] != undefined && form_rating_list[index] >= item ? '-active' : '') + '-icon.png'" mode="aspectFill" @tap="rating_event" :data-index="index" :data-value="item"></image>
                                </block>
                                <text v-if="form_rating_list[index] != undefined" class="cr-gray va-m margin-left-lg">{{rating_msg[form_rating_list[index]-1]}}</text>
                            </view>
                        </view>
                        <view class="margin-top-main br-t">
                            <textarea @input="form_content_event" :data-index="index" placeholder-class="cr-grey" class="cr-base" placeholder="宝贝满足你的期待吗？说说它的优点和美中不足的地方吧" maxlength="230"></textarea>
                            <view class="form-container-upload oh">
                                <view class="form-upload-data fl">
                                    <block v-if="(form_images_list[index] || null) != null && form_images_list[index].length > 0">
                                        <view v-for="(item, ix) in form_images_list[index]" :key="ix" class="item fl">
                                            <text class="delete-icon" @tap="upload_delete_event" :data-index="index" :data-ix="ix">x</text>
                                            <image :src="item" @tap="upload_show_event" :data-index="index" :data-ix="ix" mode="aspectFill" class="padding-xs dis-block"></image>
                                        </view>
                                    </block>
                                </view>
                                <image v-if="(form_images_list[index] || null) == null || form_images_list[index].length < 3" class="upload-icon" :src="common_static_url+'upload-icon.png'" mode="aspectFill" @tap="file_upload_event" :data-index="index"></image>
                            </view>
                        </view>
                    </view>

                    <view class="form-gorup anonymous">
                        <switch class="va-m" name="is_anonymous" @change="anonymous_event"></switch>
                        <text class="cr-base va-m">匿名</text>
                        <text class="fr cr-gray margin-top-lg">{{anonymous_msg_list[anonymous_value]}}</text>
                    </view>

                    <view class="form-gorup form-gorup-submit">
                        <button form-type="submit" class="bg-main br-main cr-white round text-size" type="default" hover-class="none" :disabled="form_button_disabled">提交</button>
                    </view>
                </form>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from "../../components/no-data/no-data";
    import componentBottomLine from "../../components/bottom-line/bottom-line";

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                params: null,
                detail: null,
                editor_path_type: '',
                rating_msg: ['非常差', '差', '一般', '好', '非常好'],
                anonymous_value: 0,
                anonymous_msg_list: ['你写的评论会以匿名的形式展现', '你写的评论会以昵称的形式展现'],
                form_rating_list: [],
                form_images_list: [],
                form_content_list: [],
                form_button_disabled: false
            };
        },

        components: {
            componentNoData,
            componentBottomLine
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },
        
        onShow() {
            // 数据加载
            this.init();
            
            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init() {
                var self = this;
                uni.showLoading({
                    title: "加载中..."
                });
                this.setData({
                    data_list_loding_status: 1
                });
                uni.request({
                    url: app.globalData.get_request_url("comments", "order"),
                    method: "POST",
                    data: {
                        id: this.params.id
                    },
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                editor_path_type: data.editor_path_type || '',
                                detail: data.data,
                                data_list_loding_status: 3,
                                data_list_loding_msg: ''
                            });
                        } else {
                            self.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg
                            });
                            if (app.globalData.is_login_check(res.data, self, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        uni.stopPullDownRefresh();
                        self.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '服务器请求出错'
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                uni.previewImage({
                    current: this.form_images_list[index][ix],
                    urls: this.form_images_list[index]
                });
            },

            // 图片删除
            upload_delete_event(e) {
                var index = e.currentTarget.dataset.index;
                var ix = e.currentTarget.dataset.ix;
                var self = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复、继续吗？',
                    success(res) {
                        if (res.confirm) {
                            var list = self.form_images_list;
                            list[index].splice(ix, 1);
                            self.setData({
                                form_images_list: list
                            });
                        }
                    }
                });
            },

            // 文件上传
            file_upload_event(e) {
                // 数据初始化
                var index = e.currentTarget.dataset.index;
                var temp_list = this.form_images_list;
                var length = this.detail.items.length;
                for (var i = 0; i < length; i++) {
                    if (temp_list[i] == undefined) {
                        temp_list[i] = [];
                    }
                }
                this.setData({
                    form_images_list: temp_list
                });
                
                // 处理上传文件
                var self = this;
                uni.chooseImage({
                    count: 3,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(index, res.tempFilePaths, success, fail, count, length);
                    }
                });
            },

            // 采用递归的方式上传多张
            upload_one_by_one(index, img_paths, success, fail, count, length) {
                var self = this;
                if ((self.form_images_list[index] || null) == null || self.form_images_list[index].length < 3) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url("index", "ueditor"),
                        filePath: img_paths[count],
                        name: 'upfile',
                        formData: {
                            action: 'uploadimage',
                            path_type: self.editor_path_type
                        },
                        success: function(res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    if ((list[index] || null) == null) {
                                        list[index] = [];
                                    }
                                    list[index].push(data.data.url);
                                    self.setData({
                                        form_images_list: list
                                    });
                                } else {
                                    app.globalData.showToast(data.msg);
                                }
                            }
                        },
                        fail: function(e) {
                            fail++;
                        },
                        complete: function(e) {
                            count++;

                            // 下一张
                            if (count >= length) {
                                // 上传完毕，作一下提示
                                //app.showToast('上传成功' + success +'张', 'success');
                            } else {
                                // 递归调用，上传下一张
                                self.upload_one_by_one(index, img_paths, success, fail, count, length);
                            }
                        }
                    });
                }
            },

            // 是否匿名事件
            anonymous_event(e) {
                this.setData({
                    anonymous_value: e.detail.value == true ? 1 : 0
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
                    if (temp_list[i] == undefined) {
                        temp_list[i] = 0;
                    }
                    if (index == i) {
                        temp_list[i] = value;
                    }
                }
                this.setData({
                    form_rating_list: temp_list
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
                        temp_list[i] = '';
                    }
                    if (index == i) {
                        temp_list[i] = value;
                    }
                }
                this.setData({
                    form_content_list: temp_list
                });
            },

            // 表单
            formSubmit(e) {
                // 商品数量
                var length = this.detail.items.length;
                
                // 评分校验
                var count = this.form_rating_list.length;
                if (count < length) {
                    app.globalData.showToast('请先评分');
                    return false;
                }
                var max = Math.max.apply(null, this.form_rating_list);
                var min = Math.min.apply(null, this.form_rating_list);

                if (min < 1 || max > 5) {
                    app.globalData.showToast('还有未评分');
                    return false;
                }
                
                // 内容校验
                var count = this.form_content_list.length;
                if (count < length) {
                    app.globalData.showToast('请填写评论内容');
                    return false;
                }

                for (var i in this.form_content_list) {
                    var count = this.form_content_list[i].length;
                    if (count < 6 || count > 230) {
                        app.globalData.showToast('评论内容 6~230 个字符之间');
                        return false;
                    }
                }
                
                // 图片校验
                if (this.form_images_list.length > 0) {
                    for (var i in this.form_images_list) {
                        if (this.form_images_list[i].length > 3) {
                            app.globalData.showToast('每项评论图片不能超过3张');
                            return false;
                        }
                    }
                }
                
                // 表单数据
                var form_data = e.detail.value;
                form_data['is_anonymous'] = form_data['is_anonymous'] == true ? 1 : 0;
                form_data['id'] = this.detail.id;
                form_data['goods_id'] = JSON.stringify(this.detail.items.map(function(v) {
                    return v.goods_id;
                }));
                form_data['rating'] = JSON.stringify(this.form_rating_list);
                form_data['content'] = JSON.stringify(this.form_content_list);
                form_data['images'] = this.form_images_list.length > 0 ? JSON.stringify(this.form_images_list) : '';
                
                // 提交表单
                var self = this;
                uni.showLoading({
                    title: "处理中..."
                });
                self.setData({
                    form_button_disabled: true
                });
                uni.request({
                    url: app.globalData.get_request_url("commentssave", "order"),
                    method: "POST",
                    data: form_data,
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            setTimeout(function() {
                                uni.navigateBack();
                            }, 2000);
                        } else {
                            self.setData({
                                form_button_disabled: false
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.setData({
                            form_button_disabled: false
                        });
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            }
        }
    };
</script>
<style>
    @import './user-order-comments.css';
</style>
<template>
    <view :class="theme_view">
        <view class="flex-row flex-wrap">
            <block v-if="propData.length > 0">
                <view v-for="(item, index) in propData" :key="index" class="item margin-right-lg pr">
                    <view v-if="propDelete" class="delete-icon pa z-i" @tap="upload_delete_event" :data-index="index">
                        <iconfont name="icon-bjdz-guanbi" size="36rpx" color="rgba(87,91,102,0.65)"></iconfont>
                    </view>
                    <image :src="item" @tap="upload_show_event" :data-index="index" mode="aspectFill" class="img border-radius-main oh"></image>
                </view>
            </block>
            <view v-if="(propData || null) == null || propData.length < propMaxNum" class="img bg-grey-f5 border-radius-main flex-col align-c jc-c" @tap="file_upload_event">
                <iconfont name="icon-wytw-sctp" size="52rpx" color="#999"></iconfont>
                <text class="text-size-xs cr-grey-9">{{$t('upload.upload.b33f08')}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        props: {
            // 初始图片数据
            propData: {
                type: Array,
                default: () => {
                    return [];
                },
            },
            // 最大上传数量
            propMaxNum: {
                type: [Number, String],
                default: 3,
            },
            // 是否可以删除
            propDelete: {
                type: Boolean,
                default: true,
            },
            // 是否可以预览
            propPreview: {
                type: Boolean,
                default: true,
            },
            // 路径类型 默认common
            propPathType: {
                type: String,
                default: 'common',
            },
            // 回调数据
            propCallData: {
                type: [Number, String, Array, Object],
                default: '',
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                form_images_list: [],
            };
        },
        mounted() {
            this.setData({
                form_images_list: this.propData,
            });
        },
        created: function () {},

        methods: {
            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length) {
                var self = this;
                if (self.form_images_list.length <= this.propMaxNum) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url('index', 'ueditor'),
                        filePath: img_paths[count],
                        name: 'upfile',
                        formData: {
                            action: 'uploadimage',
                            path_type: self.propPathType,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    list.push(data.data.url);
                                    self.setData({
                                        form_images_list: list,
                                    });
                                    self.$emit('call-back', self.form_images_list, self.propCallData);
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
            },

            // 文件上传
            file_upload_event(e) {
                var self = this;
                uni.chooseImage({
                    count: self.propMaxNum,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(res.tempFilePaths, success, fail, count, length);
                    },
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
                            self.$emit('call-back', self.form_images_list, self.propCallData);
                        }
                    },
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                if(this.propPreview) {
                    uni.previewImage({
                        current: this.form_images_list[e.currentTarget.dataset.index],
                        urls: this.form_images_list,
                    });
                }
            },
        },
    };
</script>
<style scoped>
    .img {
        width: 120rpx;
        height: 120rpx;
    }
    .delete-icon {
        top: -16rpx;
        right: -16rpx;
    }
</style>

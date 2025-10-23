<template>
    <view :class="theme_view">
        <template v-if="propType !== 'file'">
            <view class="flex-row flex-wrap padding-top-xs">
                <template v-if="propData.length > 0">
                    <view v-for="(item, index) in propData" :key="index" class="item margin-right-lg pr">
                        <view v-if="propDelete" class="delete-icon pa z-i-deep" @tap="upload_delete_event" :data-index="index">
                            <iconfont name="icon-close-fillup" size="36rpx" color="rgba(87,91,102,0.65)"></iconfont>
                        </view>
                        <template v-if="propType == 'img'">
                            <image :src="item.url" @tap="upload_show_event" :data-index="index" mode="aspectFill" class="img border-radius-main oh box-shadow-img"></image>
                        </template>
                        <template v-else-if="propType == 'video'">
                            <view class="pr show-video">
                                <video :src="item.url" class="video border-radius-main oh box-shadow-video" :show-center-play-btn="false" :controls="false" objectFit="cover" style="object-fit: cover" ></video>
                                <view class="video-container border-radius-main z-i flex-row align-c jc-c" :data-index="index" @tap="upload_show_event">
                                    <iconfont name="icon-bofang" size="32rpx" color="#fff"></iconfont>
                                </view>
                            </view>
                        </template>
                    </view>
                </template>
                <view v-if="(propData || null) == null || propData.length < propMaxNum" class="add-img img border-radius-main flex-col align-c jc-c" @tap="file_upload_event">
                    <iconfont name="icon-add" size="52rpx" color="#999"></iconfont>
                </view>
            </view>
        </template>
        <template v-else>
            <view v-if="propData.length > 0" class="flex-col gap-5 margin-vertical margin-horizontal-xs">
                <view v-for="(item, index) in propData" :key="index" class="upload-file-content flex-row align-c gap-10">
                    <view v-if="item" class="flex-1 flex-row align-c upload-file-title w h">
                        <span class="text-line-1">{{ new_name(item.name)[0] || '' }}</span><span>.{{ new_name(item.name)[1] || '' }}</span>
                    </view>
                    <view :data-index="index" @tap="upload_delete_event">
                        <iconfont name="icon-close" size="36rpx" color="#999"></iconfont>
                    </view>
                </view>
            </view>
            <view v-if="(propData || null) == null || propData.length < propMaxNum" class="file flex-row align-c" :style="propBorderStyle" @tap="file_upload_event">
                请选择文件，最多可以上传{{ propMaxNum }}个
            </view>
        </template>
        <uni-popup ref="popup" type="center" border-radius="20rpx" class="forminput-popup" mask-background-color="rgba(0,0,0,0.8)">
            <view class="wh-auto ht-auto">
                <view class="popup-close oh" @tap="popup_close">
                    <iconfont name="icon-close" size="32rpx" color="#fff"></iconfont>
                </view>
                <video :src="video_src" autoplay controls class="radius-md" objectFit="contain" :style="{ width: popup_width, height: popup_height }"></video>
            </view>
        </uni-popup>
    </view>
</template>
<script>
    const app = getApp();
    var common_static_url = app.globalData.get_static_url('common');
    var system = app.globalData.get_system_info(null, null, true);
    var sys_width = app.globalData.window_width_handle(system.windowWidth);
    import VideoPlayer from '@/components/video-player/video-player.vue';
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        components: {
            VideoPlayer,
        },
        props: {
            propType: {
                type: String,
                default: 'img',
            },
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
            propBorderStyle: {
                type: String,
                default: '',
            },
            // 回调数据
            propCallData: {
                type: [Number, String, Array, Object],
                default: '',
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
        },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                form_images_list: [],
                video_src: '',
                popup_width: '0rpx',
                popup_height: '0rpx',
            };
        },
        computed: {
            // 名字和格式拆开显示
            new_name() {
                return (name) => {
                    if (!isEmpty(name)) {
                        let index = name.lastIndexOf('.'); // 获取最后一个/的位置
                        let lastSegment = name.substring(index + 1); // 截取最后一个/后的值
                        let new_name = name.substring(0, index);
                        return [ new_name, lastSegment]
                    } else {
                        return ['', '']
                    }
                }
            }
        },
        watch: {
            propKey(val) {
                this.init();
            },
            propData(val) {
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        created: function () {},
        methods: {
            init() {
                // 将80%的宽度分成16份
                const block = (sys_width * 0.8) / 16;
                this.setData({
                    popup_width: block * 16 * 2 + 'rpx', // 视频的宽度，依照16:9比例来算
                    popup_height: block * 9 * 2 + 'rpx',  // 视频的高度
                    form_images_list: this.propData,
                });
            },
            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length, action) {
                var self = this;
                if (self.form_images_list.length <= this.propMaxNum) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url('index', 'ueditor'),
                        filePath: img_paths[count],
                        name: 'upfile',
                        formData: {
                            action: action,
                            path_type: self.propPathType,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    list.push({
                                        url: data.data.url,
                                        name: data.data.original,
                                        size: data.data.size,
                                    });
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
                            console.log(e);
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
                                self.upload_one_by_one(img_paths, success, fail, count, length, action);
                            }
                        },
                    });
                }
            },
            // 文件上传
            file_upload_event(e) {
                if (this.propType == 'img') {
                    var self = this;
                    uni.chooseImage({
                        count: self.propMaxNum,
                        success(res) {
                            var success = 0;
                            var fail = 0;
                            var length = res.tempFilePaths.length;
                            var count = 0;
                            self.upload_one_by_one(res.tempFilePaths, success, fail, count, length, 'uploadimage');
                        },
                    });
                } else if (this.propType == 'video') { 
                    var self = this;
                    uni.chooseVideo({
                        count: self.propMaxNum,
                        success(res) {
                            var success = 0;
                            var fail = 0;
                            var length = 0;
                            var count = 0;
                            self.upload_one_by_one([res.tempFilePath], success, fail, count, length, 'uploadvideo');
                        },
                    });
                } else {
                    const ext_file_name_list = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.gif', '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg', '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.csv', '.wav', '.mid', '.cab', '.iso', '.ofd', '.xml', '.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.vsd', '.sql'];
                    var self = this;
                    // #ifdef H5
                    uni.chooseFile({
                        count: self.propMaxNum,
                        extension: ext_file_name_list,
                        success(res) {
                            var success = 0;
                            var fail = 0;
                            var length = res.tempFilePaths.length;
                            var count = 0;
                            self.upload_one_by_one(res.tempFilePaths, success, fail, count, length, 'uploadfile');
                        },
                    });
                    // #endif
                    // #ifdef MP-QQ || MP-WEIXIN
                    uni.chooseMessageFile({
                        count: self.propMaxNum,
                        extension: ext_file_name_list,
                        success(res) {
                            var success = 0;
                            var fail = 0;
                            var length = res.tempFilePaths.length;
                            var count = 0;
                            self.upload_one_by_one(res.tempFilePaths, success, fail, count, length, 'uploadfile');
                        },
                    });
                    // #endif
                }
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
                    if (this.propType == 'img') {
                        uni.previewImage({
                            current: this.form_images_list[e.currentTarget.dataset.index].url,
                            urls: this.form_images_list.map(item => item.url),
                        });
                    } else if (this.propType == 'video') {
                        this.setData({
                            video_src: this.form_images_list[e.currentTarget.dataset.index].url,
                        });
                        this.$refs.popup.open();
                    }
                }
            },
            popup_close() {
                this.$refs.popup.close();
            }
        },
    };
</script>
<style scoped>
    .img, .video {
        width: 120rpx;
        height: 120rpx;
    }
    .delete-icon {
        top: -16rpx;
        right: -16rpx;
    }
    .add-img {
        background: #f0f1f4;
    }
    ::v-deep .show-video .uni-video-cover-duration {
        display: none;
    }
    .video-container {
        position: absolute;
        width: 120rpx;
        height: 120rpx;
        top: 0;
        left: 0;
        background: #000;
        opacity: 0.5;
    }
    .popup-close {
        position: fixed;
        top: 32rpx;
        right: 32rpx;
        z-index: 99;
    }
    .file {
        background: #fff;
        color: #606266;
        font-size: 24rpx;
        padding: 10rpx 20rpx;
    }
    .gap-5 {
        gap: 10rpx;
    }
    .upload-file-content { 
		padding: 20rpx 24rpx 20rpx 32rpx;
        box-shadow: 0px 0px 10rpx 0px rgba(207,207,207,0.5);
        background: #fff;
        border-radius: 8rpx;
	}
    .box-shadow-img, .box-shadow-video {
        box-shadow: 0px 0px 5px 0px rgba(207, 207, 207, 0.5);
    }
</style>

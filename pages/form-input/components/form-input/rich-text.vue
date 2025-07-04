<template>
    <sp-editor @init="initEditor" @input="rich_text_event" @upinImage="up_in_image_event"></sp-editor>
</template>

<script>
    const app = getApp();
    import { isEmpty } from '@/common/js/common/common.js';
    export default {
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
            propIsCustom: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                com_data: {},
            };
        },
        watch: {
            propKey(val) {
                // 初始化
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            isEmpty,
            // 初始化数据
            init() {
                const com_data = this.propValue;
                this.setData({
                    com_data: com_data,
                    form_value: com_data.form_value || '',
                });
            },
            initEditor(editor) {
                // 初始化编辑器内容
                editor.setContents({
                    html: (this.propValue.form_value || null) !== null ? this.propValue.form_value : '',
                });
            },
            // 回调富文本内容
            rich_text_event(e) {
                var new_data = this.data;
                new_data = e.html;
                this.setData({
                    form_value: new_data,
                });
                this.$emit('dataChange', { value: new_data, id: this.propDataId });
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
            }
        },
    };
</script>

<style></style>

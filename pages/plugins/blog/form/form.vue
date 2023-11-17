<template>
    <view>
        <textImageVideoEditor ref="textImageVideoEditor" :list2="initEditorList" @addImage="addImage" @addVideo="addVideo" :showPreview="true" @preview="preview" completedText="下一步" @completed="completed"></textImageVideoEditor>
    </view>
</template>
<script>
    const app = getApp();
    import textImageVideoEditor from '@/components/yyc-easy-editor/index.vue';
    export default {
        data() {
            return {
                initEditorList: [
                    {
                        type: 1,
                        content: '',
                    },
                ],
            };
        },
        components: {
            textImageVideoEditor,
        },
        onLoad(options) {},
        methods: {
            preview(data) {
                console.log('预览preview！', data);
            },
            completed(data) {
                console.log('完成completed！', data);
                // data: {
                // 	  content: "富文本内容",
                // 	  image: "提取一张图片",
                // 	  json: "",
                // }
            },
            addImage() {
                console.log('上传图片');
                let _this = this;
                //这里是你上传的代码
                //......
                //得到imgurl
                _this.$refs.textImageVideoEditor.addImageCompleted(imgurl);
            },
            addVideo() {
                console.log('上传视频');
                let _this = this;
                //这里是你上传的代码
                //......
                //得到videourl
                _this.$refs.textImageVideoEditor.addVideoCompleted(videourl);
            },
        },
    };
</script>
<style>
    @import './form.css';
</style>

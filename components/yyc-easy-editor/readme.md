
###########说明
1. 图标使用uni-icons，没有的请到插件市场自行安装。

2. 示例代码如下：
    list2: 初始化数据（用于编辑）
    addImage: 图片上传
    addVideo: 视频上传
    showPreview: 是否显示预览
    preview: 返回预览的html文本
    completedText: 按钮文字
    completed: 编辑器返回数据json
    
3. 提示：rich-text不能解析视频，建议使用插件市场uparse。

4. 有问题，微信同QQ：736849829（请备注）。上传视频太大，不会分片，也可以v我。

###########示例代码
<template>
    <view>
		<textImageVideoEditor
			ref="textImageVideoEditor"
			:list2="initEditorList"  
			@addImage="addImage"
			@addVideo="addVideo"
			:showPreview="true"
			@preview="preview"
			completedText="下一步"
			@completed="completed"
		></textImageVideoEditor>
    </view>
</template>

<script>
	import textImageVideoEditor from '../../components/yyc-easy-editor/index.vue'
    export default {
        data() {
            return {
				initEditorList: [
					{
						type:1, 
						content:""
					}
				],
            }
        },
		components: {
			textImageVideoEditor
		},
		onLoad(options) {
		
		},
        methods: {
			preview(data){
				console.log("预览preview！", data)
			},
			completed(data){
				console.log("完成completed！", data)
				// data: {
				// 	  content: "富文本内容",
				// 	  image: "提取一张图片",
				// 	  json: "",
				// }
			},
            addImage(){
				console.log("上传图片")
				let _this = this;
				//这里是你上传的代码
				//......
				//得到imgurl
				_this.$refs.textImageVideoEditor.addImageCompleted(imgurl); 
            },
            addVideo(){
				console.log("上传视频")
				let _this = this;
				//这里是你上传的代码
				//......
				//得到videourl
            	_this.$refs.textImageVideoEditor.addVideoCompleted(videourl);
            },
        }
    }
</script>

<style lang="scss">
	
</style>


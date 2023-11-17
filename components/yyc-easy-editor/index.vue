<template>
	<view>
		<view class="content">
			<view class="detail" v-for="(item,index) in list" :key="index">
				<view class="textarea" v-if="item.type==1">
					<textarea maxlength="-1" placeholder="请输入内容" v-model="list[index].content"/>
				</view>
				<view class="image" v-else-if="item.type==2">
					<image :src="item.content" mode="widthFix"></image>
				</view>
				<view class="video" v-else-if="item.type==3">
					<video :src="item.content"></video>
				</view>
				<view class="btn-group">
					<view :data-index="index" @tap="delItem">
						<uni-icons type="trash" size="14"></uni-icons>
						<text>删除</text>
					</view>
					<view v-if="index>0" :data-index="index" @tap="arrowthinup">
						<uni-icons type="arrowthinup" size="14"></uni-icons>
						<text>上移</text>
					</view>
					<view v-if="index<(list.length-1)" :data-index="index" @tap="arrowthindown">
						<uni-icons type="arrowthindown" size="14"></uni-icons>
						<text>下移</text>
					</view>
				</view>
			</view>
			<view class="footer-btn-group">
				<view @tap="showShade">
					<uni-icons type="plusempty" color="#197ae5" size="16"></uni-icons>
					<text>添加</text>
				</view>
				<view @tap="preview" v-if="showPreview">
					<uni-icons type="eye" color="#197ae5" size="16"></uni-icons>
					<text>预览</text>
				</view>
				<view @tap="completed">
					<uni-icons type="arrowthinright" color="#197ae5" size="16"></uni-icons>
					<text>{{completedText}}</text>
				</view>
			</view>
		</view>
		
		<!-- 遮罩层 -->
		<view class="shade" v-if="shade" @tap="closeShade">
			<view class="shade-content" @tap.stop>
				<view class="shade-content-item" @tap="addText">
					<view class="shade-content-item-icon">
						<uni-icons type="compose" size="30"></uni-icons>
					</view>
					<view>文字</view>
				</view>
				<view class="shade-content-item" @tap="addImage">
					<view class="shade-content-item-icon">
						<uni-icons type="image" size="30"></uni-icons>
					</view>
					<view>图片</view>
				</view>
				<view class="shade-content-item" @tap="addVideo">
					<view class="shade-content-item-icon">
						<uni-icons type="videocam" size="40"></uni-icons>
					</view>
					<view>视频</view>
				</view>
			</view>
		</view>
	</view>
</template>
 
<script>
export default {
	name: 'textImageVideoEditor',
	props: {
		completedText: {
			type: String,
			default: "完成"
		}, 
		showPreview: {
			type: Boolean,
			default: true
		},
		list2: {
			type: Array,
			default: function() {
				return [
					{
						type: 1,
						content: ""
					},
				]
			}
		}, 
	},
	data() {
		return {
			shade: false,
			list: [
				{
					type: 1,
					content: ""
				}
			], 
			form: {
				image: "",
				content: "",
			}
		};
	},
	mounted() {
		this.list = this.list2;
	},
	methods:{
		showShade(){
			this.shade = true;
		},
		closeShade(){
			this.shade = false;
		},
		addText(){
			let addjson = {type: 1, content: ""}
			this.list.push(addjson)
			this.closeShade();
		},
		addImage(){
			this.$emit("addImage")
		},
		addImageCompleted(imgurl){
			let addjson = {type: 2, content: imgurl}
			this.list.push(addjson)
			this.closeShade();
		},
		addVideo(){
			this.$emit("addVideo")
		},
		addVideoCompleted(videourl){
			let addjson = {type: 3, content: videourl}
			this.list.push(addjson)
			this.closeShade();
		},
		delItem(e){
			let index = e.currentTarget.dataset.index;
			this.list.splice(index, 1)
		},
		arrowthinup(e){
			let index = e.currentTarget.dataset.index;
			let newList = [];
			if(index>0){
				for(let i in this.list){
					if(index-i==1){
						newList.push(this.list[index])
						newList.push(this.list[i])
					}else if(index==i){
						continue;
					}else{
						newList.push(this.list[i])
					}
				}
				this.list = newList
			}
		},
		arrowthindown(e){
			let index = e.currentTarget.dataset.index;
			let newList = [];
			if(index<(this.list.length-1)){
				for(let i in this.list){
					if(i==index){
						newList.push(this.list[(parseInt(i)+1)])
						newList.push(this.list[i])
					}else if((index+1)==i){
						continue;
					}else{
						newList.push(this.list[i])
					}
				}
				this.list = newList
			}
		},
		preview(){
			let content = this.setContent();
			if(content===false){
				uni.showToast({
					title: "你还没有添加内容哦",
					icon:'none',
					duration: 1000
				});
			}else{
				this.$emit("preview", this.form.content)
			}
		},
		completed(){
			let content = this.setContent();
			if(content===false){
				uni.showToast({
					title: "你还没有添加内容哦",
					icon:'none',
					duration: 1000
				});
			}else{
				let data = this.form;
				data.json = JSON.stringify(this.list)
				this.$emit("completed", data)
			}
		},
		setContent(){
			let content = ""
			for(let i in this.list){
				if(this.list[i].content!=""){
					if(this.list[i].type==1){
						content += `<div style="width:100%;padding-top: 10px">${this.list[i].content}</div>`;
					}
					if(this.list[i].type==2){
						content += `<div style="width:100%;padding-top: 10px">
							<img src="${this.list[i].content}" style="width: 100%" />
						</div>`;
						// 封面图
						if(this.form.image==""){
							this.form.image = this.list[i].content;
						}
					}
					if(this.list[i].type==3){
						content += `<div style="width:100%;padding-top: 10px">
							<video style="width: 100%" controls>
							  <source src="${this.list[i].content}">
							</video>
						</div>`;
					}
				}
				
			}
			if(content==""){
				return false;
			}
			this.form.content = content;
		},
		
		
	}
};
</script>
 
 <style lang="scss">
 	body{
 		background: #fff;
 		width: 700rpx;
 		margin: 0 auto;
 	}
 	.content{
 		margin-bottom: 200rpx;
 		.detail{
 			margin-top: 40rpx;
 			position: relative;
 			border: 1px solid #eeeeee;
 			.textarea{
 				padding-bottom: 66rpx;
 				textarea{
 					width: 96%;
 					padding: 2%;
 				}
 			}
 			.image{
 				padding-bottom: 56rpx;
 				image{
 					width: 100%;
 				}
 			}
 			
 			.video{
 				padding-bottom: 56rpx;
 				video{
 					width: 100%;
 				};
 			}
 		}
 		
 	}
 	.btn-group{
 		display: flex;
 		position: absolute;
 		right: 0;
 		bottom: 0;
 		view{
 			width: 140rpx;
 			height: 60rpx;
 			line-height: 56rpx;
 			text-align: center;
 			font-size: 28rpx;
 			background: #f5f5f5;
 			border-top: 1px solid #eeeeee;
 			border-left: 1px solid #eeeeee;
 		}
 	}
 	.footer-btn-group{
 		z-index: 9;
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		width: 700rpx;
 		height: 150rpx;
 		margin: auto;
 		background: #fff;
 		position: fixed;
 		left: 0;
 		right: 0;
 		bottom: 0;
 		view{
 			width: 180rpx;
 			height: 90rpx;
 			line-height: 90rpx;
 			text-align: center;
 			font-size: 32rpx;
 			color: #197ae5;
 			border: 1px solid #197ae5;
 			uni-icons{
 				position: relative;
 				left: -10rpx;
 			}
 		}
 	}
 	.shade{
 		position: fixed;
 		top: 0;
 		left: 0;
 		bottom: 0;
 		width: 100%;
 		z-index: 99999999;
 		background: rgba(12,12,12,.8);
 		.shade-content{
 			width: 70%;
 			padding: 100rpx 15%;
 			background: #fff;
 			position: absolute;
 			bottom: 0;
 			display: flex;
 			justify-content: space-between;
 			align-items: center;
 			.shade-content-item{
 				width: 120rpx;
 				text-align: center;
 				.shade-content-item-icon{
 					height: 120rpx;
 					line-height: 120rpx;
 					width: 120rpx;
 					border: 2px solid #ccc;
 					text-align: center;
 				}
 			}
 			
 		}
 	}
 </style>
 
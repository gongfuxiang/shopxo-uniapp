<template>
    <div class="page" :style="{ height: height }">
		<swiper
			class="swiper"
			:vertical="true"
			@change="changeCurrent"
			@animationfinish="animationFinish"
			:current="index">
			<swiper-item v-for="(item, idx) in videoList" :key="idx" class="swiper-item">
					<!-- 视频渲染数预加载数影响性能 -->
					<div v-if="Math.abs(index-idx)<=1" class="video-box">
						<block v-if="item.src">
							<chunlei-video class="video" :src="item.src"  :height="height" :width="width"
								:play="item.flag" v-if="Math.abs(index-idx)<=1" :gDuration="item.duration"
								:initialTime="item.initialTime" @pause="pauseVideo" :objectFit="item.objectFit"
								@playEnd="playEnd" :danmuList="danmuList"
							>
							</chunlei-video>
							
							<cover-view class="cover-view-left">
								<cover-view class="left-view">
									<!-- #ifdef APP-PLUS-NVUE -->
									<text class="left-text">@{{item.at}}</text>
									<!-- #endif -->
									<!-- #ifndef APP-PLUS-NVUE -->
									<cover-view class="left-text">@{{item.at}}</cover-view>
									<!-- #endif -->
								</cover-view>
								<cover-view class="left-view">
									<!-- #ifdef APP-PLUS-NVUE -->
									<text class="left-text">{{item.content}}</text>
									<!-- #endif -->
									<!-- #ifndef APP-PLUS-NVUE -->
									<cover-view class="left-text">{{item.content}}</cover-view>
									<!-- #endif -->
								</cover-view>
							</cover-view>
							<cover-view class="cover-view-right">
								<cover-image :src="item.avater" class="avater img" @click.stop="tapAvater"></cover-image>
								<!-- #ifdef APP-PLUS-NVUE -->
								<text class="right-text-avater">+</text>
								<text class="right-text"></text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS-NVUE -->
								<cover-view class="right-text-avater">+</cover-view>
								<cover-view class="right-text"></cover-view>
								<!-- #endif -->
								
								<cover-image :src="item.check?'../../static/aixinRed.png':'../../static/aixin.png'" class="img" @click.stop="tapLove"></cover-image>
								
								<!-- #ifdef APP-PLUS-NVUE -->
								<text class="right-text">{{item.like}}</text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS-NVUE -->
								<cover-view class="right-text">{{item.like}}</cover-view>
								<!-- #endif -->
								
								<cover-image src="../../static/xiaoxi.png" class="img" @click.stop="tapMsg(item)"></cover-image>
								
								<!-- #ifdef APP-PLUS-NVUE -->
								<text class="right-text">{{item.comment}}</text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS-NVUE -->
								<cover-view class="right-text">{{item.comment}}</cover-view>
								<!-- #endif -->
								
								<cover-image src="../../static/share-fill.png" class="img" @click.stop="tapShare"></cover-image>
								
								<!-- #ifdef APP-PLUS-NVUE -->
								<text class="right-text">分享</text>
								<!-- #endif -->
								<!-- #ifndef APP-PLUS-NVUE -->
								<cover-view class="right-text">分享</cover-view>
								<!-- #endif -->
								
							</cover-view>
						</block>
						<image src="../../static/logo.png" :style="{ height: height }" v-else  class="video-box"></image>
					</div>

			</swiper-item>
		</swiper>
    </div>
</template>
<script>
	import chunleiVideo from '../../components/chunlei-video/chunlei-video'
    export default { 
		components:{
			chunleiVideo
		},
        data() {
            return {
				sysheight:0,
				playCount:2,//剩余多少视频加载视频列表
				videoList:[
					
				],
				height:'667px',
				index:0,
				width:'',
				oldIndex:0,
				danmuList:[
					{text: '发条弹幕0',color: '#fff',time: 2,avatar:'../../static/avatar.png'},
					{text: '发条弹幕1',color: '#fff',time: 3,avatar:'../../static/avatar.png'},
					{text: '发条弹幕2',color: '#fff',time: 4,avatar:'../../static/avatar.png'},
					{text: '发条弹幕3',color: '#fff',time: 5,avatar:'../../static/avatar.png'},
				],
			}
        },
		created(){
			//#ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary")
			//隐藏subnvue
			uni.getSubNVueById('comment').hide()
			uni.getSubNVueById('input-box').hide()
			//#endif
			this.sysheight = uni.getSystemInfoSync().windowHeight
			this.height = `${this.sysheight}px` 
			let width = uni.getSystemInfoSync().windowWidth 
			this.width = `${width}px` 
			this.videoList.length = 300
			this.videoList.fill({src:''})
		},
		async mounted() {
			//设置id 通过id轮到相应位置
			let id = "http://img.kaiyanapp.com/255365dbfc2622930eb0cdb33e43abf0.jpeg?imageMogr2/quality/60/format/jpg"
			await this.pushVideoList()
			
			this.index = this.videoList.reduce((total,item)=>{
				if(id==''||id==item.id){
					id = ''
				}else{
					total++
				}
				return total
			},0)
			if(!this.index){
				this.$nextTick(()=>{
					this.videoPlay(this.index)
				})
			}
		},
		onHide(){
			for (let item of this.videoList) {
				item.flag = false
			}
		},
        methods: {
			animationFinish(e){
				//#ifdef APP-PLUS
				this.changeCurrent(e)
				//#endif
			},
			changeCurrent(e){
				this.index = e.detail.current; 
				
				this.$nextTick(()=>{
					
					for (let item of this.videoList) {
						item.flag = false
					}   
					
					this.videoList[this.index].flag = true
					
				}) 
				
			},
			pushVideoList(){
				let promise = new Promise((resolve,reject)=>{
					uni.request({
						url: 'https://api.apiopen.top/videoRecommend?id=127397',
						success: (res) => {
							let videoGroup = []
							for (let item of res.data.result) {
								if(item.type == 'videoSmallCard'){
									videoGroup.push({
										src:item.data.playUrl,
										content:item.data.title,
										flag:false,
										check:false,
										like:'7w',
										comment:'1045',
										at:item.data.author.name,
										id:item.data.author.icon,
										avater:item.data.author.icon,
										initialTime:0,
										duration:item.data.duration
									})
								}
							}
							
							let len = this.videoList.filter(item=>item.src).length
							for(let i = len;i<len+videoGroup.length;i++){
								this.$set(this.videoList,i,videoGroup[i-len])
								
							}
							resolve()
						}
					})
				}) 
				return promise
			},
			tapLove(){
				this.videoList[this.index].check = !this.videoList[this.index].check
				this.videoList = [...this.videoList]
				
			},
			tapAvater(){
				uni.showToast({
					icon:'none',
					title:`点击索引为${this.index}的头像`
				})
			},
			tapMsg(item){
				//#ifndef APP-NVUE
				uni.showToast({
					icon:'none',
					title:`查看索引为${this.index}的评论`
				})
				//#endif
				//#ifdef APP-NVUE
				uni.getSubNVueById('comment').show('none',0,()=>{
					uni.$emit('showComment',item.content)
				});
				//#endif
			},
			tapShare(){
				uni.showToast({
					icon:'none',
					title:`分享索引为${this.index}的视频`
				})
			},
			videoPlay(index){
				let promise = new Promise((resolve,reject)=>{
					resolve()
				})
				promise.then(res=>{
					this.$set(this.videoList[index],'flag',!this.videoList[index].flag)
		
				})
			},
			pauseVideo(val){
				if(typeof this.videoList[this.oldIndex].initialTime !='undefined') this.videoList[this.oldIndex].initialTime = val
			},
			clickVideo(){
				this.videoList[this.index].flag = !this.videoList[this.index].flag
			}
        },
		watch:{
			index(newVal,oldVal){
				let len = this.videoList.filter(item=>item.src).length
				//加载视频
				if(len - this.index - 1 <= this.playCount){
					this.pushVideoList()
				}
				this.oldIndex = oldVal
			}
		}
    }
</script>
<style scoped>
	.swiper{
		flex: 1;  
		background-color: #000;
	}
	.swiper-item {
	    flex: 1;
	}
    .video {
		flex: 1;
    }
	.video-box{
		flex: 1;
		width: 750rpx;
	}
	.cover-view-center{
		position: absolute;
		justify-content: center;
		align-items: center;
		opacity: 0.1;
		z-index: 999;
	}
	.cover-view-left{
		position: absolute;
		margin-left: 10upx;
		width: 500upx;
		bottom: 120upx;
		z-index: 9999;
		font-size: 16px;
		color: #FFFFFF;
		/* #ifndef APP-PLUS */
		white-space: pre-wrap;
		text-overflow:ellipsis;
		overflow:hidden;
		/* #endif */
	}
	.left-view{
		margin-bottom: 20upx;
	}
	.left-text{
		font-size: 16px;
		color: #FFFFFF;
	}
	.avater{
		border-radius: 50upx;
		border-color: #fff;
		border-style: solid;
		border-width: 2px;
	}
	
	.cover-view-right{
		position: absolute;
		bottom: 160upx;
		right: 20upx;
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		z-index: 9999;
	}
	
	.right-text-avater{
		position: absolute;
		font-size: 14px;
		top: 80upx;
		left: 30upx;
		height: 40upx;
		width: 40upx;
		background-color: #DD524D;
		color: #FFFFFF;
		border-radius: 50%;
		text-align: center;
		line-height: 40upx;
		z-index: 999;
	}
	.avater-icon{
		height: 40upx;
		width: 40upx;
		
		color: #fff;
		background-color: #DD524D;
		border-radius: 50%;
		position: absolute;
		left: 30upx;
		top:-20upx;
	}
	
	.right-text{
		text-align: center;
		font-size: 14px;
		color: #FFFFFF;
		margin-bottom: 50upx;
		height: 20px;
	}
	.img{
		height: 100upx;
		width: 100upx;
		opacity: 0.9;
	}
	.page{
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		flex: 1; 
	}
	
</style>

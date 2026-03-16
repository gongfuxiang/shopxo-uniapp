const BindingX = uni.requireNativePlugin('bindingx');
const animation = weex.requireModule('animation');
const modal = weex.requireModule('modal');
export default {
	data(){
		return{
			typeX:false, //是否开启左右滑动
			playCount:2,//剩余多少视频加载视频列表
			startDistance:5, //开启左右滑动时有效,判断左右上下拖动的启动距离
			minTime:300, //判断为快速滑动的时间,该时间内无视回弹
			backDistance:200, //上下滑动的回弹距离
            
			oldTime:0,
			oldTouces:{},
			touchType:null,
			gesToken:0,
			index:0,
			oldIndex:0,
			width:'',
            windowWidth: 0,
			windowHeight:0,
			distance:0,
			distanceX:0,
			scroll:false,
		}
	},
	created(){
		//#ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary")
		//#endif
        const data = uni.getWindowInfo();
        this.windowWidth = data.windowWidth > 800 ? 800 : data.windowWidth;
        this.windowHeight = data.windowHeight;
		this.width = `${this.windowWidth}px` 
	},
	methods:{
		getEl: function(el) {
		    if (typeof el === 'string' || typeof el === 'number') return el;
			if (WXEnvironment) {
			    return el.ref;
			} else {
			    return el instanceof HTMLElement ? el : el.$el;
			}
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			this.oldTime = new Date()
			this.oldTouces = e.changedTouches[0]
		},
		//判定方向
		ListTouchMove(e){
			//结束启动判断
			if(this.touchType == 'stop') return
			let { oldTouces,oldValue,touchType } = this
			let newTouces = e.changedTouches[0]
			
			if(!this.touchType){
				let startDistance = this.typeX?this.startDistance: 0 
				
				//滑动启动条件
				this.touchType = Math.abs( newTouces.pageY - oldTouces.pageY ) > startDistance ? 'moveY' : null
				if(this.touchType=='moveY'&&newTouces.pageY> oldTouces.pageY){
					this.touchType = 'moveYB'
				}else if(this.touchType=='moveY'&&newTouces.pageY<oldTouces.pageY){
					this.touchType = 'moveYT'
				}
				//是否开启左右滑动
				if(!this.touchType&&this.typeX){
					this.touchType = newTouces.pageX - oldTouces.pageX > startDistance ? 'moveXR' : this.touchType
					this.touchType = newTouces.pageX - oldTouces.pageX < -startDistance ? 'moveXL' : this.touchType
				}
				
			}else{
				// 如果在执行动画，就不触发
				if(this.scroll) return 
				// 解绑动画
				if(this.gesToken != 0) {
					BindingX.unbind({
						eventType:'pan',
						token:this.gesToken
					})
					this.gesToken = 0
					// return
				}
				
				let move
				if(this.touchType == 'moveYB'||this.touchType == 'moveYT'){
					move = 0
				}else if(this.touchType == 'moveXL'){
					move = -1
				}else if(this.touchType == 'moveXR'){
					move = 1
				}
				//关闭启动判断
				this.touchType = 'stop'
				
				let touch_origin = `y+${this.distance}<=0 && ${move}==0 && ${this.distanceX}==0 && 
					y+${this.distance}-${this.windowHeight}>=${-this.windowHeight*this.video_data_list.length}? 
					y+${this.distance} : ${this.distance}`;
				// 找到元素 
				let swiperRef = this.getEl(this.$refs.swiper);
                
				let gesTokenObj = BindingX.bind({
					anchor:swiperRef,
					eventType:'pan',
					props: [
						{element:swiperRef, property:'transform.translateY',expression: touch_origin},
						{element:swiperRef, property:'transform.translateX',expression: `${move}!=0 && ${move}*x>0 ?x+${this.distanceX} : ${this.distanceX}`}
					]
				}, (e) => {

					if(e.state === 'end') {
						this.touchType = null
						
						//上下
						if(move==0&& this.distanceX==0&& Math.abs(e.deltaY)>this.startDistance){
							let newTime = new Date()
							let quickMove = newTime.getTime() - this.oldTime.getTime() <= this.minTime ? true:false
							
							// 记录当前坐标
							const distance = this.distance + e.deltaY
							if(distance>0 || this.distance + e.deltaY-this.windowHeight<-this.windowHeight*this.video_data_list.length) {
								if (this.index == 0) {
									this.showToast('当前已经是第一条了');
								    return;
								} else if (this.index == this.video_data_list.length - 1) {
									this.showToast('当前已经是最后一条');
									return
								}
							}
							
							this.bindTiming(distance,e.deltaY,quickMove)
						}
					
						if(move!=0&& move*this.distanceX<=0&& e.deltaX*this.distanceX<=0&& Math.abs(e.deltaX)>this.startDistance){
							const distance = this.distanceX + e.deltaX
							
							this.bindTimingX(distance,e.deltaX)
						}
					}
				})
				// 记录下取消的token 多次 ontouchstart 时要带着 token 把上次的解绑
				this.gesToken = gesTokenObj.token
			}
			
		},
		bindTiming(distance,Y,quickMove){
			BindingX.unbindAll()
			// 开始执行动画
			this.scroll = true
			let swiperRef = this.getEl(this.$refs.swiper)
			let windowHeight = this.windowHeight
			
			let changed_Y, final_Y, translate_Y_origin
			
			// 生成表达式逻辑
			if( Math.abs(Y)<=this.backDistance&&!quickMove) {
				// 往上下拖动20以内时
				final_Y = this.distance	// 回到原点
				changed_Y = final_Y - distance    // 计算出需要位置的值
				translate_Y_origin = `easeOutExpo(t,${distance},${changed_Y},300)` // 运动曲线为easeOutElastic
			} else{
				// 往上下拖动超过一半时
				final_Y = this.distance + (Y>0?1:-1) *this.windowHeight
				changed_Y= final_Y - distance + (Y>0? 23 : -23)// 计算出需要位置的值
				translate_Y_origin = `easeOutExpo(t,${distance},${changed_Y},600)` // 运动曲线为easeOutExpo
			}
			
			let result = BindingX.bind({
				eventType:'timing',       // 结束的时候是没有任何监听的 用 timing 来做定时的动画
				exitExpression:"t>300",  // 当时间超过 300ms 结束动画
				props: [
					{element:swiperRef, property:'transform.translateY',expression:translate_Y_origin},
					]
				},async (e) => {
					if(e.state === 'end' || e.state === 'exit') {
						this.distance = final_Y
						this.scroll = false
						if(Math.abs(Y)>this.backDistance||quickMove) {
							this.index = -this.distance/this.windowHeight;
                            this.process_swiper_change(this.index);
							//加载视频
							if(this.video_data_list.length - this.index - 1 <= this.playCount){
                                this.get_last_or_next_data_list(this.video_data_list[this.video_data_list.length - 1].id, 0, 1);
							}
						}else if(Math.abs(Y)<=this.backDistance&&!quickMove){
                            this.play_current_video_safely(this.index);
						}
					}
			})
		},
		bindTimingX(distance,X){
			// 开始执行动画
			this.scroll = true
			let swiperRef = this.getEl(this.$refs.swiper)
			let width = parseInt(this.width) 
			
			let changed_X, final_X, origin
			
			// 生成表达式逻辑
			if( Math.abs(X)<=10) {
				final_X = this.distanceX	// 回到原点
				changed_X = final_X - distance    // 计算出需要位置的值
				origin = `easeOutExpo(t,${distance},${changed_X},300)` // 运动曲线为easeOutElastic
			} else{
				final_X = this.distanceX + (X>0?1:-1) *width
				changed_X= final_X - distance// 计算出需要位置的值
				origin = `easeOutExpo(t,${distance},${changed_X},300)` // 运动曲线为easeOutExpo
			}
            console.log(changed_X);
			let result = BindingX.bind({
				eventType:'timing',       // 结束的时候是没有任何监听的 用 timing 来做定时的动画
				exitExpression:"t>300",  // 当时间超过 300ms 结束动画
				props: [
					{element:swiperRef, property:'transform.translateX',expression:origin},
					{element:swiperRef, property:'transform.translateY',expression:`easeOutExpo(t,${this.distance},0,200)`},
					]
				},async (e) => {
					if(e.state === 'end' || e.state === 'exit') {
						this.distanceX = final_X
						this.scroll = false
						if( Math.abs(X)<=10&&this.distanceX==0){
							
						}else if( Math.abs(X)>10&&this.distanceX!=0) {
                            this.pause_all_videos_except(-1);
						}else if(Math.abs(X)>10&&this.distanceX==0){
                            this.play_current_video_safely(this.index);
						}
						
					}
			})
		},
		bindCurrentX(current,time=300) {
			if(this.distanceX!=0) return
			this.scroll = true
			let swiperRef = this.getEl(this.$refs.swiper)
			let changed_Y, final_Y, origin
			
			final_Y = this.distance + (this.index-current) *this.windowHeight
			changed_Y= final_Y - this.distance // 计算出需要位置的值
			time = time * Math.abs(this.index-current)
			origin = `easeOutExpo(t,${this.distance},${changed_Y},${time})` // 运动曲线为easeOutExpo
		
			
			
			let result = BindingX.bind({
				eventType:'timing', // 结束的时候是没有任何监听的 用 timing 来做定时的动画
				exitExpression:`t>${time}`, // 当时间超过 300ms 结束动画
				props: [
					{element:swiperRef, property:'transform.translateY',expression:origin},
				]
				}, (e) => {
					if(e.state === 'end' || e.state === 'exit') {
						this.distance = final_Y
						this.scroll = false
						
						this.index = -this.distance/this.windowHeight
                        this.process_swiper_change(this.index);
						//加载视频
						if(this.video_data_list.length - this.index - 1 <= this.playCount){
							this.get_last_or_next_data_list(this.video_data_list[this.video_data_list.length - 1].id, 0, 1);
						}
					}
				
			})
		}
	}
}
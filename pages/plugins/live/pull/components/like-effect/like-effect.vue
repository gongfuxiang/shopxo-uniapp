<template>
	<view class="simple-like-container flex-row box-border-box">
        <view class="flex-1 pr">
            <!-- 点赞动画元素 -->
            <view 
            	v-for="(like, index) in likeList" 
            	:key="like.id"
            	class="like-item"
            	:ref="'likeItem' + like.id"
            	:style="{
            		left: like.x + 'px',
            		top: like.y + 'px',
            		color: like.color,
            		opacity: like.opacity
            	}"
            >
				
            	<!-- 支持图片或自定义图标 -->
            	<image 
            		v-if="like.imageSrc" 
            		:src="like.imageSrc" 
            		class="like-image"
            		mode="aspectFit"
            	></image>
            	<text v-else>{{ like.icon }}</text>
            </view>
            
            <!-- 连续点赞数量提示 -->
            <text 
            	v-if="showLikeCount && likeCount >= 3" 
            	class="like-count"
            	:ref="'likeCount'"
            	:style="{
            		left: likeCountPosition.x + 'px',
            		top: likeCountPosition.y + 'px',
            		color: likeCountColor,
            		opacity: likeCountOpacity,
            		transform: 'scale(' + likeCountScale + ')'
            	}"
            >
            	x {{ likeCount }}
            </text>
        </view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	
	const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#ff5252', '#66bb6a'];
	const ICONS = [];
	
	export default {
		name: 'SimpleLikeEffect',
		props: {
			// 外部传入的自定义图标数组
			customIcons: {
				type: Array,
				default: () => []
			},
			// 外部传入的自定义图片数组
			customImages: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				likeList: [],
				// 连续点赞相关数据
				likeCount: 0,
				showLikeCount: false,
				likeCountPosition: { x: 0, y: 0 },
				likeCountColor: '#ff6b6b',
				likeCountOpacity: 1,
				likeCountScale: 1,
				lastLikeTime: 0,
				likeCountTimer: null,
				resetTimer: null, // 重置计数的定时器
				lastClickTime: 0 // 防止双击添加多个图标
			}
		},
		computed: {
			// 合并默认图标和自定义图标
			availableIcons() {
				return [...ICONS, ...this.customIcons];
			},
			// 合并默认图片和自定义图片
			availableImages() {
				return this.customImages;
			}
		},
		methods: {
			addLike(event, options = {}) {
				// 防抖处理，防止双击添加多个图标
				const now = Date.now();
				if (now - this.lastClickTime < 200) {
					return;
				}
				this.lastClickTime = now;
				
				// 获取点击坐标
				let x, y;
				// 尝试多种方式获取坐标
				if (event.touches && event.touches.length > 0) {
					x = event.touches[0].pageX;
					y = event.touches[0].pageY;
				} else if (event.changedTouches && event.changedTouches.length > 0) {
					x = event.changedTouches[0].pageX;
					y = event.changedTouches[0].pageY;
				} else {
					x = event.pageX || event.detail?.x || 0;
					y = event.pageY || event.detail?.y || 0;
				}
				
				console.log('Click coordinates:', x, y);
				
				// 添加随机偏差 (-10px 到 10px)
				const offsetX = Math.floor(Math.random() * 41) - 10;
				const offsetY = Math.floor(Math.random() * 41) - 10;
				
				// 确保图标位置不超过点击位置20px范围
				const clampedOffsetX = Math.max(-10, Math.min(10, offsetX));
				const clampedOffsetY = Math.max(-10, Math.min(10, offsetY));
				
				// 调整后的坐标
				const adjustedX = x + clampedOffsetX - 10;
				const adjustedY = y + clampedOffsetY - 10;
				
				// 随机选择图标、图片和颜色
				let icon, imageSrc, color;
				
				// 检查是否提供了外部图片
				if (this.availableImages && this.availableImages.length > 0) {
					// 随机选择图片
					imageSrc = this.availableImages[Math.floor(Math.random() * this.availableImages.length)];
				} else if (options.imageSrc) {
					// 使用传入的图片
					imageSrc = options.imageSrc;
				}
				
				// 如果没有图片，则使用图标
				if (!imageSrc) {
					if (options.icon) {
						// 使用传入的图标
						icon = options.icon;
					} else {
						// 随机选择图标
						icon = this.availableIcons[Math.floor(Math.random() * this.availableIcons.length)];
					}
				}
				
				// 随机选择颜色
				if (options.color) {
					color = options.color;
				} else {
					color = COLORS[Math.floor(Math.random() * COLORS.length)];
				}
				
				// 创建点赞元素
				const newLike = {
					id: Date.now() + Math.random(), // 使用时间戳+随机数作为ID
					x: adjustedX,
					y: adjustedY,
					color: color,
					icon: icon,
					imageSrc: imageSrc
				};
				console.log(newLike, '111');
				// 添加到列表
				this.likeList.push(newLike);
				console.log('Added like item:', newLike);
				
				// 2秒后移除
				setTimeout(() => {
					this.removeLike(newLike.id);
				}, 2000);
				
				// 处理连续点赞数量提示
				this.handleLikeCount(x, y, color);
			},
			
			removeLike(id) {
				console.log('Removing like item:', id);
				this.likeList = this.likeList.filter(item => item.id !== id);
			},
			
			// 处理连续点赞数量提示
			handleLikeCount(x, y, color) {
				const currentTime = Date.now();
				
				// 清除之前的重置定时器
				if (this.resetTimer) {
					clearTimeout(this.resetTimer);
					this.resetTimer = null;
				}
				
				// 清除之前的隐藏定时器
				if (this.likeCountTimer) {
					clearTimeout(this.likeCountTimer);
					this.likeCountTimer = null;
				}
				
				// 如果距离上次点赞超过1秒，重置计数
				if (currentTime - this.lastLikeTime > 1000) {
					this.likeCount = 1;
					this.showLikeCount = false; // 重置时隐藏数量显示
				} else {
					// 否则增加计数
					this.likeCount++;
				}
				
				// 更新最后点赞时间
				this.lastLikeTime = currentTime;
				
				// 固定位置在当前点击位置正上方25px处（避免与图标重叠）
				this.likeCountPosition = { 
					x: x,      // 水平位置与点击位置对齐
					y: y - 25  // 垂直位置在点击位置正上方25px（增加5px避免重叠）
				};
				this.likeCountColor = color;
				
				// 显示数量提示（只有当数量大于等于3时才显示）
				if (this.likeCount >= 3) {
					this.showLikeCount = true;
					this.likeCountOpacity = 1;
					this.likeCountScale = 1;
					
					// 执行动画
					this.$nextTick(() => {
						this.animateLikeCount();
					});
				}
				
				// 设置隐藏定时器（200ms后隐藏，但不重置计数）
				if (this.likeCount >= 3) {
					this.likeCountTimer = setTimeout(() => {
						this.hideLikeCount();
					}, 200);
				}
				
				// 设置重置计数的定时器（在隐藏后1秒重置）
				this.resetTimer = setTimeout(() => {
					this.likeCount = 0;
					this.showLikeCount = false;
				}, 1200);
			},
			
			// 隐藏数量提示
			hideLikeCount() {
				// #ifdef APP-NVUE
				const ref = this.$refs['likeCount'];
				if (ref) {
					const el = ref instanceof Array ? ref[0] : ref;
					if (el) {
						animation.transition(el, {
							styles: {
								opacity: 0,
								transform: 'scale(0.5) translateY(-10px)'
							},
							duration: 1000,
							timingFunction: 'ease-out'
						}, () => {
							this.showLikeCount = false;
						});
					}
				}
				// #endif
				
				// #ifndef APP-NVUE
				this.showLikeCount = false;
				// #endif
			},
			
			// 点赞项动画
			animateLikeItem(id) {
				// #ifdef APP-NVUE
				const ref = this.$refs['likeItem' + id];
				if (ref) {
					const el = ref instanceof Array ? ref[0] : ref;
					if (el) {
						// 先设置初始状态
						this.likeList = this.likeList.map(item => {
							if (item.id === id) {
								item.opacity = 0;
							}
							return item;
						});
						
						// 执行显示动画
						animation.transition(el, {
							styles: {
								opacity: 1,
								transform: 'scale(1.5) rotate(10deg)'
							},
							duration: 1000,
							timingFunction: 'ease-out'
						}, () => {
							// 动画完成后执行淡出效果
							animation.transition(el, {
								styles: {
									opacity: 0,
									transform: 'scale(1) rotate(20deg)'
								},
								duration: 1000,
								timingFunction: 'ease-out'
							});
						});
					}
				}
				// #endif
				
				// #ifndef APP-NVUE
				// 在非nvue环境中使用CSS动画
				this.likeList = this.likeList.map(item => {
					if (item.id === id) {
						item.opacity = 1;
					}
					return item;
				});
				// #endif
			},
			
			// 数量提示动画
			animateLikeCount() {
				// #ifdef APP-NVUE
				const ref = this.$refs['likeCount'];
				if (ref) {
					const el = ref instanceof Array ? ref[0] : ref;
					if (el) {
						// 先设置初始状态
						this.likeCountOpacity = 1;
						this.likeCountScale = 1;
						
						// 执行隐藏动画
						animation.transition(el, {
							styles: {
								opacity: 0,
								transform: 'scale(0.5) translateY(-10px)'
							},
							duration: 200,
							timingFunction: 'ease-out'
						});
					}
				}
				// #endif
			}
		}
	}
</script>

<style scoped>
	.simple-like-container {
		position: absolute;
		top: 0;
		left: 0;
        /* #ifndef-nvue */
		width: 100%;
		height: 100%;
		pointer-events: none;
        /* #endif */
		z-index: 9999;
	}
	
	.like-item {
		position: absolute;
		font-size: 20px;
	}
	
	.like-image {
		width: 20px;
		height: 20px;
	}
	
	.like-count {
		position: absolute;
		font-size: 16px;
		font-weight: bold;
		z-index: 10000;
	}
	
	/* #ifndef APP-NVUE */
	.like-item {
		opacity: 0;
		animation: zoomInOut 2s ease-out forwards;
	}
	
	.like-count {
		opacity: 1;
		animation: shrinkUp 1s ease-out forwards;
	}
	
	@keyframes zoomInOut {
		0% {
			opacity: 0;
			transform: scale(0) rotate(0deg);
		}
		50% {
			opacity: 1;
			transform: scale(1.5) rotate(10deg);
		}
		100% {
			opacity: 0;
			transform: scale(1) rotate(20deg);
		}
	}
	
	@keyframes shrinkUp {
		0% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(-10px) scale(0.5);
		}
	}
	/* #endif */
</style>
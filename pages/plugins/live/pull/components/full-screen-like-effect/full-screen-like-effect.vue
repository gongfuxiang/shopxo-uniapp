<template>
	<view class="simple-like-container flex-row box-sizing-border-box">
        <view class="flex-1 pr">
            <!-- 点赞动画元素 -->
            <view 
            	v-for="(like, index) in like_list" 
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
            		v-if="like.image_src" 
            		:src="like.image_src" 
            		class="like-image"
            		mode="aspectFit"
            	></image>
            	<text v-else>{{ like.icon }}</text>
            </view>
            
            <!-- 连续点赞数量提示 -->
            <text 
            	v-if="show_like_count && like_count >= 3" 
            	class="like-count"
            	ref="likeCount"
            	:style="{
            		left: like_count_position.x + 'px',
            		top: like_count_position.y + 'px',
            		color: like_count_color,
            		opacity: like_count_opacity,
            		transform: 'scale(' + like_count_scale + ')'
            	}"
            >
            	x {{ like_count }}
            </text>
        </view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = uni.requireNativePlugin('animation');
	// #endif
	
	/**
	 * 预定义的颜色数组，用于点赞动画元素的颜色随机选择
	 */
	const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#ff5252', '#66bb6a'];
	
	/**
	 * 预定义的图标数组，用于点赞动画元素的图标随机选择
	 */
	const ICONS = [];
	
	/**
	 * 点赞动画效果组件
	 * 实现类似直播中点赞的效果，包括飘心动画和连击数字提示
	 */
	export default {
		name: 'SimpleLikeEffect',
		props: {
			// 外部传入的自定义图标数组
			propCustomIcons: {
				type: Array,
				default: () => []
			},
			// 外部传入的自定义图片数组
			propCustomImages: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				/**
				 * 存储所有点赞动画元素的数组
				 */
				like_list: [],
				// 连续点赞相关数据
				/**
				 * 连续点赞计数
				 */
				like_count: 0,
				/**
				 * 是否显示点赞计数
				 */
				show_like_count: false,
				/**
				 * 点赞计数显示位置
				 */
				like_count_position: { x: 0, y: 0 },
				/**
				 * 点赞计数文字颜色
				 */
				like_count_color: '#ff6b6b',
				/**
				 * 点赞计数透明度
				 */
				like_count_opacity: 1,
				/**
				 * 点赞计数缩放比例
				 */
				like_count_scale: 1,
				/**
				 * 上次点赞的时间戳
				 */
				last_like_time: 0,
				/**
				 * 点赞计数隐藏定时器
				 */
				like_count_timer: null,
				/**
				 * 重置计数的定时器
				 */
				reset_timer: null, // 重置计数的定时器
				/**
				 * 上次点击时间，用于防抖处理
				 */
				last_click_time: 0 // 防止双击添加多个图标
			}
		},
		computed: {
			// 合并默认图标和自定义图标
			/**
			 * 可用的图标集合，合并了默认图标和外部传入的自定义图标
			 * @returns {Array} 图标数组
			 */
			available_icons() {
				return [...ICONS, ...this.propCustomIcons];
			},
			// 合并默认图片和自定义图片
			/**
			 * 可用的图片集合，来自外部传入的自定义图片
			 * @returns {Array} 图片数组
			 */
			available_images() {
				return this.propCustomImages;
			}
		},
		methods: {
			/**
			 * 添加点赞动画元素
			 * @param {Object} event - 点击事件对象，用于获取点击坐标
			 * @param {Object} options - 可选配置参数
			 * @param {String} options.image_src - 自定义图片路径
			 * @param {String} options.icon - 自定义图标字符
			 * @param {String} options.color - 自定义颜色
			 */
			add_like(event, options = {}) {
				// 防抖处理，防止双击添加多个图标
				const now = Date.now();
				if (now - this.last_click_time < 200) {
					return;
				}
				this.last_click_time = now;
				
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
				
				// 添加随机偏差 (-5px 到 5px)
				const offset_x = Math.floor(Math.random() * 41) - 5;
				const offset_y = Math.floor(Math.random() * 41) - 5;
				
				// 确保图标位置不超过点击位置10px范围
				const clamped_offset_x = Math.max(-5, Math.min(5, offset_x));
				const clamped_offset_y = Math.max(-5, Math.min(5, offset_y));
				
				// 调整后的坐标
				const adjusted_x = x + clamped_offset_x - 5;
				const adjusted_y = y + clamped_offset_y - 30;
				
				// 随机选择图标、图片和颜色
				let icon, image_src, color;
				
				// 检查是否提供了外部图片
				if (this.available_images && this.available_images.length > 0) {
					// 随机选择图片
					image_src = this.available_images[Math.floor(Math.random() * this.available_images.length)];
				} else if (options.image_src) {
					// 使用传入的图片
					image_src = options.image_src;
				}
				
				// 如果没有图片，则使用图标
				if (!image_src) {
					if (options.icon) {
						// 使用传入的图标
						icon = options.icon;
					} else {
						// 随机选择图标
						icon = this.available_icons[Math.floor(Math.random() * this.available_icons.length)];
					}
				}
				
				// 随机选择颜色
				if (options.color) {
					color = options.color;
				} else {
					color = COLORS[Math.floor(Math.random() * COLORS.length)];
				}
				
				// 创建点赞元素
				const new_like = {
					id: Date.now() + Math.random(), // 使用时间戳+随机数作为ID
					x: adjusted_x,
					y: adjusted_y,
					color: color,
					icon: icon,
					image_src: image_src,
					opacity: 0 // 显式初始化 opacity
				};
				// 添加到列表
				this.like_list.push(new_like);
				// #ifdef APP-NVUE
				// 执行点赞动画
                setTimeout(() => {
                    this.animate_like_item(new_like.id);
                }, 0);
				// #endif	
				// 2秒后移除
				setTimeout(() => {
					this.remove_like(new_like.id);
				}, 2000);
				
				// 处理连续点赞数量提示
				this.handle_like_count(x, y, color);
			},
			
			/**
			 * 移除指定的点赞元素
			 * @param {Number|String} id - 要移除的点赞元素ID
			 */
			remove_like(id) {
				this.like_list = this.like_list.filter(item => item.id !== id);
			},
			
			/**
			 * 处理连续点赞数量提示
			 * 当用户连续点赞时显示连击数
			 * @param {Number} x - 点击位置的x坐标
			 * @param {Number} y - 点击位置的y坐标
			 * @param {String} color - 数字提示颜色
			 */
			handle_like_count(x, y, color) {
				const current_time = Date.now();
				
				// 清除之前的重置定时器
				if (this.reset_timer) {
					clearTimeout(this.reset_timer);
					this.reset_timer = null;
				}
				
				// 清除之前的隐藏定时器
				if (this.like_count_timer) {
					clearTimeout(this.like_count_timer);
					this.like_count_timer = null;
				}
				
				// 如果距离上次点赞超过1秒，重置计数
				if (current_time - this.last_like_time > 1000) {
					this.like_count = 0;
					this.show_like_count = false; // 重置时隐藏数量显示
				} else {
					// 否则增加计数
					this.like_count++;
				}
				
				// 更新最后点赞时间
				this.last_like_time = current_time;
				
				// 固定位置在当前点击位置正上方60px处（避免与图标重叠）
				this.like_count_position = { 
					x: x - 20,      // 水平位置与点击位置对齐
					y: y - 60  // 垂直位置在点击位置正上方60px
				};
				this.like_count_color = color;
				
				// 显示数量提示（只有当数量大于等于3时才显示）
				if (this.like_count >= 3) {
					this.show_like_count = true;
					this.like_count_opacity = 1;
					this.like_count_scale = 1;
					
					// 执行动画
					setTimeout(() => {
						this.animate_like_count();
					}, 0)
				}
				
				// 设置隐藏定时器（200ms后隐藏，但不重置计数）
				if (this.like_count >= 3) {
					this.like_count_timer = setTimeout(() => {
						this.hide_like_count();
					}, 200);
				}
				
				// 设置重置计数的定时器（在隐藏后1秒重置）
				this.reset_timer = setTimeout(() => {
					this.like_count = 0;
					this.show_like_count = false;
				}, 1200);
			},
			
			/**
			 * 隐藏点赞数量提示
			 */
			hide_like_count() {
				// #ifdef APP-NVUE
				const ref = this.$refs['likeCount'];
				if (ref) {
					const el = this.is_array(ref) ? ref[0] : ref;
					if (el) {
						animation.transition(el, {
							styles: {
								opacity: 0,
								transform: 'scale(0.5) translateY(-10px)'
							},
							duration: 500,
							timingFunction: 'ease-out'
						}, () => {
							this.show_like_count = false;
						});
					}
				}
				// #endif
				
				// #ifndef APP-NVUE
				this.show_like_count = false;
				// #endif
			},
			
			/**
			 * 执行单个点赞元素的动画效果
			 * @param {Number|String} id - 点赞元素ID
			 */
			animate_like_item(id) {
				// #ifdef APP-NVUE
				const ref = this.$refs['likeItem' + id];
				if (ref) {
					const el = this.is_array(ref) ? ref[0] : ref;
					if (el) {
						// 先设置初始状态
						this.like_list = this.like_list.map(item => {
							if (item.id === id) {
								item.opacity = 0;
							}
							return item;
						});
						
						// 执行显示动画
						animation.transition(el, {
							styles: {
								opacity: 1,
								transform: 'scale(2) rotate(10deg)'
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
				this.like_list = this.like_list.map(item => {
					if (item.id === id) {
						item.opacity = 1;
					}
					return item;
				});
				// #endif
			},
			
			/**
			 * 执行点赞数量提示的动画效果
			 */
			animate_like_count() {
				// #ifdef APP-NVUE
				const ref = this.$refs['likeCount'];
				if (ref) {
					const el = this.is_array(ref) ? ref[0] : ref;
					if (el) {
						// 先设置初始状态
						this.like_count_opacity = 1;
						this.like_count_scale = 1;
						
						// 执行隐藏动画
						animation.transition(el, {
							styles: {
								opacity: 0,
								transform: 'scale(1) translateY(-10px)'
							},
							duration: 500,
							timingFunction: 'ease-out'
						});
					}
				}
				// #endif
			},
			/**
			 * 更加健壮的数组检查方法
			 * @param {*} data - 待检测的数据
			 * @returns {Boolean} 是否为数组
			 */
			// 更加健壮的数组检查方法
			is_array(data) {
				return Array.isArray(data) || data instanceof Array || (data && typeof data === 'object' && data.length !== undefined);
			}
		}
	}
</script>

<style scoped>
	.simple-like-container {
		position: absolute;
		top: 0;
		left: 0;
        /* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		pointer-events: none;
        /* #endif */
		z-index: 9999;
	}
	
	.like-item {
		position: absolute;
		font-size: 40rpx;
	}
	
	.like-image {
		width: 40rpx;
		height: 40rpx;
	}
	
	.like-count {
		position: absolute;
		font-size: 32rpx;
		font-weight: bold;
		z-index: 10000;
		text-wrap: nowrap;
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
			transform: scale(2) rotate(10deg);
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
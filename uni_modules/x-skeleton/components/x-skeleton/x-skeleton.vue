<template>
	<view class="x-skeleton" :style="variableStr">
		<!-- 骨架屏 -->
		<view 
			v-if="skeletonLoading"
			class="x-skeleton__wrapper"
			:class="[ startFadeOut && 'fade-out' ]"
			:style="{ padding: skeletonConfigs.padding }"
		>
			<view
				v-for="(row, rowIndex) in gridRowsArr" :key="rowIndex"
				class="x-skeleton__wrapper__rows" 
				:style="{ marginBottom: rowIndex < gridRowsArr.length - 1 ? skeletonConfigs.gridRowsGap : 0 }"
			>
				<view
					v-for="(column, columnIndex) in gridColumnsArr" :key="columnIndex"
					class="x-skeleton__wrapper__columns" 
					:style="{ 
						flexDirection: skeletonConfigs.itemDirection, 
						alignItems: skeletonConfigs.itemAlign,
						marginRight: columnIndex < gridColumnsArr.length - 1 ? skeletonConfigs.gridColumnsGap : 0,
					}"
				>
					<view 
						v-if="skeletonConfigs.headShow"
						class="x-skeleton__wrapper__head" 
						:class="[ propAnimate && 'animate' ]"
						:style="{
							width: skeletonConfigs.headWidth, 
							height: skeletonConfigs.headHeight, 
							borderRadius: skeletonConfigs.headBorderRadius,
							marginRight: (skeletonConfigs.itemDirection == 'row' && skeletonConfigs.textShow) ? skeletonConfigs.itemGap : 0,
							marginBottom: (skeletonConfigs.itemDirection == 'column' && skeletonConfigs.textShow) ? skeletonConfigs.itemGap : 0
						}"
					></view>
					<view v-if="skeletonConfigs.textShow" class="x-skeleton__wrapper__text">
						<view
							v-for="(text, textIndex) in textRowsArr" :key="textIndex"
							class="x-skeleton__wrapper__text__row" 
							:class="[propAnimate && 'animate']"
							:style="{
								width: text.width, 
								height: text.height, 
								borderRadius: skeletonConfigs.textBorderRadius,
								marginBottom: textIndex < textRowsArr.length - 1 ? skeletonConfigs.textRowsGap : 0
							}"
						></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 插槽 -->
		<view v-else>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import XSkeletonConfigs from './x-skeleton-configs.js'
	export default {
		name: "x-skeleton",
		mixins: [ XSkeletonConfigs ],
		props: {
			// 骨架屏类型
			propType: {
				type: String,
				default: '' //banner轮播图、info个人信息、text段落、menu菜单、list列表、waterfall瀑布流
			},
			// 是否展示骨架组件
			propLoading: {
			    type: Boolean,
			    default: true
			},
			// 是否开启动画效果
			propAnimate: {
			    type: Boolean,
			    default: true
			},
			// 动画效果持续时间，单位秒
			propAnimateTime: {
				type: Number || String,
				default: 1.8
			},
			// 是否开启淡出动画
			propFadeOut: {
				type: Boolean,
				default: true
			},
			// 淡出效果持续时间，单位秒
			propFadeOutTime: {
				type: Number || String,
				default: 0.5
			},
			// 骨架的背景色
			propBgColor: {
				type: String,
				default: '#EAEDF5'
			},
			// 骨架的动画高亮背景色
			propHighlightBgColor: {
				type: String,
				default: '#F9FAFF'
			},
            // 指定n内容高度
            propHeightNumber: {
                type: Number || String,
                default: 300
            },
            // 指定菜单栏行数
            propRowNumber: {
                type: Number || String,
                default: 2
            },
			// 自定义配置
			propConfig: {
				type: Object,
				default: () => {
					return {
						// padding: '30rpx',		   				  //内边距
						// gridRows: 3, 			 	   			  //行数
						// gridColumns: 2,	  		  	   			  //列数
						// gridRowsGap: '40rpx',		   			  //行间隔
						// gridColumnsGap: '24rpx',	   			  	  //竖间距
						// itemDirection: 'column',   				  //head与text之间的排列方向（row、column）
						// itemGap: '16rpx', 				  		  //head与text之间的间隔
						// itemAlign: 'center',  	   				  //head与text之间的纵轴对齐方式（center、flex-start、flex-end、baseline）
						// headShow: true,		 	   				  //head是否展示
						// headWidth: '100%',	  	   				  //head宽度，支持百分比
						// headHeight: '400rpx',	   				  //head高度
						// headBorderRadius: '12rpx', 				  //head圆角，支持百分比
						// textShow: true,		   				      //文本是否展示
						// textRows: 3,		 	   				  	  //文本的行数
						// textRowsGap: '12rpx',		   			  //文本间距
						// textWidth: ['40%', '85%', '60%'], 		  //文本的宽度，可以为百分比，数值，带单位字符串等，可通过数组传入指定每个段落行的宽度
						// textHeight: ['30rpx', '20rpx', '20rpx'],   //文本的高度，可以为数值，带单位字符串等，可通过数组传入指定每个段落行的高度
						// textBorderRadius: '6rpx',  			      //文本的圆角，支持百分比
					}
				}
			}
		},

		computed: {
			gridRowsArr() {
				return new Array(Number(this.skeletonConfigs?.gridRows || []));
			},
			gridColumnsArr() {
				return new Array(Number(this.skeletonConfigs?.gridColumns || []));
			},
			textRowsArr() {
				if (!this.skeletonConfigs?.textShow) return [];
				if (/%$/.test(this.skeletonConfigs.textHeight)) {
					console.error('x-skeleton: textHeight参数不支持百分比单位');
				}
				const rows = []
				for (let i = 0; i < this.skeletonConfigs.textRows; i++) {
					const { gridRows, textWidth, textHeight } = this.skeletonConfigs;
					let item = {},
						// 需要预防超出数组边界的情况
						rowWidth = this.isArray(textWidth) ? (textWidth[i] || (i === gridRows - 1 ? '70%' : '100%')) : i === gridRows - 1 ? '100%' : textWidth,
						rowHeight = this.isArray(textHeight) ? (textHeight[i] || '30rpx') : textHeight
					// 非百分比的宽度时，调整像素单位
					if (/%$/.test(rowWidth)) {
						item.width = rowWidth;
					} else {
						item.width = this.addUnit(rowWidth)
					}
					item.height = this.addUnit(rowHeight)
					rows.push(item)
				}
				return rows
			},
			variableStr() {
				let keys = ['propAnimateTime', 'propFadeOutTime', 'propBgColor', 'propHighlightBgColor'];
				let str = keys.map(item => {
					if (item.indexOf('Time') > -1) {
						return `--${item}:${this[item]}s`
					} else {
						return `--${item}:${this[item]}`
					}
				}).join(";");
				return str;
			}
		},

		watch: {
			propLoading: {
				immediate: true, 
				handler(value) {
					if (value) {
						this.skeletonLoading = true;
					} else {
						if (this.propFadeOut) {
							this.startFadeOut = true;
							setTimeout(() => {
								this.skeletonLoading = false;
								this.startFadeOut = false;
							}, this.propFadeOutTime * 1000);
						} else {
							this.skeletonLoading = false;
						}
					}
				}
			},
			propType: {
				immediate: true,
				handler(value) {
					if (value === 'banner') {
						this.skeletonConfigs = this.bannerConfigs(this.propHeightNumber+'rpx');
					} else if (value === 'info') {
						this.skeletonConfigs = this.infoConfigs();
					} else if (value === 'text') {
						this.skeletonConfigs = this.textConfigs();
					} else if (value === 'menu') {
						this.skeletonConfigs = this.menuConfigs(this.propRowNumber);
					} else if (value === 'list') {
						this.skeletonConfigs = this.listConfigs(this.propRowNumber);
					} else if (value === 'waterfall') {
						this.skeletonConfigs = this.waterfallConfigs(this.propRowNumber);
					} else {
						this.skeletonConfigs = this.propConfig || {};
					}
				}
			}
		},

		data() {
			return {
				skeletonConfigs: this.propConfig || {},
				skeletonLoading: this.propLoading,
				startFadeOut: false,
				width: 0
			};
		},
		
		mounted() {

		},
		
		methods: {
			/**
			 * @description 是否为数组
			 * @param {object} value 需要判断的对象
			 */
			isArray(value) {
			    if (typeof Array.isArray === 'function') {
			        return Array.isArray(value)
			    }
			    return Object.prototype.toString.call(value) === '[object Array]'
			},
			
			/**
			 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
			 * @param {string|number} value 需要添加单位的值
			 * @param {string} unit 添加的单位名 比如px
			 */
			addUnit(value = 'auto', unit = 'px') {
				value = String(value);
				// 用uView内置验证规则中的number判断是否为数值
				return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value) ? `${value}${unit}` : value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin background {
		background: linear-gradient(90deg, var(--propBgColor) 25%, var(--propHighlightBgColor) 37%, var(--propBgColor) 50%);
		background-size: 400% 100%;
	}
	
	.x-skeleton {
		width: 100%;
		box-sizing: border-box;

		.x-skeleton__wrapper {
			display: flex;
			flex-direction: column;

			&__rows {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			&__columns {
				display: flex;
				align-items: center;
				flex: 1;
			}

			&__head {
				width: 100%;
				@include background;
			}
			
			&__text {
				flex: 1;
				width: 100%;
				&__row {
					@include background;
				}
			}
		}
		
		.fade-out {
			opacity: 0;
			animation: propFadeOutAnim var(--propFadeOutTime);
		}
		
		@keyframes propFadeOutAnim {
			from {
				opacity: 1;
			}
			to {
				opacity: 0;
			}
		}
		
		.animate {
			animation: skeletonAnim var(--propAnimateTime) ease infinite;
		}
		
		@keyframes skeletonAnim {
			0% {
				background-position: 100% 50%;
			}
		
			100% {
				background-position: 0 50%;
			}
		}
	}
</style>
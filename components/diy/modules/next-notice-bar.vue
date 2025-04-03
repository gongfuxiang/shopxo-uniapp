<template>
	<view :class="'next-notice-bar-component-' + propKey">
		<view class="next-notice-bar" v-for="(list, index) in showList" :key="index">
			<view :class="'next-notice-bar-content-' + propKey" :style="{ transform: (y ? 'translateY' : 'translateX') + '(' + xArr[index] + 'px)', display: y ? 'block' : 'inline-block', 'white-space': y ? 'normal' : 'nowrap'}">
				<view class="next-notice-bar-list" :style="{ display: y ? 'block' : 'inline-block'}">
					<view class="next-notice-bar-item" :style="{ display: y ? 'block' : 'inline-block' }" v-for="(new_item, index1) in list" :key="index1">
						<slot :row="new_item"></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			propList: {
				// 总数据，一维
				type: Array,
				default: () => []
			},
			row: {
				// 行数
				type: Number,
				default: 1
			},
			speed: {
				// 速度
				type: Number,
				default: 30
			},
			delay: {
				// 延时
				type: Number,
				default: 0
			},
			y: {
				// y轴
				type: Boolean,
				default: false
			},
			propKey: {
				type: [String, Number],
                default: '',
			},
			initPosition: {
				// 开始位置，left/right
				type: String,
				default: 'left',
				validator: (value) => {
					const arr = ['left', 'right', 'top', 'bottom'];
					const check = arr.includes(value);
					if (!check) {
						console.error(`initPosition props  optional parameters : ${arr}. error value: ` + value);
					}
					return check;
				}
			}
		},
		data() {
			return {
				componentWidth: 0,
				contentWidthArr: [],
				xArr: [],
			};
		},
		computed: {
			showList() {
				// 多维数组
				if (this.y) {
					this.xArr = [2000];
					return [this.propList, this.propList];
				} else {
					this.xArr = Array.from({
						length: this.row
					}).map((_) => 2000);
					const l = Array.from({
						length: this.row
					}).map((_, index) => {
						const arr = [];
						this.propList.forEach((item, i) => {
							if (i % this.row === index) {
								arr.push(item);
							}
						});
						return arr;
					});
					return l;
				}
			}
		},
		watch: {
			showList: {
				deep: true,
				immediate: true,
				handler() {
					this.$nextTick(() => {
						let tt = setTimeout(() => {
							clearTimeout(tt);
							tt = null;
							let query = uni.createSelectorQuery().in(this);
							query.select('.next-notice-bar-component-' + this.propKey).boundingClientRect((data) => {
								this.componentWidth = Math.floor(this.y ? data.height : data.width);
							});
							query
								.selectAll('.next-notice-bar-content-' + this.propKey)
								.boundingClientRect((data) => {
									this.contentWidthArr = data.map((item) => Math.floor(this.y ? item.height : item.width));

									this.xArr = this.contentWidthArr.map((_, index) => {
										return ['left', 'top'].includes(this.initPosition) ? 0 : this.componentWidth;
									});
								})
								.exec();
							let t = setTimeout(
								() => {
									clearTimeout(t);
									t = null;
									this.scrollContent();
								},
								this.delay < 0 ? 0 : this.delay
							);
						}, 1);
					});
				}
			}
		},
		methods: {
			scrollContent() {
				this.xArr.forEach((num, index) => {
					let n = num;
					if (n <= -(this.contentWidthArr[index] / 2)) {
						n = 0;
					} else {
						n = num - 1;
					}

					this.xArr.splice(index, 1, n);
				});
				let t = setTimeout(() => {
					clearTimeout(t);
					t = null;
					this.scrollContent();
				}, this.speed);
			}
		}
	};
</script>

<style scoped>
	.next-notice-bar-component {
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	.next-notice-bar {
		width: 100%;
		overflow: hidden;
	}

	.next-notice-bar-content,
	.next-notice-bar-list,
	.next-notice-bar-item {
		white-space: nowrap;
		display: inline-block;
	}

	.next-notice-bar-content {
		min-width: 200%;
	}

	.next-notice-bar-list {
		min-width: 50%;
	}
</style>
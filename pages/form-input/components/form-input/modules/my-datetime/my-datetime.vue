<template>
	<view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" :animation="true" @maskClick="maskClick">
			<view class="popup-content">
				<view >
				  <view class="headBox padding-main">
						<view @tap="close"><text class="text-size-sm">取消</text></view>
						<!-- <view class="uni-page-head-title" v-if="titleShow">{{timeTitle}}</view> -->
						<view><text class="text-size-sm cr-blue" @tap="submit_event">确定</text></view>
					</view>
					<picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange">
						<picker-view-column v-for="(arr, n) in dateTimeArr" :key="n">
							<view class="item flex-row align-c jc-c" v-for="(obj, index) in arr" :key="index">{{obj}}{{ dataType == 'date' ? dateUnitArr[n] || '' : timeUnitArr[n] || '' }}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: 'MyDatetime',
		props: {
			titleShow: {
				type: Boolean,
				default: true
			},
			timestr: {
				// 是否展开
				type: String,
				default: ''
			},
			dataType: {
				type: String,
				default: 'date'
			},
			// 显示位数
			shownum: {
				type: [String, Number],
				default: 3
			}
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1970, len = date.getFullYear() + 100; i <= len; i++) {
					years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
					months.push(i < 10 ? ('0'+ i.toString()) : i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i < 10 ? ('0'+ i.toString()) : i)
			}
			const hourArr = []
			for (let i = 0; i < 24; i++) {
				hourArr.push(i < 10 ? ('0'+ i.toString()) : i)
			}
			// 分、秒
			const minSecond = []
			for (let i = 0; i <= 59; i++) {
				minSecond.push(i < 10 ? ('0'+ i.toString()) : i)
			}
			return {
				thirtyOne: days,
				dateArr: [years, months, days ],
				timeArr: [hourArr, minSecond, minSecond ],
				dateUnitArr: [ '年', '月', '日', '时', '分', '秒'],
				timeUnitArr: [ '时', '分', '秒'],
				obj: { 0: 'year', 1: 'month', 2: 'day', 3: 'hour', 4: 'minute', 5: 'second' },
				years,
				months,
				days,
				hourArr,
				minArr: minSecond,
				secondArr: minSecond,
				year,
				month,
				day,
				hour: '00',
				minute: '00',
				second: '00',
				value: [ year - 1970, month - 1, day - 1],
				visible: true,
				indicatorStyle: `height: 100rpx;`,
				timer: null
			}
		},
		computed: {
			// 时间对象
			dateTimeArr () {
				var num = parseInt(this.shownum) || 3
				if (num <= 3 && num > 0) {
					if (this.dataType == 'date') {
						return this.dateArr.slice(0, num)
					} else {
						return this.timeArr.slice(0, num)
					}
				}
				return this.dateArr
			},
		},
		watch: {
			// 月份
			month () {
				this.countDay()
			},
			year () {
				this.countDay()
			}
		},
		created() {
			this.countDay();
		},
		destroyed() {
			this.timer && clearTimeout(this.timer)
		},
		methods: {
			// 计算天数
			countDay () {
				var index = new Date(this.year, parseInt(this.month), 0).getDate()
				var days = this.thirtyOne.slice(0, index)
				this.dateArr.splice(2, 1, days)
				this.days = days
			},
			// 时间回填 timeStr: 2020-01-01 00:00:00
			timeFill (timeStr) {
				// 获取当前时间
				let dateObj = new Date();
				// 判断传递过来的时间是否为空
				if (timeStr) {
					const time = this.dataType == 'date' ? timeStr : '1970-01-01 ' + timeStr.replace(/时|分|秒/g, ':').replace(/:+$/, ''); // 去除末尾多余的冒号;
					dateObj = new Date(time.replace(/-/g,'/').replace(/年|月|日/g, '/').replace(/\/+$/, ''));
				}
				const timeObj = {
					year: dateObj.getFullYear(),
					month: dateObj.getMonth() + 1,
					day: dateObj.getDate(),
					h: dateObj.getHours(),
					m: dateObj.getMinutes(),
					s: dateObj.getSeconds()
				}
				this.timer = setTimeout(() => {
					if (this.dataType == 'date') {
						this.value = [ (timeObj.year - 1970) || 0, timeObj.month - 1, timeObj.day - 1]
						this.year = this.years[this.value[0]]
						this.month = this.months[this.value[1]]
						this.day = this.days[this.value[2]]
					} else {
						this.value = [ timeObj.h, timeObj.m, timeObj.s ]
						this.hour = this.hourArr[this.value[0]]
						this.minute = this.minArr[this.value[1]]
						this.second = this.secondArr[this.value[2]]
					}
				}, 100)
			},
			// 确认
			submit_event() {
				var num = parseInt(this.shownum) || 3
				if (num <= 0 || num > 3) {
					num = 3
				}
				let date = '';
				if (this.dataType == 'date') {
					if (num == 1) {
						date = this.year;
					} else if (num == 2) {
						date = this.year + '/' + this.month;
					} else if (num == 3) {
						date = this.year + '/' + this.month + '/' + this.day;
					}
				} else {
					if (num == 1) {
						date = this.hour;
					} else if (num == 2) {
						date = this.hour + ':' + this.minute;
					} else if (num == 3) {
						date = this.hour + ':' + this.minute + ':' + this.second;
					}
				}
				this.$emit('timeSubmit', date)
				this.close()
			},
			// 弹窗
			open (timeStr) {
				this.$nextTick(res => {
					this.timeFill(timeStr || this.timestr || '')
					this.$refs.popup.open()
				})
			},
			/**
			 * 关闭窗口
			 */
			close () {
				// 执行父组件的close事件，关闭弹出层
				this.$refs.popup.close()
			},
			bindChange(e) {
				const val = e.detail.value
				if (this.dataType == 'date') {
					this.year = this.years[val[0]]
					this.month = this.months[val[1]]
					this.day = this.days[val[2]];
				} else {
					this.hour = this.hourArr[val[0] || 0]
					this.minute = this.minArr[val[1] || 0]
					this.second = this.secondArr[val[2] || 0]
				}
			},
			maskClick() {
				this.$emit('maskClick')
			}
		}
	}
</script>

<style scoped>
	.popup-content{
		background-color: #FFFFFF;
	}
	.uni-page-head-title {
		display: inline-block;
		padding: 0 20rpx;
		font-size: 26rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #BEBEBE;
		box-sizing: border-box;
	}
	.headBox{
		display: flex;
		justify-content: space-between;
	}
	picker-view {
		width: 100%;
		height: 600rpx;
		margin-top:20rpx;
	}
	.item {
	   	/* line-height: 100rpx; */
		height: 100rpx;
	  	text-align: center;
		font-size: 30rpx;
	}
</style>

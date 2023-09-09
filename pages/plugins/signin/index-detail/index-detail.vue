<template>
	<view class="signin-container">
		<view v-if="(data || null) != null">
			<image :src="signin_static_url+'signin-bg.png'" mode="widthFix" class="signin-bg"></image>
			<view class="signin-opration-group pa right-0 flex-col cr-white">
				<view class="share oh flex-row">
					<view class="content">
						<iconfont name="icon-pp-all"></iconfont>
						分享
					</view>
				</view>
				<view class="team oh flex-row">
					<view class="content">
						<iconfont name="icon-pp-all"></iconfont>
						组队
					</view>
				</view>
			</view>
			<view class="signin-btn pa left-0 right-0 tc">
				<view class="content cr-white" @tap="coming_event">
					立即签到
				</view>
			</view>

			<view class="padding-horizontal-main">
				<view class="signin-calendar">
					<view class="calendar-title flex-row align-c jc-sb">
						<view class="title-left fw-b text-size">
							{{calendar}}
						</view>
						<view class="title-right text-size-md">
							<iconfont name="icon-pp-all margin-right-sm"></iconfont>
							我的签到
						</view>
					</view>
					<view class="calendar-week flex-row align-c jc-sa padding-horizontal-main">
						<view v-for="(item,index) in week" :key="index">
							{{item}}
						</view>
					</view>
					<view class="calendar-days padding-horizontal-main bg-white">
						<view class="item flex-row jc-sa align-c" v-for="(row,rowIndex) in day_count" :key="rowIndex">
							<view v-for="(col,colIndex) in row" class="list tc" :class="col.class" :key="colIndex">
								<block v-if="col.is_signin">
									<iconfont name="icon-pp-all margin-right-sm"></iconfont>
								</block>
								<block v-else>
									<block v-if="col.today">
										<block v-if="user_signin_data.current_day===1">

										</block>
										<block v-else>
											<text class="fw-b">今天</text>
										</block>
									</block>
									<block v-else>
										{{col.num}}
									</block>
								</block>
							</view>
						</view>
					</view>
				</view>








				<!-- 签到 -->
				<view class="coming-container tc pr border-radius-main spacing-mb">
					<navigator v-if="(data_base.is_user_menu || 0) == 1" class="signin-user-menu-submit round pa" url="/pages/plugins/signin/user-signin/user-signin" hover-class="none">我的签到
					</navigator>
					<view :class="'coming-submit circle auto ' + ((is_already_coming == 1) ? 'already-coming' : '')" @tap="coming_event">签到</view>
					<block v-if="(user || null) == null">
						<view class="cr-white margin-top-lg">登录签到获得积分奖励</view>
					</block>
					<block v-else>
						<!-- 是否已签到 -->
						<block v-if="(user_signin_data || null) != null && (user_signin_data.integral || 0) > 0">
							<view class="cr-white margin-top-lg">今日已签到，获得{{user_signin_data.integral}}积分，共{{user_signin_data.total}}次</view>
							<view class="coming-tips-msg margin-top-xs">请明日继续签到，更多积分奖励</view>
						</block>
						<block v-else>
							<view class="cr-white margin-top-lg am-margin-top-sm">立即签到获得积分奖励</view>
						</block>

						<!-- 队长 -->
						<block v-if="(team_signin_data || null) != null && user.id == data.user_id">
							<view class="cr-white margin-top-lg">
								<text>今日{{team_signin_data.day}}人签到，共{{team_signin_data.total}}人</text>
								<navigator class="cr-blue dis-inline margin-left-sm" v-if="(data_base.is_team_show_coming_user || 0) == 1"
									:url="'/pages/plugins/signin/user-coming-list/user-coming-list?id=' + data.id" hover-class="none">详情 >></navigator>
							</view>
							<view class="coming-tips-msg margin-top-xs">分享获得更多奖励</view>
						</block>
					</block>

					<!-- 按钮组 -->
					<view class="submit-container pa">
						<button v-if="(data_base.is_team || 0) == 1 && (user || null) != null && data.user_id != user.id" class="team-submit round" type="default" size="mini"
							@tap="team_event">组队</button>
						<button v-if="(data_base.is_share || 0) == 1" class="share-submit round" type="default" size="mini" open-type="share">分享</button>
					</view>
				</view>

				<!-- 公告信息 -->
				<view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="spacing-mb">
					<view class="notice-content">
						<view v-for="(item, index) in data_base.signin_desc" :key="index" class="item">{{item}}</view>
					</view>
				</view>
			</view>

			<!-- 签到成功提示信息 -->
			<view v-if="is_success_tips == 1" class="coming-tips-container am-text-center">
				<view class="coming-content tc pr">
					<view class="icon-close-submit pa" @tap="coming_success_close_event">
						<uni-icons type="clear" size="46rpx" color="#999"></uni-icons>
					</view>
					<image :src="data.success_icon" mode="widthFix"></image>
					<view class="coming-tips-content pa">
						<text class="cr-red text-size-lg">获得 <text>{{coming_integral}}</text> 积分</text>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<!-- 提示信息 -->
			<component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	import componentNoData from "../../../../components/no-data/no-data";
	var signin_static_url = app.globalData.get_static_url("signin/app", true);
	export default {
		data() {
			return {
				signin_static_url: signin_static_url,
				data_bottom_line_status: false,
				data_list_loding_status: 1,
				data_list_loding_msg: '',
				currency_symbol: app.globalData.data.currency_symbol,
				params: null,
				user: null,
				data_base: null,
				data: null,
				team_signin_data: null,
				user_signin_data: null,
				is_already_coming: 0,
				is_success_tips: 0,
				coming_integral: 0,
				// 自定义分享信息
				share_info: {},
				// 周数
				week: ['日', '一', '二', '三', '四', '五', '六'],
				// 年
				year: new Date().getFullYear(),
				// 月
				month: new Date().getMonth() + 1,
				// 日
				date: new Date().getDate(),
				// 日期
				calendar: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日',
				// 本月日历总天数
				day_count: [],
			};
		},

		components: {
			componentNoData,
		},
		props: {},
		computed: {
			days_in_month() {
				const date = new Date(this.year, this.month, 0)
				return date.getDate()
			}
		},

		onLoad(params) {
			//params['id'] = 1;
			this.setData({
				params: params,
				user: app.globalData.get_user_cache_info()
			});
		},

		onShow() {
			// 获取数据
			this.get_data();
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.get_data();
		},
		methods: {
			// 获取日历数据
			get_calendar() {
				const first_day = new Date(this.year, this.month - 1, 1).getDay();
				const last_day = this.days_in_month;
				const days = [];
				let day = [];
				// 上月计数
				const first_day_week = new Date().getDay();
				var defore_days = new Date(this.year, this.month, 0).getDate(); //上月天数
				for (var i = first_day_week - 1; i >= 0; i--) {
					// 上个月计数
					day.push({
						num: defore_days - i,
						class: 'cr-grey-c',
						today: false,
						is_signin: false
					});
				}
				// 本月计数
				for (let i = 1; i <= last_day; i++) {
					// 判断i是否存在数组signinHistory中    【 true则表示存在于数组中】
					var index = this.user_signin_data.history_day.some(item => item === i);
					// 获取当天日期
					var today = new Date().getDate();
					// 判断当天是否签到
					var today_index = this.user_signin_data.history_day.some(item => item === today);
					day.push({
						num: i,
						class: today_index ? 'cr-red' : 'cr-black',
						today: i === today ? true : false,
						is_signin: index ? true : false
					});
					if (day.length === 7) {
						days.push(day);
						day = [];
					}
				}
				// 本月计数
				if (day.length > 0) {
					for (let i = day.length; i < 7; i++) {
						day.push({
							num: i,
							class: 'cr-grey-c',
							today: false,
							is_signin: false
						});
					}
					days.push(day);
				}
				console.log("days: " + JSON.stringify(days));
				this.day_count = days;
			},
			// 点击日期
			handle_day() {

			},
			// 获取数据
			get_data() {
				uni.request({
					url: app.globalData.get_request_url("detail", "index", "signin"),
					method: 'POST',
					data: {
						id: this.params.id || 0
					},
					dataType: 'json',
					success: res => {
						uni.stopPullDownRefresh();
						if (res.data.code == 0) {
							var data = res.data.data;
							this.setData({
								data_base: data.base || null,
								data: data.data || null,
								team_signin_data: data.team_signin_data || null,
								user_signin_data: data.user_signin_data || null,
								is_already_coming: (data.user_signin_data || null) != null && (data.user_signin_data.current_day || 0) == 1 ? 1 : 0,
								data_list_loding_msg: '',
								data_list_loding_status: 0,
								data_bottom_line_status: true
							});

							if ((this.data || null) != null) {
								// 基础自定义分享
								this.setData({
									share_info: {
										title: this.data.seo_title || '签到',
										desc: this.data.seo_desc,
										path: '/pages/plugins/signin/index-detail/index-detail',
										query: 'id=' + this.data.id,
										img: this.data.bg_images || this.data.logo || ''
									}
								});
							}
						} else {
							this.setData({
								data_bottom_line_status: false,
								data_list_loding_status: 2,
								data_list_loding_msg: res.data.msg
							});
						}
						// 分享菜单处理
						app.globalData.page_share_handle(this.share_info);
						// 日历渲染
						this.get_calendar();
					},
					fail: () => {
						uni.stopPullDownRefresh();
						this.setData({
							data_bottom_line_status: false,
							data_list_loding_status: 2,
							data_list_loding_msg: '服务器请求出错'
						});
						app.globalData.showToast('服务器请求出错');
					}
				});
			},

			// 初始化
			init() {
				var user = app.globalData.get_user_info(this, "init");
				if (user != false) {
					// 用户未绑定用户则转到登录页面
					if (app.globalData.user_is_need_login(user)) {
						uni.showModal({
							title: '温馨提示',
							content: '绑定手机号码',
							confirmText: '确认',
							cancelText: '暂不',
							success: result => {
								uni.stopPullDownRefresh();
								if (result.confirm) {
									uni.navigateTo({
										url: "/pages/login/login?event_callback=init"
									});
								}
							}
						});
					} else {
						return true;
					}
				}
				return false;
			},

			// 签到
			coming_event(e) {
				if (!app.globalData.is_single_page_check()) {
					return false;
				}
				if (this.is_already_coming != 1 && this.init()) {
					uni.showLoading({
						title: '处理中...'
					});
					uni.request({
						url: app.globalData.get_request_url("coming", "index", "signin"),
						method: 'POST',
						data: {
							id: this.data.id
						},
						dataType: 'json',
						success: res => {
							uni.hideLoading();
							if (res.data.code == 0) {
								this.setData({
									is_already_coming: 1,
									is_success_tips: 1,
									coming_integral: res.data.data
								});
								this.get_data();
							} else {
								if (app.globalData.is_login_check(res.data, this, 'team_request')) {
									app.globalData.showToast(res.data.msg);
								}
							}
						},
						fail: () => {
							uni.hideLoading();
							app.globalData.showToast('服务器请求出错');
						}
					});
				}
			},

			// 签到成功提示关闭
			coming_success_close_event(e) {
				this.setData({
					is_success_tips: 0
				});
			},

			// 组队事件
			team_event(e) {
				if (this.init()) {
					uni.showLoading({
						title: '处理中...'
					});
					uni.request({
						url: app.globalData.get_request_url("team", "userqrcode", "signin"),
						method: 'POST',
						data: {},
						dataType: 'json',
						success: res => {
							uni.hideLoading();
							if (res.data.code == 0) {
								switch (res.data.data.status) {
									// 组队成功
									case 0:
										// 设置签到码id
										var temp_params = this.params;
										temp_params['id'] = res.data.data.qrcode_id;
										this.setData({
											params: temp_params
										});

										// 重新拉取数据
										this.get_data();
										break;
										// 需要填写联系人信息
									case 1:
										uni.navigateTo({
											url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?id=' + res.data.data.qrcode_id + '&is_team=1'
										});
										break;
								}
							} else {
								if (app.globalData.is_login_check(res.data, this, 'team_request')) {
									app.globalData.showToast(res.data.msg);
								}
							}
						},
						fail: () => {
							uni.hideLoading();
							app.globalData.showToast('服务器请求出错');
						}
					});
				}
			}
		}
	};
</script>
<style>
	@import './index-detail.css';
</style>
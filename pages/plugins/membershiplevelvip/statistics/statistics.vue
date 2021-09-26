<template>
<view>
<!-- 推广客户 -->
<view class="container user-container bg-white">
  <view class="title">推广客户</view>
  <view class="base-content oh tc">
    <view class="item fl">
      <view class="name cr-base">已推广用户总数</view>
      <view class="value single-text">
        <text class="golden">{{user_total.user_count || 0}}</text>
        <text class="cr-gray">人</text>
      </view>
    </view>
    <view class="item fl">
      <view class="name cr-base">已消费用户总数</view>
      <view class="value single-text">
        <text class="green">{{user_total.valid_user_count || 0}}</text>
        <text class="cr-gray">人</text>
      </view>
    </view>
  </view>
</view>

<!-- 返利概况 -->
<view class="container profit-container bg-white spacing-mt">
  <view class="title">返利概况</view>
  <view class="base-content oh tc">
    <view class="item fl">
      <view class="name cr-base">返佣总金额</view>
      <view class="value single-text">
        <text class="golden">{{currency_symbol}}{{user_profit_total_price || '0.00'}}</text>
      </view>
    </view>
    <view class="item fl">
      <view class="name cr-base">待结算金额</view>
      <view class="value single-text">
        <text class="yellow">{{currency_symbol}}{{user_profit_stay_price || '0.00'}}</text>
      </view>
    </view>
    <view class="item fl">
      <view class="name cr-base">已结算金额</view>
      <view class="value single-text">
        <text class="green">{{currency_symbol}}{{user_profit_already_price || '0.00'}}</text>
      </view>
    </view>
  </view>
</view>

<!--<import src="/pages/common/bottom_line.wxml"></import>-->
<block data-type="template" data-is="bottom_line" data-attr="status: true">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_list_loding_status: 1,
      data_list_loding_msg: '加载中...',
      data_bottom_line_status: false,
      user_total: null,
      user_profit_already_price: 0.00,
      user_profit_stay_price: 0.00,
      user_profit_total_price: 0.00,
      user_data: null,
      profit_data: null,
      // 基础配置
      currency_symbol: app.globalData.data.currency_symbol
    };
  },

  components: {},
  props: {},

  onShow() {
    // 数据加载
    this.init(); // 初始化配置

    this.init_config();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  methods: {
    // 初始化配置
    init_config(status) {
      if ((status || false) == true) {
        this.setData({
          currency_symbol: app.globalData.get_config('currency_symbol')
        });
      } else {
        app.globalData.is_config(this, 'init_config');
      }
    },

    // 获取数据
    init() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      });
      uni.request({
        url: app.globalData.get_request_url("index", "statistics", "membershiplevelvip"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              user_total: data.user_total || null,
              user_profit_already_price: data.user_profit_already_price || 0.00,
              user_profit_stay_price: data.user_profit_stay_price || 0.00,
              user_profit_total_price: data.user_profit_total_price || 0.00,
              user_data: data.user_chart || null,
              profit_data: data.profit_chart || null,
              data_list_loding_status: 3,
              data_bottom_line_status: true,
              data_list_loding_msg: ''
            });
          } else {
            self.setData({
              data_list_loding_status: 2,
              data_bottom_line_status: false,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'init')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          self.setData({
            data_list_loding_status: 2,
            data_bottom_line_status: false,
            data_list_loding_msg: '服务器请求出错'
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    }

  }
};
</script>
<style>
/*
 * 公共
 */
.container {
  padding: 20rpx 10rpx;
}
.container .title {
  border-left: 3px solid #1d1611;
  padding-left: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
}
.container .base-content {
  padding: 30rpx 10rpx;
}
.container .base-content .name {
  margin-bottom: 10rpx;
}
.container .base-content .value .golden,
.container .base-content .value .yellow,
.container .base-content .value .green {
  font-weight: 500;
  margin-right: 10rpx;
}
.container .base-content .value .golden {
  color: #1d1611;
}
.container .base-content .value .yellow {
  color: #f37b1d;
}
.container .base-content .value .green {
  color: #5eb95e;
}

/*
 * 用户
 */
.user-container .item {
  width: 50%;
}

/*
 * 返利
 */
.profit-container .item {
  width: 33.33%;
}
</style>
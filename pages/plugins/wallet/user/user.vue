<template>
<view>
<!-- 钱包信息 -->
<view class="wallet bg-white">
  <view class="item normal oh">
    <view class="fl cr-base name">有效</view>
    <view class="fl cr-main money single-text">{{user_wallet.normal_money || '0.00'}}</view>
    <view class="fl cr-gray unit">元</view>
  </view>
  <view class="item frozen oh">
    <view class="fl cr-base name">冻结</view>
    <view class="fl money single-text">{{user_wallet.frozen_money || '0.00'}}</view>
    <view class="fl cr-gray unit">元</view>
  </view>
  <view class="item give oh">
    <view class="fl cr-base name">赠送</view>
    <view class="fl money single-text">{{user_wallet.give_money || '0.00'}}</view>
    <view class="fl cr-gray unit">元</view>
  </view>
  <view class="submit">
    <navigator v-if="(data_base || null) == null || data_base.is_enable_recharge == 1" url="/pages/plugins/wallet/recharge/recharge" hover-class="none" class="fl">
      <button size="mini" type="default" hover-class="none" class="submit-recharge">充值</button>
    </navigator>
    <navigator v-if="(data_base || null) == null || data_base.is_enable_cash == 1" url="/pages/plugins/wallet/cash-auth/cash-auth" hover-class="none" class="fl">
      <button size="mini" type="default" hover-class="none" class="submit-cash">提现</button>
    </navigator>
  </view>
</view>

<!-- 导航 -->
<view v-if="nav_list.length > 0" class="nav spacing-mt oh bg-white">
  <block v-for="(item, index) in nav_list" :key="index">
    <navigator :url="item.url" hover-class="none">
      <view class="item fl tc">
        <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
        <view class="title">{{item.title}}</view>
      </view>
    </navigator>
  </block>
</view>

<!-- 通知  -->
<view v-if="(data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0" class="tips-container spacing-mt spacing-mb">
  <view class="tips">
    <view v-for="(item, index) in data_base.user_center_notice" :key="index" class="item">
      {{item}}
    </view>
  </view>
</view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_base: null,
      user_wallet: null,
      submit_disabled_status: false,
      // 导航
      nav_list: []
    };
  },

  components: {},
  props: {},

  onLoad(params) {},

  onShow() {
    this.set_nav_list();
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data();
  },

  methods: {
    init(e) {
      var user = app.globalData.get_user_info(this, "init"),
          self = this;

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
          self.get_data();
        }
      }
    },

    // 导航
    set_nav_list() {
      var nav = [{
        icon: "/static/images/plugins/wallet/user-center-wallet-log-icon.png",
        title: "账户明细",
        url: "/pages/plugins/wallet/wallet-log/wallet-log"
      }, {
        icon: "/static/images/plugins/wallet/user-center-recharge-icon.png",
        title: "充值记录",
        url: "/pages/plugins/wallet/user-recharge/user-recharge"
      }, {
        icon: "/static/images/plugins/wallet/user-center-cash-icon.png",
        title: "提现记录",
        url: "/pages/plugins/wallet/user-cash/user-cash"
      }];
      this.setData({
        nav_list: nav
      });
    },

    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "user", "wallet"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              user_wallet: data.user_wallet || null,
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: false
            });
          } else {
            self.setData({
              data_bottom_line_status: false,
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'get_data')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.stopPullDownRefresh();
          self.setData({
            data_bottom_line_status: false,
            data_list_loding_status: 2,
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
 * 基础
 */
.wallet {
  padding: 20rpx 10rpx;
  position: relative;
}
.wallet .item {
  line-height: 56rpx;
}
.wallet .money {
  font-weight: 500;
  font-size: 36rpx;
  margin: 0 10rpx;
  max-width: calc(100% - 110rpx);
}
.wallet .frozen .money {
  color: #FF9800;
}
.wallet .give .money {
  color: #333;
  max-width: calc(100% - 360rpx);
}
.wallet .submit {
  position: absolute;
  right: 10rpx;
  bottom: 10rpx;
}
.wallet .submit button {
  font-size: 26rpx;
  height: 55rpx;
  line-height: 55rpx;
  color: #fff;
  padding: 0 20rpx;
}
.wallet .submit-recharge {
  border: 1px solid #d2364c;
  background-color: #d2364c;
}
.wallet .submit-cash {
  border: 1px solid #5eb95e;
  background-color: #5eb95e;
  margin-left: 30rpx;
}

/*
 * 导航
 */
.nav {
  border-top: 1px solid #eee;
}
.nav .item {
  padding: 30rpx 0;
  width: calc(50% - 1px);
  border-bottom: 1px solid #eee;
}
.nav .item:nth-child(odd) {
  border-right: 1px solid #eee;
}
.nav .item image {
  width: 100rpx;
  height: 100rpx;
  margin: 0 auto;
}
.nav .item .title {
  margin-top: 20rpx;
}

/*
 * 提示信息
 */
.tips-container .tips-item {
  padding: 0 10rpx;
}
</style>
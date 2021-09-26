<template>
<view class="form-container">
  <view class="form-gorup bg-white money-container">
    <view class="form-gorup-title">充值金额</view>
    <input type="digit" name="money" :value="recharge_money_value || ''" placeholder-class="cr-grey" class="cr-base" placeholder="请输入充值金额" @input="recharge_money_value_input_event" maxlength="6">
  </view>

  <view class="form-gorup">
    <button class="bg-main" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_event">提交</button>
  </view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      params: null,
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      recharge_money_value: '',
      form_submit_disabled_status: false
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      params: params,
      recharge_money_value: params.money || ''
    });
  },

  onShow() {
    this.init();
  },

  methods: {
    init() {
      var user = app.globalData.get_user_info(this, "init");

      if (user != false) {
        // 用户未绑定用户则转到登录页面
        if (app.globalData.user_is_need_login(user)) {
          uni.redirectTo({
            url: "/pages/login/login?event_callback=init"
          });
          this.setData({
            data_list_loding_status: 2,
            data_list_loding_msg: '请先绑定手机号码'
          });
          return false;
        }
      } else {
        this.setData({
          data_list_loding_status: 2,
          data_list_loding_msg: '请先授权用户信息'
        });
      }
    },

    // 充值金额输入事件
    recharge_money_value_input_event(e) {
      this.setData({
        recharge_money_value: e.detail.value || ''
      });
    },

    // 数据提交
    form_submit_event(e) {
      var self = this; // 参数

      if ((self.recharge_money_value || null) == null) {
        app.globalData.showToast('请输入充值金额');
        return false;
      }

      self.setData({
        form_submit_disabled_status: true
      });
      uni.showLoading({
        title: "处理中..."
      });
      uni.request({
        url: app.globalData.get_request_url("create", "recharge", "wallet"),
        method: "POST",
        data: {
          money: self.recharge_money_value
        },
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          self.setData({
            form_submit_disabled_status: false
          });
          uni.hideLoading();

          if (res.data.code == 0) {
            uni.redirectTo({
              url: '/pages/plugins/wallet/user-recharge/user-recharge?is_pay=1&recharge_id=' + res.data.data.recharge_id
            });
          } else {
            if (app.globalData.is_login_check(res.data)) {
              app.globalData.showToast(res.data.msg);
            } else {
              app.globalData.showToast('提交失败，请重试！');
            }
          }
        },
        fail: () => {
          self.setData({
            form_submit_disabled_status: false
          });
          uni.hideLoading();
          app.globalData.showToast("服务器请求出错");
        }
      });
    }

  }
};
</script>
<style>
.form-container .money-container {
  padding-top: 30rpx;
}
.form-container .money-container input {
  font-size: 60rpx;
  height: 130rpx;
  line-height: 130rpx;
}
</style>
<template>
<view>
<form v-if="check_status == 1" @submit="form_submit" class="form-container oh">
  <view class="form-gorup bg-white">
    <view class="form-gorup-title">提现金额<text class="form-group-tips-must">必填</text></view>
    <input type="digit" name="money" :value="default_data.money || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="'提现金额，最低' + ((data_base.cash_minimum_amount || 0) <= 0 ? 0.01 : data_base.cash_minimum_amount) + '元，最高' + can_cash_max_money + '元'">
    <view class="tips form-tips">
      <view v-if="(data_base || null) == null || data_base.is_cash_retain_give != 0">赠送金额不可提现</view>
      <view v-if="(data_base || null) != null && data_base.cash_minimum_amount > 0">提现最低金额 {{data_base.cash_minimum_amount}} 元起</view>
      <view>当前可提现金额 <text class="cr-main">{{can_cash_max_money}}</text> 元</view>
      <view>当前可用金额 <text class="cr-base">{{user_wallet.normal_money}}</text> 元</view>
      <view>当前赠送金额 <text class="cr-base">{{user_wallet.give_money}}</text> 元</view>
    </view>
  </view>

  <view class="form-gorup bg-white">
    <view class="form-gorup-title">收款平台<text class="form-group-tips-must">必填</text></view>
    <input type="text" name="bank_name" :value="default_data.bank_name || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" placeholder="收款平台格式 1~60 个字符之间">
    <view class="tips form-tips">
      强烈建议优先填写国有4大银行(中国银行、中国建设银行、中国工商银行和中国农业银行) 请填写详细的开户银行分行名称，虚拟账户如支付宝、财付通、微信 直接填写 相应的名称 即可。
    </view>
  </view>

  <view class="form-gorup bg-white">
    <view class="form-gorup-title">收款账号<text class="form-group-tips-must">必填</text></view>
    <input type="text" name="bank_accounts" :value="default_data.bank_accounts || ''" placeholder-class="cr-grey" class="cr-base" maxlength="60" placeholder="收款账号格式 1~60 个字符之间">
    <view class="tips form-tips">
      银行账号或虚拟账号(支付宝、财付通、微信等账号)
    </view>
  </view>

  <view class="form-gorup bg-white">
    <view class="form-gorup-title">开户人姓名<text class="form-group-tips-must">必填</text></view>
    <input type="text" name="bank_username" :value="default_data.bank_username || ''" placeholder-class="cr-grey" class="cr-base" maxlength="30" placeholder="开户人姓名格式 1~30 个字符之间">
    <view class="tips form-tips">
      收款账号的开户人真实姓名
    </view>
  </view>

  <view class="form-gorup">
    <button class="bg-main" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">提交</button>
  </view>
</form>

<view v-if="check_status === 0" class="overdue tc">
  <view class="msg cr-gray">安全验证已超时，请重新验证再操作</view>
  <navigator hover-class="none" open-type="navigateBack">
    <button size="mini" type="primary" hover-class="none" class="submit-cash">返回重新申请提现</button>
  </navigator>
</view>
<view v-else>
  <!--<import src="/pages/common/nodata.wxml"></import>-->
  <block data-type="template" data-is="nodata" data-attr="status: data_list_loding_status, msg: data_list_loding_msg">
  <!-- 1 加载中 -->
  <view v-if="0 == 1" class="no-data-loding tc">
    <text>加载中...</text>
  </view>

  <!-- 2 处理错误 -->
  <view v-else-if="0 == 2" class="no-data-box tc">
    <image src="/static/images/error.png" mode="widthFix"></image>
    <view class="no-data-tips">{{msg || '处理错误'}}</view>
  </view>

  <!-- 0 默认没有数据 -->
  <view v-else-if="0 == 0" class="no-data-box tc">
    <image src="/static/images/empty.png" mode="widthFix"></image>
    <view class="no-data-tips">{{msg || '没有相关数据'}}</view>
  </view>
</block>
</view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      params: null,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      default_data: null,
      data_base: null,
      user_wallet: null,
      check_status: null,
      can_cash_max_money: 0.00,
      form_submit_disabled_status: false
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      params: params
    });
  },

  onShow() {
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data();
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
        } else {
          this.get_data();
        }
      } else {
        this.setData({
          data_list_loding_status: 2,
          data_list_loding_msg: '请先授权用户信息'
        });
      }
    },

    // 获取数据
    get_data() {
      var self = this;
      self.setData({
        data_list_loding_status: 1
      });
      uni.showLoading({
        title: "加载中..."
      });
      uni.request({
        url: app.globalData.get_request_url("createinit", "cash", "wallet"),
        method: "POST",
        data: {},
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data || null;
            self.setData({
              data_list_loding_status: 3,
              data_base: data.base || null,
              check_status: data.check_status || 0,
              default_data: data.default_data || null,
              user_wallet: data.user_wallet || null,
              can_cash_max_money: data.can_cash_max_money || 0.00
            });
          } else {
            self.setData({
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data)) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          self.setData({
            data_list_loding_status: 2,
            data_list_loding_msg: '服务器请求出错'
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 数据提交
    form_submit(e) {
      var self = this; // 表单数据

      var form_data = e.detail.value; // 数据校验

      var validation = [{
        fields: "money",
        msg: "请填写提现金额"
      }, {
        fields: "bank_name",
        msg: "请填写收款平台"
      }, {
        fields: "bank_accounts",
        msg: "请填写收款账号"
      }, {
        fields: "bank_username",
        msg: "请填写开户人姓名"
      }]; // 验证提交表单

      if (app.globalData.fields_check(form_data, validation)) {
        self.setData({
          form_submit_disabled_status: true
        });
        uni.showLoading({
          title: "处理中..."
        });
        uni.request({
          url: app.globalData.get_request_url("create", "cash", "wallet"),
          method: "POST",
          data: form_data,
          dataType: "json",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              app.globalData.showToast(res.data.msg, "success");
              setTimeout(function () {
                uni.redirectTo({
                  url: '/pages/plugins/wallet/user-cash/user-cash'
                });
              }, 1000);
            } else {
              self.setData({
                form_submit_disabled_status: false
              });

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

  }
};
</script>
<style>
/*
 * 表单提示
 */
.form-tips {
  background: #ffffeb;
  padding-left: 10rpx;
}

/*
 * 验证过期
 */
.overdue {
  padding-top: 30%;
}
.overdue .msg {
  font-size: 36rpx;
  margin-bottom: 30rpx;
}
</style>
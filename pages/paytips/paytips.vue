<template>
<view>
<view class="content">
  <image class="pay-icon" v-if="params.code == '9000'" mode="widthFix" :src="default_round_success_icon"></image>
  <image class="pay-icon" v-else mode="widthFix" :src="default_round_error_icon"></image>
  <text class="dis-block">{{params.msg}}</text>
</view>

<view class="btn-box">
  <button class="button-main dy-wib" type="default" hover-class="none" size="mini" @tap="back_event">返回</button>
  <navigator v-if="(params.page || null) != null && (params.title || null) != null" class="dy-wib" :url="'/pages/' + params.page + '/' + params.page" open-type="redirect">
    <button class="button-main" type="default" hover-class="none" size="mini">{{params.title}}</button>
  </navigator>
</view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      params: {},
      default_round_success_icon: app.globalData.data.default_round_success_icon,
      default_round_error_icon: app.globalData.data.default_round_error_icon
    };
  },

  components: {},
  props: {},

  /**
   * 页面加载初始化
   */
  onLoad(options) {
    var msg = null;

    switch (options.code) {
      // 支付成功
      case '9000':
        msg = '支付成功';
        break;
      // 正在处理中

      case '8000':
        msg = '正在处理中';
        break;
      // 支付失败

      case '4000':
        msg = '支付失败';
        break;
      // 用户中途取消

      case '6001':
        msg = '已取消支付';
        break;
      // 网络连接出错

      case '6002':
        msg = '网络连接出错';
        break;
      // 支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态

      case '6004':
        msg = '支付结果未知';
        break;
      // 用户点击忘记密码导致快捷界面退出(only iOS)

      case '99':
        msg = '用户取消支付';
        break;
      // 默认错误

      default:
        msg = '其它异常错误';
    }

    options['msg'] = msg; // 设置信息

    this.setData({
      params: options
    });
  },

  methods: {
    // 返回
    back_event(e) {
      uni.navigateBack();
    }

  }
};
</script>
<style>
page{
    background: #fff;
}
.content{
    padding-top: 15%;
    text-align: center;
}
.content .pay-img{
    display: block;
    width:500rpx;
    margin: 80rpx auto;
}
.content .pay-icon{
    display: block;
    width: 250rpx;
    margin: 60rpx auto;
}

.btn-box{
    text-align: center;
    margin-top: 150rpx;
}
.btn-box button{
    height: 90rpx;
    line-height: 90rpx;
    width: 300rpx;
}
.dis-block {
    font-size: 48rpx;
}

</style>
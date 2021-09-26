<template>
<view>
<!-- 导航 -->
<view class="nav">
  <block v-for="(item, index) in nav_status_list" :key="index">
    <view :class="'item fl tc cr-gray ' + (nav_status_index == index ? 'active' : '')" :data-index="index" @tap="nav_event">{{item.name}}</view>
  </block>
</view>

<!-- 列表 -->
<scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
  <view class="data-list">
    <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb" v-if="data_list.length > 0">
      <view class="base oh br-b">
        <text class="cr-base">{{item.add_time_time}}</text>
        <text class="fr cr-main">{{item.status_name}}</text>
      </view>
      <navigator :url="'/pages/plugins/wallet/user-recharge-detail/user-recharge-detail?id=' + item.id" hover-class="none">
        <view class="content">
          <view class="single-text">
            <text class="title cr-base">充值单号</text>
            <text class="value">{{item.recharge_no}}</text>
          </view>
          <view class="single-text">
            <text class="title cr-base">充值金额</text>
            <text class="value">{{item.money}}</text>
            <text class="unit cr-gray">元</text>
          </view>
          <view class="single-text">
            <text class="title cr-base">支付金额</text>
            <text class="value">{{item.pay_money}}</text>
            <text class="unit cr-gray">元</text>
          </view>
        </view>
      </navigator>
      <view v-if="item.status == 0" class="operation tr br-t-dashed">
        <button class="submit-pay cr-base br" type="default" size="mini" @tap="pay_event" :data-value="item.id" :data-index="index" hover-class="none">支付</button>
        <button class="submit-delete cr-base br" type="default" size="mini" @tap="delete_event" :data-value="item.id" :data-index="index" hover-class="none">删除</button>
      </view>
    </view>

    <view v-if="data_list.length == 0">
      <!--<import src="/pages/common/nodata.wxml"></import>-->
      <block data-type="template" data-is="nodata" data-attr="status: data_list_loding_status">
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

    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
  </view>
</scroll-view>

<!-- 支付方式 popup -->
<component-popup :prop-show="is_show_payment_popup" prop-position="bottom" @onclose="payment_popup_event_close">
  <view v-if="payment_list.length > 0" class="payment-list oh bg-white">
    <view v-for="(item, index) in payment_list" :key="index" class="item tc fl">
      <view class="item-content br" :data-value="item.id" @tap="popup_payment_event">
        <image v-if="(item.logo || null) != null" class="icon" :src="item.logo" mode="widthFix"></image>
        <text>{{item.name}}
        </text>
      </view>
    </view>
  </view>
  <view v-else class="payment-list oh bg-white tc cr-gray">没有支付方式</view>
</component-popup>
</view>
</template>

<script>
const app = getApp();
import componentPopup from "../../../../components/popup/popup";

export default {
  data() {
    return {
      data_list: [],
      data_page_total: 0,
      data_page: 1,
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      params: null,
      load_status: 0,
      is_show_payment_popup: false,
      payment_list: [],
      payment_id: 0,
      temp_pay_value: 0,
      temp_pay_index: 0,
      nav_status_list: [{
        name: "全部",
        value: "-1"
      }, {
        name: "待支付",
        value: "0"
      }, {
        name: "已支付",
        value: "1"
      }],
      nav_status_index: 0,
      data_total: ""
    };
  },

  components: {
    componentPopup
  },
  props: {},

  onLoad(params) {
    // 是否指定状态
    var nav_status_index = 0;

    if ((params.status || null) != null) {
      for (var i in this.nav_status_list) {
        if (this.nav_status_list[i]['value'] == params.status) {
          nav_status_index = i;
          break;
        }
      }
    }

    this.setData({
      params: params,
      nav_status_index: nav_status_index
    });
    this.init();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      data_page: 1
    });
    this.get_data_list(1);
  },

  methods: {
    init() {
      var user = app.globalData.get_user_info(this, 'init');

      if (user != false) {
        // 用户未绑定用户则转到登录页面
        if (app.globalData.user_is_need_login(user)) {
          uni.redirectTo({
            url: "/pages/login/login?event_callback=init"
          });
          return false;
        } else {
          // 获取数据
          this.get_data_list();
        }
      } else {
        this.setData({
          data_list_loding_status: 0,
          data_bottom_line_status: false
        });
      }
    },

    // 获取数据
    get_data_list(is_mandatory) {
      // 分页是否还有数据
      if ((is_mandatory || 0) == 0) {
        if (this.data_bottom_line_status == true) {
          return false;
        }
      } // 加载loding


      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      }); // 参数

      var order_status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value']; // 获取数据

      uni.request({
        url: app.globalData.get_request_url("index", "recharge", "wallet"),
        method: "POST",
        data: {
          page: this.data_page,
          status: order_status,
          is_more: 1
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            if (res.data.data.data.length > 0) {
              if (this.data_page <= 1) {
                var temp_data_list = res.data.data.data; // 下订单支付处理

                if (this.load_status == 0) {
                  if ((this.params.is_pay || 0) == 1 && (this.params.recharge_id || 0) != 0) {
                    for (var i in temp_data_list) {
                      if (this.params.recharge_id == temp_data_list[i]['id']) {
                        this.setData({
                          is_show_payment_popup: true,
                          temp_pay_value: temp_data_list[i]['id'],
                          temp_pay_index: i
                        });
                        break;
                      }
                    }
                  }
                }
              } else {
                var temp_data_list = this.data_list;
                var temp_data = res.data.data.data;

                for (var i in temp_data) {
                  temp_data_list.push(temp_data[i]);
                }
              }

              this.setData({
                data_list: temp_data_list,
                data_total: res.data.data.total,
                data_page_total: res.data.data.page_total,
                data_list_loding_status: 3,
                data_page: this.data_page + 1,
                load_status: 1,
                payment_list: res.data.data.payment_list || []
              }); // 是否还有数据

              if (this.data_page > 1 && this.data_page > this.data_page_total) {
                this.setData({
                  data_bottom_line_status: true
                });
              } else {
                this.setData({
                  data_bottom_line_status: false
                });
              }
            } else {
              this.setData({
                data_list_loding_status: 0,
                load_status: 1,
                data_list: [],
                data_bottom_line_status: false
              });
            }
          } else {
            this.setData({
              data_list_loding_status: 0,
              load_status: 1
            });

            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.setData({
            data_list_loding_status: 2,
            load_status: 1
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 滚动加载
    scroll_lower(e) {
      this.get_data_list();
    },

    // 支付
    pay_event(e) {
      this.setData({
        is_show_payment_popup: true,
        temp_pay_value: e.currentTarget.dataset.value,
        temp_pay_index: e.currentTarget.dataset.index
      });
    },

    // 支付弹窗关闭
    payment_popup_event_close(e) {
      this.setData({
        is_show_payment_popup: false
      });
    },

    // 支付弹窗发起支付
    popup_payment_event(e) {
      var payment_id = e.currentTarget.dataset.value || 0;
      this.setData({
        payment_id: payment_id
      });
      this.payment_popup_event_close();
      this.pay_handle(this.temp_pay_value, this.temp_pay_index);
    },

    // 支付方法
    pay_handle(recharge_id, index) {
      var self = this; // 加载loding

      uni.showLoading({
        title: "请求中..."
      });
      uni.request({
        url: app.globalData.get_request_url("pay", "recharge", "wallet"),
        method: "POST",
        data: {
          recharge_id: recharge_id,
          payment_id: this.payment_id
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();

          if (res.data.code == 0) {
            var data = res.data.data.data;
            uni.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.package,
              signType: data.signType,
              paySign: data.paySign,
              success: function (res) {
                // 数据设置
                self.order_item_pay_success_handle(index); // 跳转支付页面

                uni.navigateTo({
                  url: "/pages/paytips/paytips?code=9000&total_price=" + self.data_list[index]['money']
                });
              },
              fail: function (res) {
                app.globalData.showToast('支付失败');
              }
            });
          } else {
            app.globalData.showToast(res.data.msg);
          }
        },
        fail: () => {
          uni.hideLoading();
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 支付成功数据设置
    order_item_pay_success_handle(index) {
      // 数据设置
      var temp_data_list = this.data_list;
      temp_data_list[index]['status'] = 1;
      temp_data_list[index]['status_name'] = '已支付';
      this.setData({
        data_list: temp_data_list
      });
    },

    // 删除
    delete_event(e) {
      uni.showModal({
        title: "温馨提示",
        content: "删除后不可恢复，确定继续吗?",
        confirmText: "确认",
        cancelText: "不了",
        success: result => {
          if (result.confirm) {
            // 参数
            var id = e.currentTarget.dataset.value;
            var index = e.currentTarget.dataset.index; // 加载loding

            uni.showLoading({
              title: "处理中..."
            });
            uni.request({
              url: app.globalData.get_request_url("delete", "recharge", "wallet"),
              method: "POST",
              data: {
                id: id
              },
              dataType: "json",
              success: res => {
                uni.hideLoading();

                if (res.data.code == 0) {
                  var temp_data_list = this.data_list;
                  temp_data_list.splice(index, 1);
                  this.setData({
                    data_list: temp_data_list
                  });

                  if (temp_data_list.length == 0) {
                    this.setData({
                      data_list_loding_status: 0,
                      data_bottom_line_status: false
                    });
                  }

                  app.globalData.showToast(res.data.msg, "success");
                } else {
                  app.globalData.showToast(res.data.msg);
                }
              },
              fail: () => {
                uni.hideLoading();
                app.globalData.showToast("服务器请求出错");
              }
            });
          }
        }
      });
    },

    // 导航事件
    nav_event(e) {
      this.setData({
        nav_status_index: e.currentTarget.dataset.index || 0,
        data_page: 1
      });
      this.get_data_list(1);
    }

  }
};
</script>
<style>
/*
 * 导航
 */
.nav {
  background: #eee;
  height: 80rpx;
  line-height: 80rpx;
}
.nav .item {
  width: 33.33%;
}
.nav .active {
  color: #d2364c;
}

/*
 * 列表
 */
.scroll-box {
  height: calc(100vh - 80rpx);
}
.data-list .item .base,
.data-list .item .content {
  padding: 20rpx 10rpx;
}
.data-list .item .content .single-text {
  line-height: 50rpx;
}
.data-list .item .content .single-text .title {
  margin-right: 30rpx;
}
.data-list .item .content .single-text .value {
  font-weight: 500;
}
.data-list .item .content .single-text .unit {
  margin-left: 10rpx;
}
.data-list .item .operation {
  padding: 20rpx 10rpx;
}
.data-list .item .submit-delete {
  border: 1px solid #dc7f7f;
  color: #dc7f7f !important;
}
.data-list .item .operation button:not(:first-child) {
  margin-left: 30rpx;
}

/**
 * 支付方式
 */
.payment-list {
  padding: 40rpx 0;
}
.payment-list .item {
  width: 50%;
}
.payment-list .item-content {
  margin: 20rpx;
  padding: 20rpx 10rpx;
}
.payment-list .item-content image {
  width: 50rpx;
  height: 50rpx !important;
  vertical-align: middle;
  margin-right: 10rpx;
}
</style>
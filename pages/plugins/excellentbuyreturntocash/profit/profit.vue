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
    <block v-if="data_list.length > 0">
      <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb">
        <view class="base oh br-b">
          <text class="cr-base">{{item.add_time}}</text>
          <text class="fr cr-main">{{item.status_name}}</text>
        </view>
        <navigator :url="'/pages/plugins/excellentbuyreturntocash/profit-detail/profit-detail?id=' + item.id" hover-class="none">
          <view class="content">
            <view class="single-text">
              <text class="title cr-base">订单金额</text>
              <text class="value">{{item.total_price}}</text>
              <text class="unit cr-gray">元</text>
            </view>
            <view class="single-text">
              <text class="title cr-base">退款金额</text>
              <text class="value">{{item.refund_price}}</text>
              <text class="unit cr-gray">元</text>
            </view>
            <view class="single-text">
              <text class="title cr-base">有效金额</text>
              <text class="value">{{item.valid_price}}</text>
              <text class="unit cr-gray">元</text>
            </view>
            <view class="single-text">
              <text class="title cr-base">返现金额</text>
              <text class="value">{{item.profit_price}}</text>
              <text class="unit cr-gray">元</text>
            </view>
          </view>
        </navigator>
        <view class="operation tr br-t-dashed">
          <button class="br" type="default" size="mini" hover-class="none" :data-oid="item.order_id" @tap="list_submit_order_event">查看订单</button>
          <button v-if="item.status == 2" class="settlement-submit" type="default" size="mini" hover-class="none" :data-index="index" @tap="list_submit_settlement_event">立即结算</button>
        </view>
      </view>
    </block>

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
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_list: [],
      data_page_total: 0,
      data_page: 1,
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      params: null,
      nav_status_list: [{
        name: "全部",
        value: "-1"
      }, {
        name: "待生效",
        value: "0"
      }, {
        name: "生效中",
        value: "1"
      }, {
        name: "待结算",
        value: "2"
      }, {
        name: "已结算",
        value: "3"
      }, {
        name: "已失效",
        value: "4"
      }],
      nav_status_index: 0,
      data_total: ""
    };
  },

  components: {},
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

      var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value']; // 获取数据

      uni.request({
        url: app.globalData.get_request_url("index", "profit", "excellentbuyreturntocash"),
        method: "POST",
        data: {
          page: this.data_page,
          status: status,
          is_more: 1
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            if (res.data.data.data.length > 0) {
              if (this.data_page <= 1) {
                var temp_data_list = res.data.data.data;
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
                data_page: this.data_page + 1
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
                data_list: [],
                data_bottom_line_status: false
              });
            }
          } else {
            this.setData({
              data_list_loding_status: 0
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
            data_list_loding_status: 2
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 订单详情
    list_submit_order_event(e) {
      var oid = e.currentTarget.dataset.oid || null;

      if (oid != null) {
        uni.navigateTo({
          url: "/pages/user-order-detail/user-order-detail?id=" + oid
        });
      } else {
        app.globalData.showToast('订单id有误');
      }
    },

    // 立即结算事件
    list_submit_settlement_event(e) {
      var index = e.currentTarget.dataset.index || 0;
      var self = this; // 提交数据

      uni.showLoading({
        title: "处理中..."
      });
      uni.request({
        url: app.globalData.get_request_url("auto", "profit", "excellentbuyreturntocash"),
        method: "POST",
        data: {
          id: self.data_list[index]['id']
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();

          if (res.data.code == 0) {
            var temp_data_list = this.data_list;
            temp_data_list[index]['status'] = 3;
            temp_data_list[index]['status_name'] = '已结算';
            self.setData({
              data_list: temp_data_list
            });
            app.globalData.showToast(res.data.msg, "success");
          } else {
            app.globalData.alert({
              msg: res.data.msg,
              is_show_cancel: 0
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 滚动加载
    scroll_lower(e) {
      this.get_data_list();
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
  width: 16.66%;
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
.data-list .item .settlement-submit {
  border: 1px solid #d2364c;
  color: #d2364c !important;
}
.data-list .item .operation button:not(:first-child) {
  margin-left: 30rpx;
}
</style>
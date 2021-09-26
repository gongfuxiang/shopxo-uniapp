<template>
<view>
<view v-if="(data_list || null) != null && data_list.length > 0" class="page">
  <!-- 导航 -->
  <scroll-view class="tabs bg-white tc oh" scroll-x="true">
    <block v-for="(item, index) in data_list" :key="index">
      <view :class="'item cr-gray ' + (selected_tabs_index === index ? 'active' : '')" @tap="tabs_event" :data-index="index">{{item.name}}</view>
    </block>
  </scroll-view>

  <!-- 内容 -->
  <view class="content spacing-mt">
    <block v-for="(item, index) in data_list" :key="index">
      <block v-if="selected_tabs_index == index">
        <block v-if="(item.pay_period_rules || null) != null">
          <block v-for="(rules, index2) in item.pay_period_rules" :key="index2">
            <view :class="'item oh tc bg-white ' + (selected_content_index === index ? 'active' : '')" @tap="content_event" :data-index="index">
              <view class="fl number single-text">
                <text v-if="(rules.number || null) == null" class="value">终身</text>
                <text v-else class="value">{{rules.value}}</text>
                <text v-if="(rules.unit || null) != null" class="unit">{{rules.unit}}</text>
              </view>
              <view class="fr price bg-white single-text">
                <text class="symbol">¥</text>
                <text class="value">{{rules.price}}</text>
                <text class="unit">元</text>
              </view>
            </view>
          </block>

          <!--<import src="/pages/common/bottom_line.wxml"></import>-->
          <block data-type="template" data-is="bottom_line" data-attr="status: true">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>

          <button class="submit-fixed submit-bottom" type="default" hover-class="none" @tap="submit_event" :disabled="submit_disabled_status">确认支付</button>
        </block>
        <block v-else>
          <!--<import src="/pages/common/nodata.wxml"></import>-->
          <block data-type="template" data-is="nodata" data-attr="status: 0, msg: '购买时长未配置'">
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
        </block>
      </block>
    </block>
  </view>
</view>
<view v-else>
  <!--<import src="/pages/common/nodata.wxml"></import>-->
  <block data-type="template" data-is="nodata" data-attr="status: 0, msg: '未配置会员等级'">
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
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_list: [],
      data_base: null,
      selected_tabs_index: 0,
      selected_content_index: null,
      submit_disabled_status: false
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.init();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data_list();
  },

  methods: {
    init() {
      // 获取数据
      this.get_data_list();
    },

    // 获取数据
    get_data_list() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });

      if (self.data_list.length <= 0) {
        self.setData({
          data_list_loding_status: 1
        });
      }

      uni.request({
        url: app.globalData.get_request_url("index", "buy", "membershiplevelvip"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            var status = (data.data || []).length > 0;
            self.setData({
              data_base: data.base || null,
              data_list: data.data || [],
              data_list_loding_msg: '',
              data_list_loding_status: status ? 3 : 0,
              data_bottom_line_status: status
            });
          } else {
            self.setData({
              data_bottom_line_status: false,
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'get_data_list')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          self.setData({
            data_bottom_line_status: false,
            data_list_loding_status: 2,
            data_list_loding_msg: '服务器请求出错'
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // tabs事件
    tabs_event(e) {
      this.setData({
        selected_tabs_index: e.currentTarget.dataset.index || 0,
        selected_content_index: null
      });
    },

    // 时长事件
    content_event(e) {
      this.setData({
        selected_content_index: e.currentTarget.dataset.index || 0
      });
    },

    // 确认支付事件
    submit_event(e) {
      if (this.selected_tabs_index < 0 || this.selected_content_index === null) {
        app.globalData.showToast('请选择开通时长');
        return false;
      } // 请求参数


      var item = this.data_list[this.selected_tabs_index] || null;

      if (item == null) {
        app.globalData.showToast('开通时长有误');
        return false;
      }

      var rules = (item['pay_period_rules'] || null) == null ? null : item['pay_period_rules'][this.selected_content_index] || null;

      if (rules == null) {
        app.globalData.showToast('开通时长有误');
        return false;
      } // 请求生成支付订单


      var self = this;
      self.setData({
        submit_disabled_status: true
      });
      uni.showLoading({
        title: "处理中..."
      });
      uni.request({
        url: app.globalData.get_request_url("create", "buy", "membershiplevelvip"),
        method: "POST",
        data: {
          "opening": item['id'] + '-' + rules['number']
        },
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.hideLoading();
          self.setData({
            submit_disabled_status: false
          });

          if (res.data.code == 0) {
            // 进入以后会员中心并发起支付
            uni.redirectTo({
              url: '/pages/plugins/membershiplevelvip/order/order?is_pay=1&order_id=' + res.data.data.id
            });
          } else {
            if (app.globalData.is_login_check(res.data, self, 'submit_event')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          self.setData({
            submit_disabled_status: false
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
/**
 * common
 */
.page {
  padding-bottom: 100rpx;
}
/**
 * tabs
 */
.tabs {
  width: 100%;
  height: 80rpx;
  white-space: nowrap;
  box-sizing: border-box;
}
.tabs .item {
  padding: 20rpx 30rpx;
  border-bottom: 3px solid #f0f0f0;
  display: inline-block;
  position: relative;
}
.tabs .active {
  border-bottom: 3px solid #1d1611;
  color: #1d1611;
}

/**
 * content
 */
.content .item {
    cursor: pointer;
    border: 1px solid #D6D6D6;
    margin: 0 20rpx 30rpx 20rpx;
}
.content .item .number {
    background: #f2f2f2;
    width: calc(40% - 40rpx);
}
.content .item .price {
    width: calc(60% - 40rpx)
}
.content .item .number,
.content .item .price {
    padding: 20rpx;
}
.content .item .number .value {
    color: #666;
}
.content .item .price .value,
.content .item .price .symbol {
    color: #1d1611;
}
.content .item .value {
    font-size: 38rpx;
}
.content .item .unit {
    color: #888;
    margin-left: 10rpx;
}
.content .active {
  border-color: #1d1611;
  box-shadow: 0px 0 0px 1px #1d1611
}
.content .submit-bottom {
  background: #f9d681 !important;
  color: #351d06 !important;
}
</style>
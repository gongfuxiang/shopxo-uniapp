<template>
<view>
<view v-if="detail != null">
  <view v-if="detail_list.length > 0" class="panel-item">
    <view class="panel-content bg-white">
      <view v-for="(item, index) in detail_list" :key="index" class="item br-b oh">
        <view class="title fl">{{item.name}}</view>
        <view class="content fl br-l">{{item.value}}</view>
      </view>
    </view>
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

<view v-if="detail == null">
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

  <view v-if="data_list_loding_status != 1" class="nav-back tc wh-auto">
    <navigator open-type="navigateBack" hover-class="none">
      <button type="default" size="mini" class="cr-gray br" hover-class="none">返回</button>
    </navigator>
  </view>
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
      data_bottom_line_status: false,
      detail: null,
      detail_list: []
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    //params['id'] = 3;
    this.setData({
      params: params
    });
    this.init();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  methods: {
    init() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      });
      uni.request({
        url: app.globalData.get_request_url("detail", "walletlog", "wallet"),
        method: "POST",
        data: {
          id: this.params.id
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              detail: data.data,
              detail_list: [{
                name: "业务类型",
                value: data.data.business_type_name || ''
              }, {
                name: "操作类型",
                value: data.data.operation_type_name || ''
              }, {
                name: "金额类型",
                value: data.data.money_type_name || ''
              }, {
                name: "操作金额",
                value: data.data.operation_money + ' 元' || ''
              }, {
                name: "原始金额",
                value: data.data.original_money + ' 元' || ''
              }, {
                name: "最新金额",
                value: data.data.latest_money + ' 元' || ''
              }, {
                name: "变更说明",
                value: data.data.msg || ''
              }, {
                name: "操作时间",
                value: data.data.add_time_time || ''
              }],
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
.panel-item .panel-title {
  background: #fff;
  font-weight: bold;
  padding: 15rpx;
  border-bottom: 2px solid #eee;
  font-size: 34rpx;
}
.panel-item .panel-content .item {
    padding: 20rpx 0;
}
.panel-item .panel-content .item:last-child {
  border: 0;
}
.panel-item .panel-content .item .title {
    width: 25%;
    padding-left: 20rpx;
}
.panel-item .panel-content .item .content {
    width: calc(75% - 50rpx);
    padding-left: 20rpx;
    min-height: 46rpx;
    word-wrap: break-word;
    word-break: normal;
}
.panel-item .panel-content .item view {
    line-height: 46rpx;
}
</style>
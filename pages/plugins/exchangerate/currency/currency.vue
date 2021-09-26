<template>
<view>
<!-- 货币列表 -->
<view v-if="data_list.length > 0" class="exchangerate-container">
  <block v-for="(item, index) in data_list" :key="index">
    <view class="item oh spacing-mb bg-white" @tap="selected_event" :data-index="index">
      <view v-if="common_site_type != 1" class="fl icon">
        <image :src="'/images/default-select' + (item.id == data_default.id ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
      </view>
      <view :class="'fl single-text ' + (item.id == data_default.id ? 'cr-main' : 'cr-base')">{{item.name}} / {{item.symbol}}</view>
    </view>
  </block>
</view>

<view v-if="data_list_loding_status != 3">
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

<!--<import src="/pages/common/bottom_line.wxml"></import>-->
<block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
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
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_list: [],
      data_default: null,
      data_base: null,
      common_site_type: 0
    };
  },

  components: {},
  props: {},

  onShow() {
    // 数据加载
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data_list();
  },

  methods: {
    // 获取数据
    init() {
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
        url: app.globalData.get_request_url("index", "index", "exchangerate"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            var status = (data.data.data || []).length > 0;
            this.setData({
              data_base: data.base || null,
              data_default: data.data.default || null,
              data_list: data.data.data || [],
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
            app.globalData.showToast(res.data.msg);
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

    // 选择事件
    selected_event(e) {
      // 参数处理
      var index = e.currentTarget.dataset.index;
      var temp_list = this.data_list;
      var data = temp_list[index] || null;

      if (data == null) {
        app.globalData.showToast('数据有误');
        return false;
      } // id与当前默认一致则不处理


      if (data.id != this.data_default.id) {
        var self = this;
        uni.showLoading({
          title: "处理中..."
        });
        uni.request({
          url: app.globalData.get_request_url("setcurrency", "index", "exchangerate"),
          method: "POST",
          data: {
            "currency": data.id
          },
          dataType: "json",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              app.globalData.showToast(res.data.msg, "success");
              self.setData({
                data_default: data
              }); // 重新初始化配置

              app.globalData.init_config(); // 返回上一页

              setTimeout(function () {
                uni.navigateBack();
              }, 1500);
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

  }
};
</script>
<style>
.exchangerate-container .item {
  padding: 20rpx 10rpx;
  font-size: 36rpx;
}
.exchangerate-container .item .icon image {
  width: 50rpx;
  height: 50rpx !important;
  margin: 0 10rpx;
  vertical-align: middle;
}
.exchangerate-container .item .single-text {
  width: calc(100% - 80rpx);
  line-height: 50rpx;
}
</style>
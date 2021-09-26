<template>
<view>
<!-- 轮播 -->
<component-banner :prop-data="banner_list"></component-banner>

<!-- 导航 -->
<view v-if="load_status == 1" class="nav bg-white spacing-mb">
  <view class="title">最新直播</view>
  <navigator url="/pages/plugins/weixinliveplayer/search/search" hover-class="none">
    <view class="arrow-right more">查看更多</view>
  </navigator>
</view>

<!-- 数据列表 -->
<view v-if="data_list.length > 0" class="data-list">
  <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb">
    <navigator :url="'/pages/plugins/weixinliveplayer/detail/detail?id=' + item.id" hover-class="none">
        <image :src="item.share_img" mode="aspectFit" class="fl"></image>
        <view class="fl base">
          <view class="single-text name">{{item.name}}</view>
          <view class="time">
          <view class="fl time-title">开播时间</view>
            <view class="start-time">{{item.start_time}}</view>
            <view class="end-time">{{item.end_time}}</view>
          </view>
          <view :class="'status status-' + item.status">{{item.status_name}}</view>
        </view>
      </navigator>
  </view>

  <!-- 结尾 -->
  <!--<import src="/pages/common/bottom_line.wxml"></import>-->
  <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
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
import componentBanner from "../../../../components/slider/slider";

export default {
  data() {
    return {
      load_status: 0,
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      data_list_loding_msg: '',
      data_list: [],
      data_base: null,
      banner_list: []
    };
  },

  components: {
    componentBanner
  },
  props: {},

  onShow() {
    this.init(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var name = (this.data_base || null) != null && (this.data_base.application_name || null) != null ? this.data_base.application_name : app.globalData.data.application_title;
    return {
      title: name,
      desc: app.globalData.data.application_describe,
      path: '/pages/plugins/weixinliveplayer/index/index?referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var name = (this.data_base || null) != null && (this.data_base.application_name || null) != null ? this.data_base.application_name : app.globalData.data.application_title;
    return {
      title: name,
      query: 'referrer=' + user_id
    };
  },

  methods: {
    init() {
      // 获取数据
      this.get_data_list();
    },

    // 获取数据
    get_data_list() {
      var self = this; // 加载loding

      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      });
      uni.request({
        url: app.globalData.get_request_url("index", "index", "weixinliveplayer"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          self.setData({
            load_status: 1
          });

          if (res.data.code == 0) {
            var data = res.data.data;
            var status = (data.data || null) == null || data.data.length == 0;
            this.setData({
              data_base: data.base || null,
              banner_list: data.banner_list || [],
              data_list: data.data,
              data_list_loding_status: status ? 0 : 3,
              data_bottom_line_status: !status
            }); // 导航名称

            if ((data.base || null) != null && (data.base.application_name || null) != null) {
              uni.setNavigationBarTitle({
                title: data.base.application_name
              });
            }
          } else {
            self.setData({
              data_bottom_line_status: true,
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
        }
      });
    }

  }
};
</script>
<style>
/*
 * 导航
 */
.nav {
  padding: 20rpx 10rpx;
  position: relative;
  border-bottom: 1px solid #eee;
}
.nav .title {
  font-size: 32rpx;
}
.nav .more {
  position: absolute;
  top: 22rpx;
  right: 10rpx;
  color: #888;
  padding-right: 15px;
}

/**
 * 数据列表
 */
.data-list .item {
  overflow: hidden;
  padding: 20rpx 10rpx;
  position: relative;
}
.data-list .item image {
    width: 160rpx;
    height: 160rpx !important;
}
.data-list .item .base {
  width: calc(100% - 190rpx);
  text-align: left;
  padding: 0 10rpx 0 20rpx;
}
.data-list .item .base .name {
  font-size: 32rpx;
}
.data-list .item .base .time {
  margin-top: 25rpx;
}
.data-list .item .base .time-title {
  width: 60rpx;
  background: #7ad2ff;
  color: #fff;
  text-align: center;
  padding: 10rpx;
  line-height: 30rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
.data-list .item .base .start-time {
  color: #5eb95e;
}
.data-list .item .base .end-time {
  color: #dd514c;
}
.data-list .item .base .status {
  position: absolute;
  right: 10rpx;
  bottom: 20rpx;
  color: #999;
}
.data-list .item .base .status-0 {
  color: #0e90d2;
}
.data-list .item .base .status-1 {
  color: #5eb95e;
}
.data-list .item .base .status-2 {
  color: #F37B1D;
}
</style>
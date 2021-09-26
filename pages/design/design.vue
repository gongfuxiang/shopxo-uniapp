<template>
<view>
<view v-if="(data || null) != null">
  <!-- 搜索 -->
  <block v-if="(data.is_header || 0) == 1">
    <view class="search wh-auto">
      <view class="search-content bg-white oh">
        <icon type="search" size="16"></icon>
        <input type="text" confirm-type="search" placeholder="其实搜索很简单^_^！" class="wh-auto cr-gray" @confirm="search_input_event">
      </view>
    </view>
  </block>

  <!-- 拖拽模式、引入拖拽数据模块 -->
  <component-layout :prop-data="layout_data"></component-layout>

  <!-- 结尾 -->
  <block v-if="(data.is_footer || 0) == 1">
    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
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
import componentLayout from "../../components/layout/layout";

export default {
  data() {
    return {
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      params: null,
      data: null,
      layout_data: []
    };
  },

  components: {
    componentLayout
  },
  props: {},

  onLoad(params) {
    // 启动参数处理
    params = app.globalData.launch_params_handle(params);
    this.setData({
      params: params
    });
  },

  onShow() {
    this.get_data(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data();
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data.name || this.data.seo_title || app.globalData.data.application_title,
      desc: this.data.seo_desc || app.globalData.data.application_describe,
      path: '/pages/design/design?id=' + this.data.id + '&referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data.name || this.data.seo_title || app.globalData.data.application_title,
      query: 'id=' + this.data.id + '&referrer=' + user_id,
      imageUrl: this.data.logo || ''
    };
  },

  methods: {
    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "design"),
        method: "POST",
        data: {
          "id": this.params.id || 0
        },
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data: (data.data || null) != null && data.data.length != 0 ? data.data : null,
              layout_data: data.layout_data || [],
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: true
            }); // 标题名称

            if ((this.data || null) != null) {
              console.log(this.data.length);
              uni.setNavigationBarTitle({
                title: this.data.name
              });
            }
          } else {
            self.setData({
              data_bottom_line_status: false,
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });
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
    },

    // 搜索事件
    search_input_event(e) {
      var keywords = e.detail.value || null;

      if (keywords == null) {
        app.globalData.showToast("请输入搜索关键字");
        return false;
      } // 进入搜索页面


      uni.navigateTo({
        url: '/pages/goods-search/goods-search?keywords=' + keywords
      });
    }

  }
};
</script>
<style>
/**
 * 搜索
 */
.search {
  left: 0;
  top: 20rpx;
  box-sizing: border-box; 
  padding: 20rpx;
  background: #d2364c;
}
.search-content {
  border-radius: 6rpx;
  position: relative;
  opacity: 0.8;
}
.search icon {
  position: absolute;
  left: 15rpx;
  top: calc(50% - 16rpx);
}
.search input {
  font-size: 28rpx;
  padding-left: 60rpx;
  box-sizing: border-box;
  height: 70rpx;
  line-height: 70rpx;
}
</style>
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
  <view v-if="data_list.length > 0" class="data-list">
    <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb">
      <navigator :url="'/pages/plugins/weixinliveplayer/detail/detail?id=' + item.id" hover-class="none">
          <image :src="item.share_img" mode="aspectFit" class="fl"></image>
          <view class="base fl">
            <view class="single-text name">{{item.name}}</view>
            <view class="time">
            <view class="time-title fl">开播时间</view>
              <view class="start-time">{{item.start_time}}</view>
              <view class="end-time">{{item.end_time}}</view>
            </view>
            <view :class="'status status-' + item.status">{{item.status_name}}</view>
          </view>
        </navigator>
    </view>
  </view>
  <view v-else>
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
</scroll-view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_list: [],
      data_base: null,
      data_page_total: 0,
      data_page: 1,
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      params: null,
      nav_status_list: [{
        name: "全部",
        value: "-1"
      }, {
        name: "未开始",
        value: "0"
      }, {
        name: "直播中",
        value: "1"
      }, {
        name: "暂停中",
        value: "2"
      }, {
        name: "已结束",
        value: "3"
      }],
      nav_status_index: 0,
      data_total: ""
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    // 启动参数处理
    params = app.globalData.launch_params_handle(params); // 是否指定状态

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
    this.init(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      data_page: 1
    });
    this.get_data_list(1);
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var name = (this.data_base || null) != null && (this.data_base.application_name || null) != null ? this.data_base.application_name : app.globalData.data.application_title;
    return {
      title: name,
      desc: app.globalData.data.application_describe,
      path: '/pages/plugins/weixinliveplayer/search/search?referrer=' + user_id
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
        url: app.globalData.get_request_url("index", "search", "weixinliveplayer"),
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
                data_base: res.data.data.base || null,
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
            app.globalData.showToast(res.data.msg);
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
  width: 20%;
}
.nav .active {
  color: #d2364c;
}

/**
 * 数据列表
 */
.scroll-box {
  height: calc(100vh - 80rpx);
}
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
<template>
<view>
<view v-if="detail != null" class="detail">
  <!-- 封面图片 -->
  <image v-if="(detail || null) != null && (detail.share_img || null) != null" class="banner wh-auto dis-block" :src="detail.share_img" mode="widthFix" @tap="detail_images_view_event" :data-value="detail.share_img"></image>

  <!-- 标题 -->
  <view class="name">{{detail.name}}</view>

  <!-- 基础信息 -->
  <view class="bg-white base">
    <view class="item">
      <image class="item-icon dis-block fl" src="/static/images/plugins/weixinliveplayer/detail-status-icon.png" mode="widthFix"></image>
      <text class="cr-gray">直播状态</text>
      <view :class="'fr more status-' + detail.status">{{detail.status_name}}</view>
    </view>
    <view class="item br-t item-time">
      <image class="item-icon dis-block fl" src="/static/images/plugins/weixinliveplayer/detail-time-icon.png" mode="widthFix"></image>
      <text class="cr-gray">开播时间</text>
      <view class="fr time">
        <view class="start-time">{{detail.start_time}}</view>
        <view class="end-time">{{detail.end_time}}</view>
      </view>
    </view>
  </view>

  <!-- 导航 -->
  <view class="nav wh-auto">
    <button type="primary" class="share-friend-submit fl" hover-class="none" open-type="share">
      <image class="item-icon" src="/static/images/plugins/weixinliveplayer/nav-share-friend-icon.png" mode="widthFix"></image>
      <text>分享</text>
    </button>
    <button type="primary" class="share-poster-submit fl" hover-class="none" @tap="share_poster_event">
      <image class="item-icon" src="/static/images/plugins/weixinliveplayer/nav-share-poster-icon.png" mode="widthFix"></image>
      <text>海报</text>
    </button>
    <button type="default" class="player-submit fr" hover-class="none" @tap="player_event">
      <image class="item-icon" src="/static/images/plugins/weixinliveplayer/nav-player-icon.png" mode="widthFix"></image>
      <text>进入直播</text>
    </button>
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
      data_bottom_line_status: false,
      detail: null
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    // 启动参数处理
    params = app.globalData.launch_params_handle(params); //params['id'] = 1;

    this.setData({
      params: params
    });
    this.init(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var did = (this.detail || null) != null ? this.detail.id : 0;
    var name = (this.detail || null) != null ? this.detail.name : app.globalData.data.application_title;
    return {
      title: name,
      desc: app.globalData.data.application_describe,
      path: '/pages/plugins/weixinliveplayer/detail/detail?id=' + did + '&referrer=' + user_id,
      imageUrl: this.detail.share_img || ''
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var did = (this.detail || null) != null ? this.detail.id : 0;
    var name = (this.detail || null) != null ? this.detail.name : app.globalData.data.application_title;
    return {
      title: name,
      query: 'id=' + did + '&referrer=' + user_id,
      imageUrl: this.detail.share_img || ''
    };
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
        url: app.globalData.get_request_url("detail", "search", "weixinliveplayer"),
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
              data_list_loding_status: 3,
              data_bottom_line_status: true,
              data_list_loding_msg: ''
            }); // 标题

            uni.setNavigationBarTitle({
              title: data.data.name
            });
          } else {
            self.setData({
              data_list_loding_status: 2,
              data_bottom_line_status: false,
              data_list_loding_msg: res.data.msg
            });
            app.globalData.showToast(res.data.msg);
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
    },

    // 详情图片查看
    detail_images_view_event(e) {
      var value = e.currentTarget.dataset.value || null;

      if (value != null) {
        uni.previewImage({
          current: value,
          urls: [value]
        });
      }
    },

    // 进入直播
    player_event(e) {
      var params = encodeURIComponent(JSON.stringify({
        type: 'detail'
      }));
      uni.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${this.detail.roomid}&custom_params=${params}`
      });
    },

    // 海报分享
    share_poster_event() {
      uni.showLoading({
        title: '生成中...'
      });
      uni.request({
        url: app.globalData.get_request_url('poster', 'index', 'weixinliveplayer'),
        method: 'POST',
        data: {
          "id": this.detail.id
        },
        dataType: 'json',
        success: res => {
          uni.hideLoading();

          if (res.data.code == 0) {
            uni.previewImage({
              current: res.data.data,
              urls: [res.data.data]
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
    }

  }
};
</script>
<style>
/**
 * 内容
 */
.detail {
  padding-bottom: 100rpx;
}
.name {
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 500;
  padding: 15rpx 10rpx;
}
.base {
  overflow: hidden;
  position: relative;
  padding: 15rpx 10rpx 0 10rpx;
}
.base .item {
  line-height: 38rpx;
  padding: 20rpx 0;
}
.base .item .item-icon {
  width: 35rpx;
  height: 35rpx;
  vertical-align: middle;
  margin-right: 10rpx;
}
.base .item .more {
  color: #999;
}
.base .item .status-0 {
  color: #0e90d2;
}
.base .item .status-1 {
  color: #5eb95e;
}
.base .item .status-2 {
  color: #F37B1D;
}
.base .item-time {
  line-height: 75rpx;
}
.base .item-time .item-icon {
  margin-top: 20rpx;
}
.base .item-time .time {
  line-height: 38rpx;
}
.base .item-time .start-time {
  color: #5eb95e;
}
.base .item-time .end-time {
  color: #dd514c;
}

/**
 * 导航
 */
.nav {
  position: fixed;
  left: 0;
  bottom: 0;
  overflow: hidden;
  height: 100rpx;
}
.nav button {
  height: 100% !important;
  border-radius: 0;
  font-size: 32rpx;
  line-height: 100rpx;
  color: #fff;
}
.nav button image {
  width: 32rpx;
  height: 32rpx !important;
  vertical-align: middle;
  margin-right: 10rpx;
}
.nav button.share-friend-submit,
.nav button.share-poster-submit {
  width: 30%;
}
.nav button.share-friend-submit {
  background: #1bad18;
}
.nav button.share-poster-submit {
  background: #6367f0;
}
.nav button.player-submit {
  width: 40%;
  background: #d2364c;
}
</style>
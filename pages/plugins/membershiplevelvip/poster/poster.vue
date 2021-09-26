<template>
<view>
<view v-if="user_share_qrode != null || user_share_url != null">
  <view v-if="user_share_qrode != null" class="share qrcode bg-white spacing-mb">
    <view class="title">二维码分享</view>
    <view class="desc cr-gray br-b">
      保存二维码后，发送给微信好友/群、QQ好友/群，分享到分朋友圈，微博等进行推广，轻轻松松赚返利！
    </view>
    <view class="content">
      <image :src="user_share_qrode" class="wh-auto dis-block" mode="widthFix"></image>
    </view>
    <view class="submit">
      <button type="primary" :plain="true" hover-class="none" size="mini" class="dis-block wh-auto" @tap="qrcode_event">查看二维码长按保存</button>
    </view>
  </view>

  <view v-if="user_share_url != null" class="share url bg-white">
    <view class="title">链接分享</view>
    <view class="desc cr-gray br-b">
      复制以下链接，发送给微信好友/群、QQ好友/群，分享到分朋友圈，微博等进行推广，轻轻松松赚返利！
    </view>
    <view class="content">{{user_share_url}}</view>
    <view class="submit">
      <button type="primary" :plain="true" hover-class="none" size="mini" class="dis-block wh-auto" @tap="url_event">点击复制链接地址</button>
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

<view v-if="user_share_qrode == null && user_share_url == null">
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
      data_list_loding_status: 1,
      data_list_loding_msg: '加载中...',
      data_bottom_line_status: false,
      user_share_qrode: null,
      user_share_url: null
    };
  },

  components: {},
  props: {},

  onLoad() {
    this.init();
  },

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
        url: app.globalData.get_request_url("index", "poster", "membershiplevelvip"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              user_share_qrode: data.user_share_qrode || null,
              user_share_url: data.user_share_url || null,
              data_list_loding_status: 3,
              data_bottom_line_status: true,
              data_list_loding_msg: ''
            }); // 是否全部没数据

            if (self.user_share_qrode == null && self.user_share_url == null) {
              self.setData({
                data_list_loding_status: 0,
                data_bottom_line_status: false
              });
            }
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
    },

    // 二维码事件
    qrcode_event(e) {
      if ((this.user_share_qrode || null) != null) {
        uni.previewImage({
          current: this.user_share_qrode,
          urls: [this.user_share_qrode]
        });
      } else {
        app.globalData.showToast('二维码地址有误');
      }
    },

    // url事件
    url_event(e) {
      if ((this.user_share_url || null) != null) {
        uni.setClipboardData({
          data: this.user_share_url,

          success(res) {
            app.globalData.showToast('复制成功', 'success');
          }

        });
      } else {
        app.globalData.showToast('链接地址有误');
      }
    }

  }
};
</script>
<style>
/*
 * 公共
 */
.share {
  padding: 20rpx 10rpx;
}
.share .title {
  border-left: 3px solid #1d1611;
  margin-left: 10rpx;
  padding-left: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
}
.share .desc {
  font-size: 32rpx;
  padding: 0 10rpx 20rpx 10rpx;
  margin-top: 20rpx;
}
.share .content {
  padding: 20rpx;
}
.share .submit {
  margin: 20rpx 0;
  padding: 0 20rpx;
}
.share button {
  height: 70rpx;
  line-height: 70rpx;
}

/*
 * 链接
 */
.url .content {
  font-size: 32rpx;
  color: #1d1611;
}
</style>
<template>
<view>
<view v-if="is_show_open_setting" class="open-setting-view">
  <view class="content bg-white">
    <view class="msg cr-gray">开启相应的权限服务</view>
    <view class="value cr-base">获取[ <text>位置信息</text> ]权限</view>
    <button type="primary" open-type="openSetting" size="mini" @opensetting="setting_callback_event">打开设置页</button>    
  </view>
</view>
<view v-else class="open-setting-loding">
  <image src="/static/images/default-bg-loding.gif" class="avatar dis-block" mode="widthFix"></image>
</view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      params: null,
      is_show_open_setting: false,
      auth: 'scope.userLocation',
      cache_key: app.globalData.data.cache_userlocation_key
    };
  },

  components: {},
  props: {},
  onLoad: function (params) {
    this.setData({
      params: params
    });
    this.init();
  },
  methods: {
    // 获取权限
    init() {
      var self = this;
      uni.getSetting({
        success(res) {
          if (!res.authSetting[self.auth]) {
            uni.authorize({
              scope: self.auth,

              success(res) {
                self.choose_location();
              },

              fail: res => {
                self.setData({
                  is_show_open_setting: true
                });
              }
            });
          } else {
            self.choose_location();
          }
        },

        fail: res => {
          app.globalData.showToast("请先获取授权");
        }
      });
    },

    // 位置服务回调方法
    setting_callback_event(e) {
      var self = this;

      if (e.detail.authSetting[self.auth]) {
        self.setData({
          is_show_open_setting: false
        });
        self.choose_location();
      }
    },

    // 打开位置服务
    choose_location() {
      uni.chooseLocation({
        success: res => {
          var position = app.globalData.map_gcj_to_bd(res.longitude, res.latitude);
          res.longitude = position.lng;
          res.latitude = position.lat;
          uni.setStorageSync(this.cache_key, res);
          uni.navigateBack();
        },
        fail: res => {
          uni.navigateBack();
        }
      });
    }

  }
};
</script>
<style>
page {
  background: #fbfbfb;
}
.open-setting-view {
  background: hsla(0, 0%, 0%, 0.1);
  position: fixed;
  top: 0;/*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));/*  #endif  */
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 1000000;
}
.open-setting-view .content {
  margin:0 auto;
  width: 360rpx;
  height: 160rpx;
  padding: 50rpx;
  border-radius: 12rpx;
  margin-top: 70%;
  position: relative;
}
.open-setting-view .content button {
  margin-top: 15rpx;
}
.open-setting-view .content .value {
  margin-top: 5rpx;
}
.open-setting-view .content .value text {
  font-weight: 500;
  color: #333;
}

.open-setting-loding {
  padding-top: 35%;
}
.open-setting-loding image {
  margin: 0 auto;
}
</style>
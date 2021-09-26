<template>
<view>
<!-- 导航 -->
<view v-if="nav_list.length > 0" class="nav oh bg-white">
  <block v-for="(item, index) in nav_list" :key="index">
    <navigator :url="item.url" hover-class="none">
      <view class="item fl tc">
        <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
        <view class="title">{{item.title}}</view>
      </view>
    </navigator>
  </block>
</view>

<!-- 通知  -->
<view v-if="(data_base || null) != null && (data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="tips-container spacing-mt">
  <view class="tips">
    <view v-for="(item, index) in data_base.signin_desc" :key="index" class="item">
      {{item}}
    </view>
  </view>
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
      data_base: null,
      nav_list: []
    };
  },

  components: {},
  props: {},

  onLoad(params) {},

  onShow() {
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data();
  },

  methods: {
    init(e) {
      var user = app.globalData.get_user_info(this, "init"),
          self = this;

      if (user != false) {
        // 用户未绑定用户则转到登录页面
        if (app.globalData.user_is_need_login(user)) {
          uni.showModal({
            title: '温馨提示',
            content: '绑定手机号码',
            confirmText: '确认',
            cancelText: '暂不',
            success: result => {
              uni.stopPullDownRefresh();

              if (result.confirm) {
                uni.navigateTo({
                  url: "/pages/login/login?event_callback=init"
                });
              }
            }
          });
        } else {
          self.get_data();
        }
      }
    },

    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("center", "user", "signin"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data; // 是否开启组队

            var temp_nav_list = [{
              icon: "/static/images/plugins/signin/user-signin-icon.png",
              title: "我的签到",
              url: "/pages/plugins/signin/user-signin/user-signin"
            }];

            if ((data.base || null) != null && (data.base.is_team || 0) == 1) {
              temp_nav_list.push({
                icon: "/static/images/plugins/signin/user-qrcode-icon.png",
                title: "签到码管理",
                url: "/pages/plugins/signin/user-qrcode/user-qrcode"
              });
            }

            self.setData({
              data_base: data.base || null,
              nav_list: temp_nav_list,
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: false
            });
          } else {
            self.setData({
              data_bottom_line_status: false,
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'get_data')) {
              app.globalData.showToast(res.data.msg);
            }
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
    }

  }
};
</script>
<style>
/*
 * 导航
 */
.nav {
  border-top: 1px solid #eee;
}
.nav .item {
  padding: 30rpx 0;
  width: calc(50% - 1px);
  border-bottom: 1px solid #eee;
}
.nav .item:nth-child(odd) {
  border-right: 1px solid #eee;
}
.nav .item image {
  width: 100rpx;
  height: 100rpx;
  margin: 0 auto;
}
.nav .item .title {
  margin-top: 20rpx;
}

/*
 * 提示信息
 */
.tips-container {
  padding: 0 10rpx;
}
</style>
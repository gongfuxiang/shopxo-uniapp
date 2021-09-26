<template>
<view>
<!-- 头部 -->
<view class="head-box oh">
  <view class="head-item tc fl">
    <view class="avatar">
      <image @tap="preview_event" @error="user_avatar_error" :src="avatar" mode="widthFix" class="dis-block"></image>
    </view>
    <text class="item-name dis-block cr-fff">{{nickname}}</text>
  </view>
  <view class="head-base fl">
    <view v-if="(user_level || null) != null && (user_level.name || null) != null" class="single-text level-name spacing-mt">{{user_level.name}}</view>
    <block v-if="(data_base || null) != null && (data_base.is_enable_self_extraction || 0) == 1">
      <navigator url="/pages/plugins/distribution/extraction/extraction" hover-class="none">
        <button size="mini" type="default" hover-class="none" class="head-base-submit">{{(extraction || null) == null ? '申请' : ''}}取货点</button>
      </navigator>
    </block>
  </view>
</view>

<!-- 导航 -->
<view v-if="nav_list.length > 0" class="nav spacing-mt oh bg-white">
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
<view class="tips-container spacing-mb">
  <!-- 不符合分销条件描述 -->
  <block v-if="(user_level || null) == null">
    <view v-if="(data_base.non_conformity_desc || null) != null && data_base.non_conformity_desc.length > 0" class="tips-item spacing-mt">
      <view class="not-opening-vip-desc">
        <view v-for="(item, index) in data_base.non_conformity_desc" :key="index" class="item">
          {{item}}
        </view>
      </view>
    </view>
  </block>

  <!-- 会员中心通知  -->
  <view v-if="(user_level || null) != null && (data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0" class="tips-item spacing-mt">
    <view class="tips">
      <view v-for="(item, index) in data_base.user_center_notice" :key="index" class="item">
        {{item}}
      </view>
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
      user_level: null,
      extraction: null,
      avatar: app.globalData.data.default_user_head_src,
      nickname: "用户名",
      submit_disabled_status: false,
      // 导航
      nav_list: []
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      nav_list: this.nav_list_data()
    });
  },

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

              self.setData({
                avatar: (self.avatar || null) == null ? user.avatar || app.globalData.data.default_user_head_src : self.avatar,
                nickname: user.nickname || '用户名'
              });
            }
          });
        } else {
          self.setData({
            avatar: (self.avatar || null) == null ? user.avatar || app.globalData.data.default_user_head_src : self.avatar,
            nickname: user.nickname || '用户名'
          });
          self.get_data();
        }
      }
    },

    // 导航数据
    nav_list_data() {
      return [{
        icon: "/static/images/plugins/distribution/user-center-order-icon.png",
        title: "分销订单",
        url: "/pages/plugins/distribution/order/order"
      }, {
        icon: "/static/images/plugins/distribution/user-center-profit-icon.png",
        title: "收益明细",
        url: "/pages/plugins/distribution/profit/profit"
      }, {
        icon: "/static/images/plugins/distribution/user-center-team-icon.png",
        title: "我的团队",
        url: "/pages/plugins/distribution/team/team"
      }, {
        icon: "/static/images/plugins/distribution/user-center-poster-icon.png",
        title: "推广返利",
        url: "/pages/plugins/distribution/poster/poster"
      }, {
        icon: "/static/images/plugins/distribution/user-center-statistics-icon.png",
        title: "数据统计",
        url: "/pages/plugins/distribution/statistics/statistics"
      }];
    },

    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "user", "distribution"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            var data_base = data.base || null;
            var user_level = data.user_level || null;
            self.setData({
              data_base: data_base,
              user_level: user_level,
              extraction: data.extraction || null,
              avatar: user_level == null || (user_level.images_url || null) == null ? self.avatar : user_level.images_url,
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: false
            }); // 导航

            var temp_data_list = self.nav_list_data(); // 等级介绍

            if (data_base != null && (data_base.is_show_introduce || 0) == 1) {
              temp_data_list.push({
                icon: "/static/images/plugins/distribution/user-center-introduce-icon.png",
                title: "等级介绍",
                url: "/pages/plugins/distribution/introduce/introduce"
              });
            }

            self.setData({
              nav_list: temp_data_list
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
    },

    // 头像查看
    preview_event() {
      if (app.globalData.data.default_user_head_src != this.avatar) {
        uni.previewImage({
          current: this.avatar,
          urls: [this.avatar]
        });
      }
    },

    // 头像加载错误
    user_avatar_error(e) {
      this.setData({
        avatar: app.globalData.data.default_user_head_src
      });
    }

  }
};
</script>
<style>
/*
 * 头部
 */
.head-box{
  padding-top: 20rpx;
  font-size: 24rpx;
  background-color: #ff6a80;
  position: relative;
}
.head-item {
  padding-bottom: 30rpx;
  width: 165rpx;
}
.head-item .avatar {
  padding: 10rpx;
  background: #fbbec7;
  border: 1px solid #fbbec7;
}
.head-item .avatar image {
  width: 140rpx;
  height: 140rpx;
}
.head-item .avatar,
.head-item .avatar image {
  border-radius: 50%;
}
.head-item .item-name{
  font-size: 30rpx;
  margin-top: 10rpx;
}
.head-item .item-icon {
  width: 30rpx;
  margin-right: 20rpx;
}
.head-item {
  margin-left: 30rpx;
}
.head-base {
  margin-left: 60rpx;
  width: calc(100% - 280rpx);
}
.head-base .level-name {
  font-size: 42rpx;
  font-weight: 500;
  margin-bottom: 30rpx;
  color: #fffbe0;
}
.head-base .head-base-submit {
  font-size: 26rpx;
  height: 55rpx;
  line-height: 55rpx;
  border: 1px solid #ffe2e5;
  background-color: #ffe2e5;
  color: #f77076;
  position: absolute;
  right: 30rpx;
  bottom: 35rpx;
  padding: 0 20rpx;
}

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
.tips-container .tips-item {
  padding: 0 10rpx;
}
.tips-container .not-opening-vip-desc {
  background: #def2fd;
  border: 1px solid #cfeeff;
  color: #1490d2;
  padding: 10rpx;
  font-size: 26rpx;
  border-radius: 2px;
}
</style>
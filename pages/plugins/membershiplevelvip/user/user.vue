<template>
<view>
<!-- 头部 -->
<view class="head-box oh">
  <view class="head-item tc fl">
    <view class="avatar">
      <image @tap="preview_event" @error="user_avatar_error" :src="avatar" mode="widthFix" class="dis-block"></image>
    </view>
    <text class="item-name dis-block cr-gray">{{nickname}}</text>
  </view>
  <view class="head-base fl">
    <block v-if="(user_vip || null) != null">
      <block v-if="(user_vip.user_vip_model || null) == 'pay'">
        <view class="single-text level-name">{{user_vip.level_name}}</view>
        <view class="single-text">
          <block v-if="(user_vip.is_permanent || 0) == 1">
            <text class="title">有效期</text>
            <text class="value cr-fff">{{user_vip.permanent_value}}</text>
            <text class="unit">{{user_vip.permanent_unit}}</text>
          </block>
          <block v-else>
            <block v-if="(user_vip.surplus_time_number || 0) == 0">
              <view class="cr-gray">会员已过期或未开通</view>
              <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                <button v-if="(data_base.is_user_buy || null) == 1" size="mini" type="default" hover-class="none" class="submit-buy">开通会员</button>
              </navigator>
            </block>
            <block v-else>
              <text class="title">有效期</text>
              <text class="value cr-fff">{{user_vip.surplus_time_number}}</text>
              <text class="unit">{{user_vip.surplus_time_unit}}</text>

              <block v-if="(user_vip.is_supported_renew || null) == null || user_vip.is_supported_renew != 1">
                <block v-if="(plugins_base.is_supported_renew_old_order || null) == 1">
                  <button size="mini" type="default" hover-class="none" class="renew-buy" @tap="uservip_renew_event" :disabled="submit_disabled_status">续费会员</button>
                </block>
                <block v-else>
                  <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
                    <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
                      <button size="mini" type="default" hover-class="none" class="submit-buy">连续开通</button>
                    </navigator>
                  </block>
                </block>
              </block>
            </block>
          </block>
        </view>
      </block>
      <block v-else>
        <view class="single-text level-name spacing-mt">{{user_vip.level_name}}</view>
      </block>
    </block>
    <block v-else>
      <block v-if="(data_base || null) != null && (data_base.is_user_buy || 0) == 1">
        <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
          <button size="mini" type="default" hover-class="none" class="submit-buy">开通会员</button>
        </navigator>
      </block>
    </block>
  </view>
</view>

<!-- 导航 -->
<view v-if="nav_list.length > 0 && data_base != null && (data_base.is_user_buy || 0) == 1" class="nav spacing-mt oh bg-white">
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
  <!-- 未开通会员介绍 -->
  <block v-if="(data_base.is_user_buy || 0) == 1">
    <block v-if="((user_vip || null) == null) || ((user_vip || null) == null && (user_vip.surplus_time_number || 0) == 0)">
      <view v-if="(data_base.not_opening_vip_desc || null) != null && data_base.not_opening_vip_desc.length > 0" class="tips-item spacing-mt">
        <view class="not-opening-vip-desc">
          <view v-for="(item, index) in data_base.not_opening_vip_desc" :key="index" class="item">
            {{item}}
          </view>
        </view>
      </view>
    </block>
  </block>

  <!-- 会员中心通知  -->
  <view v-if="(user_vip || null) != null && (data_base.user_vip_center_notice || null) != null && data_base.user_vip_center_notice.length > 0" class="tips-item spacing-mt">
    <view class="tips">
      <view v-for="(item, index) in data_base.user_vip_center_notice" :key="index" class="item">
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
      user_vip: null,
      avatar: app.globalData.data.default_user_head_src,
      nickname: "用户名",
      submit_disabled_status: false,
      // 导航
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

    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "vip", "membershiplevelvip"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            var data_base = data.base || null;
            var user_vip = data.user_vip || null;
            self.setData({
              data_base: data_base,
              user_vip: user_vip,
              avatar: user_vip == null || (user_vip.icon || null) == null ? self.avatar : user_vip.icon,
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: false
            }); // 导航处理

            var nav_list = [];

            if (data_base != null) {
              // 开启会员购买
              if ((data_base.is_user_buy || 0) == 1) {
                nav_list.push({
                  icon: "/static/images/plugins/membershiplevelvip/user-center-order-icon.png",
                  title: "开通订单",
                  url: "/pages/plugins/membershiplevelvip/order/order"
                }); // 开启返佣

                if ((data_base.is_commission || 0) == 1) {
                  nav_list.push({
                    icon: "/static/images/plugins/membershiplevelvip/user-center-profit-icon.png",
                    title: "收益明细",
                    url: "/pages/plugins/membershiplevelvip/profit/profit"
                  });
                } // 开启推广


                if ((data_base.is_propaganda || 0) == 1) {
                  nav_list.push({
                    icon: "/static/images/plugins/membershiplevelvip/user-center-team-icon.png",
                    title: "我的团队",
                    url: "/pages/plugins/membershiplevelvip/team/team"
                  });
                  nav_list.push({
                    icon: "/static/images/plugins/membershiplevelvip/user-center-poster-icon.png",
                    title: "推广返利",
                    url: "/pages/plugins/membershiplevelvip/poster/poster"
                  });
                  nav_list.push({
                    icon: "/static/images/plugins/membershiplevelvip/user-center-statistics-icon.png",
                    title: "数据统计",
                    url: "/pages/plugins/membershiplevelvip/statistics/statistics"
                  });
                }

                nav_list.push({
                  icon: "/static/images/plugins/membershiplevelvip/user-center-index-icon.png",
                  title: "会员首页",
                  url: "/pages/plugins/membershiplevelvip/index/index"
                });
              }
            }

            self.setData({
              nav_list: nav_list
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
    },

    // 连续开通会员事件
    uservip_renew_event(e) {
      var self = this;
      uni.showModal({
        title: '温馨提示',
        content: '按照原时长和费用续费，确定继续吗？',
        confirmText: '确认',
        cancelText: '暂不',
        success: result => {
          if (result.confirm) {
            // 请求生成支付订单
            self.setData({
              submit_disabled_status: true
            });
            uni.showLoading({
              title: "处理中..."
            });
            uni.request({
              url: app.globalData.get_request_url("renew", "buy", "membershiplevelvip"),
              method: "POST",
              data: {},
              dataType: "json",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                uni.hideLoading();
                self.setData({
                  submit_disabled_status: false
                });

                if (res.data.code == 0) {
                  // 进入以后会员中心并发起支付
                  uni.redirectTo({
                    url: '/pages/plugins/membershiplevelvip/order/order?is_pay=1&order_id=' + res.data.data.id
                  });
                } else {
                  if (app.globalData.is_login_check(res.data, self, 'uservip_renew_event')) {
                    app.globalData.showToast(res.data.msg);
                  }
                }
              },
              fail: () => {
                self.setData({
                  submit_disabled_status: false
                });
                uni.hideLoading();
                app.globalData.showToast("服务器请求出错");
              }
            });
          }
        }
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
  background-color: #1d1611;
  position: relative;
}
.head-item {
  padding-bottom: 30rpx;
  width: 165rpx;
}
.head-item .avatar {
  padding: 10rpx;
  background: #3c3835;
  border: 1px solid #3c3835;
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
.head-base .value {
  font-weight: 500;
  font-size: 36rpx;
}
.head-base .title,
.head-base .unit {
  color: #9e9e9e;
}
.head-base .value,
.head-base .unit {
  margin-left: 10rpx;
}
.head-base .level-name {
  font-size: 42rpx;
  font-weight: 500;
  margin-bottom: 30rpx;
  color: #e4cb96;
}
.head-base .submit-buy {
  font-size: 26rpx;
  height: 55rpx;
  line-height: 55rpx;
  border: 1px solid #f9d681;
  background-color: #f9d681;
  color: #351d06;
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
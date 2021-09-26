<template>
<view>
<!-- 头部 -->
<view class="head-box bg-main">
  <view class="head-item oh tc">
    <image @tap="preview_event" @error="user_avatar_error" class="avatar" :src="avatar" mode="widthFix"></image>
    <text class="item-name dis-block cr-fff">{{nickname}}</text>
  </view>

  <!-- 副导航 -->
  <view v-if="common_app_is_head_vice_nav == 1 && head_nav_list.length > 0" class="head-nav oh wh-auto">
    <block v-for="(item, index) in head_nav_list" :key="index">
      <navigator :url="'/pages/' + item.url + '/' + item.url" hover-class="none">
        <view class="head-nav-item tc fl">
          <view>{{item.count}}</view>
          <view>{{item.name}}</view>
        </view>
      </navigator>
    </block>
  </view>

  <!-- 右上角 -->
  <view class="message-nav">
    <navigator url="/pages/message/message" hover-class="none">
      <image src="/static/images/user-head-message-icon.png" mode="aspectFill"></image>
      <text>消息</text>
      <text>{{message_total}}</text>
    </navigator>
  </view>
</view>

<!-- 导航 -->
<view class="nav-box bg-white">
  <block v-for="(item, index) in navigation" :key="index">
    <!-- 主导航 -->
    <view :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" class="nav-item br-b">
      <view class="arrow-right">
        <image :src="item.images_url" class="item-icon" mode="widthFix"></image>
        <text class="item-name">{{item.name}}</text>
        <text v-if="(item.desc || null) != null" class="item-desc fr tr single-text cr-grey">{{item.desc}}</text>
      </view>
    </view>

    <!-- 订单自定义副导航 -->
    <view v-if="item.event_value == '/pages/user-order/user-order' && user_order_status_list.length > 0" class="items-list br-b oh">
      <block v-for="(items, index2) in user_order_status_list" :key="index2">
        <navigator :url="items.url" hover-class="none">
          <view class="items fl tc">
            <view class="badge-icon">
              <component-badge :prop-number="items.count"></component-badge>
            </view>
            <image :src="'/images/user-index-nav-order-icon-' + items.status + '.png'" class="items-icon" mode="aspectFill"></image>
            <view class="items-name">{{items.name}}</view>
          </view>
        </navigator>
      </block>
    </view>
  </block>

  <view class="nav-item br-b" @tap="clear_storage">
    <image src="/static/images/user-nav-cache-icon.png" class="item-icon" mode="widthFix"></image>
    <text class="item-name">清除缓存</text>
  </view>

  <view v-if="(common_app_customer_service_tel || null) != null" class="nav-item" @tap="call_event">
    <image src="/static/images/user-nav-customer-service-icon.png" class="item-icon" mode="widthFix"></image>
    <text class="item-name">客服电话 </text>
    <text class="item-name cr-blue">{{common_app_customer_service_tel}}</text>
  </view>
</view>

<!-- 用户中心公告 -->
<view v-if="(common_user_center_notice || null) != null" class="user-notice">
  <view class="tips">{{common_user_center_notice}}</view>
</view>

<!-- 在线客服 -->
<view v-if="common_app_is_online_service == 1">
  <!--<import src="/pages/lib/online-service/content.wxml"></import>-->
  <template is="online_service"></template>
</view>

<!-- 快捷导航 -->
<component-quick-nav></component-quick-nav>

<!--<import src="/pages/common/copyright.wxml"></import>-->
<template is="copyright"></template>
</view>
</template>

<script>
const app = getApp();
import componentQuickNav from "../../components/quick-nav/quick-nav";
import componentBadge from "../../components/badge/badge";

export default {
  data() {
    return {
      avatar: app.globalData.data.default_user_head_src,
      nickname: "用户名",
      message_total: 0,
      head_nav_list: [{
        name: "订单总数",
        url: "user-order",
        count: 0
      }, {
        name: "商品收藏",
        url: "user-favor",
        count: 0
      }, {
        name: "我的足迹",
        url: "user-goods-browse",
        count: 0
      }, {
        name: "我的积分",
        url: "user-integral",
        count: 0
      }],
      user_order_status_list: [{
        name: "待付款",
        status: 1,
        count: 0,
        url: "/pages/user-order/user-order?status=1"
      }, {
        name: "待发货",
        status: 2,
        count: 0,
        url: "/pages/user-order/user-order?status=2"
      }, {
        name: "待收货",
        status: 3,
        count: 0,
        url: "/pages/user-order/user-order?status=3"
      }, {
        name: "已完成",
        status: 4,
        count: 0,
        url: "/pages/user-order/user-order?status=4"
      }, {
        name: "退款/售后",
        status: 101,
        count: 0,
        url: "/pages/user-orderaftersale/user-orderaftersale"
      }],
      // 远程自定义导航
      navigation: [],
      // 基础配置
      common_app_customer_service_tel: null,
      common_user_center_notice: null,
      common_app_is_online_service: 0,
      common_app_is_head_vice_nav: 0
    };
  },

  components: {
    componentQuickNav,
    componentBadge
  },
  props: {},

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.user
    }); // 数据加载

    this.init(); // 初始化配置

    this.init_config();
  },

  // 下拉刷新
  onPullDownRefresh(e) {
    this.init(e);
  },

  methods: {
    // 初始化配置
    init_config(status) {
      if ((status || false) == true) {
        this.setData({
          common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
          common_user_center_notice: app.globalData.get_config('config.common_user_center_notice'),
          common_app_is_online_service: app.globalData.get_config('config.common_app_is_online_service'),
          common_app_is_head_vice_nav: app.globalData.get_config('config.common_app_is_head_vice_nav')
        });
      } else {
        app.globalData.is_config(this, 'init_config');
      }
    },

    // 获取数据
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
                avatar: user.avatar || app.globalData.data.default_user_head_src,
                nickname: user.user_name_view || user.nickname || '用户名'
              });
            }
          });
        } else {
          self.setData({
            avatar: user.avatar || app.globalData.data.default_user_head_src,
            nickname: user.user_name_view || user.nickname || '用户名'
          });
          self.get_data();
        }
      }
    },

    // 获取数据
    get_data() {
      uni.request({
        url: app.globalData.get_request_url("center", "user"),
        method: "POST",
        data: {},
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data; // 订单数量处理

            var temp_user_order_status_list = this.user_order_status_list;

            if ((data.user_order_status || null) != null && data.user_order_status.length > 0) {
              for (var i in temp_user_order_status_list) {
                for (var t in data.user_order_status) {
                  if (temp_user_order_status_list[i]['status'] == data.user_order_status[t]['status']) {
                    temp_user_order_status_list[i]['count'] = data.user_order_status[t]['count'];
                    break;
                  }
                }
              }
            } // 头部导航总数


            var temp_head_nav_list = this.head_nav_list;
            temp_head_nav_list[0]['count'] = (data.user_order_count || 0) == 0 ? 0 : data.user_order_count;
            temp_head_nav_list[1]['count'] = (data.user_goods_favor_count || 0) == 0 ? 0 : data.user_goods_favor_count;
            temp_head_nav_list[2]['count'] = (data.user_goods_browse_count || 0) == 0 ? 0 : data.user_goods_browse_count;
            temp_head_nav_list[3]['count'] = (data.integral || 0) == 0 ? 0 : data.integral;
            this.setData({
              user_order_status_list: temp_user_order_status_list,
              avatar: (data.avatar || null) != null ? data.avatar : (this.avatar || null) == null ? app.globalData.data.default_user_head_src : this.avatar,
              nickname: (data.user_name_view || null) != null ? data.user_name_view : this.nickname,
              message_total: (data.common_message_total || 0) == 0 ? 0 : data.common_message_total,
              head_nav_list: temp_head_nav_list,
              navigation: data.navigation || []
            }); // 导航购物车处理

            var cart_total = data.common_cart_total || 0;

            if (cart_total <= 0) {
              app.globalData.set_tab_bar_badge(2, 0);
            } else {
              app.globalData.set_tab_bar_badge(2, 1, cart_total);
            }
          } else {
            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.stopPullDownRefresh();
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 清除缓存
    clear_storage(e) {
      // 获取uuid重新存储缓存，一定情况下确保用户的uuid不改变
      var uuid = uni.getStorageSync(app.globalData.data.cache_user_uuid_key) || null; // 清除所有缓存

      uni.clearStorage();
      app.globalData.showToast("清除缓存成功", "success"); // 重新存储用户uuid缓存

      if (uuid != null) {
        uni.setStorage({
          key: app.globalData.data.cache_user_uuid_key,
          data: uuid
        });
      }
    },

    // 客服电话
    call_event() {
      if (this.common_app_customer_service_tel == null) {
        app.globalData.showToast("客服电话有误");
      } else {
        app.globalData.call_tel(this.common_app_customer_service_tel);
      }
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

    // 远程自定义导航事件
    navigation_event(e) {
      app.globalData.operation_event(e);
    }

  }
};
</script>
<style>
/* 头部 */
.head-box{
    padding-top: 30rpx;
    font-size: 24rpx;
}
.head-item {
  padding-bottom: 30rpx;
}
.head-item .avatar {
    width: 160rpx;
    height: 160rpx;
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

/* 头部导航 */
.head-nav {
  padding: 5px 0;
  background: rgba(0,0,0,0.1);
}
.head-nav-item {
  width: 25%;
  padding: 5rpx 0;
}
.head-nav-item view {
  line-height: 38rpx;
}
.head-nav-item view, .message-nav text {
  color: #ffd7d7;
}
.message-nav {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}
.message-nav image {
  width: 28rpx;
  height: 28rpx;
  vertical-align: middle;
}
.message-nav text {
  margin-left: 5rpx;
  font-size: 24rpx;
}

/* 导航列表 */
.nav-box .nav-item {
    height: 100rpx;
    box-sizing: border-box;
    padding: 30rpx 20rpx;
}
.nav-box .nav-item .item-icon {
    width: 40rpx;
    height: 40rpx;
    vertical-align: middle;
}
.nav-box .nav-item .item-name {
    margin-left: 20rpx;
    vertical-align: middle;
}
.nav-box .nav-item .item-desc {
  margin-right: 50rpx;
  margin-top: 2rpx;
  width: calc(100% - 300rpx);
}
.nav-box .nav-item .item-arrow {
    width: 25rpx;
}

.items-list {
  padding: 15rpx 0;
}
.items-list .items {
  width: 20%;
  position: relative;
}
.items-list .items .items-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 6rpx;
}
.items-list .items .badge-icon {
  position: absolute;
  top: -2px;
  left: calc(50% + 35rpx);
}

/* 通知 */
.user-notice { margin-top: 20rpx; padding: 0 10rpx 20rpx 10rpx; }
</style>
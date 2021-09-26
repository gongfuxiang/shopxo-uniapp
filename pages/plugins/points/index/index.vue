<template>
<view>
<view v-if="(data_base || null) != null">
  <!-- 顶部 -->
  <view class="points-user tc">
    <navigator class="points-user-menu-submit" url="/pages/user-integral/user-integral" hover-class="none">我的积分</navigator>
    <block v-if="(user || null) == null">
      <button type="default" size="mini" class="login-submit" @tap="login_event">立即登录</button>
      <view class="user-desc">获知会员积分详情</view>
    </block>
    <block v-else>
      <view class="avatar">
        <image @tap="preview_event" :src="user.avatar || avatar_default" mode="widthFix" class="dis-block"></image>
      </view>
      <view class="user-name">{{user.user_name_view}}</view>
      <view class="user-desc">当前可用 {{user_integral.integral || 0}} 积分</view>
    </block>

    <!-- 按钮组 -->
    <view class="submit-container">
      <button type="default" size="mini" open-type="share" class="share-submit">分享</button>
    </view>
  </view>

  <!-- 广告图片 -->
  <image v-if="(data_base.right_images || null) != null" :src="data_base.right_images" class="wh-auto dis-block spacing-mt" mode="widthFix" @tap="right_images_event"></image>

  <!-- 公告信息 -->
  <view v-if="(data_base.points_desc || null) != null && data_base.points_desc.length > 0" class="tips spacing-mt">
    <view v-for="(item, index) in data_base.points_desc" :key="index" class="item">
      {{item}}
    </view>
  </view>

  <!-- 商品兑换 -->
  <view v-if="(data_base.goods_exchange_data || null) != null && data_base.goods_exchange_data.length > 0" class="spacing-mt">
    <view class="spacing-nav-title">
      <text class="line"></text>
      <text class="text-wrapper">商品兑换</text>
    </view>
    <view class="data-list spacing-10">
      <view v-for="(item, index) in data_base.goods_exchange_data" :key="index" class="items bg-white">
        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods.id" hover-class="none">
          <image :src="item.goods.images" mode="aspectFit"></image>
          <view class="base">
            <view class="multi-text">{{item.goods.title}}</view>
            <view class="price single-text original-price">{{currency_symbol}}{{item.goods.price}}</view>
            <view class="price single-text">
              <text class="unit">需</text>
              <text class="sales-price">{{item.integral}}</text>
              <text class="unit">积分</text>
            </view>
          </view>
        </navigator>
      </view>
    </view>
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

export default {
  data() {
    return {
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      params: null,
      user: null,
      data_base: null,
      user_integral: null,
      avatar_default: app.globalData.data.default_user_head_src,
      currency_symbol: ""
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      params: params,
      user: app.globalData.get_user_cache_info()
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
      title: this.data_base.seo_title || '积分商城 - ' + app.globalData.data.application_title,
      desc: this.data_base.seo_desc || '积分抵扣、兑换 - ' + app.globalData.data.application_describe,
      path: '/pages/plugins/points/index/index?referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data_base.seo_title || '积分商城 - ' + app.globalData.data.application_title,
      query: 'referrer=' + user_id,
      imageUrl: this.data_base.right_images || ''
    };
  },

  methods: {
    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "index", "points"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              user_integral: data.user_integral || null,
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: true
            });
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

    // 立即登录
    login_event() {
      var user = app.globalData.get_user_info(this, "login_event");

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
        }
      }

      this.setData({
        user: user || null
      });
    },

    // 图片事件
    right_images_event(e) {
      if ((this.data_base.right_images_url || null) != null) {
        uni.navigateTo({
          url: this.data_base.right_images_url
        });
      }
    },

    // 头像查看
    preview_event() {
      if (app.globalData.data.default_user_head_src != this.user.avatar) {
        uni.previewImage({
          current: this.user.avatar,
          urls: [this.user.avatar]
        });
      }
    }

  }
};
</script>
<style>
/**
 * 顶部
 */
.points-user {
  background-color: #fe3e28;
  position: relative;
  padding: 100rpx 0 120rpx 0;
}
.points-user .avatar {
  padding: 1px;
  background: #ff9589;
  margin: 0 auto;
}
.points-user .avatar,
.points-user .avatar image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}
.points-user .user-name {
  color: #fff;
  margin: 10rpx 0  20rpx 0;
}
.points-user .user-desc {
  color: #ffe7b2;
}
.points-user-menu-submit {
  border: 1px solid #ffd606;
  color: #fae501;
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 6rpx 20rpx;
  border-radius: 3rpx;
}
.submit-container {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
}
.submit-container button:not(:first-child) {
  margin-left: 30rpx;
}
button.login-submit {
  color: #5eb95e;
  background-color: #E4F3E4;
  border-color: #d2e8d2;
  margin-bottom: 30rpx;
}
.submit-container button.share-submit {
  color: #F37B1D;
  background-color: #ffe5be;
  border-color: #f8d093;
}

/**
 * 商品导航
 */
.spacing-nav-title {
  color: #fe3e28;
}
.spacing-nav-title .line {
  background: #fe3e28;
}

/**
 * 商品列表
 */
.data-list {
   overflow: hidden;
}
.data-list .items {
   width: calc(50% - 5rpx);
   margin-bottom: 10rpx;
   padding-bottom: 20rpx;
}
.data-list .items:nth-child(2n) {
   float: right;
}
.data-list .items:nth-child(2n+1) {
   float: left;
}
.data-list .items image {
   width: 100%;
   height: 200px !important;
}
.data-list .items .base {
   text-align: left;
   font-size: 32rpx;
   padding: 0 15rpx;
}
.data-list .items .base,
.data-list .items .base .price {
   margin-top: 10rpx;
}
.data-list .items .base .original-price {
  margin-left: 0;
}
.data-list .items .base .price .sales-price {
  margin: 0 5rpx;
}
.data-list .items .base .price .unit {
  color: #f40;
}
</style>
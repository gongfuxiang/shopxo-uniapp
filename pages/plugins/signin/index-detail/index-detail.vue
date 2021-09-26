<template>
<view>
<view v-if="(data || null) != null">
  <!-- 签到 -->
  <view class="coming-container tc">
    <navigator v-if="(data_base.is_user_menu || 0) == 1" class="signin-user-menu-submit" url="/pages/plugins/signin/user-signin/user-signin" hover-class="none">我的签到</navigator>
    <view :class="'coming-submit ' + ((is_already_coming == 1) ? 'already-coming' : '')" @tap="coming_event">签到</view>
    <block v-if="(user || null) == null">
      <view class="coming-title">登录签到获得积分奖励</view>
    </block>
    <block v-else>
      <!-- 是否已签到 -->
      <block v-if="(user_signin_data || null) != null && (user_signin_data.integral || 0) > 0">
        <view class="coming-title">今日已签到，获得{{user_signin_data.integral}}积分，共{{user_signin_data.total}}次</view>
        <view class="coming-tips">请明日继续签到，更多积分奖励</view>
      </block>
      <block v-else>
        <view class="coming-title am-margin-top-sm">立即签到获得积分奖励</view>
      </block>

      <!-- 队长 -->
      <block v-if="(team_signin_data || null) != null && user.id == data.user_id">
        <view class="coming-title">
          <text>今日{{team_signin_data.day}}人签到，共{{team_signin_data.total}}人</text>
          <navigator v-if="(data_base.is_team_show_coming_user || 0) == 1" :url="'/pages/plugins/signin/user-coming-list/user-coming-list?id=' + data.id" hover-class="none" class="detail-submit">详情 >></navigator>
        </view>
        <view class="coming-tips">分享获得更多奖励</view>
      </block>
    </block>

    <!-- 按钮组 -->
    <view class="submit-container">
      <button v-if="(data_base.is_team) == 1 && (user || null) != null && data.user_id != user.id" type="default" size="mini" class="team-submit" @tap="team_event">组队</button>
      <button v-if="(data_base.is_share) == 1" type="default" size="mini" open-type="share" class="share-submit">分享</button>
    </view>
  </view>

  <!-- 广告图片 -->
  <image v-if="(data.right_images || null) != null" :src="data.right_images" class="wh-auto dis-block spacing-mt" mode="widthFix" @tap="right_images_event"></image>

  <!-- 公告信息 -->
  <view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="tips spacing-mt">
    <view v-for="(item, index) in data_base.signin_desc" :key="index" class="item">
      {{item}}
    </view>
  </view>

  <!-- 推荐商品 -->
  <view v-if="(data.goods_list || null) != null && data.goods_list.length > 0" class="spacing-mt">
    <view class="spacing-nav-title">
      <text class="line"></text>
      <text class="text-wrapper">推荐商品</text>
    </view>
    <view class="data-list spacing-10">
      <view v-for="(item, index) in data.goods_list" :key="index" class="items bg-white">
        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.id" hover-class="none">
          <image :src="item.images" mode="aspectFit"></image>
          <view class="base">
            <view class="multi-text">{{item.title}}</view>
            <view class="price single-text">
              <text class="sales-price">{{currency_symbol}}{{item.price}}</text>
            </view>
          </view>
        </navigator>
      </view>
    </view>
  </view>

  <!-- 签到成功提示信息 -->
  <view v-if="is_success_tips == 1" class="coming-tips-container am-text-center">
    <view class="coming-content tc">
      <view class="icon-close-submit" @tap="coming_success_close_event">
        <icon type="clear" size="20"></icon>
      </view>
      <image src="/static/images/plugins/signin/coming-success-icon.png" mode="widthFix"></image>
      <view class="coming-tips-content">
          <text class="coming-tips-text">获得 <text>{{coming_integral}}</text> 积分</text>
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
      data: null,
      team_signin_data: null,
      user_signin_data: null,
      is_already_coming: 0,
      is_success_tips: 0,
      coming_integral: 0,
      currency_symbol: ""
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    //params['id'] = 1;
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
      title: this.data.seo_title || '签到 - ' + app.globalData.data.application_title,
      desc: this.data.seo_desc || '签到获得积分奖励 - ' + app.globalData.data.application_describe,
      path: '/pages/plugins/signin/index-detail/index-detail?id=' + this.data.id + '&referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data.seo_title || '签到 - ' + app.globalData.data.application_title,
      query: 'id=' + this.data.id + '&referrer=' + user_id,
      imageUrl: this.data.right_images || ''
    };
  },

  methods: {
    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("detail", "index", "signin"),
        method: "POST",
        data: {
          id: this.params.id || 0
        },
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              data: data.data || null,
              team_signin_data: data.team_signin_data || null,
              user_signin_data: data.user_signin_data || null,
              is_already_coming: (data.user_signin_data || null) != null && (data.user_signin_data.integral || 0) > 0 ? 1 : 0,
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

    // 初始化
    init() {
      var user = app.globalData.get_user_info(this, "init");

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
          return true;
        }
      }

      return false;
    },

    // 签到
    coming_event(e) {
      if (this.is_already_coming != 1 && this.init()) {
        var self = this;
        uni.showLoading({
          title: "处理中..."
        });
        uni.request({
          url: app.globalData.get_request_url("coming", "index", "signin"),
          method: "POST",
          data: {
            id: this.data.id
          },
          dataType: "json",
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              this.setData({
                is_already_coming: 1,
                is_success_tips: 1,
                coming_integral: res.data.data
              });
              this.get_data();
            } else {
              if (app.globalData.is_login_check(res.data, self, 'team_request')) {
                app.globalData.showToast(res.data.msg);
              }
            }
          },
          fail: () => {
            uni.hideLoading();
            app.globalData.showToast("服务器请求出错");
          }
        });
      }
    },

    // 签到成功提示关闭
    coming_success_close_event(e) {
      this.setData({
        is_success_tips: 0
      });
    },

    // 组队事件
    team_event(e) {
      if (this.init()) {
        var self = this;
        uni.showLoading({
          title: "处理中..."
        });
        uni.request({
          url: app.globalData.get_request_url("team", "userqrcode", "signin"),
          method: "POST",
          data: {},
          dataType: "json",
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              switch (res.data.data.status) {
                // 组队成功
                case 0:
                  // 设置签到码id
                  var temp_params = this.params;
                  temp_params['id'] = res.data.data.qrcode_id;
                  this.setData({
                    params: temp_params
                  }); // 重新拉取数据

                  this.get_data();
                  break;
                // 需要填写联系人信息

                case 1:
                  uni.navigateTo({
                    url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?is_team=1'
                  });
                  break;
              }
            } else {
              if (app.globalData.is_login_check(res.data, self, 'team_request')) {
                app.globalData.showToast(res.data.msg);
              }
            }
          },
          fail: () => {
            uni.hideLoading();
            app.globalData.showToast("服务器请求出错");
          }
        });
      }
    },

    // 图片事件
    right_images_event(e) {
      if ((this.data.right_images_url || null) != null) {
        uni.navigateTo({
          url: this.data.right_images_url
        });
      }
    }

  }
};
</script>
<style>
/**
 * 签到
 */
.coming-container {
  background-color: #f6b015;
  position: relative;
  padding: 100rpx 0 120rpx 0;
}
.coming-submit {
  width: 200rpx;
  height: 200rpx;
  line-height: 200rpx;
  border-radius: 50%;
  background-color: #F37B1D;
  color: #f8fb0b;
  border: 12rpx solid #f9f420;
  font-size: 62rpx;
  margin: 0 auto;
}
.already-coming {
  border: 12rpx solid #bebebe;
  background-color: #ccc;
  color: #9f9f9f;
}
.coming-title {
  color: #fff;
  margin-top: 20rpx;
}
.coming-tips {
  color: #ffe7b2;
}
.signin-user-menu-submit {
  border: 1px solid #fff900;
  color: #fffb62;
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 6rpx 20rpx;
  border-radius: 3rpx;
}
.detail-submit {
  margin-left: 20rpx;
  color: #0e90d2;
  display: inline;
}
.submit-container {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
}
.submit-container button:not(:first-child) {
  margin-left: 30rpx;
}
.submit-container button.team-submit {
  color: #5eb95e;
  background-color: #E4F3E4;
  border-color: #d2e8d2;
}
.submit-container button.share-submit {
  color: #F37B1D;
  background-color: #ffe5be;
  border-color: #f8d093;
}

/**
 * 签到成功提示
 */
 .coming-tips-container {
  position: fixed;
  left: 0;
  top: 0;/*  #ifdef  H5  */
  top: calc(88rpx + constant(safe-area-inset-top));
  top: calc(88rpx + env(safe-area-inset-top));/*  #endif  */
  width: 100%;
  height: 100%;
  z-index: 1050;
  background: rgb(0 0 0 / 0.6);
  padding-top: 30%;
}
.coming-content {
  max-width: 300px;
  height: 305px;
  margin: 0 auto;
  position: relative;
}
.coming-content .icon-close-submit {
  position: absolute;
  top: 5px;
  right: 5px;
}
.coming-tips-container image {
  max-width: 100%;
  margin-top:60rpx;
}
.coming-tips-content .coming-tips-text {
  background: #fff;
  color: #f00;
  padding: 10rpx 20rpx;
  border-radius: 1000rpx;
}

/**
 * 商品导航
 */
.spacing-nav-title {
  color: #f6b015;
}
.spacing-nav-title .line {
  background: #f6b015;
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
   margin-top: 15rpx;
}
</style>
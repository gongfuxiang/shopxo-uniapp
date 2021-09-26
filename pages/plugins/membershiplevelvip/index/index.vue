<template>
<view>
<view v-if="(data_base || null) != null" class="banner tc" :style="'background-image: url(' + data_base.banner_bg_images + ');'">
  <!-- banner -->
  <view v-if="(data_base.banner_top_title || null) != null" class="single-text banner-title">
    {{data_base.banner_top_title}}
  </view>
  <view class="submit">
    <navigator url="/pages/plugins/membershiplevelvip/buy/buy" hover-class="none">
      <button size="mini" type="default" hover-class="none">
        {{data_base.banner_middle_name || '开通会员'}}
      </button>
    </navigator>
  </view>

  <!-- 数据列表 -->
  <view v-if="(data_list || null) != null && data_list.length > 0" class="data-list">
    <view v-for="(item, index) in data_list" :key="index" class="item fl">
      <view class="content">
        <view class="title single-text">{{item.name}}</view>
        <view class="desc multi-text">{{item.desc}}</view>
        <image :src="item.images_url" mode="scaleToFill" class="dis-block"></image>
      </view>
    </view>
  </view>
</view>

<view v-if="(data_base.banner_bottom_content || null) != null" class="bg-white rich-text">
  <rich-text :nodes="data_base.banner_bottom_content"></rich-text>
</view>

<view v-if="(data_base || null) == null && (data_list || null) == null && data_list.length <= 0">
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

<!--<import src="/pages/common/bottom_line.wxml"></import>-->
<block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
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
      data_list: [],
      data_base: null
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.init(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data_list();
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var name = (this.data_base || null) != null && (this.data_base.application_name || null) != null ? this.data_base.application_name : app.globalData.data.application_title;
    return {
      title: name,
      desc: app.globalData.data.application_describe,
      path: '/pages/index/index?referrer=' + user_id
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
    get_data_list() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });

      if (self.data_list.length <= 0) {
        self.setData({
          data_list_loding_status: 1
        });
      }

      uni.request({
        url: app.globalData.get_request_url("index", "index", "membershiplevelvip"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              data_list: data.data || [],
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: true
            }); // 导航名称

            if ((data.base || null) != null && (data.base.application_name || null) != null) {
              uni.setNavigationBarTitle({
                title: data.base.application_name
              });
            }
          } else {
            self.setData({
              data_bottom_line_status: false,
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'get_data_list')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.hideLoading();
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
/**
 * banner
 */
.banner {
    background-color: #1d1611;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: auto 100%;
    position: relative;
    height: 1110rpx;
    width: 100%;
    overflow: hidden;
}
.banner .banner-title {
    font-size: 60rpx;
    margin-top: 50rpx;
    color: #f9d681;
    height: 68rpx;
    overflow: hidden;
}
.banner .submit {
    margin-top: 60rpx;
}
.banner .submit button {
    border: 1rpx solid #f9d681;
    background-color: #f9d681;
    color: #351d06;
    width: 320rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 36rpx;
    border-radius: 50rpx;
    font-weight: 500;
}

/**
 * 等级介绍
 */
.data-list {
    margin-top: 40rpx;
}
.data-list .item {
    padding: 15rpx;
    width: calc(50% - 30rpx);
}
.data-list .item .content {
    overflow: hidden;
    border-radius: 8rpx;
    background-color: #fff;
    padding: 30rpx 10rpx;
}
.data-list .item .content .title {
    height: 36rpx;
    line-height: 36rpx;
    font-size: 36rpx;
    color: #333;
}
.data-list .item .content .desc {
    height: 76rpx;
    line-height: 38rpx;
    font-size: 30rpx;
    color: #999;
}
.data-list .item .content .title,
.data-list .item .content .desc {
  margin-bottom: 15rpx;
}
.data-list .item .content image {
    max-width: 160rpx;
    max-height: 160rpx;
    margin:0 auto;
}

/**
 * 富文本
 */
.rich-text {
  padding: 20rpx 10rpx;
}
</style>
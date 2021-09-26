<template>
<view>
<view v-if="(data || null) != null">
  <!-- 头部 -->
  <block v-if="(data.is_header || 0) == 1">
    <!--<import src="/pages/plugins/shop/public/header.wxml"></import>-->
    <block data-type="template" data-is="shop-header" data-attr="data_base: data_base, shop: shop, shop_navigation: shop_navigation, shop_goods_category: shop_goods_category, shop_favor_info: shop_favor_info, search_keywords_value: search_keywords_value, header_service_status: header_service_status, nav_category_status: nav_category_status">
  <!-- 搜索 -->
  <view class="search oh">
    <input type="done" placeholder="请输入您搜索的商品关键字" :value="search_keywords_value || ''" class="bg-white wh-auto fl" placeholder-class="cr-grey" @input="search_keywords_event">
    <view class="search-btn fr">
      <button class="mini-btn" type="default" size="mini" hover-class="none" @tap="search_button_event" data-value="/pages/goods-search/goods-search?">搜全站</button>
      <button class="mini-btn" type="default" size="mini" hover-class="none" @tap="search_button_event" :data-value="'/pages/plugins/shop/search/search?shop_id=' + shop.id + '&'">搜本店</button>
    </view>
  </view>
  <!-- 顶部 -->
  <view class="header bg-white oh">
    <image :src="shop.logo_long" mode="widthFix" class="shop-logo fl br-r padding-right-lg"></image>
    <view class="base fr">
      <view class="shop-title single-text">
        <text v-if="((data_base.is_auth_fill_info || 0) == 1 || (data_base.is_auth_upload_pic || 0) == 1) && shop.auth_type == 1 && (shop.auth_type_name || null) != null" class="shop-auth-icon">{{shop.auth_type_name}}</text>
        <text>{{shop.name}}</text>
      </view>
      <view class="base-bottom oh margin-top-sm">
        <view v-if="(data_base.is_service_info || 0) == 1" class="fl margin-right-xxl" @tap="header_service_event">
          <image src="/static/images/user-nav-customer-service-icon.png" mode="scaleToFill" class="va-m"></image>
          <text class="va-m cr-base">在线客服</text>
        </view>
        <view class="fl single-text" @tap="shop_favor_event">
          <image :src="'/images/default-favor-icon-' + shop_favor_info.status + '.png'" mode="scaleToFill" class="va-m"></image>
          <text :class="'va-m ' + (shop_favor_info.status == 1 ? 'cr-main' : '')">{{shop_favor_info.text}}({{shop_favor_info.count}})</text>
        </view>
      </view>
    </view>
  </view>
  <!-- 在线客服 -->
  <view v-if="header_service_status && (data_base.is_service_info || 0) == 1" class="header-service bg-white oh padding-top-xxl br">
    <view v-if="(shop.service_weixin_qrcode || null) != null" class="tc margin-bottom-sm">
      <image :src="shop.service_weixin_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="shop.service_weixin_qrcode"></image>
      <view>点击长按微信咨询</view>
    </view>
    <view v-if="(shop.service_qq || null) != null" class="item br-t single-text">
      <text>QQ：</text>
      <text @tap="text_copy_event" :data-value="shop.service_qq">{{shop.service_qq}}</text>
    </view>
    <view v-if="(shop.service_tel || null) != null" class="item br-t single-text">
      <text>电话：</text>
      <text @tap="tel_event" :data-value="shop.service_tel">{{shop.service_tel}}</text>
    </view>
    <view v-if="(shop.open_week_name || null) != null && (shop.close_week_name || null) != null" class="item br-t single-text">
      <text>时间：</text>
      <text @tap="text_copy_event" :data-value="shop.open_week_name + '至' + shop.close_week_name + '，' + shop.open_time + '-' + shop.close_time">{{shop.open_week_name}}至{{shop.close_week_name}}，{{shop.open_time}}-{{shop.close_time}}</text>
    </view>
  </view>
  <!-- 导航 -->
  <view class="nav nav-roll bg-white padding-top-lg">
    <view class="item arrow-bottom nav-shop-category fl" @tap="nav_shop_category_event">查看商品分类</view>
    <scroll-view scroll-x class="nav-scroll">
      <block v-if="shop_navigation.length > 0">
        <block v-for="(item, index) in shop_navigation" :key="index">
          <view class="item" @tap="nav_event" :data-value="item.url" :data-index="index">{{item.name}}</view>
        </block>
      </block>
    </scroll-view>
    <view v-if="nav_category_status" class="nav-category bg-white tc">
      <scroll-view scroll-y class="category-scroll">
        <block v-if="shop_goods_category.length > 0">
          <block v-for="(item, index) in shop_goods_category" :key="index">
            <view class="item single-text" @tap="shop_category_event" :data-value="item.id">{{item.name}}</view>
          </block>
        </block>
        <block v-else>
          <view class="padding-top-xxl padding-bottom-xxl cr-grey">暂无数据</view>
        </block>
      </scroll-view>
    </view>
  </view>
</block>
  </block>

  <!-- 拖拽模式、引入拖拽数据模块 -->
  <component-layout :prop-data="layout_data"></component-layout>

  <!-- 结尾 -->
  <block v-if="(data.is_footer || 0) == 1">
    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
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
import componentLayout from "../../../../components/layout/layout";

export default {
  data() {
    return {
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      params: null,
      user: null,
      data_base: null,
      shop: null,
      shop_favor_user: [],
      shop_navigation: [],
      shop_goods_category: [],
      data: null,
      layout_data: [],
      // 基础配置
      search_keywords_value: '',
      header_service_status: false,
      nav_category_status: false,
      shop_category_tab_value: 0,
      shop_favor_info: {
        "text": "收藏",
        "status": 0,
        "count": 0
      }
    };
  },

  components: {
    componentLayout
  },
  props: {},

  onLoad(params) {
    // 启动参数处理
    params = app.globalData.launch_params_handle(params);
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
      title: this.data.name || this.data.seo_title || app.globalData.data.application_title,
      desc: this.data.seo_desc || app.globalData.data.application_describe,
      path: '/pages/plugins/shop/design/design?id=' + this.data.id + '&referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data.name || this.data.seo_title || app.globalData.data.application_title,
      query: 'id=' + this.data.id + '&referrer=' + user_id,
      imageUrl: this.data.logo || ''
    };
  },

  methods: {
    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "design", "shop"),
        method: "POST",
        data: {
          "id": this.params.id || 0
        },
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              shop: (data.shop || null) == null || data.shop.length <= 0 ? null : data.shop,
              shop_favor_user: data.shop_favor_user || [],
              shop_navigation: data.shop_navigation || [],
              shop_goods_category: data.shop_goods_category || [],
              data: (data.data || null) != null && data.data.length != 0 ? data.data : null,
              layout_data: data.layout_data || [],
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: true
            }); // 收藏信息

            if ((this.shop || null) != null) {
              var status = this.shop_favor_user.indexOf(this.shop.id) != -1 ? 1 : 0;
              this.setData({
                shop_favor_info: {
                  "count": this.shop.shop_favor_count || 0,
                  "status": status,
                  "text": (status == 1 ? '已' : '') + '收藏'
                }
              });
            } // 标题名称


            if ((this.data || null) != null) {
              uni.setNavigationBarTitle({
                title: this.data.name
              });
            }
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

    // 店铺收藏事件
    shop_favor_event(e) {
      var user = app.globalData.get_user_info(this, 'shop_favor_event');

      if (user != false) {
        // 用户未绑定用户则转到登录页面
        if (app.globalData.user_is_need_login(user)) {
          uni.navigateTo({
            url: "/pages/login/login?event_callback=shop_favor_event"
          });
          return false;
        } else {
          uni.showLoading({
            title: '处理中...'
          });
          uni.request({
            url: app.globalData.get_request_url("favor", "shopfavor", "shop"),
            method: 'POST',
            data: {
              "id": this.shop.id
            },
            dataType: 'json',
            success: res => {
              uni.hideLoading();

              if (res.data.code == 0) {
                this.setData({
                  shop_favor_info: res.data.data
                });
                app.globalData.showToast(res.data.msg, "success");
              } else {
                if (app.globalData.is_login_check(res.data, this, 'shop_favor_event')) {
                  app.globalData.showToast(res.data.msg);
                }
              }
            },
            fail: () => {
              uni.hideLoading();
              app.globalData.showToast('服务器请求出错');
            }
          });
        }
      }
    },

    // 搜索输入事件
    search_keywords_event(e) {
      this.setData({
        search_keywords_value: e.detail.value || ''
      });
    },

    // 搜索事件
    search_button_event(e) {
      var value = e.currentTarget.dataset.value || null;
      uni.navigateTo({
        url: value + 'keywords=' + this.search_keywords_value || ''
      });
    },

    // 导航分类事件
    header_service_event(e) {
      this.setData({
        header_service_status: !this.header_service_status
      });
    },

    // 导航分类事件
    nav_shop_category_event(e) {
      this.setData({
        nav_category_status: !this.nav_category_status
      });
    },

    // 导航分类事件
    shop_category_event(e) {
      var value = e.currentTarget.dataset.value || null;
      uni.navigateTo({
        url: '/pages/plugins/shop/search/search?shop_id=' + this.shop.id + '&category_id=' + value
      });
    },

    // 导航事件
    nav_event(e) {
      app.globalData.url_event(e);
    },

    // 剪切板
    text_copy_event(e) {
      app.globalData.text_copy_event(e);
    },

    // 电话
    tel_event(e) {
      app.globalData.call_tel(e.currentTarget.dataset.value || null);
    },

    // 图片预览
    image_show_event(e) {
      app.globalData.image_show_event(e);
    }

  }
};
</script>
<style>
/**
 * 搜索
 */
.search {
  background: #d2364c;
  padding: 20rpx 10rpx 25rpx 20rpx;
  position: relative;
}
.search input {
  width: calc(100% - 328rpx);
  padding-left: 15rpx;
  font-size: 24rpx;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.search input,.search-btn button {
  height: 52rpx;
  line-height: 52rpx;
  border-radius: 6rpx;
}
.search-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}
.search-btn button {
  color: #fff;
  width: 150rpx;
  font-size: 24rpx;
  padding: 0;
}
.search-btn button:first-child {
  background: #ff8c00;
  border: 1px solid #ff8c00;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.search-btn button:last-child {
  background: #483E39;
  border: 1px solid #483E39;
  margin-left: 10rpx;
}

/**
 * 头部
 */
.header {
  padding: 20rpx 10rpx;
}
.shop-logo {
  width: 280rpx;
  margin-top: 5rpx;
}
.base-bottom image {
  width: 28rpx;
  height: 28rpx;
  margin-right: 5rpx;
}
.header .base {
  width: calc(100% - 320rpx);
}
.shop-title {
  font-size: 32rpx;
  font-weight: bold;
  line-height: 40rpx;
}
.shop-auth-icon {
  background-color: #f4c985;
  border: 1px solid #e7ba77;
  border-radius: 6rpx;
  color: #856651;
  text-align: center;
  padding: 2rpx 12rpx;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

/**
 * 客服
 */
.header-service {
  width: 400rpx;
  position: absolute;
  left: 80rpx;
  top: 210rpx;
  z-index: 2;
  font-size: 24rpx;
  -webkit-box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
  box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
}
.header-service image {
  width: 260rpx;
  height: 260rpx;
}
.header-service .item {
  padding: 20rpx;
}

/**
 * 滚动
 */
.nav-roll {
  width: 100%;
  white-space: nowrap;
  box-sizing: border-box;
}
.nav-roll .item {
  display: inline-block;
}

/**
 * 导航
 */
.nav {
  height: 70rpx;
  border-bottom: 1px solid #d2364c;
}
.nav .nav-scroll {
  float: right;
  width: calc(100% - 230rpx);
}
.nav .item {
  padding: 0 20rpx;
  font-weight: bold;
}
.nav-shop-category {
  padding-right: 38rpx !important;
  background-size: 14px 14px;
}

/**
 * 导航商品分类
 */
.nav-category {
  background: #d2364c;
  width: 220rpx;
  z-index: 1;
  position: absolute;
  margin-top: 50rpx;
  border: 1px solid #d2364c;
  -webkit-box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
  box-shadow: 0 10px 10px rgb(0 0 0 / 30%);
}
.nav-category .category-scroll {
  max-height: 600rpx;
}
.nav-category .item {
  padding: 15rpx 20rpx;
  display: block;
  font-weight: inherit;
  color: #f1f1f1;
}
.nav-category .item:not(:last-child) {
  border-bottom: 1px solid #c72e44;
}
</style>
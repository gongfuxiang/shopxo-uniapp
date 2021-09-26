<template>
<view>
<view v-if="(data_base || null) != null">
  <!-- 分类 -->
  <scroll-view v-if="(brand_category_list || null) != null && brand_category_list.length > 0" class="nav-list bg-white tc oh" scroll-x="true">
    <view :class="'item cr-gray ' + (nav_active_value == 0 ? 'active' : '')" @tap="nav_event" data-value="0">全部</view>
    <block v-for="(item, index) in brand_category_list" :key="index">
      <view :class="'item cr-gray ' + (nav_active_value == item.id ? 'active' : '')" @tap="nav_event" :data-value="item.id">{{item.name}}</view>
    </block>
  </scroll-view>

  <!-- 品牌列表 -->
  <view v-if="(brand_list || null) != null && brand_list.length > 0" class="data-list oh spacing-mt">
    <block v-for="(item, index) in brand_list" :key="index">
      <view v-if="(item.is_not_show || 0) == 0" class="items bg-white">
        <navigator :url="'/pages/goods-search/goods-search?brand_id=' + item.id" hover-class="none">
          <image :src="item.logo" mode="aspectFit"></image>
          <view class="base br-t-dashed">
            <view class="single-text name tc">{{item.name}}</view>
            <view class="multi-text desc">{{item.describe}}</view>
            </view>
        </navigator>
      </view>
    </block>
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
<view v-if="data_list_loding_status != 3">
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
      data_base: null,
      brand_list: [],
      brand_category_list: [],
      nav_active_value: 0
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      params: params
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
      title: this.data_base.seo_title || '品牌 - ' + app.globalData.data.application_title,
      desc: this.data_base.seo_desc || app.globalData.data.application_describe,
      path: '/pages/plugins/brand/index/index?referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data_base.seo_title || '品牌 - ' + app.globalData.data.application_title,
      query: 'referrer=' + user_id,
      imageUrl: this.data_base.right_images || ''
    };
  },

  methods: {
    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "index", "brand"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              brand_list: data.brand_list || [],
              brand_category_list: data.brand_category_list || [],
              data_list_loding_msg: '',
              data_list_loding_status: (data.brand_list || []).length > 0 ? 3 : 0,
              data_bottom_line_status: (data.brand_list || []).length > 0
            }); // 选中处理

            self.nav_active_handle();
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

    // 导航事件
    nav_event(e) {
      this.setData({
        nav_active_value: e.currentTarget.dataset.value || 0
      });
      this.nav_active_handle();
    },

    // 导航选中处理
    nav_active_handle() {
      var value = this.nav_active_value;
      var temp_brand_list = this.brand_list;
      var count = 0;

      for (var i in temp_brand_list) {
        if (value == 0) {
          temp_brand_list[i]['is_not_show'] = 0;
          count++;
        } else {
          var is_not_show = temp_brand_list[i]['brand_category_ids'].indexOf(value) == -1 ? 1 : 0;
          temp_brand_list[i]['is_not_show'] = is_not_show;

          if (is_not_show == 0) {
            count++;
          }
        }
      }

      this.setData({
        brand_list: temp_brand_list,
        data_list_loding_status: count > 0 ? 3 : 0,
        data_bottom_line_status: count > 0
      });
    }

  }
};
</script>
<style>
/**
 * 分类导航
 */
.nav-list {
  width: 100%;
  height: 80rpx;
  white-space: nowrap;
  box-sizing: border-box;
}
.nav-list .item {
  padding: 20rpx 30rpx;
  border-bottom: 3px solid #f0f0f0;
  display: inline-block;
  position: relative;
}
.nav-list .active {
  border-bottom: 3px solid #d2364c;
  color: #d2364c;
}

/**
 * 数据列表
 */
.data-list .items {
   width: calc(50% - 5rpx);
   margin-bottom: 10rpx;
}
.data-list .items:nth-child(2n) {
   float: right;
}
.data-list .items:nth-child(2n+1) {
   float: left;
}
.data-list .items image {
   width: 100%;
   height: 160rpx !important;
}
.data-list .items .base {
  padding-top: 20rpx;
  margin: 20rpx;
}
.data-list .items .desc {
   color: #999;
   margin-top: 10rpx;
   font-size: 28rpx;
   line-height: 40rpx;
   min-height: 80rpx;
}
</style>
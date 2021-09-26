<template>
<view>
<view v-if="(data_base || null) != null">
  <!-- 分类 -->
  <scroll-view v-if="(shop_category || null) != null && shop_category.length > 0" class="nav-list bg-white oh" scroll-x="true">
    <view :class="'item cr-gray ' + (nav_active_value == 0 ? 'active' : '')" @tap="nav_event" data-value="0">全部</view>
    <block v-for="(item, index) in shop_category" :key="index">
      <view :class="'item cr-gray ' + (nav_active_value == item.id ? 'active' : '')" @tap="nav_event" :data-value="item.id">{{item.name}}</view>
    </block>
  </scroll-view>

  <!-- 列表 -->
  <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
    <view v-if="(data_list || null) != null && data_list.length > 0" class="data-list oh spacing-mt">
      <block v-for="(item, index) in data_list" :key="index">
        <view class="item bg-white">
          <navigator :url="'/pages/plugins/shop/detail/detail?id=' + item.id" hover-class="none">
            <image :src="item.logo_long" mode="aspectFit"></image>
            <view class="base br-t-dashed">
              <view class="single-text name tc">{{item.name}}</view>
              <view class="multi-text desc">{{item.describe}}</view>
              <view class="oh margin-top-sm single-text base-bottom">
                <view class="bitem fl cr-gray single-text">商品 {{item.goods_count}}</view>
                <view class="bitem fr cr-gray single-text tr">销量 {{item.goods_sales_count}}</view>
              </view>
            </view>
          </navigator>
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

    <!-- 结尾 -->
    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
  </scroll-view>
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
import componentQuickNav from "../../../../components/quick-nav/quick-nav";
import componentPopup from "../../../../components/popup/popup";

export default {
  data() {
    return {
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_bottom_line_status: false,
      data_list: [],
      data_total: 0,
      data_page_total: 0,
      data_page: 1,
      params: null,
      data_base: null,
      shop_category: [],
      nav_active_value: 0
    };
  },

  components: {
    componentQuickNav,
    componentPopup
  },
  props: {},

  onLoad(params) {
    // 启动参数处理
    params = app.globalData.launch_params_handle(params);
    this.setData({
      params: params
    }); // 数据加载

    this.get_data(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      data_page: 1
    });
    this.get_data();
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data_base.seo_title || this.data_base.application_name || app.globalData.data.application_title,
      desc: this.data_base.seo_desc || app.globalData.data.application_describe,
      path: '/pages/plugins/shop/index/index?referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: this.data_base.seo_title || this.data_base.application_name || app.globalData.data.application_title,
      query: 'referrer=' + user_id
    };
  },

  methods: {
    // 初始化
    get_data() {
      uni.showLoading({
        title: "加载中..."
      });
      var data = {
        "category_id": this.nav_tab_value || 0
      };
      uni.request({
        url: app.globalData.get_request_url("index", "index", "shop"),
        method: "POST",
        data: data,
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            this.setData({
              data_base: data.base || null,
              shop_category: data.shop_category || []
            }); // 标题名称

            if ((this.data_base || null) != null && (this.data_base.application_name || null) != null) {
              uni.setNavigationBarTitle({
                title: this.data_base.application_name
              });
            } // 获取列表数据


            this.get_data_list(1);
          } else {
            this.setData({
              data_list_loding_status: 0,
              data_list_loding_msg: res.data.msg
            });
            app.globalData.showToast(res.data.msg);
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.setData({
            data_list_loding_status: 2
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 获取数据列表
    get_data_list(is_mandatory) {
      // 分页是否还有数据
      if ((is_mandatory || 0) == 0) {
        if (this.data_bottom_line_status == true) {
          return false;
        }
      } // 加载loding


      uni.showLoading({
        title: "加载中..."
      }); // 参数

      var data = {
        "category_id": this.nav_active_value || 0
      }; // 获取数据

      uni.request({
        url: app.globalData.get_request_url("shoplist", "index", "shop"),
        method: "POST",
        data: data,
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data; // 列表数据处理

            if (data.data.length > 0) {
              if (this.data_page <= 1) {
                var temp_data_list = data.data;
              } else {
                var temp_data_list = this.data_list;
                var temp_data = data.data;

                for (var i in temp_data) {
                  temp_data_list.push(temp_data[i]);
                }
              }

              this.setData({
                data_list: temp_data_list,
                data_total: data.total,
                data_page_total: data.page_total,
                data_list_loding_status: 3,
                data_page: this.data_page + 1
              }); // 是否还有数据

              if (this.data_page > 1 && this.data_page > this.data_page_total) {
                this.setData({
                  data_bottom_line_status: true
                });
              } else {
                this.setData({
                  data_bottom_line_status: false
                });
              }
            } else {
              this.setData({
                data_list_loding_status: 0
              });

              if (this.data_page <= 1) {
                this.setData({
                  data_list: [],
                  data_bottom_line_status: false
                });
              }
            }
          } else {
            this.setData({
              data_list_loding_status: 0,
              data_list_loding_msg: res.data.msg
            });
            app.globalData.showToast(res.data.msg);
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          this.setData({
            data_list_loding_status: 2
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 滚动加载
    scroll_lower(e) {
      this.get_data_list();
    },

    // 导航事件
    nav_event(e) {
      this.setData({
        nav_active_value: e.currentTarget.dataset.value || 0,
        data_page: 1
      }); // 获取列表数据

      this.get_data_list(1);
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
  border-bottom: 1px solid #f0f0f0;
}
.nav-list .item {
  line-height: 80rpx;
  padding: 0 30rpx;
  display: inline-block;
  position: relative;
}
.nav-list .active {
  color: #d2364c;
}

/**
 * 数据列表
 */
.scroll-box {
  height: calc(100vh - 80rpx);
}
.data-list .item {
  width: calc(50% - 45rpx);
  margin-bottom: 10rpx;
  padding: 20rpx;
}
.data-list .item:nth-child(2n) {
  float: right;
}
.data-list .item:nth-child(2n+1) {
  float: left;
}
.data-list .item image {
  width: 100%;
  height: 160rpx !important;
}
.data-list .item .base {
  padding-top: 20rpx;
}
.data-list .item .name {
  font-size: 28rpx;
  font-weight: bold;
}
.data-list .item .desc {
  color: #999;
  margin-top: 10rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  min-height: 80rpx;
}
.data-list .item .base-bottom .bitem {
  width: 45%;
  font-size: 24rpx;
}
</style>
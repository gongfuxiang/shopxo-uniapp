<template>
<view>
<view v-if="data_list.length > 0">
  <block v-if="category_show_level == 1">
    <!-- 一级模式 -->
    <view class="model-one  oh">
      <block v-for="(v, index) in data_list" :key="index">
        <view class="content-item" :data-value="v.id" @tap="category_event">
          <view class="content bg-white wh-auto">
            <image v-if="(v.icon || null) != null" :src="v.icon" mode="aspectFit" class="icon"></image>
            <view class="text single-text">{{v.name}}</view>
          </view>
        </view>
      </block>
    </view>
  </block>
  <block v-else>
    <!-- 一级内导航 -->
    <view class="left-nav">
      <block v-for="(item, index) in data_list" :key="index">
        <view :class="'items ' + item.active || ''" :data-index="index" @tap="nav_event">
          <text>{{item.name}}</text>
        </view>
      </block>
    </view>
    <view class="right-container">
      <!-- 一级内基础容 -->
      <view v-if="(data_content || null) != null" class="right-content">
        <view v-if="(data_content.vice_name || null) != null || (data_content.describe || null) != null" class="one-content bg-white" :data-value="data_content.id" @tap="category_event">
          <view v-if="(data_content.vice_name || null) != null" class="one-vice-name cr-main" :style="'color:' + data_content.bg_color + ';'">{{data_content.vice_name}}</view>
          <view v-if="(data_content.describe || null) != null" class="one-desc">{{data_content.describe}}</view>
        </view>
        <!-- 一二级数据渲染 -->
        <block v-if="data_content.items.length > 0">
          <!-- 二级模式 -->
          <block v-if="category_show_level == 2">
            <view class="two-content bg-white oh">
              <block v-for="(v, index) in data_content.items" :key="index">
                <view class="content-item" :data-value="v.id" @tap="category_event">
                  <view class="content wh-auto">
                    <image v-if="(v.icon || null) != null" :src="v.icon" mode="aspectFit" class="icon"></image>
                    <view class="text single-text">{{v.name}}</view>
                  </view>
                </view>
              </block>
            </view>
          </block>
          <!-- 三级模式 -->
          <block v-if="category_show_level == 3">
            <block v-for="(v, index) in data_content.items" :key="index">
              <view class="bg-white oh">
                <view class="tc two-name" :data-value="v.id" @tap="category_event">{{v.name}}</view>
                <block v-if="v.items.length > 0">
                  <block v-for="(vs, index2) in v.items" :key="index2">
                    <view class="content-item" :data-value="vs.id" @tap="category_event">
                      <view class="content wh-auto">
                        <image v-if="(vs.icon || null) != null" :src="vs.icon" mode="aspectFit" class="icon"></image>
                        <view class="text single-text">{{vs.name}}</view>
                      </view>
                    </view>
                  </block>
                </block>
              </view>
            </block>
          </block>
        </block>
        <block v-else>
          <!--<import src="/pages/common/nodata.wxml"></import>-->
          <block data-type="template" data-is="nodata" data-attr="status: 0, msg: '没有子分类数据'">
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
        </block>
      </view>
    </view>
  </block>
</view>

<view v-if="data_list.length == 0 && data_list_loding_status != 0">
  <!--<import src="/pages/common/nodata.wxml"></import>-->
  <block data-type="template" data-is="nodata" data-attr="status: data_list_loding_status">
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

<!-- 快捷导航 -->
<component-quick-nav></component-quick-nav>
</view>
</template>

<script>
const app = getApp();
import componentQuickNav from "../../components/quick-nav/quick-nav";

export default {
  data() {
    return {
      data_list_loding_status: 1,
      nav_active_index: 0,
      data_list: [],
      data_content: null,
      // 基础配置
      category_show_level: 3,
      data_bottom_line_status: false
    };
  },

  components: {
    componentQuickNav
  },
  props: {},

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.goods_category
    }); // 数据加载

    this.init(); // 初始化配置

    this.init_config(); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: app.globalData.data.application_title,
      desc: app.globalData.data.application_describe,
      path: '/pages/goods-category/goods-category?referrer=' + user_id
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    return {
      title: app.globalData.data.application_title,
      query: 'referrer=' + user_id
    };
  },

  methods: {
    // 初始化配置
    init_config(status) {
      if ((status || false) == true) {
        this.setData({
          category_show_level: app.globalData.get_config('config.category_show_level')
        });
      } else {
        app.globalData.is_config(this, 'init_config');
      }
    },

    // 获取数据
    init() {
      // 加载loding
      this.setData({
        data_list_loding_status: 1
      }); // 加载loding

      uni.request({
        url: app.globalData.get_request_url("category", "goods"),
        method: "POST",
        data: {},
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var category = res.data.data.category;
            var data_content = [];
            var index = this.nav_active_index || 0;

            if (category.length > 0) {
              category[index]['active'] = 'nav-active';
              data_content = category[index];
            }

            this.setData({
              data_list: category,
              data_content: data_content,
              data_list_loding_status: category.length == 0 ? 0 : 3,
              data_bottom_line_status: true
            });
          } else {
            this.setData({
              data_list_loding_status: 0,
              data_bottom_line_status: true
            });
            app.globalData.showToast(res.data.msg);
          }
        },
        fail: () => {
          uni.stopPullDownRefresh();
          this.setData({
            data_list_loding_status: 2,
            data_bottom_line_status: true
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 导航事件
    nav_event(e) {
      var index = e.currentTarget.dataset.index;
      var temp_data = this.data_list;

      for (var i in temp_data) {
        temp_data[i]['active'] = index == i ? 'nav-active' : '';
      }

      this.setData({
        data_list: temp_data,
        data_content: temp_data[index],
        nav_active_index: index
      });
    },

    // 事件
    category_event(e) {
      uni.navigateTo({
        url: '/pages/goods-search/goods-search?category_id=' + e.currentTarget.dataset.value
      });
    }

  }
};
</script>
<style>
/**
 * 左侧导航
 */
.left-nav {
  height: 100vh;
  background: #fff;
  width: 210rpx;
  overflow-x: hidden;
  overflow-y: auto;
}
.left-nav .items {
  height: 120rpx;
  line-height: 120rpx;
  font-size: 34rpx;
  padding: 0 10rpx;
  text-align: center;
  color: #666;
  border-left: 3px solid #fff;
  border-right: 3px solid #fff;
  overflow: hidden;
}
.left-nav .items:not(:last-child) {
  border-bottom: 1px solid #f1f1f1;
}
.nav-active {
  background: #f5f5f5;
  border-left: 3px solid #e23f36 !important;
  border-right: 3px solid #f5f5f5 !important;
  color: #e23f36 !important;
}

/**
 *  右侧内容
 */
.right-container {
  height: 100vh;
  width: calc( 100% - 210rpx );
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;
  right: 0;
  background: #f5f5f5;
}
.right-content {
  padding: 0 20rpx 20rpx 20rpx;
}
.one-content {
  padding: 20rpx;
}
.one-content, .two-content {
  margin-top: 20rpx;
}
.one-vice-name {
  font-size: 30rpx;
  font-weight: 500;
}
.one-desc {
  color: #999;
  margin-top: 10rpx;
}
.two-name {
  font-weight: bold;
  font-size: 32rpx;
  background: #f5f5f5;
  padding: 20rpx 10rpx;
}
.content-item {
  display: -webkit-inline-box;
  width: calc(33.33% - 20rpx);
  padding: 10rpx;
  text-align: center;
}
.content-item .content {
  margin: 0 auto;
  padding: 15rpx 0;
}
.content-item .text {
  font-size: 28rpx;
  line-height: 46rpx;
}
.content-item .icon {
  width: 100%;
  height: 120rpx;
}
.model-one {
  padding: 10rpx;
}
.model-one .content-item:nth-child(3n) {
  border-right: 0;
}
</style>
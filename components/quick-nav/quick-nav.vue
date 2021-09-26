<template>
<view>
<!-- 开启事件 -->
<movable-area v-if="quick_status == 1" class="quick-nav-movable-container">
  <movable-view direction="all" :x="x" :y="y" :animation="false" class="quick-nav-event-submit" @tap="quick_open_event">
    <image src="/static/images/quick-submit-icon.png" mode="widthFix"></image>
  </movable-view>
</movable-area>

<!-- 弹窗 -->
<component-popup :prop-show="popup_status" prop-position="bottom" @onclose="quick_close_event">
  <view class="quick-nav-popup-container">
    <view class="close oh">
      <view class="icon-right" @tap.stop="quick_close_event">
        <icon type="clear" size="20"></icon>
      </view>
    </view>
    <view class="quick-nav-popup-content">
      <view v-if="data_list.length > 0" class="quick-nav-data-list">
        <view v-for="(item, index) in data_list" :key="index" class="items">
          <view class="items-content" :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" :style="'background-color:' + item.bg_color">
            <image :src="item.images_url" mode="aspectFit"></image>
          </view>
          <view class="title">{{item.name}}</view>
        </view>
      </view>
      <view v-else>
        <!--<import src="/pages/common/nodata.wxml"></import>-->
        <block data-type="template" data-is="nodata" data-attr="status: 0">
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
  </view>
</component-popup>
</view>
</template>

<script>
const app = getApp();
import componentPopup from "../popup/popup";

export default {
  data() {
    return {
      popup_status: false,
      quick_status: 0,
      data_list: [],
      system: null,
      x: 0,
      y: 0,
      is_first: 1
    };
  },

  components: {
    componentPopup
  },
  props: {},
  // 页面被展示
  onPageShow: function () {
    this.init_config(); // 非首次进入则重新初始化配置接口

    if (this.is_first == 0) {
      app.globalData.init_config();
    } // 数据设置


    var system = app.globalData.get_system_info();
    this.setData({
      is_first: 0,
      system: system,
      x: 5,
      y: (system.windowHeight || 450) - 160
    });
  },
  methods: {
    // 初始化配置
    init_config(status) {
      if ((status || false) == true) {
        this.setData({
          data_list: app.globalData.get_config('quick_nav') || [],
          quick_status: app.globalData.get_config('config.home_navigation_main_quick_status') || 0
        });
      } else {
        app.globalData.is_config(this, 'init_config');
      }
    },

    // 弹层开启
    quick_open_event(e) {
      this.setData({
        popup_status: true,
        data_list: app.globalData.get_config('quick_nav') || []
      });
    },

    // 弹层关闭
    quick_close_event(e) {
      this.setData({
        popup_status: false
      });
    },

    // 操作事件
    navigation_event(e) {
      app.globalData.operation_event(e);
    }

  }
};
</script>
<style>
/**
 * 按钮
 */
 .quick-nav-movable-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 150rpx;
  left: 0;
  background:transparent;
  pointer-events: none;
  z-index: 2;
}
.quick-nav-event-submit {
  pointer-events: auto;
  position: fixed;
  bottom: 150rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: rgb(210 54 76 / 80%);
}
.quick-nav-event-submit image {
  width: 50rpx;
  height: 50rpx;
  margin: 25rpx auto 25rpx auto;
  display: block;
}

/**
 * 弹窗
 */
.quick-nav-popup-container {
  padding: 20rpx 10rpx 0 10rpx;
  background: #fff;
}
.quick-nav-popup-container .close {
  overflow: hidden;
}
.quick-nav-popup-container .close .icon-right {
  float: right;
}
.quick-nav-popup-content {
  max-height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 20rpx;
}

/**
 * 内容
 */
.quick-nav-data-list {
  overflow: hidden;
  background: #fff;
}
.quick-nav-data-list .items {
  width: calc(25% - 60rpx);
  float: left;
  padding: 30rpx;
}
.quick-nav-data-list .items-content {
  border-radius: 50%;
  padding: 20rpx;
  text-align: center;
  width: 70rpx;
  height: 70rpx;
  margin: 0 auto;
}
.quick-nav-data-list .items image {
  width: 60rpx !important;
  height: 60rpx !important;
  margin-top: 5rpx;
}
.quick-nav-data-list .items .title {
  margin-top: 10rpx;
  font-size: 28rpx !important;
  text-align:center;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;	  
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
}

/*
 * 没有数据
 */
.quick-nav-popup-container .no-data-box {
  padding: 80rpx 0;
  text-align: center;
}
.quick-nav-popup-container .no-data-box image {
  width: 160rpx;
  margin-bottom: 30rpx;
}
.quick-nav-popup-container .no-data-box .no-data-tips {
  font-size: 28rpx;
  color: #a6a6a6;
}
</style>
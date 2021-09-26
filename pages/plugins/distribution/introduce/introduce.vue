<template>
<view>
<view v-if="data_base != null">
  <!-- 等级信息 -->
  <view v-if="level_list.length > 0" class="panel-item">
    <view v-for="(item, index) in level_list" :key="index" class="bg-white spacing-mb">
      <view class="panel-title">{{item.name}}</view>
      <view class="panel-content">
        <view class="item br-b oh">
          <view class="title fl">等级证书</view>
          <view class="content cr-gray fl br-l images">
            <image :src="item.images_url" class="avatar dis-block fl" mode="widthFix"></image>
          </view>
        </view>
        <view class="item br-b oh">
          <view class="title fl">返佣比例</view>
          <view class="content fl br-l">
            <view>一级 {{item.level_rate_one}}%</view>
            <view v-if="data_base.level == undefined || data_base.level > 0">二级 {{item.level_rate_two}}%</view>
            <view v-if="data_base.level == undefined || data_base.level > 1">三级 {{item.level_rate_three}}%</view>
          </view>
        </view>
        <view class="item br-b oh">
          <view class="title fl">消费金额</view>
          <view class="content fl br-l">{{item.rules_msg}}</view>
        </view>
      </view>
    </view>
  </view>

  <!-- 等级介绍 -->
  <view v-if="(data_base.user_center_level_desc || null) != null && data_base.user_center_level_desc.length > 0" class="spacing-mt user-center-level-desc">
    <view class="tips-desc">
      <view v-for="(item, index) in data_base.user_center_level_desc" :key="index" class="item">
        {{item}}
      </view>
    </view>
  </view>
  
  <view v-if="((data_base.user_center_level_desc || null) != null && data_base.user_center_level_desc.length > 0) || level_list.length > 0">
    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
  </view>
</view>

<view v-if="level_list.length <= 0 && ((data_base.user_center_level_desc || null) == null || data_base.user_center_level_desc.length <= 0)">
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
      params: null,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_bottom_line_status: false,
      data_base: null,
      level_list: []
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      params: params
    });
    this.init();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  methods: {
    init() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      });
      uni.request({
        url: app.globalData.get_request_url("index", "introduce", "distribution"),
        method: "POST",
        data: {
          id: this.params.id
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            var data_base = data.base || null;
            var level_list = (data.level_list || null) != null && data.level_list.length > 0 ? data.level_list : [];
            self.setData({
              data_base: data_base,
              level_list: level_list,
              data_list_loding_status: data_base == null || level_list.length <= 0 ? 0 : 3,
              data_bottom_line_status: true,
              data_list_loding_msg: ''
            });
          } else {
            self.setData({
              data_list_loding_status: 2,
              data_bottom_line_status: false,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'init')) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.stopPullDownRefresh();
          self.setData({
            data_list_loding_status: 2,
            data_bottom_line_status: false,
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
/*
 * 等级信息
 */
.panel-item .panel-title {
  background: #fff;
  font-weight: bold;
  padding: 15rpx;
  border-bottom: 2px solid #eee;
  font-size: 34rpx;
}
.panel-item .panel-content .item {
    padding: 20rpx 0;
}
.panel-item .panel-content .item:last-child {
  border: 0;
}
.panel-item .panel-content .item .title {
    width: 25%;
    padding-left: 20rpx;
}
.panel-item .panel-content .item .content {
    width: calc(75% - 50rpx);
    padding-left: 20rpx;
    min-height: 46rpx;
}
.panel-item .panel-content .item view {
    line-height: 46rpx;
}
.panel-item .panel-content .item .images image {
  width: 60rpx;
  height: 60rpx;
}


/*
 * 等级介绍
 */
.user-center-level-desc {
  padding: 0 10rpx;
}
.user-center-level-desc .tips-desc {
  background: #def2fd;
  border: 1px solid #cfeeff;
  color: #1490d2;
  padding: 10rpx;
  font-size: 26rpx;
  border-radius: 2px;
}
</style>
<template>
<view>
<image v-if="(data_base || null) != null && (data_base.banner_images || null) != null" class="banner wh-auto dis-block" :src="data_base.banner_images" mode="widthFix"></image>

<!-- 优惠劵列表 -->
<view v-if="data_list.length > 0" class="coupon-container">
  <block v-for="(item, index) in data_list" :key="index">
    <view :class="'item spacing-mt bg-white ' + (item.is_operable == 0 ? 'item-disabled' : '')" :style="'border:1px solid ' + item.bg_color_value + ';'">
      <view class="v-left fl">
        <view class="base single-text" :style="'color:' + item.bg_color_value + ';'">
          <text v-if="item.type == 0" class="symbol">{{currency_symbol}}</text>
          <text class="price">{{item.discount_value}}</text>
          <text class="unit">{{item.type_unit}}</text>
          <text v-if="(item.desc || null) != null" class="desc cr-gray">{{item.desc}}</text>
        </view>
        <view v-if="(item.use_limit_type_name || null) != null" class="base-tips cr-base single-text">{{item.use_limit_type_name}}</view>
      </view>
      <view class="v-right fr" @tap="coupon_receive_event" :data-index="index" :data-value="item.id" :style="'background:' + item.bg_color_value + ';'">
        <text class="circle"></text>
        <text>{{item.is_operable_name}}</text>
      </view>
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
      data_base: null,
      // 优惠劵领取
      temp_coupon_receive_index: null,
      temp_coupon_receive_value: null,
      // 基础配置
      currency_symbol: app.globalData.data.currency_symbol
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    // 显示分享菜单
    app.globalData.show_share_menu();
  },

  onShow() {
    // 数据加载
    this.init(); // 初始化配置

    this.init_config();
  },

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
    // 初始化配置
    init_config(status) {
      if ((status || false) == true) {
        this.setData({
          currency_symbol: app.globalData.get_config('currency_symbol')
        });
      } else {
        app.globalData.is_config(this, 'init_config');
      }
    },

    // 获取数据
    init() {
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
        url: app.globalData.get_request_url("index", "index", "coupon"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            var status = (data.data || []).length > 0;
            this.setData({
              data_base: data.base || null,
              data_list: data.data || [],
              data_list_loding_msg: '',
              data_list_loding_status: status ? 3 : 0,
              data_bottom_line_status: status
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
            app.globalData.showToast(res.data.msg);
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
    },

    // 优惠劵领取事件
    coupon_receive_event(e) {
      // 参数处理
      if ((e || null) == null) {
        var index = this.temp_coupon_receive_index;
        var value = this.temp_coupon_receive_value;
      } else {
        var index = e.currentTarget.dataset.index;
        var value = e.currentTarget.dataset.value;
        this.setData({
          temp_coupon_receive_index: index,
          temp_coupon_receive_value: value
        });
      } // 登录校验


      var user = app.globalData.get_user_info(this, 'coupon_receive_event');

      if (user != false) {
        // 用户未绑定用户则转到登录页面
        if (app.globalData.user_is_need_login(user)) {
          uni.navigateTo({
            url: "/pages/login/login?event_callback=coupon_receive_event"
          });
          return false;
        } else {
          var self = this;
          var temp_list = this.data_list;

          if (temp_list[index]['is_operable'] != 0) {
            uni.showLoading({
              title: "处理中..."
            });
            uni.request({
              url: app.globalData.get_request_url("receive", "coupon", "coupon"),
              method: "POST",
              data: {
                "coupon_id": value
              },
              dataType: "json",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                uni.hideLoading();

                if (res.data.code == 0) {
                  app.globalData.showToast(res.data.msg, "success");

                  if (self.data_base != null && self.data_base.is_repeat_receive != 1) {
                    temp_list[index]['is_operable'] = 0;
                    temp_list[index]['is_operable_name'] = '已领取';
                    self.setData({
                      data_list: temp_list
                    });
                  }
                } else {
                  if (app.globalData.is_login_check(res.data, self, 'coupon_receive_event')) {
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
        }
      }
    }

  }
};
</script>

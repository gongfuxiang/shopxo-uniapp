<template>
<view>
<scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
    <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb" v-if="data_list.length > 0">
        <view class="base br-b-dashed oh">
            <text class="name cr-base">{{item.name}}</text>
            <text class="time fr cr-gray">{{item.add_time_time}}</text>
        </view>
        <view class="content">
            <view class="desc">{{item.content}}</view>
        </view>
        <view v-if="(item.reply || null) != null" class="answer br-t">
            <text class="reply-icon bg-main cr-fff">答</text>
            <text class="reply-content cr-gray">{{item.reply}}</text>
        </view>
    </view>
    <view v-if="data_list.length == 0">
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
    
    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
</scroll-view>

<!-- 新增入口 -->
<navigator url="/pages/answer-form/answer-form" hover-class="none">
    <view class="answer-add-submit bg-main cr-fff tc">+</view>
</navigator>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_list: [],
      data_page_total: 0,
      data_page: 1,
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      data_total: ""
    };
  },

  components: {},
  props: {},

  onLoad() {},

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.user_answer_list
    });
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      data_page: 1
    });
    this.get_data_list(1);
  },

  methods: {
    init() {
      var user = app.globalData.get_user_info(this, "init");

      if (user != false) {
        // 用户未绑定用户则转到登录页面
        if (app.globalData.user_is_need_login(user)) {
          uni.redirectTo({
            url: "/pages/login/login?event_callback=init"
          });
          return false;
        } else {
          // 获取数据
          this.get_data_list();
        }
      } else {
        this.setData({
          data_list_loding_status: 0,
          data_bottom_line_status: false
        });
      }
    },

    get_data_list(is_mandatory) {
      // 分页是否还有数据
      if ((is_mandatory || 0) == 0) {
        if (this.data_bottom_line_status == true) {
          return false;
        }
      } // 加载loding


      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      }); // 获取数据

      uni.request({
        url: app.globalData.get_request_url("index", "answer"),
        method: "POST",
        data: {
          page: this.data_page
        },
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            if (res.data.data.data.length > 0) {
              if (this.data_page <= 1) {
                var temp_data_list = res.data.data.data;
              } else {
                var temp_data_list = this.data_list;
                var temp_data = res.data.data.data;

                for (var i in temp_data) {
                  temp_data_list.push(temp_data[i]);
                }
              }

              this.setData({
                data_list: temp_data_list,
                data_total: res.data.data.total,
                data_page_total: res.data.data.page_total,
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
            }
          } else {
            this.setData({
              data_list_loding_status: 0
            });

            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
              app.globalData.showToast(res.data.msg);
            }
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
    }

  }
};
</script>
<style>
.item {
    padding: 10rpx;
}
.item .base {
    height: 80rpx;
    line-height: 80rpx;
}
.item .base .name {
    font-size: 28rpx;
    color: #4e4e4e;
}
.item .content, .item .answer {
    padding: 20rpx 0;
}
.item .answer .reply-icon {
    border-radius: 5px;
    padding: 0px 3px;
    margin-right: 5px;
}
.item .answer .reply-content, .item .content .desc {
    line-height: 42rpx;
}
.answer-add-submit {
    position: fixed;
    bottom: 50rpx;
    right: 50rpx;
    width: 100rpx;
    height: 100rpx;
    line-height: 86rpx;
    border-radius: 50%;
    box-shadow: 0 0 10px 2px #c4c4c4;
    font-size: 76rpx;
}
</style>
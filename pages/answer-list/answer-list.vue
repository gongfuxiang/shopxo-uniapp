<template>
<view>
<scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
    <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb" v-if="data_list.length > 0">
        <view class="base">
            <view class="oh">
                <image class="avatar fl" :src="item.avatar" mode="widthFix" :data-index="index" @error="user_avatar_error"></image>
                <view class="desc fr tl">{{item.content}}</view>
            </view>
            <view class="cr-gray tr">{{item.add_time_time}}</view>
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

  onLoad() {
    this.get_data_list();
  },

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.answer_list
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      data_page: 1
    });
    this.get_data_list(1);
  },

  methods: {
    get_data_list(is_mandatory) {
      // 分页是否还有数据
      if ((is_mandatory || 0) == 0) {
        if (this.data_bottom_line_status == true) {
          return false;
        }
      } // 加载loding


      this.setData({
        data_list_loding_status: 1
      }); // 获取数据

      uni.request({
        url: app.globalData.get_request_url("common", "answer"),
        method: "POST",
        data: {
          page: this.data_page
        },
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
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

    // 头像加载错误
    user_avatar_error(e) {
      var index = e.currentTarget.dataset.index || 0;
      var temp_data_list = this.data_list;

      for (var i in temp_data_list) {
        if (i == index) {
          temp_data_list[i]['avatar'] = app.globalData.data.default_user_head_src;
        }
      }

      this.setData({
        data_list: temp_data_list
      });
    }

  }
};
</script>
<style>
.item {
    padding: 10rpx;
}
.item .base, .item .content, .item .answer {
    padding: 15rpx 0;
}
.item .base .desc {
    width: calc(100% - 130rpx);
}
.item .base .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
}
.item .answer .reply-icon {
    border-radius: 5px;
    padding: 0px 3px;
    margin-right: 5px;
}
.item .answer .reply-content, .item .base .desc {
    line-height: 42rpx;
}
</style>
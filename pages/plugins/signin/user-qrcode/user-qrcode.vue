<template>
<view>
<scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
  <view class="data-list">
    <block v-if="data_list.length > 0">
      <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb">
        <view class="base oh br-b">
          <text class="cr-base">{{item.add_time}}</text>
        </view>
        <navigator :url="'/pages/plugins/signin/user-qrcode-detail/user-qrcode-detail?id=' + item.id" hover-class="none">
          <view class="content">
            <view class="single-text">
              <text class="title cr-base">是否启用</text>
              <text class="value">{{item.is_enable_name}}</text>
            </view>
            <view class="single-text">
              <text class="title cr-base">邀请人奖励积分</text>
              <text class="value">{{item.reward_master}}</text>
            </view>
            <view class="single-text">
              <text class="title cr-base">受邀人奖励积分</text>
              <text class="value">{{item.reward_invitee}}</text>
            </view>
          </view>
        </navigator>
        <view class="operation tr br-t-dashed">
          <button class="cr-base br" type="default" size="mini" hover-class="none" :data-value="item.id" @tap="show_event">查看</button>
          <button v-if="(data_base.is_team_show_coming_user || 0) == 1" class="cr-base br" type="default" size="mini" hover-class="none" :data-value="item.id" @tap="coming_event">签到</button>
          <button class="cr-base br" type="default" size="mini" hover-class="none" :data-value="item.id" @tap="edit_event">编辑</button>
        </view>
      </view>
    </block>

    <block v-else>
      <view v-if="(data_base || null) != null && (data_base.is_team || 0) == 1" class="user-team-container tc">
          <button type="default" hover-class="none" @tap="team_event">组队签到</button>
          <view>组队分享让更多人参与签到、获得更多积分奖励</view>
      </view>
      <view v-else>
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
    </block>

    <!--<import src="/pages/common/bottom_line.wxml"></import>-->
    <block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status">
    <view v-if="(status || false)" class="data-bottom-line">
        <view class="left fl"></view>
        <view class="msg fl">我是有底线的</view>
        <view class="right fr"></view>
    </view>
</block>
  </view>
</scroll-view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      params: null,
      data_base: null,
      data_list: [],
      data_page_total: 0,
      data_page: 1,
      data_total: ""
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
      var user = app.globalData.get_user_info(this, 'init');

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

    // 获取数据
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
      }); // 请求数据

      var data = {
        page: this.data_page
      }; // 获取数据

      uni.request({
        url: app.globalData.get_request_url("index", "userqrcode", "signin"),
        method: "POST",
        data: data,
        dataType: "json",
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
                data_base: res.data.data.base || null,
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
                data_base: res.data.data.base || null,
                data_list_loding_status: 0,
                data_list: [],
                data_bottom_line_status: false
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
    },

    // 查看详情
    show_event(e) {
      var value = e.currentTarget.dataset.value;
      uni.navigateTo({
        url: '/pages/plugins/signin/index-detail/index-detail?id=' + value
      });
    },

    // 签到用户
    coming_event(e) {
      var value = e.currentTarget.dataset.value;
      uni.navigateTo({
        url: '/pages/plugins/signin/user-coming-list/user-coming-list?id=' + value
      });
    },

    // 编辑
    edit_event(e) {
      var value = e.currentTarget.dataset.value;
      uni.navigateTo({
        url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?id=' + value
      });
    },

    // 组队签到
    team_event(e) {
      uni.navigateTo({
        url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo'
      });
    }

  }
};
</script>
<style>
/*
 * 列表
 */
.data-list .item .base,
.data-list .item .content {
  padding: 20rpx 10rpx;
}
.data-list .item .content .single-text {
  line-height: 50rpx;
}
.data-list .item .content .single-text .title {
  margin-right: 30rpx;
}
.data-list .item .content .single-text .value {
  font-weight: 500;
}
.data-list .item .content .single-text .unit {
  margin-left: 10rpx;
}
.data-list .item .operation {
  padding: 20rpx 10rpx;
}
.data-list .item .operation button:not(:first-child) {
  margin-left: 30rpx;
}

/*
 * 组队签到
 */
.user-team-container {
  padding-top: 35%;
}
.user-team-container button {
  margin: 0 auto;
  margin-bottom: 50rpx;
  width: 50%;
  background-color: #f6b015;
  color: #fff;
}
</style>
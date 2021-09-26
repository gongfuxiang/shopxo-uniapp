<template>
<view>
<!-- 评分 -->
<view v-if="goods_score != null" class="score-container oh br-b">
    <view class="score fl tc">
      <view class="cr-base">动态评分</view>
      <view class="value">{{goods_score.avg || '0.0'}}</view>
    </view>
    <view class="progress fr tc">
      <block v-if="goods_score.avg > 0">
        <block v-for="(item, index) in goods_score.rating" :key="index">
          <view v-if="item.portion > 0" :class="'progress-bar ' + progress_class[index]" :style="'width: ' + item.portion + '%;'">{{item.name}}</view>
        </block>
      </block>
      <text v-else class="cr-gray">暂无评分</text>
    </view>
</view>

<!-- 列表 -->
<scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
  <view v-for="(item, index) in data_list" :key="index" class="comment-item bg-white spacing-mt">
    <view class="oh nav">
      <image class="avatar dis-block fl" :src="item.user.avatar || '/static/images/default-user.png'" mode="aspectFit"></image>
      <view class="base-nav fr">
        <text>{{item.user.user_name_view}}</text>
        <text class="cr-grey">评论于</text>
        <text class="cr-base">{{item.add_time_time}}</text>
      </view>
    </view>
    <view class="base-content oh">
      <view class="content cr-base">{{item.content}}</view>
      <view v-if="(item.images || null) != null && item.images.length > 0" class="images oh">
        <block v-for="(iv, ix) in item.images" :key="ix">
          <image class="br" @tap="images_show_event" :data-index="index" :data-ix="ix" :src="iv" mode="aspectFit"></image>
        </block>
      </view>
      <view v-if="(item.msg || null) != null" class="spec">{{item.msg}}</view>
      <view v-if="item.is_reply == 1 && (item.reply || null) != null" class="reply br-t-dashed">
        <text class="cr-gray">管理员回复：</text>
        <text class="reply-desc">{{item.reply}}</text>
      </view>
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
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      data_list: [],
      data_page_total: 0,
      data_page: 1,
      goods_score: null,
      params: null,
      progress_class: ['progress-bar-danger', 'progress-bar-warning', 'progress-bar-secondary', '', 'progress-bar-success'],
      ix: "",
      data_total: ""
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    //params['goods_id']=9;
    this.setData({
      params: params
    });
    this.init();
  },

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.goods_comment
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
    // 初始化
    init() {
      // 获取数据
      this.goods_score();
      this.get_data_list();
    },

    // 获取商品评分
    goods_score() {
      uni.request({
        url: app.globalData.get_request_url("goodsscore", "goods"),
        method: "POST",
        data: {
          goods_id: this.params.goods_id
        },
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.code == 0) {
            this.setData({
              goods_score: res.data.data || null
            });
          } else {
            if (res.data.code != -400) {
              app.globalData.showToast(res.data.msg);
            }
          }
        },
        fail: () => {
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 获取数据列表
    get_data_list(is_mandatory) {
      // 参数校验
      if ((this.params.goods_id || null) == null) {
        uni.stopPullDownRefresh();
        this.setData({
          data_bottom_line_status: false,
          data_list_loding_status: 2
        });
      } else {
        var self = this; // 分页是否还有数据

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
        });
        uni.request({
          url: app.globalData.get_request_url("comments", "goods"),
          method: "POST",
          data: {
            goods_id: this.params.goods_id,
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

                if (this.data_page <= 1) {
                  this.setData({
                    data_list: [],
                    data_bottom_line_status: false
                  });
                }
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
      }
    },

    // 滚动加载
    scroll_lower(e) {
      this.get_data_list();
    },

    // 图片预览
    images_show_event(e) {
      var index = e.currentTarget.dataset.index;
      var ix = e.currentTarget.dataset.ix;
      uni.previewImage({
        current: this.data_list[index]['images'][ix],
        urls: this.data_list[index]['images']
      });
    }

  }
};
</script>
<style>
/*
 * 评分
 */
.score-container {
  padding: 10rpx;
}
.score-container .score {
  width: 180rpx;
  border-right: 1px solid #eee;
}
.score-container .score .value {
  color: #f03726;
  font-weight: bold;
  font-size: 60rpx;
  line-height: 60rpx;
  margin-top: 10rpx;
}
.progress {
  overflow: hidden;
  height: 40rpx;
  margin-top: 35rpx;
  background-color: #eee;
  border-radius: 0;
  width: calc(100% - 200rpx);
}
.progress .cr-gray {
  font-size: 24rpx;
  line-height: 40rpx;
}
.progress-bar {
  float: left;
  width: 0;
  height: 100%;
  font-size: 24rpx;
  line-height: 40rpx;
  color: #fff;
  text-align: center;
  background-color: #0e90d2;
}
.progress-bar-danger {
  background-color: #dd514c;
}
.progress-bar-warning {
  background-color: #F37B1D;
}
.progress-bar-secondary {
  background-color: #3bb4f2;
}
.progress-bar-success {
  background-color: #5eb95e;
}

/*
 * 列表
 */
.scroll-box {
  height: calc(100vh - 125rpx);
}
.comment-item {
  padding-bottom: 10rpx;
}
.comment-item .nav {
  background: #ebebeb;
  padding: 10rpx;
}
.comment-item .avatar {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  border: 1px solid #e2e2e2;
}
.comment-item .base-nav {
  width: calc(100% - 90rpx);
  line-height: 70rpx;
}
.comment-item .base-nav text:not(:last-child) {
  margin-right: 5rpx;
}

.base-content {
  padding: 10rpx;
}
.base-content .content,
.base-content .reply {
  line-height: 46rpx;
  font-size: 30rpx;
}
.base-content .spec,
.base-content .reply,
.base-content .images {
  margin-top: 20rpx;
}
.base-content .spec {
  color: #B0B0B0;
}
.base-content .reply {
  padding-top: 20rpx;
}
.base-content .reply-desc {
    color: #905602;
}
.base-content .images image {
  width: 100rpx;
  height: 100rpx;
  padding: 5rpx;
}
.base-content .images image:not(:last-child) {
  margin-right: 10rpx;
}
</style>
<template>
<view>
<!-- 导航 -->
<view class="nav">
  <block v-for="(item, index) in nav_status_list" :key="index">
    <view :class="'item fl tc cr-gray ' + (nav_status_index == index ? 'active' : '')" :data-index="index" @tap="nav_event">{{item.name}}</view>
  </block>
</view>

<movable-area class="wh-auto ht-auto">
  <!-- 列表 -->
  <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
    <view class="data-list">
      <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb" v-if="data_list.length > 0">
        <view class="base oh br-b">
          <text class="fl cr-base">{{item.add_time}}</text>
          <text class="fr nickname cr-gray">{{item.status_name}}</text>
        </view>
        <view class="content">
          <view class="single-text">
            <text class="title cr-base">订单号</text>
            <text class="value">{{item.order_no}}</text>
          </view>
          <view class="single-text">
            <text class="title cr-base">支付金额</text>
            <text class="value">{{item.pay_price}}</text>
            <text class="unit cr-gray">元</text>
          </view>
        </view>

        <view v-if="item.status == 0" class="operation tr br-t-dashed">
          <button class="cr-gray br" type="default" size="mini" hover-class="none" :data-index="index" :data-oid="item.order_id" :data-uid="item.order_user_id" @tap="list_submit_take_event">取货</button>
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
    </view>
  </scroll-view>

  <!-- 拖拽按钮 -->
  <movable-view class="search-drag tc" direction="all" @tap="drag_event">
    <icon type="search" size="30"></icon>
  </movable-view>
</movable-area>

<!-- 取货 popup -->
<component-popup :prop-show="is_show_take_popup" prop-position="bottom" @onclose="take_popup_event_close">
  <view class="form-container spacing-mt">
    <view class="form-gorup tc">
      <view class="form-gorup-title">取货码</view>
      <input type="number" :value="extraction_code" placeholder-class="cr-grey" class="cr-base br-b spacing-mt" placeholder="请输入取货码" maxlength="4" @input="extraction_code_input_event">
    </view>
    <view class="form-gorup">
      <button class="submit-bottom" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="form_submit_take_event">确认</button>
    </view>
  </view>
</component-popup>

<!-- 搜索 popup -->
<component-popup :prop-show="is_show_search_popup" prop-position="bottom" @onclose="search_popup_event_close">
  <view class="form-container spacing-mt">
    <view class="form-gorup tc">
      <view class="form-gorup-title">搜索条件</view>
      <input type="number" :value="search_keywords_value" placeholder-class="cr-grey" class="cr-base br-b spacing-mt" placeholder="订单号/取货码" @input="search_input_keywords_event">
    </view>
    <view class="form-gorup">
      <button class="submit-bottom" type="default" hover-class="none" :disabled="form_submit_disabled_status" @tap="search_submit_event">搜索</button>
    </view>
  </view>
</component-popup>
</view>
</template>

<script>
const app = getApp();
import componentPopup from "../../../../components/popup/popup";

export default {
  data() {
    return {
      data_list: [],
      data_page_total: 0,
      data_page: 1,
      data_list_loding_status: 1,
      data_bottom_line_status: false,
      params: null,
      nav_status_list: [{
        name: "全部",
        value: "-1"
      }, {
        name: "待处理",
        value: "0"
      }, {
        name: "已处理",
        value: "1"
      }],
      nav_status_index: 0,
      is_show_take_popup: false,
      extraction_value: null,
      extraction_code: '',
      form_submit_disabled_status: false,
      is_show_search_popup: false,
      search_keywords_value: '',
      data_total: ""
    };
  },

  components: {
    componentPopup
  },
  props: {},

  onLoad(params) {
    // 是否指定状态
    var nav_status_index = 0;

    if (params.status != undefined) {
      for (var i in this.nav_status_list) {
        if (this.nav_status_list[i]['value'] == params.status) {
          nav_status_index = i;
          break;
        }
      }
    }

    this.setData({
      params: params,
      nav_status_index: nav_status_index
    });
    this.init();
  },

  onShow() {},

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
      }); // 参数

      var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['value']; // 获取数据

      uni.request({
        url: app.globalData.get_request_url("order", "extraction", "distribution"),
        method: "POST",
        data: {
          page: this.data_page,
          status: status || 0,
          keywords: this.search_keywords_value || ''
        },
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

    // 导航事件
    nav_event(e) {
      this.setData({
        nav_status_index: e.currentTarget.dataset.index || 0,
        data_page: 1
      });
      this.get_data_list(1);
    },

    // 取件码弹层-开启
    list_submit_take_event(e) {
      this.setData({
        is_show_take_popup: true,
        extraction_code: '',
        extraction_value: {
          index: e.currentTarget.dataset.index,
          oid: e.currentTarget.dataset.oid,
          uid: e.currentTarget.dataset.uid
        }
      });
    },

    // 取件码弹层-关闭
    take_popup_event_close() {
      this.setData({
        is_show_take_popup: false
      });
    },

    // 取件码输入事件
    extraction_code_input_event(e) {
      this.setData({
        extraction_code: e.detail.value || ''
      });
    },

    // 取件提交
    form_submit_take_event(e) {
      var self = this; // 参数

      if ((self.extraction_code || null) == null) {
        app.globalData.showToast('请输入取件码');
        return false;
      }

      if ((self.extraction_value || null) == null) {
        app.globalData.showToast('操作数据有误');
        return false;
      } // 提交表单


      var data = {
        id: self.extraction_value.oid,
        user_id: self.extraction_value.uid,
        extraction_code: self.extraction_code
      };
      self.setData({
        form_submit_disabled_status: true
      });
      uni.showLoading({
        title: "处理中..."
      });
      uni.request({
        url: app.globalData.get_request_url("take", "extraction", "distribution"),
        method: "POST",
        data: data,
        dataType: "json",
        success: res => {
          self.setData({
            form_submit_disabled_status: false
          });
          uni.hideLoading();

          if (res.data.code == 0) {
            var temp_data_list = this.data_list;
            var index = self.extraction_value.index;
            temp_data_list[index]['status'] = 1;
            temp_data_list[index]['status_name'] = '已处理';
            self.setData({
              is_show_take_popup: false,
              data_list: temp_data_list
            });
            app.globalData.showToast(res.data.msg, "success");
          } else {
            app.globalData.showToast(res.data.msg);
          }
        },
        fail: () => {
          self.setData({
            form_submit_disabled_status: false
          });
          uni.hideLoading();
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 搜索弹层-开启
    drag_event(e) {
      this.setData({
        is_show_search_popup: true
      });
    },

    // 搜索弹层-关闭
    search_popup_event_close() {
      this.setData({
        is_show_search_popup: false
      });
    },

    // 搜索关键字输入事件
    search_input_keywords_event(e) {
      this.setData({
        search_keywords_value: e.detail.value || ''
      });
    },

    // 搜索确认事件
    search_submit_event(e) {
      this.setData({
        is_show_search_popup: false,
        data_page: 1
      });
      this.get_data_list(1);
    }

  }
};
</script>
<style>
/*
 * 导航
 */
.nav {
  background: #eee;
  height: 80rpx;
  line-height: 80rpx;
}
.nav .item {
  width: 33.33%;
}
.nav .active {
  color: #ff6a80;
}

/*
 * 列表
 */
.scroll-box {
  height: calc(100vh - 80rpx);
}
.data-list .item .base {
  padding: 15rpx 10rpx;
}
.data-list .item .base .avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}
.data-list .item .base .nickname {
  margin-top: 10rpx;
}
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
.data-list .item .submit-order {
  border: 1px solid #e5e5e5;
  color: #888 !important;
}
.data-list .item .operation button:not(:first-child) {
  margin-left: 30rpx;
}

/*
 * 表单
 */
.submit-bottom {
  background-color: #ff6a80 !important;
  color: #fff !important;
}

/*
 * 搜索
 */
.search-drag {
  width: 30px;
  height: 30px;
  padding: 10px;
  background: hsla(0, 0%, 0%, 0.1);
  border-radius: 50%;
  margin-top: calc(100vh - 160px);
  margin-left: calc(50% - 25px);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
}
</style>
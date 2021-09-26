<template>
<view>
<view v-if="data_list_loding_status == 0">
  <!-- 未申请 -->
  <view v-if="extraction == null" class="apply-not bg-white">
    <view v-if="(data_base || null) != null && (data_base.self_extraction_apply_desc || null) != null && data_base.self_extraction_apply_desc.length > 0" class="apply-desc">
      <view v-for="(item, index) in data_base.self_extraction_apply_desc" :key="index" class="item">
        {{item}}
      </view>
    </view>

    <view class="to-submit tc">
      <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">
        <button type="primary" size="mini" hover-class="none">立即申请</button>
      </navigator>
    </view>
  </view>

  <!-- 已存在申请信息 -->
  <view v-else class="apply-already">
    <!-- status 状态（0待审核, 1已通过, 2已拒绝 -->
    <!-- 审核中 -->
    <view v-if="extraction.status == 0" class="waiting-audit bg-white">
      <view class="title-msg tc">申请信息正在审核中...</view>
      <view class="operation oh tc">
        <view class="cr-base mini-msg">你可以</view>
        <view class="to-submit tc">
          <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">
            <button type="primary" size="mini" hover-class="none">编辑信息</button>
          </navigator>
        </view>
      </view>
      
    </view>

    <!-- 审核通过 -->
    <view v-else-if="extraction.status == 1 || extraction.status == 3" class="valid">
      <view class="base br-b oh bg-white">
        <view class="base-title fl">取货点信息</view>
        <view class="fr edit-submit">
          <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">编辑信息</navigator>
        </view>
      </view>
      <view class="content bg-white" @tap="address_map_event">
        <text v-if="(extraction.alias || null) != null" class="alias">{{extraction.alias}}</text>
        <text class="cr-base">{{extraction.province_name}}{{extraction.city_name}}{{extraction.county_name}}{{extraction.address}}</text>
      </view>

      <view v-if="extraction.status == 1">
        <view class="base br-b oh bg-white spacing-mt">
          <view class="base-title fl">取货订单统计</view>
          <view class="fr edit-submit">
            <navigator url="/pages/plugins/distribution/extraction-order/extraction-order" hover-class="none">查看取货订单</navigator>
          </view>
        </view>
        <view class="content bg-white statistics oh">
          <view class="item fl tc" data-value="0" @tap="order_event">
            <view class="title cr-base">待处理</view>
            <view class="value single-text order-wait-value">{{statistical.order_wait || 0}}</view>
          </view>
          <view class="item fl tc br-l" data-value="1" @tap="order_event">
            <view class="title cr-base">已处理</view>
            <view class="value single-text order-already-value">{{statistical.order_already || 0}}</view>
          </view>
        </view>
      </view>
      <view v-else class="spacing-mt relieve">
        <view class="tips">
          当前状态也解约，可重新编辑数据提交审核。
        </view>
      </view>
      
      <view v-if="extraction.status == 1 && (data_base || null) != null && (data_base.self_extraction_common_notice || null) != null && data_base.self_extraction_common_notice.length > 0" class="extraction-notice spacing-mt">
        <view class="tips">
          <view v-for="(item, index) in data_base.self_extraction_common_notice" :key="index" class="item">
            {{item}}
          </view>
        </view>
      </view>
    </view>

    <!-- 审核失败 -->
    <view v-else="extraction.status == 2" class="refuse bg-white">
      <view class="title-msg tc">申请信息审核失败</view>
      <view v-if="(extraction.fail_reason || null) != null" class="fail-tips tips">原因：{{extraction.fail_reason}}</view>
      <view class="operation oh tc">
        <view class="cr-base mini-msg">你可以重新编辑信息提交</view>
        <view class="to-submit tc">
          <navigator url="/pages/plugins/distribution/extraction-apply/extraction-apply" hover-class="none">
            <button type="primary" size="mini" hover-class="none">编辑信息</button>
          </navigator>
        </view>
      </view>
    </view>
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

export default {
  data() {
    return {
      data_bottom_line_status: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_base: null,
      extraction: null,
      statistical: null
    };
  },

  components: {},
  props: {},

  onLoad(params) {},

  onShow() {
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data();
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
          this.get_data();
        }
      } else {
        this.setData({
          data_list_loding_status: 0,
          data_bottom_line_status: false
        });
      }
    },

    // 获取数据
    get_data() {
      var self = this;
      uni.request({
        url: app.globalData.get_request_url("index", "extraction", "distribution"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              extraction: data.extraction || null,
              statistical: data.statistical || null,
              data_list_loding_msg: '',
              data_list_loding_status: 0,
              data_bottom_line_status: true
            });
          } else {
            self.setData({
              data_bottom_line_status: false,
              data_list_loding_status: 2,
              data_list_loding_msg: res.data.msg
            });

            if (app.globalData.is_login_check(res.data, self, 'get_data')) {
              app.globalData.showToast(res.data.msg);
            }
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

    // 地图查看
    address_map_event(e) {
      if ((this.extraction || null) == null) {
        return false;
      }

      var data = this.extraction; // 打开地图

      var name = data.alias || data.name || '';
      var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
      app.globalData.open_location(data.lng, data.lat, name, address);
    },

    // 进入取货订单管理
    order_event(e) {
      var value = e.currentTarget.dataset.value || 0;
      uni.navigateTo({
        url: '/pages/plugins/distribution/extraction-order/extraction-order?status=' + value
      });
    }

  }
};
</script>
<style>
/*
 * 公共
 */
.operation {
  margin-top: 30rpx;
}
.title-msg {
  font-size: 46rpx;
  margin-top: 5%;
}
.mini-msg {
  color: #0e90d2;
}
.to-submit {
  margin-top: 15rpx;
}
.waiting-audit, .refuse {
  padding: 10% 10rpx 60rpx 10rpx;
}

/*
 * 未申请
 */
.apply-not {
  padding: 10rpx 10rpx 60rpx 10rpx; 
}
.apply-not .apply-desc {
  margin: 30rpx 30rpx 0 30rpx;
}
.apply-not .to-submit {
  margin-top: 10%;
}

/*
 * 待审核
 */
.waiting-audit .title-msg {
  color: #f37b1d;
}

/*
 * 已审核
 */
.valid .base {
  padding: 20rpx 10rpx;
}
.valid .base-title {
  font-weight: 500;
}
.valid .alias {
  border: 1px solid #ff6a80;
  color: #ff6a80;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
.valid .edit-submit {
  color: #0e90d2;
}
.valid .content {
  line-height: 46rpx;
}
.valid .content, .valid .statistics .item  {
  padding: 30rpx 10rpx;
}
.valid .extraction-notice {
  padding: 0 20rpx;
}
.valid .statistics .item {
  width: calc(50% - 1px);
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.valid .statistics .item .value {
  font-weight: bold;
  font-size: 36rpx;
  margin-top: 10rpx;
}
.valid .statistics .item .order-wait-value {
  color: #f00;
}
.valid .statistics .item .order-already-value {
  color: #2ba245;
}
.valid .relieve {
  padding: 0 10rpx;
}

/*
 * 拒绝
 */
.refuse .title-msg {
  color: #dd514c;
}
.refuse .fail-tips {
  padding-left: 10rpx;
  background: #ffffeb;
  margin-top: 10rpx;
}
.refuse .mini-msg {
  margin-top: 50rpx;
}

/*
 * 介绍
 */
.apply-desc {
  background: #def2fd;
  border: 1px solid #cfeeff;
  color: #1490d2;
  padding: 10rpx;
  font-size: 26rpx;
  border-radius: 2px;
}
</style>
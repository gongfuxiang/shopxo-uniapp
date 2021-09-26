<template>
<view>
<view v-if="detail != null">
  <!-- 地址 -->
  <view v-if="detail.order_model == 0 || detail.order_model == 2" class="address bg-white spacing-mb">
      <view class="address-base oh">
          <text v-if="(detail.address_data.alias || null) != null" class="address-alias">{{detail.address_data.alias}}</text>
          <text>{{detail.address_data.name}}</text>
          <text class="fr">{{detail.address_data.tel}}</text>
      </view>
      <view class="address-detail oh">
          <image class="icon fl" src="/static/images/user-address.png" mode="widthFix"></image>
          <view class="text fr">
            {{detail.address_data.province_name}}{{detail.address_data.city_name}}{{detail.address_data.county_name}}{{detail.address_data.address}}
            <text v-if="detail.order_model == 2 && (detail.address_data.lng || null) != null && (detail.address_data.lat || null && detail.address_data.lng != 0 && detail.address_data.lat != 0) != null" class="cr-base br address-map-submit" @tap="address_map_event">查看位置</text>
          </view>
      </view>
  </view>

  <!-- 商品列表 -->
  <view class="goods bg-white spacing-mb">
      <view v-for="(item, index) in detail.items" :key="index" class="goods-item br-b-dashed oh">
        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none">
          <image class="goods-image fl" :src="item.images" mode="aspectFill"></image>
          <view class="goods-base">
            <view class="goods-title multi-text">{{item.title}}</view>
            <block v-if="item.spec != null">
              <view v-for="(spec, index2) in item.spec" :key="index2" class="goods-spec cr-gray">
                {{spec.type}}:{{spec.value}}
              </view>
            </block>
          </view>
          <view class="oh goods-price">
            <text class="sales-price">{{detail.currency_data.currency_symbol}}{{item.price}}</text>
            <text v-if="item.original_price > 0" class="original-price">{{detail.currency_data.currency_symbol}}{{item.original_price}}</text>
            <text class="buy-number">x{{item.buy_number}}</text>
          </view>
        </navigator>
      </view>
      <view class="order-describe">{{detail.describe}}</view>
  </view>

  <!-- 虚拟销售数据 -->
  <view v-if="detail.order_model == 3 && detail.pay_status == 1 && (detail.status == 3 || detail.status == 4)" class="panel-item spacing-mt site-fictitious">
    <view class="panel-title">{{site_fictitious.title || '密钥信息'}}</view>
    <view class="panel-content bg-white oh">
      <view v-if="(site_fictitious.tips || null) != null" class="tips-value">
        <rich-text :nodes="site_fictitious.tips"></rich-text>
      </view>
      <view v-for="(item, index) in detail.items" :key="index" class="item br-b-dashed oh">
        <image class="left-image br fl" :src="item.images" mode="aspectFill"></image>
        <view class="right-value fr">
          <rich-text v-if="(item.fictitious_goods_value || null) != null" :nodes="item.fictitious_goods_value"></rich-text>
          <text v-else class="cr-gray">未配置数据</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 自提信息 -->
  <view v-if="detail.order_model == 2 && (detail.status == 2 || detail.status == 3) && (detail.extraction_data || null) != null" class="panel-item spacing-mt site-extraction">
    <view class="panel-title">取货信息</view>
    <view class="panel-content bg-white oh">
      <view>
        <text>取货码：</text>
        <text class="code">{{detail.extraction_data.code || '取货码不存在、请联系管理员'}}</text>
      </view>
      <image v-if="(detail.extraction_data.images || null) != null" class="br qrcode" :src="detail.extraction_data.images" mode="aspectFill"></image>
    </view>
  </view>

  <!-- 订单基础数据 -->
  <view v-if="detail_list.length > 0" class="panel-item spacing-mt">
    <view class="panel-title">基础数据</view>
    <view class="panel-content bg-white">
      <view v-for="(item, index) in detail_list" :key="index" class="item br-b oh">
        <view class="title fl">{{item.name}}</view>
        <view class="content fl br-l">{{item.value}}</view>
      </view>
    </view>
  </view>

  <!-- 扩展数据 -->
  <view v-if="extension_data.length > 0" class="panel-item spacing-mt extension-list">
    <view class="panel-title">扩展数据</view>
    <view class="panel-content bg-white">
      <view v-for="(item, index) in extension_data" :key="index" class="item br-b oh">
      <text class="title">{{item.name}}</text>
      <text class="content br-l">{{item.tips}}</text>
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

<view v-if="detail == null">
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

    <view v-if="data_list_loding_status != 1" class="nav-back tc wh-auto">
      <navigator open-type="navigateBack" hover-class="none">
        <button type="default" size="mini" class="cr-gray br" hover-class="none">返回</button>
      </navigator>
    </view>
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
      detail: null,
      detail_list: [],
      extension_data: [],
      site_fictitious: null
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    //params['id'] = 5;
    this.setData({
      params: params
    });
  },

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.user_order_detail
    }); // 数据加载

    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  methods: {
    // 获取数据
    init() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      });
      uni.request({
        url: app.globalData.get_request_url("detail", "order"),
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
            self.setData({
              detail: data.data,
              detail_list: [{
                name: "出货服务",
                value: data.data.warehouse_name || ''
              }, {
                name: "订单模式",
                value: data.data.order_model_name || ''
              }, {
                name: "订单编号",
                value: data.data.order_no || ''
              }, {
                name: "订单状态",
                value: data.data.status_name || ''
              }, {
                name: "支付状态",
                value: data.data.pay_status_name || ''
              }, {
                name: "订单单价",
                value: data.data.price || ''
              }, {
                name: "订单总价",
                value: data.data.total_price || ''
              }, {
                name: "优惠金额",
                value: data.data.preferential_price || ''
              }, {
                name: "增加金额",
                value: data.data.increase_price || ''
              }, {
                name: "支付金额",
                value: data.data.pay_price || ''
              }, {
                name: "支付方式",
                value: (data.data.payment_name || '') + ((data.data.is_under_line_text || null) == null ? '' : '（' + data.data.is_under_line_text + '）')
              }, {
                name: "快递公司",
                value: data.data.express_name || ''
              }, {
                name: "快递单号",
                value: data.data.express_number || ''
              }, {
                name: "用户留言",
                value: data.data.user_note || ''
              }, {
                name: "创建时间",
                value: data.data.add_time || ''
              }, {
                name: "确认时间",
                value: data.data.confirm_time || ''
              }, {
                name: "支付时间",
                value: data.data.pay_time || ''
              }, {
                name: "发货时间",
                value: data.data.delivery_time || ''
              }, {
                name: "收货时间",
                value: data.data.collect_time || ''
              }, {
                name: "取消时间",
                value: data.data.cancel_time || ''
              }, {
                name: "关闭时间",
                value: data.data.close_time || ''
              }],
              extension_data: data.data.extension_data || [],
              site_fictitious: data.site_fictitious || null,
              data_list_loding_status: 3,
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
    },

    // 地图查看
    address_map_event(e) {
      if ((this.detail.address_data || null) == null) {
        app.globalData.showToast("地址有误");
        return false;
      }

      var data = this.detail.address_data; // 打开地图

      var name = data.alias || data.name || '';
      var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
      app.globalData.open_location(data.lng, data.lat, name, address);
    }

  }
};
</script>
<style>
/*
 * 地址信息
 */
.address {
    padding: 10rpx;
}
.address-base, .address-detail {
    padding: 10rpx 35rpx 10rpx 10rpx;
}
.address-detail .icon {
    width: 30rpx;
    height: 35rpx !important;
}
.address-detail .text {
    width: calc(100% - 40rpx);
}
.address-divider {
    height: 4px;
    background-image: url("../../static/images/buy-address-divider.png");
    background-repeat-y: no-repeat;
}
.address-detail .text, .goods-title {
    line-height: 36rpx;
}
.no-address {
    height: 85rpx;
    line-height: 85rpx;
}
.address-alias {
  border: 1px solid #d2364c;
  color: #d2364c;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}

/*
 * 商品信息
 */
.goods-base {
  min-height: 160rpx;
  margin-left: 180rpx;
}
.goods .goods-item:last-child {
    border-bottom: 0;
}
.goods-item {
    padding: 20rpx 10rpx;
}
.goods-title, .goods-spec {
    margin-bottom: 10rpx;
}
.goods-image {
    width: 160rpx;
    height: 160rpx;
    margin-right: 20rpx;
}
.goods-price {
    position: relative;
}
.buy-number {
    position: absolute;
    right: 0;
    bottom: 0;
}
.order-describe {
  padding: 20rpx 10rpx;
}

/*
 * 面板信息
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
    word-wrap: break-word;
    word-break: normal;
}
.panel-item .panel-content .item view {
    line-height: 46rpx;
}

/*
 * 扩展数据
 */
.extension-list .item {
  padding: 20rpx 30rpx;
}
.extension-list .item .title {
  padding-right: 20rpx;
}
.extension-list .item .content {
  padding-left: 20rpx;
}

/*
 * 虚拟销售信息
 */
.site-fictitious .panel-content {
  padding: 0 20rpx;
}
.site-fictitious .panel-content .tips-value {
  color: #f37b1d;
  background-color: #fff2e9;
  border-color: #ffebdb;
  padding: 10rpx;
  margin-top: 20rpx;
}
.site-fictitious .panel-content .left-image {
  width: 80rpx;
  height: 80rpx;
}
.site-fictitious .panel-content .right-value {
  width: calc(100% - 100rpx);
}

/*
 * 自提信息
 */
.site-extraction .panel-content {
  padding: 20rpx;
}
.site-extraction .panel-content .code {
  background: #5eb95e;
  color: #fff;
}
.site-extraction .panel-content .code,
.address-map-submit {
  padding: 1rpx 16rpx;
  border-radius: 6rpx;
}
.site-extraction .panel-content .qrcode {
  margin-top: 15rpx;
  width: 300rpx;
  height: 300rpx;
}
.address-map-submit {
  margin-left: 20rpx;
  background: #f5f5f5;
}
</style>
<template>
<view>
<!-- 排序 -->
<view class="nav-sort oh">
  <view class="nav-sort-content">
    <block v-for="(item, index) in search_nav_sort_list" :key="index">
      <view class="item tc fl" :data-index="index" @tap="nav_sort_event">
        <text class="cr-base">{{item.name}}</text>
        <image v-if="(item.icon || null) != null" class="icon" :src="'/images/search-' + item.icon + '-icon.png'" mode="aspectFill"></image>
      </view>
    </block>
  </view>
  <image class="screening-submit" src="/static/images/search-submit-icon.png" mode="aspectFill" @tap="popup_form_event_show"></image>
</view>

<!-- 列表 -->
<scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="30">
  <view class="data-list">
    <view v-for="(item, index) in data_list" :key="index" class="items bg-white">
      <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.id" hover-class="none">
        <image :src="item.images" mode="aspectFit"></image>
        <view class="base">
          <view class="multi-text">{{item.title}}</view>
          <view class="price">
            <text class="sales-price">{{currency_symbol}}{{item.min_price}}</text>
          </view>
        </view>
      </navigator>
    </view>
  </view>
  
  <view v-if="data_list.length == 0">
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
</scroll-view>

<!-- 筛选条件 popup -->
<component-popup :prop-show="is_show_popup_form" prop-position="left" @onclose="popup_form_event_close">
  <form @submit="form_submit_event" class="popup-form oh bg-white">
    <view class="search-map">
      <view class="map-item map-base">
        <text>筛选出</text>
        <text class="cr-main"> {{data_total}} </text>
        <text>条数据</text>
        <text class="map-remove-submit fr" @tap="map_remove_event">清除</text>
      </view>

      <!-- 搜索关键字 -->
      <input type="text" placeholder="其实搜索很简单^_^ !" name="wd" :value="(post_data.wd || '')" class="map-keywords wh-auto" placeholder-class="cr-grey">

      <!-- 分类 -->
      <view v-if="(category_list || null) != null && category_list.length > 0" class="map-item">
        <view class="map-nav tc">
          <text>分类</text>
          <text class="arrow-bottom" v-if="category_list.length > 3" @tap="more_event" data-value="category_list">更多</text>
        </view>
        <view class="map-content map-text-items map-category-container oh bg-white" :style="'height:' + map_fields_list.category_list.height + ';'">
          <block v-for="(item, index) in category_list" :key="index">
            <view :class="'fl ' + (item.active == 1 ? 'active' : '')" @tap="map_item_event" :data-index="index" data-field="category_list">{{item.name}}</view>
          </block>
        </view>
      </view>

      <button form-type="submit" class="bg-main search-submit wh-auto" :disabled="popup_form_loading_status" hover-class="none">确认</button>
    </view>
  </form>
</component-popup>

<!-- 快捷导航 -->
<component-quick-nav></component-quick-nav>
</view>
</template>

<script>
const app = getApp();
import componentQuickNav from "../../../../components/quick-nav/quick-nav";
import componentPopup from "../../../../components/popup/popup";

export default {
  data() {
    return {
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_bottom_line_status: false,
      data_list: [],
      data_total: 0,
      data_page_total: 0,
      data_page: 1,
      params: null,
      post_data: {},
      is_show_popup_form: false,
      popup_form_loading_status: false,
      search_nav_sort_list: [{
        name: "综合",
        field: "default",
        sort: "asc",
        "icon": null
      }, {
        name: "销量",
        field: "sales_count",
        sort: "asc",
        "icon": "default"
      }, {
        name: "热度",
        field: "access_count",
        sort: "asc",
        "icon": "default"
      }, {
        name: "价格",
        field: "min_price",
        sort: "asc",
        "icon": "default"
      }, {
        name: "最新",
        field: "id",
        sort: "asc",
        "icon": "default"
      }],
      // 基础配置
      currency_symbol: app.globalData.data.currency_symbol,
      // 搜素条件
      search_map_info: [],
      category_list: [],
      map_fields_list: {
        "category_list": {
          "height": "82rpx",
          "default": "82rpx",
          "form_key": "category_ids"
        }
      }
    };
  },

  components: {
    componentQuickNav,
    componentPopup
  },
  props: {},

  onLoad(params) {
    // 初始参数
    this.setData({
      params: params,
      post_data: {
        wd: params.keywords || '',
        shop_id: params.shop_id || 0,
        category_ids: (params.category_id || 0) == 0 ? '' : JSON.stringify({
          "0": params.category_id
        })
      }
    }); // 显示分享菜单

    app.globalData.show_share_menu();
  },

  onShow() {
    // 数据加载
    this.init(); // 初始化配置

    this.init_config();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      data_page: 1
    });
    this.get_data_list(1);
  },

  // 自定义分享
  onShareAppMessage() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var shop_id = this.params['shop_id'] || 0;
    var category_id = this.params['category_id'] || 0;
    var keywords = this.params['keywords'] || '';
    return {
      title: this.shop.name || app.globalData.data.application_title,
      desc: this.shop.describe || app.globalData.data.application_describe,
      path: '/pages/plugins/shop/search/search?shop_id=' + shop_id + '&referrer=' + user_id + '&category_id=' + category_id + '&keywords=' + keywords
    };
  },

  // 分享朋友圈
  onShareTimeline() {
    var user_id = app.globalData.get_user_cache_info('id', 0) || 0;
    var shop_id = this.params['shop_id'] || 0;
    var category_id = this.params['category_id'] || 0;
    var keywords = this.params['keywords'] || '';
    return {
      title: this.shop.name || app.globalData.data.application_title,
      query: 'shop_id=' + shop_id + '&referrer=' + user_id + '&category_id=' + category_id + '&keywords=' + keywords
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
      // 获取数据
      this.get_data_list();
    },

    // 搜索
    search_event() {
      this.setData({
        data_list: [],
        data_page: 1
      });
      this.get_data_list(1);
    },

    // 获取数据列表
    get_data_list(is_mandatory) {
      // 分页是否还有数据
      if ((is_mandatory || 0) == 0) {
        if (this.data_bottom_line_status == true) {
          return false;
        }
      } // 加载loding


      uni.showLoading({
        title: "加载中..."
      }); // 参数

      var post_data = this.request_map_handle(); // 获取数据

      uni.request({
        url: app.globalData.get_request_url("index", "search", "shop"),
        method: "POST",
        data: post_data,
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data; // 仅首次请求赋值条件数据

            if (this.data_list_loding_status == 1) {
              this.setData({
                search_map_info: data.search_map_info || [],
                category_list: data.shop_goods_category || []
              }); // 指定分类id选中处理

              if ((this.params.category_id || 0) != 0 && this.category_list.length > 0) {
                var temp = this.category_list;

                for (var i in temp) {
                  if (temp[i]['id'] == this.params.category_id) {
                    temp[i]['active'] = 1;
                  }
                }

                this.setData({
                  category_list: temp
                });
              }
            } // 列表数据处理


            if (data.data.length > 0) {
              if (this.data_page <= 1) {
                var temp_data_list = data.data;
              } else {
                var temp_data_list = this.data_list;
                var temp_data = data.data;

                for (var i in temp_data) {
                  temp_data_list.push(temp_data[i]);
                }
              }

              this.setData({
                data_list: temp_data_list,
                data_total: data.total,
                data_page_total: data.page_total,
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
              data_list_loding_status: 0,
              data_list_loding_msg: res.data.msg
            });
            app.globalData.showToast(res.data.msg);
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

    // 搜索条件处理
    request_map_handle() {
      var params = this.params;
      var post_data = this.post_data;
      post_data['page'] = this.data_page; // 店铺id

      post_data['shop_id'] = params['shop_id'] || 0; // 搜索条件

      var data = this;

      for (var i in data.map_fields_list) {
        if (data[i] != null != null && data[i].length > 0) {
          var temp = {};
          var index = 0;

          for (var k in data[i]) {
            if ((data[i][k]['active'] || 0) == 1) {
              // 默认取值id
              temp[index] = data[i][k]['id'];
              index++;
            }
          }

          post_data[data.map_fields_list[i]['form_key']] = app.globalData.get_length(temp) > 0 ? JSON.stringify(temp) : '';
        }
      }

      return post_data;
    },

    // 滚动加载
    scroll_lower(e) {
      this.get_data_list();
    },

    // 搜索条件
    form_submit_event(e) {
      this.setData({
        post_data: e.detail.value,
        data_page: 1
      });
      this.popup_form_event_close();
      this.get_data_list(1);
    },

    // 筛选条件关闭
    popup_form_event_close(e) {
      this.setData({
        is_show_popup_form: false
      });
    },

    // 筛选条件开启
    popup_form_event_show(e) {
      this.setData({
        is_show_popup_form: true
      });
    },

    // 排序事件
    nav_sort_event(e) {
      var index = e.currentTarget.dataset.index || 0;
      var temp_post_data = this.post_data;
      var temp_search_nav_sort = this.search_nav_sort_list;
      var temp_sort = temp_search_nav_sort[index]['sort'] == 'desc' ? 'asc' : 'desc';

      for (var i in temp_search_nav_sort) {
        if (i != index) {
          if (temp_search_nav_sort[i]['icon'] != null) {
            temp_search_nav_sort[i]['icon'] = 'default';
          }

          temp_search_nav_sort[i]['sort'] = 'desc';
        }
      }

      temp_search_nav_sort[index]['sort'] = temp_sort;

      if (temp_search_nav_sort[index]['icon'] != null) {
        temp_search_nav_sort[index]['icon'] = temp_sort;
      }

      temp_post_data['order_by_field'] = temp_search_nav_sort[index]['field'];
      temp_post_data['order_by_type'] = temp_sort;
      this.setData({
        post_data: temp_post_data,
        search_nav_sort_list: temp_search_nav_sort,
        data_page: 1
      });
      this.get_data_list(1);
    },

    // 条件-更多数据展示事件
    more_event(e) {
      var value = e.currentTarget.dataset.value || null;
      var temp_more = this.map_fields_list;

      if (value != null && (temp_more[value] || null) != null) {
        temp_more[value]['height'] = temp_more[value]['height'] == 'auto' ? temp_more[value]['default'] : 'auto';
        this.setData({
          map_fields_list: temp_more
        });
      }
    },

    // 条件-选择事件
    map_item_event(e) {
      var index = e.currentTarget.dataset.index;
      var field = e.currentTarget.dataset.field;
      var data = this;

      if ((data[field] || null) != null && (data[field][index] || null) != null) {
        data[field][index]['active'] = (data[field][index]['active'] || 0) == 0 ? 1 : 0;
        this.setData(data);
      }
    },

    // 条件-清空
    map_remove_event(e) {
      var data = this; // 关键字

      data['post_data']['wd'] = ''; // 分类

      for (var i in data.map_fields_list) {
        if (data[i] != null != null && data[i].length > 0) {
          for (var k in data[i]) {
            data[i][k]['active'] = 0;
          }
        }
      } // 关闭条件弹层


      data['is_show_popup_form'] = false; // 分页恢复1页、重新获取数据

      data['data_page'] = 1;
      this.setData(data);
      this.get_data_list(1);
    }

  }
};
</script>
<style>
/**
 * 排序导航
 */
.nav-sort {
   background: #eee;
 }
.nav-sort-content .item {
  height: 80rpx;
  line-height: 80rpx;
  width: 130rpx;
}
.nav-sort-content .item .icon {
  width: 30rpx;
  height: 30rpx;
}
.nav-sort-content .item text, .nav-sort-content .item image {
  vertical-align:middle;
}
.screening-submit {
  width: 50rpx;
  height: 50rpx;
  position: absolute;
  top: 15rpx;
  right: 20rpx;
}

/**
 * 商品列表
 */
.scroll-box {
   height: calc(100vh - 80rpx);
 }
.data-list {
    overflow: hidden;
}
.data-list .items {
    width: calc(50% - 5rpx);
    margin-bottom: 10rpx;
    padding-bottom: 20rpx;
}
.data-list .items:nth-child(2n) {
    float: right;
}
.data-list .items:nth-child(2n+1) {
    float: left;
}
.data-list .items image {
    width: 100%;
    height: 200px !important;
}
.data-list .items .base {
    text-align: left;
    font-size: 32rpx;
    padding: 0 15rpx;
}
.data-list .items .base,
.data-list .items .base .price {
    margin-top: 15rpx;
}

/**
 * 条件
 */
.search-map {
  height: calc(100vh - 80rpx);
  width: 680rpx;
  overflow-y: scroll;
  overflow-x: hidden;
}
.map-keywords {
  border-radius: 0 !important;
  padding: 0 10rpx;
  line-height: 66rpx;
  height: 66rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}
.map-nav {
  position: relative;
}
.map-nav .arrow-bottom {
  position: absolute;
  top: 0;
  right: 10rpx;
  padding-right: 46rpx;
  color: #999;
}
.map-item {
  background: #f0f0f0;
  line-height: 76rpx;
}
.map-base,
.map-nav {
  padding: 0 10rpx;
}
.map-content {
  padding: 15rpx;
  line-height: 60rpx;
}
.map-text-items view,
.map-images-text-items view {
  padding: 0 15rpx;
  border-radius: 2px;
  margin: 15rpx;
  border: 1px solid transparent;
}
.map-images-text-items view {
  vertical-align: middle;
  border: 1px solid #eee;
  width: 150rpx;
  height: 72rpx;
  line-height: 72rpx;
}
.map-images-text-items view image {
  width: 150rpx;
  height: calc(100% - 8rpx);
  display: block;
  margin: 0 auto;
  margin-top: 4rpx;
}
.map-text-items view.active,
.map-images-text-items view.active {
  border: 1px solid #e23f36;
  color: #e23f36;
  font-weight: bold;
}
.search-map .search-submit {
  height: 80rpx;
  line-height: 80rpx;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 0;
}
.map-remove-submit {
  color: #e23f36;
}

/**
 * 品牌基础信息
 */
.brand-info {
  padding: 35rpx 15rpx;
}
.brand-info image,
.brand-info .info-logo-empty {
  width: 300rpx;
  height: 130rpx;
  border: 1px solid #eee;
}
.brand-info .info-logo-empty {
  line-height: 130rpx;
}
.brand-info .info-right {
  width: calc(100% - 330rpx);
}
.brand-info .info-desc {
  color: #999;
  font-size: 28rpx;
  line-height: 40rpx;
  min-height: 80rpx;
}
</style>
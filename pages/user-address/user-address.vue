<template>
<view>
<view class="page">
  <view v-if="data_list.length > 0">
    <view v-for="(item, index) in data_list" :key="index" class="item bg-white spacing-mb">
      <view @tap="address_conent_event" :data-index="index">
        <view class="base oh">
          <text v-if="(item.alias || null) != null" class="address-alias">{{item.alias}}</text>
          <text>{{item.name}}</text>
          <text class="fr">{{item.tel}}</text>
        </view>
        <view class="address oh">
          <image class="item-icon fl" src="/static/images/user-address.png" mode="widthFix"></image>
          <view class="text fr">{{item.province_name || ''}}{{item.city_name || ''}}{{item.county_name || ''}}{{item.address || ''}}</view>
        </view>
      </view>
      <view class="operation br-t oh">
        <view class="default fl" @tap="address_default_event" :data-value="item.id">
          <image v-if="is_default == item.id" class="item-icon" src="/static/images/default-select-active-icon.png" mode="widthFix"></image>
          <image v-else class="item-icon" src="/static/images/default-select-icon.png" mode="widthFix"></image>
          <text>设为默认地址</text>
        </view>
        <view class="fr oh submit-items">
          <button v-if="(item.lng || null) != null && (item.lat || null) != null && item.lng != 0 && item.lat != 0" class="cr-base br" type="default" size="mini" @tap="address_map_event" :data-index="index" hover-class="none">位置</button>
          <button class="cr-base br" type="default" size="mini" @tap="address_edit_event" :data-index="index" hover-class="none">编辑</button>
          <button class="cr-base br" type="default" size="mini" @tap="address_delete_event" :data-index="index" :data-value="item.id" hover-class="none">删除</button>
        </view>
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

  <view class="submit-list">
    <navigator url="/pages/user-address-save/user-address-save" open-type="navigate" hover-class="none">
      <button class="submit-fixed submit-bottom" type="default" hover-class="none">添加新地址</button>
    </navigator>
    <button class="submit-fixed submit-bottom import-system-address-submit" type="default" hover-class="none" @tap="choose_system_address_event">导入微信地址</button>
  </view>
</view>
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
      params: null,
      is_default: 0
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
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.user_address
    });
    this.init();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.get_data_list();
  },

  methods: {
    // 初始化
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

    // 获取数据列表
    get_data_list() {
      // 加载loding
      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      }); // 获取数据

      uni.request({
        url: app.globalData.get_request_url("index", "useraddress"),
        method: "POST",
        data: {},
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;

            if (data.data.length > 0) {
              // 获取当前默认地址
              var is_default = 0;

              for (var i in data.data) {
                if (data.data[i]['is_default'] == 1) {
                  is_default = data.data[i]['id'];
                }
              } // 设置数据


              this.setData({
                data_list: data.data,
                is_default: is_default,
                data_list_loding_status: 3,
                data_bottom_line_status: true
              });
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

    // 删除地址
    address_delete_event(e) {
      var index = e.currentTarget.dataset.index;
      var value = e.currentTarget.dataset.value || null;

      if (value == null) {
        app.globalData.showToast("地址ID有误");
        return false;
      }

      var self = this;
      uni.showModal({
        title: "温馨提示",
        content: "删除后不可恢复，确定继续吗?",
        confirmText: "确认",
        cancelText: "不了",
        success: result => {
          if (result.confirm) {
            // 加载loding
            uni.showLoading({
              title: "处理中..."
            }); // 获取数据

            uni.request({
              url: app.globalData.get_request_url("delete", "useraddress"),
              method: "POST",
              data: {
                id: value
              },
              dataType: "json",
              success: res => {
                uni.hideLoading();

                if (res.data.code == 0) {
                  var temp_data = self.data_list;
                  temp_data.splice(index, 1);
                  self.setData({
                    data_list: temp_data,
                    data_list_loding_status: temp_data.length == 0 ? 0 : 3,
                    data_bottom_line_status: temp_data.length == 0 ? false : true
                  });
                  app.globalData.showToast(res.data.msg, "success"); // 当前删除是否存在缓存中，存在则删除

                  var cache_address = uni.getStorageSync(app.globalData.data.cache_buy_user_address_select_key);

                  if ((cache_address.data || null) != null) {
                    if (cache_address.data.id == value) {
                      // 删除地址缓存
                      uni.removeStorageSync(app.globalData.data.cache_buy_user_address_select_key);
                    }
                  }
                } else {
                  if (app.globalData.is_login_check(res.data)) {
                    app.globalData.showToast(res.data.msg);
                  } else {
                    app.globalData.showToast('提交失败，请重试！');
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
      });
    },

    // 默认地址设置
    address_default_event(e) {
      var value = e.currentTarget.dataset.value || null;

      if (value == null) {
        app.globalData.showToast("地址ID有误");
        return false;
      }

      var self = this;

      if (value == self.is_default) {
        app.globalData.showToast("设置成功", "success");
        return false;
      } // 加载loding


      uni.showLoading({
        title: "处理中..."
      }); // 获取数据

      uni.request({
        url: app.globalData.get_request_url("setdefault", "useraddress"),
        method: "POST",
        data: {
          id: value
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();

          if (res.data.code == 0) {
            self.setData({
              is_default: value
            });
            app.globalData.showToast(res.data.msg, "success");
          } else {
            if (app.globalData.is_login_check(res.data)) {
              app.globalData.showToast(res.data.msg);
            } else {
              app.globalData.showToast('提交失败，请重试！');
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 地址内容事件
    address_conent_event(e) {
      var index = e.currentTarget.dataset.index || 0;
      var is_back = this.params.is_back || 0;

      if (is_back == 1) {
        uni.setStorage({
          key: app.globalData.data.cache_buy_user_address_select_key,
          data: this.data_list[index]
        });
        uni.navigateBack();
      }
    },

    // 获取系统地址
    choose_system_address_event(e) {
      var self = this;
      uni.authorize({
        scope: 'scope.address',
        success: function (res) {
          uni.chooseAddress({
            success(res) {
              var data = {
                "name": res.userName || '',
                "tel": res.telNumber || '',
                "province": res.provinceName || '',
                "city": res.cityName || '',
                "county": res.countyName || '',
                "address": res.detailInfo || ''
              }; // 加载loding

              uni.showLoading({
                title: "处理中..."
              }); // 获取数据

              uni.request({
                url: app.globalData.get_request_url("outsystemadd", "useraddress"),
                method: "POST",
                data: data,
                dataType: "json",
                headers: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: res => {
                  uni.hideLoading();

                  if (res.data.code == 0) {
                    self.get_data_list();
                  } else {
                    if (app.globalData.is_login_check(res.data)) {
                      app.globalData.showToast(res.data.msg);
                    } else {
                      app.globalData.showToast('提交失败，请重试！');
                    }
                  }
                },
                fail: () => {
                  uni.hideLoading();
                  app.globalData.showToast("服务器请求出错");
                }
              });
            }

          });
        },
        fail: function (res) {
          app.globalData.showToast('取消选择');
        }
      });
    },

    // 地址编辑
    address_edit_event(e) {
      var index = e.currentTarget.dataset.index || 0;
      var data = this.data_list[index] || null;

      if (data == null) {
        app.globalData.showToast("地址有误");
        return false;
      } // 进入编辑页面


      uni.navigateTo({
        url: '/pages/user-address-save/user-address-save?id=' + data.id
      });
    },

    // 地图查看
    address_map_event(e) {
      var index = e.currentTarget.dataset.index || 0;
      var data = this.data_list[index] || null;

      if (data == null) {
        app.globalData.showToast("地址有误");
        return false;
      } // 打开地图


      var name = data.alias || data.name || '';
      var address = (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || '');
      app.globalData.open_location(data.lng, data.lat, name, address);
    }

  }
};
</script>
<style>
.item {
    padding: 10rpx 10rpx 0 10rpx;
}
.base, .address, .operation {
    padding: 20rpx 0;
}
.address .item-icon {
    width: 30rpx;
    height: 35rpx !important;
}
.address-alias {
  border: 1px solid #d2364c;
  color: #d2364c;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  margin-right: 10rpx;
}
.address .text {
    line-height: 44rpx;
    width: calc(100% - 40rpx);
}
.operation .default {
    margin-top: 5rpx;
}
.operation .default .item-icon {
    width: 50rpx;
    height: 50rpx !important;
    margin-right: 10rpx;
    vertical-align: middle;
}
.operation .submit-items button:not(:last-child) {
    margin-right: 20rpx;
}
.page {
    padding-bottom: 85rpx;
}
.submit-list button {
    width: 50%;
}
.submit-list .import-system-address-submit {
    background: #07c160 !important;
    right: 0;
    left: auto;
}
</style>
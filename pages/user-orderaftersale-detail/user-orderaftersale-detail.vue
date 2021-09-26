<template>
<view>
<view v-if="order_data != null">
  <!-- 商品 -->
  <view class="goods bg-white spacing-mb">
      <view class="goods-item oh">
        <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + order_data.items.goods_id" hover-class="none">
          <image class="goods-image fl" :src="order_data.items.images" mode="aspectFill"></image>
          <view class="goods-base">
            <view class="goods-title multi-text">{{order_data.items.title}}</view>
            <block v-if="order_data.items.spec != null">
              <view v-for="(spec, index) in order_data.items.spec" :key="index" class="goods-spec cr-gray">
                {{spec.type}}:{{spec.value}}
              </view>
            </block>
          </view>
          <view class="oh goods-price">
            <text class="sales-price">{{order_data.currency_data.currency_symbol}}{{order_data.items.price}}</text>
            <text v-if="order_data.items.original_price > 0" class="original-price">{{order_data.currency_data.currency_symbol}}{{order_data.items.original_price}}</text>
            <text class="buy-number">x{{order_data.items.buy_number}}</text>
          </view>
        </navigator>
      </view>
  </view>

  <!-- 基础信息 -->
  <view v-if="new_aftersale_data != null" class="detail bg-white">
    <!-- 提示/退货 -->
    <view v-if="new_aftersale_data.status <= 2" class="msg-tips spacing-mb">
      <text class="msg-text">{{new_aftersale_data.tips_msg}}</text>
      <text class="msg-a" @tap="show_aftersale_event">详情查看 >></text>
      <view>
        <button v-if="new_aftersale_data.status == 1 && new_aftersale_data.type == 1 && return_goods_address != null" type="primary" size="mini" @tap="delivery_submit_event">立即退货</button>
      </view>
    </view>

    <!-- 退货地址 -->
    <view v-if="new_aftersale_data.status == 1 && new_aftersale_data.type == 1 && return_goods_address != null" class="return-address msg-tips msg-tips-warning spacing-mb">
      <view>
        <text class="address-title">退货地址：</text>
        <text class="address-value">{{return_goods_address}}</text>
      </view>
    </view>

    <!-- 提示 -->
    <view v-if="new_aftersale_data.status >= 3" :class="'msg-tips ' + (new_aftersale_data.status != 5 ? 'spacing-mb' : '') + ' ' + (new_aftersale_data.status == 3 ? 'msg-tips-success' : (new_aftersale_data.status == 4 ? 'msg-tips-danger' : 'msg-tips-warning'))">
      <text class="msg-text">{{new_aftersale_data.tips_msg}}</text>
      <text class="msg-a" @tap="show_aftersale_event">详情查看 >></text>
    </view>

    <!-- 详情 -->
    <view v-if="new_aftersale_data.status != 5">
      <!-- 申请信息 -->
      <view class="panel-item">
        <view class="panel-title">申请信息</view>
        <view class="panel-content">
          <view v-for="(item, index) in panel_base_data_list" :key="index" class="item br-b oh">
            <view class="title fl">{{item.name}}</view>
            <view class="content fl br-l">{{new_aftersale_data[item.field] || ''}}</view>
          </view>
        </view>
      </view>

      <!-- 快递信息 -->
      <view v-if="new_aftersale_data.status > 1 && new_aftersale_data.type == 1" class="panel-item spacing-mt">
        <view class="panel-title">快递信息</view>
        <view class="panel-content">
          <view v-for="(item, index) in panel_express_data_list" :key="index" class="item br-b oh">
            <view class="title fl">{{item.name}}</view>
            <view class="content fl br-l">{{new_aftersale_data[item.field] || ''}}</view>
          </view>
        </view>
      </view>

      <!-- 凭证 -->
      <view v-if="(new_aftersale_data.images || null) != null && new_aftersale_data.images.length > 0" class="panel-item spacing-mt">
        <view class="panel-title">凭证</view>
        <view class="panel-content voucher-data oh">
          <view v-for="(item, index) in new_aftersale_data.images" :key="index" class="fl item">
            <image :src="item" mode="aspectFill" @tap="images_view_event" :data-index="index"></image>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 没有售后数据/售后数据为已取消则可以重新申请售后 -->
  <view v-if="new_aftersale_data == null || new_aftersale_data.status == 5" class="spacing-mt">
    <!-- 类型选择 -->
    <view v-if="aftersale_type_list.length > 0" class="choose-type bg-white spacing-mb oh">
      <block v-for="(item, index) in aftersale_type_list" :key="index">
        <view :class="'choose-item ' + (index == 0 ? 'fl' : 'fr') + ' ' + (form_type == item.value ? 'choose-item-active' : '')" :data-value="item.value" @tap="form_type_event">
          <view class="choose-name">{{item.name}}</view>
          <view class="choose-desc cr-gray">{{item.desc}}</view>
        </view>
      </block>
    </view>

    <!-- 表单 -->
    <view v-if="form_type != null" class="form-container spacing-mb oh">
      <view class="form-gorup bg-white">
        <view class="form-gorup-title">退款原因<text class="form-group-tips-must">必选</text></view>
        <picker @change="form_reason_event" :value="form_reason_index" :range="reason_data_list">
          <view :class="'picker ' + (form_reason_index == null ? 'cr-grey' : 'cr-base') + ' arrow-right'">
            {{form_reason_index == null ? '请选择原因' : reason_data_list[form_reason_index]}}
          </view>
        </picker>
      </view>

      <view v-if="form_type == 1" class="form-gorup bg-white">
        <view class="form-gorup-title">商品件数<text class="form-group-tips">不能大于{{returned_data.returned_quantity}}数量</text></view>
        <slider @change="form_number_event" min="0" :max="returned_data.returned_quantity" step="1" :value="returned_data.returned_quantity" show-value></slider>
      </view>

      <view class="form-gorup bg-white">
        <view class="form-gorup-title">退款金额<text class="form-group-tips">不能大于{{returned_data.refund_price}}元</text></view>
        <input type="digit" @input="form_price_event" placeholder-class="cr-grey" class="cr-base" placeholder="请输入退款金额" :value="form_price">
      </view>

      <view class="form-gorup bg-white">
        <view class="form-gorup-title">退款说明<text class="form-group-tips">选填</text></view>
        <textarea @input="form_msg_event" placeholder-class="cr-grey" class="cr-base" placeholder="退款说明最多200个字符" maxlength="200" :auto-height="true" :value="form_msg"></textarea>
      </view>

      <view class="form-gorup bg-white form-container-upload oh">
        <view class="form-gorup-title">上传凭证<text class="form-group-tips">最多上传3张图片</text></view>
        <view class="form-upload-data fl">
          <block v-if="form_images_list.length > 0">
            <view v-for="(item, index) in form_images_list" :key="index" class="item fl">
              <text class="delete-icon" @tap="upload_delete_event" :data-index="index">x</text>
              <image :src="item" @tap="upload_show_event" :data-index="index" mode="aspectFill"></image>
            </view>
          </block>
        </view>
        <image v-if="form_images_list.length < 3" class="upload-icon" src="/static/images/default-upload-icon.png" mode="aspectFill" @tap="file_upload_event"></image>
      </view>
      <view class="form-gorup">
        <button class="bg-main submit-bottom" type="default" @tap="form_submit_event" hover-class="none" :disabled="form_button_disabled">提交</button>
      </view>
    </view>
  </view>

  <!-- 退货弹层 -->
  <component-popup :prop-show="popup_delivery_status" prop-position="bottom" @onclose="popup_delivery_close_event">
    <view class="delivery-popup bg-white">
      <view class="close fr oh">
        <view class="fr" @tap.stop="popup_delivery_close_event">
          <icon type="clear" size="20"></icon>
        </view>
      </view>
      <view class="delivery-popup-content">
        <view class="form-container">
          <view class="form-gorup">
            <view class="form-gorup-title">快递名称<text class="form-group-tips-must">必填</text></view>
            <input type="text" @input="form_express_name_event" placeholder-class="cr-grey" class="cr-base" placeholder="请输入快递名称" :value="form_express_name">
          </view>
          <view class="form-gorup">
            <view class="form-gorup-title">快递单号<text class="form-group-tips-must">必填</text></view>
            <input type="text" @input="form_express_number_event" placeholder-class="cr-grey" class="cr-base" placeholder="请输入快递单号" :value="form_express_number">
          </view>
          <view class="form-gorup">
            <button class="bg-main submit-bottom" type="default" @tap="form_delivery_submit_event" hover-class="none" :disabled="form_button_disabled">提交</button>
          </view>
        </view>
      </view>
    </view>
  </component-popup>
</view>
<view v-if="order_data == null">
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
<block data-type="template" data-is="bottom_line" data-attr="status: data_bottom_line_status" v-if="new_aftersale_data != null && new_aftersale_data.status != 5">
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
import componentPopup from "../../components/popup/popup";

export default {
  data() {
    return {
      params: null,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_bottom_line_status: false,
      popup_delivery_status: false,
      // 接口数据
      editor_path_type: '',
      order_data: null,
      new_aftersale_data: null,
      step_data: null,
      returned_data: null,
      return_only_money_reason: [],
      return_money_goods_reason: [],
      aftersale_type_list: [],
      reason_data_list: [],
      return_goods_address: null,
      // 售后基础信息
      panel_base_data_list: [{
        name: '退款类型',
        field: 'type_text'
      }, {
        name: '当前状态',
        field: 'status_text'
      }, {
        name: '申请原因',
        field: 'reason'
      }, {
        name: '退货数量',
        field: 'number'
      }, {
        name: '退款金额',
        field: 'price'
      }, {
        name: '退款说明',
        field: 'msg'
      }, {
        name: '退款方式',
        field: 'refundment_text'
      }, {
        name: '拒绝原因',
        field: 'refuse_reason'
      }, {
        name: '申请时间',
        field: 'apply_time_time'
      }, {
        name: '确认时间',
        field: 'confirm_time_time'
      }, {
        name: '退货时间',
        field: 'delivery_time_time'
      }, {
        name: '审核时间',
        field: 'audit_time_time'
      }, {
        name: '取消时间',
        field: 'cancel_time_time'
      }, {
        name: '添加时间',
        field: 'add_time_time'
      }, {
        name: '更新时间',
        field: 'upd_time_time'
      }],
      // 快递信息
      panel_express_data_list: [{
        name: '快递名称',
        field: 'express_name'
      }, {
        name: '快递单号',
        field: 'express_number'
      }, {
        name: '退货时间',
        field: 'delivery_time_time'
      }],
      // 表单数据
      form_button_disabled: false,
      form_type: null,
      form_reason_index: null,
      form_price: '',
      form_msg: '',
      form_number: 0,
      form_images_list: [],
      form_express_name: '',
      form_express_number: ''
    };
  },

  components: {
    componentPopup
  },
  props: {},

  onLoad(params) {
    this.setData({
      params: params,
      popup_delivery_status: (params.is_delivery_popup || 0) == 1
    });
  },

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.user_orderaftersale_detail
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
        url: app.globalData.get_request_url("aftersale", "orderaftersale"),
        method: "POST",
        data: {
          oid: this.params.oid,
          did: this.params.did
        },
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_list_loding_status: 3,
              data_bottom_line_status: true,
              data_list_loding_msg: '',
              editor_path_type: data.editor_path_type || '',
              order_data: data.order_data || null,
              new_aftersale_data: (data.new_aftersale_data || null) == null || data.new_aftersale_data.length <= 0 ? null : data.new_aftersale_data,
              step_data: data.step_data || null,
              returned_data: data.returned_data || null,
              return_only_money_reason: data.return_only_money_reason || [],
              return_money_goods_reason: data.return_money_goods_reason || [],
              aftersale_type_list: data.aftersale_type_list || [],
              return_goods_address: data.return_goods_address || null,
              form_price: data.returned_data || null != null ? data.returned_data.refund_price : 0
            });
          } else {
            self.setData({
              data_list_loding_status: 0,
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

    // 类型选择
    form_type_event(e) {
      var value = e.currentTarget.dataset.value;
      this.setData({
        form_type: value,
        form_reason_index: this.form_type == value ? this.form_reason_index : null,
        reason_data_list: value == 0 ? this.return_only_money_reason : this.return_money_goods_reason,
        form_number: value == 0 ? 0 : this.returned_data.returned_quantity
      });
    },

    // 原因选择
    form_reason_event(e) {
      this.setData({
        form_reason_index: e.detail.value
      });
    },

    // 商品件数
    form_number_event(e) {
      this.setData({
        form_number: e.detail.value
      });
    },

    // 退款金额
    form_price_event(e) {
      this.setData({
        form_price: e.detail.value
      });
    },

    // 退款说明
    form_msg_event(e) {
      this.setData({
        form_msg: e.detail.value
      });
    },

    // 快递名称
    form_express_name_event(e) {
      this.setData({
        form_express_name: e.detail.value
      });
    },

    // 快递单号
    form_express_number_event(e) {
      this.setData({
        form_express_number: e.detail.value
      });
    },

    // 上传图片预览
    upload_show_event(e) {
      uni.previewImage({
        current: this.form_images_list[e.currentTarget.dataset.index],
        urls: this.form_images_list
      });
    },

    // 图片删除
    upload_delete_event(e) {
      var self = this;
      uni.showModal({
        title: '温馨提示',
        content: '删除后不可恢复、继续吗？',

        success(res) {
          if (res.confirm) {
            var list = self.form_images_list;
            list.splice(e.currentTarget.dataset.index, 1);
            self.setData({
              form_images_list: list
            });
          }
        }

      });
    },

    // 文件上传
    file_upload_event(e) {
      var self = this;
      uni.chooseImage({
        count: 3,

        success(res) {
          var success = 0;
          var fail = 0;
          var length = res.tempFilePaths.length;
          var count = 0;
          self.upload_one_by_one(res.tempFilePaths, success, fail, count, length);
        }

      });
    },

    // 采用递归的方式上传多张
    upload_one_by_one(img_paths, success, fail, count, length) {
      var self = this;

      if (self.form_images_list.length < 3) {
        uni.uploadFile({
          url: app.globalData.get_request_url("index", "ueditor"),
          filePath: img_paths[count],
          name: 'upfile',
          formData: {
            action: 'uploadimage',
            path_type: self.editor_path_type
          },
          success: function (res) {
            success++;

            if (res.statusCode == 200) {
              var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);

              if (data.code == 0 && (data.data.url || null) != null) {
                var list = self.form_images_list;
                list.push(data.data.url);
                self.setData({
                  form_images_list: list
                });
              } else {
                app.globalData.showToast(data.msg);
              }
            }
          },
          fail: function (e) {
            fail++;
          },
          complete: function (e) {
            count++; // 下一张

            if (count >= length) {// 上传完毕，作一下提示
              //app.showToast('上传成功' + success +'张', 'success');
            } else {
              // 递归调用，上传下一张
              self.upload_one_by_one(img_paths, success, fail, count, length);
            }
          }
        });
      }
    },

    // 售后表单提交
    form_submit_event(e) {
      // 表单数据
      var form_data = {
        order_id: this.params.oid,
        order_detail_id: this.params.did,
        type: this.form_type,
        reason: this.reason_data_list[this.form_reason_index],
        number: this.form_type == 0 ? 0 : this.form_number,
        price: this.form_price,
        msg: this.form_msg,
        images: this.form_images_list.length > 0 ? JSON.stringify(this.form_images_list) : ''
      }; // 防止金额大于计算的金额

      if (form_data['price'] > this.returned_data['refund_price']) {
        form_data['price'] = this.returned_data['refund_price'];
      } // 防止数量大于计算的数量


      if (form_data['number'] > this.returned_data['returned_quantity']) {
        form_data['number'] = this.returned_data['returned_quantity'];
      } // 数据校验


      var validation = [{
        fields: "type",
        msg: "请选择操作类型",
        is_can_zero: 1
      }, {
        fields: "reason",
        msg: "请选择原因"
      }];

      if (form_data['type'] == 1) {
        validation.push({
          fields: "number",
          msg: "请选择退货数量"
        });
      } // 校验参数并提交


      if (app.globalData.fields_check(form_data, validation)) {
        var self = this;
        uni.showLoading({
          title: "处理中..."
        });
        self.setData({
          form_button_disabled: true
        });
        uni.request({
          url: app.globalData.get_request_url("create", "orderaftersale"),
          method: "POST",
          data: form_data,
          dataType: "json",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              app.globalData.showToast(res.data.msg, "success");
              setTimeout(function () {
                self.setData({
                  form_button_disabled: false
                });
                self.init();
              }, 1000);
            } else {
              self.setData({
                form_button_disabled: false
              });
              app.globalData.showToast(res.data.msg);
            }
          },
          fail: () => {
            uni.hideLoading();
            self.setData({
              form_button_disabled: false
            });
            app.globalData.showToast("服务器请求出错");
          }
        });
      }
    },

    // 退货开启弹层
    delivery_submit_event(e) {
      this.setData({
        popup_delivery_status: true
      });
    },

    // 退货弹层关闭
    popup_delivery_close_event(e) {
      this.setData({
        popup_delivery_status: false
      });
    },

    // 退货表单
    form_delivery_submit_event(e) {
      // 表单数据
      var form_data = {
        id: this.new_aftersale_data.id,
        express_name: this.form_express_name,
        express_number: this.form_express_number
      }; // 数据校验

      var validation = [{
        fields: "express_name",
        msg: "请填写快递名称"
      }, {
        fields: "express_number",
        msg: "请填写快递单号"
      }]; // 校验参数并提交

      if (app.globalData.fields_check(form_data, validation)) {
        var self = this;
        uni.showLoading({
          title: "处理中..."
        });
        self.setData({
          form_button_disabled: true
        });
        uni.request({
          url: app.globalData.get_request_url("delivery", "orderaftersale"),
          method: "POST",
          data: form_data,
          dataType: "json",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            uni.hideLoading();
            self.setData({
              popup_delivery_status: false
            });

            if (res.data.code == 0) {
              app.globalData.showToast(res.data.msg, "success");
              setTimeout(function () {
                self.setData({
                  form_button_disabled: false
                });
                self.init();
              }, 1000);
            } else {
              self.setData({
                form_button_disabled: false
              });
              app.globalData.showToast(res.data.msg);
            }
          },
          fail: () => {
            uni.hideLoading();
            self.setData({
              form_button_disabled: false
            });
            app.globalData.showToast("服务器请求出错");
          }
        });
      }
    },

    // 凭证图片预览
    images_view_event(e) {
      uni.previewImage({
        current: this.new_aftersale_data.images[e.currentTarget.dataset.index],
        urls: this.new_aftersale_data.images
      });
    },

    // 查看售后数据
    show_aftersale_event(e) {
      uni.navigateTo({
        url: "/pages/user-orderaftersale/user-orderaftersale?keywords=" + this.new_aftersale_data.order_no
      });
    }

  }
};
</script>
<style>
/**
 * 商品
 */
.goods-base {
  min-height: 160rpx;
  margin-left: 180rpx;
}
.goods .goods-item:not(:last-child) {
    border-bottom: 1px dashed #efefef;
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

/**
 * 类型选择
 */
 .choose-type {
   padding: 30rpx 10rpx;
 }
.choose-type .choose-item {
    width: 44%;
    border: 1px solid #eee;
    padding: 15rpx;
    -webkit-transition: border-color .2s ease-in;
    -moz-transition: border-color .2s ease-in;
    -ms-transition: border-color .2s ease-in;
    -o-transition: border-color .2s ease-in;
    transition: border-color .2s ease-in;
}
.choose-type .choose-name {
  font-weight: bold;
  margin-bottom: 5rpx;
}
.choose-type .choose-item-active {
    border: 1px solid #d2364c;
    box-shadow: 0px 0 0px 1px #d2364c;
}

/*
 * 售后信息
 */
.detail {
  padding: 20rpx 10rpx;
}
.detail .msg-tips {
  padding: 10rpx;
  border-radius: 0;
  background: #f1faff;
  border: 1px solid #e2f5ff;
  color: #1490d2;
}
.detail .msg-tips-warning {
  background-color: #fff7f1;
  border-color: #fff0e4;
  color: #f37b1d;
}
.detail .msg-tips-success {
  background-color: #eef7ea;
  border-color: #e3f3d6;
  color: #468847;
}
.detail .msg-tips-danger {
  background-color: #fff1f0;
  border-color: #ffe4e3;
  color: #dd514c;
}
.detail .msg-tips .msg-a {
  color: #d2354c;
  margin-left: 10rpx;
}
.detail .msg-tips-danger .msg-a {
  color: #136ed9;
}

/*
 * 退货地址
 */
.return-address .address-value {
  color: #0e90d2;
}
.detail .msg-tips button {
  border-radius: 3px;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 30rpx;
  font-size: 24rpx;
  margin-top: 10rpx;
}

/*
 * 面板信息
 */
.panel-item {
  border: 1px solid #eee;
}
.panel-item .panel-title {
  background: #eee;
  font-weight: bold;
  padding: 15rpx;
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
 * 面板图片
 */
.panel-item .voucher-data {
  padding: 10px 0;
}
.panel-item .voucher-data .item {
  padding: 10rpx;
}
.panel-item .voucher-data .item image {
  width: 200rpx;
  height: 200rpx;
  display: block;
}

/*
 * 退货弹层
 */
.delivery-popup {
  padding-top: 20rpx;
}
.delivery-popup .close {
  margin-right: 20rpx;
}
</style>
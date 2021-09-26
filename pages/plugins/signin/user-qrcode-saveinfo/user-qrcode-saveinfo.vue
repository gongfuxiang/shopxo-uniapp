<template>
<view>
<form v-if="data_list_loding_status != 1" @submit="formSubmit">
  <view class="content-top bg-white spacing-mb">
    <view>邀请人奖励 <text class="cr-main">{{data.reward_master || data_base.reward_master}}</text> 积分</view>
    <view>受邀人奖励 <text class="cr-main">{{data.reward_invitee || data_base.reward_invitee}}</text> 积分</view>
  </view>
  <view class="form-container spacing-mb oh">
    <view v-if="(data_base.is_qrcode_must_userinfo || 0) == 1">
      <view class="form-gorup bg-white">
        <view class="form-gorup-title">联系人姓名<text class="form-group-tips-must">必填</text></view>
        <input type="text" name="name" placeholder-class="cr-grey" class="cr-base" placeholder="联系人姓名格式 2~30 个字符之间" maxlength="30" :value="data.name || ''">
      </view>
      <view class="form-gorup bg-white">
        <view class="form-gorup-title">联系人电话<text class="form-group-tips-must">必填</text></view>
        <input type="text" name="tel" placeholder-class="cr-grey" class="cr-base" placeholder="联系人电话 6~15 个字符" maxlength="15" :value="data.tel || ''">
      </view>
      <view class="form-gorup bg-white">
        <view class="form-gorup-title">联系人地址<text class="form-group-tips-must">必填</text></view>
        <input type="text" name="address" placeholder-class="cr-grey" class="cr-base" placeholder="联系人地址、最多230个字符" maxlength="230" :value="data.address || ''">
      </view>
    </view>
    <view class="form-gorup bg-white">
      <view class="form-gorup-title">备注<text class="form-group-tips">选填</text></view>
      <input type="text" name="note" placeholder-class="cr-grey" class="cr-base" placeholder="备注最多230个字符" maxlength="60" :value="data.note || ''">
    </view>
    <view class="form-gorup">
      <button class="bg-main submit-bottom" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
    </view>
  </view>
</form>
<view v-if="data_list_loding_status != 0">
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
      params: null,
      form_submit_loading: false,
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      data_base: null,
      data: null
    };
  },

  components: {},
  props: {},

  onLoad(params) {
    this.setData({
      params: params
    });
    this.init();
  },

  onShow() {},

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  methods: {
    init() {
      var self = this;
      uni.showLoading({
        title: "加载中..."
      });
      this.setData({
        data_list_loding_status: 1
      });
      uni.request({
        url: app.globalData.get_request_url("saveinfo", "userqrcode", "signin"),
        method: "POST",
        data: this.params,
        dataType: "json",
        success: res => {
          uni.hideLoading();
          uni.stopPullDownRefresh();

          if (res.data.code == 0) {
            var data = res.data.data;
            self.setData({
              data_base: data.base || null,
              data: data.data || null,
              data_list_loding_status: 0
            });
          } else {
            self.setData({
              data_list_loding_status: 2,
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
            data_list_loding_msg: '服务器请求出错'
          });
          app.globalData.showToast("服务器请求出错");
        }
      });
    },

    // 表单提交
    formSubmit(e) {
      var data = e.detail.value;

      if ((this.data || null) != null) {
        data['id'] = this.data.id || 0;
      } // 数据验证


      var validation = [];

      if ((this.data_base || null) != null && (this.data_base.is_qrcode_must_userinfo || 0) == 1) {
        validation.push({
          fields: 'name',
          msg: '请填写联系人姓名格式 2~30 个字符之间'
        });
        validation.push({
          fields: 'tel',
          msg: '请填写联系人电话 6~15 个字符'
        });
        validation.push({
          fields: 'address',
          msg: '请填写联系人地址、最多230个字符'
        });
      }

      if (app.globalData.fields_check(data, validation)) {
        uni.showLoading({
          title: '提交中...'
        });
        this.setData({
          form_submit_loading: true
        }); // 网络请求

        var self = this;
        uni.request({
          url: app.globalData.get_request_url("save", "userqrcode", "signin"),
          method: 'POST',
          data: data,
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              app.globalData.showToast(res.data.msg, "success");
              setTimeout(function () {
                // 是否签到也组队
                if ((self.params || null) != null && (self.params.is_team || 0) == 1) {
                  uni.redirectTo({
                    url: "/pages/plugins/signin/index-detail/index-detail?id=" + res.data.data
                  });
                } else {
                  uni.navigateBack();
                }
              }, 2000);
            } else {
              this.setData({
                form_submit_loading: false
              });

              if (app.globalData.is_login_check(res.data)) {
                app.globalData.showToast(res.data.msg);
              } else {
                app.globalData.showToast('提交失败，请重试！');
              }
            }
          },
          fail: () => {
            uni.hideLoading();
            this.setData({
              form_submit_loading: false
            });
            app.globalData.showToast('服务器请求出错');
          }
        });
      }
    }

  }
};
</script>
<style>
.content-top {
  padding: 30rpx 10rpx;
}
.content-top text {
  font-size: 38rpx;
  font-weight: bold;
}
.submit-bottom {
  background-color: #f6b015 !important;
}
</style>
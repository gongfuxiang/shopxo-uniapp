<template>
<view>
<form @submit="formSubmit" v-if="data_list_loding_status == 0">
    <view class="form-input bg-white spacing-mb">
        <input type="text" class="wh-auto" name="name" placeholder="联系人" maxlength="30">
    </view>
    <view class="form-input bg-white spacing-mb">
        <input type="number" class="wh-auto" name="tel" placeholder="联系电话" maxlength="15">
    </view>
    <view class="form-input bg-white spacing-mb">
        <textarea name="content" class="content-textarea" maxlength="160" placeholder="请详细描述问题，我们将尽快为您解答！"></textarea>
    </view>

    <view class="bottom-btn-box fixed">
        <button type="default" form-type="submit" class="button-main" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">提交</button>
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
      data_list_loding_status: 1,
      data_list_loding_msg: '处理错误',
      form_submit_loading: false
    };
  },

  components: {},
  props: {},

  onLoad() {},

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.answer_form
    });
    this.init();
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
        } // 开启表单


        this.setData({
          data_list_loding_status: 0
        });
      } else {
        // 提示错误
        this.setData({
          data_list_loding_status: 2,
          data_list_loding_msg: '用户未登录'
        });
      }
    },

    /**
     * 表单提交
     */
    formSubmit(e) {
      // 数据验证
      var validation = [{
        fields: 'name',
        msg: '请填写联系人'
      }, {
        fields: 'tel',
        msg: '请填写联系电话'
      }, {
        fields: 'content',
        msg: '请填写内容'
      }];

      if (app.globalData.fields_check(e.detail.value, validation)) {
        uni.showLoading({
          title: '提交中...'
        });
        this.setData({
          form_submit_loading: true
        }); // 网络请求

        uni.request({
          url: app.globalData.get_request_url('add', 'answer'),
          method: 'POST',
          data: e.detail.value,
          dataType: 'json',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            uni.hideLoading();

            if (res.data.code == 0) {
              app.globalData.showToast(res.data.msg, "success");
              setTimeout(function () {
                uni.redirectTo({
                  url: "/pages/user-answer-list/user-answer-list"
                });
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
.content{
    padding: 10rpx;
}
.content-textarea {
    padding-top: 10rpx;
    min-height: 20vh;
}
.bottom-btn-box {
    margin-top: 160rpx;
    padding: 0 10rpx;
}

.form-input {
    padding: 20rpx 10rpx;
}
.form-input input, .form-input textarea {
    font-size: 30rpx;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
}
</style>
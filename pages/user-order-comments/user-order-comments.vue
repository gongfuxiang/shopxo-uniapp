<template>
<view>
<view v-if="detail != null">
  <form @submit="formSubmit" class="form-container">
      <view v-for="(item, index) in detail.items" :key="index" class="form-gorup bg-white oh">
        <view class="oh">
          <navigator :url="'/pages/goods-detail/goods-detail?goods_id=' + item.goods_id" hover-class="none">
            <image class="goods-image fl br" :src="item.images" mode="aspectFill"></image>
          </navigator>
          <view class="item-base">
            <block v-for="(item, tx) in [1,2,3,4,5]" :key="tx">
              <image class="xingxing-icon" :src="'/images/default-xingxing-icon' + (form_rating_list[index] != undefined && form_rating_list[index] >= item ? '-active' : '') + '.png'" mode="aspectFill" @tap="rating_event" :data-index="index" :data-value="item"></image>
            </block>
            <text v-if="form_rating_list[index] != undefined" class="msg-text cr-gray">{{rating_msg[form_rating_list[index]-1]}}</text>
          </view>
        </view>
        <view class="form-content br-t">
          <textarea @input="form_content_event" :data-index="index" placeholder-class="cr-grey" class="cr-base" placeholder="宝贝满足你的期待吗？说说它的优点和美中不足的地方吧" maxlength="230"></textarea>
          <view class="form-container-upload oh">
            <view class="form-upload-data fl">
              <block v-if="(form_images_list[index] || null) != null && form_images_list[index].length > 0">
                <view v-for="(item, ix) in form_images_list[index]" :key="ix" class="item fl">
                  <text class="delete-icon" @tap="upload_delete_event" :data-index="index" :data-ix="ix">x</text>
                  <image :src="item" @tap="upload_show_event" :data-index="index" :data-ix="ix" mode="aspectFill"></image>
                </view>
              </block>
            </view>
            <image v-if="(form_images_list[index] || null) == null || form_images_list[index].length < 3" class="upload-icon" src="/static/images/default-upload-icon.png" mode="aspectFill" @tap="file_upload_event" :data-index="index"></image>
          </view>
        </view>
      </view>

      <view class="form-gorup bg-white anonymous">
        <switch name="is_anonymous" @change="anonymous_event"></switch>
        <text class="cr-base">匿名</text>
        <text class="fr cr-gray tips-text">{{anonymous_msg_list[anonymous_value]}}</text>
      </view>

      <view class="form-gorup">
        <button form-type="submit" class="bg-main submit-bottom" type="default" hover-class="none" :disabled="form_button_disabled">提交</button>
      </view>
  </form>
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
</view>
</view>
</template>

<script>
const app = getApp();

export default {
  data() {
    return {
      data_list_loding_status: 1,
      data_list_loding_msg: '',
      params: null,
      detail: null,
      editor_path_type: '',
      rating_msg: ['非常差', '差', '一般', '好', '非常好'],
      anonymous_value: 0,
      anonymous_msg_list: ['你写的评论会以匿名的形式展现', '你写的评论会以昵称的形式展现'],
      form_rating_list: [],
      form_images_list: [],
      form_content_list: [],
      form_button_disabled: false,
      undefined: "",
      ix: ""
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

  onShow() {
    uni.setNavigationBarTitle({
      title: app.globalData.data.common_pages_title.user_order_comments
    });
  },

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
        url: app.globalData.get_request_url("comments", "order"),
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
              editor_path_type: data.editor_path_type || '',
              detail: data.data,
              data_list_loding_status: 3,
              data_list_loding_msg: ''
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

    // 上传图片预览
    upload_show_event(e) {
      var index = e.currentTarget.dataset.index;
      var ix = e.currentTarget.dataset.ix;
      uni.previewImage({
        current: this.form_images_list[index][ix],
        urls: this.form_images_list[index]
      });
    },

    // 图片删除
    upload_delete_event(e) {
      var index = e.currentTarget.dataset.index;
      var ix = e.currentTarget.dataset.ix;
      var self = this;
      uni.showModal({
        title: '温馨提示',
        content: '删除后不可恢复、继续吗？',

        success(res) {
          if (res.confirm) {
            var list = self.form_images_list;
            list[index].splice(ix, 1);
            self.setData({
              form_images_list: list
            });
          }
        }

      });
    },

    // 文件上传
    file_upload_event(e) {
      // 数据初始化
      var index = e.currentTarget.dataset.index;
      var temp_list = this.form_images_list;
      var length = this.detail.items.length;

      for (var i = 0; i < length; i++) {
        if (temp_list[i] == undefined) {
          temp_list[i] = [];
        }
      }

      this.setData({
        form_images_list: temp_list
      }); // 处理上传文件

      var self = this;
      uni.chooseImage({
        count: 3,

        success(res) {
          var success = 0;
          var fail = 0;
          var length = res.tempFilePaths.length;
          var count = 0;
          self.upload_one_by_one(index, res.tempFilePaths, success, fail, count, length);
        }

      });
    },

    // 采用递归的方式上传多张
    upload_one_by_one(index, img_paths, success, fail, count, length) {
      var self = this;

      if ((self.form_images_list[index] || null) == null || self.form_images_list[index].length < 3) {
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

                if ((list[index] || null) == null) {
                  list[index] = [];
                }

                list[index].push(data.data.url);
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
              self.upload_one_by_one(index, img_paths, success, fail, count, length);
            }
          }
        });
      }
    },

    // 是否匿名事件
    anonymous_event(e) {
      this.setData({
        anonymous_value: e.detail.value == true ? 1 : 0
      });
    },

    // 评分事件
    rating_event(e) {
      // 参数
      var index = e.currentTarget.dataset.index;
      var value = e.currentTarget.dataset.value; // 数据初始化/赋值

      var temp_list = this.form_rating_list;
      var length = this.detail.items.length;

      for (var i = 0; i < length; i++) {
        if (temp_list[i] == undefined) {
          temp_list[i] = 0;
        }

        if (index == i) {
          temp_list[i] = value;
        }
      }

      this.setData({
        form_rating_list: temp_list
      });
    },

    // 评论内容
    form_content_event(e) {
      // 参数
      var index = e.currentTarget.dataset.index;
      var value = e.detail.value; // 数据初始化/赋值

      var temp_list = this.form_content_list;
      var length = this.detail.items.length;

      for (var i = 0; i < length; i++) {
        if (temp_list[i] == undefined) {
          temp_list[i] = '';
        }

        if (index == i) {
          temp_list[i] = value;
        }
      }

      this.setData({
        form_content_list: temp_list
      });
    },

    // 表单
    formSubmit(e) {
      // 商品数量
      var length = this.detail.items.length; // 评分校验

      var count = this.form_rating_list.length;

      if (count < length) {
        app.globalData.showToast('请评分');
        return false;
      }

      var max = Math.max.apply(null, this.form_rating_list);
      var min = Math.min.apply(null, this.form_rating_list);

      if (min < 1 || max > 5) {
        app.globalData.showToast('评分有误');
        return false;
      } // 内容校验


      var count = this.form_content_list.length;

      if (count < length) {
        app.globalData.showToast('请填写评论内容');
        return false;
      }

      for (var i in this.form_content_list) {
        var count = this.form_content_list[i].length;

        if (count < 6 || count > 230) {
          app.globalData.showToast('评论内容 6~230 个字符之间');
          return false;
        }
      } // 图片校验


      if (this.form_images_list.length > 0) {
        for (var i in this.form_images_list) {
          if (this.form_images_list[i].length > 3) {
            app.globalData.showToast('每项评论图片不能超过3张');
            return false;
          }
        }
      } // 表单数据


      var form_data = e.detail.value;
      form_data['is_anonymous'] = form_data['is_anonymous'] == true ? 1 : 0;
      form_data['id'] = this.detail.id;
      form_data['goods_id'] = JSON.stringify(this.detail.items.map(function (v) {
        return v.goods_id;
      }));
      form_data['rating'] = JSON.stringify(this.form_rating_list);
      form_data['content'] = JSON.stringify(this.form_content_list);
      form_data['images'] = this.form_images_list.length > 0 ? JSON.stringify(this.form_images_list) : ''; // 提交表单

      var self = this;
      uni.showLoading({
        title: "处理中..."
      });
      self.setData({
        form_button_disabled: true
      });
      uni.request({
        url: app.globalData.get_request_url("commentssave", "order"),
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
              uni.navigateBack();
            }, 2000);
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

  }
};
</script>
<style>
.goods-image {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
}
.item-base {
  margin: 10rpx 0 0 100rpx;
}
.item-base .xingxing-icon {
  width: 60rpx;
  height: 60rpx;
  margin: 0 15rpx;
  vertical-align: middle;
}
.item-base .msg-text {
  margin-left: 20rpx;
}
.form-content {
  margin-top: 20rpx;
}
.form-content textarea {
  height: 160rpx !important;
  min-height: 160rpx !important;
}
.form-container-upload {
  margin-top: 10rpx;
}
.form-container-upload .form-upload-data image {
  width: 100rpx;
  height: 100rpx;
  padding: 5rpx;
}
.form-container-upload .upload-icon {
  margin: 10rpx 0 0 10rpx;
  width: 110rpx;
  height: 110rpx;
}
.anonymous .tips-text {
  margin-top: 5rpx;
}
.anonymous switch {
  vertical-align: middle;
}
</style>
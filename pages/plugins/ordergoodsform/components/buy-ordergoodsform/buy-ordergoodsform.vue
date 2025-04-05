<template>
    <view :class="theme_view">
        <view v-if="data.length > 0" class="plugins-ordergoodsform-buy oh margin-top-sm">
            <view v-for="(item, index) in data" :key="index" class="item pr oh">
                <view class="title dis-block single-text text-size-sm pa">{{item.title}}</view>
                <view class="value dis-block pa">
                    <view v-if="propIsRead">{{item.content}}</view>
                    <input v-else :type="((item.element_arr || null) == null || (item.element_arr[1] || null) == null) ? 'text' : item.element_arr[1]" 
                        :placeholder="(item.placeholder || null) == null ? item.title : item.placeholder" 
                        :data-index="index"
                        :value="item.default_value || ''"
                        @blur="input_value_event"
                        @confirm="input_value_event"
                        placeholder-class="cr-grey"
                        :class="'radius text-size-sm padding-horizontal-sm '+((item.check_status === undefined || item.check_status === true) ? 'br' : 'br-red')"
                    />
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data: [],
            };
        },
        components: {},
        props: {
            propData: {
            	type: [Array],
            	default: []
            },
            propGoodsID: {
            	type: [Number,String],
            	default: 0
            },
            propIsRead: {
            	type: Boolean,
            	default: false
            }
        },
        // 页面被展示
        created: function () {
            this.setData({
                data: this.propData
            });
        },
        methods: {
            // 数据值事件
            input_value_event(e) {
                // 当前表单数据
                var index = e.currentTarget.dataset.index;
                var item = this.data[index];
                item['default_value'] = e.detail.value.trim();
                // 数据验证
                var check = this.input_value_check(item, index);
                // 保存数据
                uni.request({
                    url: app.globalData.get_request_url('save', 'goods', 'ordergoodsform'),
                    method: 'POST',
                    data: {
                        form_id: item.form_id,
                        goods_id: this.propGoodsID,
                        title: item.title,
                        content: check.value
                    },
                    dataType: 'json',
                    success: (res) => {},
                    fail: (res) => {},
                });
            },

            // 数据值验证
            input_value_check(item, index) {
                // 是否需要校验
                var is_required = parseInt(item.is_required || 0);
                var type = ((item.element_arr || null) == null || (item.element_arr[1] || null) == null) ? 'text' : item.element_arr[1];
                var value = item.default_value;
                var msg = item.validation_msg || item.error_message || this.$t('user-address-save.user-address-save.wkfi45');
                var status = null;

                // 强制填写数据，但是数据没有则错误
                if(status === null && is_required == 1 && value === '')
                {
                    status = false;
                }

                // 有数据则验证正确格式
                if(status === null && value !== '')
                {
                    // 根据类型验证数据
                    switch(type)
                    {
                        // 文本
                        case 'text' :
                            var len = value.length;
                            var minlength = parseInt(item.minlength || 0);
                            var maxlength = parseInt(item.maxlength || 0);
                            if((minlength > 0 && len < minlength) || (maxlength > 0 && len > maxlength))
                            {
                                status = false;
                            }
                            break;

                        // 整数
                        case 'number' :
                            var val = parseInt(value || 0);
                            var min = parseInt(item.minlength || 0);
                            var max = parseInt(item.maxlength || 0);
                            if((min > 0 && val < min) || (max > 0 && val > max))
                            {
                                value = (min > 0 && val < min) ? min : max;
                                status = false;
                            }
                            break;
                    }

                    // 是否有正则
                    if(status === null) {
                        var pattern = (((item.element_arr || null) == null) || (item.element_arr[2] || null) == null) ? null : item.element_arr[2];
                        if(pattern != null)
                        {
                            var regex = new RegExp(pattern);
                            if(!regex.test(value))
                            {
                                status = false;
                            }
                        }
                    }
                }

                // 是否提示错误
                if(status === false) {
                    app.globalData.showToast(msg);
                }

                // 数据赋值
                var temp_data = this.data;
                item['default_value'] = value;
                temp_data[index] = item;
                temp_data[index]['check_status'] = (status === null) ? true : status;
                this.setData({
                    data: temp_data
                });

                // 验证信息返回
                return {status: status, value: value};
            },

            // 数据验证
            data_check() {
                var status = true;
                for(var i in this.data) {
                    var res = this.input_value_check(this.data[i], i);
                    if(res.status === false) {
                        status = false;
                        break;
                    }
                }
                return status;
            }
        }
    };
</script>
<style>
    .plugins-ordergoodsform-buy .item {
        height: 72rpx;
    }
    .plugins-ordergoodsform-buy .item .title {
        width: 134rpx;
        left: 0;
        bottom: 8rpx;
    }
    .plugins-ordergoodsform-buy .item .value {
        width: calc(100% - 140rpx);
        left: 140rpx;
        bottom: 0;
    }
    .plugins-ordergoodsform-buy .item .value input {
        height: 50rpx;
        line-height: 50rpx;
    }
</style>
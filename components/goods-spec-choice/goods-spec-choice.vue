<template>
    <view :class="theme_view">
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event" :propIndex="propIndex">
            <view class="goods-spec-choice-container padding-main bg-white pr">
                <view class="close fr oh">
                    <view class="fr" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="goods-spec-choice-content">
                    <!-- 商品规格 -->
                    <view v-if="spec.length > 0" class="goods-spec-choose">
                        <view v-for="(item, key) in spec" :key="key" class="item padding-top-xxl padding-bottom-xxl">
                            <view class="text-size-sm">{{item.name}}</view>
                            <view v-if="item.value.length > 0" class="spec margin-top-sm">
                                <block v-for="(items, keys) in item.value" :key="keys">
                                    <button @tap.stop="goods_spec_choice_event" :data-key="key" :data-keys="keys" type="default" size="mini" hover-class="none" :class="'round '+items.is_active + ' ' + items.is_dont + ' ' + items.is_disabled">
                                        <image v-if="(items.images || null) != null" :src="items.images" mode="scaleToFill" class="va-m dis-inline-block round margin-right-sm"></image>
                                        <text class="va-m">{{items.name}}</text>
                                    </button>
                                </block>
                            </view>
                        </view>
                    </view>
                </view>
                <button class="bg-main br-main cr-white text-size-sm round" type="default" @tap.stop="spec_confirm_event" hover-class="none">{{$t('index.index.7w75zb')}}</button>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from "@/components/popup/popup";

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                popup_status: false,
                goods_id: 0,
                spec: [],
                buy_min_number: 1,
                out_value: ''
            };
        },

        components: {
            componentPopup
        },
        props: {
            propIndex: {
                type: Number,
                default: 100
            }
        },

        created: function() {},

        methods: {
            // 获取数据
            init(goods_id, spec, buy_min_number = 1, out_value = '') {
                this.setData({
                    popup_status: true,
                    goods_id: goods_id,
                    spec: spec || [],
                    buy_min_number: buy_min_number || 1,
                    out_value: out_value,
                });
                
                // 不能选择规格处理
                this.spec_handle_dont(0, 1);
            },

            // 购买弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false
                });
            },

            // 规格事件
            goods_spec_choice_event(e) {
                var key = e.currentTarget.dataset.key || 0;
                var keys = e.currentTarget.dataset.keys || 0;
                this.goods_spec_choice_handle(key, keys);
            },

            // 规格选择处理
            goods_spec_choice_handle(key, keys) {
                var temp_spec = this.spec;
                // 不能选择和禁止选择跳过
                if ((temp_spec[key]['value'][keys]['is_dont'] || null) == null && (temp_spec[key]['value'][keys]['is_disabled'] || null) == null) {
                    // 规格选择
                    for (var i in temp_spec) {
                        for (var k in temp_spec[i]['value']) {
                            if ((temp_spec[i]['value'][k]['is_dont'] || null) == null && (temp_spec[i]['value'][k]['is_disabled'] || null) == null) {
                                if (key == i) {
                                    if (keys == k && (temp_spec[i]['value'][k]['is_active'] || null) == null) {
                                        temp_spec[i]['value'][k]['is_active'] = 'cr-white bg-main br-main';
                                    } else {
                                        temp_spec[i]['value'][k]['is_active'] = '';
                                    }
                                }
                            }
                        }
                    }
                    this.setData({
                        spec: temp_spec
                    });

                    // 不能选择规格处理
                    this.spec_handle_dont(key);

                    // 获取下一个规格类型
                    this.get_spec_type(key);

                    // 获取规格详情
                    this.get_spec_detail();
                }
            },
            
            // 获取下一个规格类型
            get_spec_type(key) {
                var temp_spec = this.spec;
                var active_index = parseInt(key) + 1;
                var sku_count = app.globalData.get_length(temp_spec);
                if (active_index <= 0 || active_index >= sku_count) {
                    return false;
                }

                // 获取规格值
                var spec = [];
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if ((temp_spec[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                type: temp_spec[i]['name'],
                                value: temp_spec[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                if (spec.length <= 0) {
                    return false;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('spectype', 'goods'),
                    method: 'POST',
                    data: {
                        id: this.goods_id,
                        spec: JSON.stringify(spec)
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var spec_type = res.data.data.spec_type;
                            var spec_count = spec.length;
                            var index = spec_count > 0 ? spec_count : 0;
                            if (index < sku_count) {
                                for (var i in temp_spec) {
                                    for (var k in temp_spec[i]['value']) {
                                        if (index == i) {
                                            temp_spec[i]['value'][k]['is_dont'] = '';
                                            var temp_value = temp_spec[i]['value'][k]['name'];
                                            var temp_status = false;
                                            for (var t in spec_type) {
                                                if (spec_type[t] == temp_value) {
                                                    temp_status = true;
                                                    break;
                                                }
                                            }
                                            if (temp_status == true) {
                                                temp_spec[i]['value'][k]['is_disabled'] = '';
                                            } else {
                                                temp_spec[i]['value'][k]['is_disabled'] = 'spec-items-disabled';
                                            }
                                        }
                                    }
                                }
                                this.setData({
                                    spec: temp_spec
                                });
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 获取规格详情
            get_spec_detail() {
                // 获取规格值
                var spec = this.goods_selected_spec();

                // 存在规格的时候是否已完全选择规格
                var sku_count = this.spec.length;
                var active_count = spec.length;
                if (spec.length <= 0 || active_count < sku_count) {
                    return false;
                }

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('specdetail', 'goods'),
                    method: 'POST',
                    data: {
                        id: this.goods_id,
                        spec: JSON.stringify(spec),
                        stock: this.buy_min_number
                    },
                    dataType: 'json',
                    success: res => {
                        if (res.data.code != 0) {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    }
                });
            },

            // 已选的商品规格
            goods_selected_spec() {
                var spec = [];
                var temp_spec = this.spec;
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if ((temp_spec[i]['value'][k]['is_active'] || null) != null) {
                            spec.push({
                                type: temp_spec[i]['name'],
                                value: temp_spec[i]['value'][k]['name']
                            });
                            break;
                        }
                    }
                }
                return spec;
            },

            // 不能选择规格处理
            spec_handle_dont(key, is_init = 0) {
                var temp_spec = this.spec || [];
                if (temp_spec.length <= 0) {
                    return false;
                }

                // 是否不能选择
                key = parseInt(key);
                for (var i in temp_spec) {
                    for (var k in temp_spec[i]['value']) {
                        if (i > key) {
                            temp_spec[i]['value'][k]['is_dont'] = 'spec-dont-choose';
                            temp_spec[i]['value'][k]['is_disabled'] = '';
                            temp_spec[i]['value'][k]['is_active'] = '';
                        } else {
                            if(is_init == 1) {
                                temp_spec[i]['value'][k]['is_active'] = '';
                            }
                        }

                        // 当只有一个规格的时候
                        if (key == 0 && temp_spec.length == 1) {
                            temp_spec[i]['value'][k]['is_disabled'] = (temp_spec[i]['value'][k]['is_only_level_one'] || null) != null && (temp_spec[i]['value'][k]['inventory'] || 0) <= 0 ? 'spec-items-disabled' : '';
                        }
                    }
                }

                this.setData({
                    spec: temp_spec
                });
            },

            // 规格确认事件
            spec_confirm_event(e) {
                var temp_spec = this.spec;
                var sku_count = temp_spec.length;
                var active_count = 0;
                var spec = [];
                if (sku_count > 0) {
                    for (var i in temp_spec) {
                        for (var k in temp_spec[i]['value']) {
                            if ((temp_spec[i]['value'][k]['is_active'] || null) != null) {
                                active_count++;
                                spec.push({
                                    type: temp_spec[i]['name'],
                                    value: temp_spec[i]['value'][k]['name']
                                });
                            }
                        }
                    }
                    if (active_count < sku_count) {
                        app.globalData.showToast(this.$t('goods-detail.goods-detail.6brk57'));
                        return false;
                    }
                }

                // 关闭弹窗
                this.setData({
                    popup_status: false
                });

                // 调用父级
                this.$emit('specConfirmEvent', {
                    goods_id: this.goods_id,
                    spec: spec,
                    stock: this.buy_min_number,
                    out_value: this.out_value,
                });
            }
        }
    };
</script>
<style>
    .goods-spec-choice-container .close {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        z-index: 2;
    }
    .goods-spec-choice-content {
        max-height: 50vh;
        overflow-y: scroll;
        overflow-x: hidden;
        margin-top: 20rpx;
    }
    .goods-spec-choice-container .item .spec button {
        background-color: #f5f5f5;
        color: #666;
        border: 1px solid #ccc;
    }
    .goods-spec-choice-container .item .spec button:not(:last-child) {
        margin-right: 25rpx;
    }
    .goods-spec-choice-container .item .spec button image {
        width: 40rpx;
        height: 40rpx !important;
    }
    .goods-spec-choice-container .spec-dont-choose {
        color: #b4b3b3 !important;
        background-color: #ffffff !important;
        border: 1px solid #ebeaea !important;
    }
    .goods-spec-choice-container .spec-dont-choose image {
        opacity: 0.5;
    }
    .goods-spec-choice-container .spec-items-disabled {
        color: #d2cfcf !important;
        background-color: #ffffff !important;
        border: 1px dashed #d5d5d5 !important;
    }
    .goods-spec-choice-container .spec-items-disabled image {
        opacity: 0.3;
    }
</style>
<template>
    <view :class="theme_view">
        <block v-if="(config || null) != null && (config.is_compare_run_app || 0) == 1 && (config.compare_run_icon_app || null) != null">
            <image class="compare-run-icon pf right-xxxxxl" :src="config.compare_run_icon_app" mode="aspectFit" @tap="compare_run_event"></image>
        </block>

        <!-- 弹窗 -->
        <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="popup-container padding-top-xxxl">
                <view class="close oh pa top-0 right-0 z-i-deep">
                    <view class="fr padding-top padding-right padding-left-sm padding-bottom-sm" @tap.stop="popup_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="margin-top-xl">
                    <block v-if="data_list.length > 0">
                        <view class="data-list">
                            <block v-for="(item, index) in data_list" :key="index">
                                <view class="goods-item flex-row align-c bs-bb padding-main pr wh-auto cp">
                                    <view @tap="selected_event" :data-index="index" class="selected pr z-i">
                                        <iconfont :name="'icon-zhifu-' + (item.selected || false ? 'yixuan' : 'weixuan')" size="40rpx" :color="item.selected || false ? theme_color : '#999'"></iconfont>
                                    </view>
                                    <view class="item oh padding-left-main flex-1 flex-row">
                                        <image class="goods-image fl radius br" :src="item.images" :data-value="item.goods_url" @tap="url_event" mode="aspectFill"></image>
                                        <view class="goods-base padding-left-sm flex-1 pr">
                                            <view class="goods-title multi-text cp" :data-value="item.goods_url" @tap="url_event">{{ item.title }}</view>
                                            <view class="sales-price margin-top-sm">{{item.symbol}}{{item.price}}</view>
                                            <view class="cr-red text-size-xs pa right-0 bottom-0" :data-index="index" @tap="remove_event">{{$t('common.remove')}}</view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <view class="padding-main">
                            <view class="bottom-line-exclude oh">
                                <button class="bg-main br-main cr-white text-size-sm round" type="default" @tap="compare_confirm_event" hover-class="none">去对比</button>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <component-no-data :propStatus="0"></component-no-data>
                    </block>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                cache_key: 'cache-plugins-goodscompare-pk-goods-data',
                popup_status: false,
                data_list: [],
                goods: null,
                config: null,
            };
        },
        components: {
            componentPopup,
            componentNoData,
        },
        // 属性
        props: {
            propGoods: {
                type: [Array,Object,String],
                default: '',
            },
        },
        // 页面被展示
        created: function () {
            this.init_config();
            this.setData({
                goods: this.propGoods,
            });
        },
        // 属性值改变监听
        watch: {
            // 是否灰度
            propGoods(value, old_value) {
                this.setData({
                    goods: value,
                });
            },
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        config: app.globalData.get_config('plugins_base.goodscompare.data'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 对比事件
            compare_run_event(e) {
                // 获取缓存
                var data = uni.getStorageSync(this.cache_key) || [];
                var item = {
                    goods_id: this.goods.id,
                    goods_url: this.goods.goods_url,
                    price: this.goods.price,
                    symbol: this.goods.show_price_symbol,
                    images: this.goods.images,
                    title: this.goods.title,
                    selected: true
                };
                // 加入或移除
                var index = false;
                for(var i in data) {
                    if(data[i]['goods_id'] == item.goods_id) {
                        index = i;
                    }
                }
                if(index === false) {
                    data.push(item);
                } else {
                    data.splice(index, 1);
                }
                this.setData({
                    data_list: data
                });
                // 记录缓存
                uni.setStorageSync(this.cache_key, data);
                // 还有数据则显示弹窗
                if(data.length > 0) {
                    this.setData({
                        popup_status: true
                    });
                }
                app.globalData.showToast(index === false ? this.$t('common.join_success') : this.$t('common.remove_success'), 'success');
            },

            // 弹层关闭
            popup_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // 选中处理
            selected_event(e) {
                var temp_data = this.data_list;
                var index = e.currentTarget.dataset.index || 0;
                temp_data[index]['selected'] = temp_data[index]['selected'] == true ? false : true;
                this.setData({
                    data_list: temp_data
                });
                uni.setStorageSync(this.cache_key, temp_data);
            },

            // 移除
            remove_event(e) {
                var temp_data = this.data_list;
                var index = e.currentTarget.dataset.index || 0;
                temp_data.splice(index, 1);
                this.setData({
                    data_list: temp_data
                });
                uni.setStorageSync(this.cache_key, temp_data);
                app.globalData.showToast(this.$t('common.remove_success'), 'success');
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 对比确认
            compare_confirm_event(e) {
                var user = app.globalData.get_user_info(this, 'compare_confirm_event', e);
                if (user != false) {
                    var goods_ids = this.data_list.map(function(v){return v.goods_id;}).join('|');
                    app.globalData.url_open('/pages/plugins/goodscompare/index/index?gid='+goods_ids);
                }
            }
        },
    };
</script>
<style scoped>
    .compare-run-icon {
        width: 90rpx;
        height: 90rpx;
        bottom: 15%;
    }
    .data-list {
        max-height: 80vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .data-list .goods-image {
        width: 126rpx;
        height: 126rpx;
    }
    .data-list .goods-base {
        width: calc(100% - 170rpx);
    }
    .data-list .goods-item .selected {
        margin-top: 60rpx;
    }
</style>
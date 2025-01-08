<template>
    <view :class="theme_view">
        <!-- 批发规则展示 -->
        <view v-if="(data || null) != null" class="plugins-wholesale-container scroll-view-horizontal" :class="propIsAlone ? 'is-alone' : ''">
            <scroll-view scroll-x="true">
                <view :class="'plugins-wholesale-container-rules-view wh-auto padding-main item-number-'+data.rules.length" @tap="popup_wholesale_event">
                    <view v-for="(item, index) in data.rules" :key="index" class="item">
                        <view class="price">
                            <text v-if="item.arr.type == 1" class="cr-red text-size-xs">{{propCurrencySymbol}}</text>
                            <text class="sales-price text-size-lg">{{item.range_val}}</text>
                            <text v-if="item.arr.type == 0" class="unit text-size-xsss">{{item.arr.unit}}</text>
                        </view>
                        <view class="msg text-size-sm cr-base margin-top-xs cr-black">{{item.range_msg}}</view>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- 批发规则弹层 -->
        <block v-if="propIsPopup">
            <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_wholesale_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_wholesale_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="plugins-wholesale-container-rules">
                        <block v-if="(data || null) != null">
                            <view class="oh flex-row flex-wrap">
                                <block v-for="(item, index) in data.rules" :key="index">
                                    <view class="item flex-width-half margin-bottom">
                                        <view class="item-content padding-main bg-base border-radius-main oh tc">
                                            <text class="cr-base">{{ item.range_msg }}</text>
                                            <text v-if="item.arr.type == 1" class="cr-main text-size-xs">{{propCurrencySymbol}}</text>
                                            <text class="cr-main fw-b text-size-lg">{{ item.range_val }}</text>
                                            <text v-if="item.arr.type == 0" class="cr-grey text-size-xsss">{{ item.arr.unit }}</text>
                                        </view>
                                    </view>
                                </block>
                            </view>
                        </block>
                        <block v-else>
                            <view class="cr-grey tc padding-top-xl padding-bottom-xxxl">{{$t('goods-detail.goods-detail.m3op38')}}</view>
                        </block>
                    </view>
                </view>
            </component-popup>
        </block>
    </view>
</template>
<script>
const app = getApp();
import componentPopup from "@/components/popup/popup";
export default {
    data() {
        return {
            theme_view: app.globalData.get_theme_value_view(),
            data: null,
            popup_status: false,
        };
    },
    components: {
        componentPopup
    },
    props: {
        // 是否展示弹窗
        propIsPopup: {
            type: Boolean,
            default: false,
        },
        // 价格符号
        propCurrencySymbol: {
            type: String,
            default: app.globalData.currency_symbol(),
        },
        // 列表数据
        propData: {
            type: [Array, Object, String],
            default: {},
        },
        // 是否独立行
        propIsAlone: {
            type: Boolean,
            default: false,
        },
    },
    // 属性值改变监听
    watch: {
        // 数据
        propData(value, old_value) {
            this.setData({
                data: value,
            });
        }
    },

    // 页面被展示
    created: function () {
        this.setData({
            data: this.propData,
        });
    },

    methods: {
        // 批发开启弹层
        popup_wholesale_event(e) {
            if(this.propIsPopup) {
                this.setData({
                    popup_status: true,
                });
            }
        },
        
        // 批发弹层关闭
        popup_wholesale_close_event(e) {
            this.setData({
                popup_status: false,
            });
        },
    }
}
</script>
<style scoped>
    /**
     * 批发 - 插件
     */
    .plugins-wholesale-container.is-alone {
        background: linear-gradient(to bottom, #fafafa 0%, #fff 100%);
    }
    .plugins-wholesale-container-rules-view {
        display: flex;
        justify-content: flex-start;
        gap: 60rpx;
    }
    .plugins-wholesale-container-rules-view.item-number-2,
    .plugins-wholesale-container-rules-view.item-number-3,
    .plugins-wholesale-container-rules-view.item-number-4 {
        justify-content: space-around;
        gap: 0;
    }
    .plugins-wholesale-container-rules-view .item {
        margin-bottom: 0 !important;
    }
    .plugins-wholesale-container-rules-view .item .price > .unit {
        color: #969696;
        margin-left: 5rpx;
    }
    .plugins-wholesale-container-rules {
        max-height: 50vh;
        overflow-y: scroll;
        overflow-x: hidden;
        margin-top: 20rpx;
    }
    .plugins-wholesale-container-rules .item:nth-child(2n)>.item-content {
        margin-left: 10rpx;
    }
    .plugins-wholesale-container-rules .item:nth-child(2n+1)>.item-content {
        margin-right: 10rpx;
    }
    .plugins-wholesale-container-rules .spec-tips {
        color: #ffbf00;
        border: 1px solid #333;
        background: #333;
        padding: 2rpx 10rpx;
        top: 22rpx;
        left: 20rpx;
    }
</style>
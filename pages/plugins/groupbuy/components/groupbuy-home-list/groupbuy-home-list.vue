<template>
    <view :class="theme_view">
        <scroll-view v-if="(data_list || null) != null && data_list.length > 0" class="groupbuy-home-scroll scroll-view-horizontal" :scroll-x="true" :show-scrollbar="false">
            <view class="groupbuy-home-list flex-row">
                <view v-for="(item, index) in data_list" :key="index" class="groupbuy-home-item bg-white border-radius-main margin-right-main oh">
                    <view class="cp" :data-value="item.url" @tap="url_event">
                        <image class="groupbuy-home-image dis-block border-radius-main bg-grey-f5" :src="item.images" mode="aspectFill"></image>
                        <view class="padding-horizontal-sm padding-top-sm padding-bottom-main">
                            <view class="multi-text text-size-xs cr-black">{{ item.groupbuy_title || item.title }}</view>
                            <view class="groupbuy-home-meta margin-top-xs flex-row align-c">
                                <text class="groupbuy-tag br-main cr-main bg-white text-size-xss radius padding-horizontal-xs">{{ item.group_number }}{{ $t('groupbuy.groupbuy.people_team') }}</text>
                                <text v-if="(item.groupbuy_success_text || null) != null" class="groupbuy-success-text cr-main text-size-xss single-text flex-1 flex-width margin-left-xs">{{ item.groupbuy_success_text }}</text>
                            </view>
                            <view class="margin-top-xs cr-main fw-b">
                                <text class="text-size-xss">{{ propCurrencySymbol }}</text>
                                <text class="text-size-sm">{{ item.groupbuy_price_text || item.groupbuy_price }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list: [],
            };
        },
        props: {
            propCurrencySymbol: {
                type: String,
                default: app.globalData.currency_symbol(),
            },
            propData: {
                type: Array,
                default: () => {
                    return [];
                },
            },
        },
        watch: {
            propData: {
                handler(value) {
                    this.setData({
                        data_list: value || [],
                    });
                },
                immediate: true,
                deep: true,
            },
        },
        methods: {
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style scoped>
.groupbuy-home-scroll {
    width: 100%;
    white-space: nowrap;
}
.groupbuy-home-list {
    display: inline-flex;
    flex-direction: row;
    padding: 0 0 4rpx;
}
.groupbuy-home-item {
    display: inline-block;
    width: 260rpx;
    vertical-align: top;
    flex-shrink: 0;
}
.groupbuy-home-image {
    width: 260rpx;
    height: 260rpx;
}
.groupbuy-home-meta {
    flex-wrap: wrap;
    gap: 8rpx;
}
.groupbuy-tag {
    line-height: 28rpx;
    flex-shrink: 0;
}
</style>

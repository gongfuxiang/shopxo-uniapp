<template>
    <view>
        <view v-if="(propConfig || null) != null && (propData || null) != null && propData.length > 0">
            <block v-for="(floor, index) in propData" :key="index">
                <block v-if="floor.blog_list.length > 0 && floor.home_data_location == propLocation">
                    <view class="spacing-nav-title">
                        <text class="text-wrapper" :style="'color:'+(floor.color || '#333')+';'">{{floor.title}}</text>
                        <text v-if="(floor.vice_title || null) != null" class="vice-name margin-left-lg cr-gray">{{floor.vice_title}}</text>
                        <navigator :url="floor.more_url" hover-class="none" class="arrow-right padding-right-xxxl cr-gray fr">更多</navigator>
                    </view>
                    <view class="wh-auto oh pr">
                        <view v-if="floor.keywords_arr.length > 0" class="word-list scroll-view-horizontal margin-bottom-lg">
                            <scroll-view scroll-x>
                                <block v-for="(kv, ki) in floor.keywords_arr" :key="ki">
                                    <navigator :url="'/pages/plugins/blog/search/search?keywords=' + kv" hover-class="none" class="word-icon dis-inline-block bg-main-light text-size-xs cr-main round padding-top-xs padding-bottom-xs padding-left padding-right">{{kv}}</navigator>
                                </block>
                            </scroll-view>
                        </view>
                        <block v-if="floor.blog_list.length > 0">
                            <!-- 默认图文 -->
                            <block v-if="(floor.style_type || 0) == 0">
                                <view class="plugins-blog-list">
                                    <view v-for="(item, index) in floor.blog_list" :key="index" class="item oh padding-main border-radius-main bg-white spacing-mb">
                                        <navigator :url="item.url" hover-class="none">
                                            <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                                            <view class="base fr">
                                                <view class="single-text">{{item.title}}</view>
                                                <view class="cr-gray margin-top-sm">{{item.add_time_date_cn}}</view>
                                                <view class="cr-grey multi-text margin-top-sm">{{item.describe}}</view>
                                            </view>
                                        </navigator>
                                    </view>
                                </view>
                            </block>
                            <!-- 九方格 -->
                            <block v-else-if="floor.style_type == 1">
                                <view class="plugins-blog-grid-list">
                                    <view v-for="(item, index) in floor.blog_list" :key="index" class="item oh border-radius-main bg-white spacing-mb">
                                        <navigator :url="item.url" hover-class="none">
                                            <image class="blog-img dis-block" :src="item.cover" mode="aspectFit"></image>
                                            <view class="base padding-horizontal-main margin-top-sm">
                                                <view class="goods-title multi-text margin-bottom-sm">{{item.title}}</view>
                                                <view class="cr-grey">{{item.add_time_date_cn}}</view>
                                            </view>
                                        </navigator>
                                    </view>
                                </view>
                            </block>
                            <!-- 滚动 -->
                            <block v-else-if="floor.style_type == 2">
                                <view class="plugins-blog-rolling-list scroll-view-horizontal border-radius-main oh spacing-mb">
                                    <swiper :vertical="false" :autoplay="(propConfig.is_home_hot_auto_play || 0) == 1" :circular="false" :display-multiple-items="floor.blog_list.length < 3 ? floor.blog_list.length : 3" interval="3000">
                                        <block v-for="(item, index) in floor.blog_list" :key="index">
                                            <swiper-item class="padding-right-main">
                                                <view class="item bg-white border-radius-main oh pr ht-auto pr">
                                                    <navigator :url="item.url" hover-class="none">
                                                        <image class="blog-img dis-block wh-auto" :src="item.cover" mode="aspectFill"></image>
                                                        <view class="blog-title pa single-text cr-white padding-horizontal-main padding-top-sm padding-bottom-sm">{{item.title}}</view>
                                                    </navigator>
                                                </view>
                                            </swiper-item>
                                        </block>
                                    </swiper>
                                </view>
                            </block>
                        </block>
                    </view>
                </block>
            </block>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {};
        },
        components: {},
        props: {
            propLocation: {
            	type: [String,Number],
            	default: 0
            },
            propConfig: {
            	type: [String,Object],
            	default: null
            },
            propData: {
            	type: Array,
            	default: []
            }
        },
        methods: {}
    };
</script>
<style>
</style>
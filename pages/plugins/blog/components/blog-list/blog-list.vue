<template>
    <view :class="theme_view">
        <view v-if="(propConfig || null) != null && (propData || null) != null && propData.length > 0">
            <block v-for="(floor, index) in propData" :key="index">
                <block v-if="floor.blog_list.length > 0 && floor.home_data_location == propLocation">
                    <view class="plugins-blog" :class="floor.style_type == 2 ? 'bg-white border-radius-main padding-main spacing-mb' : ''">
                        <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                            <view class="title-left">
                                <text class="text-wrapper" :class="floor.style_type == 2 ? '' : 'title-left-border'" :style="'color:' + (floor.color || '#333') + ';'">{{ floor.title }}</text>
                                <text v-if="(floor.vice_title || null) != null" class="vice-name margin-left-sm cr-grey-9">{{ floor.vice_title }}</text>
                            </view>
                            <text :data-value="floor.more_url" @tap="url_event" class="arrow-right padding-right cr-grey cp">{{$t('common.more')}}</text>
                        </view>
                        <view class="wh-auto oh pr">
                            <block v-if="floor.blog_list.length > 0">
                                <!-- 默认图文 -->
                                <block v-if="(floor.style_type || 0) == 0">
                                    <view class="plugins-blog-list">
                                        <view v-for="(item, index) in floor.blog_list" :key="index" class="item oh padding-main border-radius-main bg-white spacing-mb">
                                            <view :data-value="item.url" @tap="url_event" class="cp">
                                                <image class="blog-img fl radius" :src="item.cover" mode="aspectFill"></image>
                                                <view class="base fr">
                                                    <view class="single-text text-size">{{ item.title }}</view>
                                                    <view class="cr-grey-9 margin-top-sm text-size-xs">{{ item.add_time_date_cn }}</view>
                                                    <view v-if="(item.describe || null) != null" class="cr-base multi-text margin-top-sm text-size-xs">{{item.describe}}</view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                                <!-- 九方格 -->
                                <block v-else-if="floor.style_type == 1">
                                    <view class="plugins-blog-grid-list">
                                        <view v-for="(item, index) in floor.blog_list" :key="index" class="item oh border-radius-main bg-white spacing-mb">
                                            <view :data-value="item.url" @tap="url_event" class="cp">
                                                <image class="blog-img dis-block" :src="item.cover" mode="widthFix"></image>
                                                <view class="base padding-horizontal-sm margin-top-sm">
                                                    <view class="goods-title multi-text margin-bottom-sm text-size-xs">{{ item.title }}</view>
                                                    <view class="cr-grey text-size-xs">{{ item.add_time_date_cn }}</view>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                                <!-- 滚动 -->
                                <view v-else-if="floor.style_type == 2" class="rolling-horizontal border-radius-main oh spacing-mb">
                                    <view class="plugins-blog-rolling-list scroll-view-horizontal">
                                        <swiper :vertical="false" :autoplay="(propConfig.is_home_hot_auto_play || 0) == 1" :circular="false" :display-multiple-items="floor.blog_list.length < 3 ? floor.blog_list.length : 3" interval="3000">
                                            <block v-for="(item, index) in floor.blog_list" :key="index">
                                                <swiper-item>
                                                    <view :data-value="item.url" @tap="url_event" class="item bg-white border-radius-main margin-right-main oh pr ht-auto pr cp">
                                                        <image class="blog-img dis-block wh-auto" :src="item.cover" mode="scaleToFill"></image>
                                                        <view class="blog-title pa single-text cr-white padding-sm text-size-xs">{{ item.title }}</view>
                                                    </view>
                                                </swiper-item>
                                            </block>
                                        </swiper>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                </block>
            </block>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
            };
        },
        components: {},
        props: {
            propLocation: {
                type: [String, Number],
                default: 0,
            },
            propConfig: {
                type: [String, Object],
                default: null,
            },
            propData: {
                type: Array,
                default: [],
            },
        },
        methods: {
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style></style>

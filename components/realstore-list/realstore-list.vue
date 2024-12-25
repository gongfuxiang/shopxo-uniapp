<template>
    <view :class="theme_view">
        <view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-realstore-data-list oh">
            <block v-for="(item, index) in data_list" :key="index">
                <view class="item bg-white padding-top-xl padding-bottom-sm padding-horizontal-main border-radius-main pr spacing-mb" :class="item.status_info.type === 2 ? 'opacity' : ''" :data-index="index" :data-value="item.url+propRealstoreDetailQuery" @tap="realstore_item_event">
                    <view class="base oh flex-row">
                        <!-- 基础内容 -->
                        <image :src="item.logo" mode="widthFix" class="logo circle br"></image>
                        <view class="base-right flex-1 flex-width">
                            <view class="title fw-b text-size single-text tl">
                                <text v-if="(item.alias || null) != null" class="va-m title-icon border-radius-sm br-main cr-main text-size-xs padding-horizontal-xs margin-right-xs">{{ item.alias }}</text>
                                <text class="va-m">{{ item.name }}</text>
                            </view>
                            <view class="margin-top-sm padding-top-xs text-size-xs cr-grey">
                                <view v-if="(item.status_info.time || null) != null" class="flex-row align-c">
                                    <iconfont name="icon-time pr top-xs cr-grey-9"></iconfont>
                                    <view :class="'status-icon text-size-xs divider-r padding-left-xs padding-right-sm margin-right-sm ' + (item.status_info.status == 1 ? 'cr-green' : item.status_info.type == 1 ? 'cr-red' : 'cr-grey-c')">
                                        {{ item.status_info.msg }}
                                    </view>
                                    {{ item.status_info.time }}
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="flex-row jc-sb align-c br-t-dashed margin-top-main padding-top-sm">
                        <!-- 地址 -->
                        <view class="address-content single-text cr-base margin-left-xs dis-inline-block text-size-xs oh cp tl" :data-value="item.province_name + item.city_name + item.county_name + item.address" @tap.stop="text_copy_event">
                            <view class="dis-inline-block va-m cr-grey-9 margin-top-sm">
                                <iconfont name="icon-map-address"></iconfont>
                            </view>
                            <text class="va-m margin-left-xs">{{ item.province_name }}{{ item.city_name }}{{ item.county_name }}{{ item.address }}</text>
                        </view>
                        <view v-if="(item.distance || null) != null" class="text-size-xs cr-grey-c pa address-distance">{{$t('extraction-address.extraction-address.42v8tv')}}{{ item.distance }}</view>
                    </view>
                    <!-- 右侧操作 -->
                    <view class="icon-list pa">
                        <view v-if="(item.service_data || null) != null && (item.service_data.service_tel || null) != null" class="icon-item dis-inline-block tc cp" :data-value="item.service_data.service_tel" @tap.stop="tel_event">
                            <iconfont name="icon-tel" size="30rpx"></iconfont>
                        </view>
                        <!-- #ifndef MP-KUAISHOU -->
                        <view v-if="item.lat != 0 && item.lng != 0" class="icon-item dis-inline-block tc cp" :data-index="index" @tap.stop="address_map_event">
                            <iconfont name="icon-send" size="30rpx"></iconfont>
                        </view>
                        <!-- #endif -->
                    </view>
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
            theme_view: app.globalData.get_theme_value_view(),
            data_list: [],
            favor_user: [],
        };
    },
    components: {},
    props: {
        propIsFavor: {
            type: Boolean,
            default: true,
        },
        propIsChoice: {
            type: Boolean,
            default: false,
        },
        propIsChoiceBackType: {
            type: String,
            default: '',
        },
        propIsOpenRealstoreRedirect: {
            type: Boolean,
            default: true,
        },
        propData: {
            type: Object,
            default: () => {
                return {};
            },
        },
        propFavorUser: {
            type: Array,
            default: () => [],
        },
        propRealstoreDetailQuery: {
            type: String,
            default: '',
        },
    },
    // 属性值改变监听
    watch: {
        // 数据
        propData(value, old_value) {
            this.init();
        }
    },
    // 页面被展示
    created: function (e) {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            var data_list = ((this.propData || null) == null || (this.propData.data || null) == null || this.propData.data.length == 0) ? [] : this.propData.data;
            this.setData({
                data_list: data_list,
                favor_user: this.propFavorUser,
            });
            this.data_list_handle();
        },

        // 数据列表处理
        data_list_handle() {
            var temp_data_list = this.data_list;
            for (var i in temp_data_list) {
                temp_data_list[i]["is_favor"] = this.favor_user.indexOf(temp_data_list[i]["id"]) == -1 ? 0 : 1;
            }
            this.setData({
                data_list: temp_data_list,
            });
        },

        // 收藏事件
        favor_event(e) {
            if (!app.globalData.is_single_page_check()) {
                return false;
            }
            var user = app.globalData.get_user_info(this, "favor_event");
            if (user != false) {
                var index = e.currentTarget.dataset.index;
                var info = this.data_list[index];
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url("reversal", "favor", "realstore"),
                    method: "POST",
                    data: {
                        id: info.id,
                    },
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_data = this.data_list;
                            var temp_favor = this.favor_user;
                            temp_data[index]["is_favor"] = res.data.data.status;
                            if (res.data.data.status == 1) {
                                if (temp_favor.indexOf(info.id) == -1) {
                                    temp_favor.push(info.id);
                                }
                            } else {
                                if (temp_favor.indexOf(info.id) != -1) {
                                    temp_favor.splice(index, 1);
                                }
                            }
                            this.setData({
                                data_list: temp_data,
                                favor_user: temp_favor,
                            });
                            app.globalData.showToast(res.data.msg, "success");
                        } else {
                            if (app.globalData.is_login_check(res.data, this, "favor_event")) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            }
        },

        // 电话
        tel_event(e) {
            app.globalData.call_tel(e);
        },

        // 剪切板
        text_copy_event(e) {
            app.globalData.text_copy_event(e);
        },

        // 地图查看
        address_map_event(e) {
            var info = this.data_list[e.currentTarget.dataset.index] || {};
            if (info.lat == 0 || info.lng == 0) {
                app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                return false;
            }
            var address = (info.province_name || "") + (info.city_name || "") + (info.county_name || "") + (info.address || "");
            app.globalData.open_location(info.lng, info.lat, info.name, address);
        },

        // 门店事件
        realstore_item_event(e) {
            // 是否选择模式
            if(this.propIsChoice) {
                // 存储门店缓存
                var data = this.data_list[e.currentTarget.dataset.index];
                uni.setStorageSync(app.globalData.data.cache_realstore_detail_choice_key, {
                    data: data,
                    status: 1
                });

                // 回调事件
                this.$emit('onChoiceEvent', data);

                // 选择回调类型
                switch(this.propIsChoiceBackType) {
                    // 返回上一个页面
                    case 'back' :
                        app.globalData.page_back_prev_event();
                        break;
                    // 进入门店详情页面
                    case 'realstore-detail' :
                        app.globalData.url_open(data.url, this.propIsOpenRealstoreRedirect);
                        break;
                }
            } else {
                app.globalData.url_event(e);
            }
        }
    }
};
</script>
<style></style>

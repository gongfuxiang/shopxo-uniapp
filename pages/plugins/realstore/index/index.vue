<template>
    <view :class="theme_view">
        <block v-if="(data_base || null) != null">
            <!-- 强制选择一个门店模式 -->
            <view v-if="is_force_choice_realstore == 1" class="padding-main tc">
                <!-- 位置展示 -->
                <component-choice-location ref="choice_location" propBaseColor="#333" @onBack="user_back_choice_location"></component-choice-location>
                <!-- 提示信息 -->
                <view class="padding-bottom-xxxxl margin-top-sm">
                    <block v-if="(user_choice_realstore || null) == null">
                        <image :src="not_choice_realstore_images" class="dis-block wh-auto" mode="widthFix"></image>
                        <view v-if="(data_base.home_not_choice_realstore_msg || null) != null" class="cr-grey margin-top-xl">{{data_base.home_not_choice_realstore_msg}}</view>
                        <view class="padding-horizontal-xxxl">
                            <button type="default" class="bg-main br-main cr-white text-size-sm margin-top-xxl round" hover-class="none" @tap="realstore_choice_event">{{$t('realstore-cart.realstore-cart.87tty2')}}</button>
                        </view>
                    </block>
                    <!-- 已选择的门店 -->
                    <block v-else>
                        <view class="padding-main border-radius-main bg-white br-main pr oh tl user-choice-realstore">
                            <view class="checked pa bg-main lh-sm tc padding-top-xs padding-left-xs">
                                <iconfont name="icon-checked" size="32rpx" color="#fff"></iconfont>
                            </view>
                            <view class="base flex-row oh">
                                <!-- 基础内容 -->
                                <image :src="user_choice_realstore.logo" mode="widthFix" class="logo circle fl br"></image>
                                <view class="base-right padding-left-sm flex-1 flex-width">
                                    <view class="padding-right-lg">
                                        <view class="single-text dis-inline-block va-m">
                                            <text v-if="(user_choice_realstore.alias || null) != null" class="va-m border-radius-sm br-main cr-main text-size-xs padding-left-sm padding-right-sm margin-right-xs">{{ user_choice_realstore.alias }}</text>
                                            <text class="va-m fw-b text-size">{{ user_choice_realstore.name }}</text>
                                        </view>
                                    </view>
                                    <!-- 地址 -->
                                    <view class="flex-row align-s align-c margin-top-sm">
                                        <iconfont name="icon-map-address" size="28rpx" propClass="pr top-xs"></iconfont>
                                        <view class="address-content single-text cr-base margin-left-xs text-size-sm" :data-value="user_choice_realstore.province_name + user_choice_realstore.city_name + user_choice_realstore.county_name + user_choice_realstore.address" @tap="text_copy_event">
                                            {{ user_choice_realstore.province_name }}{{ user_choice_realstore.city_name }}{{ user_choice_realstore.county_name }}{{ user_choice_realstore.address }}
                                        </view>
                                        <!-- #ifndef MP-KUAISHOU -->
                                        <view v-if="user_choice_realstore.lat != 0 && user_choice_realstore.lng != 0" class="tc cp border-radius-sm text-size-xss cr-green br-green padding-horizontal-xs margin-left-xs" @tap="address_map_event">{{$t('detail.detail.688i26')}}</view>
                                        <!-- #endif -->
                                    </view>
                                </view>
                            </view>
                            <view class="pr margin-top">
                                <view class="text-size-xs cr-grey">
                                    <view v-if="(user_choice_realstore.status_info.time || null) != null">{{$t('detail.detail.dor2v9')}}{{ user_choice_realstore.status_info.time }}</view>
                                    <view v-if="(user_choice_realstore.distance || null) != null">{{$t('extraction-address.extraction-address.42v8tv')}}{{ user_choice_realstore.distance }}</view>
                                </view>
                                <button type="default" size="mini" class="bg-main-light br-main cr-main text-size-xss round pa bottom-0 right-0" hover-class="none" :data-value="user_choice_realstore.url" @tap="url_event">{{$t('realstore-cart.realstore-cart.r67uyg')}}</button>
                            </view>
                        </view>
                        <view v-if="(data_base.home_already_choice_realstore_msg || null) != null" class="cr-grey margin-top-xl">{{data_base.home_already_choice_realstore_msg}}</view>
                        <view class="padding-horizontal-xxxl">
                            <button type="default" class="bg-main br-main cr-white text-size-sm margin-top-xxl round" hover-class="none" @tap="realstore_choice_event">{{$t('realstore-cart.realstore-cart.76rfgh')}}</button>
                        </view>
                    </block>
                </view>
            </view>
            <block v-else>
                <view class="realstore-nav-bg">
                    <!-- 背景图片 -->
                    <image :src="plugins_static_url + 'title-bg'+(screen_width > 960 ? '-pc' : '')+'.png'" mode="widthFix" class="wh-auto pa bg-img" />
                    <!-- 顶部 -->
                    <view class="spacing-mb pr z-i cr-white">
                        <!-- 位置展示 -->
                        <view class="nav-location single-text dis-inline-block bs-bb pr padding-left-main padding-right-xl margin-top">
                            <component-choice-location ref="choice_location" @onBack="user_back_choice_location"></component-choice-location>
                        </view>
                    </view>
                    <!-- 搜索 -->
                    <view class="nav-search padding-main">
                        <component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" :propPlaceholder="$t('index.index.c5273j')" propPlaceholderClass="cr-grey-c"></component-search>
                    </view>
                </view>

                <!-- 轮播 -->
                <view v-if="slider_list.length > 0" class="padding-horizontal-main">
                    <component-banner :propData="slider_list"></component-banner>
                </view>

                <!-- 图标 -->
                <view v-if="icon_list.length > 0" class="padding-horizontal-main spacing-mb">
                    <view class="bg-white border-radius-main">
                        <component-icon-nav :propData="{...{data: icon_list}, ...{random: random_value}}"></component-icon-nav>
                    </view>
                </view>
            </block>

            <!-- 列表 -->
            <block v-if="data_list.length > 0">
                <view class="padding-horizontal-main">
                    <!-- 导航 -->
                    <component-title :propTitle="data_base.home_data_list_title || $t('index.index.1vf378')" :propMoreUrl="'/pages/plugins/realstore/search/search'+(is_force_choice_realstore == 1 ? '?is_choice_mode=1&choice_mode_back_type=realstore-detail&is_open_realstore_redirect=0' : '')"></component-title>
                    <!-- 数据列表 -->
                    <component-realstore-list :propData="{data: data_list}" :propFavorUser="favor_user" :propIsChoice="is_force_choice_realstore == 1" propIsChoiceBackType="realstore-detail" :propIsOpenRealstoreRedirect="false"></component-realstore-list>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>

            <!-- 位置选择提示 -->
            <view v-if="location_tips_close_status && (data_base.is_home_choice_location || 0) == 1 && ((data_base.home_choice_location_images || null) != null || (data_base.home_choice_location_msg || null) != null)" class="choice-location-tips pf wh-auto ht-auto tc bs-bb">
                <view class="content bg-white auto padding-xxxl pr radius">
                    <view v-if="(data_base.is_home_choice_location_force || 0) == 0" class="close oh pa">
                        <view @tap="location_tips_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="padding-lg">
                        <image v-if="(data_base.home_choice_location_images || null) != null" class="icon max-w" :src="data_base.home_choice_location_images" mode="widthFix"></image>
                        <view v-if="(data_base.home_choice_location_msg || null) != null" class="cr-base margin-top-lg">{{ data_base.home_choice_location_msg }}</view>
                        <button type="default" class="bg-main br-main cr-white text-size-sm margin-top-xxl round" hover-class="none" @tap="choose_user_location_event">{{$t('index.index.t3d917')}}</button>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentSearch from '@/components/search/search';
    import componentBanner from '@/components/slider/slider';
    import componentIconNav from '@/components/icon-nav/icon-nav';
    import componentRealstoreList from '@/pages/plugins/realstore/components/realstore-list/realstore-list';
    import componentTitle from '@/components/title/title';
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    var plugins_static_url = app.globalData.get_static_url('realstore', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                plugins_static_url: plugins_static_url,
                screen_width: parseInt(app.globalData.get_system_info('windowWidth', 0, true)),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                params: null,
                is_first: 1,
                data_base: null,
                search_keywords_value: '',
                favor_user: [],
                slider_list: [],
                icon_list: [],
                data_list: [],
                // 用户选择的门店
                not_choice_realstore_images: plugins_static_url+'app/index/not-choice-realstore-images.png',
                user_choice_realstore: null,
                // 强制选择门店
                is_force_choice_realstore: 0,
                // 强制自动选择第一个门店
                is_force_auto_choice_realstore: 0,
                // 强制自动选择第一个门店的最低距离条件
                force_auto_choice_realstore_distance: 0,
                // 用户位置信息
                user_location: {},
                location_tips_close_status: false,
                // 自定义分享信息
                share_info: {},
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentBanner,
            componentIconNav,
            componentRealstoreList,
            componentTitle,
            componentChoiceLocation
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
            
            // #ifdef H5
            // 监听屏幕宽度和高度变化
            window.addEventListener('resize', this.handle_resize, true);
            // #endif
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 门店选择初始化
            this.realstore_choice_init();

            // 用户位置初始化
            this.user_location_init();

            // 数据加载
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            if(this.data_list_loding_status === 1) {
                uni.stopPullDownRefresh();
            } else {
                this.get_data();
            }
        },

        // 页面销毁时执行
        onUnload: function () {
            // #ifdef H5
            window.removeEventListener('resize', this.handle_resize);
            // #endif
        },

        methods: {
            // 初始化
            get_data(params = {}) {
                // 网络检查
                if((params || null) == null || (params.loading || 0) == 0) {
                    app.globalData.network_type_handle(this, 'get_data', params);
                    return false;
                }

                // 请求数据
                var lng = 0;
                var lat = 0;
                if ((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'realstore'),
                    method: 'POST',
                    data: {
                        lng: lng,
                        lat: lat,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data_list || [];
                            var data_base = data.base || {};
                            this.setData({
                                random_value: Math.random(),
                                data_base: data.base || null,
                                favor_user: data.favor_user || [],
                                slider_list: data.slider_list || [],
                                icon_list: data.icon_list || [],
                                data_list: data_list,
                                not_choice_realstore_images: data_base.home_not_choice_realstore_images || this.not_choice_realstore_images,
                                is_force_choice_realstore: parseInt(data_base.is_home_force_choice_one_realstore_mode || 0),
                                is_force_auto_choice_realstore: parseInt(data_base.is_home_force_choice_one_realstore_mode_auto_lately_realstore || 0),
                                force_auto_choice_realstore_distance: parseFloat(data_base.home_force_choice_one_realstore_mode_auto_lately_distance || 0),
                                data_list_loding_status: data_list.length > 0 ? 3 : 0,
                                data_bottom_line_status: true,
                            });

                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/realstore/index/index',
                                    },
                                });

                                // 导航名称
                                if ((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name,
                                    });
                                }

                                // 非首次
                                if(this.is_first == 1) {
                                    // 是否自动获取用户当前位置、如果系统已经开启获取位置则这里不调用
                                    if(app.globalData.data.get_user_location_status != 1 && parseInt(this.data_base.is_home_auto_user_location || 0) == 1) {
                                        app.globalData.get_user_location(this, 'user_back_auto_location', true);
                                    }

                                    // 自动选择第一个门店、不存在已选择的门店
                                    if((this.user_choice_realstore || null) == null && this.data_list.length > 0 && this.is_force_choice_realstore == 1 && this.is_force_auto_choice_realstore == 1) {
                                        var status = true;
                                        var temp_realstore = this.data_list[0];
                                        // 最低条件，自动选择第一个最低距离设置、不存在门店位置数据 或 位置值大于最低值则不选择
                                        if(this.force_auto_choice_realstore_distance > 0) {
                                            if(temp_realstore.distance_value === undefined || temp_realstore.distance_value > this.force_auto_choice_realstore_distance) {
                                                status = false;
                                            }
                                        }
                                        if(status) {
                                            // 自动进入门店则不显示提示位置选择弹窗
                                            this.setData({
                                                location_tips_close_status: false
                                            });
                                            // 存储门店缓存
                                            uni.setStorageSync(app.globalData.data.cache_realstore_detail_choice_key, {
                                                data: temp_realstore,
                                                status: 0
                                            });
                                            // 进入门店页面
                                            app.globalData.url_open(temp_realstore.url);
                                        }
                                    }
                                }
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }

                        // 首次状态记录
                        this.setData({
                            is_first: 0,
                        });

                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 搜索事件
            search_button_event(e) {
                var params = (e || null) == null ? '' : '?keywords=' + e;
                app.globalData.url_open('/pages/plugins/realstore/search/search' + params);
            },

            // 选择地理位置
            choose_user_location_event(e) {
                if ((this.$refs.choice_location || null) != null) {
                    this.$refs.choice_location.choose_user_location();
                }
            },

            // 自动获取用户位置回调
            user_back_auto_location(e) {
                // 位置数据更新
                if ((this.$refs.choice_location || null) != null) {
                    this.$refs.choice_location.init();
                }
                // 设置状态为首次
                this.setData({
                    is_first: 1,
                });
                // 设置位置数据，重新获取数据
                this.user_back_choice_location(e);
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                // 设置数据
                this.setData({
                    user_location: e,
                    location_tips_close_status: e.status != 1
                });
                // 重新获取数据
                this.get_data();
            },

            // 门店选择初始化
            realstore_choice_init() {
                var key = app.globalData.data.cache_realstore_detail_choice_key;
                var res = uni.getStorageSync(key) || null;
                if(res != null && (res.data || null) != null) {
                    this.setData({
                        user_choice_realstore: res.data
                    });
                }
            },

            // 地址信息初始化
            user_location_init() {
                var res = app.globalData.choice_user_location_init();
                this.setData({
                    user_location: res,
                    location_tips_close_status: res.status != 1
                });
            },

            // 地址选择提示关闭事件
            location_tips_close_event(e) {
                this.setData({
                    location_tips_close_status: false,
                });
            },
            
            // 页面宽度变化监听
            handle_resize() {
                // #ifdef H5
                this.setData({
                    screen_width: window.innerWidth,
                });
                // #endif
            },

            // 门店选择事件
            realstore_choice_event(e) {
                app.globalData.url_open('/pages/plugins/realstore/search/search?is_choice_mode=1&choice_mode_back_type=realstore-detail&show_type_mode=1');
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 剪切板
            text_copy_event(e) {
                app.globalData.text_copy_event(e);
            },

            // 地图查看
            address_map_event(e) {
                var info = this.user_choice_realstore || {};
                if (info.lat == 0 || info.lng == 0) {
                    app.globalData.showToast(this.$t('user-order-detail.user-order-detail.i876o3'));
                    return false;
                }
                var address = (info.province_name || '') + (info.city_name || '') + (info.county_name || '') + (info.address || '');
                app.globalData.open_location(info.lng, info.lat, info.name, address);
            },
        },
    };
</script>
<style>
    @import './index.css';
</style>

<template>
    <view :class="theme_view">
        <component-nav-back :propName="$t('index.index.t26j9z')"></component-nav-back>
        <view v-if="(data_base || null) != null" class="weixin-nav-padding-top">
            <view class="padding-top-xxxl">
                <!-- 广告图片 -->
                <view class="pa top-0 bg-img wh-auto">
                    <block v-if="(data_base.right_images || null) != null">
                        <image class="wh-auto advertisement" :src="points_static_url + 'integral-bg.png'" mode="widthFix" :data-value="data_base.right_images_url || ''" @tap="url_event"></image>
                    </block>
                    <block v-else>
                        <image class="wh-auto advertisement" :src="points_static_url + 'integral-bg.png'" mode="widthFix" :data-value="data_base.right_images_url || ''" @tap="url_event"></image>
                    </block>
                </view>
                <view class="pr padding-top-main">
                    <view class="padding-horizontal-main points-content pr">
                        <!-- 顶部 -->
                        <view class="border-radius-main bg-white pr spacing-mb">
                            <view class="points-user">
                                <view class="flex-row">
                                    <block v-if="(user || null) == null">
                                        <image class="avatar dis-block circle" @tap="preview_event" :src="avatar_default" mode="widthFix"></image>
                                        <view class="padding-left-main">
                                            <view class="login-submit text-size fw-b" type="default" size="mini" @tap="login_event">{{$t('login.login.zy8tc4')}}</view>
                                            <view class="desc margin-top-sm cr-grey-9">{{$t('index.index.z88r5s')}}</view>
                                        </view>
                                    </block>
                                    <block v-else>
                                        <image class="avatar dis-block circle" @tap="preview_event" :src="user.avatar || avatar_default" mode="widthFix"></image>
                                        <view class="padding-left-main">
                                            <view class="text-size fw-b">{{ user.user_name_view }}</view>
                                            <view class="desc margin-top-sm cr-grey">
                                                <text>{{$t('index.index.b46kge')}}</text>
                                                <text class="cr-black fw-b padding-horizontal-xs">{{ user_integral.integral || 0 }}</text>
                                                <text>{{$t('index.index.t26j9z')}}</text>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                                <!-- 分享 -->
                                <button class="share-submit pa tc cr-white text-size-md" type="default" size="mini" @tap="share_event">{{$t('common.share')}}</button>
                            </view>
                            <block v-if="(data_base.is_home_points_record || 0) == 1 && (user || null) !== null">
                                <view v-if="integral_list.length > 0" class="points-integral br-t-dashed">
                                    <component-title :propTitle="$t('index.index.i73nwk')" propMoreUrl="/pages/user-integral/user-integral"></component-title>
                                    <view class="item">
                                        <view v-for="(item, index) in integral_list" class="list" :key="index">
                                            <view class="flex-row jc-sb align-c">
                                                <view class="cr-grey-9">{{$t('index.index.srd2ch')}}<text class="cr-black fw-b padding-left-sm">{{ item.original_integral }}</text>
                                                    <text class="padding-horizontal-sm">/</text>{{$t('goods-category.goods-category.5p4ksj')}}<text class="cr-black fw-b padding-left-sm">{{ item.new_integral }}</text>
                                                </view>
                                                <view class="cr-grey-9">{{ item.add_time_time }}</view>
                                            </view>
                                            <view class="flex-row jc-sb align-c margin-top-main">
                                                <view>{{ item.msg }}</view>
                                                <view class="cr-main text-size fw-b" :class="item.type == 1 ? 'cr-green' : 'cr-red'">{{ item.type == 1 ? '+' : '-' }} {{ item.operation_integral }}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                                <block v-else>
                                    <!-- 提示信息 -->
                                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propLoadingLogoTop="26%"></component-no-data>
                                </block>
                            </block>
                        </view>

                        <!-- 公告信息 -->
                        <button v-if="(data_base.points_desc || null) != null && data_base.points_desc.length > 0" class="rule-btn pa right-0 tc cr-white text-size-md" @tap="quick_open_event">{{$t('index.index.u5642g')}}</button>

                        <!-- 商品兑换 -->
                        <view v-if="(data_base.goods_exchange_data || null) != null && data_base.goods_exchange_data.length > 0">
                            <component-goods-list :propData="{ style_type: 1, title: $t('index.index.f3l1xt'), url: '/pages/goods-search/goods-search', goods_list: data_base.goods_exchange_data }" propMoreUrlKey="url" :propCurrencySymbol="currency_symbol" :propGridBtnConfig="gridBtnConfig" :propIsOpenGridBtnSet="isOpenGridBtnSet"></component-goods-list>
                        </view>

                        <!-- 积分明细和商品兑换都没有的时候展示无数据提示 -->
                        <block v-if="integral_list.length == 0 && (data_base.is_home_points_record || 0) != 1 && ((data_base.goods_exchange_data || null) === null || data_base.goods_exchange_data.length == 0)">
                            <!-- 提示信息 -->
                            <component-no-data :propStatus="0"></component-no-data>
                        </block>
                        <block v-else>
                            <!-- 结尾 -->
                            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                        </block>
                    </view>

                    <!-- 积分规则弹窗 -->
                    <component-popup v-if="(data_base.points_desc || null) != null && data_base.points_desc.length > 0" :propShow="popup_status" :propIsBar="propIsBar" propPosition="bottom" @onclose="quick_close_event">
                        <view class="rule">
                            <view class="cr-black text-size-md fw-b margin-bottom-main tc">{{$t('index.index.u5642g')}}</view>
                            <scroll-view :scroll-y="true" class="item">
                                <view v-for="(item, index) in data_base.points_desc" :key="index" class="cr-grey text-size-md">{{ item }}</view>
                            </scroll-view>
                            <button type="default" class="bg-main cr-white round text-size-md pa bottom-0 left-0 right-0" @tap="quick_close_event">{{$t('index.index.qbi72m')}}</button>
                        </view>
                    </component-popup>
                </view>
            </view>

            <!-- 分享 -->
            <component-share-popup ref="share"></component-share-popup>
        </view>
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
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentPopup from '@/components/popup/popup';
    import componentTitle from '@/components/title/title';
    import componentSharePopup from '@/components/share-popup/share-popup';
    var points_static_url = app.globalData.get_static_url('points', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                points_static_url: points_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                user: null,
                data_base: null,
                user_integral: null,
                avatar_default: app.globalData.data.default_user_head_src,
                // 自定义分享信息
                share_info: {},
                // 配置商品列表按钮
                isOpenGridBtnSet: true,
                gridBtnConfig: {
                    name: this.$t('index.index.4v5nq5'),
                    bg_color: app.globalData.get_theme_color(),
                    padding: '8rpx 16rpx',
                    border_radius: '8rpx',
                },
                // 规则弹窗
                popup_status: false,
                propIsBar: false,
                // 积分明细
                integral_list: [],
            };
        },
        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentPopup,
            componentTitle,
            componentSharePopup
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户信息
            this.setData({
                user: app.globalData.get_user_cache_info(),
            });

            // 初始化配置
            this.init_config();

            // 获取数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'points'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                user_integral: data.user_integral || null,
                            });
                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/points/index/index',
                                        img: this.data_base.right_images,
                                    },
                                });

                                // #ifndef MP-ALIPAY
                                // 导航名称
                                if ((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name,
                                    });
                                }
                                // #endif
                            }
                            
                            // 已登录则获取积分明细
                            if(this.user != null && (this.data_base || null) != null && parseInt(this.data_base.is_home_points_record || 0) == 1) {
                                this.get_integral_data_list();
                            } else {
                                this.setData({
                                    data_list_loding_msg: '',
                                    data_list_loding_status: 3,
                                    data_bottom_line_status: true,
                                });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 立即登录
            login_event() {
                // 获取用户信息
                this.setData({
                    user: app.globalData.get_user_info(this, 'login_event') || null,
                });
                // 获取积分明细
                if(this.user != null) {
                    this.get_integral_data_list();
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 头像查看
            preview_event() {
                if (app.globalData.data.default_user_head_src != this.user.avatar) {
                    uni.previewImage({
                        current: this.user.avatar,
                        urls: [this.user.avatar],
                    });
                }
            },

            // 获取积分数据
            get_integral_data_list(is_mandatory) {
                if((this.data_base || null) != null && parseInt(this.data_base.is_home_points_record || 0) == 1) {
                    uni.request({
                        url: app.globalData.get_request_url('index', 'userintegral'),
                        method: 'POST',
                        data: {},
                        dataType: 'json',
                        success: (res) => {
                            var integral_list = (res.data.code == 0 && res.data.data.data.length > 0) ? (res.data.data.data.length > 4 ? res.data.data.data.splice(0, 4) : res.data.data.data) : [];
                            this.setData({
                                integral_list: integral_list,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                            });
                        },
                        fail: () => {
                            this.setData({
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                            });
                        },
                    });
                }
            },

            // 弹层开启
            quick_open_event(e) {
                this.setData({
                    popup_status: true,
                });
            },

            // 弹层关闭
            quick_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },

            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
            }
        },
    };
</script>
<style>
    @import './index.css';
</style>

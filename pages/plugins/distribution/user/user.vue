<template>
    <view :class="theme_view">
        <view class="pr">
            <component-nav-back></component-nav-back>
            <view v-if="(data_base || null) != null" class="weixin-nav-padding-top">
                <view class="padding-top-xxxl">
                    <!-- 头部背景 -->
                    <image :src="distribution_static_url + 'distribution-bg.png'" mode="widthFix" class="pa top-0 bg-img wh-auto" />
                    <view class="pr padding-top-main">
                        <view class="padding-top-xxxl oh">
                            <!-- 头部 -->
                            <view class="padding-main border-radius-main oh pr">
                                <view class="flex-row align-c">
                                    <view class="head-img avatar bg-white circle">
                                        <image class="wh-auto circle" @tap="preview_event" @error="user_avatar_error" :src="avatar" mode="widthFix"></image>
                                    </view>
                                    <view class="head-item padding-left-main flex-1 flex-width">
                                        <view class="cr-white">
                                            <view class="dis-inline-block text-size fw-b" @tap="user_referrer">{{ nickname }}</view>
                                            <view v-if="(user_referrer || null) != null" class="dis-inline-block margin-left-lg br-b-f9 padding-bottom-xss text-size-xs" data-event="copy" :data-value="user_referrer" @tap="text_event">
                                                <view class="dis-inline-block">
                                                    <text>{{$t('common.recommend_code_name')}}</text>
                                                    <text class="fw-b margin-left-sm">{{user_referrer}}</text>
                                                </view>
                                                <view class="dis-inline-block margin-left-xs">
                                                    <iconfont name="icon-copy" size="22rpx" color="#fff"></iconfont>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="margin-top oh head-bottom">
                                            <view v-if="(user_level || null) != null" class="single-text level-item round dis-inline-block">
                                                <image v-if="(user_level.images_url || null) != null" class="level-icon margin-right-sm pr top-sm" :src="user_level.images_url" mode="widthFix"></image>
                                                <text v-if="(user_level.name || null) != null" class="cr-white text-size-xs">{{ user_level.name }}</text>
                                            </view>
                                            <view class="head-base pa">
                                                <block v-if="(data_base || null) != null && (data_base.is_enable_self_extraction || 0) == 1">
                                                    <button data-value="/pages/plugins/distribution/extraction/extraction" @tap="url_event" class="text-size-xs cr-white" size="mini" type="default" hover-class="none">
                                                        {{ (extraction || null) == null ? $t('user.user.2344s8') : '' }}{{$t('user.user.b5cnj1')}}<iconfont name="icon-arrow-right" size="18rpx" color="#fff" propClass="pa"></iconfont>
                                                    </button>
                                                </block>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <!-- 会员中心通知 -->
                        <view v-if="(user_level || null) != null && (data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0" class="padding-horizontal-main padding-bottom-main">
                            <view :class="(superior || null) != null ? 'padding-horizontal-main margin-horizontal-xs' : ''">
                                <uni-notice-bar show-icon scrollable :text="data_base.user_center_notice.join('')" background-color="transparent" color="#fff" />
                            </view>
                        </view>

                        <!-- 上级用户 -->
                        <view v-if="(data_base.is_show_superior || 0) == 1 && ((superior || null) != null || (data_base.is_modify_superior || 0) == 1)" class="superior">
                            <view class="superior-item flex-row jc-sb align-c oh border-radius-top-main">
                                <view class="superior-title cr-white fw-b va-m text-size-sm">{{$t('user.user.4rj120')}}</view>
                                <view class="superior-content">
                                    <block v-if="(data_base.is_show_superior || 0) == 1 && (superior || null) != null">
                                        <image :src="superior.avatar" mode="widthFix" class="circle va-m"></image>
                                        <text class="cr-white va-m margin-left-sm text-size-xs">{{ superior.user_name_view }}</text>
                                    </block>
                                    <text v-if="(data_base.is_modify_superior || 0) == 1" class="cr-white text-size-xs br round padding-horizontal-main padding-top-xs padding-bottom-xs margin-left" @tap="modify_superior_open_event">{{$t('user.user.567lwz')}}</text>
                                </view>
                            </view>
                        </view>

                        <!-- 数据统计 -->
                        <view v-if="stats_user_promotion_data_list.length > 0 || stats_base_data_list.length > 0 || stats_profit_data_list.length > 0" class="padding-horizontal-main oh">
                            <view class="stats-container padding-main border-radius-main bg-white pr spacing-mb">
                                <view class="flex-row jc-sb align-c">
                                    <view class="title-left-border text-size fw-b">{{$t('user.user.67y36w')}}</view>
                                    <button type="default" size="mini" class="br-grey-f5 bg-grey-f5 round stats-switch-submit text-size-xs pr margin-0" @tap="popup_time_event">
                                        {{ popup_time_value.name }}
                                        <iconfont name="icon-arrow-bottom" size="24rpx" class="pa" color="#999"></iconfont>
                                    </button>
                                </view>
                                <!-- 推广统计 -->
                                <view v-if="stats_user_promotion_data_list.length > 0" class="margin-top-main oh tc flex-row jc-sa align-c">
                                    <block v-for="(item, index) in stats_user_promotion_data_list" :key="index">
                                        <view class="padding-main flex-1" :class="stats_user_promotion_data_list.length - 1 > index ? 'divider-r-f5' : ''" :data-value="item.to_page" @tap="url_event">
                                            <view class="single-text margin-top-sm">
                                                <text class="fw-b promotion-size">{{ item.value }}</text>
                                                <text v-if="(item.unit || null) != null" class="cr-grey-9 text-size-xs">{{$t('user.user.rjye50')}}</text>
                                            </view>
                                            <view class="cr-grey text-size-xs">{{ item.name }}</view>
                                        </view>
                                    </block>
                                </view>
                                <!-- 基础统计 -->
                                <view v-if="stats_base_data_list.length > 0" class="margin-top oh tc">
                                    <block v-for="(item, index) in stats_base_data_list_children" :key="index">
                                        <view class="flex-row jc-sa bg-grey-f5 border-radius-main" :class="stats_base_data_list_children.length - 1 > index ? 'spacing-mb' : ''">
                                            <block v-for="(child, i) in item" :key="i">
                                                <view class="flex-width-half pr">
                                                    <view class="padding-vertical-xxxl padding-left-xxxl padding-right-sm flex-row jc-c align-c" :data-value="child.to_page" @tap="url_event">
                                                        <image :src="child.icon" mode="widthFix" class="count-img" />
                                                        <view class="tl flex-1 flex-width padding-left-main">
                                                            <view class="text-size-xs single-text">{{ child.name }}</view>
                                                            <view class="single-text margin-top-sm">
                                                                <text v-if="(child.first || null) != null" class="text-size-xs">{{ child.first }}</text>
                                                                <text class="text-size-lg fw-b">{{ child.value }}</text>
                                                                <text v-if="(child.unit || null) != null" class="cr-grey-9 text-size-xs">{{ child.unit }}</text>
                                                            </view>
                                                        </view>
                                                    </view>
                                                    <view v-if="child.data" class="flex-row jc-c align-c padding-horizontal-xs padding-bottom-sm pa bottom-0 left-0 right-0">
                                                        <view v-for="(cdata, ci) in child.data" :key="ci" class="padding-horizontal-sm">
                                                            <view class="cr-grey-9 text-size-xss" :data-value="cdata.to_page" @tap.stop="url_event">{{ cdata.name }}</view>
                                                        </view>
                                                    </view>
                                                </view>
                                            </block>
                                        </view>
                                    </block>
                                </view>
                            </view>

                            <!-- 返佣统计 -->
                            <view v-if="stats_profit_data_list.length > 0" class="stats-container padding-sm border-radius-main bg-white pr">
                                <view class="title-left-border text-size fw-b padding-vertical-sm padding-horizontal-main margin-left-sm">{{$t('user.user.q822fj')}}</view>
                                <view class="flex-row flex-wrap">
                                    <block v-for="(item, index) in stats_profit_data_list" :key="index">
                                        <view class="flex-width-half">
                                            <view class="anti-mercenary-count bg-grey-f5 border-radius-main margin-sm">
                                                <view class="text-size-xs single-text">{{ item.name }}</view>
                                                <view class="single-text margin-top-sm">
                                                    <text class="text-size-xs">{{ currency_symbol }}</text>
                                                    <text class="text-size-lg fw-b">{{ item.value }}</text>
                                                </view>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                            </view>
                        </view>

                        <!-- 导航 -->
                        <view v-if="nav_list.length > 0" class="nav oh flex-row flex-wrap padding-sm" :class="(profit_ladder || null) != null ? 'nav-bottom' : 'padding-bottom-main'">
                            <block v-for="(item, index) in nav_list" :key="index">
                                <view class="flex-width-half">
                                    <view class="item bg-white border-radius-main margin-sm">
                                        <view :data-value="item.url" @tap="url_event" class="flex-row align-c">
                                            <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                                            <view class="padding-left-main text-size fw-b flex-1 flex-width single-text">{{ item.title }}</view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>

                        <!-- 不符合分销条件描述 -->
                        <view v-if="(user_level || null) == null && (data_base.non_conformity_desc || null) != null && data_base.non_conformity_desc.length > 0" class="padding-horizontal-main">
                            <uni-notice-bar class="padding-0" show-icon scrollable :text="data_base.non_conformity_desc.join" background-color="transparent" color="#fff" />
                        </view>

                        <!-- 阶梯返佣提示 -->
                        <view v-if="(profit_ladder || null) != null" class="bg-white pf pa-w bottom-0 left-0 right-0 wh-auto">
                            <view class="padding-main">
                                <view class="flex-row jc-sb align-c bottom-line-exclude">
                                    <text class="cr-base">{{ profit_ladder.msg }}</text>
                                    <text data-value="/pages/plugins/distribution/poster/poster" @tap="url_event" class="text-size bg-main cr-white dis-inline-block round cp padding-horizontal-xxxl promotion-btn">{{$t('user.user.xjxb2v')}}</text>
                                </view>
                            </view>
                        </view>

                        <!-- 时间选择弹窗 -->
                        <component-popup :propShow="popup_time_status" propPosition="bottom" @onclose="popup_time_close_event">
                            <view class="padding-horizontal-main padding-top-main bg-white">
                                <view class="close oh">
                                    <view class="tr" @tap.stop="popup_time_close_event">
                                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                                    </view>
                                </view>
                                <view class="popup-time-container page-bottom-fixed">
                                    <form @submit="form_submit" class="form-container">
                                        <view v-if="(time_data || null) != null" class="quit-time oh">
                                            <block v-for="(item, index) in time_data" :key="index">
                                                <view class="item fl padding-main bs-bb">
                                                    <view class="text-size-xs round padding-top-xs padding-bottom-xs tc" :class="quit_time_checked_name === item.name ? 'br-main bg-main cr-white' : 'br-grey cr-grey bg-white'" :data-value="item.name" :data-index="index" @tap="quit_time_event">
                                                        {{ item.name }}
                                                    </view>
                                                </view>
                                            </block>
                                        </view>

                                        <view class="form-gorup bg-white">
                                            <view class="form-gorup-title">{{$t('team.team.pcaom3')}}</view>
                                            <view class="br-b">
                                                <uni-datetime-picker @change="time_start_change_event" v-model="popup_time_value.start" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" :placeholder="$t('team.team.pcaom3')" placeholder-class="cr-grey" />
                                            </view>
                                        </view>
                                        <view class="form-gorup bg-white">
                                            <view class="form-gorup-title">{{$t('team.team.iee9bp')}}</view>
                                            <view class="br-b">
                                                <uni-datetime-picker @change="time_end_change_event" v-model="popup_time_value.end" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" :placeholder="$t('team.team.iee9bp')" placeholder-class="cr-grey" />
                                            </view>
                                        </view>
                                        <view class="bottom-fixed">
                                            <view class="bottom-line-exclude">
                                                <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('user.user.25f97u')}}</button>
                                            </view>
                                        </view>
                                    </form>
                                </view>
                            </view>
                        </component-popup>

                        <!-- 修改上级用户弹窗 -->
                        <component-popup :propShow="modify_superior_popup_status" propPosition="bottom" @onclose="modify_superior_close_event">
                            <view class="padding-horizontal-main padding-top-main bg-white">
                                <view class="close oh">
                                    <view class="tr" @tap.stop="modify_superior_close_event">
                                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                                    </view>
                                </view>
                                <view class="popup-time-container page-bottom-fixed">
                                    <view class="form-container">
                                        <view class="form-gorup margin-top-xl">
                                            <view class="user-search">
                                                <component-search
                                                    @onsearch="modify_superior_search_submit_event"
                                                    :propIsOnEvent="true"
                                                    :propIsRequired="false"
                                                    :propPlaceholder="$t('user.user.nk3cpq')"
                                                    propClass="br"
                                                    propSize="md"
                                                    :propIsBtn="true"
                                                    :propDefaultValue="modify_superior_search_input_keywords_value"
                                                    <!-- #ifdef MP || APP -->
                                                    propIcon="icon-scan"
                                                    propIconColor="#333"
                                                    @onicon="modify_superior_search_icon_event"
                                                    :propIsIconOnEvent="true"
                                                    <!-- #endif -->
                                                ></component-search>
                                                <view class="custom-info margin-top-lg">
                                                    <block v-if="(modify_superior_user_data || null) != null">
                                                        <block v-if="(modify_superior_user_data.data || null) != null">
                                                            <image class="custom-avatar circle br va-m" :src="modify_superior_user_data.data.avatar" mode="aspectFill"></image>
                                                            <text class="va-m margin-left-sm">{{modify_superior_user_data.data.user_name_view}}</text>
                                                            <text class="cr-grey fr">{{modify_superior_user_data.data.add_time_text}}</text>
                                                        </block>
                                                        <view v-else class="cr-red">{{modify_superior_user_data.error_msg}}</view>
                                                    </block>
                                                    <view v-else class="cr-grey">{{$t('user.user.iynkpl')}}</view>
                                                    <view v-if="(superior || null) != null && (superior.can_modify_number_msg || null) != null" class="cr-yellow margin-top">{{superior.can_modify_number_msg}}</view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class="bottom-fixed">
                                            <view class="bottom-line-exclude">
                                                <button type="default" class="bg-main br-main cr-white round text-size" :disabled="form_submit_disabled_status" @tap="modify_superior_submit_event">{{$t('common.submit')}}</button>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </component-popup>
                    </view>
                </view>
            </view>
            <view v-else>
                <!-- 提示信息 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    import componentSearch from '@/components/search/search';
    var currency_symbol = app.globalData.currency_symbol();
    var distribution_static_url = app.globalData.get_static_url('distribution', true) + 'app/';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                distribution_static_url: distribution_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: currency_symbol,
                avatar: app.globalData.data.default_user_head_src,
                nickname: this.$t('login.login.6yfr9g'),
                user_referrer: null,
                data_base: null,
                user_level: null,
                extraction: null,
                superior: null,
                profit_ladder: null,
                nav_list: [],
                time_data: null,
                base_data: null,
                user_promotion_data: null,
                profit_data: null,
                stats_user_promotion_data_list: [],
                stats_base_data_list: [],
                stats_base_data_list_children: [],
                stats_profit_data_list: [],
                popup_time_status: false,
                form_submit_disabled_status: false,
                popup_time_value: { name: this.$t('user.user.dcbt21'), start: '', end: '', index: '' },
                quit_time_checked_name: '',
                modify_superior_popup_status: false,
                modify_superior_search_input_keywords_value: '',
                modify_superior_user_data: null
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentPopup,
            componentSearch
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                    this.set_user_base(user);
                }
            },

            // 设置用户基础信息
            set_user_base(user) {
                if ((user.avatar || null) != null) {
                    this.setData({ avatar: user.avatar });
                }
                if ((user.user_name_view || null) != null) {
                    this.setData({ nickname: user.user_name_view });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'distribution'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 选择时间处理
                            var time_data = data.time_data || null;
                            var temp_value = this.popup_time_value;
                            if (time_data != null) {
                                var temp = time_data[data.default_day];
                                temp_value.start = temp.start;
                                temp_value.end = temp.end;
                                temp_value.name = temp.name;
                            }
                            this.setData({
                                data_base: data.base || null,
                                user_level: data.user_level || null,
                                extraction: data.extraction || null,
                                superior: data.superior || null,
                                user_referrer: data.user_referrer || null,
                                profit_ladder: data.profit_ladder || null,
                                nav_list: data.nav_list || [],
                                time_data: time_data,
                                stats_user_promotion_data_list: data.stats_user_promotion_data_list || [],
                                stats_base_data_list: data.stats_base_data_list || [],
                                stats_base_data_list_children: app.globalData.group_arry(data.stats_base_data_list, 2) || [],
                                stats_profit_data_list: data.stats_profit_data_list || [],
                                popup_time_value: temp_value,
                                quit_time_checked_name: temp_value.name || '',
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 头像查看
            preview_event() {
                if (app.globalData.data.default_user_head_src != this.avatar) {
                    uni.previewImage({
                        current: this.avatar,
                        urls: [this.avatar],
                    });
                }
            },

            // 头像加载错误
            user_avatar_error(e) {
                this.setData({
                    avatar: app.globalData.data.default_user_head_src,
                });
            },

            // 时间选择开启弹层
            popup_time_event(e) {
                this.setData({
                    popup_time_status: true,
                });
            },

            // 时间选择关闭弹层
            popup_time_close_event(e) {
                this.setData({
                    popup_time_status: false,
                });
            },

            // 时间快捷选择
            quit_time_event(e) {
                var index = e.currentTarget.dataset.index;
                var item = this.time_data[index];
                var temp_value = this.popup_time_value;
                temp_value.start = item.start;
                temp_value.end = item.end;
                temp_value.index = index;
                this.setData({
                    popup_time_value: temp_value,
                    quit_time_checked_name: e.currentTarget.dataset.value,
                });
            },

            // 自定义开始时间事件
            time_start_change_event(e) {
                var temp_value = this.popup_time_value;
                temp_value.start = e;
                temp_value.index = '';
                this.setData({
                    popup_time_value: temp_value,
                    quit_time_checked_name: '',
                });
            },

            // 自定义结束时间事件
            time_end_change_event(e) {
                var temp_value = this.popup_time_value;
                temp_value.end = e;
                temp_value.index = '';
                this.setData({
                    popup_time_value: temp_value,
                    quit_time_checked_name: '',
                });
            },

            // 数据提交
            form_submit(e) {
                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('user.user.4141u2'),
                });
                uni.request({
                    url: app.globalData.get_request_url('stats', 'user', 'distribution'),
                    method: 'POST',
                    data: this.popup_time_value,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var temp_value = this.popup_time_value;
                            temp_value.name = (temp_value.index || null) == null ? ((temp_value.start || null) == null && (temp_value.end || null) == null ? this.$t('common.all') : this.$t('user.user.dcbt21')) : this.time_data[temp_value.index]['name'];
                            this.setData({
                                popup_time_status: false,
                                form_submit_disabled_status: false,
                                stats_user_promotion_data_list: data.stats_user_promotion_data_list || [],
                                stats_base_data_list: data.stats_base_data_list || [],
                                stats_base_data_list_children: app.globalData.group_arry(data.stats_base_data_list, 2) || [],
                                popup_time_value: temp_value,
                                quit_time_checked_name: temp_value.name || '',
                            });
                        } else {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 上级用户修改事件 - 打开
            modify_superior_open_event(e) {
                this.setData({
                    modify_superior_popup_status: true
                });
            },

            // 上级用户修改事件 - 关闭
            modify_superior_close_event(e) {
                this.setData({
                    modify_superior_popup_status: false
                });
            },

            // 上级用户修改 - 搜索关键字事件
            modify_superior_search_input_keywords_event(e) {
                this.setData({
                    modify_superior_search_input_keywords_value: e.detail.value,
                });
            },

            // 上级用户修改 - 搜索确认事件
            modify_superior_search_submit_event(e) {
                this.setData({
                    modify_superior_search_input_keywords_value: e
                });
                this.modify_superior_search_user();
            },

            // 上级用户修改 - icon事件
            modify_superior_search_icon_event(e) {
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        self.setData({
                            modify_superior_search_input_keywords_value: res.result
                        });
                        self.modify_superior_search_user();
                    },
                });
            },

            // 上级用户修改 - 搜索用户
            modify_superior_search_user() {
                uni.showLoading({
                    title: this.$t('recommend-form.recommend-form.e5k407'),
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("userquery", "user", "distribution"),
                    method: "POST",
                    data: {keywords: this.modify_superior_search_input_keywords_value},
                    dataType: "json",
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                modify_superior_user_data: {
                                    data: res.data.data
                                }
                            });
                        } else {
                            this.setData({
                                modify_superior_user_data: {
                                    error_msg: res.data.msg
                                }
                            });
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 上级用户修改 - 提交
            modify_superior_submit_event(e) {
                if((this.modify_superior_user_data || null) == null || (this.modify_superior_user_data.data || null) == null) {
                    app.globalData.showToast(this.$t('user.user.f5rny5'));
                    return false;
                }
                this.setData({
                    form_submit_disabled_status: true
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("superiorsave", "user", "distribution"),
                    method: "POST",
                    data: {superior_id: this.modify_superior_user_data.data.id},
                    dataType: "json",
                    success: (res) => {
                        this.setData({
                            form_submit_disabled_status: false
                        });
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            this.setData({
                                modify_superior_popup_status: false,
                                superior: res.data.data,
                            });
                            app.globalData.showToast(res.data.msg, 'success');
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 文本事件
            text_event(e) {
                app.globalData.text_event_handle(e);
            }
        },
    };
</script>
<style>
    @import './user.css';
</style>

<template>
    <view :class="theme_view">
        <view v-if="doc_data != null" class="doc-detail-page">
            <view class="doc-detail-toolbar padding-main bg-white flex-row jc-sb align-c left-0 top-0 ps z-i br-b-f5">
                <view class="doc-title-switch flex-1 flex-row align-c">
                    <view class="doc-home-entry margin-right" @tap="doc_home_event">
                        <iconfont name="icon-home" size="32rpx" color="#333"></iconfont>
                    </view>
                    <view class="flex-1 flex-row align-c" @tap="doc_popup_open">
                        <view class="single-text fw-b">{{ doc_data.name }}</view>
                        <iconfont v-if="doc_list.length > 1" name="icon-arrow-down" size="24rpx" color="#666" propClass="margin-left-xs"></iconfont>
                    </view>
                </view>
                <button v-if="navigation_list.length > 0" class="doc-nav-more-btn round bg-white cr-main br-main margin-left text-size-xs" size="mini" @tap="nav_popup_open">{{ $t('common.more') }}</button>
                <button class="doc-menu-btn round bg-main cr-white margin-left text-size-xs" size="mini" @tap="menu_popup_open">{{ $t('doc.menu') }}</button>
            </view>
            <view class="doc-content-wrap padding-main">
                <view v-if="content_data != null">
                    <view class="padding-main border-radius-main bg-white spacing-mb">
                        <view class="doc-content-title pr margin-bottom-lg">
                            <view class="text-size-lg fw-b flex-row jc-c align-c">
                                <iconfont v-if="access_icon_visible(content_data)" :name="content_data.is_lock == 1 ? 'icon-lock' : 'icon-unlock'" size="36rpx" propClass="margin-right-sm" :color="content_data.is_lock == 1 ? '' : '#1AAD19'"></iconfont>
                                <text>{{ content_data.title }}</text>
                            </view>
                            <view class="doc-share-entry" @tap="popup_share_event">
                                <iconfont name="icon-share-square" size="32rpx" color="#666"></iconfont>
                            </view>
                        </view>
                        <view v-if="content_data.is_lock == 1" class="doc-lock-panel">
                            <view class="am-text-center spacing-mb">{{ $t('doc.need_unlock') }}</view>
                            <view v-if="content_data.access_type == 1">
                                <input v-model="access_pwd" class="doc-input round bg-base margin-bottom-main" :placeholder="$t('doc.pwd_placeholder')" />
                                <view v-if="need_captcha" class="margin-bottom-main">
                                    <input v-model="verify_code" class="doc-input round bg-base margin-bottom-sm" :placeholder="$t('doc.verify_code')" maxlength="4" />
                                    <image :src="verify_img_url" class="doc-verify-img radius" @tap="refresh_verify" />
                                </view>
                                <button class="bg-main cr-white round text-size margin-top-lg" :loading="submit_loading" @tap="password_submit">{{ $t('doc.pwd_view') }}</button>
                            </view>
                            <view v-else-if="content_data.access_type == 2">
                                <view v-if="content_data.access_plans && content_data.access_plans.length > 1" class="doc-plan-list spacing-mb">
                                    <view v-for="(item, index) in content_data.access_plans" :key="item.days" class="doc-plan-item pr oh" :class="selected_plan && selected_plan.days == item.days ? 'br-main' : ''" :data-index="index" @tap="plan_select_event">
                                        <view class="text-size-sm">{{ item.days_name }}</view>
                                        <view class="cr-price text-size-xs">{{ item.price_text }}</view>
                                        <iconfont v-if="selected_plan && selected_plan.days == item.days" name="icon-subscript" size="68rpx" propClass="doc-plan-check cr-main"></iconfont>
                                    </view>
                                </view>
                                <view v-else-if="selected_plan" class="cr-price am-text-center spacing-mb">{{ selected_plan.price_text || (currency_symbol + selected_plan.price) }}<text v-if="selected_plan.days_name" class="cr-grey text-size-sm margin-left-sm">{{ selected_plan.days_name }}</text></view>
                                <view v-else class="cr-price am-text-center spacing-mb">{{ currency_symbol }}{{ content_data.access_price }}</view>
                                <button class="bg-main cr-white round text-size margin-top-lg" @tap="pay_open">{{ $t('doc.pay_view') }}</button>
                            </view>
                            <view v-else-if="content_data.access_type == 3">
                                <view v-if="content_data.access_plans && content_data.access_plans.length > 1" class="doc-plan-list spacing-mb">
                                    <view v-for="(item, index) in content_data.access_plans" :key="item.days" class="doc-plan-item pr oh" :class="selected_plan && selected_plan.days == item.days ? 'br-main' : ''" :data-index="index" @tap="plan_select_event">
                                        <view class="text-size-sm">{{ item.days_name }}</view>
                                        <view class="cr-price text-size-xs">{{ item.integral_text || (item.integral + $t('doc.points')) }}</view>
                                        <iconfont v-if="selected_plan && selected_plan.days == item.days" name="icon-subscript" size="68rpx" propClass="doc-plan-check cr-main"></iconfont>
                                    </view>
                                </view>
                                <view v-else class="am-text-center spacing-mb">{{ $t('doc.need_integral') }}<text class="cr-price">{{ selected_plan ? selected_plan.integral : content_data.access_integral }}</text>{{ $t('doc.points') }}<text v-if="selected_plan && selected_plan.days_name" class="cr-grey text-size-sm margin-left-sm">{{ selected_plan.days_name }}</text></view>
                                <view class="cr-grey text-size-sm am-text-center spacing-mb">{{ $t('doc.current_integral', { num: user_integral }) }}</view>
                                <button class="bg-main cr-white round text-size margin-top-lg" :loading="submit_loading" @tap="integral_submit">{{ $t('doc.integral_view') }}</button>
                            </view>
                            <view v-else-if="content_data.access_type == 6">
                                <view class="am-text-center spacing-mb">{{ $t('doc.vip_only') }}</view>
                                <view v-if="content_data.access_vip_level_names" class="cr-grey text-size-sm am-text-center spacing-mb">{{ $t('doc.vip_levels', { name: content_data.access_vip_level_names }) }}</view>
                                <button v-if="!is_user_login" class="bg-main cr-white round text-size margin-top-lg" @tap="vip_login_event">{{ $t('common.please_login') }}</button>
                                <button v-else-if="content_data.vip_buy_url" class="bg-main cr-white round text-size margin-top-lg" @tap="vip_buy_event">{{ $t('doc.vip_buy') }}</button>
                            </view>
                        </view>
                        <view v-else class="oh web-html-content pr" :class="content_data.is_copy_protect == 1 ? 'doc-protect' : ''">
                            <view v-if="content_data.is_watermark == 1 && content_data.watermark_text" class="doc-watermark">
                                <view v-for="item in watermark_tiles" :key="item.id" class="doc-watermark-item" :style="watermark_item_style">{{ content_data.watermark_text }}</view>
                            </view>
                            <rich-text :nodes="content_html"></rich-text>
                        </view>
                    </view>
                    <view v-if="content_data.is_lock != 1 && (content_data.prev || content_data.next)" class="last-next-data spacing-mt margin-bottom-xxxl cr-grey-9">
                        <view v-if="content_data.prev" class="flex-row" :data-id="content_data.prev.id" @tap="content_switch_event">
                            <text>{{ $t('common.previous_article') }}</text>
                            <text class="dis-inline-block flex-row flex-width single-text cp item">{{ content_data.prev.title }}</text>
                        </view>
                        <view v-if="content_data.next" class="margin-top flex-row cr-main" :data-id="content_data.next.id" @tap="content_switch_event">
                            <text>{{ $t('common.next_article') }}</text>
                            <text class="dis-inline-block flex-row flex-width single-text cp item">{{ content_data.next.title }}</text>
                        </view>
                    </view>
                    <component-bottom-line :propStatus="true"></component-bottom-line>
                </view>
                <component-no-data v-else :propStatus="content_loading_status" :propMsg="content_loading_msg"></component-no-data>
            </view>
        </view>
        <component-no-data v-else :propStatus="detail_loading_status" :propMsg="detail_loading_msg"></component-no-data>

        <component-popup :propShow="doc_popup_status" propPosition="bottom" @onclose="doc_popup_close">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="oh spacing-mb">
                    <text class="fw-b">{{ $t('doc.switch_doc') }}</text>
                    <view class="fr" @tap.stop="doc_popup_close">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <scroll-view scroll-y class="doc-switch-scroll">
                    <view
                        v-for="(item, index) in doc_list"
                        :key="item.id"
                        class="doc-switch-item single-text"
                        :class="item.id == doc_id ? 'active cr-main' : ''"
                        @tap="doc_switch_event"
                        :data-index="index"
                    >{{ item.name }}</view>
                </scroll-view>
            </view>
        </component-popup>

        <component-popup :propShow="nav_popup_status" propPosition="bottom" @onclose="nav_popup_close">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="oh spacing-mb">
                    <text class="fw-b">{{ $t('doc.more_nav') }}</text>
                    <view class="fr" @tap.stop="nav_popup_close">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view
                    v-for="item in navigation_list"
                    :key="item.id"
                    class="doc-switch-item single-text"
                    :data-value="item.event_value || item.url"
                    :data-type="item.event_type == undefined ? 1 : item.event_type"
                    @tap="navigation_event"
                >{{ item.name }}</view>
            </view>
        </component-popup>

        <component-popup :propShow="menu_popup_status" propPosition="left" @onclose="menu_popup_close">
            <view class="doc-menu-popup">
                <view class="padding-main">
                    <component-search
                        @onsearch="menu_search_event"
                        :propIsOnEvent="true"
                        :propDefaultValue="menu_keywords"
                        :propIsRequired="false"
                        :propIsBtn="true"
                        propSize="sm"
                        :propPlaceholder="$t('doc.menu_keyword')"
                        propIconColor="#ccc"
                        propPlaceholderClass="cr-grey-c"
                        propBgColor="#f6f6f6"
                        propBrColor="#eee"
                        propBtnClass="bg-main cr-white text-size-xs"
                    ></component-search>
                </view>
                <scroll-view scroll-y class="doc-menu-scroll">
                    <view class="padding-horizontal-main padding-bottom-main">
                        <block v-if="menu_has_visible()">
                            <block v-if="menu_data.file_list && menu_data.file_list.length > 0">
                                <block v-for="(item, index) in menu_data.file_list" :key="item.id">
                                    <view v-if="menu_item_visible(item)" class="doc-menu-item level-root flex-row align-c" :class="item.id == doc_content_id ? 'active cr-main' : ''" :data-id="item.id" @tap="menu_select_event">
                                        <iconfont v-if="access_icon_visible(item)" :name="item.is_lock == 1 ? 'icon-lock' : 'icon-unlock'" size="28rpx" propClass="margin-right-sm" :color="item.is_lock == 1 ? '' : '#1AAD19'"></iconfont>
                                        <text class="flex-1 single-text" :style="item.title_color ? ('color:' + item.title_color) : ''">{{ item.title }}</text>
                                    </view>
                                </block>
                            </block>
                            <block v-if="menu_data.category_file_list && menu_data.category_file_list.length > 0">
                                <block v-for="(cat, ci) in menu_data.category_file_list" :key="cat.id">
                                    <block v-if="menu_cat_visible(cat)">
                                        <view class="doc-menu-cat flex-row align-c" :data-key="'c'+cat.id" :data-has="menu_folder_has_child(cat) ? 1 : 0" @tap="menu_folder_toggle_event">
                                            <iconfont v-if="menu_folder_has_child(cat)" :name="menu_is_expand('c'+cat.id) ? 'icon-arrow-bottom' : 'icon-arrow-right'" size="24rpx" color="#999" propClass="margin-right-xs"></iconfont>
                                            <text class="flex-1 single-text">{{ cat.name }}</text>
                                        </view>
                                        <block v-if="menu_is_expand('c'+cat.id)">
                                            <block v-for="(item, index) in (cat.doc_list || [])" :key="item.id">
                                                <view v-if="menu_item_visible(item)" class="doc-menu-item flex-row align-c" :class="item.id == doc_content_id ? 'active cr-main' : ''" :data-id="item.id" @tap="menu_select_event">
                                                    <iconfont v-if="access_icon_visible(item)" :name="item.is_lock == 1 ? 'icon-lock' : 'icon-unlock'" size="28rpx" propClass="margin-right-sm" :color="item.is_lock == 1 ? '' : '#1AAD19'"></iconfont>
                                                    <text class="flex-1 single-text" :style="item.title_color ? ('color:' + item.title_color) : ''">{{ item.title }}</text>
                                                </view>
                                            </block>
                                            <block v-for="(sub, si) in (cat.items || [])" :key="sub.id">
                                                <block v-if="menu_cat_visible(sub)">
                                                    <view class="doc-menu-subcat flex-row align-c" :data-key="'s'+sub.id" :data-has="menu_folder_has_child(sub) ? 1 : 0" @tap="menu_folder_toggle_event">
                                                        <iconfont v-if="menu_folder_has_child(sub)" :name="menu_is_expand('s'+sub.id) ? 'icon-arrow-bottom' : 'icon-arrow-right'" size="24rpx" color="#999" propClass="margin-right-xs"></iconfont>
                                                        <text class="flex-1 single-text">{{ sub.name }}</text>
                                                    </view>
                                                    <block v-if="menu_is_expand('s'+sub.id)">
                                                        <block v-for="(item, index) in (sub.doc_list || [])" :key="item.id">
                                                            <view v-if="menu_item_visible(item)" class="doc-menu-item sub flex-row align-c" :class="item.id == doc_content_id ? 'active cr-main' : ''" :data-id="item.id" @tap="menu_select_event">
                                                                <iconfont v-if="access_icon_visible(item)" :name="item.is_lock == 1 ? 'icon-lock' : 'icon-unlock'" size="28rpx" propClass="margin-right-sm" :color="item.is_lock == 1 ? '' : '#1AAD19'"></iconfont>
                                                                <text class="flex-1 single-text" :style="item.title_color ? ('color:' + item.title_color) : ''">{{ item.title }}</text>
                                                            </view>
                                                        </block>
                                                    </block>
                                                </block>
                                            </block>
                                        </block>
                                    </block>
                                </block>
                            </block>
                        </block>
                        <component-no-data v-else propStatus="0"></component-no-data>
                    </view>
                </scroll-view>
            </view>
        </component-popup>

        <component-payment
            ref="payment"
            :propCurrencySymbol="currency_symbol"
            :propPayUrl="pay_url"
            :propQrcodeUrl="pay_check_url"
            propPayDataKey="id"
            :propPayExtData="pay_ext_data"
            :propPaymentList="payment_list"
            :propTempPayValue="temp_pay_value"
            :propPaymentId="payment_id"
            :propDefaultPaymentId="default_payment_id"
            :propPayPrice="pay_price"
            :propIsShowPayment="is_show_payment_popup"
            :propToAppointPage="pay_back_page"
            :propIsToPage="false"
            @close-payment-popup="payment_popup_event_close"
            @pay-success="order_item_pay_success_handle"
        ></component-payment>

        <component-share-popup ref="share"></component-share-popup>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    import componentPayment from '@/components/payment/payment';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentSearch from '@/components/search/search';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                doc_id: 0,
                doc_content_id: 0,
                doc_data: null,
                menu_data: {},
                content_data: null,
                content_html: '',
                detail_loading_status: 1,
                detail_loading_msg: '',
                content_loading_status: 1,
                content_loading_msg: '',
                doc_list: [],
                doc_popup_status: false,
                nav_popup_status: false,
                menu_popup_status: false,
                menu_expand_map: {},
                menu_keywords: '',
                menu_search_ids: [],
                is_show_payment_popup: false,
                payment_list: [],
                payment_id: 0,
                default_payment_id: 0,
                currency_symbol: app.globalData.currency_symbol(),
                user_integral: 0,
                access_pwd: '',
                verify_code: '',
                verify_url: '',
                verify_img_url: '',
                need_captcha: false,
                submit_loading: false,
                selected_plan: null,
                pay_url: '',
                pay_check_url: '',
                temp_pay_value: 0,
                pay_price: 0,
                pay_ext_data: {},
                pay_back_page: '',
                is_access_enable: 0,
                doc_access_type: 0,
                share_info: {},
                navigation_list: [],
                is_user_login: false,
                watermark_tiles: [],
                watermark_item_style: '',
            };
        },
        components: { componentCommon, componentNoData, componentPopup, componentPayment, componentSharePopup, componentBottomLine, componentSearch },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            var doc_id = parseInt(params.id || 0);
            var doc_content_id = parseInt(params.dcid || 0);
            this.setData({
                doc_id: doc_id,
                doc_content_id: doc_content_id,
                pay_url: app.globalData.get_request_url('pay', 'buy', 'doc'),
                pay_check_url: app.globalData.get_request_url('paycheck', 'buy', 'doc'),
                pay_back_page: '/pages/plugins/doc/detail/detail?id=' + doc_id + (doc_content_id > 0 ? ('&dcid=' + doc_content_id) : ''),
            });
            this.get_detail();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            this.setData({
                is_user_login: parseInt(app.globalData.get_user_cache_info('id', 0) || 0) > 0,
            });

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 锁定内容返回后刷新
            if (this.doc_content_id > 0 && this.content_data && this.content_data.is_lock == 1) {
                this.get_content(this.doc_content_id);
            }
        },
        methods: {
            // 获取文档详情
            get_detail() {
                if (this.doc_id <= 0) {
                    this.setData({ detail_loading_status: 2, detail_loading_msg: this.$t('doc.params_error') });
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'doc'),
                    method: 'POST',
                    data: { id: this.doc_id, dcid: this.doc_content_id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var cid = data.doc_content_id || 0;
                            this.setData({
                                doc_data: data.data || null,
                                doc_list: data.doc_list || [],
                                menu_data: data.doc_menu_data || {},
                                menu_keywords: '',
                                menu_search_ids: [],
                                menu_expand_map: {},
                                doc_content_id: cid,
                                payment_list: data.payment_list || [],
                                payment_id: data.default_payment_id || 0,
                                default_payment_id: data.default_payment_id || 0,
                                is_access_enable: data.is_access_enable || 0,
                                doc_access_type: (data.data || {}).access_type || (data.doc_menu_data || {}).doc_access_type || 0,
                                navigation_list: data.navigation_list || [],
                                is_user_login: parseInt(app.globalData.get_user_cache_info('id', 0) || 0) > 0,
                                detail_loading_status: 0,
                            });
                            this.menu_expand_to_current();
                            this.h5_url_update();
                            if (cid > 0) {
                                this.get_content(cid);
                            } else {
                                this.setData({
                                    content_data: null,
                                    content_html: '',
                                    content_loading_status: 0,
                                    content_loading_msg: this.$t('common.no_relevant_data_tips'),
                                });
                                this.share_handle(null);
                            }
                        } else if (app.globalData.is_login_check(res.data, this, 'get_detail')) {
                            app.globalData.showToast(res.data.msg);
                            this.setData({ detail_loading_status: 2, detail_loading_msg: res.data.msg });
                        }
                    },
                    fail: () => {
                        this.setData({
                            detail_loading_status: 2,
                            detail_loading_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 获取文档内容
            get_content(id, callback, is_retry) {
                if (parseInt(id || 0) <= 0) {
                    this.setData({
                        content_data: null,
                        content_html: '',
                        content_loading_status: 0,
                        content_loading_msg: this.$t('common.no_relevant_data_tips'),
                    });
                    if (typeof callback == 'function') {
                        callback(null);
                    }
                    return;
                }
                if (!is_retry) {
                    this.setData({ content_loading_status: 1, content_data: null });
                }
                uni.request({
                    url: app.globalData.get_request_url('content', 'index', 'doc'),
                    method: 'POST',
                    data: { id: id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var content = data.data || {};
                            var plan = null;
                            if (content.access_plans && content.access_plans.length > 0) {
                                plan = content.access_plans[0];
                            }
                            var watermark = this.watermark_data_handle(content);
                            this.setData({
                                content_data: content,
                                content_html: content.content || '',
                                user_integral: data.user_integral || 0,
                                verify_url: data.verify_url || '',
                                currency_symbol: data.currency_symbol || this.currency_symbol,
                                selected_plan: plan,
                                payment_list: data.payment_list || this.payment_list,
                                payment_id: data.default_payment_id || this.payment_id,
                                default_payment_id: data.default_payment_id || this.default_payment_id,
                                is_access_enable: data.is_access_enable != null ? data.is_access_enable : this.is_access_enable,
                                is_user_login: parseInt(app.globalData.get_user_cache_info('id', 0) || 0) > 0,
                                watermark_tiles: watermark.tiles,
                                watermark_item_style: watermark.style,
                                content_loading_status: 0,
                            });
                            this.share_handle(content);
                            if (parseInt(content.is_lock || 0) != 1) {
                                this.menu_unlock_sync(content);
                            }
                            if (typeof callback == 'function') {
                                callback(content);
                            }
                        } else {
                            this.setData({ content_loading_status: 2, content_loading_msg: res.data.msg });
                            if (typeof callback == 'function') {
                                callback(null);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({ content_loading_status: 2, content_loading_msg: this.$t('common.internet_error_tips') });
                        if (typeof callback == 'function') {
                            callback(null);
                        }
                    },
                });
            },
            // 切换文档内容
            content_switch(id) {
                this.setData({ doc_content_id: id });
                this.h5_url_update();
                this.get_content(id);
            },
            // 切换文档内容事件
            content_switch_event(e) {
                var id = parseInt((e.currentTarget.dataset.id || 0));
                if (id > 0) {
                    this.content_switch(id);
                }
            },
            // 目录选择
            menu_select(item) {
                this.menu_popup_close();
                this.content_switch(item.id);
            },
            // 目录选择事件
            menu_select_event(e) {
                var id = parseInt((e.currentTarget.dataset.id || 0));
                if (id > 0) {
                    this.menu_popup_close();
                    this.content_switch(id);
                }
            },
            // 打开目录
            menu_popup_open() {
                if (!(this.menu_keywords || '').trim()) {
                    this.menu_expand_to_current();
                }
                this.setData({ menu_popup_status: true });
            },
            // 关闭目录
            menu_popup_close() { this.setData({ menu_popup_status: false }); },
            // 目录是否有子级
            menu_folder_has_child(folder) {
                if (!folder) {
                    return false;
                }
                return (folder.doc_list && folder.doc_list.length > 0) || (folder.items && folder.items.length > 0);
            },
            // 目录是否展开
            menu_is_expand(key) {
                return !!(this.menu_expand_map || {})[key];
            },
            // 目录展开收起
            menu_folder_toggle(key, has_child) {
                if (!has_child) {
                    return;
                }
                var map = Object.assign({}, this.menu_expand_map || {});
                map[key] = !map[key];
                this.setData({ menu_expand_map: map });
            },
            // 目录展开收起事件
            menu_folder_toggle_event(e) {
                var key = e.currentTarget.dataset.key || '';
                var has_child = parseInt(e.currentTarget.dataset.has || 0) == 1;
                this.menu_folder_toggle(key, has_child);
            },
            // 目录项是否显示
            menu_item_visible(item) {
                var keywords = (this.menu_keywords || '').trim();
                if (!keywords) {
                    return true;
                }
                if (!item) {
                    return false;
                }
                var id = parseInt(item.id || 0);
                if (id > 0 && (this.menu_search_ids || []).indexOf(id) != -1) {
                    return true;
                }
                var text = item.title || item.name || '';
                return text.indexOf(keywords) != -1;
            },
            // 目录分类是否显示
            menu_cat_visible(cat) {
                var keywords = (this.menu_keywords || '').trim();
                if (!keywords) {
                    return true;
                }
                if (this.menu_item_visible(cat)) {
                    return true;
                }
                var docs = cat.doc_list || [];
                for (var i = 0; i < docs.length; i++) {
                    if (this.menu_item_visible(docs[i])) {
                        return true;
                    }
                }
                var items = cat.items || [];
                for (var i = 0; i < items.length; i++) {
                    if (this.menu_cat_visible(items[i])) {
                        return true;
                    }
                }
                return false;
            },
            // 目录是否有可见数据
            menu_has_visible() {
                var menu = this.menu_data || {};
                var files = menu.file_list || [];
                for (var i = 0; i < files.length; i++) {
                    if (this.menu_item_visible(files[i])) {
                        return true;
                    }
                }
                var cats = menu.category_file_list || [];
                for (var i = 0; i < cats.length; i++) {
                    if (this.menu_cat_visible(cats[i])) {
                        return true;
                    }
                }
                return false;
            },
            // 展开当前内容所在目录
            menu_expand_to_current() {
                var cid = parseInt(this.doc_content_id || 0);
                var map = {};
                if (cid > 0) {
                    var cats = (this.menu_data || {}).category_file_list || [];
                    for (var i = 0; i < cats.length; i++) {
                        var cat = cats[i];
                        var in_cat = false;
                        var docs = cat.doc_list || [];
                        for (var d = 0; d < docs.length; d++) {
                            if (parseInt(docs[d].id) == cid) {
                                in_cat = true;
                                break;
                            }
                        }
                        var items = cat.items || [];
                        for (var s = 0; s < items.length; s++) {
                            var sub_docs = items[s].doc_list || [];
                            for (var sd = 0; sd < sub_docs.length; sd++) {
                                if (parseInt(sub_docs[sd].id) == cid) {
                                    map['s' + items[s].id] = true;
                                    in_cat = true;
                                    break;
                                }
                            }
                        }
                        if (in_cat) {
                            map['c' + cat.id] = true;
                        }
                    }
                }
                this.setData({ menu_expand_map: map });
            },
            // 搜索时展开命中目录
            menu_expand_for_search() {
                var map = {};
                var cats = (this.menu_data || {}).category_file_list || [];
                for (var i = 0; i < cats.length; i++) {
                    var cat = cats[i];
                    var cat_hit = false;
                    var docs = cat.doc_list || [];
                    for (var d = 0; d < docs.length; d++) {
                        if (this.menu_item_visible(docs[d])) {
                            cat_hit = true;
                            break;
                        }
                    }
                    var items = cat.items || [];
                    for (var s = 0; s < items.length; s++) {
                        var sub_hit = false;
                        var sub_docs = items[s].doc_list || [];
                        for (var sd = 0; sd < sub_docs.length; sd++) {
                            if (this.menu_item_visible(sub_docs[sd])) {
                                sub_hit = true;
                                break;
                            }
                        }
                        if (sub_hit || this.menu_item_visible(items[s])) {
                            map['s' + items[s].id] = true;
                            cat_hit = true;
                        }
                    }
                    if (cat_hit || this.menu_item_visible(cat)) {
                        map['c' + cat.id] = true;
                    }
                }
                this.setData({ menu_expand_map: map });
            },
            // 解析目录搜索结果id
            menu_search_ids_parse(data) {
                var ids = [];
                var list = data || [];
                for (var i = 0; i < list.length; i++) {
                    var id = parseInt((typeof list[i] == 'object' ? list[i].id : list[i]) || 0);
                    if (id > 0) {
                        ids.push(id);
                    }
                }
                return ids;
            },
            // 目录搜索
            menu_search_event(e) {
                var keywords = (e || '').trim();
                this.setData({
                    menu_keywords: keywords,
                    menu_search_ids: [],
                });
                if (keywords == '') {
                    this.menu_expand_to_current();
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('search', 'index', 'doc'),
                    method: 'POST',
                    data: { id: this.doc_id, keywords: keywords },
                    dataType: 'json',
                    success: (res) => {
                        var ids = [];
                        if (res.data.code == 0) {
                            ids = this.menu_search_ids_parse(res.data.data);
                        }
                        this.setData({ menu_search_ids: ids });
                        this.menu_expand_for_search();
                    },
                    fail: () => {
                        this.menu_expand_for_search();
                    },
                });
            },
            // 打开切换文档
            doc_popup_open() {
                if (this.doc_list.length > 1) {
                    this.setData({ doc_popup_status: true });
                }
            },
            // 关闭切换文档
            doc_popup_close() { this.setData({ doc_popup_status: false }); },
            // 打开更多导航
            nav_popup_open() {
                if ((this.navigation_list || []).length > 0) {
                    this.setData({ nav_popup_status: true });
                }
            },
            // 关闭更多导航
            nav_popup_close() { this.setData({ nav_popup_status: false }); },
            // 文档内导航
            navigation_event(e) {
                this.nav_popup_close();
                app.globalData.operation_event(e);
            },
            // 水印铺满数据
            watermark_data_handle(content) {
                var tiles = [];
                var style = '';
                content = content || {};
                if (parseInt(content.is_watermark || 0) == 1 && (content.watermark_text || '') != '') {
                    var size = parseInt(content.watermark_size || 16);
                    var gap_x = parseInt(content.watermark_gap_x || 180);
                    var gap_y = parseInt(content.watermark_gap_y || 120);
                    var sys = uni.getSystemInfoSync() || {};
                    var screen_w = parseInt(sys.windowWidth || 375);
                    var scale = screen_w / 720;
                    if (scale > 1) {
                        scale = 1;
                    }
                    if (scale < 0.45) {
                        scale = 0.45;
                    }
                    size = Math.round(size * scale);
                    gap_x = Math.round(gap_x * scale);
                    gap_y = Math.round(gap_y * scale);
                    if (size < 10) {
                        size = 10;
                    }
                    if (gap_x < 40) {
                        gap_x = 40;
                    }
                    if (gap_y < 30) {
                        gap_y = 30;
                    }
                    var cols = Math.ceil((screen_w * 1.2) / gap_x) + 1;
                    var rows = Math.ceil(((sys.windowHeight || 667) * 4) / gap_y) + 1;
                    var total = cols * rows;
                    if (total > 150) {
                        total = 150;
                    }
                    if (total < 30) {
                        total = 30;
                    }
                    for (var i = 0; i < total; i++) {
                        tiles.push({ id: i });
                    }
                    style = 'width:' + (gap_x * 2) + 'rpx;height:' + (gap_y * 2) + 'rpx;font-size:' + (size * 2) + 'rpx;line-height:' + (gap_y * 2) + 'rpx;';
                }
                return { tiles: tiles, style: style };
            },
            // 会员登录
            vip_login_event() {
                var user = app.globalData.get_user_info(this, 'vip_login_event');
                if (user != false) {
                    this.setData({ is_user_login: true });
                    if (this.doc_content_id > 0) {
                        this.get_content(this.doc_content_id);
                    }
                }
            },
            // 开通会员
            vip_buy_event() {
                var url = (this.content_data || {}).vip_buy_url || '';
                if (url.indexOf('/pages/') == -1) {
                    url = '/pages/plugins/vip/buy/buy';
                }
                app.globalData.url_open(url);
            },
            // 切换文档
            doc_switch(item) {
                this.doc_popup_close();
                if (!item || parseInt(item.id) == parseInt(this.doc_id)) {
                    return;
                }
                this.setData({
                    doc_id: parseInt(item.id),
                    doc_content_id: 0,
                    content_data: null,
                    content_html: '',
                    content_loading_status: 1,
                    pay_back_page: '/pages/plugins/doc/detail/detail?id=' + item.id,
                    share_info: {
                        title: item.name || '',
                        desc: item.describe || '',
                        path: '/pages/plugins/doc/detail/detail',
                        query: 'id=' + item.id,
                        img: item.cover || '',
                    },
                });
                this.h5_url_update();
                this.get_detail();
            },
            // 切换文档事件
            doc_switch_event(e) {
                var index = parseInt(e.currentTarget.dataset.index);
                this.doc_switch((this.doc_list || [])[index]);
            },
            // 是否显示阅读权限图标
            access_icon_visible(item) {
                if (!this.is_access_enable || !item) {
                    return false;
                }
                var lock = parseInt(item.is_lock || 0);
                var type = parseInt(item.access_type || 0);
                if (lock == 1) {
                    return true;
                }
                if (type > 0 && type != 4) {
                    return true;
                }
                var book_type = parseInt((item.doc_access_type != null ? item.doc_access_type : this.doc_access_type) || 0);
                return type <= 0 && book_type > 0 && book_type != 4;
            },
            // 解锁后同步目录锁定状态
            menu_unlock_sync(content) {
                content = content || this.content_data || {};
                if (!content || parseInt(content.is_lock || 0) == 1) {
                    return;
                }
                var is_doc = content.lock_scope == 'doc';
                var cid = parseInt(content.id || this.doc_content_id || 0);
                var menu = JSON.parse(JSON.stringify(this.menu_data || {}));
                var changed = false;
                var set_item = (item) => {
                    if (!item || !item.id) {
                        return;
                    }
                    var match = is_doc ? (parseInt(item.access_type || 0) <= 0) : (parseInt(item.id) == cid);
                    if (match && parseInt(item.is_lock || 0) == 1) {
                        item.is_lock = 0;
                        changed = true;
                    }
                };
                (menu.file_list || []).forEach(set_item);
                (menu.category_file_list || []).forEach((cat) => {
                    (cat.doc_list || []).forEach(set_item);
                    (cat.items || []).forEach((sub) => {
                        (sub.doc_list || []).forEach(set_item);
                    });
                });
                if (changed) {
                    this.setData({ menu_data: menu });
                }
            },
            // 选择阅读套餐
            plan_select(item) {
                this.setData({ selected_plan: item });
            },
            // 选择阅读套餐事件
            plan_select_event(e) {
                var index = parseInt(e.currentTarget.dataset.index);
                var list = (this.content_data || {}).access_plans || [];
                this.plan_select(list[index] || null);
            },
            // 打开支付
            pay_open() {
                var user = app.globalData.get_user_info(this, 'pay_open');
                if (user == false) return;
                var content = this.content_data || {};
                var plan = this.selected_plan || {};
                var price = plan.price != null ? plan.price : (content.access_price || 0);
                var cid = this.doc_content_id || content.id || 0;
                this.setData({
                    is_show_payment_popup: true,
                    temp_pay_value: content.lock_scope == 'doc' ? 0 : (content.id || 0),
                    pay_price: price,
                    payment_id: this.default_payment_id || this.payment_id || 0,
                    pay_ext_data: {
                        doc_id: content.doc_id || this.doc_id,
                        scope: content.lock_scope || 'content',
                        access_days: plan.days != null ? plan.days : 0,
                    },
                    pay_back_page: '/pages/plugins/doc/detail/detail?id=' + (content.doc_id || this.doc_id) + (cid > 0 ? ('&dcid=' + cid) : ''),
                });
            },
            // 支付弹窗关闭
            payment_popup_event_close() {
                this.setData({ is_show_payment_popup: false });
            },
            // 支付成功
            order_item_pay_success_handle() {
                this.setData({ is_show_payment_popup: false });
                this.reload_unlock_content(0);
            },
            // 解锁后刷新内容
            reload_unlock_content(retry) {
                retry = retry || 0;
                var cid = this.doc_content_id;
                if (cid <= 0) {
                    return;
                }
                this.get_content(cid, (content) => {
                    if (content && parseInt(content.is_lock || 0) == 1 && retry < 8) {
                        setTimeout(() => {
                            this.reload_unlock_content(retry + 1);
                        }, 600);
                    }
                }, retry > 0);
            },
            // 密码查看
            password_submit() {
                var content = this.content_data || {};
                this.setData({ submit_loading: true });
                uni.request({
                    url: app.globalData.get_request_url('password', 'access', 'doc'),
                    method: 'POST',
                    data: {
                        id: content.lock_scope == 'doc' ? 0 : content.id,
                        doc_id: content.doc_id,
                        scope: content.lock_scope || 'content',
                        access_pwd: this.access_pwd,
                        verify: this.verify_code,
                    },
                    dataType: 'json',
                    success: (res) => {
                        this.setData({ submit_loading: false });
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            this.reload_unlock_content(0);
                        } else {
                            var status = res.data.data || {};
                            if (status.need_captcha || status.is_locked) {
                                this.setData({ need_captcha: true });
                                this.refresh_verify();
                            }
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                });
            },
            // 刷新验证码
            refresh_verify() {
                var tv = app.globalData.get_timestamp();
                var url = app.globalData.get_request_url('verifyentry', 'access', 'doc', 't=' + tv);
                this.setData({
                    verify_url: url,
                    verify_img_url: url,
                });
            },
            // 积分查看
            integral_submit() {
                var user = app.globalData.get_user_info(this, 'integral_submit');
                if (user == false) return;
                if (this.submit_loading) return;
                var content = this.content_data || {};
                var plan = this.selected_plan || {};
                var integral = parseInt(plan.integral != null ? plan.integral : (content.access_integral || 0));
                var access_days = plan.days != null ? parseInt(plan.days) : 0;
                var days_name = plan.days_name || '';
                var msg = this.$t('doc.integral_confirm', { integral: integral });
                if (access_days > 0 && days_name != '') {
                    msg = this.$t('doc.integral_confirm_days', { integral: integral, days: days_name });
                }
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: msg,
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (res) => {
                        if (res.confirm) {
                            this.integral_submit_handle();
                        }
                    },
                });
            },
            // 积分查看提交
            integral_submit_handle() {
                var content = this.content_data || {};
                var plan = this.selected_plan || {};
                this.setData({ submit_loading: true });
                uni.request({
                    url: app.globalData.get_request_url('integral', 'access', 'doc'),
                    method: 'POST',
                    data: {
                        id: content.lock_scope == 'doc' ? 0 : content.id,
                        doc_id: content.doc_id,
                        scope: content.lock_scope || 'content',
                        access_days: plan.days != null ? plan.days : 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        this.setData({ submit_loading: false });
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            this.reload_unlock_content(0);
                        } else if (app.globalData.is_login_check(res.data, this, 'integral_submit')) {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        this.setData({ submit_loading: false });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 返回文档首页
            doc_home_event() {
                var prev_url = app.globalData.prev_page();
                if (prev_url != null && prev_url.indexOf('pages/plugins/doc/index/index') != -1) {
                    uni.navigateBack();
                } else {
                    app.globalData.url_open('/pages/plugins/doc/index/index');
                }
            },
            // 分享设置处理
            share_handle(content) {
                var doc = this.doc_data || {};
                content = content || this.content_data || {};
                var cid = parseInt(content.id || this.doc_content_id || 0);
                var query = 'id=' + this.doc_id + (cid > 0 ? ('&dcid=' + cid) : '');
                var share_info = {
                    title: content.seo_title || content.title || doc.name || '',
                    desc: content.seo_desc || doc.describe || '',
                    path: '/pages/plugins/doc/detail/detail',
                    query: query,
                    img: doc.cover || '',
                };
                this.setData({
                    share_info: share_info,
                    pay_back_page: '/pages/plugins/doc/detail/detail?' + query,
                });
                this.h5_url_update();
                app.globalData.page_share_handle(share_info);
            },
            // H5地址栏更新
            h5_url_update() {
                // #ifdef H5
                try {
                    var href = window.location.href || '';
                    var hash_idx = href.indexOf('#');
                    var cid = parseInt(this.doc_content_id || 0);
                    var next = href;
                    if (hash_idx >= 0) {
                        var base = href.slice(0, hash_idx);
                        var hash = href.slice(hash_idx + 1);
                        var q_idx = hash.indexOf('?');
                        var path = q_idx >= 0 ? hash.slice(0, q_idx) : hash;
                        var query = q_idx >= 0 ? hash.slice(q_idx + 1) : '';
                        var params = new URLSearchParams(query);
                        params.set('id', String(this.doc_id || ''));
                        if (cid > 0) {
                            params.set('dcid', String(cid));
                        } else {
                            params.delete('dcid');
                        }
                        var qs = params.toString();
                        next = base + '#' + path + (qs ? '?' + qs : '');
                    } else {
                        var url = new URL(href);
                        url.searchParams.set('id', String(this.doc_id || ''));
                        if (cid > 0) {
                            url.searchParams.set('dcid', String(cid));
                        } else {
                            url.searchParams.delete('dcid');
                        }
                        next = url.pathname + url.search + url.hash;
                    }
                    if (next && next !== href) {
                        window.history.replaceState(null, '', next);
                    }
                } catch (e) {}
                // #endif
            },
            // 打开分享弹窗
            popup_share_event() {
                this.share_handle(this.content_data);
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
            },
        },
    };
</script>
<style>
@import './detail.css';
</style>

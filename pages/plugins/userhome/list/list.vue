<template>
    <view :class="theme_view">
        <!-- 状态导航 -->
        <view v-if="nav_status_list.length > 0" class="nav-base bg-white scroll-view-horizontal">
            <scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-with-animation="true">
                <block v-for="(item, index) in nav_status_list" :key="index">
                    <view :class="'item dis-inline-block padding-left-xl padding-right-xl tc ' + (nav_status_index == index ? 'cr-main nav-active-line' : '')" :data-index="index" @tap="nav_event">{{ item.name }}</view>
                </block>
            </scroll-view>
        </view>
        <scroll-view :scroll-y="true" class="scroll-box scroll-box-ece-nav" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="page-bottom-fixed">
                <view v-if="data_list.length > 0" class="data-list padding-horizontal-main padding-top-main">
                    <view v-for="(item, index) in data_list" :key="item.id || index" class="item padding-main border-radius-main oh bg-white spacing-mb">
                        <view class="base oh br-b-dashed padding-bottom-main flex-row jc-sb align-c">
                            <text class="cr-grey-9">{{ item.add_time }}</text>
                            <text :class="item.audit_status == 2 ? 'cr-green' : (item.audit_status == 3 ? 'cr-red' : 'cr-yellow')">{{ item.audit_status_name }}</text>
                        </view>
                        <view
                            class="content margin-top-main cp"
                            :data-value="item.url || ''"
                            @tap="url_event"
                        >
                            <!-- 内容字段在 PC 为 module 展示话题，手机端 field_list 不含 module，这里单独展示正文+话题 -->
                            <view v-if="item.content" class="cr-base">{{ item.content }}</view>
                            <view v-if="(item.topic_list || []).length > 0" class="margin-top-xs" @tap.stop="">
                                <text
                                    v-for="(topic, ti) in item.topic_list"
                                    :key="topic.id || ti"
                                    class="cr-main margin-right-sm text-size-sm"
                                    :data-value="'/pages/plugins/userhome/topic/topic?id=' + (topic.id || 0)"
                                    @tap.stop="url_event"
                                >#{{ topic.name }}</text>
                            </view>
                            <component-panel-content
                                :propData="item"
                                :propDataField="field_list"
                                propIsItemShowMax="6"
                                propExcludeField="add_time,audit_status_name,content"
                                :propIsTerse="true"
                                @status="status_event"
                            ></component-panel-content>
                        </view>
                        <view
                            v-if="show_operate(item)"
                            class="item-operation tr margin-top-main"
                        >
                            <button
                                v-if="item.url && item.operate_data && item.operate_data.is_detail == 1"
                                class="btn round br-grey-9 bg-white text-size-md"
                                type="default"
                                size="mini"
                                :data-value="item.url"
                                @tap="url_event"
                                hover-class="none"
                            >{{$t('common.detail_text')}}</button>
                            <button
                                v-if="item.operate_data && item.operate_data.is_edit == 1"
                                class="btn round cr-main br-main bg-white text-size-md"
                                type="default"
                                size="mini"
                                :data-value="'/pages/plugins/userhome/moment-form/moment-form?id=' + item.id"
                                @tap="edit_event"
                                hover-class="none"
                            >{{$t('common.edit')}}</button>
                            <button
                                v-if="item.operate_data && item.operate_data.is_delete == 1"
                                class="btn round cr-red br-red bg-white text-size-md"
                                type="default"
                                size="mini"
                                :data-value="item.id"
                                :data-index="index"
                                @tap="delete_event"
                                hover-class="none"
                            >{{$t('common.del')}}</button>
                        </view>
                    </view>
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </view>
                <view v-else>
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </view>

                <view v-if="(data_base || null) != null && data_base.is_enable_moment == 1" class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude flex-row gap-10">
                        <button class="item round cr-white bg-main text-size wh-auto" type="default" hover-class="none" @tap="publish_event">{{$t('home.publish_moment')}}</button>
                    </view>
                </view>
            </view>
        </scroll-view>

        <component-moment-publish ref="publish" @success="publish_success_event"></component-moment-publish>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPanelContent from '@/pages/common/components/panel-content/panel-content';
    import componentMomentPublish from '@/pages/plugins/userhome/components/moment-publish/moment-publish';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
    const CACHE_LIST_REFRESH = 'cache_plugins_userhome_list_refresh';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_base: null,
                field_list: [],
                data_list: [],
                data_total: 0,
                data_page: 1,
                data_page_total: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
                bottom_fixed_style: '',
                nav_status_list: [],
                nav_status_index: 0,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPanelContent,
            componentMomentPublish,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 仅首次进入加载，避免 onShow 回来打乱分页
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 仅保存成功返回才处理：编辑替换单条，新增整表刷新
            var refresh = uni.getStorageSync(CACHE_LIST_REFRESH) || null;
            if (refresh) {
                uni.removeStorageSync(CACHE_LIST_REFRESH);
                if (refresh.type == 'edit' && parseInt(refresh.id || 0) > 0 && (this.data_list || []).length > 0) {
                    this.refresh_item(refresh.id);
                } else {
                    this.reload_list();
                }
            }
            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.reload_list();
        },
        methods: {
            // 初始化（导航 + 列表）
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('common.user_not_logged') || this.$t('common.no_relevant_data_tips'),
                    });
                    return;
                }
                this.get_data_base();
            },
            // 仅刷新列表（保留当前导航选中）
            reload_list() {
                this.setData({
                    data_page: 1,
                    data_list: [],
                    data_total: 0,
                    data_page_total: 0,
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                    data_is_loading: 0,
                });
                this.get_data_list(1);
            },
            // 编辑成功：拉详情替换当前条
            refresh_item(id) {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'moment', 'userhome'),
                    method: 'POST',
                    data: { id: id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && (res.data.data.data || null) != null) {
                            var item = res.data.data.data;
                            var list = this.data_list || [];
                            for (var i in list) {
                                if (parseInt(list[i]['id']) == parseInt(item.id)) {
                                    list[i] = item;
                                    break;
                                }
                            }
                            this.setData({
                                data_list: list,
                            });
                        }
                    },
                });
            },
            // 获取公共数据（导航）
            get_data_base() {
                uni.request({
                    url: app.globalData.get_request_url('center', 'moment', 'userhome'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                data_base: data.base || null,
                                nav_status_list: data.nav || [],
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                                data_page: 1,
                                data_list: [],
                                data_is_loading: 0,
                            });
                            this.get_data_list(1);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_base')) {
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
                    },
                });
            },
            // 状态切换
            nav_event(e) {
                this.setData({
                    nav_status_index: e.currentTarget.dataset.index || 0,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                    data_is_loading: 0,
                });
                this.get_data_list(1);
            },
            // 是否展示操作区
            show_operate(item) {
                if (!item || !item.operate_data) {
                    return false;
                }
                var op = item.operate_data;
                if (item.url && op.is_detail == 1) {
                    return true;
                }
                return op.is_edit == 1 || op.is_delete == 1;
            },
            // 获取列表（FormModuleData）
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }
                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                // 请求数据
                var data = {
                    page: this.data_page,
                };
                // 状态筛选
                var status = (this.nav_status_list[this.nav_status_index] || null) == null ? -1 : this.nav_status_list[this.nav_status_index]['id'];
                if (status != -1) {
                    data['audit_status'] = status;
                }
                uni.request({
                    url: app.globalData.get_request_url('index', 'moment', 'userhome'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data_list || [];
                            var temp_data_list = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            this.setData({
                                field_list: data.field_list || this.field_list || [],
                                data_list: temp_data_list,
                                data_total: data.data_total || data.total || 0,
                                data_page_total: data.page_total || 0,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: temp_data_list.length > 0 ? '' : this.$t('common.no_relevant_data_tips'),
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_is_loading: 0,
                                data_list_loding_status: this.data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: res.data.msg || '',
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data_list')) {
                                // 登录校验已处理
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_is_loading: 0,
                            data_list_loding_status: this.data_list.length > 0 ? 3 : 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },
            // 编辑
            edit_event(e) {
                app.globalData.url_event(e);
            },
            // 启用状态（与 PC form status 列一致）
            status_event(e) {
                var id = parseInt((e && e.id) || 0) || 0;
                var field = (e && e.field) || 'is_enable';
                var state = parseInt((e && e.state) || 0) == 1 ? 1 : 0;
                var old_state = parseInt((e && e.old_state) || 0) == 1 ? 1 : 0;
                var row = (e && e.data) || null;
                if (id <= 0) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('statusupdate', 'moment', 'userhome'),
                    method: 'POST',
                    data: {
                        id: id,
                        field: field,
                        state: state,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            uni.setStorageSync('cache_plugins_userhome_home_refresh', 1);
                            app.globalData.showToast(res.data.msg, 'success');
                        } else {
                            if (row) {
                                row[field] = old_state;
                                if (Object.prototype.hasOwnProperty.call(row, field + '_name')) {
                                    row[field + '_name'] = old_state == 1 ? (this.$t('common.yes_title') || '是') : (this.$t('common.no_title') || '否');
                                }
                                this.setData({
                                    data_list: this.data_list,
                                });
                            }
                            // is_login_check 为 true 表示非登录失效，需提示业务错误
                            if (app.globalData.is_login_check(res.data, this, 'status_event', e)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        if (row) {
                            row[field] = old_state;
                            if (Object.prototype.hasOwnProperty.call(row, field + '_name')) {
                                row[field + '_name'] = old_state == 1 ? (this.$t('common.yes_title') || '是') : (this.$t('common.no_title') || '否');
                            }
                            this.setData({
                                data_list: this.data_list,
                            });
                        }
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 删除
            delete_event(e) {
                var value = e.currentTarget.dataset.value;
                var index = e.currentTarget.dataset.index;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('moment.delete_confirm'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.no'),
                    success: (result) => {
                        if (!result.confirm) {
                            return;
                        }
                        uni.showLoading({
                            title: this.$t('common.processing_in_text'),
                        });
                        uni.request({
                            url: app.globalData.get_request_url('delete', 'moment', 'userhome'),
                            method: 'POST',
                            data: { ids: value },
                            dataType: 'json',
                            success: (res) => {
                                uni.hideLoading();
                                if (res.data.code == 0) {
                                    var temp_data_list = this.data_list;
                                    temp_data_list.splice(index, 1);
                                    this.setData({
                                        data_list: temp_data_list,
                                    });
                                    if (temp_data_list.length == 0) {
                                        this.setData({
                                            data_list_loding_status: 0,
                                            data_bottom_line_status: false,
                                            data_list_loding_msg: this.$t('common.no_relevant_data_tips'),
                                        });
                                    }
                                    uni.setStorageSync('cache_plugins_userhome_home_refresh', 1);
                                    app.globalData.showToast(res.data.msg, 'success');
                                } else {
                                    app.globalData.showToast(res.data.msg);
                                }
                            },
                            fail: () => {
                                uni.hideLoading();
                                app.globalData.showToast(this.$t('common.internet_error_tips'));
                            },
                        });
                    },
                });
            },
            // 发布成功（本页弹层，直接刷新列表）
            publish_success_event() {
                this.reload_list();
            },
            // 发布动态（事件总线，避免小程序 $refs 被异步组件拖垮）
            publish_event() {
                try {
                    if (this.$refs.publish && this.$refs.publish.open) {
                        this.$refs.publish.open();
                        return;
                    }
                } catch (e) {}
                uni.$emit('plugins_userhome_publish_open');
            },
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>

<template>
    <view :class="theme_view">
        <!-- 简洁的数据，一般列表展示使用 -->
        <view v-if="propIsTerse" class="terse-content margin-top cp">
            <block v-if="data != null && data_field.length > 0">
                <block v-for="(item, index) in data_field" :key="index">
                    <!-- <view>{{item.is_hide}}</view> -->
                    <view v-if="(item.is_hide || 0) == 0" class="item margin-top-xs" :class="propClass">
                        <text class="cr-grey margin-right-xl">{{ item.name }}</text>
                        <block v-if="item.type == 'images'">
                            <image v-if="(data[item.field] || null) != null" :src="data[item.field]" :data-value="data[item.field]" @tap.stop="images_show_event" mode="aspectFit" class="br-f5 radius panel-item-images"></image>
                        </block>
                        <block v-else-if="item.type == 'many_images'">
                            <view v-if="(data[item.field] || null) != null && data[item.field].length > 0" class="dis-inline-block va-m">
                                <view class="flex-row gap-5">
                                    <block v-for="(items, indexs) in data[item.field]" :key="indexs">
                                        <image :src="items" :data-value="items" :data-field="item.field" :data-index="indexs" @tap.stop="many_images_show_event" mode="aspectFit" class="br-f5 radius panel-item-images"></image>
                                    </block>
                                </view>
                            </view>
                        </block>
                        <block v-else-if="item.type == 'video'">
                            <view
                                v-if="(data[item.field] || null) != null && data[item.field] !== ''"
                                class="panel-video-thumb br-f5 radius dis-inline-block va-m"
                                :data-value="data[item.field]"
                                @tap.stop="video_preview_event"
                            >
                                <!-- 仅作首帧预览，不播、不展示控件 -->
                                <video
                                    class="panel-video-thumb-player"
                                    :src="data[item.field]"
                                    :controls="false"
                                    :show-center-play-btn="false"
                                    :show-play-btn="false"
                                    :show-fullscreen-btn="false"
                                    :enable-progress-gesture="false"
                                    object-fit="cover"
                                    muted
                                    preload="metadata"
                                ></video>
                                <view class="panel-video-play-icon flex-row align-c jc-c">
                                    <iconfont name="icon-bofang" size="24rpx" color="#fff"></iconfont>
                                </view>
                            </view>
                        </block>
                        <switch
                            v-else-if="item.type == 'status'"
                            class="panel-status-switch"
                            :class="status_switch_disabled(item) ? 'panel-status-switch-disabled' : ''"
                            style="transform: scale(0.7)"
                            :color="theme_color"
                            :checked="parseInt(data[item.field] || 0) == 1"
                            :disabled="status_switch_disabled(item)"
                            @tap.stop=""
                            @change.stop="status_change_event($event, item)"
                        ></switch>
                        <text v-else class="cr-base">{{ data[item.field] }}</text>
                        <view v-if="(item.is_copy || 0) == 1 && data[item.field] !== ''" class="dis-inline-block margin-left" data-event="copy" :data-value="data[item.field]" @tap.stop="text_event_handle">
                            <iconfont name="icon-copy" size="28rpx" class="cr-grey"></iconfont>
                        </view>
                    </view>
                </block>
                <view v-if="show_max > 0 && show_max < data_field.length" @tap.stop="item_more_event" class="margin-top-sm tc">
                    <text class="cr-grey-c margin-right-sm">{{ $t('common.view_more') }}</text>
                    <iconfont :name="'icon-arrow-' + (more_status ? 'top' : 'bottom')" size="28rpx" color="#ccc"></iconfont>
                </view>
            </block>
            <slot></slot>
        </view>
        <!-- 详情面板数据 -->
        <view v-else class="padding-horizontal-main padding-top-main">
            <view class="panel-item padding-main border-radius-main bg-white">
                <view v-if="(propTitle || null) != null" class="br-b padding-bottom-main fw-b text-size">{{ propTitle }}</view>
                <view class="panel-content oh">
                    <block v-if="data != null && data_field.length > 0">
                        <uni-table :emptyText="$t('common.no_data')">
                            <block v-for="(item, index) in data_field" :key="index">
                                <uni-tr v-if="(item.is_hide || 0) == 0">
                                    <uni-th width="90">{{ item.name }}</uni-th>
                                    <uni-td>
                                        <block v-if="item.type == 'images'">
                                            <image v-if="(data[item.field] || null) != null" :src="data[item.field]" :data-value="data[item.field]" @tap.stop="images_show_event" mode="aspectFit" class="panel-item-images"></image>
                                        </block>
                                        <block v-else-if="item.type == 'many_images'">
                                            <view v-if="(data[item.field] || null) != null && data[item.field].length > 0" class="dis-inline-block va-m">
                                                <view class="flex-row gap-5">
                                                    <block v-for="(items, indexs) in data[item.field]" :key="indexs">
                                                        <image :src="items" :data-value="items" :data-field="item.field" :data-index="indexs" @tap.stop="many_images_show_event" mode="aspectFit" class="br-f5 radius panel-item-images"></image>
                                                    </block>
                                                </view>
                                            </view>
                                        </block>
                                        <block v-else-if="item.type == 'video'">
                                            <view
                                                v-if="(data[item.field] || null) != null && data[item.field] !== ''"
                                                class="panel-video-thumb br-f5 radius dis-inline-block va-m"
                                                :data-value="data[item.field]"
                                                @tap.stop="video_preview_event"
                                            >
                                                <video
                                                    class="panel-video-thumb-player"
                                                    :src="data[item.field]"
                                                    :controls="false"
                                                    :show-center-play-btn="false"
                                                    :show-play-btn="false"
                                                    :show-fullscreen-btn="false"
                                                    :enable-progress-gesture="false"
                                                    object-fit="cover"
                                                    muted
                                                    preload="metadata"
                                                ></video>
                                                <view class="panel-video-play-icon flex-row align-c jc-c">
                                                    <iconfont name="icon-bofang" size="24rpx" color="#fff"></iconfont>
                                                </view>
                                            </view>
                                        </block>
                                        <block v-else-if="item.type == 'status'">
                                            <switch
                                                class="panel-status-switch"
                                                :class="status_switch_disabled(item) ? 'panel-status-switch-disabled' : ''"
                                                style="transform: scale(0.7)"
                                                :color="theme_color"
                                                :checked="parseInt(data[item.field] || 0) == 1"
                                                :disabled="status_switch_disabled(item)"
                                                @tap.stop=""
                                                @change.stop="status_change_event($event, item)"
                                            ></switch>
                                        </block>
                                        <block v-else>
                                            <text>{{ data[item.field] }}</text>
                                            <view v-if="(item.is_copy || 0) == 1 && data[item.field] !== ''" class="dis-inline-block margin-left" data-event="copy" :data-value="data[item.field]" @tap.stop="text_event_handle">
                                                <iconfont name="icon-copy" size="28rpx" class="cr-grey lh-il"></iconfont>
                                            </view>
                                        </block>
                                    </uni-td>
                                </uni-tr>
                            </block>
                        </uni-table>
                        <view v-if="show_max > 0 && show_max < data_field.length" @tap.stop="item_more_event" class="margin-top-sm tc">
                            <text class="cr-grey-c margin-right-sm">{{ $t('common.view_more') }}</text>
                            <iconfont :name="'icon-arrow-' + (more_status ? 'top' : 'bottom')" size="28rpx" color="#ccc"></iconfont>
                        </view>
                    </block>
                    <slot></slot>
                </view>
            </view>
        </view>

        <!-- 视频全屏播放 -->
        <view v-if="video_popup_status" class="panel-video-fs-mask" @tap.stop="video_popup_close_event">
            <view class="panel-video-fs-close flex-row align-c jc-c" @tap.stop="video_popup_close_event">
                <iconfont name="icon-close-line" size="32rpx" color="#fff"></iconfont>
            </view>
            <video
                v-if="video_popup_url"
                class="panel-video-fs-player"
                :src="video_popup_url"
                controls
                autoplay
                object-fit="contain"
                :show-center-play-btn="true"
                :show-fullscreen-btn="true"
                @tap.stop=""
            ></video>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data: null,
                data_field: [],
                more_status: false,
                show_max: 0,
                video_popup_status: false,
                video_popup_url: '',
            };
        },
        components: {
            componentNoData,
        },
        props: {
            // 标题
            propTitle: {
                type: String,
                default: '',
            },
            // 数据
            propData: {
                type: [Object, String],
                default: '',
            },
            // 数据字段
            propDataField: {
                type: [Array,String],
                default: '',
            },
            // 数据项最大展示数量（0则显示全部）
            propIsItemShowMax: {
                type: [Number,String],
                default: 0,
            },
            // 指定字段
            propAppointField: {
                type: String,
                default: '',
            },
            // 排除字段
            propExcludeField: {
                type: String,
                default: '',
            },
            // 无数据提示状态
            propNoDataStatus: {
                type: [Number, String],
                default: 3,
            },
            // 无数据提示内容
            propNoDataMsg: {
                type: [String],
                default: '',
            },
            // 是否简洁的模式展示
            propIsTerse: {
                type: Boolean,
                default: false,
            },
            // class
            propClass: {
                type: String,
                default: 'single-text'
            }
        },
        // 属性值改变监听
        watch: {
            // 数据改变
            propData(value, old_value) {
                this.data = value;
            },
        },
        // 页面被展示
        created: function (e) {
            this.setData({
                data: this.propData,
                show_max: parseInt(this.propIsItemShowMax || 0),
            });
            this.data_field_handle(this.propDataField);
        },
        methods: {
            // 数据字段处理
            data_field_handle(data) {
                if((data || null) != null && data.length > 0) {
                    var appoint = (this.propAppointField || null) == null ? [] : this.propAppointField.split(',');
                    var exclude = (this.propExcludeField || null) == null ? [] : this.propExcludeField.split(',');
                    var temp_data = [];
                    var index = 0;
                    for (var i in data) {
                        if ((exclude.length == 0 && appoint.length > 0 && appoint.indexOf(data[i]['field']) != -1) || (appoint.length == 0 && (exclude.length == 0 || exclude.indexOf(data[i]['field']) == -1))) {
                            data[i]['is_hide'] = this.more_status ? 0 : (parseInt(data[i]['is_hide'] || 0) == 0 ? ((this.show_max > 0 && index >= this.show_max) ? 1 : 0) : 1);
                            temp_data.push(data[i]);
                            index++;
                        }
                    }
                    this.setData({
                        data_field: temp_data,
                    });
                }
            },

            // 锁定或无状态操作权限时禁用开关
            status_switch_disabled(item) {
                if ((this.data || null) == null) {
                    return true;
                }
                if (parseInt(this.data.is_lock || 0) == 1) {
                    return true;
                }
                var op = this.data.operate_data || null;
                if (op != null && typeof op.is_status !== 'undefined' && parseInt(op.is_status) != 1) {
                    return true;
                }
                return false;
            },
            // 状态开关：用 field_list status 列下发的 post_url / request 自行请求
            status_change_event(e, item) {
                if (this.status_switch_disabled(item)) {
                    return;
                }
                var state = e.detail.value ? 1 : 0;
                var field = (item && item.field) || '';
                if (!field || (this.data || null) == null) {
                    return;
                }
                var old = parseInt(this.data[field] || 0) == 1 ? 1 : 0;
                this.$set(this.data, field, state);
                if (Object.prototype.hasOwnProperty.call(this.data, field + '_name')) {
                    this.$set(this.data, field + '_name', state == 1 ? (this.$t('common.yes_title') || '是') : (this.$t('common.no_title') || '否'));
                }
                this.status_request({
                    item: item,
                    field: field,
                    state: state,
                    old_state: old,
                });
            },
            // 状态更新请求（仅依赖后台返回配置）
            status_request(payload) {
                var item = (payload && payload.item) || null;
                var field = (payload && payload.field) || '';
                var state = parseInt((payload && payload.state) || 0) == 1 ? 1 : 0;
                var old_state = parseInt((payload && payload.old_state) || 0) == 1 ? 1 : 0;
                var revert = () => {
                    if ((this.data || null) == null || !field) {
                        return;
                    }
                    this.$set(this.data, field, old_state);
                    if (Object.prototype.hasOwnProperty.call(this.data, field + '_name')) {
                        this.$set(this.data, field + '_name', old_state == 1 ? (this.$t('common.yes_title') || '是') : (this.$t('common.no_title') || '否'));
                    }
                };
                var url = item && item.post_url ? item.post_url : '';
                var req = item && item.request ? item.request : null;
                var key_field = item && item.key_field ? item.key_field : '';
                var id = key_field && this.data ? this.data[key_field] : null;
                if (!url || !req || !req.id || !req.field || !req.state || !key_field || id === null || id === undefined || id === '') {
                    revert();
                    app.globalData.showToast(this.$t('common.data_error'));
                    return;
                }
                // 后台下发的绝对地址需补齐小程序公共参数（token/ajax 等），否则登录校验会回 HTML
                url = app.globalData.request_params_handle(url);
                if (url.indexOf('ajax=ajax') === -1) {
                    url += '&ajax=ajax';
                }
                var post = {};
                post[req.id] = id;
                post[req.field] = field;
                post[req.state] = state;
                uni.request({
                    url: url,
                    method: 'POST',
                    data: post,
                    dataType: 'json',
                    success: (res) => {
                        var data = res.data || null;
                        if (typeof data !== 'object' || data === null) {
                            revert();
                            app.globalData.showToast(this.$t('common.data_error'));
                            return;
                        }
                        if (data.code == 0) {
                            app.globalData.showToast(data.msg, 'success');
                        } else {
                            revert();
                            if (app.globalData.is_login_check(data, this, 'status_request', payload)) {
                                app.globalData.showToast(data.msg);
                            }
                        }
                    },
                    fail: () => {
                        revert();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 文本事件
            text_event_handle(e) {
                app.globalData.text_event_handle(e);
            },

            // 图片预览
            images_show_event(e) {
                app.globalData.image_show_event(e);
            },

            // 多图预览（支持左右切换）
            many_images_show_event(e) {
                var field = e.currentTarget.dataset.field || '';
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var urls = (this.data && field && (this.data[field] || null) != null) ? this.data[field] : [];
                if (!urls || urls.length <= 0) {
                    return;
                }
                uni.previewImage({
                    current: urls[index] || urls[0],
                    urls: urls,
                });
            },

            // 视频预览弹窗
            video_preview_event(e) {
                var url = (e.currentTarget.dataset.value || '').toString();
                if (!url) {
                    return;
                }
                this.setData({
                    video_popup_url: url,
                    video_popup_status: true,
                });
            },

            // 关闭视频弹窗
            video_popup_close_event() {
                this.setData({
                    video_popup_status: false,
                    video_popup_url: '',
                });
            },

            // 数据项更多事件
            item_more_event(e) {
                this.setData({
                    more_status: !this.more_status,
                });
                this.data_field_handle(this.data_field);
            }
        }
    };
</script>
<style scoped>
    .terse-content .item {
        min-height: 40rpx;
    }
    .panel-status-switch-disabled {
        opacity: 0.45;
    }
    .panel-item-images {
        width: 40rpx;
        height: 40rpx;
    }
    .panel-video-thumb {
        position: relative;
        width: 60rpx;
        height: 60rpx;
        overflow: hidden;
        background: #111;
        vertical-align: middle;
    }
    .panel-video-thumb-player {
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
    }
    .panel-video-play-icon {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.25);
    }
    .panel-video-fs-mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: #000;
    }
    .panel-video-fs-close {
        position: absolute;
        top: calc(env(safe-area-inset-top) + 24rpx);
        right: 24rpx;
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        z-index: 2;
    }
    .panel-video-fs-player {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #000;
    }
</style>

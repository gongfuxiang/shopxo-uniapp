<template>
    <view :class="theme_view + ' page-wrap'">
        <!-- 查询图 / 排序：接口返回后再展示结果页 -->
        <view v-if="query_image" class="query-panel bg-white">
            <view class="query-bar flex-row align-c jc-c">
                <view class="query-thumb is-active" :style="'border-color:' + theme_color + ';'">
                    <image :src="query_image" mode="aspectFill" class="thumb-img"></image>
                    <view class="thumb-arrow" :style="'border-top-color:' + theme_color + ';'"></view>
                </view>
                <view class="query-add flex-col align-c jc-c" @tap="choose_image_event">
                    <iconfont name="icon-camera" size="32rpx" color="#666"></iconfont>
                    <text class="text-size-xs cr-grey margin-top-xs">{{ $t('imagesearch.imagesearch.change_image') }}</text>
                </view>
            </view>
            <view class="result-hd flex-row align-c padding-horizontal-main padding-vertical-sm br-t">
                <view class="flex-row align-c flex-1">
                    <text class="text-size fw-b">{{ $t('imagesearch.imagesearch.similar_goods') }}</text>
                    <text v-if="data_total > 0" class="cr-grey text-size-sm margin-left-sm">{{ $t('imagesearch.imagesearch.total_prefix') }}{{ data_total }}{{ $t('imagesearch.imagesearch.total_suffix') }}</text>
                </view>
                <text class="result-clear cr-red text-size-sm" @tap="clear_result_event">{{ $t('common.clear') }}</text>
            </view>
        </view>

        <view v-if="query_image" class="nav-sort oh pr bg-white">
            <view class="nav-sort-content">
                <block v-for="(item, index) in search_nav_sort_list" :key="index">
                    <view class="item tc fl cp" :data-index="index" @tap="nav_sort_event">
                        <text class="cr-base va-m text-size-sm">{{ item.name }}</text>
                        <image v-if="(item.icon || null) != null" class="icon va-m" :src="common_static_url + 'sort-' + item.icon + '-icon.png'" mode="aspectFill"></image>
                    </view>
                </block>
            </view>
            <image class="show-type-submit pa cp" :src="common_static_url + 'show-' + (data_show_type_value == 0 ? 'list' : 'grid') + '-icon.png'" mode="aspectFill" @tap="data_show_type_event"></image>
        </view>

        <!-- 初始引导：不用 scroll-view，避免无故出现滚动条 -->
        <view v-if="!query_image" class="boot-wrap">
            <view class="boot-card bg-white border-radius-main padding-main tc pr">
                <view class="boot-icon flex-row align-c jc-c bg-main-light margin-bottom" @tap="choose_image_event">
                    <iconfont name="icon-camera" size="56rpx" propClass="cr-main"></iconfont>
                </view>
                <view class="text-size-lg fw-b">{{ $t('imagesearch.imagesearch.boot_title') }}</view>
                <view class="cr-grey text-size-sm margin-top-sm">{{ $t('imagesearch.imagesearch.boot_desc') }}</view>
                <button type="default" class="boot-btn bg-main cr-white round margin-top-xl" @tap="choose_image_event">{{ $t('imagesearch.imagesearch.upload_search') }}</button>
                <view class="boot-steps flex-row flex-wrap align-c jc-c">
                    <view class="boot-step flex-row align-c">
                        <text class="boot-step-num">1</text>
                        <text class="boot-step-text">{{ $t('imagesearch.imagesearch.boot_step1') }}</text>
                    </view>
                    <view class="boot-step flex-row align-c">
                        <text class="boot-step-num">2</text>
                        <text class="boot-step-text">{{ $t('imagesearch.imagesearch.boot_step2') }}</text>
                    </view>
                    <view class="boot-step flex-row align-c">
                        <text class="boot-step-num">3</text>
                        <text class="boot-step-text">{{ $t('imagesearch.imagesearch.boot_step3') }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 结果列表 -->
        <scroll-view v-else :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60">
            <view class="goods-panel">
                <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main oh">
                    <component-goods-list
                        :propData="{ style_type: data_show_type_value == 0 ? 1 : 0, goods_list: data_list, random: random_value }"
                        :propCurrencySymbol="currency_symbol"
                        :propIsCartParaCurve="true"
                    ></component-goods-list>
                </view>
                <view v-else>
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propLoadingLogoTop="30%"></component-no-data>
                </view>
            </view>

            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </scroll-view>

        <!-- 选图确认 + 识别动画（对齐 PC） -->
        <view v-if="confirm_popup_show" class="confirm-popup">
            <view class="confirm-mask"></view>
            <view class="confirm-dialog">
                <view class="confirm-hd flex-row align-c">
                    <text class="confirm-title flex-1">{{ confirm_mode === 'recognizing' ? $t('imagesearch.imagesearch.recognizing_title') : $t('imagesearch.imagesearch.confirm_title') }}</text>
                    <text class="confirm-close" @tap="confirm_popup_close_event">×</text>
                </view>
                <view class="confirm-bd">
                    <view
                        :class="'confirm-preview' + (confirm_mode === 'recognizing' ? ' is-scanning' : '')"
                        @tap="choose_image_event"
                    >
                        <image :src="confirm_image" mode="aspectFit" class="confirm-preview-img"></image>
                        <view v-if="confirm_mode === 'recognizing'" class="scan-overlay">
                            <view class="scan-mask"></view>
                            <view class="scan-dots">
                                <view
                                    v-for="(dot, idx) in scan_dots"
                                    :key="idx"
                                    :class="'scan-dot scan-dot-' + (idx % 3)"
                                    :style="dot.style"
                                ></view>
                            </view>
                        </view>
                    </view>
                    <button
                        type="default"
                        class="confirm-btn round"
                        :class="confirm_mode === 'recognizing' ? 'is-disabled' : 'bg-main cr-white'"
                        :disabled="confirm_mode === 'recognizing'"
                        @tap="confirm_search_event"
                    >
                        <view v-if="confirm_mode === 'recognizing'" class="confirm-btn-spinner"></view>
                        <text>{{ confirm_mode === 'recognizing' ? $t('imagesearch.imagesearch.recognizing_btn') : $t('common.search') }}</text>
                    </button>
                </view>
            </view>
        </view>

        <component-common ref="common" :propIsFooterSeat="false"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    const RECOGNIZE_MIN_MS = 1200;
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';

    // 识别点位（独立闪烁节奏，对齐 PC）
    function build_scan_dots() {
        var pos = [
            [12, 18, 10, 1.15, -0.23], [22, 12, 8, 1.82, -1.41], [34, 20, 10, 0.96, -0.07],
            [46, 14, 9, 2.14, -1.88], [58, 22, 10, 1.37, -0.64], [70, 16, 7, 1.68, -0.19],
            [82, 24, 10, 1.05, -0.91], [90, 32, 8, 1.93, -1.22], [8, 30, 9, 1.44, -0.38],
            [18, 38, 10, 0.88, -0.55], [28, 28, 7, 2.05, -1.67], [40, 34, 10, 1.26, -0.02],
            [52, 28, 11, 1.71, -1.09], [64, 36, 10, 1.12, -0.74], [76, 30, 8, 1.98, -0.31],
            [86, 42, 10, 0.93, -0.48], [14, 48, 10, 1.58, -1.33], [26, 52, 8, 1.21, -0.86],
            [38, 44, 10, 2.22, -0.15], [50, 50, 12, 1.09, -0.97], [62, 46, 10, 1.76, -1.54],
            [74, 54, 7, 1.33, -0.41], [88, 56, 10, 0.99, -0.68], [10, 62, 9, 1.87, -1.16],
            [22, 68, 10, 1.41, -0.27], [34, 60, 8, 2.08, -1.79], [46, 66, 10, 1.03, -0.53],
            [58, 62, 11, 1.64, -0.11], [70, 68, 10, 1.29, -1.02], [82, 64, 7, 1.95, -0.79],
            [16, 78, 10, 0.91, -0.36], [30, 74, 8, 1.52, -1.28], [42, 80, 10, 2.17, -0.61],
            [54, 76, 9, 1.18, -1.45], [66, 82, 10, 1.73, -0.04], [78, 78, 8, 1.07, -0.83],
            [90, 72, 10, 1.86, -1.61], [6, 42, 7, 1.35, -0.49], [94, 44, 10, 0.94, -0.21],
            [48, 38, 6, 2.01, -1.12], [36, 70, 10, 1.47, -0.72], [60, 18, 8, 1.24, -1.35],
            [72, 44, 10, 1.69, -0.58], [24, 84, 7, 1.01, -0.93], [56, 86, 10, 1.91, -0.26],
            [84, 18, 8, 1.39, -1.48], [40, 56, 10, 0.97, -0.44], [68, 58, 9, 2.11, -1.06],
        ];
        return pos.map(function (p) {
            return {
                style:
                    'left:' + p[0] + '%;top:' + p[1] + '%;width:' + p[2] + 'rpx;height:' + p[2] + 'rpx;' +
                    'animation-duration:' + p[3] + 's;animation-delay:' + p[4] + 's;',
            };
        });
    }

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                common_static_url: app.globalData.get_static_url('common'),
                currency_symbol: app.globalData.currency_symbol(),
                // 结果页展示的查询图（本地临时路径）
                query_image: '',
                // 待上传/识图的本地临时文件路径
                local_image_path: '',
                // 识图成功后服务端返回的图片指纹，翻页/排序复用
                image_hash: '',
                // 选图确认弹窗
                confirm_popup_show: false,
                confirm_mode: 'confirm',
                confirm_image: '',
                scan_dots: build_scan_dots(),
                data_list: [],
                data_total: 0,
                data_page: 1,
                data_page_total: 0,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                // 增加随机数，避免无法监听数据列表内部数据更新
                random_value: 0,
                // 数据展示样式（0九方格、1图文）
                data_show_type_value: 0,
                // 排序导航
                search_nav_sort_index: 0,
                search_nav_sort_list: [
                    { name: this.$t('goods-category.goods-category.x69aow'), field: 'default', sort: 'asc', icon: null, ov: '' },
                    { name: this.$t('goods-category.goods-category.at5p35'), field: 'sales', sort: 'desc', icon: 'default', ov: 'sales' },
                    { name: this.$t('goods-category.goods-category.283ot0'), field: 'access', sort: 'desc', icon: 'default', ov: 'access' },
                    { name: this.$t('goods-category.goods-category.g2u3lf'), field: 'price', sort: 'desc', icon: 'default', ov: 'price' },
                    { name: this.$t('goods-category.goods-category.5p4ksj'), field: 'new', sort: 'desc', icon: 'default', ov: 'new' },
                ],
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

            // 公共 onshow 事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        onUnload() {
            this.abort_recognize();
        },

        // 下拉刷新
        onPullDownRefresh() {
            if (!this.query_image || !this.image_hash) {
                uni.stopPullDownRefresh();
                return;
            }
            this.setData({
                data_page: 1,
                data_list: [],
                data_list_loding_status: 1,
                data_bottom_line_status: false,
            });
            this.get_data_list(1);
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        theme_color: app.globalData.get_theme_color(),
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                        data_show_type_value: parseInt(app.globalData.get_config('config.home_search_goods_show_type', 0)),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 选择/更换图片 → 弹窗确认
            choose_image_event() {
                if (this.confirm_mode === 'recognizing') {
                    return;
                }
                var self = this;
                uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                    success(res) {
                        var path = (res.tempFilePaths || [])[0] || '';
                        if (!path) {
                            return;
                        }
                        self.open_confirm_popup(path);
                    },
                });
            },

            // 打开确认弹窗
            open_confirm_popup(path) {
                this.abort_recognize();
                this.setData({
                    confirm_popup_show: true,
                    confirm_mode: 'confirm',
                    confirm_image: path,
                });
            },

            // 关闭确认弹窗（识别中也可关闭并中止）
            confirm_popup_close_event() {
                this.abort_recognize();
                this.setData({
                    confirm_popup_show: false,
                    confirm_mode: 'confirm',
                    confirm_image: '',
                    data_is_loading: 0,
                });
            },

            // 确认搜索 → 弹窗内识别
            confirm_search_event() {
                if (this.confirm_mode === 'recognizing' || !this.confirm_image) {
                    return;
                }
                this.abort_recognize();
                this._recognize_started_at = Date.now();
                this.setData({
                    confirm_mode: 'recognizing',
                    local_image_path: this.confirm_image,
                    image_hash: '',
                    data_page: 1,
                    data_is_loading: 0,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            // 中止识别请求/定时器（递增序号，丢弃迟到回调）
            abort_recognize() {
                this._search_seq = (this._search_seq || 0) + 1;
                if (this._recognize_timer) {
                    clearTimeout(this._recognize_timer);
                    this._recognize_timer = null;
                }
                if (this._upload_task && typeof this._upload_task.abort === 'function') {
                    try {
                        this._upload_task.abort();
                    } catch (e) {}
                }
                this._upload_task = null;
                if (this._request_task && typeof this._request_task.abort === 'function') {
                    try {
                        this._request_task.abort();
                    } catch (e) {}
                }
                this._request_task = null;
                this._recognize_finished = false;
                // abort 后旧 fail 回调会被 seq 丢弃，这里主动释放 loading，避免卡死
                this.data_is_loading = 0;
                this.hide_system_loading();
            },

            // 清除查询结果，回到引导页
            clear_result_event() {
                this.abort_recognize();
                this.setData({
                    query_image: '',
                    local_image_path: '',
                    image_hash: '',
                    confirm_popup_show: false,
                    confirm_mode: 'confirm',
                    confirm_image: '',
                    data_list: [],
                    data_total: 0,
                    data_page: 1,
                    data_page_total: 0,
                    data_list_loding_status: 0,
                    data_list_loding_msg: '',
                    data_bottom_line_status: false,
                    data_is_loading: 0,
                });
            },

            // 当前排序参数（ov）
            current_ov() {
                var item = this.search_nav_sort_list[this.search_nav_sort_index] || {};
                if (!item.ov) {
                    return '';
                }
                return item.ov + '-' + (item.sort || 'desc');
            },

            // 关闭系统 loading
            hide_system_loading() {
                try {
                    uni.hideLoading();
                } catch (e) {}
            },

            // 识别结束统一收口（最短展示动画时长）
            finish_recognize(callback) {
                var self = this;
                var wait = Math.max(0, RECOGNIZE_MIN_MS - (Date.now() - (this._recognize_started_at || Date.now())));
                if (this._recognize_timer) {
                    clearTimeout(this._recognize_timer);
                }
                this._recognize_timer = setTimeout(function () {
                    self._recognize_timer = null;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, wait);
            },

            // 处理搜索接口返回（seq 不匹配则丢弃，避免中止后迟到回调）
            apply_search_result(res, seq) {
                if (seq != null && seq !== this._search_seq) {
                    return;
                }
                uni.stopPullDownRefresh();
                this.hide_system_loading();
                var was_recognize = this.confirm_mode === 'recognizing';
                var self = this;

                var done = function () {
                    if (seq != null && seq !== self._search_seq) {
                        return;
                    }
                    if (!res || !res.data) {
                        self.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: self.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                            confirm_mode: was_recognize ? 'confirm' : self.confirm_mode,
                        });
                        if (was_recognize) {
                            app.globalData.showToast(self.$t('common.internet_error_tips'));
                        }
                        return;
                    }
                    // hash 缓存过期：本地仍有图则自动重传
                    if (res.data.code == -1001 && self.local_image_path) {
                        self.setData({
                            image_hash: '',
                            data_is_loading: 0,
                        });
                        self.get_data_list(1);
                        return;
                    }
                    if (res.data.code == 0) {
                        var data = res.data.data || {};
                        var list = data.data || [];
                        var temp_data_list = self.data_page <= 1 ? list : (self.data_list || []).concat(list);
                        var patch = {
                            data_list: temp_data_list,
                            random_value: Math.random(),
                            data_total: parseInt(data.total || 0) || 0,
                            data_page_total: parseInt(data.page_total || 0) || 0,
                            data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                            data_list_loding_msg: temp_data_list.length > 0 ? '' : self.$t('imagesearch.imagesearch.empty_tips'),
                            data_page: self.data_page + 1,
                            data_is_loading: 0,
                            image_hash: data.image_hash || self.image_hash || '',
                        };
                        // 识图成功后再进入/更新结果页，并关闭确认弹窗
                        if (was_recognize && self.local_image_path) {
                            patch.query_image = self.local_image_path;
                            patch.confirm_popup_show = false;
                            patch.confirm_mode = 'confirm';
                        }
                        self.setData(patch);
                        self.setData({
                            data_bottom_line_status: self.data_list.length > 0 && self.data_page > 1 && self.data_page > self.data_page_total,
                        });
                    } else {
                        self.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: res.data.msg || self.$t('common.error_abnormal'),
                            data_is_loading: 0,
                            confirm_mode: was_recognize ? 'confirm' : self.confirm_mode,
                        });
                        if (self.data_page <= 1 && !was_recognize) {
                            self.setData({
                                data_list: [],
                                data_total: 0,
                            });
                        }
                        if (was_recognize) {
                            app.globalData.showToast(res.data.msg || self.$t('common.error_abnormal'));
                        }
                    }
                };

                if (was_recognize) {
                    this.finish_recognize(done);
                } else {
                    done();
                }
            },

            // 获取商品列表（上传识图或 image_hash 翻页/排序）
            get_data_list(is_mandatory) {
                if (!this.local_image_path && !this.image_hash) {
                    uni.stopPullDownRefresh();
                    return;
                }
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status == true) {
                    uni.stopPullDownRefresh();
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({
                    data_is_loading: 1,
                });

                var form_data = {
                    page: String(this.data_page || 1),
                };
                var ov = this.current_ov();
                if (ov) {
                    form_data.ov = ov;
                }

                var self = this;
                var search_url = app.globalData.get_request_url('search', 'index', 'imagesearch');
                var is_upload = !this.image_hash && !!this.local_image_path;
                this._search_seq = (this._search_seq || 0) + 1;
                var seq = this._search_seq;

                // 结果页排序/翻页：系统加载；上传识图：弹窗内动画
                if (!is_upload && (this.data_page || 1) > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }

                // 已有 hash：翻页/排序只带 hash，不重复传文件、不落盘
                if (this.image_hash) {
                    form_data.image_hash = this.image_hash;
                    this._request_task = uni.request({
                        url: search_url,
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            if (seq !== self._search_seq) {
                                return;
                            }
                            self._request_task = null;
                            self.apply_search_result(res, seq);
                        },
                        fail: () => {
                            if (seq !== self._search_seq) {
                                return;
                            }
                            self._request_task = null;
                            uni.stopPullDownRefresh();
                            self.hide_system_loading();
                            self.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: self.$t('common.internet_error_tips'),
                                data_is_loading: 0,
                            });
                        },
                    });
                    return;
                }

                // 上传图片识图（弹窗内识别）
                this._upload_task = uni.uploadFile({
                    url: search_url,
                    filePath: this.local_image_path,
                    name: 'file',
                    formData: form_data,
                    success(up) {
                        if (seq !== self._search_seq) {
                            return;
                        }
                        self._upload_task = null;
                        var data = null;
                        try {
                            data = typeof up.data == 'object' ? up.data : JSON.parse(up.data || '{}');
                        } catch (e) {
                            data = null;
                        }
                        self.apply_search_result({ data: data }, seq);
                    },
                    fail(err) {
                        if (seq !== self._search_seq) {
                            return;
                        }
                        self._upload_task = null;
                        // 主动 abort 不提示
                        if (err && (err.errMsg || '').indexOf('abort') >= 0) {
                            self.setData({
                                data_is_loading: 0,
                                confirm_mode: 'confirm',
                            });
                            return;
                        }
                        uni.stopPullDownRefresh();
                        self.hide_system_loading();
                        self.finish_recognize(function () {
                            if (seq !== self._search_seq) {
                                return;
                            }
                            self.setData({
                                data_is_loading: 0,
                                confirm_mode: 'confirm',
                            });
                            app.globalData.showToast(self.$t('common.internet_error_tips'));
                        });
                    },
                });
            },

            // 滚动加载
            scroll_lower() {
                this.get_data_list();
            },

            // 排序事件
            nav_sort_event(e) {
                if (this.confirm_mode === 'recognizing' || this.data_is_loading == 1) {
                    return;
                }
                var index = e.currentTarget.dataset.index || 0;
                var temp_search_nav_sort = this.search_nav_sort_list;
                var temp_sort = temp_search_nav_sort[index]['sort'] == 'desc' ? 'asc' : 'desc';
                for (var i in temp_search_nav_sort) {
                    if (i != index) {
                        if (temp_search_nav_sort[i]['icon'] != null) {
                            temp_search_nav_sort[i]['icon'] = 'default';
                        }
                        temp_search_nav_sort[i]['sort'] = 'desc';
                    }
                }
                temp_search_nav_sort[index]['sort'] = temp_sort;
                if (temp_search_nav_sort[index]['icon'] != null) {
                    temp_search_nav_sort[index]['icon'] = temp_sort;
                }
                // 与系统搜索一致：清空列表 + no-data 加载态
                this.setData({
                    search_nav_sort_index: index,
                    search_nav_sort_list: temp_search_nav_sort,
                    data_page: 1,
                    data_list: [],
                    data_list_loding_status: 1,
                    data_bottom_line_status: false,
                });
                this.get_data_list(1);
            },

            // 数据展示样式事件（列表/九宫格）
            data_show_type_event() {
                this.setData({
                    data_show_type_value: this.data_show_type_value == 0 ? 1 : 0,
                    random_value: Math.random(),
                });
            },
        },
    };
</script>
<style>
    @import './index.css';
</style>

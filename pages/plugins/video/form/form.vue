<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status !== 1">
            <form @submit="form_submit" class="form-container">
                <view class="page-bottom-fixed padding-main">
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('common.title')}}<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="title" :value="data.title || ''" maxlength="60" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" :placeholder="$t('common.please_input')" />
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('common.category')}}<text class="form-group-tips-must">*</text></view>
                                <view class="flex-1 flex-width tr" @tap="popupOpen">
                                    <text :class="data.category_name ? 'cr-black' : 'cr-grey-9'">{{ data.category_name || $t('form.select') }}</text>
                                    <view class="pr top-sm margin-left-sm dis-inline-block">
                                        <iconfont name="icon-arrow-right" color="#999" size="28rpx"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('common.enabled')}}</view>
                                <view class="flex-1 flex-width tr">
                                    <switch :color="theme_color" :checked="(data.is_enable || 0) == 1 ? true : false" @change="is_enable_event" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="form-gorup-title padding-right-main">{{$t('form.video_file')}}<text class="form-group-tips-must">*</text></view>
                            <view class="margin-top-main">
                                <view v-if="data.video_url" class="video-preview pr border-radius-main oh">
                                    <video :src="data.video_url" class="wh-auto" :controls="true" object-fit="contain"></video>
                                    <view class="delete-icon pa z-i" @tap="clear_video_event">
                                        <iconfont name="icon-close-fillup" size="36rpx" color="rgba(87,91,102,0.65)"></iconfont>
                                    </view>
                                </view>
                                <view v-else class="upload-box bg-grey-f5 border-radius-main flex-col align-c jc-c" @tap="choose_video_event">
                                    <iconfont name="icon-video" size="52rpx" color="#999"></iconfont>
                                    <text class="text-size-xs cr-grey-9 margin-top-sm">{{$t('form.upload_video')}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="form-gorup-title padding-right-main">{{$t('form.cover_photo')}}<text class="form-group-tips-must">*</text></view>
                            <view class="margin-top-main">
                                <component-upload :propData="image_list" :propMaxNum="1" :propPathType="editor_path_type" @call-back="retrun_image_event"></component-upload>
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c">
                                <view class="form-gorup-title padding-right-main">{{$t('form.duration')}}<text class="form-group-tips-must">*</text></view>
                                <input type="digit" name="duration" :value="data.duration || ''" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width tr" :placeholder="$t('form.duration_placeholder')" />
                            </view>
                        </view>
                    </view>
                    <view class="bg-white border-radius-main pr oh spacing-mb">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{$t('form.related_goods')}}</view>
                            <view v-if="(data.goods || null) != null" class="margin-top-lg view-goods-list">
                                <view class="item flex-row pr">
                                    <view :data-value="data.goods.goods_url || '/pages/goods-detail/goods-detail?id=' + data.goods.id" @tap="url_event" class="cp br radius oh goods-cover">
                                        <image :src="data.goods.images" mode="aspectFit" class="goods-cover-img"></image>
                                    </view>
                                    <view class="base flex-1 flex-width padding-left-main pr">
                                        <view class="cr-base single-text">{{ data.goods.title }}</view>
                                        <view class="margin-top-xs sales-price">{{ currency_symbol }}{{ data.goods.price }}</view>
                                        <text class="br-red cr-red text-size-xs padding-horizontal-main padding-top-xs padding-bottom-xs round pa cp operate-submit" @tap="goods_remove_event">{{$t('common.remove')}}</text>
                                    </view>
                                </view>
                            </view>
                            <view class="margin-top-sm padding-vertical-main">
                                <text class="br-dashed-grey cr-base text-size-sm padding-horizontal-main padding-top-xs padding-bottom-xs round cp" @tap="goods_add_event">{{$t('form.select_goods')}}</text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item cr-white bg-main round text-size wh-auto" type="default" form-type="submit" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading">{{$t('common.submit')}}</button>
                    </view>
                </view>
                <component-popup :propShow="popup_status" propPosition="bottom" @onclose="popup_close_event">
                    <view class="p-title flex-row jc-sb align-c padding-main br-b-e">
                        <view class="text-size-lg fw-b">{{$t('form.video_category')}}</view>
                        <view class="popup-colse" @tap="popup_close_event">
                            <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                        </view>
                    </view>
                    <view class="p-content padding-main">
                        <view v-for="(item, index) in category_list" :key="index">
                            <view class="padding-vertical-main flex-row jc-sb align-c" :class="data.category_id == item.id ? 'cr-main' : ''" :data-value="item.name" :data-id="item.id" @tap="get_type_event">
                                {{ item.name }}
                                <iconfont v-if="data.category_id == item.id" name="icon-checked" color="#333" size="28rpx"></iconfont>
                            </view>
                        </view>
                    </view>
                </component-popup>
                <!-- 商品选择弹窗 -->
                <component-popup :propShow="popup_goods_choice_status" propPosition="bottom" @onclose="popup_goods_choice_close_event">
                    <view class="padding-top-main bg-white">
                        <view class="padding-horizontal-main">
                            <view class="close oh">
                                <view class="fr" @tap.stop="popup_goods_choice_close_event">
                                    <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view class="popup-goods-choice-container">
                            <view class="nav-search oh br-b margin-top-sm padding-horizontal-main">
                                <picker class="item br round fl padding-horizontal-main" @change="popup_goods_category_event" :value="popup_goods_cetagory_index" :range="goods_category_list" range-key="name">
                                    <view :class="'picker text-size-xs ' + (popup_goods_cetagory_index == 0 ? 'cr-grey' : 'cr-base') + ' arrow-bottom'">
                                        {{ popup_goods_cetagory_index == 0 ? $t('common.recommend_form_category') : goods_category_list[popup_goods_cetagory_index]['name'] }}
                                    </view>
                                </picker>
                                <input type="search" :value="popup_keywords_value" placeholder-class="cr-grey text-size-xs" class="cr-base item br round fl padding-horizontal-main margin-left-main" :placeholder="$t('common.enter_product_name_search')" @input="popup_keywords_value_event" @confirm="popup_goods_search_event" />
                                <button type="default" size="mini" class="bg-main br-main cr-white text-size-xs round fr" @tap="popup_goods_search_event">{{$t('common.search')}}</button>
                            </view>
                            <scroll-view :scroll-y="true" class="view-goods-list padding-horizontal-main">
                                <block v-if="popup_search_goods_list.length > 0">
                                    <block v-for="(item, index) in popup_search_goods_list" :key="index">
                                        <view :class="'item flex-row pr margin-top-lg ' + (index > 0 ? 'br-t-dashed padding-top-lg' : '')">
                                            <view :data-value="item.goods_url || '/pages/goods-detail/goods-detail?id=' + item.id" @tap="url_event" class="cp br radius oh goods-cover">
                                                <image :src="item.images" mode="aspectFit" class="goods-cover-img"></image>
                                            </view>
                                            <view class="base flex-1 flex-width padding-left-main pr">
                                                <view class="cr-base single-text">{{ item.title }}</view>
                                                <view class="margin-top-xs sales-price">{{ currency_symbol }}{{ item.price }}</view>
                                                <text class="br-green cr-green text-size-xs padding-horizontal-main padding-top-xs padding-bottom-xs round pa cp operate-submit" :data-index="index" @tap="popup_goods_choice_event">{{$t('common.select')}}</text>
                                            </view>
                                        </view>
                                    </block>
                                    <view class="tc br-t-dashed padding-vertical-main margin-top-main cr-grey text-size-xs">{{ popup_search_goods_list.length }}{{$t('common.piece_data')}}</view>
                                </block>
                                <block v-else>
                                    <component-no-data :propStatus="search_data_list_loding_status" :propMsg="search_data_list_loding_msg"></component-no-data>
                                </block>
                            </scroll-view>
                        </view>
                    </view>
                </component-popup>
            </form>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentUpload from '@/pages/common/components/upload/upload';
    import componentNoData from '@/components/no-data/no-data';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                bottom_fixed_style: '',
                params: {},
                data: {},
                popup_status: false,
                category_list: [],
                image_list: [],
                editor_path_type: '',
                form_submit_loading: false,
                currency_symbol: app.globalData.currency_symbol(),
                // 关联商品选择
                popup_goods_choice_status: false,
                goods_category_list: [],
                popup_goods_cetagory_index: 0,
                popup_keywords_value: '',
                popup_search_goods_list: [],
                search_data_list_loding_status: 1,
                search_data_list_loding_msg: '',
            };
        },
        components: {
            componentCommon,
            componentPopup,
            componentUpload,
            componentNoData,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params || {},
            });
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            app.globalData.page_common_on_show(this);
        },
        onPullDownRefresh() {
            this.init();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('common.user_not_logged'),
                    });
                }
            },
            get_data() {
                this.setData({
                    data_list_loding_status: 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'uservideo', 'video'),
                    method: 'POST',
                    data: { ...this.params, ...{ lang_can_key: 'category_list,goods_category_list' } },
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var category_list = res.data.data.category_list || [];
                            var data = res.data.data.data || {};
                            var img_list = [];
                            if ((data.cover || null) != null && data.cover.length > 0) {
                                img_list.push(data.cover);
                            }
                            var category_name = '';
                            for (var i in category_list) {
                                if (category_list[i]['id'] == data.category_id) {
                                    category_name = category_list[i]['name'];
                                    break;
                                }
                            }
                            data['category_name'] = category_name;
                            if ((data.is_enable || null) == null) {
                                data.is_enable = 1;
                            }
                            if ((data.goods_id || null) == null) {
                                data.goods_id = 0;
                            }
                            // 商品分类（最前增加全部分类）
                            var goods_category_list = res.data.data.goods_category_list || [];
                            if (goods_category_list.length > 0) {
                                goods_category_list.unshift({ id: null, name: this.$t('common.classify_all') });
                            }
                            this.setData({
                                data: data,
                                category_list: category_list,
                                goods_category_list: goods_category_list,
                                image_list: img_list,
                                editor_path_type: res.data.data.editor_path_type,
                                data_list_loding_status: 3,
                                search_data_list_loding_msg: this.$t('form.search_goods_first'),
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            popupOpen() {
                this.setData({
                    popup_status: true,
                });
            },
            popup_close_event() {
                this.setData({
                    popup_status: false,
                });
            },
            is_enable_event(e) {
                var new_data = this.data;
                new_data.is_enable = e.detail.value ? 1 : 0;
                this.setData({
                    data: new_data,
                });
            },
            get_type_event(e) {
                var new_data = this.data;
                new_data.category_id = e.currentTarget.dataset.id;
                new_data.category_name = e.currentTarget.dataset.value;
                this.setData({
                    data: new_data,
                    popup_status: false,
                });
            },
            // 打开商品选择
            goods_add_event() {
                this.setData({
                    popup_goods_choice_status: true,
                });
                if (this.popup_search_goods_list.length == 0) {
                    this.popup_goods_search_event();
                }
            },
            // 关闭商品选择
            popup_goods_choice_close_event() {
                this.setData({
                    popup_goods_choice_status: false,
                });
            },
            // 移除已选商品
            goods_remove_event() {
                var new_data = this.data;
                new_data.goods_id = 0;
                new_data.goods = null;
                this.setData({
                    data: new_data,
                });
            },
            // 商品分类选择
            popup_goods_category_event(e) {
                this.setData({
                    popup_goods_cetagory_index: parseInt(e.detail.value || 0),
                });
            },
            // 商品关键字
            popup_keywords_value_event(e) {
                this.setData({
                    popup_keywords_value: e.detail.value,
                });
            },
            // 商品搜索
            popup_goods_search_event() {
                var post_data = {
                    keywords: this.popup_keywords_value,
                };
                if (this.popup_goods_cetagory_index > 0) {
                    post_data['category_id'] = this.goods_category_list[this.popup_goods_cetagory_index]['id'];
                }
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                this.setData({
                    search_data_list_loding_status: 1,
                    search_data_list_loding_msg: this.$t('form.searching'),
                });
                uni.request({
                    url: app.globalData.get_request_url('goodssearch', 'uservideo', 'video'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var list = res.data.data || [];
                            this.setData({
                                popup_search_goods_list: list,
                                search_data_list_loding_status: list.length > 0 ? 3 : 0,
                                search_data_list_loding_msg: list.length > 0 ? '' : this.$t('common.related_products_available'),
                            });
                        } else {
                            this.setData({
                                search_data_list_loding_status: 0,
                                search_data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            search_data_list_loding_status: 2,
                            search_data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 选中商品（单关联，覆盖）
            popup_goods_choice_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var goods = this.popup_search_goods_list[index];
                if ((goods || null) == null) {
                    return;
                }
                var new_data = this.data;
                new_data.goods_id = goods.id;
                new_data.goods = goods;
                this.setData({
                    data: new_data,
                    popup_goods_choice_status: false,
                });
                app.globalData.showToast(this.$t('common.selection_successful'), 'success');
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            retrun_image_event() {
                var data = (uni.getStorageSync(app.globalData.data.cache_upload_callback_key) || {}).data;
                var new_data = this.data;
                new_data.cover = data[0];
                this.setData({
                    data: new_data,
                    image_list: data,
                });
            },
            clear_video_event() {
                var new_data = this.data;
                new_data.video_url = '';
                this.setData({
                    data: new_data,
                });
            },
            choose_video_event() {
                var self = this;
                uni.chooseVideo({
                    sourceType: ['album', 'camera'],
                    compressed: true,
                    success(res) {
                        uni.showLoading({
                            title: self.$t('common.uploading_wait_moment'),
                            mask: true,
                        });
                        uni.uploadFile({
                            url: app.globalData.get_request_url('index', 'ueditor'),
                            filePath: res.tempFilePath,
                            name: 'upfile',
                            formData: {
                                action: 'uploadvideo',
                                path_type: self.editor_path_type,
                            },
                            success: function (up) {
                                uni.hideLoading();
                                var result = typeof up.data == 'object' ? up.data : JSON.parse(up.data);
                                if (up.statusCode == 200 && result.code == 0 && (result.data.url || null) != null) {
                                    var new_data = self.data;
                                    new_data.video_url = result.data.url;
                                    if (!new_data.duration && res.duration) {
                                        // 后端 duration 单位为分钟
                                        new_data.duration = (parseFloat(res.duration) / 60).toFixed(2);
                                    }
                                    self.setData({
                                        data: new_data,
                                    });
                                } else {
                                    app.globalData.showToast((result && result.msg) || self.$t('common.sub_error_retry_tips'));
                                }
                            },
                            fail: function () {
                                uni.hideLoading();
                                app.globalData.showToast(self.$t('common.internet_error_tips'));
                            },
                        });
                    },
                });
            },
            form_submit(e) {
                var validation = [
                    { fields: 'title', msg: this.$t('form.enter_title') },
                    { fields: 'category_id', msg: this.$t('form.select_category') },
                    { fields: 'video_url', msg: this.$t('form.select_video') },
                    { fields: 'cover', msg: this.$t('form.select_cover') },
                    { fields: 'duration', msg: this.$t('form.enter_duration') },
                ];
                var validate = {
                    category_id: this.data.category_id,
                    video_url: this.data.video_url,
                    cover: this.data.cover,
                    title: e.detail.value.title,
                    duration: e.detail.value.duration,
                };
                if (app.globalData.fields_check(validate, validation)) {
                    uni.showLoading({
                        title: this.$t('common.submit_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true,
                    });
                    // 表单字段（title/duration）需覆盖 data 中的旧值，否则编辑不生效仍提示成功
                    var new_data = {
                        ...this.data,
                        ...e.detail.value,
                        goods_id: this.data.goods_id || 0,
                    };
                    // 嵌套商品对象无需提交
                    delete new_data.goods;
                    uni.request({
                        url: app.globalData.get_request_url('save', 'uservideo', 'video'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                // 通知列表：编辑只刷新当前条，新增整表重拉
                                var edit_id = parseInt(new_data.id || 0);
                                uni.setStorageSync('cache_plugins_video_user_list_refresh', {
                                    type: edit_id > 0 ? 'edit' : 'add',
                                    id: edit_id,
                                });
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.page_back_prev_event();
                                }, 2000);
                            } else {
                                this.setData({
                                    form_submit_loading: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                            });
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
        },
    };
</script>
<style>
    @import './form.css';
</style>

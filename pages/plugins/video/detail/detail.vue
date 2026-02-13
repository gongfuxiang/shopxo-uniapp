<template>
    <view class="content pr">
        <template v-if="display_video_list.length > 0">
            <!-- 搜索框 -->
            <view v-if="!show_comment_modal" class="header-top" :style="top_content_style + menu_button_info">
                <view id="search-height" class="flex-row align-c">
                    <!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
                    <!-- #ifndef MP-ALIPAY -->
                    <view class="cp" @tap="handle_back">
                        <iconfont name="icon-arrow-left " size="36rpx" color="#333" class="mr-10"></iconfont>
                    </view>
                    <!-- #endif -->
                    <view class="wh-auto ht-auto" :style="header_padding_left">
                        <search-component :propIsDisabled="true" @disabledSearch="handle_search" />
                    </view>
                </view>
            </view>
            <!-- 视频列表 -->
            <swiper class="swiper-container" :key="'top-or-buttom-' + swiper_key" :style="swiperStyle" :duration="500" :vertical="true" :circular="close_circular ? false : true" :skip-hidden-item-layout="true" :current="current_index" easing-function="linear" @transition="on_transition" @change="handle_swiper_change">
                <swiper-item v-for="(video_item, index) in display_video_list" :key="video_item.id">
                    <view class="video-container pr" @tap.stop="toggle_play_pause">
                        <view class="video-bg" :style="!isEmpty(video_item.poster_url) ? 'background-image: url(' + video_item.poster_url + ')' : ''"></view>
                        
                        <video class="video" :src="video_item.video_url" :poster="video_item.poster_url" :id="`video_${index}`" :loop="true" :show-fullscreen-btn="false" :show-center-play-btn="false" :show-play-btn="false" :controls="false" :show-mute-btn="true" object-fit="contain" @timeupdate="handle_time_update" @play="handle_play"></video>

                        <view v-if="paused && current_index == index" class="play-icon">
                            <view class="pr">
                                <view class="play-icon-bg"></view>
                                <view class="pa z-i play-icon-iconfont">
                                    <iconfont name="icon-bofang" size="120rpx" propClass="" color="#4F3E35"></iconfont>
                                </view>
                            </view>
                        </view>
                        
                        <template v-if="!show_comment_modal">
                            <!-- Right Action Bar -->
                            <view class="right-actions">
                                <view v-if="base_config_data && base_config_data.is_video_give_thumbs && base_config_data.is_video_give_thumbs == 1" class="action-item" :data-value="video_item" @tap.stop="handle_like">
                                    <iconfont name="icon-givealike" :color="video_item.is_give_thumbs == 0 ? '#fff' : '#F4B73F'" size="60rpx" />
                                    <text class="action-text">{{ video_item.give_thumbs_count }}</text>
                                </view>
                                <view v-if="base_config_data && base_config_data.is_video_comments_show && base_config_data.is_video_comments_show == 1" class="action-item" :data-value="video_item" @tap.stop="handle_comment">
                                    <iconfont name="icon-comment" color="#fff" size="60rpx" />
                                    <text class="action-text">{{ video_item.comments_count }}</text>
                                </view>
                                <view class="action-item" @tap.stop="handle_share">
                                    <iconfont name="icon-share-solid" color="#fff" size="60rpx"></iconfont>
                                    <text class="action-text">分享</text>
                                </view>
                            </view>
                            <view v-if="!isEmpty(video_item.goods) && base_config_data && base_config_data.is_video_detail_show_goods && base_config_data.is_video_detail_show_goods == 1" class="product-card">
                                <view class="flex-col gap-10">
                                    <view v-if="video_item.show_goods" class="flex-row align-c gap-10 product-card-item" :data-id="video_item.id" @tap.stop="handle_product_card_item">
                                        <view class="product-image">
                                            <image :src="video_item.goods.images" mode="aspectFill" class="product-image"></image>
                                        </view>
                                        <view class="flex-1 flex-col align-sb jc-c gap-10">
                                            <text class="product-name text-line-1">{{ video_item.goods.title }}</text>
                                            <text class="product-price">¥{{ video_item.goods.price }}</text>
                                        </view>
                                        <view class="product-close" :data-id="video_item.id" @tap.stop="product_close_event">
                                            <iconfont name="icon-close" color="#999" size="30rpx"></iconfont>
                                        </view>
                                    </view>
                                    <view class="product-button" :data-id="video_item.id" @tap.stop="handle_product_button">
                                        <view class="product-button-left flex-row align-c gap-10">
                                            <iconfont name="icon-cart-have" color="#F5C366" size="30rpx"></iconfont>
                                            <text class="size-14 cr-f">购买商品</text>
                                        </view>
                                        <iconfont name="icon-angle-right" color="#fff" size="30rpx"></iconfont>
                                    </view>
                                </view>
                            </view>

                            <!-- Progress Bar -->
                            <view class="progress-bar-container" v-if="current_index == index">
                                <slider class="progress-slider" :value="current_video_progress" :max="current_video_duration" @change.stop="handle_slider_change" @changing="handle_slider_changing" @tap.stop="handle_slider_change" block-size="14" activeColor="#FFFFFF" backgroundColor="rgba(255, 255, 255, 0.4)" />
                                <text class="time-display">{{ format_time(current_video_progress) }} / {{ format_time(current_video_duration) }}</text>
                            </view>
                        </template>
                    </view>
                </swiper-item>
            </swiper>
        </template>
		<template v-else>
			<component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
		</template>
        
        <!-- 评论弹窗 -->
        <view v-if="show_comment_modal" class="comment-modal" @tap="close_comment_modal">
            <view class="comment-content bottom-line-exclude-bottom" :style="commentContentStyle" @tap.stop @touchstart="handle_comment_touch_start" @touchmove="handle_comment_touch_move" @touchend="handle_comment_touch_end">
                <view class="comment-header">
                    <text class="comment-count">评论</text>
                    <view class="close-btn" @tap="close_comment_modal">✕</view>
                </view>
                <!-- 评论内容区域 -->
                <scroll-view class="comment-list" scroll-y :scroll-top="comment_scroll_top" show-scrollbar="false" scroll-with-animation @scrolltolower="handle_comment_to_lower_scroll" @scroll="handle_comment_scroll">
                    <view class="comment-scroll">
                        <template v-if="active_comments.length > 0">
                            <view class="comment-item flex-col" v-for="(comment_item, index) in active_comments" :key="index">
                                <commentInfoComponent class="wh-auto ht-auto" :propComment="comment_item" :propId="comment_item.id" :propDropDownVisible="active_dropdown_id == comment_item.id" @comment_reply="comment_reply" @comment_like="comment_like" @toggle_dropdown="handle_toggle_dropdown" @dropdown_item_click="handle_dropdown_item_click"></commentInfoComponent>
                                <!-- 子评论 -->
                                <view class="sub-comment flex-col jc-c gap-10 mt-10">
                                    <view v-if="comment_item.sub_comments && comment_item.sub_comments.length > 0 && comment_item.show_sub_comment" class="sub-comment-list flex-col jc-c">
                                        <view class="sub-comment-item flex-row align-s gap-10" v-for="(sub_comment_item, sub_comment_index) in comment_item.sub_comments" :key="sub_comment_index">
                                            <commentInfoComponent class="wh-auto ht-auto" :propComment="sub_comment_item" :propId="sub_comment_item.id" :propDropDownVisible="active_dropdown_id == sub_comment_item.id" @comment_reply="comment_reply" @comment_like="comment_like" @toggle_dropdown="handle_toggle_dropdown" @dropdown_item_click="handle_dropdown_item_click"></commentInfoComponent>
                                        </view>
                                    </view>
                                    <template v-if="comment_item.comments_count > 0">
                                        <template v-if="!comment_item.show_sub_comment">
                                            <commentMoreComponent :propId="comment_item.id" :propIsLevel="1" :propText="'—— 展开' + (comment_item.comments_count ? comment_item.comments_count || 0 : 0) + '条回复'" @comment_more_event="open_sub_comment"></commentMoreComponent>
                                        </template>
                                        <template v-else>
                                            <template v-if="comment_item.show_sub_comment_loading">
                                                <loading-component></loading-component>
                                            </template>
                                            <view v-else class="sub-comment-more flex-row align-c gap-10">
                                                <view v-if="comment_item.page && comment_item.page < comment_item.page_total">
                                                    <commentMoreComponent :propId="comment_item.id" :propIsLevel="2" propText="展开" @comment_more_event="open_sub_comment"></commentMoreComponent>
                                                </view>
                                                <commentMoreComponent :propId="comment_item.id" propText="收起" propIconName="icon-arrow-top" @comment_more_event="close_sub_comment"></commentMoreComponent>
                                            </view>
                                        </template>
                                    </template>
                                </view>
                            </view>
                            <template v-if="comment_item_loading">
                                <loading-component></loading-component>
                            </template>
                            <template v-else>
                                <!-- 结尾 -->
                                <component-bottom-line :propStatus="goods_bottom_line_status"></component-bottom-line>
                            </template>
                        </template>
                        <template v-else>
                            <component-no-data propMsg="暂无评论"></component-no-data>
                        </template>
                    </view>
                </scroll-view>
                <view v-if="base_config_data && base_config_data.is_video_comments_add && base_config_data.is_video_comments_add == 1" class="comment-input-container">
                    <view class="comment-input-content flex-col jc-c">
                        <view class="flex-row align-c gap-10 wh-auto ht-auto">
                            <input :value="comment_input_value" class="comment-input" type="text" confirm-type="send" :adjust-position="false" :placeholder="input_placeholder" @focus="add_comment" @input="comment_input_event" @confirm="send_comment" />
                            <view data-type="image" @tap="comment_input_change">
                                <iconfont name="icon-layout-module-single-images" size="32rpx" color="#999"></iconfont>
                            </view>
                        </view>
                        <view v-if="form_images_list.length > 0" class="pr w h comment-input-img-container">
                            <view v-for="(item, index) in form_images_list" :key="index" class="comment-input-img pr">
                                <iconfont name="icon-close" size="10" color="#000" class="comment-input-img-close" :data-index="index" @tap="comment_input_img_close"></iconfont>
                                <image :src="item.url" :data-index="index" @tap="upload_show_event" mode="aspectFill" class="wh-auto ht-auto"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 举报弹窗 -->
        <component-popup :propShow="popup_report_status" propPosition="bottom" @onclose="popup_close_event">
            <view class="report-content">
                <!-- 顶部按钮区域 -->
                <view class="report-header flex-row align-c jc-sb">
                    <view class="report-btn cr-6" @tap="popup_close_event">取消</view>
                    <view class="report-title flex-1">举报原因</view>
                    <view class="report-btn cr-blue" @tap="submit_report">确定</view>
                </view>
                <!-- 主要内容区域 -->
                <view class="report-body">
                    <!-- 第一层：举报原因选择 -->
                    <view v-if="report_type_list.length > 0" class="report-section">
                        <view class="report-label">举报原因<text class="ml-10">*</text></view>
                        <view class="flex-row align-c gap-10 flex-wrap">
                            <view v-for="(mainItem, main_index) in report_type_list" :key="main_index" class="flex-row align-c" :data-index="main_index" @tap="select_main_reason">
                                <view class="flex-row align-c">
                                    <radio :value="main_index.toString()" :checked="current_main_index === main_index" style="transform:scale(0.7)" />
                                    <view class="flex-row align-c">{{mainItem.name}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    
                    <!-- 第二层：具体类型选择（当有主类别选中时显示） -->
                    <view  class="report-section mt-20" v-if="current_main_index >= 0 && report_type_list[current_main_index]">
                        <view class="report-label">请选择具体的类型<text class="ml-10">*</text></view>
                        <view class="flex-row align-c gap-10 flex-wrap">
                            <view v-for="(subItem, sub_index) in report_type_list[current_main_index].data" :key="sub_index" class="flex-row align-c" :data-index="sub_index" @tap="select_sub_reason">
                                <view class="flex-row align-c">
                                    <radio :value="sub_index.toString()" :checked="current_sub_index === sub_index" style="transform:scale(0.7)" />
                                    <view class="flex-row align-c">{{subItem}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>
        <!-- 添加评论 -->
        <view v-if="is_add_comment" class="keyboard-input" :style="'width:100%;bottom:' + listener_height + 'px;'">
            <view class="keyboard-input-border">
                <input :value="comment_input_value" :focus="is_add_comment" type="text" confirm-type="done" :adjust-position="false" :auto-blur="true" :placeholder="input_placeholder" @input="comment_input_event" @blur="() => is_add_comment = false" @confirm="send_comment" />
            </view>
        </view>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>
    </view>
</template>

<script>
    const app = getApp();
    import { get_math, isEmpty, video_get_top_left_padding } from '@/common/js/common/common.js';
    import loadingComponent from '@/pages/plugins/video/components/loading.vue';
    import commentInfoComponent from '@/pages/plugins/video/components/comment-info.vue';
    import commentMoreComponent from '@/pages/plugins/video/components/comment-more.vue';
    import searchComponent from '@/pages/plugins/video/components/search.vue';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPopup from '@/components/popup/popup';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif
    export default {
        components: {
            loadingComponent,
            commentInfoComponent,
            commentMoreComponent,
            searchComponent,
            componentSharePopup,
            componentNoData,
            componentBottomLine,
            componentPopup
        },
        data() {
            return {
                // 5,7,0 是误差，， 10 是下边距，66是高度，bar_height是不同小程序下的导航栏距离顶部的高度
                // #ifdef MP
                top_content_style: 'padding-top:' + (bar_height + 5) + 'px;padding-bottom:10px;',
                // #endif
                // #ifdef H5 || MP-TOUTIAO
                top_content_style: 'padding-top:' + (bar_height + 7) + 'px;padding-bottom:10px;',
                // #endif
                // #ifdef APP
                top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:10px;',
                // #endif
                data_list_loding_status:  1,
                data_list_loding_msg: '',
                video_data_list: [],
                display_video_list: [],
                current_index: 0,
                video_contexts: [], // 原生的video视频
                create_video_contexts: [], // 使用uni.createVideoContext创建的视频上下文
                paused: false,
                current_video_progress: 0,
                current_video_duration: 1,
                is_seeking: false,
                show_comment_modal: false,
                active_comments: {},
                comments_page: 1, // 当前评论页
                comments_page_total: 5, // 评论总页数
                goods_bottom_line_status: false, //评论页是否显示底部线
                comment_item_loading: false,
                comment_start_y: 0, // 评论开始拖拽位置
                comment_current_y: 0, // 评论当前拖拽位置
                move_distance: 0, // 评论拖拽距离
                current_video_id: '', // 当前播放视频的ID
                is_slide_start: false,
                swiper_key: get_math(),
                comment_scroll_top: 0, // 评论滚动距离顶部的距离
                input_placeholder: '请输入您的精彩评论',
                comment_input_value: '',
                propMaxNum: 1,
                form_images_list: [],
                share_info: {},
                menu_button_info: '',
                direction: 'direction',
                base_config_data: {},
                video_switch_debounce_timer: null, // 视频切换防抖定时器
                video_cleanup_timer: null, // 视频清理定时器
                // 添加下拉菜单状态管理
                active_dropdown_id: null, // 当前显示下拉菜单的评论ID
                params: {},
                header_padding_left: '',
                report_type_list: [], // 举报类型列表
                popup_report_status: false, // 举报弹窗状态
                current_main_index: 0, // 默认选中第一个举报原因
                current_sub_index: 0, // 默认选中第一个具体类型
                report_comment_id: '', // 举报的评论id
                comment_scroll_top: 0,
                comment_value: '',
                is_add_comment: false,
                // 监听键盘高度变化事件
                listener_height: 0,
            };
        },
        computed: {
            swiperStyle() {
                return this.show_comment_modal ? (this.move_distance > 0 ? `height: calc(30% + ${this.move_distance}px);` : 'height: 30%;') : 'height: 100%;';
            },
            commentContentStyle() {
                return this.show_comment_modal && this.move_distance > 0 ? `transform: translateY(3px); height: calc(70% - ${this.move_distance}px);` : `transform: translateY(0); height: 70%;`;
            },
            current_video_index() { 
                return this.video_data_list.findIndex(item => item.id == this.current_video_id);
            },
            // 如果是第一个或者最后一个的情况下，取消无限轮播
            close_circular() {
                if (this.video_data_list.length > 0) {
                    return this.video_data_list[0].id == this.current_video_id  || this.video_data_list[this.video_data_list.length - 1].id == this.current_video_id;
                } else {
                    return true
                }
            }
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },
        onShow() {
            this.init();
        },
        mounted() {
            // 添加全局点击事件监听
            document.addEventListener('click', this.handle_global_click);
            
            // 添加触摸事件监听（移动端兼容）
            document.addEventListener('touchstart', this.handle_global_click);
            // 创建监听事件
            this.bind_keyboard_listener();
        },
        beforeDestroy() {
            // 清理定时器
            if (this.video_switch_debounce_timer) {
                clearTimeout(this.video_switch_debounce_timer);
            }
            if (this.video_cleanup_timer) {
                clearTimeout(this.video_cleanup_timer);
            }
            
            // 清理所有视频资源
            this.cleanup_all_videos();
            
            // 移除键盘事件监听器
            // #ifdef H5
            if (typeof document !== 'undefined') {
                document.removeEventListener('keydown', this.handle_keydown);
            }
            // #endif
            this.unbind_keyboard_listener();
            // 移除全局事件监听器
            document.removeEventListener('click', this.handle_global_click);
            document.removeEventListener('touchstart', this.handle_global_click);
        },
        methods: {
            isEmpty,
            init() { 
                // 小程序下，获取小程序胶囊的宽度
                let menu_button_info = 'max-width:100%';
                // #ifndef MP-TOUTIAO
                    // #ifdef MP
                    // 判断是否有胶囊
                    const is_current_single_page = app.globalData.is_current_single_page();
                    // 如果有胶囊的时候，做处理
                    if (is_current_single_page == 0) {
                        const custom = uni.getMenuButtonBoundingClientRect();
                        menu_button_info = `max-width:calc(100% - ${custom.width + 10}px);`;
                    }
                    // #endif
                // #endif
                // 视频详情页，需要添加padding-left
                let padding_left = '';
                // #ifdef MP-ALIPAY
                    padding_left = video_get_top_left_padding();
                // #endif
                this.setData({
                    header_padding_left: padding_left,
                    menu_button_info: menu_button_info,
                    current_video_id: this.params.id,
                });

                this.get_video_detail(this.params.id);
            },
            // 获取视频详情
            get_video_detail(id) {
                // 获取数据
			    uni.request({
				    url: app.globalData.get_request_url("detail", "index", "video"),
                    method: 'POST',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            // const list = data.data.video;
                            const new_data = data.data;
                            this.setData({
                                video_data_list: [new_data.data],
                                report_type_list: new_data.report_type_list,
                                base_config_data: new_data.base_config_data,
                            });
                            this.get_last_or_next_data_list(this.params.id, 1, 1);
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_tabs_loding_msg: data.msg,
                            });
                        }
                    },
                    fail: (err) => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    }
                });
            },
            // 获取视频列表
            get_last_or_next_data_list(id, is_last = 0, is_next = 0) {
                // 获取数据
			    uni.request({
                    url: app.globalData.get_request_url("lastnextdata", "index", "video"),
                    method: 'POST',
                    data: {
                        id: id,
                        is_last: is_last,
                        is_next: is_next,
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            const new_data = data.data;
                            // 第一次的数据
                            let data_list = JSON.parse(JSON.stringify(this.video_data_list));
                            
                            // 创建现有数据的ID映射表，用于快速去重
                            const existing_ids = new Map();
                            data_list.forEach(item => {
                                existing_ids.set(item.id, true);
                            });
                            
                            if (is_last == 1 && is_next == 1) {
                                // 上一批数据 - 去重处理
                                if (new_data.last.length > 0) {
                                    const unique_last = new_data.last.filter(item => !existing_ids.has(item.id));
                                    if (unique_last.length > 0) {
                                        data_list.unshift(...unique_last);
                                        // 更新ID映射表
                                        unique_last.forEach(item => existing_ids.set(item.id, true));
                                    }
                                }
                                // 下一批数据 - 去重处理
                                if (new_data.next.length > 0) {
                                    const unique_next = new_data.next.filter(item => !existing_ids.has(item.id));
                                    if (unique_next.length > 0) {
                                        data_list.push(...unique_next);
                                    }
                                }
                            } else if (is_last == 1 && new_data.last.length > 0) { // 上一页数据 - 去重处理
                                const unique_last = new_data.last.filter(item => !existing_ids.has(item.id));
                                if (unique_last.length > 0) {
                                    data_list.unshift(...unique_last);
                                }
                            } else if (is_next == 1 && new_data.next.length > 0) { // 下一页数据 - 去重处理
                                const unique_next = new_data.next.filter(item => !existing_ids.has(item.id));
                                if (unique_next.length > 0) {
                                    data_list.push(...unique_next);
                                }
                            }
                            // 更新当前视频商品信息
                            const new_index = data_list.findIndex(item => item.id == this.params.id);
                            data_list.forEach((item) => {
                                if (isEmpty(item.show_goods)) {
                                    if (this.base_config_data && this.base_config_data.is_video_detail_show_goods_modal && this.base_config_data.is_video_detail_show_goods_modal == 1) {
                                        item.show_goods = true;
                                    } else {
                                        item.show_goods = false;
                                    }
                                }
                            });
                            this.setData({
                                video_data_list: data_list,
                                current_index: is_last == 1 && is_next == 1 ? (new_index == data_list.length - 1 ? 2 : (new_index == data_list.length - 2 ? 1 : 0)) : this.current_index,
                            });
                            
                            if (is_last == 1 && is_next == 1) {
                                // 更新数据信息
                                this.update_display_data();

                                setTimeout(() => { 
                                    // // 更新分享信息
                                    this.update_share_info(this.display_video_list[0]);

                                    this.display_video_list.forEach((item, index) => {
                                        this.create_video_contexts[index] = uni.createVideoContext(`video_${index}`, this);
                                        //#ifdef H5
                                        this.video_contexts[index] = document.getElementById(`video_${index}`).querySelector('video');
                                        //#endif
                                    });

                                    setTimeout(() => {
                                        //#ifdef H5
                                        if (this.video_contexts[0]) { // 当前播放的视频索引为0
                                            this.video_play_event(this.video_contexts[0], true);
                                        }
                                        //#endif
                                        //#ifndef H5
                                        if (this.create_video_contexts[0]) { // 当前播放的视频索引为0
                                            this.video_play_event(this.create_video_contexts[0], true);
                                        }
                                        //#endif
                                    }, 200);
                                }, 0);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_tabs_loding_msg: data.msg,
                            });
                        }
                    },
                    fail: (err) => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    }
                });
            },
            // 视频滚动处理逻辑（带防抖）
            handle_swiper_change(event) {
                const { current } = event.detail;
                
                // 防抖处理，避免快速切换时的重复操作
                if (this.video_switch_debounce_timer) {
                    clearTimeout(this.video_switch_debounce_timer);
                }
                
                this.video_switch_debounce_timer = setTimeout(() => {
                    this.process_swiper_change(current);
                }, 50); // 50ms防抖延迟
            },

            // 实际的swiper切换处理逻辑
            process_swiper_change(current) {
                // 先暂停所有视频，确保不会有后台播放
                this.pause_all_videos_except(current);

                const id = this.display_video_list[current].id;
                // 更新状态
                this.setData({
                    current_index: current,
                    paused: false,
                    current_video_progress: 0,
                    current_video_duration: 1,
                    is_seeking: false,
                    current_video_id: id, // 更新当前播放视频的ID
                });

                const index = this.video_data_list.findIndex(item => item.id == id);
                
                // 数据预加载逻辑
                if (index < 2 && this.direction == 'prev') {
                    this.get_last_or_next_data_list(this.video_data_list[0].id, 1, 0);
                } else if (index < this.video_data_list.length - 3 && this.direction == 'next') {
                    this.get_last_or_next_data_list(this.video_data_list[this.video_data_list.length - 1].id, 0, 1);
                }
                // 获取视频详细信息
                this.get_video_data_detail(id);
                // 边界处理逻辑
                if (this.current_video_index == 0 && this.is_slide_start) {
                    const list = [
                        this.get_video_by_index(0),
                        this.get_video_by_index(1),
                        this.get_video_by_index(2)
                    ];
                    
                    this.setData({
                        is_slide_start: false,
                        current_index: 0,
                        display_video_list: list,
                        swiper_key: get_math()
                    });
                } else if (this.current_video_index == this.video_data_list.length - 1) {
                    const list = [
                        this.get_video_by_index(this.current_video_index - 2),
                        this.get_video_by_index(this.current_video_index - 1),
                        this.get_video_by_index(this.current_video_index),
                    ];
                    this.setData({
                        current_index: 2,
                        display_video_list: list,
                        swiper_key: get_math()
                    });
                } else {
                    this.setData({
                        is_slide_start: true,
                        swiper_key: get_math()
                    });
                    this.update_display_data();
                }

                // 更新分享信息
                this.update_share_info(this.display_video_list[current]);

                // 延迟播放当前视频，确保DOM更新完成
                setTimeout(() => {
                    this.play_current_video_safely(this.current_index);
                }, 150);
            },

            // 批量暂停除指定索引外的所有视频
            pause_all_videos_except(exceptIndex) {
                // 暂停 uni.createVideoContext 创建的视频
                this.create_video_contexts.forEach((context, index) => {
                    if (index !== exceptIndex && context) {
                        try {
                            context.pause();
                        } catch (error) {
                            console.warn(`暂停视频 ${index} 失败:`, error);
                        }
                    }
                });
            },

            // 安全播放当前视频
            play_current_video_safely(index) {
                // 优先使用 uni.createVideoContext
                if (this.create_video_contexts[index]) {
                    this.video_play_event(this.create_video_contexts[index], false);
                    return;
                }
            },

            // 切换播放暂停
            toggle_play_pause() {
                const currentIndex = this.current_index;
                
                // 检查视频上下文是否存在
                const videoContext = this.create_video_contexts[currentIndex] || this.video_contexts[currentIndex];
                if (!videoContext) {
                    console.warn(`当前索引 ${currentIndex} 无可用视频上下文`);
                    return;
                }

                this.setData({ 
                    paused: !this.paused 
                });

                if (this.paused) {
                    // 暂停当前视频
                    try {
                        videoContext.pause();
                    } catch (error) {
                        console.warn('暂停视频失败:', error);
                    }
                } else {
                    // 播放当前视频
                    this.video_play_event(videoContext, false);
                }
            },

            update_share_info(data) {
                const info = {
                    title: data.title || '',
                    desc: data.desc || '',
                    path: '/pages/plugins/video/detail/detail',
                    query: app.globalData.json_to_url_params(this.params),
                    img: data.poster_url || ''
                }
                this.setData({
                    share_info: info,
                });
                // 分享菜单处理
                app.globalData.page_share_handle(info);
            },
            // 安全的视频播放事件处理
            video_play_event(videoContext, is_first_play = false) {
                if (!videoContext) {
                    this.setData({ paused: true });
                    return;
                }

                try {
                    if (is_first_play) {
                        //#ifdef H5
                        videoContext.play().catch((error) => {
                            this.setData({ paused: true });
                        });
                        //#endif
                        //#ifndef H5
                        videoContext.play();  
                        //#endif
                    } else {
                        videoContext.play();
                    }
                } catch (error) {
                    console.error('视频播放异常:', error);
                    this.setData({ paused: true });
                }
            },
            // 安全获取视频数据的方法，处理索引超限情况
            get_video_by_index(index) {
                // 处理负数索引
                if (index < 0) {
                    // 循环到数组末尾
                    const actualIndex = this.video_data_list.length + (index % this.video_data_list.length);
                    return this.video_data_list[actualIndex];
                }
                
                // 处理超出数组长度的索引
                if (index >= this.video_data_list.length) {
                    // 循环到数组开头
                    const actualIndex = index % this.video_data_list.length;
                    return this.video_data_list[actualIndex];
                }
                
                // 正常情况直接返回
                return this.video_data_list[index];
            },
            
            // 更新显示数据
            update_display_data() {
                let list = [];
                // 如果当前索引为0，只显示当前元素和下一个元素
                if (this.current_index == 0) {
                    list = [
                        this.get_video_by_index(this.current_video_index),
                        this.get_video_by_index(this.current_video_index + 1), // 下一个元素
                        this.get_video_by_index(this.current_video_index - 1) // 上一个元素，
                    ];
                } else if (this.current_index == 1) { // 索引为1时，为确保无限轮播正常，需要改变数据插入顺序
                    list = [
                        this.get_video_by_index(this.current_video_index - 1),
                        this.get_video_by_index(this.current_video_index),
                        this.get_video_by_index(this.current_video_index + 1)
                    ];
                } else {
                    list = [
                        this.get_video_by_index(this.current_video_index + 1),
                        this.get_video_by_index(this.current_video_index - 1),
                        this.get_video_by_index(this.current_video_index),
                    ];
                }

                this.setData({
                    display_video_list: list
                })
            },
            // 评论输入框事件
            comment_input_event(e) {
                this.comment_input_value = e.detail.value;
            },
            comment_input_change(e) {
                const { type } = e.currentTarget.dataset;
                if (type == 'image') {
                    var self = this;
                    uni.chooseImage({
                        count: self.propMaxNum,
                        success(res) {
                            var success = 0;
                            var fail = 0;
                            var length = res.tempFilePaths.length;
                            var count = 0;
                            self.upload_one_by_one(res.tempFilePaths, success, fail, count, length, 'uploadimage');
                        },
                    });
                }
            },
            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length, action) {
                var self = this;
                if (self.form_images_list.length <= this.propMaxNum) {
                    uni.uploadFile({
                        url: app.globalData.get_request_url('index', 'ueditor'),
                        filePath: img_paths[count],
                        name: 'upfile',
                        formData: {
                            action: action,
                            path_type: self.propPathType,
                        },
                        success: function (res) {
                            success++;
                            if (res.statusCode == 200) {
                                var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                                if (data.code == 0 && (data.data.url || null) != null) {
                                    var list = self.form_images_list;
                                    list.push({
                                        url: data.data.url,
                                        name: data.data.original,
                                        size: data.data.size,
                                    });
                                    self.setData({
                                        form_images_list: list,
                                    });
                                    self.$emit('call-back', self.form_images_list, self.propCallData);
                                } else {
                                    app.globalData.showToast(data.msg);
                                }
                            }
                        },
                        fail: function (e) {
                            console.log(e);
                            fail++;
                        },
                        complete: function (e) {
                            count++;

                            // 下一张
                            if (count >= length) {
                                // 上传完毕，作一下提示
                                //app.showToast('上传成功' + success +'张', 'success');
                            } else {
                                // 递归调用，上传下一张
                                self.upload_one_by_one(img_paths, success, fail, count, length, action);
                            }
                        },
                    });
                }
            },
            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.form_images_list[e.currentTarget.dataset.index].url,
                    urls: this.form_images_list.map(item => item.url),
                });
            },
            // 评论输入图片删除
            comment_input_img_close(e) {
                const { index } = e.currentTarget.dataset;
                var list = this.form_images_list;
                list.splice(index, 1);
                this.setData({
                    form_images_list: list,
                });
            },
            on_transition(e) {
                const dy = e.detail.dy;
                let status = 'direction'
                if (dy > 0) {
                    status = 'next'
                } else if (dy < 0) {
                    status = 'prev'
                }
                // 如果历史的是向下滑动，这次也是向下滑动，就不更新数据
                if (this.direction != status) {
                    this.setData({
                        direction: status,
                    })
                }
            },
            // 切换播放暂停
            toggle_play_pause() {
                if (this.create_video_contexts[this.current_index] == null) return; // 当前播放的视频索引为1

                this.setData({ 
                    paused: !this.paused 
                });
                // 判断是否暂停
                if (this.paused) {
                    this.create_video_contexts[this.current_index].pause(); // 暂停中间的视频
                } else {
                    this.video_play_event(this.create_video_contexts[this.current_index], false); // 播放中间的视频
                }
            },
            handle_play() {
                this.setData({ paused: false });
            },
            // 收藏
            handle_like(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                var user = app.globalData.get_user_info(this, 'handle_like', e);
                if (user != false) {
                    const value = e?.currentTarget?.dataset?.value || {}; 
                    this.set_givethumbs_num(value.id);
                }
            },
            // 打开评论区
            handle_comment(e) {
                const old_data = e?.currentTarget?.dataset?.value || '';
                // 初始化评论数据
                const new_data = old_data.comments_list.map(item1 => ({
                    ...item1,
                    show_sub_comment: false,
                    show_sub_comment_loading: false,
                    page: 0,
                    sub_comments: [],
                }));

                this.setData({
                    active_comments: new_data,
                    comments_page: 1,
                    comments_page_total: 5,
                    comment_item_loading: false,
                    show_comment_modal: true,
                    move_distance: 0,
                })
            },
            // 关闭评论区
            close_comment_modal() {
                this.setData({
                    show_comment_modal: false,
                    move_distance: 0,
                })
            },
            // 评论滚动事件, 记录滚动位置
            handle_comment_scroll(e) {
                this.comment_scroll_top = e.detail.scrollTop;
            }, 
            // 评论滚动到底部事件
            handle_comment_to_lower_scroll() {
                if (this.goods_bottom_line_status) {
                    return;
                }
                this.comment_item_loading = true;
                // 获取数据
			    uni.request({
                    url: app.globalData.get_request_url("commentsreplylist", "index", "video"),
                    method: 'POST',
                    data: {
                        video_id: this.current_video_id,
                        page: this.comments_page + 1,
                        video_comments_id: 0
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            const new_data = data.data;
                            if (new_data.data.length > 0) {
                                // 初始化评论数据
                                const comment_data = new_data.data.map(item1 => ({
                                    ...item1,
                                    show_sub_comment: false,
                                    show_sub_comment_loading: false,
                                    page: 0,
                                    sub_comments: [],
                                }));
                                this.active_comments.push(...comment_data);
                            }
                            // 是否显示没有更多数据
                            if (new_data.page >= new_data.page_total) {
                                // 没有更多数据了
                                this.setData({
                                    goods_bottom_line_status: true,
                                })
                            }
                            this.comments_page = new_data.page;
                            this.comments_page_total = new_data.page_total
                        }
                    },
                    complete: () => {
                        this.comment_item_loading = false;
                    }
                });
            },
            // 评论拖拽开始
            handle_comment_touch_start(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top <= 5) {
                    this.comment_start_y = e.touches[0].pageY;
                    this.comment_current_y = this.comment_start_y;
                    this.move_distance = 0;   
                }
            },
            // 评论拖拽中
            handle_comment_touch_move(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top <= 5) {
                    this.comment_current_y = e.touches[0].pageY;
                    this.move_distance = this.comment_current_y - this.comment_start_y;
                }
            },

            // 评论拖拽结束
            handle_comment_touch_end(e) {
                // 只有滚动到顶部时才允许拖拽
                if (this.comment_scroll_top <= 5) {
                    const move_distance = this.comment_current_y - this.comment_start_y;
                    // 如果拖拽距离足够大，关闭评论弹窗
                    if (move_distance > 150) {
                        this.close_comment_modal();
                    } else {
                        this.move_distance = 0;
                    }
                }
            },

            send_comment() {
                let comment_text = this.comment_input_value;
                
                if (!comment_text.trim()) return;

                // video_id 视频id video_comments_id 父级评论id id 当前评论id
                let new_video_comments_id = 0;
                let reply_comments_id = 0
                if (!isEmpty(this.comments_data)) {
                    const { video_comments_id, id } = this.comments_data; 
                    new_video_comments_id = video_comments_id == 0 ? id : video_comments_id;
                    reply_comments_id = video_comments_id == 0 ? 0 : id;
                } 
                uni.request({
                    url: app.globalData.get_request_url("comments", "index", "video"),
                    method: 'POST',
                    data:  {
                        video_id: this.current_video_id,
                        video_comments_id: new_video_comments_id, // 如果父级评论id为0说明没有父级id，所以取当前id
                        reply_comments_id: reply_comments_id, // 如果父级评论id为0说明没有父级id，所以回复id为0
                        content: comment_text,
                        images: this.form_images_list.length > 0 ? this.form_images_list[0].url : '',
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            const new_data = data.data;
                            // 没有回复时的评论
                            if (new_video_comments_id == 0) {
                                this.active_comments.unshift({
                                    ...new_data,
                                    show_sub_comment: false,
                                    show_sub_comment_loading: false,
                                    page: 0,
                                    sub_comments: [],
                                })
                                this.video_data_list.forEach(item => {
                                    if (item.id == this.current_video_id) {
                                        item.comments_count++;
                                    }
                                })
                                this.setData({
                                    video_data_list: this.video_data_list,
                                    comment_scroll_top: 0 + Math.random() // 添加主评论时滚动到最顶部
                                })
                            } else {
                                this.active_comments.forEach(item => {
                                    if (item.id == new_video_comments_id) {
                                        item.sub_comments.unshift(new_data);
                                        item.comments_count++;
                                    }
                                })
                            }
                            // 清空输入框, 更新数据内容
                            this.setData({
                                active_comments: this.active_comments,
                                form_images_list: [],
                                comment_input_value: '',
                                comments_data: {},
                                input_placeholder: '请输入您的精彩评论',
                            });
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    }
                });
            },
            // 展开子评论
            open_sub_comment(id, is_level) {
                const comment = this.active_comments.find(item => item.id == id);
                if (comment) {
                    comment.show_sub_comment = true;
                    comment.show_sub_comment_loading = true;
                    // 如果是一级，并且有子评论数据，不需要调用接口，直接渲染评论信息
                    if (is_level == 1 && !isEmpty(comment.sub_comments)) {
                        comment.show_sub_comment_loading = false;
                        return;
                    }

                    uni.request({
                        url: app.globalData.get_request_url("commentsreplylist", "index", "video"),
                        method: 'POST',
                        data: {
                            video_id: this.current_video_id,
                            video_comments_id: id,
                            page: comment.page + 1,
                        },
                        dataType: 'json',
                        success: res => {
                            const data = res.data;
                            if (data.code == 0) {
                                const new_data = data.data;
                                if (new_data.data.length > 0) {
                                    comment.sub_comments.push(...new_data.data);
                                }
                                comment.page = new_data.page;
                                comment.page_total = new_data.page_total
                            }
                        },
                        complete: () => {
                            comment.show_sub_comment_loading = false;
                        }
                    });
                }
            },
            // 收起子评论
            close_sub_comment(id) {
                const comment = this.active_comments.find(item => item.id == id);
                if (comment) {
                    comment.show_sub_comment = false;
                }
            },
            handle_share() {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        share_info: this.share_info,
                    });
                }
            },
            // 更新视频数据信息
            get_video_data_detail(id) {
                uni.request({
                    url: app.globalData.get_request_url("data", "index", "video"),
                    method: 'POST',
                    data: {
                        id: id,
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            const new_data = data.data;
                            // 更新视频数据
                            this.video_data_list.forEach(item => {
                                if (item.id == id) {
                                    const new_item = {
                                        ...item,
                                        ...new_data,
                                    };
                                    item = new_item;
                                }
                            });
                            this.setData({
                                video_data_list: this.video_data_list
                            })
                        }
                    }
                });
            },
            // 更新点赞数量
            set_givethumbs_num(id, comments_id) {
                uni.request({
                    url: app.globalData.get_request_url("givethumbs", "index", "video"),
                    method: 'POST',
                    data:  {
                        video_id: id,
                        ...(isEmpty(comments_id) ? {} : {video_comments_id: comments_id}),
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            const new_data = data.data;

                            // 提取更新点赞状态的公共函数
                            const updateThumbsStatus = (target, new_data) => {
                                target.give_thumbs_count = new_data.count;
                                target.is_give_thumbs = new_data.is_active;
                            };

                            // 优化后的遍历逻辑
                            for (let i = 0; i < this.video_data_list.length; i++) {
                                const item = this.video_data_list[i];
                                if (item.id == id) {
                                    if (!isEmpty(comments_id)) {
                                        // 安全检查comments数组是否存在
                                        if (this.active_comments && Array.isArray(this.active_comments)) {
                                            for (let j = 0; j < this.active_comments.length; j++) {
                                                const comment = this.active_comments[j];
                                                if (comment.id == comments_id) {
                                                    updateThumbsStatus(comment, new_data);
                                                    return; // 找到后直接返回
                                                } else {
                                                    // 安全检查sub_comments数组是否存在
                                                    if (comment.sub_comments && Array.isArray(comment.sub_comments)) {
                                                        for (let k = 0; k < comment.sub_comments.length; k++) {
                                                            const sub_comment = comment.sub_comments[k];
                                                            
                                                            if (sub_comment.id == comments_id) {
                                                                updateThumbsStatus(sub_comment, new_data);
                                                                return; // 找到后直接返回
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        updateThumbsStatus(item, new_data);
                                    }
                                    break; // 处理完当前item后跳出外层循环
                                }
                            }
                            this.setData({
                                video_data_list: this.video_data_list
                            })
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    }
                });
            },
            handle_time_update(e) {
                if (this.is_seeking) return;
                let duration = this.current_video_duration;
                // #ifdef MP-ALIPAY
                if (e.detail.videoDuration > 0) {
                    duration = e.detail.videoDuration;
                }
                // #endif
                // #ifndef MP-ALIPAY
                if (e.detail.duration > 0) {
                    duration = e.detail.duration;
                }
                // #endif
                this.setData({
                    current_video_duration: duration,
                    current_video_progress: e.detail.currentTime,
                });
            },

            handle_slider_changing() {
                this.is_seeking = true;
            },
            // 主评论回复
            comment_reply(comments) {
                if (!isEmpty(comments)) {
                    this.setData({ 
                        input_placeholder: `@${comments.user.user_name_view}`,
                        comments_data: comments,
                    });
                }
            },
            // 评论点赞
            comment_like(id) {
                this.set_givethumbs_num(this.current_video_id, id);
            },
            handle_slider_change(e) {
                const seek_time = e.detail.value;
                if (this.create_video_contexts[this.current_index]) {
                    this.create_video_contexts[this.current_index].seek(seek_time);
                    this.setData({
                        current_video_progress: seek_time,
                    })
                }
                setTimeout(() => {
                    this.is_seeking = false;
                }, 100);
            },

            format_time(seconds) {
                if (isNaN(seconds) || seconds < 0) {
                    return '00:00';
                }
                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
            },
            handle_back() {
               app.globalData.page_back_prev_event();
            },
            handle_search() {
                // 跳转到搜索记录页面
                app.globalData.url_open(`/pages/plugins/video/search/search-record`, false);
            },
            // 关闭推荐商品
            product_close_event(e) {
                const id = e?.currentTarget?.dataset?.id || '';
                this.video_data_list.forEach((item) => {
                    if (item.id == id) {
                        item.show_goods = false;
                    }
                });
                this.setData({
                    video_data_list: this.video_data_list
                })
            },
            handle_product_card_item(e) {
                const id = e?.currentTarget?.dataset?.id || '';
                const data = this.video_data_list.find(item => item.id == id);
                if (!isEmpty(data) && !isEmpty(data.goods)) {
                    app.globalData.url_open(data.goods.goods_url);
                }
            },
            handle_product_button(e) {
                const id = e.currentTarget.dataset.id;
                this.video_data_list.forEach((item, index) => {
                    if (item.id == id) {
                        if (item.show_goods && !isEmpty(item.goods)) {
                            app.globalData.url_open(item.goods.goods_url);
                        } else {
                            item.show_goods = true;
                        }
                    }
                });
                this.setData({
                    video_data_list: this.video_data_list
                })
            },
            // 清理所有视频资源
            cleanup_all_videos() {
                try {
                    // 暂停所有视频
                    this.pause_all_videos_except(-1);
                    // 清空视频上下文数组
                    this.create_video_contexts = [];
                    this.video_contexts = [];
                    console.log('视频资源清理完成');
                } catch (error) {
                    console.error('清理视频资源时出错:', error);
                }
            },
            // 处理下拉菜单切换
            handle_toggle_dropdown(comment_id) {
                // 如果点击的是同一个组件，则切换状态；否则关闭其他组件并打开当前组件
                if (this.active_dropdown_id == comment_id) {
                    this.active_dropdown_id = null;
                } else {
                    this.active_dropdown_id = comment_id;
                }
            },
            
            // 关闭下拉菜单
            handle_dropdown_item_click(comment_id, obj) {
                if (this.active_dropdown_id == comment_id) {
                    this.active_dropdown_id = null;
                }
                // 处理不同操作
                if (obj.type == 'delete') {
                    // 确认删除
                    uni.showModal({
                        title: '确认删除',
                        content: '确定删除此评论吗？',
                        success: (res) => {
                            if (res.confirm) {
                                // 调用删除接口
                                this.delete_comment(comment_id);
                            }
                        }
                    });
                } else if (obj.type == 'report') {
                    // 举报评论
                    this.popup_report_status = true;
                    this.report_comment_id = comment_id;
                }
            },
            // 删除评论
            delete_comment(comment_id) {
                uni.request({
                    url: app.globalData.get_request_url("delete", "index", "video"),
                    method: 'POST',
                    data:  {
                        ids: comment_id,
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            // 删除评论数据
                            this.delete_comment_handle(comment_id);
                            // 显示删除成功提示
                            app.globalData.showToast(this.$t('common.del_success'));
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    }
                });
            },
            delete_comment_handle(comment_id) {
                // 删除成功，从active_comments中移除对应数据
                if (this.active_comments && Array.isArray(this.active_comments)) {
                    // 创建新的数组来存储过滤后的结果
                    const filteredComments = [];
                    
                    // 遍历所有评论
                    for (let i = 0; i < this.active_comments.length; i++) {
                        const comment = this.active_comments[i];
                        
                        // 如果是父级评论且id匹配，跳过整个评论（包括子评论）
                        if (comment.id == comment_id) {
                            continue;
                        }
                        
                        // 检查是否有子评论需要删除
                        if (comment.sub_comments && Array.isArray(comment.sub_comments)) {
                            // 过滤掉匹配的子评论
                            const filteredSubComments = comment.sub_comments.filter(
                                subComment => subComment.id != comment_id
                            );
                            
                            // 如果还有子评论或者本身就是有效的父级评论，则保留
                            if (filteredSubComments.length > 0 || comment.content) {
                                // 更新子评论数组
                                comment.sub_comments = filteredSubComments;
                                filteredComments.push(comment);
                            } 
                            // 更新显示的评论数
                            comment.comments_count = filteredSubComments.length;
                        } else {
                            // 没有子评论的情况，直接保留父级评论
                            filteredComments.push(comment);
                        }
                    }
                    // 删除之后更新评论数据
                    this.video_data_list.forEach(item => {
                        if (item.id == this.current_video_id) {
                            item.comments_count = filteredComments.length;
                        }
                    })
                    // 更新数据
                    this.setData({
                        active_comments: filteredComments,
                        video_data_list: this.video_data_list
                    })
                }
            },
            // 处理全局点击事件
            handle_global_click(e) {
                // 检查点击目标是否在下拉菜单相关元素内
                const target = e.target || e.srcElement;
                
                // 查找点击元素是否在comment-option或dropdown-menu内
                let isInDropdown = false;
                let currentElement = target;
                
                while (currentElement && currentElement !== document) {
                    // 检查是否点击了下拉菜单触发器或菜单本身
                    if (currentElement.classList && 
                        (currentElement.classList.contains('comment-option') || 
                         currentElement.classList.contains('dropdown-menu') ||
                         currentElement.closest('.comment-option') ||
                         currentElement.closest('.dropdown-menu'))) {
                        isInDropdown = true;
                        break;
                    }
                    currentElement = currentElement.parentNode;
                }
                
                // 如果点击的不是下拉菜单相关元素，则关闭所有下拉菜单
                if (!isInDropdown && this.active_dropdown_id !== null) {
                    this.active_dropdown_id = null;
                }
            },
            // 关闭举报弹窗
            popup_close_event() {
                this.setData({
                    popup_report_status: false,
                    current_main_index: 0,
                    current_sub_index: 0,
                });
            },
            // 新的举报弹窗相关方法
            onMain_reasonChange(e) {
                const value = parseInt(e.detail.value);
                this.setData({
                    current_main_index: value,
                    current_sub_index: -1,
                });
            },
            
            onSub_reasonChange(e) {
                const value = parseInt(e.detail.value);
                if (this.current_main_index >= 0) {
                    this.setData({
                        current_sub_index: value,
                    });
                }
            },
            
            // 直接选择主原因（用于一行显示的点击）
            select_main_reason(e) {
                const index = e?.currentTarget?.dataset?.index || 0;
                const main_index = parseInt(index);
                if (main_index !== this.current_main_index) {
                    this.setData({
                        current_main_index: main_index,
                        current_sub_index: 0, // 默认选中第一个子类型
                    });
                }
            },
            
            // 直接选择子类型（用于一行显示的点击）
            select_sub_reason(e) {
                const index = e?.currentTarget?.dataset?.index || 0;
                const sub_index = parseInt(index);
                if (sub_index !== this.current_sub_index) {
                    this.setData({
                        current_sub_index: sub_index,
                    });
                }
            },
            submit_report() {
                // 获取选中的举报原因和具体类型
                const main_reason = this.report_type_list[this.current_main_index];
                const sub_reason = main_reason.data[this.current_sub_index];
                // 调用举报接口
                uni.request({
                    url: app.globalData.get_request_url("report", "index", "video"),
                    method: 'POST',
                    data:  {
                        id: this.report_comment_id,
                        reason: main_reason.name,
                        type: sub_reason
                    },
                    dataType: 'json',
                    success: res => {
                        const data = res.data;
                        if (data.code == 0) {
                            // 显示删除成功提示
                            app.globalData.showToast('举报成功');
                            // 关闭弹窗
                            this.close_report_popup();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    }
                });
            },
            add_comment() {
                //#ifndef H5
                this.is_add_comment = true;
                //#endif
            },
            /**
             * 键盘高度变化监听处理
             * @param {Object} res - 键盘高度变化事件对象
             */
            listener(res) {
                console.log(res);
                // 减1是为了兼容，避免跟键盘之间会不连贯
                if (res.height > 0) {
                    this.listener_height = res.height - 1;
                } else {
                    this.listener_height = 0;
                }
            },
            /**
             * 绑定键盘高度变化监听事件
             */
            bind_keyboard_listener() {
                uni.onKeyboardHeightChange(this.listener);
            },
            /**
             * 解绑键盘高度变化监听事件
             */
            unbind_keyboard_listener() {
                uni.offKeyboardHeightChange(this.listener);
            },
        }
    };
</script>

<style lang="scss" scoped>
    .mt-10 {
        margin-top: 20rpx;
    }
    .ml-10 {
        margin-left: 20rpx;
    }
    .content,
    .swiper-container {
        width: 100%;
        height: 100vh;
    }

    .video {
        width: 100%;
        height: 100%;
    }

    .video-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .play-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        .play-icon-bg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            width: 60rpx;
            height: 60rpx;
            z-index: 0;
        }
        .play-icon-iconfont {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .right-actions {
        position: absolute;
        right: 20rpx;
        bottom: 200rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        z-index: 10;
    }

    .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40rpx;
    }

    .user-avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
    }

    .icon {
        width: 70rpx;
        height: 70rpx;
    }

    .action-text {
        font-size: 28rpx;
        margin-top: 10rpx;
    }

    .product-card {
        position: absolute;
        width: 440rpx;
        bottom: 180rpx;
        left: 30rpx;
        color: #fff;
        z-index: 99;
        .product-card-item {
            background: #DDDDDD;
            padding: 16rpx;
            border-radius: 8rpx;
        }
        .product-image {
            width: 100rpx;
            height: 100rpx;
        }
        .product-name {
            font-weight: 500;
            font-size: 28rpx;
            color: #333333;
            line-height: 40rpx;
        }
        .product-price {
            font-weight: 500;
            font-size: 32rpx;
            color: #FF1919;
            line-height: 44rpx;
        }
        .product-close {
            position: absolute;
            right: -10rpx;
            top: -14rpx;
        }
        .product-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 300rpx;
            height: 88rpx;
            padding: 0 20rpx;
            background: rgba(40, 40, 40, 0.45);
            border-radius: 88rpx;
            border: 2rpx solid rgba(151, 151, 151, 0.53);
            cursor: pointer;
        }
    }

    .author {
        font-size: 36rpx;
        font-weight: bold;
    }
    ::v-deep .uni-video-container {
        background: transparent;
    }
    .video-bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background: #000;
        background-size: cover;
        background-position: center;
        transform: scale(3);
        filter: blur(100rpx);
        opacity: 0.7;
    }

    .video-mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background: transparent;
    }

    .video-content {
        display: block;
        font-size: 30rpx;
        margin-top: 16rpx;
        max-width: 70%;
    }

    .progress-bar-container {
        position: absolute;
        bottom: 60rpx;
        left: 20rpx;
        right: 20rpx;
        display: flex;
        align-items: center;
        z-index: 11;
    }

    .progress-slider {
        flex: 1;
        margin: 0 20rpx;
    }

    .time-display {
        color: #fff;
        font-size: 24rpx;
        text-shadow: 2rpx 2rpx 2rpx rgba(0, 0, 0, 0.6);
        width: 180rpx;
        text-align: right;
    }
    
    /* 评论弹窗样式 */
    .comment-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
    
    .comment-content {
        width: 100%;
        height: 70%;
        background-color: #fff;
        border-top-left-radius: 30rpx;
        border-top-right-radius: 30rpx;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease;
    }
    
    .comment-header {
        padding: 30rpx;
        box-sizing: border-box;
        border-bottom: 2rpx solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .comment-count {
        font-weight: bold;
        font-size: 32rpx;
    }
    
    .close-btn {
        font-size: 40rpx;
        color: #999;
    }
    
    .comment-list {
        flex: 1;
        overflow: hidden;
        .comment-scroll {
            width: 100%;
            height: 100%;
            padding: 30rpx;
            box-sizing: border-box;
        }
    }
    
    .comment-item {
        margin-bottom: 30rpx;
    }
    
    .sub-comment {
        margin-left: 100rpx;
    }
    
    .sub-comment-list {
        gap: 40rpx;
    }
    .comment-input-container {
        display: flex;
        padding: 20rpx;
        border-top: 2rpx solid #eee;
    }
    
    .comment-input {
        flex: 1;
        font-size: 28rpx;
        height: 50rpx;
        padding: 16rpx;
        box-sizing: content-box;
    }
    
    .comment-input-content {
        flex: 1;
        border: 2rpx solid #eee;
        border-radius: 8rpx;
        padding-right: 16rpx;
        font-size: 28rpx;
    }
    .comment-input-img-container {
        padding: 10rpx 16rpx 16rpx 16rpx;
    }
    .comment-input-img-close {
        position: absolute;
        right: -10rpx;
        top: -10rpx;
        z-index: 2;
    }
    .comment-input-img {
        width: 50rpx;
        height: 50rpx;
    }

    /* 新的举报弹窗样式 */
    .report-content {
        width: 100%;
        max-width: 750rpx;
        background-color: #fff;
        border-radius: 20rpx;
    }

    .report-header {
        padding: 30rpx 40rpx;
        border-bottom: 1rpx solid #ddd;
        background-color: #fff;
    }

    .report-btn {
        font-size: 32rpx;
        color: #333;
    }

    .report-title {
        font-size: 36rpx;
        font-weight: bold;
        text-align: center;
        color: #333;
    }

    .report-body {
        padding: 30rpx 40rpx;
    }

    .report-section {
        margin-bottom: 30rpx;
    }

    .report-label {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
        color: #333;
    }

    .report-label text {
        color: #e74c3c;
        font-size: 30rpx;
        vertical-align: middle;
    }
    // 搜索
    .header-top {
        padding-left: 12px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
    }
    .header-top {
        ::v-deep .search-bar {
            background:#D8D8D8;
            opacity: 0.27;
            border-color: transparent;
        }
    }
    .keyboard-input {
        position: fixed;
        left: 0;
        z-index: 99;
        background: #fff;
        padding: 20rpx 16rpx;
        box-sizing: border-box;
    }
    .keyboard-input-border {
        padding: 16rpx 22rpx;
        border: 2rpx solid #ddd;
        border-radius: 50rpx;
    }
</style>

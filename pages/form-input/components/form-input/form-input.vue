<template>
    <view class="pr oh wh-auto ht-auto">
        <!-- #ifdef MP-ALIPAY -->
        <view :class="(overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1' ? 'scroll-box wh-auto' : 'ht wh-auto') + ' scroll-y ' + (overall_config.type_value == 'default' || z_index_id !== '' ? ' scroll-x-hidden' : ' scroll-x ')">
            <view :style="content_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">
                <template v-if="!isEmpty(img_url)">
                    <image :src="img_url" mode="aspectFit" />
                </template>
            </view>
            <view v-if="is_show_heading_title == '1'" class="head-title flex-row bg-white" :style="heading_title_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">{{ form_name }}</view>
            <view class="data-list bg-white" :style="overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;height:' + overall_config.custom_height * 2 + 'rpx')">
                <!-- form表单子组件显示 -->
                <form-input-base ref="componentForm" :propKey="propKey" :propConfig="propValue.config" :propDataFormId="propDataFormId" @onSubmitEvent="submit_event" />
            </view>
        </view>
        <!-- #endif -->
        <!-- #ifndef MP-ALIPAY -->
        <!-- 支付宝小程序 不支持同时上下左右滑动-->
        <scroll-view :scroll-top="scrollTop" :scroll-y="true" :scroll-x="overall_config.type_value == 'default' || z_index_id !== '' ? false : true" :class="overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1' ? 'scroll-box wh-auto' : 'ht wh-auto'" enable-flex lower-threshold="60" scroll-with-animation>
            <view class="pr wh-auto ht-auto">
                <template v-if="propIsMask">
                    <view class="scoll-mask"></view>
                </template>
                <view :style="content_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">
                    <template v-if="!isEmpty(img_url)">
                        <image :src="img_url" mode="aspectFit" />
                    </template>
                </view>
                <view v-if="is_show_heading_title == '1'" class="head-title flex-row bg-white" :style="heading_title_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">{{ form_name }}</view>
                <view class="data-list bg-white" :style="overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;height:' + overall_config.custom_height * 2 + 'rpx')">
                    <!-- form表单子组件显示 -->
                    <form-input-base ref="componentForm" :propKey="propKey" :propConfig="propValue.config" :propDataFormId="propDataFormId" @onSubmitEvent="submit_event" />
                </view>
            </view>
        </scroll-view>
        <!-- #endif -->
        <view v-if="overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1'"  class="bottom-fixed pr" :style="is_custom ? 'z-index: 99999;' : ''">
            <template v-if="propIsMask">
                <view class="scoll-mask"></view>
            </template>
            <view class="bottom-line-exclude">
                <view class="form-footer flex-row align-c">
                    <view class="save_draft_title flex-col jc-c align-c" @tap="top_nav_left_back_event">
                        <iconfont :name="'icon-' + back_icon" size="30rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                        {{ back_icon == 'back' ? $t('common.return') : $t('common.home') }}
                    </view>
                    <!-- <view class="bottom-line-back" @tap.stop="bottom_line_back">
                        <iconfont :name="'icon-' + back_icon" size="46rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                    </view> -->
                    <button v-if="overall_config.is_show_submit == '1'" class="flex-1 submit_title flex-row align-c jc-c" :style="'background:' + submit_bg_color" type="default" :disabled="is_submit_disable" @tap="on_submit_event">{{ overall_config.submit_title }}</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
import { isEmpty } from '@/common/js/common/common.js';
import formInputBase from '@/pages/form-input/components/form-input/form-input-base.vue';
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO
bar_height = 0;
// #endif
export default {
    name: 'formInput',
    components: {
        formInputBase
    },
    props: {
        propValue: {
            type: Object,
            default: () => ({}),
        },
        propDataFormId: {
            type: [String, Number],
            default: '',
        },
        propKey: {
            type: [String, Number],
            default: 0,
        },
        propIsMask: {
            type: Boolean,
            default: false,
        },
        propSuccessJumpUrl: {
            type: String,
            default: '',
        },
        propIsDebug: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            back_icon: 'home',
            data_list: [],
            form_name: '',
            img_url: '',
            content_style: '',
            is_show_heading_title: '',
            heading_title_style: '',
            overall_config: {},
            scrollTop: 0,
            submit_bg_color: '',
            z_index_id: '',
            is_custom: false,
            is_submit_disable: false,
            // 5,7,0 是误差,bar_height是不同小程序下的导航栏距离顶部的高度
            // #ifdef MP
            sticky_top: bar_height + 5,
            // #endif
            // #ifdef H5 || MP-TOUTIAO
            sticky_top: bar_height + 7,
            // #endif
            // #ifdef APP
            sticky_top: bar_height + 0,
            // #endif
        };
    },
    watch: {
        propKey(val) {
            // 初始化
            this.init();
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        isEmpty,
        init() {
            // 判断应该显示什么icon
            let pages = getCurrentPages();
            let length = pages.length;
            if (length > 1) {
                this.back_icon = 'back';
            } else {
                this.back_icon = 'back';
            }
            const data = this.propValue;
            // 公共配置信息
            const overall_config = data.config?.overall_config || {};
            const mobile = overall_config?.style_settings?.mobile || {};
            this.setData({
                z_index_id: '',
                form_name: data.name,
                overall_config: overall_config,
                img_url: mobile?.heading_image && mobile?.heading_image.length > 0 ?  mobile?.heading_image[0]?.url || '' : '',
                content_style: `padding-top:${ this.sticky_top }px;min-height:64rpx;background: ${ mobile.heading_color };`,
                is_show_heading_title: mobile.is_show_heading_title || '0',
                heading_title_style: `justify-content:${ mobile.heading_title_location };color:${ mobile.heading_title_color };font-size:${ mobile.heading_title_size }px;font-weight:${ mobile.heading_title_font_weight };`,
                submit_bg_color: mobile.submit_color || '#fff',
                is_custom: overall_config.type_value == 'free',
            });
            // 
            setTimeout(() => {
                this.setData({
                    scrollTop: 0.01
                })
            }, 500);
        },
        // 返回事件
        top_nav_left_back_event(e) {
            app.globalData.page_back_prev_event();
        },
        /*
        * 点击提交按钮触发方法
        */
        on_submit_event() { 
            this.$refs.componentForm.on_submit_event();
        },
        /*
        * 表单校验完成之后返回的数据内容
        */
        submit_event(e) {
            const { type = 'success', message = '', submit_data = {}} = e;
            if (type == 'error') {
                app.globalData.showToast(message);
            } else {
                const params = {
                    forminput_id: this.propDataFormId,
                    ...submit_data
                }
                this.setData({
                    is_submit_disable: true
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'forminputdata'),
                    method: 'POST',
                    data: params,
                    dataType: 'json',
                    success: (res) => {
                        this.setData({
                            is_submit_disable: false
                        });
                        if (res.data.code == 0) {
                            app.globalData.showToast('提交成功', 'success');
                            if(!this.propIsDebug) {
                                var pages = app.globalData.prev_page();
                                if (pages) {
                                    setTimeout(function () {
                                        uni.navigateBack();
                                    }, 1000);
                                } else {
                                    if((this.propSuccessJumpUrl || null) != null) {
                                        var url = this.propSuccessJumpUrl;
                                        setTimeout(function () {
                                            app.globalData.url_open(url);
                                        }, 1000);
                                    }
                                }
                            }
                        } else {
                            app.globalData.showToast('提交失败');
                        }
                    },
                    fail: (res) => {
                        this.setData({
                            is_submit_disable: false
                        });
                        app.globalData.showToast('提交失败');
                    }
                });
            }
        },
        z_index_change(e) {
            this.setData({
                z_index_id: e
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.head-title { 
    word-wrap: break-word;
    font-size: 40rpx;
    padding: 16rpx 11rpx 0;
    box-sizing: border-box;
    word-break: break-word;
}
.scroll-box {
    height: calc(100vh - 110rpx);
}
.bottom-fixed { 
    background: #fff;
    width: 100%;
    border-top: 2rpx solid #eee;
    .save_draft_title {
        min-width: 120rpx;
        font-size: 24rpx;
        // margin: 0 20rpx 0 0;
    }
    .submit_title {
        text-align: center;
        height: 64rpx;
        color: #fff;
        border-radius: 40rpx;
        font-size: 32rpx;
    }
}
.data-list {
    padding: 15rpx 0;
}
.popup-content {
    background: #fff;
    padding: 32rpx;
    border-radius: 10rpx;
}
.scroll-y {
    overflow-y: auto;
    scroll-behavior: smooth; /* 使滚动更加平滑 */
}
.scroll-x-hidden {
    overflow-x: hidden;
}
.scroll-x {
    overflow-x: auto;
    scroll-behavior: smooth; /* 使滚动更加平滑 */
}
.scoll-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 999;
}
// 返回按钮的显示逻辑
.bottom-line-back {
    margin-right: 20rpx;
}
</style>
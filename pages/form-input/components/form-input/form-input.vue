<template>
    <view class="pr oh wh-auto ht-auto">
        <view :class="(overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1' ? 'scroll-box wh-auto' : 'ht wh-auto') + ' scroll-y ' + (overall_config.type_value == 'default' || z_index_id !== '' ? ' scroll-x-hidden' : ' scroll-x ')">
            <view :style="content_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">
                <template v-if="!isEmpty(img_url)">
                    <image :src="img_url" mode="aspectFit" />
                </template>
            </view>
            <view v-if="is_show_heading_title == '1'" class="head-title flex-row bg-white" :style="heading_title_style + (overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;'))">{{ form_name }}</view>
            <view class="data-list bg-white" :style="overall_config.type_value == 'default' ? '' : ('width:' + overall_config.custom_width * 2 + 'rpx;height:' + overall_config.custom_height * 2 + 'rpx')">
                <!-- form表单子组件显示 -->
                <form-input-base ref="componentForm" :propValue="propValue" :propDataFormId="propDataFormId" @submitData="submit_data" />
            </view>
        </view>
        <!-- 支付宝小程序 不支持同时上下左右滑动-->
        <!-- <scroll-view :scroll-top="scrollTop" :scroll-y="true" :scroll-x="overall_config.type_value == 'default' || z_index_id !== '' ? false : true" :class="overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1' ? 'scroll-box wh-auto' : 'ht wh-auto'"  enable-flex lower-threshold="60" scroll-with-animation>  -->
        <!-- </scroll-view> -->
        <view v-if="overall_config.is_show_save_draft == '1' || overall_config.is_show_submit == '1'"  class="bottom-fixed" :style="is_custom ? 'z-index: 99999;' : ''">
            <view class="bottom-line-exclude">
                <view class="form-footer flex-row align-c">
                    <view v-if="overall_config.is_show_save_draft == '1'" class="save_draft_title flex-col jc-c align-c">
                        <iconfont name="icon-detail" size="30rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                        {{ overall_config.save_draft_title }}
                    </view>
                    <button v-if="overall_config.is_show_submit == '1'" class="flex-1 submit_title flex-row align-c jc-c" :style="'background:' + submit_bg_color" type="default" :disable="is_submit_disable" @tap="submit_click">{{ overall_config.submit_title }}</button>
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
    },
    data() {
        return {
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
        submit_click() { 
            this.$refs.componentForm.submit_click();
        },
        submit_data(e) {
            const { type = 'success', message = '', submit_data = {}} = e;
            if (type == 'error') {
                app.globalData.showToast(message, 'error');
            } else {
                const params = {
                    forminput_id: this.propDataFormId,
                    ...submit_data
                }
                this.is_submit_disable = true;
                uni.request({
                    url: app.globalData.get_request_url('save', 'forminputdata'),
                    method: 'POST',
                    data: params,
                    dataType: 'json',
                    success: (res) => {
                        this.is_submit_disable = false;
                        app.globalData.showToast('提交成功', 'success');
                    },
                    fail: (res) => {
                        this.is_submit_disable = false;
                        app.globalData.showToast('提交失败', 'error');
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
        min-width: 180rpx;
        font-size: 24rpx;
    }
    .submit_title {
        text-align: center;
        height: 64rpx;
        color: #fff;
        border-radius: 40rpx;
        font-size: 32rpx;
        margin: 0 0 0 20rpx;
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
}
.scroll-x-hidden {
    overflow-x: hidden;
}
.scroll-x {
    overflow-x: auto;
}
</style>
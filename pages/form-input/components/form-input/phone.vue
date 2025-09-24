<template>
    <view>
        <view :class="'flex-col' + (propDirection == 'row' ? '' : ' gap-10')">
            <view class="flex-row align-c gap-5" :style="com_data.common_style + propStyle">
                <iconfont :name="'icon-' + com_data.icon_name" size="24rpx" color="#666" propContainerDisplay="flex" ></iconfont>
                <input :value="form_value" class="uni-input flex-1" :style="propStyle" type="text" :placeholder="placeholder" placeholder-style="color: gray;" @blur="data_check" @input="input_value_event" />
            </view>
            <view v-if="propDirection == 'row' && com_data.is_sms_verification == '1'" class="verify-submi-border"></view>
            <view v-if="com_data.is_sms_verification == '1'" class="flex-row gap-10">
                <input :value="form_value_code" class="uni-input flex-1" :style="com_data.common_style + propStyle" type="text" placeholder="请输入验证码" placeholder-style="color: gray;" @blur="data_code_check" @input="input_code_value_event" />
                <button :class="'uni-button flex-row align-c' + (verify_submit_disabled ? 'verify_disabled' : '')" :style="propStyle + 'height:auto;'" type="default" :disabled="verify_submit_disabled" @click="verify_send_event">{{ verify_submit_text }}</button>
            </view>
        </view>
        <!-- 图片验证码弹层 -->
        <component-popup :propShow="popup_image_verify_status" propPosition="bottom" @onclose="popup_image_verify_close_event">
            <view class="bg-white padding-horizontal-main padding-top-main">
                <view class="fr oh">
                    <view class="fr" @tap.stop="popup_image_verify_close_event">
                        <iconfont name="icon-close-line" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="form-content margin-top-xxxl padding-top-xxl">
                    <view class="verify pr margin-vertical-main">
                        <input type="text" :placeholder="$t('login.login.t3951j')" name="verify" maxlength="4" :value="form_input_image_verify_value" @input="form_input_image_verify_event" />
                        <image v-if="(verify_image_url || null) != null" :src="verify_image_url" class="verify-image pa" mode="aspectFit" data-type="sms" @tap.stop="image_verify_event"></image>
                    </view>
                    <view class="margin-top-xxxl margin-bottom-xxxl">
                        <button :class="'bg-main br-main cr-white round text-size' + ( verify_disabled ? ' verify_disabled' : '')" type="default" @tap.stop="popup_image_verify_submit_event" hover-class="none" :disabled="verify_disabled">{{ $t('common.confirm') }}</button>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>

<script>
    import { get_format_checks, isEmpty } from '@/common/js/common/common.js';
    import componentPopup from '@/components/popup/popup';
    const app = getApp();
    export default {
        components: {
            componentPopup,
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propKey: {
                type: [String, Number],
                default: 0,
            },
            propDataFormId: {
                type: [String, Number],
                default: '',
            },
            propDataId: {
                type: String,
                default: '',
            },
            propStyle: {
                type: String,
                default: '',
            },
            propDirection: {
                type: String,
                default: 'row',
            },
        },
        data() {
            return {
                placeholder: '请输入内容...',
                form_value: '',
                form_value_code: '',
                com_data: {},
                decimal_num: 0,
                is_thousandths_symbol: '0',
                format: '',
                popup_image_verify_status: false,
                form_input_image_verify_value: '',
                verify_image_url: '',
                verify_disabled: false,
                verify_submit_disabled: false,
                verify_time_total: 60,
                temp_clear_time: null,
            };
        },
        watch: {
            // propValue: {
            //     handler(newVal) {
            //         this.init();
            //     },
            //     deep: true
            // },
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
                const com_data = this.propValue;
                if (com_data.is_img_sms_verification == '1') {
                    this.image_verify_event('sms');
                }
                this.setData({
                    com_data: com_data,
                    placeholder: com_data.placeholder,
                    form_value: com_data?.form_value || '', 
                    form_value_code: com_data?.form_value_code || '',
                    format: com_data.format,
                    verify_submit_text: this.$t('login.login.s665h5'),
                    verify_submit_disabled: this.get_data_check(com_data?.form_value || '') ? false : true,
                });
            },
            get_data_check(val) {
                const data = this.propValue;
                if (data) {
                    data.common_config.format = data.is_telephone === '1' ? 'telephone-number' : 'phone-number';
                }
                const { is_error = '0' } = get_format_checks(data, val, true);
                return !isEmpty(val) && is_error === '0';
            },
            data_check() {
                const data = this.com_data;
                if (data) {
                    data.common_config.format = data.is_telephone === '1' ? 'telephone-number' : 'phone-number';
                }
                const { is_error = '0', error_text = '' } = get_format_checks(data, this.form_value, true);
                this.$emit('dataCheck', { is_error, error_text, value: this.form_value, id: this.propDataId });
            },
            data_code_check() {
                let is_error = '0';
                let error_text = '';
                if (this.com_data.is_required == '1' && isEmpty(this.form_value_code)) {
                    // 是否报错显示
                    is_error = '1';
                    error_text = '短信验证码不能为空';
                }
                this.$emit('dataCodeCheck', { is_error, error_text, value: this.form_value_code, id: this.propDataId });
            },
            verify_send_event() {
                if (this.com_data.is_img_sms_verification == '1') {
                    this.setData({
                        form_input_image_verify_value: '',
                        popup_image_verify_status: true,
                        verify_disabled: true,
                    });
                    // 进行操作时，将当前组件的层级调到最高，避免弹出框被其他的盖住
                    this.z_index_change(this.propDataId);
                } else {
                    this.verify_send_handle();
                }
            },
            // 图片验证码事件
            image_verify_event(e) {
                var type = typeof e == 'string' ? e : e.currentTarget.dataset.type || null;
                if (type !== null) {
                    var tv = app.globalData.get_timestamp();
                    var url = app.globalData.get_request_url('verifyentry', 'forminput', '', 'type=' + type + '&t=' + tv);
                    this.setData({
                        verify_image_url: url,
                    });
                }
            },
            // 输入图片验证码事件
            form_input_image_verify_event(e) {
                if (e.detail.value.length == 4) {
                    this.setData({
                        verify_disabled: false,
                    });
                } else {
                    this.setData({
                        verify_disabled: true,
                    });
                }
                this.setData({
                    form_input_image_verify_value: e.detail.value,
                });
            },
            // 弹层图片验证码关闭
            popup_image_verify_close_event(e) {
                this.setData({
                    popup_image_verify_status: false,
                });
                this.z_index_change('');
            },
            popup_image_verify_submit_event() {
                this.verify_send_handle();
            },
            verify_send_handle() {
                const post_data = {
                    forminput_id: this.propDataFormId,
                    forminput_item_id: this.propDataId,
                    accounts: this.form_value, 
                    type: 'sms', 
                    verify: this.com_data.is_img_sms_verification == '1' ? this.form_input_image_verify_value : ''
                }
                let self = this;
                uni.request({
                    url: app.globalData.get_request_url('verifysend', 'forminput'),
                    method: 'POST',
                    data: post_data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            // 是否开启图片验证码
                            if (self.com_data.is_img_sms_verification == '1') {
                                self.setData({
                                    popup_image_verify_status: false,
                                });
                                self.z_index_change('');
                            }
                            // 倒计时处理
                            var temp_time = this.verify_time_total;
                            this.temp_clear_time = setInterval(function () {
                                if (temp_time <= 1) {
                                    clearInterval(self.temp_clear_time);
                                    self.setData({
                                        verify_submit_text: self.$t('login.login.s665h5'),
                                        verify_disabled: false,
                                    });
                                } else {
                                    temp_time--;
                                    self.setData({
                                        verify_submit_text: self.$t('login.login.n24i5u') + temp_time + self.$t('login.login.4306xr'),
                                    });
                                }
                            }, 1000);
                        } else {
                            self.setData({
                                verify_submit_text: self.$t('login.login.s665h5'),
                                verify_disabled: false,
                                form_input_image_verify_value: '',
                            });
                            // 是否开启图片验证码
                            if (self.com_data.is_img_sms_verification == '1') {
                                self.image_verify_event('sms');
                            }
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.setData({
                            verify_submit_text: self.$t('login.login.s665h5'),
                            verify_disabled: false,
                            form_input_image_verify_value: '',
                        });
                        // 是否开启图片验证码
                        if (self.com_data.is_img_sms_verification == '1') {
                            self.image_verify_event('sms');
                        }
                        app.globalData.showToast(self.$t('common.internet_error_tips'));
                    },
                });
            },
            input_value_event(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value: e.detail.value,
                    verify_submit_disabled: this.get_data_check(e.detail.value) ? false : true,
                });
                this.$emit('dataChange', { value: e.detail.value, id: this.propDataId });
            },
            input_code_value_event(e) {
                // 重新编辑一下历史数据
                this.setData({
                    form_value_code: e.detail.value,
                });
                this.$emit('dataCodeChange', { value: e.detail.value, id: this.propDataId });
            },
            /**
             * 有值的时候就是将当前组件的层级调到最高，没有值的时候就是将当前组件的层级调回原样，避免弹出框出来的时候被其他组件盖住或悬浮在弹出框外部
             */
            z_index_change(e) {
                // 如果为空的时候延时关闭，避免因为关闭动画效果导致其他组件提前显示
                if (e == '') {
                    setTimeout(() => {
                        this.$emit('zIndexChange', e);
                    }, 400)
                } else {
                    this.$emit('zIndexChange', e);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.number-icon {
    color: #ccc;
}
.uni-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200rpx;
    border: 2rpx solid #ccc;
}
.verify_disabled {
    opacity: 0.6;
}
.form-content .verify input {
    width: 63%;
    height: 50px;
    line-height: 50px;
    padding: 0 36rpx;
    box-sizing: border-box;
}
.form-content .verify {
    height: 50px;
    line-height: 50px;
    background: #F9F9F9;
    border-radius: 25px;
    border: 0;
}
.form-content .verify .verify-image {
    width: 35%;
    height: 50px;
    line-height: 50px;
    top: 0;
    right: 36rpx;
}
.verify-submi-border {
    border-top: 2rpx solid #eee;
    margin: 10rpx 0;
}
</style>
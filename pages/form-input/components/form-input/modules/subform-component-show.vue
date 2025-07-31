<template>
    <view class="wh-auto ht-auto pr">
        <view v-for="(item, index) in data_list" :key="index" :class="(propDirection == 'row' ? 'row-item ' : 'column-item mb-10 ') + (item.com_data.common_config.is_error == '1' ? ' item_error' : '')" :data-id="item.id" :data-location-x="item.location.x" :data-location-y="item.location.y" :style="(item.key == 'auxiliary-line' ? 'border-bottom: 0rpx; ' : '')">
            <view :class="'wh-auto ht-auto ' + (propDirection == 'row' ? (['video', 'img', 'upload-img', 'upload-video', 'multi-text'].includes(item.key) ? 'flex-row align-s gap-10' : 'flex-row align-b gap-10')  : 'flex-col gap-10')">
                <view v-if="!['auxiliary-line', 'upload-attachments', 'subform'].includes(item.key)" class="field-label flex-row align-c gap-10" :style="propFieldLabelStyle + (propDirection == 'row' && ['upload-img', 'upload-video'].includes(item.key) ? 'padding-top: 12rpx;line-height: 120rpx;' : '') + (propDirection == 'row' && ['multi-text'].includes(item.key) ? 'padding-top: 18rpx;' : '')">
                    <view class="flex-row align-c" :style="propTitleStyle">{{ item.com_data.title }}<view v-if="item.com_data.is_required && item.com_data.is_required == '1'" class="required">*</view></view>
                    <view v-if="item.com_data.common_config.help_is_show == '1' && !isEmpty(item.com_data.common_config.help_explain)" :data-value="item.com_data.common_config.help_explain" @tap="help_icon_event">
                        <iconfont name="icon-miaosha-hdgz" :size="propHelpIconStyle" color="#999"></iconfont>
                    </view>
                </view>
                <view :class="'flex-1 wh-auto ht-auto flex-col gap-5 ' + (['date', 'date-group', 'upload-img', 'upload-video'].includes(item.key) ? '' : 'oh')">
                    <!-- 输入框 -->
                    <view v-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'single-text'" :style="item.com_data.common_style">
                        <component-input :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change"></component-input>
                    </view>
                    <!-- 多行输入框 -->
                    <view v-else-if="item.key == 'multi-text'" :style="item.com_data.common_style + 'padding: 18rpx 22rpx;'">
                        <component-textarea :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change"></component-textarea>
                    </view>
                    <!-- 复选按钮组 -->
                    <view v-else-if="['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'checkbox' && propDirection !== 'row'">
                        <component-checkbox :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change" @dataOptionChange="data_option_change"></component-checkbox>
                    </view>
                    <!-- 单选按钮组 -->
                    <view v-else-if="['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'radio-btns' && propDirection !== 'row'">
                        <component-radio :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change"></component-radio>
                    </view>
                    <!-- 下拉框 -->
                    <view v-else-if="(['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'select') || (['single-text', 'radio-btns', 'select'].includes(item.key) && item.com_data.type == 'radio-btns' && propDirection == 'row')" :style="item.com_data.common_style">
                        <component-select :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propDirection="propDirection" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change"></component-select>
                    </view>
                    <!-- 下拉复选框 -->
                    <view v-else-if="(['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'select-multi') || (['select-multi', 'checkbox'].includes(item.key) && item.com_data.type == 'checkbox' && propDirection == 'row')" :style="item.com_data.common_style">
                        <component-select-multi :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propDirection="propDirection" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change" @dataOptionChange="data_option_change" @zIndexChange="z_index_change"></component-select-multi>
                    </view>
                    <!-- 数字 -->
                    <view v-else-if="item.key == 'number'" :style="item.com_data.common_style">
                        <component-number :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change"></component-number>
                    </view>
                    <!-- 时间选择器 -->
                    <view v-else-if="item.key == 'date'" :style="item.com_data.common_style">
                        <component-date :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change"></component-date>
                    </view>
                    <!-- 时间选择器组 -->
                    <view v-else-if="item.key == 'date-group'" :style="item.com_data.common_style">
                        <component-date-group :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change"></component-date-group>
                    </view>
                    <!-- 地址选择器 -->
                    <view v-else-if="item.key == 'address'">
                        <component-address :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataCheck="data_check" @dataChange="data_change" @regionEvent="region_event" @dataAddressChange="data_address_change" @zIndexChange="z_index_change"></component-address>
                    </view>
                    <!-- 手机 -->
                    <view v-else-if="item.key == 'phone'">
                        <component-phone :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataCheck="data_check" @dataChange="data_change" @zIndexChange="z_index_change"></component-phone>
                    </view>
                    <!-- 密码 -->
                    <view v-else-if="item.key == 'pwd'" :style="item.com_data.common_style">
                        <component-pwd :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataCheck="data_check" @dataChange="data_change"></component-pwd>
                    </view>
                    <!-- 评分 -->
                    <view v-else-if="item.key == 'score'">
                        <component-score :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataCheck="data_check" @dataChange="data_change"></component-score>
                    </view>
                    <!-- 图片 -->
                    <view v-else-if="item.key == 'img'">
                        <component-image :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection"></component-image>
                    </view>
                    <!-- 视频 -->
                    <view v-else-if="item.key == 'video'">
                        <component-video :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection"></component-video>
                    </view>
                    <!-- 文本 -->
                    <view v-else-if="item.key == 'text'">
                        <component-text :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection"></component-text>
                    </view>
                    <!-- 文件 -->
                    <view v-else-if="item.key == 'attachments'">
                        <component-attachments :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection"></component-attachments>
                    </view>
                    <!-- 分割线 -->
                    <view v-else-if="item.key == 'auxiliary-line'">
                        <component-auxiliary-line :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection"></component-auxiliary-line>
                    </view>
                    <!-- 上传视频或图片 -->
                    <view v-else-if="['upload-img', 'upload-video'].includes(item.key)" :class="propDirection == 'row' ? 'padding-vertical-sm' : ''">
                        <component-upload :propValue="item.com_data" :propType="item.key == 'upload-img' ? 'img' : ( item.key == 'upload-video' ? 'video' : 'file')" :propKey="propKey" :propDataFormId="propDataFormId" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataChange="data_change"></component-upload>
                    </view>
                    <!-- 定位 -->
                    <view v-else-if="item.key == 'position'">
                        <component-position :propValue="item.com_data" :propKey="propKey" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataChange="data_change"></component-position>
                    </view>
                    <!-- #ifdef H5 || MP-WEIXIN || MP-QQ -->
                    <!-- 上传文件 -->
                    <view v-else-if="item.key == 'upload-attachments'">
                        <component-upload :propValue="item.com_data" propType="file" :propKey="propKey" :propDataFormId="propDataFormId" :propDataId="item.id" :propMobile="propMobile" :propStyle="propComponentStyle" :propDirection="propDirection" @dataChange="data_change"></component-upload>
                    </view>
                    <!-- #endif -->
                    <view v-if="!isEmpty(item.com_data.common_config.error_text)" class="field-invalid-info">{{ item.com_data.common_config.error_text }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script> 
import { isEmpty } from '@/common/js/common/common.js';
import componentInput from '@/pages/form-input/components/form-input/input.vue';
import componentTextarea from '@/pages/form-input/components/form-input/textarea.vue';
import componentCheckbox from '@/pages/form-input/components/form-input/checkbox.vue';
import componentRadio from '@/pages/form-input/components/form-input/radio.vue';
import componentSelect from '@/pages/form-input/components/form-input/select.vue';
import componentNumber from '@/pages/form-input/components/form-input/number.vue';
import componentDate from '@/pages/form-input/components/form-input/date.vue';
import componentDateGroup from '@/pages/form-input/components/form-input/date-group.vue';
import componentAddress from '@/pages/form-input/components/form-input/address.vue';
import componentSelectMulti from '@/pages/form-input/components/form-input/select-multi.vue';
import componentPhone from '@/pages/form-input/components/form-input/phone.vue';
import componentPwd from '@/pages/form-input/components/form-input/pwd.vue';
import componentScore from '@/pages/form-input/components/form-input/score.vue';
import componentImage from '@/pages/form-input/components/form-input/image.vue';
import componentVideo from '@/pages/form-input/components/form-input/video.vue';
import componentText from '@/pages/form-input/components/form-input/text.vue';
import componentAttachments from '@/pages/form-input/components/form-input/attachments.vue';
import componentAuxiliaryLine from '@/pages/form-input/components/form-input/auxiliary-line.vue';
import componentRichText from '@/pages/form-input/components/form-input/rich-text.vue';
import componentUpload from '@/pages/form-input/components/form-input/upload.vue';
import componentPosition from '@/pages/form-input/components/form-input/position.vue';
import componentRectOrRound from '@/pages/form-input/components/form-input/rect-or-round.vue';
import componentSubform from '@/pages/form-input/components/form-input/subform.vue';
export default {
    name: 'formInput',
    components: {
        componentInput,
        componentTextarea,
        componentCheckbox,
        componentRadio,
        componentNumber,
        componentSelect,
        componentSelectMulti,
        componentDate,
        componentDateGroup,
        componentAddress,
        componentPhone,
        componentPwd,
        componentScore,
        componentImage,
        componentVideo,
        componentText,
        componentAttachments,
        componentAuxiliaryLine,
        componentRichText,
        componentUpload,
        componentPosition,
        componentRectOrRound,
        componentSubform
    },
    props: {
        propValue: {
            type: Array,
            default: () => [],
        },
        propFieldLabelStyle: {
            type: String,
            default: '',
        },
        propTitleStyle: {
            type: String,
            default: '',
        },
        propHelpIconStyle: {
            type: String,
            default: '',
        },
        propDataFormId: {
            type: [String, Number],
            default: '',
        },
        propKey: {
            type: [String, Number],
            default: 0,
        },
        propDirection: {
            type: String,
            default: 'row',
        },
        propMobile: {
            type: Object,
            default: () => {},
        },
        propComponentStyle: {
            type: String,
            default: '',
        },
        propIndex: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            data_list: [],
        }
    },
    watch: {
        propValue: {
            handler(newVal) {
                this.init();
            },
            deep: true
        },
        propKey(val) {
           this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        isEmpty,
        init() {
            this.setData({
                data_list: this.propValue,
            })
        },
        help_icon_event(e) {
            this.$emit('helpIconEvent', e.currentTarget.dataset.value);
        },
        data_change(e) {
            this.$emit('dataChange', e, this.propIndex);
        },
        data_check(e) {
            this.$emit('dataCheck', e, this.propIndex);
        },
        data_option_change(e) {
            this.$emit('dataOptionChange', e, this.propIndex);
        },
        open_region(e) {
            this.$emit('openRegion', e, this.propIndex);
        },
        region_event(e) {
            this.$emit('regionEvent', e, this.propIndex);
        },
        z_index_change(e) {
            this.$emit('zIndexChange', e);
        }
    }
}
</script>

<style lang="scss" scoped>
.row-item {
    padding: 10rpx 15rpx;
    border-bottom: 2rpx solid #eee;
    overflow: hidden;
}
.row-item:last-child {
    border-bottom: none;
}
.column-item {
    padding: 20rpx 15rpx;
    padding-bottom: 20rpx;
}
.item_error {
    background: #fef6e6;
}
.field-invalid-info {
    color: #FF5353;
    font-size: 24rpx;
    line-height: 40rpx;
}
.required {
    color: #FF5353;
    font-weight: 700;
    padding-left: 6rpx;
}
</style>
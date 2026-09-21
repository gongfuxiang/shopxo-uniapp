<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <form @submit="form_submit" class="form-container">
                <view class="padding-main page-bottom-fixed">
                    <view class="bg-white border-radius-main oh spacing-mb">
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{ $t('staff-profile.avatar') }}</view>
                            <view class="margin-top-main">
                                <component-upload :propData="avatar_list" :propMaxNum="1" :propPathType="editor_path_type" @call-back="avatar_upload_event"></component-upload>
                            </view>
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{ $t('staff-profile.photo') }}<text class="form-group-tips">{{ $t('staff-profile.photo_tips') }}</text></view>
                            <view class="margin-top-main">
                                <component-upload :propData="photo_list" :propMaxNum="30" :propPathType="editor_path_type" @call-back="photo_upload_event"></component-upload>
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.alias') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="alias" :value="form_data.alias || ''" maxlength="16" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.alias_placeholder')" />
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.specialty') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="specialty" :value="form_data.specialty || ''" maxlength="255" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.specialty_placeholder')" />
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.work_years') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="number" name="work_years" :value="form_data.work_years || ''" maxlength="2" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.work_years_placeholder')" />
                                <text class="cr-grey text-size-sm">{{ $t('staff-profile.work_years_unit') }}</text>
                            </view>
                        </view>
                        <view class="form-gorup">
                            <view class="form-gorup-title">{{ $t('staff-profile.introduce') }}</view>
                            <textarea name="introduce" placeholder-class="cr-grey-9" class="cr-base margin-top-sm" :placeholder="$t('staff-profile.introduce_placeholder')" maxlength="2000" :value="form_data.introduce || ''"></textarea>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.gender') }}</view>
                            <view class="flex-row jc-e align-c flex-1 flex-width">
                                <picker @change="gender_change_event" :value="gender_index" :range="gender_list" range-key="name" name="gender" class="margin-right-sm wh-auto tr">
                                    <view class="uni-input cr-base picker">
                                        <text v-if="(gender_list[gender_index] || null) == null">{{ $t('staff-profile.select_gender') }}</text>
                                        <text v-else>{{ gender_list[gender_index].name }}</text>
                                    </view>
                                </picker>
                                <iconfont name="icon-arrow-right" size="34rpx" color="#ccc"></iconfont>
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.birthday') }}</view>
                            <view class="flex-1 flex-width flex-row jc-e align-c">
                                <picker class="margin-right-sm wh-auto tr" name="birthday" mode="date" :value="form_data.birthday || ''" @change="birthday_change_event">
                                    <view :class="'picker ' + ((form_data.birthday || null) == null ? 'cr-grey' : '')">{{ form_data.birthday || $t('staff-profile.select_birthday') }}</view>
                                </picker>
                                <iconfont name="icon-arrow-right" size="34rpx" color="#ccc"></iconfont>
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.height') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="number" name="height" :value="form_data.height || ''" maxlength="3" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.height_placeholder')" />
                                <text class="cr-grey text-size-sm">cm</text>
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.nation') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="nation" :value="form_data.nation || ''" maxlength="30" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.nation_placeholder')" />
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.native_place') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="native_place" :value="form_data.native_place || ''" maxlength="60" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.native_place_placeholder')" />
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.mobile') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="number" name="mobile" :value="form_data.mobile || ''" maxlength="11" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.mobile_placeholder')" />
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">{{ $t('staff-profile.email') }}</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="email" :value="form_data.email || ''" maxlength="60" placeholder-class="cr-grey-9 tr" class="cr-base tr margin-right-sm" :placeholder="$t('staff-profile.email_placeholder')" />
                            </view>
                        </view>
                        <view class="form-gorup oh flex-row jc-sb align-c">
                            <view class="form-gorup-title">
                                {{ $t('staff-profile.is_booking_enable') }}
                                <text class="form-group-tips">{{ $t('staff-profile.is_booking_enable_tips') }}</text>
                            </view>
                            <switch :color="theme_color" :checked="(form_data.is_booking_enable || 0) == 1" @change="booking_enable_change_event" style="transform:scale(0.8)" />
                        </view>
                    </view>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{ $t('common.save') }}</button>
                    </view>
                </view>
            </form>
        </block>
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentUpload from '@/components/upload/upload';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                form_submit_disabled_status: false,
                form_data: {},
                gender_list: [],
                gender_index: 0,
                avatar_list: [],
                photo_list: [],
                editor_path_type: '',
                theme_color: app.globalData.get_theme_color(),
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentUpload,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 初始化
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        methods: {
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('common.please_login_first'),
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('profileinfo', 'staffuser', 'realstore'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0 && (res.data.data || null) != null) {
                            var data = res.data.data.data || {};
                            var gender_list = res.data.data.gender_list || [];
                            var gender_index = 0;
                            for (var i in gender_list) {
                                if (parseInt(gender_list[i].id) === parseInt(data.gender || 0)) {
                                    gender_index = parseInt(i);
                                    break;
                                }
                            }
                            var photo_list = [];
                            if ((data.photo || null) != null && data.photo.length > 0) {
                                for (var i in data.photo) {
                                    if ((data.photo[i].images || null) != null) {
                                        photo_list.push(data.photo[i].images);
                                    }
                                }
                            }
                            uni.setNavigationBarTitle({
                                title: res.data.data.edit_staff_profile || this.$t('staff-profile.page_title'),
                            });
                            this.setData({
                                data_list_loding_status: 3,
                                form_data: data,
                                gender_list: gender_list,
                                gender_index: gender_index,
                                avatar_list: (data.avatar || null) == null || data.avatar == '' ? [] : [data.avatar],
                                photo_list: photo_list,
                                editor_path_type: res.data.data.editor_path_type || '',
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg || this.$t('staff-order.not_staff'),
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 头像上传回调
            avatar_upload_event(e) {
                this.setData({
                    avatar_list: e || [],
                });
            },

            // 相册上传回调
            photo_upload_event(e) {
                this.setData({
                    photo_list: e || [],
                });
            },

            // 性别选择事件
            gender_change_event(e) {
                this.setData({
                    gender_index: parseInt(e.detail.value || 0),
                });
            },

            // 是否可预约
            booking_enable_change_event(e) {
                var temp = this.form_data || {};
                temp.is_booking_enable = (e.detail.value === true || e.detail.value === 1 || e.detail.value === 'true') ? 1 : 0;
                this.setData({ form_data: temp });
            },

            // 生日选择事件
            birthday_change_event(e) {
                var temp = this.form_data || {};
                temp.birthday = e.detail.value || '';
                this.setData({ form_data: temp });
            },

            // 表单提交
            form_submit(e) {
                if (this.form_submit_disabled_status) {
                    return;
                }
                var value = e.detail.value || {};
                var gender = ((this.gender_list[this.gender_index] || null) == null) ? 0 : this.gender_list[this.gender_index].id;
                this.setData({ form_submit_disabled_status: true });
                uni.showLoading({ title: this.$t('common.processing_in_text') });
                uni.request({
                    url: app.globalData.get_request_url('profilesave', 'staffuser', 'realstore'),
                    method: 'POST',
                    data: {
                        avatar: ((this.avatar_list || []).length > 0) ? this.avatar_list[0] : '',
                        photo: this.photo_list || [],
                        alias: value.alias || '',
                        specialty: value.specialty || '',
                        work_years: value.work_years || '',
                        introduce: value.introduce || '',
                        gender: gender,
                        birthday: this.form_data.birthday || '',
                        height: value.height || '',
                        nation: value.nation || '',
                        native_place: value.native_place || '',
                        mobile: value.mobile || '',
                        email: value.email || '',
                        is_booking_enable: parseInt((this.form_data || {}).is_booking_enable || 0),
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(() => {
                                uni.navigateBack();
                            }, 1500);
                        } else {
                            this.setData({ form_submit_disabled_status: false });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({ form_submit_disabled_status: false });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
@import './staff-profile.css';
</style>

<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="page-bottom-fixed padding-main">
                <view v-if="patient_tips != null" class="margin-bottom">
                    <uni-notice-bar background-color="" :text="patient_tips" />
                </view>
                <form @submit="form_submit" class="form-container">
                    <view class="oh border-radius-main tr">
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">真实姓名<text class="form-group-tips-must">*</text></view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="name" :value="data.name || ''" maxlength="30" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入真实姓名" />
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">身份证号码<text class="form-group-tips-must">*</text></view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="idcard" name="idcard" :value="data.idcard || ''" maxlength="60" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入身份证号码" />
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">手机号码<text class="form-group-tips-must">*</text></view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="text" name="mobile" :value="data.mobile || ''" maxlength="30" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入手机号码" />
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">性别<text class="form-group-tips-must">*</text></view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <picker class="picker" name="gender" data-field="gender_index" @change="select_change_event" :value="select_index.gender_index" :range="common_gender_list" range-key="name">
                                    <text v-if="select_index.gender_index === ''" class="cr-grey-9">请选择请别</text>
                                    <text v-else class="cr-base">{{common_gender_list[select_index.gender_index].name}}</text>
                                    <view class="dis-inline-block margin-left-xs">
                                        <iconfont name="icon-arrow-right" size="28rpx" color="#ccc"></iconfont>
                                    </view>
                                </picker>
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">年龄</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="number" name="age" :value="data.age || ''" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入年龄" />
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">体重</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <input type="digit" name="weight" :value="data.weight || ''" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入体重" />
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">健康信息</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <view class="form-gorup-value" @tap="popup_health_event">
                                    <view class="dis-inline-block single-text va-m health-tips">
                                        <text v-if="(health_tips || null) != null" class="cr-base">{{health_tips}}</text>
                                        <text v-else class="cr-grey-9">可填写健康信息</text>
                                    </view>
                                    <view class="dis-inline-block margin-left-xs va-m">
                                        <iconfont name="icon-arrow-right" size="28rpx" color="#ccc"></iconfont>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="form-gorup flex-row jc-sb align-c br-b-f9">
                            <view class="form-gorup-title">关系标签</view>
                            <view class="flex-row align-c flex-1 flex-width">
                                <picker class="picker" name="relation_tags" data-field="relation_tags_index" @change="select_change_event" :value="select_index.relation_tags_index" :range="hospital_relation_tags_list" range-key="name">
                                    <text v-if="select_index.relation_tags_index === ''" class="cr-grey-9">可选择关系标签</text>
                                    <text v-else class="cr-base">{{hospital_relation_tags_list[select_index.relation_tags_index].name}}</text>
                                    <view class="dis-inline-block margin-left-xs">
                                        <iconfont name="icon-arrow-right" size="28rpx" color="#ccc"></iconfont>
                                    </view>
                                </picker>
                            </view>
                        </view>
                    </view>
                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size wh-auto" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.save')}}</button>
                        </view>
                    </view>
                </form>
            </view>

            <!-- 健康信息弹窗 -->
            <component-popup :propShow="popup_health_status" propPosition="bottom" @onclose="popup_health_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_health_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="page-bottom-fixed">
                        <view class="form-container">
                            <view class="form-gorup">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title">过敏史</view>
                                    <switch :color="theme_color" :checked="(health.is_history_of_allergy || 0) == 1" data-field="is_history_of_allergy" @change="health_switch_value_event" style="transform:scale(0.7)" />
                                </view>
                                <input v-if="(health.is_history_of_allergy || 0) == 1" type="text" :value="health.is_history_of_allergy_value || ''" data-field="history_of_allergy_value" @input="health_input_value_event" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入过敏史项" />
                            </view>
                            <view class="form-gorup br-t-f9">
                                <view class="flex-row jc-sb align-c">
                                    <view class="form-gorup-title">疾病史</view>
                                    <switch :color="theme_color" :checked="(health.is_history_of_sickness || 0) == 1" data-field="is_history_of_sickness" @change="health_switch_value_event" style="transform:scale(0.7)" />
                                </view>
                                <input v-if="(health.is_history_of_sickness || 0) == 1" type="text" :value="health.is_history_of_sickness_value || ''" data-field="history_of_sickness_value" @input="health_input_value_event" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入疾病史项" />
                            </view>
                            <view class="form-gorup flex-row jc-sb align-c br-t-f9">
                                <view class="form-gorup-title">肝功能异常</view>
                                <switch :color="theme_color" :checked="(health.liver_type || 0) == 1" data-field="liver_type" @change="health_switch_value_event" style="transform:scale(0.7)" />
                            </view>
                            <view class="form-gorup flex-row jc-sb align-c br-t-f9">
                                <view class="form-gorup-title">肾功能异常</view>
                                <switch :color="theme_color" :checked="(health.renal_type || 0) == 1" data-field="renal_type" @change="health_switch_value_event" style="transform:scale(0.7)" />
                            </view>
                            <view v-if="(data.gender || 0) == 1" class="form-gorup flex-row jc-sb align-c br-t-f9">
                                <view class="form-gorup-title">妊娠哺乳</view>
                                <view class="flex-row align-c flex-1 flex-width tr">
                                    <picker class="picker" data-field="pregnancy" @change="health_input_value_event" :value="health.pregnancy || 0" :range="hospital_pregnancy_list" range-key="name">
                                        <text class="cr-base">{{hospital_pregnancy_list[health.pregnancy || 0].name}}</text>
                                        <view class="dis-inline-block margin-left-xs">
                                            <iconfont name="icon-arrow-right" size="28rpx" color="#ccc"></iconfont>
                                        </view>
                                    </picker>
                                </view>
                            </view>
                        </view>
                        <view class="bottom-fixed">
                            <view class="bottom-line-exclude">
                                <button class="item bg-main br-main cr-white round text-size-sm wh-auto" type="default" hover-class="none" @tap="popup_health_confirm_event">{{$t('common.confirm')}}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </component-popup>
        </block>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                popup_health_status: false,
                form_submit_disabled_status: false,
                bottom_fixed_style: '',
                params: {},
                data: {},
                health: {},
                health_tips: '',
                patient_tips: null,
                common_gender_list: [],
                hospital_pregnancy_list: [],
                hospital_relation_tags_list: [],
                select_index: {
                    gender_index: '',
                    relation_tags_index: '',
                }
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'patient', 'hospital'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var temp_data = data.data || null;
                            // 性别去掉保密
                            var temp_gender_list = data.common_gender_list || [];
                            temp_gender_list.splice(0, 1);
                            this.setData({
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                data: temp_data || {},
                                patient_tips: data.patient_tips || null,
                                common_gender_list: temp_gender_list,
                                hospital_pregnancy_list: data.hospital_pregnancy_list || [],
                                hospital_relation_tags_list: data.hospital_relation_tags_list || [],
                            });
                            // 健康信息
                            var health = this.data.health || null;
                            this.setData({
                                health: health || {},
                                health_tips: (health == null) ? '' : health.map(function(v){return v.msg;}).join(';')
                            });
                            // 下拉选中数据处理
                            if(temp_data !== null) {
                                var temp_select_index = this.select_index;
                                for(var i in this.common_gender_list) {
                                    if(this.common_gender_list[i]['id'] == temp_data.gender) {
                                        temp_select_index['gender_index'] = i;
                                    }
                                }
                                for(var i in this.hospital_relation_tags_list) {
                                    if(this.hospital_relation_tags_list[i]['value'] == temp_data.relation_tags) {
                                        temp_select_index['relation_tags_index'] = i;
                                    }
                                }
                                this.setData({select_index: temp_select_index});
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
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
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    }
                });
            },

            // 性别、标签选择事件
            select_change_event(e) {
                // 索引存储
                var temp = this.select_index || {};
                var field = e.currentTarget.dataset.field;
                var value = e.detail.value;
                temp[field] = value;
                this.setData({ select_index: temp });

                // 性别赋值
                if(field == 'gender_index') {
                    var temp_data = this.data;
                    temp_data['gender'] = this.common_gender_list[value]['id'];
                    this.setData({ data: temp_data });
                }
            },

            // 健康信息切换事件
            health_switch_value_event(e) {
                var temp = this.health || {};
                var field = e.currentTarget.dataset.field;
                var value = e.detail.value;
                temp[field] = value ? 1 : 0;
                this.setData({ health: temp });
            },

            // 健康信息输入事件
            health_input_value_event(e) {
                var temp = this.health || {};
                var field = e.currentTarget.dataset.field;
                var value = e.detail.value;
                temp[field] = value;
                this.setData({ health: temp });
            },

            // 健康信息确认事件
            popup_health_confirm_event() {
                var health = this.health_handle_data();
                if(health !== false) {
                    this.setData({
                        popup_health_status: false,
                        health_tips: health.map(function(v){return v.msg;}).join(';')
                    });
                }
            },
            
            // 健康处理数据
            health_handle_data() {
                var arr = [];
                // 过敏史
                var is_history_of_allergy = parseInt(this.health.is_history_of_allergy || 0);
                if(is_history_of_allergy == 1) {
                    var value = this.health.is_history_of_allergy_value || '';
                    if(value === '') {
                        app.globalData.showToast('请填写过敏史');
                        return false;
                    }
                    var msg = '过敏史:'+value;
                } else {
                    var msg = '无过敏史';
                    var value = '';
                }
                 arr.push({
                    type: 'is_history_of_allergy', 
                    status: is_history_of_allergy, 
                    value: value, 
                    msg: msg
                });
                
                // 疾病史
                var is_history_of_sickness = parseInt(this.health.is_history_of_sickness || 0);
                if(is_history_of_sickness == 1) {
                    var value = this.health.is_history_of_sickness_value || '';
                    if(value === '') {
                        app.globalData.showToast('请填写疾病史');
                        return false;
                    }
                    var msg = '疾病史:'+value;
                } else {
                    var msg = '无疾病史';
                    var value = '';
                }
                 arr.push({
                    type: 'is_history_of_sickness', 
                    status: is_history_of_sickness, 
                    value: value, 
                    msg: msg
                });
                
                // 肝功能
                var liver_type = parseInt(this.health.liver_type || 0);
                 arr.push({
                    type: 'liver_type', 
                    status: liver_type,  
                    msg: '无肝功能'+((liver_type == 1) ? '异常' : '正常'),
                });
                
                // 肾功能
                var renal_type = parseInt(this.health.renal_type || 0);
                 arr.push({
                    type: 'renal_type', 
                    status: renal_type,  
                    msg: '无肾功能'+((renal_type == 1) ? '异常' : '正常'),
                });
                
                // 妊娠哺乳
                var pregnancy = parseInt(this.health.pregnancy || 0);
                // 性别为男的时候强制为否
                if(parseInt(this.data.gender || 0) == 2) {
                    pregnancy = 0;
                }
                var temp_pregnancy = this.hospital_pregnancy_list[pregnancy];
                 arr.push({
                    type: 'pregnancy', 
                    status: temp_pregnancy.value,  
                    msg: '妊娠哺乳:'+temp_pregnancy.name,
                });
                return arr;
            },

            // 健康信息开启弹层
            popup_health_event(e) {
                var health = this.health || {};
                for(var i in health) {
                    switch(health[i]['type']) {
                        // 过敏史、疾病史
                        case 'is_history_of_allergy' :
                        case 'is_history_of_sickness' :
                            health[health[i]['type']+'_value'] = health[i]['value'] || '';
                            break;
                    }
                    health[health[i]['type']] = parseInt(health[i]['status'] || 0);
                }
                this.setData({
                    health: health,
                    popup_health_status: true
                });
            },

            // 健康信息关闭弹层
            popup_health_close_event(e) {
                this.setData({
                    popup_health_status: false
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;
                // 性别
                form_data['gender'] = this.select_index.gender_index;
                if(form_data['gender'] !== '') {
                    form_data['gender'] = this.common_gender_list[form_data['gender']]['id'];
                }
                // 标签
                form_data['relation_tags'] = this.select_index.relation_tags_index;
                if(form_data['relation_tags'] !== '') {
                    form_data['relation_tags'] = this.hospital_relation_tags_list[form_data['relation_tags']]['value'];
                }

                // 数据校验
                var validation = [
                    { fields: 'name', msg: '请输入真实姓名' },
                    { fields: 'idcard', msg: '请输入身份证号码' },
                    { fields: 'mobile', msg: '请输入手机号码' },
                    { fields: 'gender', msg: '请选择请别', is_can_zero: 1 },
                ];
                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    // 健康信息
                    form_data['health'] = this.health_handle_data();
                    if(form_data['health'] === false) {
                        return false;
                    }
                    form_data['health'] = encodeURIComponent(base64.encode(JSON.stringify(form_data['health'])));
                    // 数据id
                    form_data['id'] = this.data.id || 0;

                    // 保存数据
                    this.setData({
                        form_submit_disabled_status: true,
                    });
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('save', 'patient', 'hospital'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function() {
                                    app.globalData.page_back_prev_event();
                                }, 1000);
                            } else {
                                this.setData({
                                    form_submit_disabled_status: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            }
        }
    };
</script>
<style>
    @import './patient.css';
</style>
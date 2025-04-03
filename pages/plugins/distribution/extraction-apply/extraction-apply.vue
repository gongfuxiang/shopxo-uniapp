<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed">
            <form @submit="form_submit" class="form-container">
                <view class="padding-main oh border-radius-main">
                    <view class="form-gorup bg-white form-container-upload oh">
                        <view class="form-gorup-title">{{$t('extraction-apply.extraction-apply.u439pg')}}<text class="form-group-tips">{{$t('extraction-apply.extraction-apply.bflosr')}}</text></view>
                        <view class="form-upload-data oh">
                            <block v-if="(extraction_data.logo || null) != null">
                                <view class="item fl">
                                    <text class="delete-icon" @tap="upload_delete_event">x</text>
                                    <image :src="extraction_data.logo" @tap="upload_show_event" mode="aspectFill"></image>
                                </view>
                            </block>
                            <image class="item fl upload-icon" :src="common_static_url + 'upload-icon.png'" mode="aspectFill" @tap="file_upload_event"></image>
                        </view>
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">{{$t('extraction-apply.extraction-apply.9t81k8')}}</view>
                        <input type="text" name="alias" :value="extraction_data.alias || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('extraction-apply.extraction-apply.wt1w0m')" />
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">{{$t('user-detail.user-detail.k5867n')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="name" :value="extraction_data.name || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('extraction-apply.extraction-apply.73efnt')" />
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">{{$t('user-detail.user-detail.gfe703')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="tel" :value="extraction_data.tel || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('extraction-apply.extraction-apply.qixk24')" />
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">{{$t('extraction-apply.extraction-apply.cy87k6')}}<text class="form-group-tips-must">*</text></view>
                        <view class="select-address oh">
                            <view class="section fl">
                                <picker name="province" @change="select_province_event" :value="province_value" :range="province_list" range-key="name">
                                    <view :class="'name ' + (province_value == null ? 'cr-grey' : 'cr-base')">{{ (province_list[province_value] || null) == null ? default_province : province_list[province_value]['name'] }}</view>
                                </picker>
                            </view>
                            <view class="section fl">
                                <picker v-if="(province_id || null) != null" name="city" @change="select_city_event" :value="city_value" :range="city_list" range-key="name">
                                    <view :class="'name ' + (city_value == null ? 'cr-grey' : 'cr-base')">{{ (city_list[city_value] || null) == null ? default_city : city_list[city_value]['name'] }}</view>
                                </picker>
                                <text v-else class="cr-grey" @tap="region_select_error_event" :data-value="$t('extraction-apply.extraction-apply.liqbru')">{{$t('extraction-apply.extraction-apply.liqbru')}}</text>
                            </view>
                            <view class="section fl">
                                <picker v-if="(city_id || null) != null" name="county" @change="select_county_event" :value="county_value" :range="county_list" range-key="name">
                                    <view :class="'name ' + (county_value == null ? 'cr-grey' : 'cr-base')">{{ (county_list[county_value] || null) == null ? default_county : county_list[county_value]['name'] }}</view>
                                </picker>
                                <text v-else class="cr-grey" @tap="region_select_error_event" :data-value="$t('extraction-apply.extraction-apply.r4q86m')">{{$t('extraction-apply.extraction-apply.r4q86m')}}</text>
                            </view>
                        </view>
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">{{$t('personal.personal.6m33c4')}}<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="address" :value="extraction_data.address || ''" placeholder-class="cr-grey" class="cr-base" :placeholder="$t('extraction-apply.extraction-apply.gxo73a')" />
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">{{$t('extraction-apply.extraction-apply.47v7m0')}}<text class="form-group-tips-must">*</text></view>
                        <view @tap="choose_location_event" class="form-gorup-text">
                            <view v-if="(user_location.status || 0) == 1" class="cr-base">{{ user_location.lng }}, {{ user_location.lat }}</view>
                            <view v-else class="cr-grey">{{$t('extraction-apply.extraction-apply.8831v6')}}</view>
                        </view>
                    </view>

                    <view v-if="(extraction_data || null) != null && (extraction_data.status || 0) == 1" class="cr-red margin-top-sm spacing-mb">{{$t('extraction-apply.extraction-apply.5y2yzu')}}</view>
                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </form>
        </view>

        <!-- 位置选择 -->
        <component-choice-location ref="choice_location" :propIsShowAddressChoice="false" @onBack="user_back_choice_location"></component-choice-location>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentChoiceLocation from '@/components/choice-location/choice-location';
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                params: {},
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                extraction_data: {},
                province_list: [],
                city_list: [],
                county_list: [],
                province_id: null,
                city_id: null,
                county_id: null,
                editor_path_type: '',
                default_province: this.$t('extraction-apply.extraction-apply.s3h5o3'),
                default_city: this.$t('extraction-apply.extraction-apply.4s4s15'),
                default_county: this.$t('extraction-apply.extraction-apply.fk4gw5'),
                province_value: null,
                city_value: null,
                county_value: null,
                user_location: {},
                form_submit_disabled_status: false,
            };
        },

        components: {
            componentCommon,
            componentChoiceLocation
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params || {},
            });

            // 清除位置缓存信息
            app.globalData.choice_user_location_remove();

            // 初始数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户位置初始化
            this.user_location_init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_province_list();
                    this.applyinfo_init();
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('extraction-apply.extraction-apply.m3xdif'),
                    });
                }
            },

            // 自提点信息
            applyinfo_init() {
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url('applyinfo', 'extraction', 'distribution'),
                    method: 'POST',
                    data: {is_lang: 0},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var extraction_data = data.extraction_data || null;
                            self.setData({
                                extraction_data: extraction_data || {},
                                editor_path_type: data.editor_path_type || '',
                            });

                            // 数据设置
                            if (extraction_data != null) {
                                self.setData({
                                    province_id: extraction_data.province || null,
                                    city_id: extraction_data.city || null,
                                    county_id: extraction_data.county || null,
                                });

                                // 地理位置
                                var lng = extraction_data.lng || 0;
                                var lat = extraction_data.lat || 0;
                                if (lng != 0 && lat != 0) {
                                    self.setData({
                                        user_location: {
                                            lng: lng,
                                            lat: lat,
                                            address: extraction_data.address || '',
                                        },
                                    });
                                }
                            }

                            // 获取城市、区县
                            self.get_city_list();
                            self.get_county_list();

                            // 半秒后初始化数据
                            setTimeout(function () {
                                self.init_region_value();
                            }, 500);
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('extraction-apply.extraction-apply.h8f437'));
                    },
                });
            },

            // 地区数据初始化
            init_region_value() {
                this.setData({
                    province_value: this.get_region_value('province_list', 'province_id'),
                    city_value: this.get_region_value('city_list', 'city_id'),
                    county_value: this.get_region_value('county_list', 'county_id'),
                });
            },

            // 地区初始化匹配索引
            get_region_value(list, id) {
                var data = this[list];
                var data_id = this[id];
                var value = null;
                data.forEach((d, i) => {
                    if (d.id == data_id) {
                        value = i;
                        return false;
                    }
                });
                return value;
            },

            // 获取省份
            get_province_list() {
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url('index', 'region'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                province_list: data,
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast(this.$t('extraction-apply.extraction-apply.fo7y6c'));
                    },
                });
            },

            // 获取市
            get_city_list() {
                var self = this;

                if (self.province_id) {
                    uni.request({
                        url: app.globalData.get_request_url('index', 'region'),
                        method: 'POST',
                        data: {
                            pid: self.province_id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                self.setData({
                                    city_list: data,
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            app.globalData.showToast(this.$t('extraction-apply.extraction-apply.b6qg7b'));
                        },
                    });
                }
            },

            // 获取区/县
            get_county_list() {
                var self = this;

                if (self.city_id) {
                    // 加载loding
                    uni.request({
                        url: app.globalData.get_request_url('index', 'region'),
                        method: 'POST',
                        data: {
                            pid: self.city_id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                self.setData({
                                    county_list: data,
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            app.globalData.showToast(this.$t('extraction-apply.extraction-apply.5s5734'));
                        },
                    });
                }
            },

            // 省份事件
            select_province_event(e) {
                var index = e.detail.value || 0;
                if (index >= 0) {
                    var data = this.province_list[index];
                    this.setData({
                        province_value: index,
                        province_id: data.id,
                        city_value: null,
                        county_value: null,
                        city_id: null,
                        county_id: null,
                    });
                    this.get_city_list();
                }
            },

            // 市事件
            select_city_event(e) {
                var index = e.detail.value || 0;
                if (index >= 0) {
                    var data = this.city_list[index];
                    this.setData({
                        city_value: index,
                        city_id: data.id,
                        county_value: null,
                        county_id: null,
                    });
                    this.get_county_list();
                }
            },

            // 区/县事件
            select_county_event(e) {
                var index = e.detail.value || 0;
                if (index >= 0) {
                    var data = this.county_list[index];
                    this.setData({
                        county_value: index,
                        county_id: data.id,
                    });
                }
            },

            // 省市区未按照顺序选择提示
            region_select_error_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    app.globalData.showToast(value);
                }
            },

            // 选择地理位置
            choose_location_event(e) {
                if ((this.$refs.choice_location || null) != null) {
                    this.$refs.choice_location.choose_user_location();
                }
            },

            // 选择用户地理位置回调
            user_back_choice_location(e) {
                this.setData({
                    user_location: e
                });
            },

            // 地址信息初始化
            user_location_init() {
                this.setData({
                    user_location: app.globalData.choice_user_location_init()
                });
            },

            // 数据提交
            form_submit(e) {
                var self = this;

                // 表单数据
                var form_data = e.detail.value;

                // 数据校验
                var validation = [
                    { fields: 'name', msg: this.$t('extraction-apply.extraction-apply.q15b4n') },
                    { fields: 'tel', msg: this.$t('extraction-apply.extraction-apply.3or25c') },
                    { fields: 'province', msg: this.$t('extraction-apply.extraction-apply.m99d2g') },
                    { fields: 'city', msg: this.$t('extraction-apply.extraction-apply.03587o') },
                    { fields: 'county', msg: this.$t('extraction-apply.extraction-apply.pt8436') },
                    { fields: 'address', msg: this.$t('extraction-apply.extraction-apply.v1g617') },
                    { fields: 'lng', msg: this.$t('extraction-apply.extraction-apply.8831v6') },
                    { fields: 'lat', msg: this.$t('extraction-apply.extraction-apply.8831v6') },
                ];

                // logo
                form_data['logo'] = (this.extraction_data || null) != null ? this.extraction_data.logo || '' : '';

                // 地区
                form_data['province'] = self.province_id;
                form_data['city'] = self.city_id;
                form_data['county'] = self.county_id;

                // 地理位置
                var lng = 0;
                var lat = 0;
                if ((self.user_location || null) != null) {
                    lng = self.user_location.lng || 0;
                    lat = self.user_location.lat || 0;
                }
                if ((self.extraction_data || null) != null) {
                    if ((lng || null) == null) {
                        lng = self.extraction_data.lng || 0;
                    }
                    if ((lat || null) == null) {
                        lat = self.extraction_data.lat || 0;
                    }
                }
                form_data['lng'] = lng;
                form_data['lat'] = lat;

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    if ((self.extraction_data || null) != null && (self.extraction_data.status || 0) == 1) {
                        uni.showModal({
                            title: this.$t('common.warm_tips'),
                            content: this.$t('extraction-apply.extraction-apply.rm14pu'),
                            confirmText: this.$t('common.confirm'),
                            cancelText: this.$t('common.not_yet'),
                            success: (result) => {
                                if (result.confirm) {
                                    self.request_data_save(form_data);
                                }
                            },
                        });
                    } else {
                        self.request_data_save(form_data);
                    }
                }
            },

            // 数据保存
            request_data_save(data) {
                var self = this;
                self.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                });
                uni.request({
                    url: app.globalData.get_request_url('applysave', 'extraction', 'distribution'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(function () {
                                uni.navigateBack();
                            }, 1000);
                        } else {
                            self.setData({
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
                        self.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.extraction_data.logo,
                    urls: [this.extraction_data.logo],
                });
            },

            // 图片删除
            upload_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('order.order.psi67g'),
                    success(res) {
                        if (res.confirm) {
                            var temp_data = self.extraction_data || {};
                            temp_data['logo'] = '';
                            self.setData({
                                extraction_data: temp_data,
                            });
                        }
                    },
                });
            },

            // 文件上传
            file_upload_event(e) {
                var self = this;
                uni.chooseImage({
                    count: 1,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(res.tempFilePaths, success, fail, count, length);
                    },
                });
            },

            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length) {
                var self = this;
                uni.uploadFile({
                    url: app.globalData.get_request_url('index', 'ueditor'),
                    filePath: img_paths[count],
                    name: 'upfile',
                    formData: {
                        action: 'uploadimage',
                        path_type: self.editor_path_type,
                    },
                    success: function (res) {
                        success++;
                        if (res.statusCode == 200) {
                            var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                            if (data.code == 0 && (data.data.url || null) != null) {
                                var temp_data = self.extraction_data || {};
                                temp_data['logo'] = data.data.url;
                                self.setData({
                                    extraction_data: temp_data,
                                });
                            } else {
                                app.globalData.showToast(data.msg);
                            }
                        }
                    },
                    fail: function (e) {
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
                            self.upload_one_by_one(img_paths, success, fail, count, length);
                        }
                    },
                });
            },
        },
    };
</script>
<style>
    @import './extraction-apply.css';
</style>

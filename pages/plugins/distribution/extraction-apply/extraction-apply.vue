<template>
    <view class="page">
        <form @submit="form_submit" class="form-container">
            <view class="padding-main oh">
                <view class="form-gorup bg-white form-container-upload oh">
                    <view class="form-gorup-title">logo图片<text class="form-group-tips">选传，建议300x300px</text></view>
                    <view class="oh">
                        <view class="form-upload-data fl">
                            <block v-if="(extraction_data.logo || null) != null">
                                <view class="item fl">
                                    <text class="delete-icon" @tap="upload_delete_event">x</text>
                                    <image :src="extraction_data.logo" @tap="upload_show_event" mode="aspectFill"></image>
                                </view>
                            </block>
                        </view>
                        <image class="upload-icon" :src="common_static_url+'upload-icon.png'" mode="aspectFill" @tap="file_upload_event"></image>
                    </view>
                </view>

                <view class="form-gorup bg-white">
                    <view class="form-gorup-title">别名<text class="form-group-tips">选填</text></view>
                    <input type="text" name="alias" :value="extraction_data.alias || ''" placeholder-class="cr-grey" class="cr-base" placeholder="别名格式最多 16 个字符">
                </view>

                <view class="form-gorup bg-white">
                    <view class="form-gorup-title">联系人<text class="form-group-tips-must">必填</text></view>
                    <input type="text" name="name" :value="extraction_data.name || ''" placeholder-class="cr-grey" class="cr-base" placeholder="联系人格式 2~16 个字符之间">
                </view>

                <view class="form-gorup bg-white">
                    <view class="form-gorup-title">联系电话<text class="form-group-tips-must">必填</text></view>
                    <input type="text" name="tel" :value="extraction_data.tel || ''" placeholder-class="cr-grey" class="cr-base" placeholder="座机 或 手机">
                </view>

                <view class="form-gorup bg-white">
                    <view class="form-gorup-title">省市区<text class="form-group-tips-must">必选</text></view>
                    <view class="select-address oh">
                        <view class="section fl">
                            <picker name="province" @change="select_province_event" :value="province_value" :range="province_list" range-key="name">
                                <view :class="'name ' + ((province_value == null) ? 'cr-grey' : 'cr-base' )">{{province_list[province_value].name || default_province}}</view>
                            </picker>
                        </view>
                        <view class="section fl">
                            <picker v-if="(province_id || null) != null" name="city" @change="select_city_event" :value="city_value" :range="city_list" range-key="name">
                                <view :class="'name ' + ((city_value == null) ? 'cr-grey' : 'cr-base' )">{{city_list[city_value].name || default_city}}</view>
                            </picker>
                            <text v-else class="cr-grey" @tap="region_select_error_event" data-value="请先选择省份">请先选择省份</text>
                        </view>
                        <view class="section fl">
                            <picker v-if="(city_id || null) != null" name="county" @change="select_county_event" :value="county_value" :range="county_list" range-key="name">
                                <view :class="'name ' + ((county_value == null) ? 'cr-grey' : 'cr-base' )">{{county_list[county_value].name || default_county}}</view>
                            </picker>
                            <text v-else class="cr-grey" @tap="region_select_error_event" data-value="请先选择城市">请先选择城市</text>
                        </view>
                    </view>
                </view>

                <view class="form-gorup bg-white">
                    <view class="form-gorup-title">详细地址<text class="form-group-tips-must">必填</text></view>
                    <input type="text" name="address" :value="extraction_data.address || ''" placeholder-class="cr-grey" class="cr-base" placeholder="详细地址格式 1~80 个字符之间">
                </view>

                <view class="form-gorup bg-white">
                    <view class="form-gorup-title">地理位置<text class="form-group-tips-must">必选</text></view>
                    <view @tap="choose_location_event" class="form-gorup-text">
                        <view v-if="(user_location || null) == null" class="cr-gray">请选择地理位置</view>
                        <view v-else class="cr-base">{{user_location.lng}}, {{user_location.lat}}</view>
                    </view>
                </view>
                
                <view v-if="(extraction_data || null) != null && (extraction_data.status || 0) == 1" class="notice-content-blue spacing-mb">
                    注意：编辑信息将重新审核后方可生效
                </view>
                <view class="bottom-fixed padding-main">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">提交</button>
                </view>
            </view>
        </form>
    </view>
</template>
<script>
    const app = getApp();

    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                extraction_data: null,
                province_list: [],
                city_list: [],
                county_list: [],
                province_id: null,
                city_id: null,
                county_id: null,
                editor_path_type: '',
                default_province: "请选择省",
                default_city: "请选择市",
                default_county: "请选择区/县",
                province_value: null,
                city_value: null,
                county_value: null,
                user_location_cache_key: app.globalData.data.cache_userlocation_key,
                user_location: null,
                form_submit_disabled_status: false
            };
        },

        components: {},
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },

        onReady: function() {
            // 清除位置缓存信息
            uni.removeStorage({
                key: this.user_location_cache_key
            });
            this.init();
        },

        onShow() {
            this.user_location_init();

            // 显示分享菜单
            app.globalData.show_share_menu();
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, "init");
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: "/pages/login/login?event_callback=init"
                        });
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: '请先绑定手机号码'
                        });
                        return false;
                    } else {
                        this.get_province_list();
                        this.applyinfo_init();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息'
                    });
                }
            },

            // 自提点信息
            applyinfo_init() {
                var self = this;
                uni.request({
                    url: app.globalData.get_request_url("applyinfo", "extraction", "distribution"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var extraction_data = data.extraction_data || null;
                            self.setData({
                                extraction_data: extraction_data || null,
                                editor_path_type: data.editor_path_type || ''
                            });
                            
                            // 数据设置
                            if (extraction_data != null) {
                                self.setData({
                                    province_id: extraction_data.province || null,
                                    city_id: extraction_data.city || null,
                                    county_id: extraction_data.county || null
                                });
                                
                                // 地理位置
                                var lng = extraction_data.lng || 0;
                                var lat = extraction_data.lat || 0;
                                if (lng != 0 && lat != 0) {
                                    self.setData({
                                        user_location: {
                                            lng: lng,
                                            lat: lat,
                                            address: extraction_data.address || ''
                                        }
                                    });
                                }
                            }
                            
                            // 获取城市、区县
                            self.get_city_list();
                            self.get_county_list();
                            
                            // 半秒后初始化数据
                            setTimeout(function() {
                                self.init_region_value();
                            }, 500);
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("省份信息失败");
                    }
                });
            },

            // 地区数据初始化
            init_region_value() {
                this.setData({
                    province_value: this.get_region_value("province_list", "province_id"),
                    city_value: this.get_region_value("city_list", "city_id"),
                    county_value: this.get_region_value("county_list", "county_id")
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
                    url: app.globalData.get_request_url("index", "region"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            self.setData({
                                province_list: data
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        app.globalData.showToast("省份获取失败");
                    }
                });
            },

            // 获取市
            get_city_list() {
                var self = this;

                if (self.province_id) {
                    uni.request({
                        url: app.globalData.get_request_url("index", "region"),
                        method: "POST",
                        data: {
                            pid: self.province_id
                        },
                        dataType: "json",
                        success: res => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                self.setData({
                                    city_list: data
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            app.globalData.showToast("城市获取失败");
                        }
                    });
                }
            },

            // 获取区/县
            get_county_list() {
                var self = this;

                if (self.city_id) {
                    // 加载loding
                    uni.request({
                        url: app.globalData.get_request_url("index", "region"),
                        method: "POST",
                        data: {
                            pid: self.city_id
                        },
                        dataType: "json",
                        success: res => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                self.setData({
                                    county_list: data
                                });
                            } else {
                                app.globalData.showToast(res.data.msg);
                            }
                        },
                        fail: () => {
                            app.globalData.showToast("区/县获取失败");
                        }
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
                        county_id: null
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
                        county_id: null
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
                        county_id: data.id
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
                uni.navigateTo({
                    url: '/pages/common/open-setting-location/open-setting-location'
                });
            },

            // 地址信息初始化
            user_location_init() {
                var result = uni.getStorageSync(this.user_location_cache_key) || null;
                var data = null;
                if (result != null) {
                    data = {
                        name: result.name || null,
                        address: result.address || null,
                        lat: result.latitude || null,
                        lng: result.longitude || null
                    };
                }
                this.setData({
                    user_location: data
                });
            },

            // 数据提交
            form_submit(e) {
                var self = this;
                
                // 表单数据
                var form_data = e.detail.value;
                
                // 数据校验
                var validation = [
                    { fields: "name", msg: "请填写联系人" },
                    { fields: "tel", msg: "请填写联系电话" },
                    { fields: "province", msg: "请选择省份" },
                    { fields: "city", msg: "请选择城市" },
                    { fields: "county", msg: "请选择区县" },
                    { fields: "address", msg: "请填写详细地址" },
                    { fields: "lng", msg: "请选择地理位置" },
                    { fields: "lat", msg: "请选择地理位置" }
                ];
                
                // logo
                form_data['logo'] = (this.extraction_data || null) != null ? this.extraction_data.logo || '' : '';
                
                // 地区
                form_data["province"] = self.province_id;
                form_data["city"] = self.city_id;
                form_data["county"] = self.county_id;
                
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
                form_data["lng"] = lng;
                form_data["lat"] = lat;
                
                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    if ((self.extraction_data || null) != null && (self.extraction_data.status || 0) == 1) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '数据需重新审核后方可生效',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: result => {
                                if (result.confirm) {
                                    self.request_data_save(form_data);
                                }
                            }
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
                    form_submit_disabled_status: true
                });
                uni.showLoading({
                    title: "处理中..."
                });
                uni.request({
                    url: app.globalData.get_request_url("applysave", "extraction", "distribution"),
                    method: "POST",
                    data: data,
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, "success");
                            setTimeout(function() {
                                uni.navigateBack();
                            }, 1000);
                        } else {
                            self.setData({
                                form_submit_disabled_status: false
                            });
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        self.setData({
                            form_submit_disabled_status: false
                        });
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.extraction_data.logo,
                    urls: [this.extraction_data.logo]
                });
            },

            // 图片删除
            upload_delete_event(e) {
                var self = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复、继续吗？',
                    success(res) {
                        if (res.confirm) {
                            var temp_data = self.extraction_data || {};
                            temp_data['logo'] = '';
                            self.setData({
                                extraction_data: temp_data
                            });
                        }
                    }
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
                    }
                });
            },

            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length) {
                var self = this;
                uni.uploadFile({
                    url: app.globalData.get_request_url("index", "ueditor"),
                    filePath: img_paths[count],
                    name: 'upfile',
                    formData: {
                        action: 'uploadimage',
                        path_type: self.editor_path_type
                    },
                    success: function(res) {
                        success++;
                        if (res.statusCode == 200) {
                            var data = typeof res.data == 'object' ? res.data : JSON.parse(res.data);
                            if (data.code == 0 && (data.data.url || null) != null) {
                                var temp_data = self.extraction_data || {};
                                temp_data['logo'] = data.data.url;
                                self.setData({
                                    extraction_data: temp_data
                                });
                            } else {
                                app.globalData.showToast(data.msg);
                            }
                        }
                    },
                    fail: function(e) {
                        fail++;
                    },
                    complete: function(e) {
                        count++;
                        
                        // 下一张
                        if (count >= length) {
                            // 上传完毕，作一下提示
                            //app.showToast('上传成功' + success +'张', 'success');
                        } else {
                            // 递归调用，上传下一张
                            self.upload_one_by_one(img_paths, success, fail, count, length);
                        }
                    }
                });
            }
        }
    };
</script>
<style>
    @import './extraction-apply.css';
</style>
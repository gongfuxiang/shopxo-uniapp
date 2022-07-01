<template>
    <view class="page">
        <form @submit="form_submit" class="form-container">
            <view class="padding-main oh">
                <view class="form-gorup oh">
                    <view class="form-gorup-item-left">
                        <view class="form-gorup-title">联系人<text class="form-group-tips-must">必填</text></view>
                        <input type="text" name="name" :value="address_data.name || ''" maxlength="16" placeholder-class="cr-grey" class="cr-base" placeholder="联系人2~16个字符">
                    </view>
                    <view class="form-gorup-item-right">
                        <view class="form-gorup-title">联系电话<text class="form-group-tips-must">必填</text></view>
                        <input type="text" name="tel" :value="address_data.tel || ''" maxlength="30" placeholder-class="cr-grey" class="cr-base" placeholder="座机或手机">
                    </view>
                </view>

                <view class="form-gorup">
                    <block v-if="is_user_address_forbid_choice_region == 0">
                        <view class="br-b padding-bottom-xs margin-bottom-lg">
                            <view class="form-gorup-title">省市区<text class="form-group-tips-must">必选</text></view>
                            <view class="select-address oh">
                                <view class="section fl">
                                    <picker name="province" @change="select_province_event" :value="province_value" :range="province_list" range-key="name">
                                        <view :class="'name ' + ((province_value == null) ? 'cr-grey' : 'cr-base' )">{{((province_list[province_value] || null) == null) ? default_province : province_list[province_value]['name']}}</view>
                                    </picker>
                                </view>
                                <view class="section fl">
                                    <picker v-if="(province_id || null) != null" name="city" @change="select_city_event" :value="city_value" :range="city_list" range-key="name">
                                        <view :class="'name ' + ((city_value == null) ? 'cr-grey' : 'cr-base' )">{{((city_list[city_value] || null) == null) ? default_city : city_list[city_value]['name']}}</view>
                                    </picker>
                                    <text v-else class="cr-grey" @tap="region_select_error_event" data-value="请先选择省份">请先选择省份</text>
                                </view>
                                <view class="section fl">
                                    <picker v-if="(city_id || null) != null" name="county" @change="select_county_event" :value="county_value" :range="county_list" range-key="name">
                                        <view :class="'name ' + ((county_value == null) ? 'cr-grey' : 'cr-base' )">{{((county_list[county_value] || null) == null) ? default_county : county_list[county_value]['name']}}</view>
                                    </picker>
                                    <text v-else class="cr-grey" @tap="region_select_error_event" data-value="请先选择城市">请先选择城市</text>
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view v-if="(address_data.province_name || null) != null" class="br-b padding-bottom-lg margin-bottom-lg" >{{address_data.province_name}}{{address_data.city_name || ''}}{{address_data.county_name || ''}}</view>
                    </block>
                    <view class="pr">
                        <view class="form-gorup-title">详细地址<text class="form-group-tips-must">必填</text><text v-if="home_user_address_map_status == 1" class="fr form-group-tips">地理位置</text></view>
                        <input type="text" name="address" :value="address_data.address || ''" maxlength="80" placeholder-class="cr-grey" :class="'cr-base bs-bb '+(home_user_address_map_status == 1 ? 'address-value' : '')" placeholder="详细地址1~80个字符">
                        <view v-if="home_user_address_map_status == 1" @tap="choose_location_event" class="map-icon pa cp tc">
                            <uni-icons type="location" size="20" color="#666"></uni-icons>
                        </view>
                    </view>
                    <view class="br-t padding-top-lg margin-top-xs pr">
                        <view class="form-gorup-title">别名<text class="form-group-tips">选填</text></view>
                        <input type="text" name="alias" :value="address_data.alias || ''" maxlength="16" placeholder-class="cr-grey" class="cr-base" placeholder="别名最多16个字符">
                    </view>
                </view>

                <!-- 智能识别 -->
                <view v-if="is_user_address_discern == 1" class="form-gorup pr br-main-pair">
                    <textarea @input="address_discern_value_event" class="margin-0" placeholder="粘贴整段地址，自动拆分姓名、电话及地址" placeholder-class="cr-grey" />
                    <cover-view class="auto-discern pa">
                        <button type="default" size="mini" class="round bg-main-pair cr-white br-main-pair" @tap="address_discern_submit_event">识别</button>
                    </cover-view>
                </view>

                <!-- 身份证信息 -->
                <view v-if="home_user_address_idcard_status == 1" class="idcard-container padding-horizontal-main padding-top-main border-radius-main oh">
                    <view class="form-gorup">
                        <view class="form-gorup-title">身份证姓名<text class="form-group-tips-must">必填</text><text class="form-group-tips">请务必与上传的身份证件姓名保持一致</text></view>
                        <input type="text" name="idcard_name" :value="address_data.idcard_name || ''" maxlength="16" placeholder-class="cr-grey" class="cr-base" placeholder="身份证姓名格式 2~16 个字符之间">
                    </view>
                    <view class="form-gorup">
                        <view class="form-gorup-title">身份证号码<text class="form-group-tips-must">必填</text><text class="form-group-tips">请务必与上传的身份证件号码保持一致</text></view>
                        <input type="idcard" name="idcard_number" :value="address_data.idcard_number || ''" maxlength="18" placeholder-class="cr-grey" class="cr-base" placeholder="身份证号码格式最多18个字符">
                    </view>
                    <view class="form-gorup bg-white form-container-upload oh">
                        <view class="form-gorup-title">身份证照片<text class="form-group-tips-must">必传</text><text class="form-group-tips">请使用身份证原件拍摄，图片要清晰</text></view>
                        <view class="form-upload-data">
                            <view class="item fl">
                                <text v-if="(idcard_images_data.idcard_front || null) != null" class="delete-icon" @tap="upload_delete_event" data-value="idcard_front">x</text>
                                <image :src="(idcard_images_data.idcard_front || null) != null ? idcard_images_data.idcard_front : common_static_url+'idcard-front.jpg'" data-value="idcard_front" mode="aspectFill" @tap="file_upload_event"></image>
                            </view>
                            <view class="item fl">
                                <text v-if="(idcard_images_data.idcard_back || null) != null" class="delete-icon" @tap="upload_delete_event" data-value="idcard_back">x</text>
                                <image :src="(idcard_images_data.idcard_back || null) != null ? idcard_images_data.idcard_back : common_static_url+'idcard-back.jpg'" data-value="idcard_back" mode="aspectFill" @tap="file_upload_event"></image>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 身份证信息 -->
                <view class="default-checkbox margin-top-xl" @tap="default_ads_change_event">
                    <image class="va-m" :src="common_static_url+'select' + ((address_data.is_default || 0) == 1 ? '-active' : '') + '-icon.png'" mode="widthFix"></image>
                    <text class="va-m margin-left-sm">设为默认地址</text>
                </view>

                <view class="bottom-fixed padding-main">
                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">保存</button>
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
                editor_path_type: '',
                address_data: {},
                province_list: [],
                city_list: [],
                county_list: [],
                province_id: null,
                city_id: null,
                county_id: null,
                idcard_images_data: {},
                default_province: "请选择省",
                default_city: "请选择市",
                default_county: "请选择区/县",
                province_value: null,
                city_value: null,
                county_value: null,
                user_location_cache_key: app.globalData.data.cache_userlocation_key,
                user_location: null,
                address_discern_value: '',
                form_submit_disabled_status: false,
                // 基础配置
                home_user_address_map_status: 0,
                home_user_address_idcard_status: 0,
                is_user_address_discern: 0,
                is_user_address_location_discern: 0,
                is_user_address_forbid_choice_region: 0
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
            uni.setNavigationBarTitle({
                title: '地址'+(((this.params.id || null) == null) ? '添加' : '编辑')
            });
            
            // 初始化配置
            this.init_config();
            
            // 清除位置缓存信息
            this.user_location_remove();

            // 初始化
            this.init();
        },

        onShow() {
            this.user_location_init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        home_user_address_map_status: app.globalData.get_config('config.home_user_address_map_status'),
                        home_user_address_idcard_status: app.globalData.get_config('config.home_user_address_idcard_status'),
                        is_user_address_discern: app.globalData.get_config('plugins_base.intellectstools.data.is_user_address_discern', 0),
                        is_user_address_location_discern: app.globalData.get_config('plugins_base.intellectstools.data.is_user_address_location_discern', 0),
                        is_user_address_forbid_choice_region: app.globalData.get_config('plugins_base.intellectstools.data.is_user_address_forbid_choice_region', 0)
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
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
                        this.get_data();
                    }
                } else {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息'
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("detail", "useraddress"),
                    method: "POST",
                    data: this.params,
                    dataType: "json",
                    success: res => {
                        if (res.data.code == 0) {
                            var data = res.data.data || null;
                            var ads_data = data.data || null;
                            var idcard_images = {
                                idcard_front: ads_data == null ? '' : ads_data.idcard_front || '',
                                idcard_back: ads_data == null ? '' : ads_data.idcard_back || ''
                            };
                            this.setData({
                                address_data: ads_data || {},
                                idcard_images_data: idcard_images,
                                editor_path_type: data.editor_path_type || ''
                            });
                            
                            // 数据设置
                            if (ads_data != null) {
                                this.setData({
                                    province_id: ads_data.province || null,
                                    city_id: ads_data.city || null,
                                    county_id: ads_data.county || null
                                });
                                
                                // 地理位置
                                var lng = ads_data.lng || 0;
                                var lat = ads_data.lat || 0;
                                if (lng != 0 && lat != 0) {
                                    this.setData({
                                        user_location: {
                                            lng: lng,
                                            lat: lat,
                                            address: ads_data.address || ''
                                        }
                                    });
                                }
                            }

                            // 地区数据填充处理
                            this.region_data_fill_handle();
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

            // 地区数据填充处理
            region_data_fill_handle() {
                // 获取城市、区县
                this.get_city_list(true);
                this.get_county_list(true);
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
                uni.request({
                    url: app.globalData.get_request_url("index", "region"),
                    method: "POST",
                    data: {},
                    dataType: "json",
                    success: res => {
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
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
            get_city_list(is_init = false) {
                if (this.province_id) {
                    uni.request({
                        url: app.globalData.get_request_url("index", "region"),
                        method: "POST",
                        data: {
                            pid: this.province_id
                        },
                        dataType: "json",
                        success: res => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                this.setData({
                                    city_list: data
                                });
                                if(is_init) {
                                    this.init_region_value();
                                }
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
            get_county_list(is_init = false) {
                if (this.city_id) {
                    // 加载loding
                    uni.request({
                        url: app.globalData.get_request_url("index", "region"),
                        method: "POST",
                        data: {
                            pid: this.city_id
                        },
                        dataType: "json",
                        success: res => {
                            if (res.data.code == 0) {
                                var data = res.data.data;
                                this.setData({
                                    county_list: data
                                });
                                if(is_init) {
                                    this.init_region_value();
                                }
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
            
            // 清除位置缓存信息
            user_location_remove() {
                uni.removeStorage({
                    key: this.user_location_cache_key
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

                // 是否开启地理位置选择后自动识别
                if(result != null && this.is_user_address_location_discern == 1) {
                    this.address_discern_handle(result, 0, 1);
                }
            },

            // 文件上传
            file_upload_event(e) {
                var form_name = e.currentTarget.dataset.value || null;
                if (form_name == null) {
                    app.globalData.showToast('表单名称类型有误');
                    return false;
                }

                var self = this;
                uni.chooseImage({
                    count: 1,
                    success(res) {
                        var success = 0;
                        var fail = 0;
                        var length = res.tempFilePaths.length;
                        var count = 0;
                        self.upload_one_by_one(res.tempFilePaths, success, fail, count, length, form_name);
                    }
                });
            },

            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length, form_name) {
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
                                var temp_idcard_images_data = self.idcard_images_data || {};
                                temp_idcard_images_data[form_name] = data.data.url;
                                self.setData({
                                    idcard_images_data: temp_idcard_images_data
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
                        if (count >= length) { // 上传完毕，作一下提示
                            //app.showToast('上传成功' + success +'张', 'success');
                        } else {
                            // 递归调用，上传下一张
                            self.upload_one_by_one(img_paths, success, fail, count, length, form_name);
                        }
                    }
                });
            },

            // 图片删除
            upload_delete_event(e) {
                var form_name = e.currentTarget.dataset.value || null;
                if (form_name == null) {
                    app.globalData.showToast('表单名称类型有误');
                    return false;
                }

                var self = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复、继续吗？',
                    success(res) {
                        if (res.confirm) {
                            var temp_idcard_images_data = self.idcard_images_data || {};
                            temp_idcard_images_data[form_name] = '';
                            self.setData({
                                idcard_images_data: temp_idcard_images_data
                            });
                        }
                    }

                });
            },
            
            // 默认地址设置改变
            default_ads_change_event(e) {
                var temp_ads = this.address_data;
                temp_ads['is_default'] = (temp_ads.is_default || 0) == 1 ? 0 : 1;
                this.setData({
                    address_data: temp_ads
                });
            },
            
            // 地址信息识别输入事件
            address_discern_value_event(e) {
                this.setData({
                    address_discern_value: e.detail.value
                });
            },
            
            // 地址信息识别确认事件
            address_discern_submit_event(e) {
                if((this.address_discern_value || null) == null) {
                    app.globalData.showToast('请先输入地址信息');
                    return false
                }

                // 地址识别处理
                this.address_discern_handle({address: this.address_discern_value}, 1, 0);
            },

            // 地址识别处理
            // data 地址信息
            // is_user 是否解析用户信息（0, 1）
            // type 0 用户输入地址信息识别, 1用户选择地理位置识别
            address_discern_handle(data, is_user = 0, type = 0) {
                data['is_user'] = is_user;
                uni.showLoading({
                    title: "处理中...",
                    mask: true
                });
                uni.request({
                    url: app.globalData.get_request_url("address", "index", "intellectstools"),
                    method: "POST",
                    data: data,
                    dataType: "json",
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_ads = this.address_data || {};
                            var ads_data = res.data.data;
                            var upd_data = {
                                province_id: ads_data.province || null,
                                city_id: ads_data.city || null,
                                county_id: ads_data.county || null,
                            }
                            // 地址赋值
                            var arr = ['province', 'city', 'county', 'province_name', 'city_name', 'county_name', 'address', 'name', 'tel'];
                            for(var i in arr) {
                                if((ads_data[arr[i]] || null) != null) {
                                    temp_ads[arr[i]] = ads_data[arr[i]];
                                }
                            }

                            // 用户手动识别操作
                            // 识别成功后清除用户选择的地理位置信息、避免坐标与识别的地址不相符
                            if(type == 0) {
                                // 已获取的数据置为null
                                upd_data['user_location'] = null;
                                // 已有的地址坐标也清除
                                temp_ads['lng'] = '';
                                temp_ads['lat'] = '';
                                // 清除位置缓存信息
                                this.user_location_remove();
                            } else {
                                // 地理位置则把名称加入别名
                                temp_ads['alias'] = this.user_location.name;
                            }
                            upd_data['address_data'] = temp_ads;
                            this.setData(upd_data);

                            // 地区数据填充处理
                            this.region_data_fill_handle();
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        app.globalData.showToast("服务器请求出错");
                    }
                });
            },

            // 数据提交
            form_submit(e) {                
                // 表单数据
                var form_data = e.detail.value;
                // 加入页面请求参数
                form_data['params'] = this.params;

                // 数据校验
                var validation = [
                    { fields: "name", msg: "请填写联系人" },
                    { fields: "tel", msg: "请填写联系电话" },
                    { fields: "province", msg: "请选择省份" },
                    { fields: "city", msg: "请选择城市" },
                    { fields: "county", msg: "请选择区县" },
                    { fields: "address", msg: "请填写详细地址" }
                ];

                // 是否开启了地理位置选择
                if (this.home_user_address_map_status == 1) {
                    validation.push({ fields: "lng", msg: "请选择地理位置" });
                    validation.push({ fields: "lat", msg: "请选择地理位置" });
                }

                // 是否开启了用户身份证信息
                if (this.home_user_address_idcard_status == 1) {
                    // 验证
                    validation.push({ fields: "idcard_name", msg: "请填写身份证姓名" });
                    validation.push({ fields: "idcard_number", msg: "请填写身份证号码" });
                    validation.push({ fields: "idcard_front", msg: "请上传身份证正面照片" });
                    validation.push({ fields: "idcard_back", msg: "请上传身份证背面照片" });
                    
                    // 数据
                    form_data['idcard_front'] = this.idcard_images_data.idcard_front || '';
                    form_data['idcard_back'] = this.idcard_images_data.idcard_back || '';
                }

                form_data['province'] = this.province_id;
                form_data['city'] = this.city_id;
                form_data['county'] = this.county_id;
                form_data['id'] = this.params.id || 0;

                // 默认地址信息
                var temp_ads = this.address_data || {};
                form_data['is_default'] = temp_ads.is_default || 0;

                // 地理位置
                var lng = temp_ads.lng || 0;
                var lat = temp_ads.lat || 0;
                if ((this.user_location || null) != null) {
                    lng = this.user_location.lng || 0;
                    lat = this.user_location.lat || 0;
                }
                form_data['lng'] = lng;
                form_data['lat'] = lat;

                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    // 数据保存
                    this.setData({
                        form_submit_disabled_status: true
                    });
                    uni.showLoading({
                        title: "处理中..."
                    });
                    uni.request({
                        url: app.globalData.get_request_url("save", "useraddress"),
                        method: "POST",
                        data: form_data,
                        dataType: "json",
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, "success");
                                setTimeout(function() {
                                    uni.navigateBack();
                                }, 1000);
                            } else {
                                this.setData({
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
                            this.setData({
                                form_submit_disabled_status: false
                            });
                            uni.hideLoading();
                            app.globalData.showToast("服务器请求出错");
                        }
                    });
                }
            }
        }
    };
</script>
<style>
    @import './user-address-save.css';
</style>
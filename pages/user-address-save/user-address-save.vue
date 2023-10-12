<template>
    <view>
        <view v-if="data_list_loding_status === 3">
            <form @submit="form_submit" class="form-container">
                <view class="padding-main oh">
                    <view class="border-radius-main bg-white spacing-mb oh">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb align-c br-b-f5 padding-bottom-sm">
                                <view class="form-gorup-title">姓名<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="name" :value="address_data.name || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width" placeholder="联系人2~16个字符" />
                            </view>
                            <view class="flex-row jc-sb align-c padding-top-sm">
                                <view class="form-gorup-title">电话<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="tel" :value="address_data.tel || ''" maxlength="30" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width" placeholder="座机或手机" />
                            </view>
                        </view>
                    </view>

                    <view class="border-radius-main bg-white spacing-mb oh">
                        <view class="form-gorup">
                            <view class="flex-row jc-sb br-b-f5 padding-vertical-sm pr">
                                <view class="form-gorup-title">
                                    <text>地区</text>
                                    <text class="form-group-tips-must">*</text>
                                </view>
                                <view class="flex-1 flex-width flex-col">
                                    <view v-if="home_user_address_map_status == 1" @tap="choose_location_event" class="flex-row jc-sb align-c">
                                        <view v-if="home_user_address_map_status == 1" class="cr-main" @tap="choose_location_event">点击选择地理位置</view>
                                        <iconfont name="icon-xzdz-dingwei" size="28rpx"></iconfont>
                                    </view>
                                    <block v-if="is_user_address_forbid_choice_region == 0">
                                        <view class="flex-row align-c" :class="home_user_address_map_status == 1 ? 'br-t-dashed padding-top-sm margin-top-sm' : ''">
                                            <view class="flex-1 flex-width">
                                                <view @tap="open_ragion" class="single-text">
                                                    <text v-if="province_name"> {{ province_name }}{{ city_name ? '-' + city_name : '' }}{{ county_name ? '-' + county_name : '' }} </text>
                                                    <text v-else class="cr-grey-9"> 省市区 </text>
                                                </view>
                                                <component-region-picker :prop-province-id="province_id" :prop-city-id="city_id" :prop-county-id="county_id" :prop-show="region_picker_show" @onclose="close_event" @call-back="region_event"></component-region-picker>
                                            </view>
                                            <view class="code-search oh pr">
                                                <input type="text" maxlength="30" placeholder-class="cr-grey-9" class="cr-base dis-inline-block bg-base text-size-xs padding-left-sm va-m" placeholder="地址编号" @input="region_code_value_event" />
                                                <button type="default" size="mini" class="bg-black br-black cr-white text-size-xs pa" @tap="region_code_event" :disabled="form_submit_disabled_status">检索</button>
                                            </view>
                                        </view>
                                    </block>
                                    <block v-else>
                                        <view v-if="(address_data.province_name || null) != null" :class="home_user_address_map_status == 1 ? 'br-t-dashed padding-top-sm margin-top-sm' : ''">
                                            {{ address_data.province_name }}{{ (address_data.city_name || null) === null ? '' : '-' + address_data.city_name }}{{ (address_data.county_name || null) === null ? '' : '-' + address_data.county_name }}
                                        </view>
                                    </block>
                                </view>
                            </view>
                            <view class="flex-row jc-sb align-c br-b-f5 padding-vertical-sm">
                                <view class="form-gorup-title">地址<text class="form-group-tips-must">*</text></view>
                                <view class="flex-1 flex-width">
                                    <input type="text" name="address" :value="address_data.address || ''" maxlength="80" placeholder-class="cr-grey-9" :class="'cr-base bs-bb ' + (home_user_address_map_status == 1 ? 'address-value' : '')" placeholder="详细地址1~80个字符" />
                                </view>
                            </view>
                            <!-- 智能识别 -->
                            <view v-if="is_user_address_discern == 1" class="pr padding-top-sm">
                                <view class="intelligent-identification oh" :style="identfication_show ? 'height:254rpx;' : 'height:0;'">
                                    <view class="bg-base border-radius-main padding-main oh">
                                        <textarea @input="address_discern_value_event" :value="address_discern_value" class="margin-0" placeholder="粘贴整段地址，自动拆分姓名、电话及地址" placeholder-class="cr-grey" />
                                        <view class="padding-top-sm tr" :class="identfication_show ? '' : 'dis-none'">
                                            <button type="default" size="mini" class="round cr-base text-size-xs margin-right-sm padding-0 tc" @tap="clear_discern_submit_event">清除</button>
                                            <button type="default" size="mini" class="round bg-main cr-white text-size-xs padding-0 tc" @tap="address_discern_submit_event">识别</button>
                                        </view>
                                    </view>
                                </view>
                                <view class="tc padding-top-main" @tap="identfication_change">
                                    <text class="padding-right-sm">地址粘贴板</text>
                                    <iconfont :name="identfication_show ? 'icon-fenlei-top' : 'icon-mendian-jiantou2'" size="28rpx" color="#666"></iconfont>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="border-radius-main bg-white spacing-mb oh">
                        <view class="form-gorup">
                            <view class="flex-row br-b-f5 padding-top-sm padding-bottom-main">
                                <view class="form-gorup-title padding-top-sm alias-title">标签</view>
                                <view class="flex-1 flex-width">
                                    <view class="flex-row">
                                        <view v-for="(item, index) in alias_list" :key="index" class="alias-btn" :class="item === (address_data.alias || null) ? 'bg-main cr-white br-main' : 'bg-white cr-black br-grey-d'" :data-value="item" @tap="alias_change">{{ item }}</view>
                                    </view>
                                    <view class="padding-top-lg label-edit-right">
                                        <view v-if="alias_eidt_bool" class="flex-row align-c alias-add pr">
                                            <input type="text" name="alias" v-model="alias_eidt_text" maxlength="16" placeholder-class="cr-grey-9" class="cr-base dis-inline-block bg-base text-size-xs padding-left-sm va-m" placeholder="请输入标签名称" />
                                            <button type="default" size="mini" class="round cr-white text-size-xs pa" :class="(alias_eidt_text || null) !== null ? 'br-main bg-main' : 'bg-grey br-grey'" @tap="alias_add_submit_event">确定</button>
                                        </view>
                                        <view v-else>
                                            <view v-if="alias_eidt_text">
                                                <view class="flex-row align-c alias-edit">
                                                    <button type="default" size="mini" class="text-size-xs" :class="alias_eidt_text === (address_data.alias || '') ? 'bg-main cr-white br-main' : 'bg-white cr-black br-grey-d'" @tap="alias_checked_change">{{ alias_eidt_text }}</button>
                                                    <button type="default" size="mini" class="bg-main-pair cr-white br-main-pair text-size-xs" @tap="alias_edit_submit_event">编辑</button>
                                                </view>
                                            </view>
                                            <view v-else class="alias-btn bg-white cr-black br-grey-d" @tap="alias_add">
                                                <iconfont name="icon-xzdz-tianjiabiaoq" size="28rpx"></iconfont>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="flex-row jc-sb align-c padding-top-main">
                                <view class="form-gorup-title default-title">设为默认地址</view>
                                <switch :color="theme_color" :checked="(address_data.is_default || 0) == 1 ? true : false" @change="default_ads_change_event" />
                            </view>
                        </view>
                    </view>

                    <!-- 身份证信息 -->
                    <view v-if="home_user_address_idcard_status == 1" class="idcard-container border-radius-main bg-white oh">
                        <view class="form-gorup">
                            <view class="flex-row align-c br-b-f5 padding-vertical-sm">
                                <view class="form-gorup-title">身份证姓名<text class="form-group-tips-must">*</text></view>
                                <input type="text" name="idcard_name" :value="address_data.idcard_name || ''" maxlength="16" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width" placeholder="请填写真实姓名" />
                            </view>
                            <view class="flex-row align-c br-b-f5 padding-vertical-sm">
                                <view class="form-gorup-title">身份证号码<text class="form-group-tips-must">*</text></view>
                                <input type="idcard" name="idcard_number" :value="address_data.idcard_number || ''" maxlength="18" placeholder-class="cr-grey-9" class="cr-base flex-1 flex-width" placeholder="请填写身份证号" />
                            </view>
                            <view class="flex-row align-c padding-vertical-sm margin-bottom-lg">
                                <view class="form-gorup-title">身份证照片<text class="form-group-tips-must">*</text></view>
                                <view class="form-upload-data cr-grey-9">请填使用身份证原件进行拍摄，图片清晰</view>
                            </view>
                            <view class="flex-row align-c">
                                <view class="flex-width-half oh padding-right-main pr">
                                    <view v-if="(idcard_images_data.idcard_front || null) != null" class="pa top-0 right-0 z-i padding-right-main" @tap="upload_delete_event" data-value="idcard_front">
                                        <iconfont name="icon-bjdz-guanbi" size="28rpx" color="cr-grey-d"></iconfont>
                                    </view>
                                    <image class="wh-auto" :src="(idcard_images_data.idcard_front || null) != null ? idcard_images_data.idcard_front : common_static_url + 'idcard-front.jpg'" data-value="idcard_front" mode="widthFix" @tap="file_upload_event"></image>
                                </view>
                                <view class="flex-width-half oh padding-left-main pr">
                                    <view v-if="(idcard_images_data.idcard_back || null) != null" class="pa top-0 right-0 z-i" @tap="upload_delete_event" data-value="idcard_back">
                                        <iconfont name="icon-bjdz-guanbi" size="28rpx" color="cr-grey-d"></iconfont>
                                    </view>
                                    <image class="wh-auto" :src="(idcard_images_data.idcard_back || null) != null ? idcard_images_data.idcard_back : common_static_url + 'idcard-back.jpg'" data-value="idcard_back" mode="widthFix" @tap="file_upload_event"></image>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="padding-vertical-main margin-top-sm spacing-mb">
                        <view class="bottom-line-exclude oh">
                            <button class="cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status" :style="btn_bg_color">保存</button>
                            <button v-if="params && (params.id || null) !== null && params.id !== '0'" class="round bg-white cr-main br-main spacing-mt" type="default" @tap="address_delete_event" hover-class="none">删除</button>
                        </view>
                    </view>
                </view>
            </form>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '@/components/no-data/no-data';
    import componentRegionPicker from '@/components/region-picker/region-picker';

    var common_static_url = app.globalData.get_static_url('common');
    const theme_color = app.globalData.get_theme_color();
    const theme_color_light = app.globalData.get_theme_color(true);
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                theme_color: app.globalData.get_theme_color(),
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                editor_path_type: '',
                address_data: {},
                // id
                province_id: null,
                city_id: null,
                county_id: null,
                // name
                province_name: '',
                city_name: '',
                county_name: '',
                idcard_images_data: {},
                user_location_cache_key: app.globalData.data.cache_userlocation_key,
                user_location: null,
                address_discern_value: '',
                form_submit_disabled_status: false,
                region_code_value: '',
                // 基础配置
                home_user_address_map_status: 0,
                home_user_address_idcard_status: 0,
                is_user_address_discern: 0,
                is_user_address_location_discern: 0,
                is_user_address_forbid_choice_region: 0,
                // 多列选择器
                region_picker_show: false,
                // 智能识别
                identfication_show: false,
                // 别名
                alias_list: ['家', '公司', '学校'],
                alias_eidt_bool: false,
                alias_eidt_text: '',
                btn_bg_color: 'background:linear-gradient(107deg, ' + theme_color_light + ' 0%, ' + theme_color + ' 100%)',
            };
        },

        components: {
            componentRegionPicker,
            componentNoData,
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params,
            });
        },

        onReady: function () {
            uni.setNavigationBarTitle({
                title: '地址' + ((this.params.id || null) == null ? '添加' : '编辑'),
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
                        is_user_address_forbid_choice_region: app.globalData.get_config('plugins_base.intellectstools.data.is_user_address_forbid_choice_region', 0),
                        data_list_loding_status: 3,
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.redirectTo({
                            url: '/pages/login/login?event_callback=init',
                        });
                        return false;
                    } else {
                        this.get_data();
                    }
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'useraddress'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || null;
                            var ads_data = data.data || null;
                            var idcard_images = {
                                idcard_front: ads_data == null ? '' : ads_data.idcard_front || '',
                                idcard_back: ads_data == null ? '' : ads_data.idcard_back || '',
                            };
                            var alias = '';
                            if (ads_data) {
                                alias = ads_data.alias || '';
                            }
                            this.setData({
                                address_data: ads_data || {},
                                idcard_images_data: idcard_images,
                                editor_path_type: data.editor_path_type || '',
                                alias_eidt_text: alias || '',
                            });
                            if (this.alias_list.indexOf(alias) === -1) {
                                this.setData({
                                    alias_eidt_text: alias || '',
                                });
                            }

                            // 数据设置
                            if (ads_data != null) {
                                this.setData({
                                    province_id: ads_data.province || null,
                                    city_id: ads_data.city || null,
                                    county_id: ads_data.county || null,
                                    city_name: ads_data.city_name || '',
                                    province_name: ads_data.province_name || '',
                                    county_name: ads_data.county_name || '',
                                });

                                // 地理位置
                                var lng = ads_data.lng || 0;
                                var lat = ads_data.lat || 0;
                                if (lng != 0 && lat != 0) {
                                    this.setData({
                                        user_location: {
                                            lng: lng,
                                            lat: lat,
                                            address: ads_data.address || '',
                                        },
                                    });
                                }
                            }
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        app.globalData.showToast('省份信息失败');
                    },
                });
            },

            // 选择地理位置
            choose_location_event(e) {
                uni.navigateTo({
                    url: '/pages/common/open-setting-location/open-setting-location',
                });
            },

            // 清除位置缓存信息
            user_location_remove() {
                uni.removeStorage({
                    key: this.user_location_cache_key,
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
                        lng: result.longitude || null,
                    };
                }
                this.setData({
                    user_location: data,
                });

                // 是否开启地理位置选择后自动识别
                if (result != null && this.is_user_address_location_discern == 1) {
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
                    },
                });
            },

            // 采用递归的方式上传多张
            upload_one_by_one(img_paths, success, fail, count, length, form_name) {
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
                                var temp_idcard_images_data = self.idcard_images_data || {};
                                temp_idcard_images_data[form_name] = data.data.url;
                                self.setData({
                                    idcard_images_data: temp_idcard_images_data,
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
                            self.upload_one_by_one(img_paths, success, fail, count, length, form_name);
                        }
                    },
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
                                idcard_images_data: temp_idcard_images_data,
                            });
                        }
                    },
                });
            },

            // 默认地址设置改变
            default_ads_change_event(e) {
                var temp_ads = this.address_data;
                temp_ads['is_default'] = (temp_ads.is_default || 0) == 1 ? 0 : 1;
                this.setData({
                    address_data: temp_ads,
                });
            },

            // 地址信息识别输入事件
            address_discern_value_event(e) {
                this.setData({
                    address_discern_value: e.detail.value,
                });
            },

            // 地址信息识别确认事件
            address_discern_submit_event(e) {
                if ((this.address_discern_value || null) == null) {
                    app.globalData.showToast('请先输入地址信息');
                    return false;
                }

                // 地址识别处理
                this.address_discern_handle({ address: this.address_discern_value }, 1, 0);
            },
            // 清除
            clear_discern_submit_event() {
                this.setData({
                    address_discern_value: '',
                });
            },

            // 地址识别处理
            // data 地址信息
            // is_user 是否解析用户信息（0, 1）
            // type 0 用户输入地址信息识别, 1用户选择地理位置识别
            address_discern_handle(data, is_user = 0, type = 0) {
                data['is_user'] = is_user;
                uni.showLoading({
                    title: '处理中...',
                    mask: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('address', 'index', 'intellectstools'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var temp_ads = this.address_data || {};
                            var ads_data = res.data.data;
                            var upd_data = {
                                province_id: ads_data.province || null,
                                city_id: ads_data.city || null,
                                county_id: ads_data.county || null,
                                city_name: ads_data.city_name || '',
                                province_name: ads_data.province_name || '',
                                county_name: ads_data.county_name || '',
                            };
                            // 地址赋值
                            var arr = ['province', 'city', 'county', 'province_name', 'city_name', 'county_name', 'address', 'name', 'tel'];
                            for (var i in arr) {
                                if ((ads_data[arr[i]] || null) != null) {
                                    temp_ads[arr[i]] = ads_data[arr[i]];
                                }
                            }

                            // 用户手动识别操作
                            // 识别成功后清除用户选择的地理位置信息、避免坐标与识别的地址不相符
                            if (type == 0) {
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
                        app.globalData.showToast('服务器请求出错');
                    },
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
                    { fields: 'name', msg: '请填写联系人' },
                    { fields: 'tel', msg: '请填写联系电话' },
                    { fields: 'province', msg: '请选择省份' },
                    { fields: 'city', msg: '请选择城市' },
                    { fields: 'address', msg: '请填写详细地址' },
                ];

                // 是否开启了地理位置选择
                if (this.home_user_address_map_status == 1) {
                    validation.push({ fields: 'lng', msg: '请选择地理位置' });
                    validation.push({ fields: 'lat', msg: '请选择地理位置' });
                }

                // 是否开启了用户身份证信息
                if (this.home_user_address_idcard_status == 1) {
                    // 验证
                    validation.push({ fields: 'idcard_name', msg: '请填写身份证姓名' });
                    validation.push({ fields: 'idcard_number', msg: '请填写身份证号码' });
                    validation.push({ fields: 'idcard_front', msg: '请上传身份证正面照片' });
                    validation.push({ fields: 'idcard_back', msg: '请上传身份证背面照片' });

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
                        form_submit_disabled_status: true,
                    });
                    uni.showLoading({
                        title: '处理中...',
                    });
                    uni.request({
                        url: app.globalData.get_request_url('save', 'useraddress'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                this.back_prev_event();
                            } else {
                                this.setData({
                                    form_submit_disabled_status: false,
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
                                form_submit_disabled_status: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast('服务器请求出错');
                        },
                    });
                }
            },

            // 地址编号输入事件
            region_code_value_event(e) {
                this.setData({
                    region_code_value: e.detail.value,
                });
            },
            // 地址编号搜索
            region_code_event(e) {
                if ((this.region_code_value || null) == null) {
                    app.globalData.showToast('请输入数据');
                    return false;
                }
                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('codedata', 'region'),
                    method: 'POST',
                    data: { code: this.region_code_value },
                    dataType: 'json',
                    success: (res) => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg, 'success');
                            var ads_data = res.data.data;
                            this.setData({
                                province_id: ads_data.province_id || null,
                                city_id: ads_data.city_id || null,
                                county_id: ads_data.county_id || null,
                                province_name: ads_data.province_name || null,
                                city_name: ads_data.city_name || null,
                                county_name: ads_data.county_name || null,
                            });
                            if (!this.province_id || !this.city_id) {
                                this.setData({
                                    region_picker_show: true,
                                });
                            }
                        } else {
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            open_ragion(e) {
                this.setData({
                    region_picker_show: true,
                });
            },
            close_event(data) {
                this.setData({
                    region_picker_show: false,
                });
            },
            region_event(address1, address2, address3) {
                this.setData({
                    province_id: address1.id || null,
                    city_id: address2.id || null,
                    county_id: address3.id || null,
                    province_name: address1.name || '',
                    city_name: address2.name || '',
                    county_name: address3.name || '',
                });
            },
            // 地址粘贴板
            identfication_change() {
                this.setData({
                    identfication_show: !this.identfication_show,
                });
            },
            // 别名
            alias_change(e) {
                let val = e.currentTarget.dataset.value || null;
                this.$set(this.address_data, 'alias', val);
                this.setData({
                    alias_eidt_bool: false,
                });
            },
            // 新增别名选中
            alias_checked_change() {
                this.$set(this.address_data, 'alias', this.alias_eidt_text);
            },
            // 新增别名
            alias_add(e) {
                this.setData({
                    alias_eidt_bool: true,
                });
            },
            // 别名提交
            alias_add_submit_event() {
                this.setData({
                    alias_eidt_bool: false,
                });
                this.$set(this.address_data, 'alias', this.alias_eidt_text);
            },
            // 别名编辑
            alias_edit_submit_event() {
                this.setData({
                    alias_eidt_bool: true,
                });
            },
            // 删除地址
            address_delete_event() {
                var value = this.params.id || null;
                if (value == null) {
                    app.globalData.showToast('地址ID有误');
                    return false;
                }

                var self = this;
                uni.showModal({
                    title: '温馨提示',
                    content: '删除后不可恢复，确定继续吗?',
                    confirmText: '确认',
                    cancelText: '不了',
                    success: (result) => {
                        if (result.confirm) {
                            // 加载loding
                            uni.showLoading({
                                title: '处理中...',
                            });

                            // 获取数据
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'useraddress'),
                                method: 'POST',
                                data: {
                                    id: value,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, 'success');
                                        this.back_prev_event();
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
                                    app.globalData.showToast('服务器请求出错');
                                },
                            });
                        }
                    },
                });
            },
            back_prev_event() {
                var pages = app.globalData.prev_page();
                if (pages) {
                    setTimeout(function () {
                        uni.navigateBack();
                    }, 1000);
                } else {
                    setTimeout(function () {
                        uni.redirectTo({
                            url: '/pages/user-address/user-address',
                        });
                    }, 1000);
                }
            },
        },
    };
</script>
<style scoped>
    @import './user-address-save.css';
</style>

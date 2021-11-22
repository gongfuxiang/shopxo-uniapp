<script>
    export default {
        globalData: {
            data: {
                // uuid缓存key
                cache_user_uuid_key: "cache_user_uuid_key",
                // 配置信息缓存key
                cache_config_info_key: "cache_config_info_key",
                // 用户登录缓存key
                cache_user_login_key: "cache_user_login_key",
                // 用户信息缓存key
                cache_user_info_key: "cache_shop_user_info_key",
                // 用户站点信息缓存key
                cache_user_merchant_key: "cache_shop_user_merchant_key",
                // 设备信息缓存key
                cache_system_info_key: "cache_shop_system_info_key",
                // 用户地址选择缓存key
                cache_buy_user_address_select_key: "cache_buy_user_address_select_key",
                // 启动参数缓存key
                cache_launch_info_key: "cache_shop_launch_info_key",
                // 获取位置选择缓存key
                cache_userlocation_key: "cache_userlocation_key",
                // 默认用户头像
                default_user_head_src: "/static/images/common/user.png",
                // 成功圆形提示图片
                default_round_success_icon: "/static/images/common/round-success-icon.png",
                // 错误圆形提示图片
                default_round_error_icon: "/static/images/common/round-error-icon.png",
                // tabbar页面
                tabbar_pages: [
                    "/pages/index/index",
                    "/pages/goods-category/goods-category",
                    "/pages/cart/cart",
                    "/pages/user/user"
                ],
                // 请求地址
                request_url: 'https://d1.shopxo.vip/',
                // 静态资源地址
                static_url: 'https://d1.shopxo.vip/',
                // 基础信息
                application_title: "ShopXO",
                application_describe: "ShopXO开源商城、MIT协议、可商用、可二次开发、满足99%电商运营需求",
                // 版本号
                version: "v2.2.2",
                // 货币价格符号
                currency_symbol: "￥",
                // 主题类型        主题颜色
                // 黄色 yellow    #f6c133
                // 红色 red       #ff0036
                // 黑色 black     #333333
                // 绿色 green     #20a53a
                // 橙色 orange    #fe6f04
                // 蓝色 blue      #1677ff
                // 棕色 brown     #8B4513
                // 紫色 purple    #623cec
                default_theme: "yellow"
            },

            /**
             * 启动参数处理
             */
            launch_params_handle(params) {
                // 启动参数处理
                if ((params.query || null) != null) {
                    params = params.query;
                }
                if ((params.scene || null) != null) {
                    params = this.url_params_to_json(decodeURIComponent(params.scene));
                }

                // 缓存启动参数
                uni.setStorage({
                    key: this.data.cache_launch_info_key,
                    data: params
                });
                return params;
            },

            /**
             * 获取设备信息
             */
            get_system_info(key) {
                var info = uni.getStorageSync(this.data.cache_system_info_key) || null;
                if (info == null) {
                    info = this.set_system_info();
                }
                return (key|| null) == null ? info : (info[key] == undefined) ? null : info[key];
            },

            /**
             * 设置设备信息
             */
            set_system_info() {
                var system_info = uni.getSystemInfoSync();
                uni.setStorage({
                    key: this.data.cache_system_info_key,
                    data: system_info
                });
                return system_info;
            },

            /**
             * 请求地址生成
             * a              方法
             * c              控制器
             * plugins        插件标记（传参则表示为插件请求）
             * params         url请求参数
             */
            get_request_url(a, c, plugins, params) {
                a = a || "index";
                c = c || "index";
                
                // 是否插件请求、走api统一插件调用控制器
                var plugins_params = "";
                if ((plugins || null) != null) {
                    plugins_params = "&pluginsname=" + plugins + "&pluginscontrol=" + c + "&pluginsaction=" + a;
                    c = "plugins";
                    a = "index";
                }

                // 参数处理
                params = params || "";
                if (params != "" && params.substr(0, 1) != "&") {
                    params = "&" + params;
                }

                // 用户信息
                var user = this.get_user_cache_info();
                var token = user == false ? '' : user.token || '';
                var uuid = this.request_uuid();
                var client_value = this.application_client_type();
                return this.data.request_url + "api.php?s=" + c + "/" + a + plugins_params + "&application=app&application_client_type="+ client_value + "&token=" + token + "&ajax=ajax" + "&uuid=" + uuid + params;
            },

            /**
             * 获取用户信息,信息不存在则唤醒授权
             * object     回调操作对象
             * method     回调操作对象的函数
             * return     有用户数据直接返回, 则回调调用者
             */
            get_user_info(object, method) {
                var user = this.get_user_cache_info();
                if (user == false) {
                    // 唤醒用户授权
                    this.user_login(object, method);
                    return false;
                }
                return user;
            },

            /**
             * 从缓存获取用户信息、可指定key和默认值
             * key              数据key
             * default_value    默认值
             */
            get_user_cache_info(key, default_value) {
                var user = uni.getStorageSync(this.data.cache_user_info_key) || null;
                if (user == null) {
                    // 是否存在默认值
                    return default_value == undefined ? false : default_value;
                }

                // 是否读取key
                if ((key || null) != null) {
                    return user[key] == undefined ? default_value == undefined ? null : default_value : user[key];
                }

                return user;
            },

            /**
             * 用户登录
             * object     回调操作对象
             * method     回调操作对象的函数
             * auth_data  授权数据
             */
            user_auth_login(object, method, auth_data) {
                var self = this;
                // #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
                uni.checkSession({
                    success: function() {
                        var login_data = uni.getStorageSync(self.data.cache_user_login_key) || null;
                        if (login_data == null) {
                            self.user_login(object, method);
                        } else {
                            self.get_user_login_info(object, method, login_data, auth_data);
                        }
                    },
                    fail: function() {
                        uni.removeStorageSync(self.data.cache_user_login_key);
                        self.user_login(object, method);
                    }
                });
                // #endif
                // #ifdef MP-ALIPAY
                var login_data = uni.getStorageSync(self.data.cache_user_login_key) || null;
                if (login_data == null) {
                    self.user_login(object, method);
                } else {
                    self.get_user_login_info(object, method, login_data, auth_data);
                }
                // #endif
            },

            /**
             * 用户登录
             * object     回调操作对象
             * method     回调操作对象的函数
             * auth_data  授权数据
             */
            user_login(object, method) {
                var login_data = uni.getStorageSync(this.data.cache_user_login_key) || null;
                if (login_data == null) {
                    var self = this;
                    uni.showLoading({
                        title: "授权中..."
                    });
                    var action = 'login';
                    // #ifdef MP-BAIDU
                    action = 'getLoginCode';
                    // #endif
                    uni[action]({
                        success: res => {
                            if (res.code) {
                                uni.request({
                                    url: self.get_request_url('appminiuserauth', 'user'),
                                    method: 'POST',
                                    data: {
                                        authcode: res.code
                                    },
                                    dataType: 'json',
                                    success: res => {
                                        uni.hideLoading();
                                        if (res.data.code == 0) {
                                            var data = res.data.data;
                                            if ((data.is_user_exist || 0) == 1) {
                                                uni.setStorage({
                                                    key: self.data.cache_user_info_key,
                                                    data: data,
                                                    success: res => {
                                                        if (typeof object === 'object' && (method || null) != null) {
                                                            object[method]();
                                                        }
                                                    },
                                                    fail: () => {
                                                        self.showToast('用户信息缓存失败');
                                                    }
                                                });
                                            } else {
                                                uni.setStorage({
                                                    key: self.data.cache_user_login_key,
                                                    data: data
                                                });
                                                self.login_to_auth();
                                            }
                                        } else {
                                            uni.hideLoading();
                                            self.showToast(res.data.msg);
                                        }
                                    },
                                    fail: () => {
                                        uni.hideLoading();
                                        self.showToast('服务器请求出错');
                                    }
                                });
                            }
                        },
                        fail: e => {
                            uni.hideLoading();
                            self.showToast('授权失败');
                        }
                    });
                } else {
                    this.login_to_auth();
                }
            },

            /**
             * 跳转到登录页面授权
             */
            login_to_auth() {
                uni.showModal({
                    title: '温馨提示',
                    content: '授权用户信息',
                    confirmText: '确认',
                    cancelText: '暂不',
                    success: result => {
                        if (result.confirm) {
                            uni.navigateTo({
                                url: "/pages/login/login"
                            });
                        }
                    }
                });
            },

            /**
             * 获取用户授权信息
             * object     回调操作对象
             * method     回调操作对象的函数
             * login_data 登录信息
             * auth_data  授权数据
             */
            get_user_login_info(object, method, login_data, auth_data) {
                // 邀请人参数
                var params = uni.getStorageSync(this.data.cache_launch_info_key) || null;
                console.log(params);
                var referrer = params == null ? 0 : params.referrer || 0;

                // 请求数据
                var data = {
                    "auth_data": JSON.stringify(auth_data),
                    "openid": login_data.openid,
                    "unionid": login_data.unionid,
                    "referrer": referrer
                };
                
                // 用户信息处理
                uni.showLoading({
                    title: "授权中..."
                });
                var self = this;
                uni.request({
                    url: self.get_request_url('appminiuserinfo', 'user'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            uni.setStorage({
                                key: self.data.cache_user_info_key,
                                data: res.data.data,
                                success: res => {
                                    if (typeof object === 'object' && (method || null) != null) {
                                        object[method]();
                                    }
                                },
                                fail: () => {
                                    self.showToast('用户信息缓存失败');
                                }
                            });
                        } else {
                            self.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.showToast('服务器请求出错');
                    }
                });
            },

            /**
             * 字段数据校验
             * data           待校验的数据, 一维json对象
             * validation     待校验的字段, 格式 [{fields: 'mobile', msg: '请填写手机号码', is_can_zero: 1(是否可以为0)}, ...]
             */
            fields_check(data, validation) {
                for (var i in validation) {
                    var temp_value = data[validation[i]["fields"]];
                    var temp_is_can_zero = validation[i]["is_can_zero"] || null;
                    if (temp_value == undefined || temp_value.length == 0 || temp_value == -1 || temp_is_can_zero ==
                        null && temp_value == 0) {
                        this.showToast(validation[i]['msg']);
                        return false;
                    }
                }
                return true;
            },

            /**
             * 获取当前时间戳
             */
            get_timestamp() {
                return parseInt(new Date().getTime() / 1000);
            },

            /**
             * 获取日期
             * format       日期格式（默认 yyyy-MM-dd h:m:s）
             * timestamp    时间戳（默认当前时间戳）
             */
            get_date(format, timestamp) {
                var d = new Date((timestamp || this.get_timestamp()) * 1000);
                var date = {
                    "M+": d.getMonth() + 1,
                    "d+": d.getDate(),
                    "h+": d.getHours(),
                    "m+": d.getMinutes(),
                    "s+": d.getSeconds(),
                    "q+": Math.floor((d.getMonth() + 3) / 3),
                    "S+": d.getMilliseconds()
                };
                if (/(y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (var k in date) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                    }
                }

                return format;
            },

            /**
             * 获取对象、数组的长度、元素个数
             * obj      要计算长度的元素（object、array、string）
             */
            get_length(obj) {
                var obj_type = typeof obj;
                if (obj_type == "string") {
                    return obj.length;
                } else if (obj_type == "object") {
                    var obj_len = 0;
                    for (var i in obj) {
                        obj_len++;
                    }
                    return obj_len;
                }
                return false;
            },

            /**
             * 价格保留两位小数
             * price      价格保留两位小数
             */
            price_two_decimal(x) {
                var f_x = parseFloat(x);
                if (isNaN(f_x)) {
                    return 0;
                }
                var f_x = Math.round(x * 100) / 100;
                var s_x = f_x.toString();
                var pos_decimal = s_x.indexOf('.');
                if (pos_decimal < 0) {
                    pos_decimal = s_x.length;
                    s_x += '.';
                }
                while (s_x.length <= pos_decimal + 2) {
                    s_x += '0';
                }
                return s_x;
            },
            
            url_value_handle(url) {
                if (url.indexOf("?") == -1) {
                    var value = url;
                } else {
                    var temp_str = url.split("?");
                    var value = temp_str[0];
                }
                return value;
            },

            /**
             * 当前地址是否存在tabbar中
             */
            is_tabbar_pages(url) {
                var value = this.url_value_handle(url);
                if ((value || null) == null) {
                    return false;
                }
                var temp_tabbar_pages = this.data.tabbar_pages;
                for (var i in temp_tabbar_pages) {
                    if (temp_tabbar_pages[i] == value) {
                        return true;
                    }
                }
                return false;
            },

            /**
             * 事件操作
             */
            operation_event(e) {
                var value = e.currentTarget.dataset.value || null;
                var type = parseInt(e.currentTarget.dataset.type);
                if (value != null) {
                    switch (type) {
                        // web
                        case 0:
                            this.open_web_view(value);
                            break;
                        // 内部页面
                        case 1:
                            if (this.is_tabbar_pages(value)) {
                                uni.switchTab({
                                    url: value
                                });
                            } else {
                                uni.navigateTo({
                                    url: value
                                });
                            }
                            break;
                        // 跳转到外部小程序
                        case 2:
                            uni.navigateToMiniProgram({
                                appId: value
                            });
                            break;
                        // 跳转到地图查看位置
                        case 3:
                            var values = value.split('|');
                            if (values.length != 4) {
                                this.showToast('事件值格式有误');
                                return false;
                            }
                            this.open_location(values[2], values[3], values[0], values[1]);
                            break;
                        // 拨打电话
                        case 4:
                            this.call_tel(value);
                            break;
                    }
                }
            },

            /**
             * 打开 webview页面
             * value    [string]  url地址
             */
            open_web_view(value) {
                uni.navigateTo({
                    url: '/pages/web-view/web-view?url=' + encodeURIComponent(value)
                });
            },

            /**
             * 默认弱提示方法
             * msg    [string]  提示信息
             * status [string]  状态 默认error [正确success, 错误error]
             */
            showToast(msg, status) {
                if ((status || 'error') == 'success') {
                    uni.showToast({
                        icon: 'success',
                        title: msg,
                        duration: 3000
                    });
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: msg,
                        duration: 3000
                    });
                }
            },

            /**
             * alert确认框
             * title              [string]    标题（默认空）
             * msg                [string]    提示信息，必传
             * is_show_cancel     [int]       是否显示取消按钮（默认显示 0否, 1|undefined是）
             * cancel_text        [string]    取消按钮文字（默认 取消）
             * cancel_color       [string]    取消按钮的文字颜色，必须是 16 进制格式的颜色字符串（默认 #000000）
             * confirm_text       [string]    确认按钮文字（默认 确认）
             * confirm_color      [string]    确认按钮的文字颜色，必须是 16 进制格式的颜色字符串（默认 #000000）
             * object             [boject]    回调操作对象，点击确认回调参数1，取消回调0
             * method             [string]    回调操作对象的函数
             */
            alert(e) {
                var msg = e.msg || null;
                if (msg != null) {
                    var title = e.title || '';
                    var is_show_cancel = e.is_show_cancel == 0 ? false : true;
                    var cancel_text = e.cancel_text || '取消';
                    var confirm_text = e.confirm_text || '确认';
                    var cancel_color = e.cancel_color || '#000000';
                    var confirm_color = e.confirm_color || '#576B95';
                    uni.showModal({
                        title: title,
                        content: msg,
                        showCancel: is_show_cancel,
                        cancelText: cancel_text,
                        cancelColor: cancel_color,
                        confirmText: confirm_text,
                        confirmColor: confirm_color,
                        success(res) {
                            if ((e.object || null) != null && typeof e.object === 'object' && (e.method || null) != null) {
                                e.object[e.method](res.confirm ? 1 : 0);
                            }
                        }
                    });
                } else {
                    self.showToast('提示信息为空 alert');
                }
            },

            /**
             * 是否需要登录
             * 是否需要绑定手机号码
             */
            user_is_need_login(user) {
                // 用户信息是否正确
                if (user == false) {
                    return true;
                }
                // 是否需要绑定手机号码
                if ((user.is_mandatory_bind_mobile || 0) == 1) {
                    if ((user.mobile || null) == null) {
                        return true;
                    }
                }
                return false;
            },

            /**
             * url参数转json对象
             */
            url_params_to_json(url_params) {
                var json = new Object();
                if ((url_params || null) != null) {
                    var arr = url_params.split('&');
                    for (var i = 0; i < arr.length; i++) {
                        var temp = arr[i].split('=');
                        json[temp[0]] = temp[1];
                    }
                }
                return json;
            },

            // 拨打电话
            call_tel(value) {
                if ((value || null) != null) {
                    uni.makePhoneCall({
                        phoneNumber: value.toString()
                    });
                }
            },

            /**
             * 登录校验
             * object     回调操作对象
             * method     回调操作对象的函数
             */
            is_login_check(res, object, method) {
                if (res.code == -400) {
                    uni.clearStorage();
                    this.get_user_info(object, method);
                    return false;
                }
                return true;
            },

            /**
             * 设置导航reddot
             * index     tabBar 的哪一项，从左边算起（0开始）
             * type      0 移出, 1 添加 （默认 0 移出）
             */
            set_tab_bar_reddot(index, type) {
                if (index !== undefined && index !== null) {
                    if ((type || 0) == 0) {
                        uni.hideTabBarRedDot({
                            index: Number(index)
                        });
                    } else {
                        uni.showTabBarRedDot({
                            index: Number(index)
                        });
                    }
                }
            },

            /**
             * 设置导航车badge
             * index     tabBar 的哪一项，从左边算起（0开始）
             * type      0 移出, 1 添加 （默认 0 移出）
             * value     显示的文本，超过 4 个字符则显示成 ...（type参数为1的情况下有效）
             */
            set_tab_bar_badge(index, type, value) {
                if (index !== undefined && index !== null) {
                    if ((type || 0) == 0) {
                        uni.removeTabBarBadge({
                            index: Number(index)
                        });
                    } else {
                        uni.setTabBarBadge({
                            index: Number(index),
                            "text": value.toString()
                        });
                    }
                }
            },

            // 显示分享菜单
            show_share_menu() {
                // #ifdef MP-WEIXIN
                uni.showShareMenu({
                    withShareTicket: true,
                    menus: ['shareAppMessage', 'shareTimeline']
                });
                // #endif
            },

            /**
             * 获取配置信息、可指定key和默认值
             * key              数据key（支持多级读取、以 . 分割key名称）
             * default_value    默认值
             */
            get_config(key, default_value) {
                var value = null;
                var config = uni.getStorageSync(this.data.cache_config_info_key) || null;
                if (config != null) {
                    // 数据读取
                    var arr = key.split('.');
                    if (arr.length == 1) {
                        value = config[key] == undefined ? null : config[key];
                    } else {
                        value = config;
                        for (var i in arr) {
                            if (value[arr[i]] != undefined) {
                                value = value[arr[i]];
                            } else {
                                value = null;
                                break;
                            }
                        }
                    }
                }
                return value === null ? default_value === undefined ? value : default_value : value;
            },

            // 初始化 配置信息
            init_config() {
                var self = this;
                uni.request({
                    url: this.get_request_url('common', 'base'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: res => {
                        if (res.data.code == 0) {
                            uni.setStorage({
                                key: this.data.cache_config_info_key,
                                data: res.data.data,
                                fail: () => {
                                    this.showToast('配置信息缓存失败');
                                }
                            });
                        } else {
                            this.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        this.showToast('服务器请求出错');
                    }
                });
            },

            /**
             * 配置是否有效(100毫秒检验一次、最多检验100次)
             * object     回调操作对象
             * method     回调操作对象的函数
             */
            is_config(object, method) {
                var self = this;
                var count = 0;
                var timer = setInterval(function() {
                    if (self.get_config('status') == 1) {
                        clearInterval(timer);

                        if (typeof object === 'object' && (method || null) != null) {
                            object[method](true);
                        }
                    }
                    count++;

                    if (count >= 100) {
                        clearInterval(timer);
                    }
                }, 100);
            },

            /**
             * 火星坐标GCJ02到百度坐标BD-09(高德，谷歌，腾讯坐标 -> 百度)
             * lng     经度
             * lat     纬度
             */
            map_gcj_to_bd(lng, lat) {
                lng = parseFloat(lng);
                lat = parseFloat(lat);
                let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
                let x = lng;
                let y = lat;
                let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                let lngs = z * Math.cos(theta) + 0.0065;
                let lats = z * Math.sin(theta) + 0.006;
                return {
                    lng: lngs,
                    lat: lats
                };
            },

            /**
             * 百度坐标BD-09到火星坐标GCJ02(百度 -> 高德，谷歌，腾讯坐标)
             * lng     经度
             * lat     纬度
             */
            map_bd_to_gcj(lng, lat) {
                lng = parseFloat(lng);
                lat = parseFloat(lat);
                let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
                let x = lng - 0.0065;
                let y = lat - 0.006;
                let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                let lngs = z * Math.cos(theta);
                let lats = z * Math.sin(theta);
                return {
                    lng: lngs,
                    lat: lats
                };
            },

            /**
             * 百度坐标BD-09到火星坐标GCJ02(高德，谷歌，腾讯坐标)
             * lng        经度
             * lat        纬度
             * name       地图上面显示的名称
             * address    地图上面显示的详细地址
             * scale      缩放比例，范围5~18
             */
            open_location(lng, lat, name, address, scale) {
                if (lng == undefined || lat == undefined || lng == '' || lat == '') {
                    this.showToast('坐标有误');
                    return false;
                }
                
                // 转换坐标打开位置
                var position = this.map_bd_to_gcj(lng, lat);
                uni.openLocation({
                    name: name || '地理位置',
                    address: address || '',
                    scale: scale || 18,
                    longitude: position.lng,
                    latitude: position.lat
                });
            },

            // uuid生成
            uuid() {
                var d = new Date().getTime();
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
                });
            },

            // 获取当前uuid
            request_uuid() {
                var uuid = uni.getStorageSync(this.data.cache_user_uuid_key) || null;
                if (uuid == null) {
                    uuid = this.uuid();
                    uni.setStorage({
                        key: this.data.cache_user_uuid_key,
                        data: uuid,
                        fail: () => {
                            this.showToast('uuid缓存失败');
                        }
                    });
                }
                return uuid;
            },

            // 链接地址事件
            url_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    var temp = value.substr(0, 6);
                    if (temp == 'http:/' || temp == 'https:') {
                        this.open_web_view(value);
                    } else {
                        if (this.is_tabbar_pages(value)) {
                            uni.switchTab({
                                url: value
                            });
                        } else {
                            uni.navigateTo({
                                url: value
                            });
                        }
                    }
                }
            },

            // 剪贴板
            text_copy_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    var self = this;
                    uni.setClipboardData({
                        data: value,
                        success(res) {
                            uni.getClipboardData({
                                success(res) {
                                    self.showToast('复制成功', 'success');
                                }
                            });
                        }
                    });
                } else {
                    this.showToast('复制内容为空');
                }
            },

            // 图片预览
            image_show_event(e) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: [value]
                    });
                } else {
                    this.showToast('图片地址为空');
                }
            },

            // 静态文件url地址
            get_static_url(type, is_plugins) {
                // 默认公共地址
                if((type || null) == null) {
                    type = 'common';
                }
                
                // 是否插件
                if((is_plugins || false) == true) {
                    // 根据配置的静态url地址+插件标识符
                    return this.data.static_url+'static/plugins/images/'+type+'/';
                } else {
                    // 根据配置的静态url地址+主题标识+参数类型组合远程静态文件地址
                    return this.data.static_url+'static/app/'+this.data.default_theme+'/'+type+'/';
                }
            },
            
            // rpx转px
            rpx_to_px(value) {
                return ((value || 0) == 0) ? 0 : value / 750 * this.get_system_info('windowWidth');
            },
            
            // px转rpx
            px_to_rpx(value) {
                return ((value || 0) == 0) ? 0 : value * 750 / this.get_system_info('windowWidth');
            },
            
            // 终端类型
            application_client() {
                var type = '';
                // #ifdef APP
                    type = 'app';
                //#endif
                // #ifdef MP
                    type = 'mp';
                //#endif
                return type;
            },
            
            // 终端类型值
            application_client_type() {
                var value = '';
                // #ifdef MP-WEIXIN
                    value = 'weixin';
                //#endif
                // #ifdef MP-ALIPAY
                    value = 'alipay';
                //#endif
                // #ifdef MP-BAIDU
                    value = 'baidu';
                //#endif
                // #ifdef MP-QQ
                    value = 'qq';
                //#endif
                // #ifdef MP-TOUTIAO
                    value = 'toutiao';
                //#endif
                // #ifdef H5
                    value = 'h5';
                //#endif
                return value;
            },

            // 授权验证
            auth_check(object, method, scope, msg) {
                var self = this;
                uni.getSetting({
                    success(res) {
                        if (!res.authSetting[scope]) {
                            uni.authorize({
                                scope: scope,
                                success (res) {
                                    if (typeof object === 'object' && (method || null) != null) {
                                        object[method](1);
                                    }
                                },
                                fail (res) {
                                    self.showToast(msg || '请打开授权');
                                    setTimeout(function() {
                                        uni.openSetting();
                                    }, 1000);
                                }
                            });
                        } else {
                            if (typeof object === 'object' && (method || null) != null) {
                                object[method](1);
                            }
                        }
                    }
                });
            }
        },

        /**
         * 小程序初始化
         */
        onLaunch(params) {
            // 启动参数处理
            params = this.globalData.launch_params_handle(params);

            // 设置设备信息
            this.globalData.set_system_info();
            
            // 初始化配置
            this.globalData.init_config();
        },

        methods: {}
    };
</script>
<style>
    @import './common/css/page.css';
    @import './common/css/business.css';
    @import './common/css/plugins.css';
    @import './common/css/lib.css';
    @import './common/css/theme/yellow.css';
</style>
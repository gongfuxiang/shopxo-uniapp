<script>
    import base64 from './common/js/lib/base64.js';
    // 多语言引入并初始化
    import i18n from './locale/index';
    export default {
        globalData: {
            data: {
                // 基础配置
                // 数据接口请求地址
                request_url:'https://d1.shopxo.vip/',

                // 静态资源地址（如系统根目录不在public目录下面请在静态地址后面加public目录、如：https://d1.shopxo.vip/public/）
                static_url:'https://d1.shopxo.vip/',

                // 系统类型（默认default、如额外独立小程序、可与程序分身插件实现不同主体小程序及支付独立）
                system_type: 'default',

                // 基础信息
                application_title: 'ShopXO',
                application_describe: 'ShopXO Desc',

                // 默认logo、如 /static/images/common/logo.png
                application_logo: '',

                // 版本号、如: v1.0.0
                version: 'v6.4',

                // app版本信息、如: v1.0.0 20180118
                app_version_info: 'v6.4 20241225',

                // 货币价格符号
                currency_symbol: '￥',

                // 默认主题        主题颜色
                // 红色 red       #ff0036
                // 黄色 yellow    #f6c133
                // 黑色 black     #333333
                // 绿色 green     #20a53a
                // 橙色 orange    #fe6f04
                // 蓝色 blue      #1677ff
                // 棕色 brown     #8B4513
                // 紫色 purple    #623cec
                default_theme: 'red',

                // 多语言列表
                // 增加或者减少语言时
                // 1.新增一个对象，按照当前格式新增
                // 2.去lang里面各个文件去新增语言翻译
                default_language: 'zh',

                // 系统tabbar
                system_tabbar: [
                    '/pages/index/index',
                    '/pages/goods-category/goods-category',
                    '/pages/cart/cart',
                    '/pages/user/user'
                ],

                // 公共配置
                // 是否多商户店铺id
                plugins_shop_id: null,

                // 是否多门店门店id
                plugins_realstore_id: null,

                // 是否使用原生菜单（0否, 1是）
                is_use_native_tabbar: 0,

                // 购物车页面顶部导航强制关闭门店（0否, 1是）
                is_cart_header_close_realstore: 1,

                // 购物车底部猜你喜欢是否显示（0否, 1是）
                is_cart_bottom_guess_you_like: 1,

                // 购物车底部猜你喜欢是否显示（0否, 1是）
                is_goods_detail_bottom_guess_you_like: 1,

                // 商品详情页底部导航是否开启购物车功能（0否, 1是）
                is_goods_bottom_opt_cart: 1,

                // 商品详情页底部导航存在指定返回参数[is_opt_back=1]展示返回按钮（0否, 1是）
                is_goods_bottom_opt_back: 1,

                // 全站阻止打开商品详情页面（0否, 1是）
                is_forbid_to_goods_detail: 0,

                // 分享及转发使用页面设置的默认图片及系统默认图片（0否, 1是）
                is_share_use_image: 1,

                // 开启浮动客服、前提是后台需要开启客服功能（0否, 1是）
                is_online_service_fixed: 1,

                // 分类页面商品列表模式一级分类使用图标类型（0 实景图, 1 icon图标, 2 大图片）
                category_goods_model_icon_type: 0,

                // 商品分类页面搜索进入独立搜索页面（0否, 1是）
                category_goods_is_search_alone: 0,

                // 商品分类页面开启购物车导航（0否, 1是）
                category_goods_is_show_cart_nav: 1,

                // 用户中心菜单默认展示模式（0 九宫格, 1 列表）
                user_center_nav_show_model_type: 0,

                // 商品列表是否展示购物车（0否, 1是）
                is_goods_list_show_cart_opt: 1,

                // 分销页面地图分布是否强制获取当前位置（0否, 1是）
                is_distribution_map_force_location: 0,

                // 是否开启微信隐私弹窗授权提示、仅微信小程序有效（0否, 1是）
                is_weixin_privacy_setting: 1,
                
                // 弹出获取用户当前位置（0否, 1是）
                get_user_location_status: 0,
                get_user_location_timer: null,

                // 微信小程序打开地图使用（0否, 1是）【腾讯位置服务路线规划】插件、（需要到小程序后台设置->第三方设置->插件管理里面添加【腾讯位置服务路线规划】插件，教程 https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx50b5593e81dd937a）
                is_weixin_open_location_use_plugins: 0,

                // 首页搜索框开启扫一扫自动（0否, 1是）仅【小程序、APP】支持
                is_home_search_scan: 1,

                // 强制使用文字作为logo（默认当前指定logo->后台站点设置手机端图片logo->后台手机管理小程序配置名称->站点设置中的站点名称）
                is_home_logo_use_text: 0,

                // 首页开启地理位置选择（0否, 1是）优先级高于logo展示
                is_home_location_choice: 0,

                // 门店详情顶部导航返回按钮（0否, 1是）
                is_realstore_top_nav_back: 1,

                // 门店详情搜索框内扫码加购（0否, 1是）
                is_realstore_top_search_scan: 1,

                // 门店详情阻止跳转到商品详情页面去（0否, 1是）
                is_realstore_forbid_to_goods_detail: 0,

                // 钱包插件货币符号使用当前 currency_symbol 数据的固定值（0否, 1是）
                is_wallet_use_fixed_currency_symbol: 0,

                // 加载是否使用骨架屏（0否, 1是）
                is_loading_use_skeleton: 0,

                // 加载动画类型（0logo, 1名称）
                loading_content_type: 0,


                // 数据缓存key
                // 场景值
                cache_scene_key: 'cache_scene_key',

                // uuid缓存key
                cache_user_uuid_key: 'cache_user_uuid_key',

                // 配置信息缓存key
                cache_config_info_key: 'cache_config_info_key',

                // 用户登录缓存key
                cache_user_login_key: 'cache_user_login_key',

                // 用户信息缓存key
                cache_user_info_key: 'cache_shop_user_info_key',

                // 设备信息缓存key
                cache_system_info_key: 'cache_shop_system_info_key',

                // 用户地址选择缓存key
                cache_buy_user_address_select_key: 'cache_buy_user_address_select_key',

                // 启动参数缓存key
                cache_launch_info_key: 'cache_shop_launch_info_key',

                // 获取位置选择缓存key
                cache_userlocation_key: 'cache_userlocation_key',

                // 页面支付临时缓存key
                cache_page_pay_key: 'cache_page_pay_key',

                // 上一页地址缓存key
                cache_prev_page_key: 'cache_prev_page_key',

                // tab页面切换参数
                cache_page_tabbar_switch_params: 'cache_page_tabbar_switch_params_key',

                // 用户基础资料提示间隔key
                cache_user_base_personal_interval_time_key: 'cache_user_base_personal_interval_time_key',

                // 用户购物车选择记录key
                cache_user_cart_not_use_data_key: 'cache_user_cart_not_use_data_key',

                // 未登录页面缓存记录key
                cache_user_no_login_page_status_data_key: 'cache_user_no_login_page_status_data_key',

                // app更新提示缓存记录key
                cache_app_update_tips_interval_time_key: 'cache_app_update_tips_interval_time_key',

                // app评分提示缓存记录key
                cache_app_star_tips_interval_time_key: 'cache_app_star_tips_interval_time_key',

                // 首页数据缓存key
                cache_index_data_key: 'cache_index_data_key',

                // 商品数据缓存key
                cache_goods_data_key: 'cache_goods_data_key',

                // 页面设计页面数据缓存key
                cache_design_page_data_key: 'cache_design_page_data_key',

                // 底部菜单选中索引缓存key
                cache_footer_active_key: 'cache_footer_active_key',

                // diy模块数据缓存key
                cache_diy_data_key: 'cache_diy_data_key',
                // diy页面数据缓存key
                cache_diy_page_data_key: 'cache_diy_page_data_key',

                // apptabbar底部菜单高度
                cache_app_tabbar_height_key: 'cache_app_tabbar_height_key',

                // apptabbar底部菜单角标数据
                cache_tabbar_badge_key: 'cache_tabbar_badge_key',

                // 搜索历史记录
                cache_search_history_key: 'cache_search_history_key',

                // 门店选择详情缓存
                cache_realstore_detail_choice_key: 'cache_realstore_detail_choice_key',

                // 默认用户头像
                default_user_head_src: '/static/images/common/user.png',

                // 成功圆形提示图片
                default_round_success_icon: '/static/images/common/round-success-icon.png',

                // 错误圆形提示图片
                default_round_error_icon: '/static/images/common/round-error-icon.png',

                // 其他数据
                // 公共数是否已初始化成功
                common_data_loading_status: 0,
                common_data_init_status: 0,
                common_data_init_back_timer: null,
                // 网络状态检查
                network_type_page_record_timer: null,
                // 位置监听更新页面临时记录数据
                location_update_page_temp_record_data: [],
            },

            /**
             * 启动参数处理
             */
            launch_params_handle(params) {
                // 原有缓存
                var cache_params = this.get_launch_cache_info();
                // 当前参数、从query读取覆盖
                if ((params.query || null) != null) {
                    params = params.query;
                }
                // query下scene参数解析处理
                if ((params.scene || null) != null) {
                    params = this.url_params_to_json(decodeURIComponent(params.scene));
                }
                // 如果当前没有邀请id、但是原始缓存有邀请id、则使用缓存邀请id
                if ((params['referrer'] || null) == null && cache_params != null && (cache_params.referrer || null) != null) {
                    params['referrer'] = cache_params.referrer;
                }
                return params;
            },

            /**
             * 当前是否单页模式
             */
            is_current_single_page() {
                var scene = this.get_scene_data();
                // #ifdef MP-WEIXIN
                return scene == 1154 ? 1 : 0;
                // #endif
                return 0;
            },

            /**
             * 场景值获取
             */
            get_scene_data() {
                return uni.getStorageSync(this.data.cache_scene_key) || 0;
            },

            /**
             * 场景值设置
             */
            set_scene_data(params) {
                var scene = (params.scene || null) == null ? 0 : parseInt(params.scene);
                uni.setStorageSync(this.data.cache_scene_key, scene);
                return scene;
            },

            /**
             * 获取设备信息
             * key      指定key
             * dv       默认数据（不存在则读取、默认null）
             * is_real  是否实时读取
             */
            get_system_info(key, dv, is_real) {
                var info = null;
                if ((is_real || false) == true) {
                    info = this.set_system_info() || null;
                } else {
                    info = uni.getStorageSync(this.data.cache_system_info_key) || null;
                }
                if (info == null || (key || null) == null) {
                    return info;
                }
                return info[key] == undefined ? (dv == undefined ? null : dv) : info[key];
            },

            /**
             * 设置设备信息
             */
            set_system_info() {
                var system_info = uni.getSystemInfoSync();
                uni.setStorageSync(this.data.cache_system_info_key, system_info);
                return system_info;
            },

            /**
             * 请求地址生成
             * a              方法
             * c              控制器
             * plugins        插件标记（传参则表示为插件请求）
             * params         url请求参数
             * group          组名称（默认 api）
             */
            get_request_url(a, c, plugins, params, group) {
                a = a || 'index';
                c = c || 'index';
                // 是否插件请求、走api统一插件调用控制器
                var plugins_params = '';
                if ((plugins || null) != null) {
                    plugins_params = '&pluginsname=' + plugins + '&pluginscontrol=' + c + '&pluginsaction=' + a;
                    c = 'plugins';
                    a = 'index';
                }
                // 参数处理
                params = params || '';
                if (params != '' && params.substr(0, 1) != '&') {
                    params = '&' + params;
                }
                var url = this.data.request_url + (group || 'api') + '.php?s=' + c + '/' + a + plugins_params;
                return this.request_params_handle(url) + '&ajax=ajax' + params;
            },

            /**
             * 请求参数处理
             * url     url地址
             */
            request_params_handle(url) {
                // 用户信息
                var user = this.get_user_cache_info();
                var token = user == null ? '' : user.token || '';
                var uuid = this.request_uuid();
                var client_value = this.application_client_type();
                var client_brand = this.application_client_brand();
                // 启动参数
                var params = this.get_launch_cache_info();
                var referrer = params == null ? null : params.referrer || null;
                var referrer_params = referrer == null ? '' : '&referrer=' + referrer;
                // 用户位置
                var user_location = this.choice_user_location_init();
                var user_location_params = (user_location || null) != null && (user_location.status || 0) == 1 ? '&user_lng=' + user_location.lng + '&user_lat=' + user_location.lat : '';
                // 当前语言
                var lang = this.get_language_value();
                // 当前主题
                var theme = this.get_theme_value();

                // 拼接标识
                var join = url.indexOf('?') == -1 ? '?' : '&';
                return url + join + 'system_type=' + this.data.system_type + '&application=app&application_client_type=' + client_value + '&application_client_brand=' + client_brand + '&token=' + token + '&uuid=' + uuid + referrer_params + user_location_params + '&lang=' + lang+'&theme='+theme;
            },

            /**
             * 获取tab页面切换参数
             */
            get_page_tabbar_switch_params() {
                return uni.getStorageSync(this.data.cache_page_tabbar_switch_params) || null;
            },

            /**
             * 删除tab页面切换参数
             */
            remove_page_tabbar_switch_params() {
                uni.removeStorageSync(this.data.cache_page_tabbar_switch_params);
            },

            /**
             * 是否需要登录
             * 是否需要绑定手机号码
             */
            user_is_bind_mobile(user, object, method, params, is_to_login = false) {
                if ((user || null) != null && (user.mobile || null) == null && parseInt(user.is_mandatory_bind_mobile || 0) == 1) {
                    if(is_to_login) {
                        this.login_confirm_tips_modal(this, object, method, params);
                    }
                    return true;
                }
                return false;
            },

            /**
             * 获取用户信息,信息不存在则唤醒授权
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调操请求参数
             * return     有用户数据直接返回, 则回调调用者
             */
            get_user_info(object, method, params) {
                var user = this.get_user_cache_info();
                if (user == null) {
                    var self = this;
                    uni.getNetworkType({
                        success: function (res) {
                            if (res.networkType != 'none') {
                                // #ifdef MP
                                // 小程序唤醒用户授权
                                self.user_login(object, method, params);
                                // #endif

                                // #ifdef APP
                                // app登录注册
                                self.app_login_handle(self, object, method, params);
                                // #endif

                                // #ifdef H5
                                // h5登录注册
                                self.login_confirm_tips_modal(self, object, method, params);
                                // #endif
                            }
                        },
                    });
                    return false;
                } else {
                    // 是否需要绑定手机
                    if(this.user_is_bind_mobile(user, object, method, params, true)) {
                        return false;
                    }
                }
                return user;
            },

            // app登录处理
            app_login_handle(self, object, method, params) {
                // 是否开启一键登录服务
                if (self.get_config('plugins_base.thirdpartylogin.data.apponekeyusermobile_is_enable') == 1) {
                    uni.getProvider({
                        service: 'oauth',
                        success: function (res) {
                            if (res.provider.includes('univerify')) {
                                // 预登录检查
                                uni.preLogin({
                                    provider: 'univerify',
                                    success(res) {
                                        // 显示一键登录弹窗
                                        var theme_color = self.get_theme_color();
                                        var theme_color_light = self.get_theme_color(null, true);
                                        uni.login({
                                            provider: 'univerify',
                                            univerifyStyle: {
                                                authButton: {
                                                    // 授权按钮正常状态背景颜色 默认值：#3479f5
                                                    normalColor: theme_color,
                                                    // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
                                                    highlightColor: theme_color_light,
                                                    // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
                                                    disabledColor: theme_color_light,
                                                    // 授权按钮文案 默认值：“本机号码一键登录”
                                                    title: i18n.t('shopxo-uniapp.app.5a7r0v'),
                                                },
                                                otherLoginButton: {
                                                    // 其他登录方式按钮文字 默认值：“其他登录方式”
                                                    title: i18n.t('login.login.9q27d8'),
                                                },
                                                privacyTerms: {
                                                    // 条款前的文案 默认值：“我已阅读并同意”
                                                    prefix: i18n.t('shopxo-uniapp.app.33k281'),
                                                    // 条款后的文案 默认值：“并使用本机号码登录”
                                                    suffix: i18n.t('shopxo-uniapp.app.8l688n'),
                                                    // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
                                                    privacyItems: [
                                                        {
                                                            url: self.get_config('config.agreement_userregister_url'),
                                                            title: i18n.t('shopxo-uniapp.app.28r5dr'),
                                                        },
                                                        {
                                                            url: self.get_config('config.agreement_userprivacy_url'),
                                                            title: i18n.t('shopxo-uniapp.app.lb493k'),
                                                        },
                                                    ],
                                                },
                                            },
                                            success(res) {
                                                // 在得到access_token和openid后，通过callfunction调用云函数
                                                uniCloud
                                                    .callFunction({
                                                        name: 'getPhoneNumber',
                                                        data: {
                                                            access_token: res.authResult.access_token,
                                                            openid: res.authResult.openid,
                                                        },
                                                    })
                                                    .then((res) => {
                                                        uni.request({
                                                            url: self.get_request_url('apponekeyusermobile', 'index', 'thirdpartylogin'),
                                                            method: 'POST',
                                                            data: {
                                                                mobile: res.result,
                                                            },
                                                            dataType: 'json',
                                                            success: (res) => {
                                                                uni.closeAuthView();
                                                                if (res.data.code == 0) {
                                                                    uni.setStorageSync(self.data.cache_user_info_key, res.data.data);
                                                                    if (typeof object === 'object' && (method || null) != null) {
                                                                        object[method](params);
                                                                    }
                                                                } else {
                                                                    self.showToast(res.data.msg);
                                                                }
                                                            },
                                                            fail: () => {
                                                                uni.closeAuthView();
                                                                self.showToast(i18n.t('common.internet_error_tips'));
                                                            },
                                                        });
                                                    })
                                                    .catch((err) => {
                                                        uni.closeAuthView();
                                                        self.showToast(i18n.t('shopxo-uniapp.app.ch1pd2'));
                                                    });
                                            },
                                            fail(res) {
                                                // 关闭一键登录弹窗
                                                uni.closeAuthView();
                                                // 用户点击了其他登录方式、则进入登录页面
                                                if (res.errCode == 30002) {
                                                    // 进入独立登录注册页面
                                                    uni.navigateTo({
                                                        url: '/pages/login/login',
                                                    });
                                                } else {
                                                    // 用户不是点击关闭验证界面则提示错误
                                                    if (res.errCode != 30003) {
                                                        self.showToast(res.errMsg + '(' + res.errCode + ')');
                                                    }
                                                }
                                            },
                                        });
                                    },
                                    fail(res) {
                                        self.login_confirm_tips_modal(self, object, method, params);
                                    },
                                });
                            } else {
                                self.login_confirm_tips_modal(self, object, method, params);
                            }
                        },
                        fail(res) {
                            self.login_confirm_tips_modal(self, object, method, params);
                        },
                    });
                } else {
                    self.login_confirm_tips_modal(self, object, method, params);
                }
            },

            // 未登录确认处理
            login_confirm_tips_modal(self, object, method, params) {
                // 是否tabbar页面
                var page = self.current_page(false);
                var is_tabbar = self.is_system_tabbar_pages('/'+page);
                // 非初始化 并且 非tabbar页面则关闭当前页面并跳转登录页面
                if(method == 'init' && !is_tabbar) {
                    uni.redirectTo({
                        url: '/pages/login/login'
                    });
                // 初始化页面并且是tabbar页面
                } else if(method == 'init' && is_tabbar) {
                    var key = this.data.cache_user_no_login_page_status_data_key;
                    var data = uni.getStorageSync(key) || [];
                    if(data.indexOf(page) == -1) {
                        data.push(page);
                        uni.setStorageSync(key, data);
                        uni.navigateTo({
                            url: '/pages/login/login'
                        });
                    }
                // 非初始化则直接跳转登录页面
                } else if(method != 'init') {
                    uni.navigateTo({
                        url: '/pages/login/login'
                    });
                }
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
                    return default_value == undefined ? null : default_value;
                }
                // 是否读取key
                if ((key || null) != null) {
                    return user[key] == undefined ? (default_value == undefined ? null : default_value) : user[key];
                }
                return user;
            },

            /**
             * 系统参数获取
             */
            get_launch_cache_info() {
                return uni.getStorageSync(this.data.cache_launch_info_key) || null;
            },

            /**
             * 系统参数设置
             */
            set_launch_cache_info(params) {
                params = this.launch_params_handle(params);
                uni.setStorageSync(this.data.cache_launch_info_key, params);
                return params;
            },

            /**
             * 获取登录授权数据
             */
            get_login_cache_info() {
                return uni.getStorageSync(this.data.cache_user_login_key) || null;
            },

            /**
             * 用户登录
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调请求参数
             * auth_data  授权数据
             */
            user_auth_login(object, method, params, auth_data) {
                var self = this;
                // #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO || MP-KUAISHOU
                uni.checkSession({
                    success: function () {
                        var login_data = self.get_login_cache_info();
                        if (login_data == null) {
                            self.user_login(object, method, params);
                        } else {
                            self.get_user_login_info(object, method, params, login_data, auth_data);
                        }
                    },
                    fail: function () {
                        uni.removeStorageSync(self.data.cache_user_login_key);
                        self.user_login(object, method, params);
                    },
                });
                // #endif
                // #ifdef MP-ALIPAY
                var login_data = self.get_login_cache_info();
                if (login_data == null) {
                    self.user_login(object, method, params);
                } else {
                    self.get_user_login_info(object, method, params, login_data, auth_data);
                }
                // #endif
            },

            /**
             * 用户登录
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调操请求参数
             */
            user_login(object, method, params) {
                var login_data = uni.getStorageSync(this.data.cache_user_login_key) || null;
                if (login_data == null) {
                    this.user_login_handle(object, method, params, true);
                } else {
                    this.login_to_auth();
                }
            },

            /**
             * 用户登录处理
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调操请求参数
             * is_to_auth 是否进入授权
             */
            user_login_handle(object, method, params, is_to_auth = true) {
                var self = this;
                uni.showLoading({
                    title: i18n.t('common.auth_in_text'),
                });
                var action = 'login';
                // #ifdef MP-BAIDU
                action = 'getLoginCode';
                // #endif
                uni[action]({
                    success: (res) => {
                        if (res.code) {
                            uni.request({
                                url: self.get_request_url('appminiuserauth', 'user'),
                                method: 'POST',
                                data: {
                                    authcode: res.code,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        var data = res.data.data;
                                        var client_type = self.application_client_type();
                                        if ((data.is_user_exist || 0) == 1 || client_type == 'weixin') {
                                            // 存在数据非微信 或 微信小程序是否强制填写基础信息
                                            if(((data.is_user_exist || 0) == 1 && client_type != 'weixin') || !self.is_weixin_force_user_base_handle(self, data, object, method, params)) {
                                                uni.setStorageSync(self.data.cache_user_info_key, data);
                                                if (typeof object === 'object' && (method || null) != null) {
                                                    object[method](params);
                                                }
                                            }
                                        } else {
                                            uni.setStorageSync(self.data.cache_user_login_key, data);
                                            if (is_to_auth) {
                                                var pages = getCurrentPages();
                                                if (pages[pages.length - 1]['route'] == 'pages/login/login') {
                                                    if (typeof object === 'object' && (method || null) != null) {
                                                        object[method](params);
                                                    }
                                                } else {
                                                    self.login_to_auth();
                                                }
                                            }
                                        }
                                    } else {
                                        uni.hideLoading();
                                        self.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    self.showToast(i18n.t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                    fail: (e) => {
                        uni.hideLoading();
                        self.showToast(i18n.t('login.login.3nmrg2'));
                    },
                });
            },

            // 微信小程序是否强制填写基础信息
            is_weixin_force_user_base_handle(self, data, object, method, params) {
                var status = parseInt(self.get_config('config.common_app_is_weixin_force_user_base', 0));
                if(status == 1) {
                    var obj = self.get_page_object();
                    if((obj.$vm || null) != null && (obj.$vm.$refs || null) != null && (obj.$vm.$refs.common || null) != null && (obj.$vm.$refs.common.$refs || null) != null && (obj.$vm.$refs.common.$refs.user_base || null) != null) {
                        var user_base = obj.$vm.$refs.common.$refs.user_base;
                        var res = user_base.form_write_field_check_data(data, true);
                        if(res.popup_status) {
                            user_base.user_base_open(object, method, params);
                        }
                        return res.popup_status;
                    }
                }
                return false;
            },

            /**
             * 跳转到登录页面授权
             */
            login_to_auth() {
                uni.showModal({
                    title: i18n.t('common.warm_tips'),
                    content: i18n.t('login.login.jw378f'),
                    confirmText: i18n.t('common.confirm'),
                    cancelText: i18n.t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.navigateTo({
                                url: '/pages/login/login',
                            });
                        }
                    },
                });
            },

            /**
             * 获取用户授权信息
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调请求参数
             * login_data 登录信息
             * auth_data  授权数据
             */
            get_user_login_info(object, method, params, login_data, auth_data) {
                // 请求数据
                var data = {
                    auth_data: JSON.stringify(auth_data),
                    openid: login_data.openid,
                    unionid: login_data.unionid,
                };
                // 用户信息处理
                uni.showLoading({
                    title: i18n.t('common.auth_in_text'),
                });
                var self = this;
                uni.request({
                    url: self.get_request_url('appminiuserinfo', 'user'),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            uni.setStorageSync(self.data.cache_user_info_key, res.data.data);
                            if (typeof object === 'object' && (method || null) != null) {
                                object[method](params);
                            }
                        } else {
                            self.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        self.showToast(i18n.t('common.internet_error_tips'));
                    },
                });
            },

            /**
             * 字段数据校验
             * data           待校验的数据, 一维json对象
             * validation     待校验的字段, 格式 [{fields: 'mobile', msg: '请填写手机号码', is_can_zero: 1(是否可以为0)}, ...]
             */
            fields_check(data, validation) {
                for (var i in validation) {
                    var temp_value = data[validation[i]['fields']];
                    var temp_is_can_zero = validation[i]['is_can_zero'] || null;
                    if (temp_value == undefined || temp_value.length == 0 || temp_value == -1 || (temp_is_can_zero == null && temp_value == 0)) {
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
                    'M+': d.getMonth() + 1,
                    'd+': d.getDate(),
                    'h+': d.getHours(),
                    'm+': d.getMinutes(),
                    's+': d.getSeconds(),
                    'q+': Math.floor((d.getMonth() + 3) / 3),
                    'S+': d.getMilliseconds(),
                };
                if (/(y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (var k in date) {
                    if (new RegExp('(' + k + ')').test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
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
                if (obj_type == 'string') {
                    return obj.length;
                } else if (obj_type == 'object') {
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

            /**
             * url主要部分
             * url url地址
             */
            get_url_main_part(url) {
                if (url.indexOf('?') == -1) {
                    var value = url;
                } else {
                    var temp_str = url.split('?');
                    var value = temp_str[0];
                }
                return value;
            },
            
            /**
             * 底部菜单高度数据存储
             * value  高度
             */
            app_tabbar_height_save(value) {
                uni.setStorageSync(this.data.cache_app_tabbar_height_key, value);
            },
            
            /**
             * 底部菜单高度数据读取
             */
            app_tabbar_height_value() {
                return parseInt(uni.getStorageSync(this.data.cache_app_tabbar_height_key) || 0);
            },

            /**
             * 底部菜单页面数、tabbar
             */
            app_tabbar_pages() {
                var temp_tabbar = this.data.system_tabbar;
                var app_tabbar = this.get_config('app_tabbar') || null;
                if(app_tabbar != null && (app_tabbar.content || null) != null && (app_tabbar.content.nav_content || null) != null) {
                    temp_tabbar = app_tabbar.content.nav_content.map(function(v) {
                        if((v.link || null) != null && (v.link.page || null) != null) {
                            return v.link.page;
                        }
                    });
                }
                return temp_tabbar;
            },

            /**
             * 当前地址是否存在底部菜单tabbar中
             */
            is_tabbar_pages(url = null) {
                var pages = (this.data.is_use_native_tabbar == 1) ? this.data.system_tabbar : this.app_tabbar_pages();
                return this.is_tabbar_pages_handle(pages, url);
            },

            /**
             * 当前地址是否存在系统tabbar中
             */
            is_system_tabbar_pages(url = null) {
                return this.is_tabbar_pages_handle(this.data.system_tabbar, url);
            },

            /**
             * 当前地址是否存在tabbar中
             * pages  tabbar页面
             * url    url地址
             */
            is_tabbar_pages_handle(pages, url = null) {
                var value = (url == null) ? '/'+this.current_page() : url;
                if ((value || null) == null) {
                    return false;
                }
                if(pages.indexOf(value) != -1) {
                    return true;
                } else {
                    // 存在参数，去掉参数再检索是否存在页面的tabbar
                    if(value.indexOf('?') != -1) {
                        var temp = value.split('?');
                        if(pages.indexOf(temp[0]) != -1) {
                            return true;
                        }
                    }
                }
                return false;
            },

            // 系统底部菜单隐藏
            system_hide_tabbar() {
                if(this.data.is_use_native_tabbar != 1) {
                    uni.hideTabBar();
                }
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
                            if (this.is_system_tabbar_pages(value)) {
                                var temp = value.split('?');
                                if (temp.length > 1 && (temp[1] || null) != null) {
                                    value = temp[0];
                                    var query = this.url_params_to_json(temp[1]);
                                    uni.setStorageSync(this.data.cache_page_tabbar_switch_params, query);
                                }
                                uni.switchTab({
                                    url: value
                                });
                                //隐藏系统tabbar
                                this.system_hide_tabbar();
                            } else {
                                uni.navigateTo({
                                    url: value
                                });
                            }
                            break;
                        // 跳转到外部小程序
                        case 2:
                            uni.navigateToMiniProgram({
                                appId: value,
                            });
                            break;
                        // 跳转到地图查看位置
                        case 3:
                            var values = value.split('|');
                            if (values.length != 4) {
                                this.showToast(i18n.t('shopxo-uniapp.app.5y1c52'));
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
             * value       [string]  url地址
             * is_redirect [boolean] 是否关闭当前页面
             */
            open_web_view(value, is_redirect = false) {
                var url = '/pages/web-view/web-view?url=' + encodeURIComponent(value);
                if(is_redirect) {
                    uni.redirectTo({
                        url: url,
                    });
                } else {
                    uni.navigateTo({
                        url: url,
                    });
                }
            },

            /**
             * 默认弱提示方法
             * msg    [string]  提示信息
             * status [string]  状态 默认error [正确success, 错误error]
             */
            showToast(msg, status) {
                if ((msg || null) != null) {
                    if ((status || 'error') == 'success') {
                        uni.showToast({
                            icon: 'success',
                            title: msg,
                            duration: 3000,
                        });
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: msg,
                            duration: 3000,
                        });
                    }
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
             * params             [obj]       携带的参数
             */
            alert(e) {
                var msg = e.msg || null;
                if (msg != null) {
                    var title = e.title || '';
                    var is_show_cancel = e.is_show_cancel == 0 ? false : true;
                    var cancel_text = e.cancel_text || i18n.t('common.cancel');
                    var confirm_text = e.confirm_text || i18n.t('common.confirm');
                    var cancel_color = e.cancel_color || '#000000';
                    var confirm_color = e.confirm_color || '#576B95';
                    var params = e.params || {};
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
                                params['alert_status'] = res.confirm ? 1 : 0;
                                e.object[e.method](params);
                            }
                        },
                    });
                } else {
                    self.showToast(i18n.t('shopxo-uniapp.app.t754n6'));
                }
            },

            // url参数转json对象
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

            // json对象转url请求参数
            json_to_url_params(data) {
                var str = '';
                for (var i in data) {
                    if (str != '') {
                        str += '&';
                    }
                    str += i + '=' + data[i];
                }
                return str;
            },

            // 拨打电话
            call_tel(data) {
                var value = typeof data == 'object' ? data.currentTarget.dataset.value || null : data || null;
                if (value != null) {
                    uni.makePhoneCall({
                        phoneNumber: value.toString(),
                    });
                }
            },

            /**
             * 登录校验
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调请求参数
             */
            is_login_check(res, object, method, params) {
                if (res.code == -400) {
                    uni.clearStorage();
                    this.get_user_info(object, method, params);
                    return false;
                }
                return true;
            },

            /**
             * 读取底部导航badge
             * type     类型标识（如购物车 cart）
             */
            get_tab_bar_badge(type) {
                if ((type || null) != null) {
                    return uni.getStorageSync(this.data.cache_tabbar_badge_key+'-'+type) || null;
                }
                return null;
            },

            /**
             * 设置底部导航badge
             * type     类型标识（如购物车 cart）
             * value    显示的文本，超过 4 个字符则显示成 ...（type参数为1的情况下有效）
             */
            set_tab_bar_badge(type, value = 0) {
                // 是否使用原生菜单
                if(this.data.is_use_native_tabbar == 1) {
                    if(type == 'cart') {
                        if ((value || 0) == 0) {
                            uni.removeTabBarBadge({
                                index: 2
                            });
                        } else {
                            uni.setTabBarBadge({
                                index: 2,
                                text: value.toString()
                            });
                        }
                    }
                } else {
                    // 数据处理
                    if ((type || null) != null) {
                        var key = this.data.cache_tabbar_badge_key+'-'+type;
                        if ((value || null) == null) {
                            uni.removeStorageSync(key);
                        } else {
                            uni.setStorageSync(key, value);
                        }
                    }
                    // 更新底部菜单数据
                    var obj = this.get_page_object() || null;
                    if(obj != null && (obj.$vm || null) != null && (obj.$vm.$refs || null) != null && (obj.$vm.$refs.common || null) != null) {
                        obj.$vm.$refs.common.footer_init();
                    }
                }
            },

            // 页面分享处理
            page_share_handle(share = null) {
                // 当前页面
                var pages = getCurrentPages();
                var obj = pages[pages.length - 1] || null;
                // 分享信息、是否指定参数
                if ((share || null) == null) {
                    share = {};
                }
                // 从页面对象获取参数
                if (obj != null && Object.keys(share).length <= 0) {
                    share = obj.share_info || {};
                }
                // 参数处理
                share = this.share_content_handle(share);
                // #ifdef MP-WEIXIN
                // 微信小程序展示系统分享好友和朋友圈按钮
                // 其他端小程序不用展示会调起分享窗口
                var not_pages = ['/pages/user/user', '/pages/cart/cart'];
                if (not_pages.indexOf(share.url) == -1) {
                    uni.showShareMenu({
                        withShareTicket: true,
                        title: share.title,
                        desc: share.desc,
                        path: share.path + share.query,
                        imageUrl: share.img,
                        menus: ['shareAppMessage', 'shareTimeline'],
                    });
                } else {
                    wx.hideShareMenu({
                        menus: ['shareTimeline'],
                    });
                }
                // #endif
                // #ifdef H5
                // H5处理微信环境分享自定义信息
                if (this.is_weixin_env()) {
                    var page_url = this.get_page_url();
                    uni.request({
                        url: this.get_request_url('signpackage', 'index', 'share'),
                        method: 'POST',
                        data: {
                            url: encodeURIComponent(page_url),
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.data.code == 0 && (res.data.data.package || null) != null) {
                                var data = res.data.data.package;
                                var wx = require('jweixin-module');
                                wx.config({
                                    debug: false,
                                    appId: data.appId,
                                    timestamp: data.timestamp,
                                    nonceStr: data.nonceStr,
                                    signature: data.signature,
                                    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareWeibo'],
                                });
                                wx.ready(function () {
                                    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                                    wx.updateAppMessageShareData({
                                        title: share.title,
                                        desc: share.desc,
                                        link: share.url,
                                        imgUrl: share.img,
                                    });
                                    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                                    wx.updateTimelineShareData({
                                        title: share.title,
                                        link: share.url,
                                        imgUrl: share.img,
                                    });
                                    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                                    wx.onMenuShareWeibo({
                                        title: share.title,
                                        desc: share.desc,
                                        link: share.url,
                                        imgUrl: share.img,
                                    });
                                });
                            }
                        },
                        fail: () => {
                            this.showToast(i18n.t('common.internet_error_tips'));
                        },
                    });
                }
                // #endif
                // #ifdef MP-BAIDU
                // 百度小程序wab化搜索引擎数据设置
                uni.setPageInfo({
                    title: share.title,
                    keywords: share.kds || share.desc,
                    articleTitle: share.title,
                    description: share.desc,
                    image: share.img,
                    video:
                        (share.video || null) == null
                            ? []
                            : [
                                  {
                                      url: share.video,
                                      duration: '100',
                                      image: share.img,
                                  },
                              ],
                });
                // #endif
            },
            
            /**
             * 数据、可指定key和默认值
             * data             数据
             * key              数据key（支持多级读取、以 . 分割key名称）
             * default_value    默认值
             */
            get_key_data(data, key, default_value = null) {
                var value = default_value;
                if ((data || null) != null) {
                    var arr = key.split('.');
                    if (arr.length == 1) {
                        if(data[key] != undefined) {
                            value = data[key];
                        }
                    } else {
                        value = data;
                        for (var i in arr) {
                            if (value[arr[i]] != undefined) {
                                value = value[arr[i]];
                            } else {
                                value = default_value;
                                break;
                            }
                        }
                    }
                }
                return value;
            },

            /**
             * 获取配置信息、可指定key和默认值
             * key              数据key（支持多级读取、以 . 分割key名称）
             * default_value    默认值
             */
            get_config(key, default_value) {
                // 获取全部缓存
                var config = uni.getStorageSync(this.data.cache_config_info_key) || null;
                if((key || null) == null) {
                    return config;
                }

                // key缓存获取
                var value = null;
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
                // 默认值
                if (value == null && default_value != undefined) {
                    value = default_value;
                }
                // 无数据则处理自定义字段定义的数据
                if (value == null) {
                    switch (key) {
                        // 货币符号
                        case 'currency_symbol':
                            value = this.data.currency_symbol;
                            break;
                    }
                }
                return value;
            },

            /**
             * 初始化 配置信息
             * num        读取次数、如果失败+1再次读取
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调操请求参数
             */
            init_config(num = 0, object, method, params) {
                var self = this;
                uni.getNetworkType({
                    success: function (res) {
                        if (res.networkType != 'none') {
                            // 获取配置本地缓存
                            var config = self.get_config();
                            if(config != null) {
                                // 公共配置初始化返回处理
                                self.init_config_result_handle(config, self);
                            }

                            // 读取远程配置
                            if(self.data.common_data_loading_status == 0) {
                                // 赋值在加载状态
                                self.data.common_data_loading_status = 1;
                                uni.request({
                                    url: self.get_request_url('common', 'base'),
                                    method: 'POST',
                                    data: {
                                        is_key: 1,
                                    },
                                    dataType: 'json',
                                    success: (res) => {
                                        // 赋值不在加载状态
                                        self.data.common_data_loading_status = 0;
                                        if (res.data.code == 0) {
                                            // 配置存储
                                            var data = res.data.data;
                                            uni.setStorageSync(self.data.cache_config_info_key, data);

                                            // 公共配置初始化返回处理
                                            self.init_config_result_handle(data, self);

                                            // 回调
                                            if (typeof object === 'object' && (method || null) != null) {
                                                object[method](params);
                                            }
                                        } else {
                                            self.showToast(res.data.msg);
                                            // 站点关闭状态则 记录已初始化公共数据状态
                                            if (res.data.code == -10000) {
                                                self.data.common_data_init_status = 1;
                                            }
                                
                                            // 首次则再次初始化配置、站点关闭状态则不处理
                                            if (parseInt(num || 0) <= 20 && self.data.common_data_init_status == 0) {
                                                self.init_config(num+1, object, method, params);
                                            }
                                        }
                                    },
                                    fail: () => {
                                        // 赋值不在加载状态
                                        self.data.common_data_loading_status = 0;
                                        // 首次则再次初始化配置
                                        if (parseInt(num || 0) <= 20) {
                                            self.init_config(num+1, object, method, params);
                                        }
                                    },
                                });
                            }
                        }
                    },
                });
            },

            // 公共配置初始化返回处理
            init_config_result_handle(data, self) {
                // 记录已初始化公共数据状态
                self.data.common_data_init_status = 1;

                // 主题设置
                self.set_theme_value(data.plugins_themestyle_data);

                // 设置底部菜单
                self.set_tabbar(data.plugins_themestyle_data);

                // 用户自动登录处理
                self.user_auto_login_handle();
            },

            /**
             * 配置是否有效(100毫秒检验一次、最多检验100次)
             * object     回调操作对象
             * method     回调操作对象的函数
             * params     回调操请求参数
             */
            is_config(object, method, params) {
                var self = this;
                var count = 0;
                var is_config_count = 0;
                var timer = setInterval(function () {
                    if (self.get_config('status') == 1) {
                        clearInterval(timer);
                        if (typeof object === 'object' && (method || null) != null) {
                            object[method](true, params);
                        }
                    }
                    count++;
                    if (count >= 2300) {
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
                let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
                let x = lng;
                let y = lat;
                let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                let lngs = z * Math.cos(theta) + 0.0065;
                let lats = z * Math.sin(theta) + 0.006;
                return {
                    lng: lngs,
                    lat: lats,
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
                let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
                let x = lng - 0.0065;
                let y = lat - 0.006;
                let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                let lngs = z * Math.cos(theta);
                let lats = z * Math.sin(theta);
                return {
                    lng: lngs,
                    lat: lats,
                };
            },

            /**
             * 打开地图
             * lng        经度
             * lat        纬度
             * name       地图上面显示的名称
             * address    地图上面显示的详细地址
             * scale      缩放比例，范围5~18
             */
            open_location(lng, lat, name, address, scale) {
                // #ifdef MP-KUAISHOU
                this.showToast(i18n.t('shopxo-uniapp.app.iq66pg'));
                return false;
                // #endif

                // 参数判断
                if (lng == undefined || lat == undefined || lng == '' || lat == '') {
                    this.showToast(i18n.t('shopxo-uniapp.app.v2j475'));
                    return false;
                }
                lat = parseFloat(lat);
                lng = parseFloat(lng);

                // #ifdef MP-WEIXIN
                // 微信小程序使用【腾讯位置服务路线规划】插件
                if (this.data.is_weixin_open_location_use_plugins == 1) {
                    var key = this.get_config('config.common_tencent_map_ak') || null;
                    if (key != null) {
                        var plugin = requirePlugin('routePlan');
                        var end_point = JSON.stringify({
                            name: name || i18n.t('extraction-apply.extraction-apply.47v7m0'),
                            longitude: lng,
                            latitude: lat,
                        });
                        uni.navigateTo({
                            url: 'plugin://routePlan/route-plan?key=' + key + '&referer=' + this.get_application_title() + '&endPoint=' + end_point + '&themeColor=' + this.get_theme_color() + '&navigation=1',
                        });
                        return false;
                    }
                }
                // #endif
                // 转换坐标打开位置
                uni.openLocation({
                    name: name || i18n.t('extraction-apply.extraction-apply.47v7m0'),
                    address: address || '',
                    scale: scale || 18,
                    longitude: lng,
                    latitude: lat,
                });
            },

            // uuid生成
            uuid() {
                var d = new Date().getTime();
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
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
                            this.showToast(i18n.t('shopxo-uniapp.app.3m1gbe'));
                        },
                    });
                }
                return uuid;
            },

            // 链接地址事件
            url_event(e) {
                if((e.currentTarget || null) != null && (e.currentTarget.dataset || null) != null) {
                    // 需要打开的url地址
                    var value = e.currentTarget.dataset.value || null;

                    // 是否阻止商品页面打开
                    if (this.data.is_forbid_to_goods_detail == 1 && value.indexOf('/pages/goods-detail/goods-detail') != -1) {
                        return false;
                    }

                    // 是否关闭当前页面
                    var is_redirect = parseInt(e.currentTarget.dataset.redirect || 0) == 1;

                    // 如果是底部菜单，非系统内置菜单则关闭当前页面并打开
                    var tabbar = this.app_tabbar_pages();
                    if(tabbar.indexOf(value) != -1 && this.data.system_tabbar.indexOf(value) == -1) {
                        var page = this.prev_page();
                        if(page != null && this.data.system_tabbar.indexOf(page) == -1) {
                            is_redirect = true;
                        }
                    }

                    // 调用打开url方法
                    this.url_open(value, is_redirect);
                }
            },

            // 是否为url地址
            is_url(value) {
                var arr = ['http:/', 'https:'];
                return arr.indexOf(value.substr(0, 6)) != -1;
            },

            // 是否为page页面地址
            is_page(value) {
                var arr = ['/pages', 'pages/'];
                var status = arr.indexOf(value.substr(0, 6)) != -1;
                if(!status) {
                    // 是否打开插件地址
                    if(value.substr(0, 17) == 'plugin-private://') {
                        status = true;
                    }
                }
                return status;
            },

            // url打开
            url_open(value, is_redirect = false) {
                if ((value || null) != null) {
                    // #ifdef MP
                    // 小程序最多打开10层页面
                    var pages = getCurrentPages();
                    if(pages.length >= 10) {
                        is_redirect = true;
                    }
                    // #endif

                    if (this.is_url(value)) {
                        // web地址
                        this.open_web_view(value, is_redirect);
                    } else if (value.substr(0, 8) == 'appid://') {
                        // 打开外部小程序协议（appid|/pages/index/index?pv=hello|extraData|envVersion）
                        var values = value.substr(8).split('|');
                        uni.navigateToMiniProgram({
                            appId: values[0],
                            path: values[1] || '',
                            extraData: values[2] || '',
                            envVersion: values[3] || 'release'
                        });
                    } else if (value.substr(0, 12) == 'shortlink://') {
                        // 小程序分享链接
                        uni.navigateToMiniProgram({
                            shortLink: value.substr(12)
                        });
                    } else if (value.substr(0, 6) == 'map://') {
                        // 地图协议（名称|地址|lng|lat）
                        var values = value.substr(6).split('|');
                        if (values.length != 4) {
                            this.showToast(i18n.t('shopxo-uniapp.app.5y1c52'));
                            return false;
                        }
                        this.open_location(values[2], values[3], values[0], values[1]);
                    } else if (value.substr(0, 6) == 'tel://') {
                        // 电话协议
                        this.call_tel(value.substr(6));
                    } else if (value.substr(0, 7) == 'scan://') {
                        // 扫码协议
                        this.scan_handle();
                    } else {
                        // 默认切换或跳转页面
                        if (this.is_page(value)) {
                            if (this.is_system_tabbar_pages(value)) {
                                var temp = value.split('?');
                                if (temp.length > 1 && (temp[1] || null) != null) {
                                    value = temp[0];
                                    var query = this.url_params_to_json(temp[1]);
                                    uni.setStorageSync(this.data.cache_page_tabbar_switch_params, query);
                                }
                                uni.switchTab({
                                    url: value
                                });
                                //隐藏系统tabbar
                                this.system_hide_tabbar();
                            } else {
                                if (is_redirect) {
                                    uni.redirectTo({
                                        url: value
                                    });
                                } else {
                                    uni.navigateTo({
                                        url: value
                                    });
                                }
                            }
                        } else {
                            this.url_open('/pages/goods-search/goods-search?keywords='+value);
                        }
                    }
                }
            },

            // 文本事件
            text_event_handle(e) {
                var event = e.currentTarget.dataset.event || null;
                if (event != null) {
                    var value = e.currentTarget.dataset.value;
                    switch (event) {
                        // 拨打电话
                        case 'tel':
                            this.call_tel(value);
                            break;
                        // 复制文本
                        case 'copy':
                            this.text_copy_event(value);
                            break;
                    }
                }
            },

            // 剪贴板
            text_copy_event(data) {
                var value = typeof data == 'object' ? data.currentTarget.dataset.value || null : data || null;
                if (value != null) {
                    var self = this;
                    uni.setClipboardData({
                        data: value,
                        success(res) {
                            uni.getClipboardData({
                                success(res) {
                                    self.showToast(i18n.t('shopxo-uniapp.app.r5ts62'), 'success');
                                },
                            });
                        },
                    });
                } else {
                    this.showToast(i18n.t('shopxo-uniapp.app.r539kf'));
                }
            },

            // 图片预览
            image_show_event(e, urls = null) {
                var value = e.currentTarget.dataset.value || null;
                if (value != null) {
                    uni.previewImage({
                        current: value,
                        urls: urls || [value],
                    });
                } else {
                    this.showToast(i18n.t('shopxo-uniapp.app.qm8548'));
                }
            },

            // 静态文件url地址
            get_static_url(type, is_plugins) {
                // 默认公共地址
                if ((type || null) == null) {
                    type = 'common';
                }
                // 是否插件
                if ((is_plugins || false) == true) {
                    // 根据配置的静态url地址+插件标识符
                    return this.data.static_url + 'static/plugins/' + type + '/images/';
                } else {
                    // 根据配置的静态url地址+主题标识+参数类型组合远程静态文件地址
                    return this.data.static_url + 'static/app/' + this.get_theme_value() + '/' + type + '/';
                }
            },

            // rpx转px
            rpx_to_px(value) {
                return (value || 0) == 0 ? 0 : (parseInt(value) / 750) * parseInt(this.get_system_info('windowWidth', 0));
            },

            // px转rpx
            px_to_rpx(value) {
                return (value || 0) == 0 ? 0 : (parseInt(value) * 750) / parseInt(this.get_system_info('windowWidth', 0));
            },

            // 终端类型
            application_client() {
                var type = '';
                // #ifdef APP
                type = 'app';
                // #endif
                // #ifdef H5
                type = 'h5';
                // #endif
                // #ifdef MP
                type = 'mp';
                // #endif
                return type;
            },

            // 终端类型值
            application_client_type() {
                var value = '';
                // #ifdef MP-WEIXIN
                value = 'weixin';
                // #endif
                // #ifdef MP-ALIPAY
                value = 'alipay';
                // #endif
                // #ifdef MP-BAIDU
                value = 'baidu';
                // #endif
                // #ifdef MP-QQ
                value = 'qq';
                // #endif
                // #ifdef MP-TOUTIAO
                value = 'toutiao';
                // #endif
                // #ifdef MP-KUAISHOU
                value = 'kuaishou';
                // #endif
                // #ifdef H5
                value = 'h5';
                // #endif
                // #ifdef APP
                value = this.get_system_info('platform', null, true);
                // #endif
                return value;
            },

            // app客户端品牌
            application_client_brand(e) {
                var value = this.get_system_info('brand', null, true);
                return (value === null) ? '' : value.toLowerCase();
            },

            // 授权验证
            auth_check(object, method, scope, msg) {
                var self = this;
                uni.getSetting({
                    success(res) {
                        if (!res.authSetting[scope]) {
                            uni.authorize({
                                scope: scope,
                                success(res) {
                                    if (typeof object === 'object' && (method || null) != null) {
                                        object[method](1);
                                    }
                                },
                                fail(res) {
                                    self.showToast(msg || i18n.t('shopxo-uniapp.app.gbiac6'));
                                    setTimeout(function () {
                                        uni.openSetting();
                                    }, 1000);
                                },
                            });
                        } else {
                            if (typeof object === 'object' && (method || null) != null) {
                                object[method](1);
                            }
                        }
                    },
                });
            },

            // 窗口宽度处理
            window_width_handle(width) {
                // #ifdef H5 || APP
                if (width > 800) {
                    width = 800;
                }
                // #endif
                return width;
            },

            // 窗口高度处理
            window_height_handle(system) {
                var height = system.windowHeight;
                // 状态栏
                if (system.statusBarHeight > 0) {
                    height += system.statusBarHeight;
                }
                // 导航栏
                if (system.windowTop > 0) {
                    height += system.windowTop;
                }
                // 底部菜单
                if (system.windowBottom > 0) {
                    height += system.windowBottom;
                }
                return height;
            },

            // 获取当前页面地址
            // is_whole 完整地址（?后面的参数）
            get_page_url(is_whole = true) {
                var url = this.current_page();
                // #ifdef APP
                url = this.page_url_protocol(url);
                // #endif
                // #ifdef H5
                url = window.location.href;
                // #endif
                if (is_whole == false) {
                    var temp = url.split('?');
                    url = temp[0];
                }
                return url;
            },

            // url协议地址处理
            page_url_protocol(url) {
                if ((url || null) != null && !this.is_url(url)) {
                    // 拼接H5地址
                    var host = this.get_config('config.common_app_h5_url', '');
                    // #ifdef H5
                    if(host == '') {
                        // H5模式下、未指定H5地址则获取当前host
                        host = window.location.href.split('#')[0]+'#/';
                    }
                    // #endif
                    // 处理中间拼接的斜杠是否重复
                    url = (host + url).replace('#//', '#/');
                }
                return url;
            },

            // 是否微信环境
            is_weixin_env() {
                var agent = navigator.userAgent.toLowerCase();
                if (agent.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                }
                return false;
            },

            // 用户微信webopenid是否存在
            is_user_weixin_web_openid(order_ids, payment_id = 0, page = null) {
                // 微信环境判断是否已有web_openid、不存在则跳转到插件进行授权
                if (this.is_weixin_env()) {
                    var web_openid = this.get_user_cache_info('weixin_web_openid') || null;
                    if (web_openid == null) {
                        // 已经授权则重新刷新用户信息
                        var params = this.get_launch_cache_info();
                        if (params != null && (params.is_weixin_auth_web_openid || 0) == 1) {
                            uni.showLoading({
                                title: i18n.t('common.processing_in_text'),
                            });
                            uni.request({
                                url: this.get_request_url('tokenuserinfo', 'user'),
                                method: 'POST',
                                data: {},
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        uni.setStorageSync(this.data.cache_user_info_key, res.data.data);
                                    } else {
                                        this.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    this.showToast(i18n.t('common.internet_error_tips'));
                                },
                            });
                            return true;
                        } else {
                            uni.setStorageSync(this.data.cache_page_pay_key, {
                                order_ids: typeof order_ids == 'array' ? order_ids.join(',') : order_ids,
                                payment_id: payment_id,
                            });
                            var page_url = (page || null) == null ? this.get_page_url() : this.page_url_protocol(page);
                            page_url += page_url.indexOf('?') == -1 ? '?' : '&';
                            page_url += 'is_weixin_auth_web_openid=1';
                            var request_url = encodeURIComponent(base64.encode(page_url));
                            var url = this.get_request_url('index', 'pay', 'weixinwebauthorization', 'request_url=' + request_url, 'index').replace('&ajax=ajax', '');
                            window.location.href = url;
                        }
                        return false;
                    }
                }
                return true;
            },

            // app标题
            get_application_title() {
                var value = null;
                // 根据终端类型获取对应数据
                var type = this.application_client_type() || null;
                if (type !== null) {
                    value = this.get_config('config.common_app_mini_' + type + '_title') || null;
                }
                // 获取公共数据
                if (value === null) {
                    value = this.get_config('config.home_site_name', this.data.application_title);
                }
                return value;
            },

            // app描述
            get_application_describe() {
                var value = null;
                // 根据终端类型获取对应数据
                var type = this.application_client_type() || null;
                if (type !== null) {
                    value = this.get_config('config.common_app_mini_' + type + '_describe') || null;
                }
                // 商店介绍
                if (type !== null) {
                    value = this.get_config('config.common_customer_store_describe') || null;
                }
                // 获取公共数据
                if (value === null) {
                    value = this.data.application_describe;
                }
                return value;
            },

            // applogo
            get_application_logo() {
                var logo = this.data.application_logo || null;
                if (logo == null) {
                    logo = this.get_config('config.home_site_logo_app') || this.get_config('config.home_site_logo_wap');
                }
                return logo;
            },

            // 正方形logo
            get_application_logo_square() {
                return this.get_config('config.home_site_logo_square');
            },

            // 分享内容处理
            share_content_handle(data) {
                // 获取插件配置信息
                var share_config = this.get_config('plugins_base.share.data') || {};
                var result = {
                    title: data.title || share_config.title || this.get_application_title(),
                    desc: data.desc || share_config.desc || this.get_application_describe(),
                    path: data.path || this.app_tabbar_pages()[0],
                    query: this.share_query_handle(data.query || ''),
                    img: data.img || share_config.pic || this.get_application_logo_square(),
                };
                result['url'] = this.get_page_url();
                // #ifdef H5 || APP
                // 是有效的url地址则通过#号分割处理参数
                if(this.is_url(result['url'])) {
                    result['url'] = this.page_url_protocol(result.url.split('#')[0] + '#' + ((result.path || null) != null && result.path.substr(0, 1) == '/' ? '' : '/') + (result.path || '') + (result.query || ''));
                }
                // #endif
                return result;
            },

            // 分享参数处理
            share_query_handle(query) {
                if ((query || null) == null || query.indexOf('referrer') == -1) {
                    var user_id = parseInt(this.get_user_cache_info('id', 0)) || 0;
                    if (user_id > 0) {
                        var join = (query || null) == null ? '' : '&';
                        query += join + 'referrer=' + user_id;
                    }
                }
                return (query || null) == null ? '' : '?' + query;
            },

            // 是否朋友圈单页访问提示
            is_single_page_check() {
                if (this.is_current_single_page() == 1) {
                    this.showToast(i18n.t('shopxo-uniapp.app.3eqv71'));
                    return false;
                }
                return true;
            },

            // 调用页面方法
            get_page_object(page = null) {
                var pages = getCurrentPages();
                if(page == null) {
                    return pages[pages.length - 1];
                } else {
                    var result = [];
                    for (var i = 0; i < pages.length; i++) {
                        if (pages[i]['route'] == page) {
                            result.push(pages[i]);
                        }
                    }
                    return result;
                }
            },

            // 当前页面地址
            // is_whole 完整地址（?后面的参数）
            current_page(is_whole = true) {
                // 来源地址、拼接当前小程序页面
                var pages = getCurrentPages();
                var page = pages[pages.length - 1];
                var url = this.page_url_handle(page);
                if (is_whole == false) {
                    var temp = url.split('?');
                    url = temp[0];
                }
                return url;
            },

            // 上一页页面地址
            prev_page() {
                var value = null;
                var pages = getCurrentPages();
                var length = pages.length;
                if (length > 1) {
                    value = this.page_url_handle(pages[length - 2]);
                }
                return value;
            },

            // 返回上一页、则回到shouy
            page_back_prev_event() {
                var prev_page = this.prev_page();
                if (prev_page == null) {
                    this.url_open(this.app_tabbar_pages()[0]);
                } else {
                    uni.navigateBack();
                }
            },

            // 页面地址处理
            page_url_handle(page) {
                if ((page || null) == null) {
                    return '';
                }

                // 直接获取页面全的路径地址
                if((page.$page || null) != null && (page.$page.fullPath || null) != null) {
                    var path = page.$page.fullPath;
                    return path.substr(0, 1) == '/' ? path.substr(1) : path;
                }

                // 拼接地址和参数
                var route = page.route;
                var options = page.options || {};
                var query = '';
                if (JSON.stringify(options) != '{}') {
                    for (var i in options) {
                        query += '&' + i + '=' + options[i];
                    }
                }
                if ((query || null) != null) {
                    route += '?' + query.substr(1);
                }
                return route;
            },

            // 进入客服
            chat_entry_handle(url) {
                if ((url || null) == null) {
                    this.showToast(i18n.t('shopxo-uniapp.app.08cg8y'));
                } else {
                    // 拼接基础参数
                    url = this.request_params_handle(url);
                    // 拼接当前页面地址
                    var route = this.current_page();
                    url += '&source=' + encodeURIComponent(base64.encode(route).replace(new RegExp(/=/g), ''));
                    // 打开webview
                    this.open_web_view(url);
                }
            },

            // 用户自动登录处理
            user_auto_login_handle() {
                // #ifdef H5
                var user = this.get_user_cache_info();
                if (user == null) {
                    var params = this.get_launch_cache_info() || {};
                    var config = this.get_config('plugins_base.thirdpartylogin.data') || null;
                    var data = this.get_config('plugins_thirdpartylogin_data') || null;
                    var url = null;
                    // 是否微信环境
                    if ((params.thirdpartylogin || null) == null && config != null && data != null && this.is_weixin_env()) {
                        var is_auto = config.weixin_is_env_auto_login || 0;
                        var weixin = data.weixin || null;
                        if (is_auto != 0 && weixin != null) {
                            url = weixin.login_url;
                        }
                    }
                    // 存在登录url则跳转登录
                    if (url != null) {
                        // 上一个页面记录
                        var page = this.current_page();
                        if (page != null) {
                            uni.setStorageSync(this.data.cache_prev_page_key, page);
                        }
                        // 跳转登录
                        window.location.href = url;
                    }
                }
                // #endif
            },

            // 清除用户缓存
            remove_user_cache_event(is_remove_user = true) {
                // 当前平台
                var client_value = this.application_client();
                // 是否清除用户登录信息
                if(is_remove_user) {
                    // 用户登录缓存
                    uni.removeStorageSync(this.data.cache_user_login_key);
                    // 用户信息缓存
                    uni.removeStorageSync(this.data.cache_user_info_key);
                }
                // 未登录提示缓存记录
                uni.removeStorageSync(this.data.cache_user_no_login_page_status_data_key);
                // 用户基础资料提示间隔key
                uni.removeStorageSync(this.data.cache_user_base_personal_interval_time_key);
                // app更新提示缓存记录key
                uni.removeStorageSync(this.data.cache_app_update_tips_interval_time_key);
                // app评分提示缓存记录key
                uni.removeStorageSync(this.data.cache_app_star_tips_interval_time_key);

                // 非小程序则两秒后回到首页
                this.showToast(i18n.t('shopxo-uniapp.app.'+((client_value == 'mp' || !is_remove_user) ? '0gwt7z' : '87yghj')), 'success');
            },

            // 是否站点变灰
            is_app_mourning() {
                var is_app = parseInt(this.get_config('plugins_base.mourning.data.is_app', 0));
                if (is_app == 1) {
                    // 当前时间戳
                    var time_current = Date.parse(new Date());
                    // 开始时间
                    var time_start = this.get_config('plugins_base.mourning.data.time_start') || null;
                    if (time_start != null) {
                        if (Date.parse(new Date(time_start)) > time_current) {
                            return false;
                        }
                    }
                    // 结束时间
                    var time_end = this.get_config('plugins_base.mourning.data.time_end') || null;
                    if (time_end != null) {
                        if (Date.parse(new Date(time_end)) < time_current) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },

            // 价格符号
            currency_symbol() {
                return this.get_config('currency_symbol') || this.data.currency_symbol;
            },

            // 位置权限校验
            get_location_check(type, object, method) {
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
                var self = this;
                uni.getSetting({
                    success(res) {
                        if (!res.authSetting[type]) {
                            uni.authorize({
                                scope: type,
                                success(res) {
                                    if (typeof object === 'object' && (method || null) != null) {
                                        object[method](1);
                                    }
                                },
                                fail: (res) => {
                                    if (typeof object === 'object' && (method || null) != null) {
                                        object[method](0);
                                    }
                                },
                            });
                        } else {
                            if (typeof object === 'object' && (method || null) != null) {
                                object[method](1);
                            }
                        }
                    },
                    fail: (res) => {
                        self.showToast(i18n.t('shopxo-uniapp.app.di6v5t'));
                        if (typeof object === 'object' && (method || null) != null) {
                            object[method](0);
                        }
                    },
                });
                // #endif
                // #ifdef MP-ALIPAY || H5 || APP
                if (typeof object === 'object' && (method || null) != null) {
                    object[method](1);
                }
                // #endif
                // #ifdef MP-KUAISHOU
                self.showToast(i18n.t('shopxo-uniapp.app.nu5058'));
                if (typeof object === 'object' && (method || null) != null) {
                    object[method](0);
                }
                // #endif
            },

            // 启动位置监听（0 打开位置实时监听、1小程序后台运行也监听（仅微信、快手）小程序支持）
            start_location_update(type = 0, object, method) {
                // 非微信和快手小程序type=1则赋值为0
                // #ifndef MP-WEIXIN || MP-KUAISHOU
                if (type == 1) {
                    type = 0;
                }
                // #endif

                // 如果页面已存在位置调用则不重复调用
                var page = this.current_page(false);
                var temp_location = this.data.location_update_page_temp_record_data;
                if (temp_location.indexOf(page) == -1) {
                    // 根据类型调用api
                    if (type == 1) {
                        // 开始监听实时地理位置信息变化事件，小程序进入前后台时均接收实时地理位置信息
                        // 这个方法仅微信和快手小程序支持
                        // #ifdef MP-WEIXIN || MP-KUAISHOU
                        uni.startLocationUpdateBackground({
                            success: (res) => {
                                // 增加页面记录
                                temp_location.push(page);
                                this.data.location_update_page_temp_record_data = temp_location;

                                // 调用位置监听方法
                                this.start_location_update_change(object, method);
                            },
                            fail: (res) => {
                                if (typeof object === 'object' && (method || null) != null) {
                                    object[method]({
                                        status: 0,
                                        msg: res.errMsg,
                                    });
                                }
                            },
                        });
                        // #endif
                    } else {
                        // 打开位置监听
                        uni.startLocationUpdate({
                            success: (res) => {
                                // 增加页面记录
                                temp_location.push(page);
                                this.data.location_update_page_temp_record_data = temp_location;

                                // 调用位置监听方法
                                this.start_location_update_change(object, method);
                            },
                            fail: (res) => {
                                if (typeof object === 'object' && (method || null) != null) {
                                    object[method]({
                                        status: 0,
                                        msg: res.errMsg,
                                    });
                                }
                            },
                        });
                    }
                }
            },

            // 位置监听改变
            start_location_update_change(object, method) {
                uni.onLocationChange((res) => {
                    if (typeof object === 'object' && (method || null) != null) {
                        object[method]({
                            status: 1,
                            lng: res.longitude,
                            lat: res.latitude,
                            data: res,
                        });
                    }
                });
            },

            // 网络状态检查处理
            network_type_handle(object, method, params = {}) {
                // 如果页面已存在位置调用则不重复调用
                var page = this.current_page(false);
                var temp_network = this.data.network_type_page_record_timer || {};
                var temp = temp_network[page] || null;
                if (temp == null) {
                    var self = this;
                    temp_network[page] = {
                        object: object,
                        method: method,
                        params: params,
                    };
                    temp_network[page]['timer'] = setInterval(function () {
                        uni.getNetworkType({
                            success: function (res) {
                                if (res.networkType != 'none' && (temp_network[page] || null) != null) {
                                    // 已初始化则清除定时任务
                                    if ((temp_network[page]['timer'] || null) != null) {
                                        clearInterval(temp_network[page]['timer']);
                                    }
                                    var pv = temp_network[page];
                                    delete temp_network[page];
                                    self.data.network_type_page_record_timer = temp_network;
                                    // 回调页面
                                    if (typeof pv.object === 'object' && (pv.method || null) != null) {
                                        pv.object[pv.method]({ ...(pv.params || {}), ...{ loading: 1 } });
                                    }
                                }
                            },
                        });
                    }, 500);
                    this.data.network_type_page_record_timer = temp_network;
                }
            },

            // 获取主题色值
            // is_light 是否获取浅主色（false, true）
            get_theme_color(theme, is_light = false) {
                let color_obj = {
                    // 主色
                    red: '#ff0036', // 红色
                    yellow: '#f6c133', // 黄色
                    black: '#333333', // 黑色
                    blue: '#1677ff', // 蓝色
                    green: '#20a53a', // 绿色
                    orange: '#fe6f04', // 橙色
                    brown: '#8B4513', // 棕色
                    purple: '#623cec', // 紫色

                    // 浅主色
                    red_light: '#ffdbe2', // 红色
                    yellow_light: '#ffebd2', // 黄色
                    black_light: '#dcdcdc', // 黑色
                    blue_light: '#d1e4ff', // 蓝色
                    green_light: '#cce8d2', // 绿色
                    orange_light: '#fde4d1', // 橙色
                    brown_light: '#eadcd2', // 棕色
                    purple_light: '#d6cbfb', // 紫色
                };
                // 当前主题
                if ((theme || null) == null) {
                    theme = this.get_theme_value();
                }
                if (is_light) {
                    theme += '_light';
                }
                return color_obj[theme];
            },

            // 获取主题页面标识
            get_theme_value_view() {
                return 'theme-' + this.get_theme_value();
            },

            // 获取主题
            get_theme_value() {
                // 主题类型        主题颜色
                // 红色 red       #ff0036
                // 黄色 yellow    #f6c133
                // 黑色 black     #333333
                // 绿色 green     #20a53a
                // 橙色 orange    #fe6f04
                // 蓝色 blue      #1677ff
                // 棕色 brown     #8B4513
                // 紫色 purple    #623cec
                return uni.getStorageSync('theme') || this.data.default_theme;
            },

            // 切换主题
            set_theme_value(value) {
                // 设置主题缓存
                uni.setStorageSync('theme', value || this.data.default_theme);
            },

            // 底部菜单设置
            set_tabbar(theme) {
                if(this.data.is_use_native_tabbar == 1) {
                    // 当前主题
                    if ((theme || null) == null) {
                        theme = this.get_theme_value();
                    }

                    // 整体样式
                    uni.setTabBarStyle({
                        selectedColor: this.get_theme_color(theme),
                        color: '#333',
                        backgroundColor: '#fff',
                        borderStyle: 'black'
                    });

                    // 菜单
                    uni.setTabBarItem({
                        index: 0,
                        iconPath: 'static/images/common/tabbar/home.png',
                        selectedIconPath: 'static/images/' + theme + '/tabbar/home.png',
                        text: i18n.t('common.home'),
                    });
                    uni.setTabBarItem({
                        index: 1,
                        iconPath: 'static/images/common/tabbar/category.png',
                        selectedIconPath: 'static/images/' + theme + '/tabbar/category.png',
                        text: i18n.t('common.category'),
                    });
                    uni.setTabBarItem({
                        index: 2,
                        iconPath: 'static/images/common/tabbar/cart.png',
                        selectedIconPath: 'static/images/' + theme + '/tabbar/cart.png',
                        text: i18n.t('common.cart'),
                    });
                    uni.setTabBarItem({
                        index: 3,
                        iconPath: 'static/images/common/tabbar/user.png',
                        selectedIconPath: 'static/images/' + theme + '/tabbar/user.png',
                        text: i18n.t('common.my'),
                    });
                }
            },

            // 数组分组
            group_arry(arry, sub_group_length) {
                let index = 0;
                let new_arry = [];
                if (arry.length > sub_group_length) {
                    while (index < arry.length) {
                        new_arry.push(arry.slice(index, (index += sub_group_length)));
                    }
                } else {
                    new_arry = [arry];
                }
                return new_arry;
            },

            // 数组分组
            group_arry(arry, sub_group_length) {
                let index = 0;
                let new_arry = [];
                if (arry.length > sub_group_length) {
                    while (index < arry.length) {
                        new_arry.push(arry.slice(index, (index += sub_group_length)));
                    }
                } else {
                    new_arry = [arry];
                }
                return new_arry;
            },

            // 颜色转rgba hexValue： 色值  alpha：透明度
            hex_rgba(hexValue, alpha) {
                const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b);
                const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                if (!rgb) {
                    return hexValue;
                }
                const r = parseInt(rgb[1], 16),
                    g = parseInt(rgb[2], 16),
                    b = parseInt(rgb[3], 16);
                return `rgba(${r},${g},${b},${alpha})`;
            },

            // 判断数组内是否含有相同字段
            some_arry(arr, val, params) {
                return arr.some(function (arrVal) {
                    if (params) {
                        return val === arrVal[params];
                    } else {
                        return val === arrVal;
                    }
                });
            },

            // 更新当前url参数
            // query:[{key:'',value:''}]
            update_query_string_parameter(query = []) {
                // #ifdef H5
                let url = window.location.href;
                // 判断没有参数时
                if (query.length < 1) {
                    //向当前url添加参数，没有历史记录
                    window.history.replaceState({ path: url.split('?')[0] }, '', url.split('?')[0]);
                } else {
                    query.forEach((item) => {
                        let re = new RegExp('([?&])' + item.key + '=.*?(&|$)', 'i');
                        let separator = url.indexOf('?') !== -1 ? '&' : '?';
                        if (url.match(re)) {
                            url = url.replace(re, '$1' + item.key + '=' + item.value + '$2');
                        } else {
                            url += separator + item.key + '=' + item.value;
                        }
                    });
                    //向当前url添加参数，没有历史记录
                    window.history.replaceState({ path: url }, '', url);
                }
                // #endif
            },

            // 计算文本宽度
            string_width(value, max = null) {
                var width = 0;
                var reg = /^[A-Za-z0-0]+$/;
                var arr = value.split('');
                for (var i in arr) {
                    width += reg.test(arr[i]) ? 34 : 50;
                }
                return max !== null && width > max ? max : width;
            },

            // weburl地址id值匹配
            web_url_value_mate(url, rules) {
                // 匹配成功
                var status = 0;
                // 存在数据值
                var value = null;
                for (var i in rules) {
                    if (url.indexOf(rules[i]) != -1) {
                        var temp = url.split(rules[i]);
                        if (temp.length > 1) {
                            temp = temp[1].split('.');
                            if (temp.length > 0 && (temp[0] || null) != null) {
                                value = temp[0];
                            }
                        }
                        status = 1;
                        break;
                    }
                }
                return { status: status, value: value };
            },

            // 打开权限管理中心
            open_setting_event() {
                // #ifdef MP
                uni.openSetting();
                // #endif
                // #ifdef APP
                uni.openAppAuthorizeSetting();
                // #endif
            },

            // 扫码解析处理
            scan_handle() {
                // #ifdef H5
                this.showToast(i18n.t('common.not_supported_scan_tips'));
                // #endif
                // #ifndef H5
                var self = this;
                uni.scanCode({
                    success: function (res) {
                        if (res.result !== '') {
                            var value = res.result;
                            // 是否为url地址
                            if (self.is_url(value)) {
                                // 是否为商品地址
                                var goods_arr = ['/goods-', '/goods/index/id/', '=goods/index/id/'];
                                var goods_ret = self.web_url_value_mate(value, goods_arr);
                                if (goods_ret.status == 1 && goods_ret.value != null) {
                                    uni.navigateTo({
                                        url: '/pages/goods-detail/goods-detail?id=' + goods_ret.value,
                                    });
                                    return;
                                }

                                // 是否为多商户店铺详情地址
                                var shop_arr = ['/shop-index-detail-', '/plugins/index/pluginsname/shop/pluginscontrol/index/pluginsaction/detail/id/', '=plugins/index/pluginsname/shop/pluginscontrol/index/pluginsaction/detail/id/'];
                                var shop_ret = self.web_url_value_mate(value, shop_arr);
                                if (shop_ret.status == 1 && shop_ret.value != null) {
                                    uni.navigateTo({
                                        url: '/pages/plugins/shop/detail/detail?id=' + shop_ret.value,
                                    });
                                    return;
                                }

                                // 是否为扫码收款
                                var scanpay_arr = ['/scanpay-index-index', 'plugins/index/pluginsname/scanpay/pluginscontrol/index/pluginsaction/index', 'plugins/index/pluginsname/scanpay', '/scanpay'];
                                var scanpay_ret = self.web_url_value_mate(value, scanpay_arr);
                                if (scanpay_ret.status == 1) {
                                    var url = '/pages/plugins/scanpay/index/index';
                                    if (scanpay_ret.value != null) {
                                        var first = scanpay_ret.value.substr(0, 1);
                                        if (first == '-') {
                                            var temp = scanpay_ret.value.substr(1).split('/');
                                            if (temp.length == 3) {
                                                url += '?id=' + temp[0] + '&type=' + temp[2];
                                            }
                                        } else if (first == '/') {
                                            var temp = scanpay_ret.value.substr(1).split('/');
                                            if (temp.length == 4) {
                                                url += '?id=' + temp[1] + '&type=' + temp[3];
                                            }
                                        }
                                    }
                                    uni.navigateTo({
                                        url: url,
                                    });
                                    return;
                                }

                                // 是否为扫码登录
                                var thirdpartylogin_arr = ['/thirdpartylogin-scan-index-', 'plugins/index/pluginsname/thirdpartylogin/pluginscontrol/scan/pluginsaction/index/id/'];
                                var thirdpartylogin_ret = self.web_url_value_mate(value, thirdpartylogin_arr);
                                if (thirdpartylogin_ret.status == 1 && thirdpartylogin_ret.value != null) {
                                    uni.navigateTo({
                                        url: '/pages/plugins/thirdpartylogin/index/index?id=' + thirdpartylogin_ret.value,
                                    });
                                    return;
                                }

                                // 默认打开url
                                self.open_web_view(value);
                            } else {
                                self.url_open(value);
                            }
                        }
                    },
                });
                // #endif
            },

            // 获取当前语言
            get_language_value() {
                return uni.getLocale() || this.data.default_language;
            },

            // 选择用户地理位置
            choose_user_location_event() {
                // 存在数据则改变状态值
                var key = this.data.cache_userlocation_key;
                var result = uni.getStorageSync(key) || null;
                if(result != null) {
                    result['status'] = 2;
                    uni.setStorageSync(key, result);
                }

                // 进入页面选择位置
                uni.navigateTo({
                    url: '/pages/common/open-setting-location/open-setting-location',
                });
            },

            // 清除位置缓存信息
            choice_user_location_remove() {
                uni.removeStorageSync(this.data.cache_userlocation_key);
            },

            // 地址信息初始化
            choice_user_location_init() {
                // status 0未选择，1已选择，2选择中，3选择失败
                var result = uni.getStorageSync(this.data.cache_userlocation_key) || null;
                var user_location = { status: 0 };
                if (result != null) {
                    user_location = {
                        ...user_location,
                        ...{
                            name: result.name || null,
                            address: result.address || null,
                            lat: result.lat || null,
                            lng: result.lng || null,
                            status: result.status || 1,
                        },
                    };
                }
                // 默认名称
                var default_name = i18n.t('shopxo-uniapp.app.4v6q86');
                // 位置选择失败的状态，名称和默认名称不一致则认为是成功的
                if(user_location.status == 3 && user_location.name != default_name) {
                    user_location.status = 1;
                }
                user_location['text'] = user_location.name || user_location.address || default_name;
                return user_location;
            },

            // 获取用户当前位置
            // object    回调对象
            // method    回调方法
            // is_force  强制获取位置
            get_user_location(object = null, method = null, is_force = false) {
                if(this.data.get_user_location_status == 1 || is_force) {
                    var cache_key = this.data.cache_userlocation_key;
                    var result = uni.getStorageSync(cache_key) || null;
                    if(result == null) {
                        // 当前对象
                        var self = this;
                        // 当前平台
                        var client_value = self.application_client_type();
                        // 微信隐私状态
                        var is_weixin_privacy = false;
                        // 是否有网络
                        var is_network = false;
                        // 定时验证并获取位置权限
                        self.data.get_user_location_timer = setInterval(function () {
                            // 微信环境、协议验证处理
                            // #ifdef MP-WEIXIN
                            uni.getPrivacySetting({
                                success: (res) => {
                                    if (!res.needAuthorization) {
                                        is_weixin_privacy = true;
                                    }
                                },
                            });
                            // #endif

                            // app下先要网络
                            // #ifdef APP
                            uni.getNetworkType({
                                success: function (res) {
                                    if (res.networkType != 'none') {
                                        is_network = true;
                                    }
                                },
                            });
                            // #endif

                            // 是否可以读取位置权限
                            var status = true;
                            // 微信环境、必须先同意隐私权限后再弹出获取用户位置权限
                            if(client_value == 'weixin' && !is_weixin_privacy) {
                                status = false;
                            }
                            // app环境、必须先初始化完成有网络后再弹出获取用户位置权限
                            if((client_value == 'ios' || client_value == 'android') && !is_network) {
                                status = false;
                            }
                            if(status) {
                                uni.getLocation({
                                    type: 'wgs84',
                                    success: function (res) {
                                        var address = {
                                            name: i18n.t('shopxo-uniapp.app.tghyu3'),
                                            address: '',
                                            lat: res.latitude || null,
                                            lng: res.longitude || null,
                                            status: 1,
                                        };
                                        uni.setStorageSync(cache_key, address);
                                        if (typeof object === 'object' && (method || null) != null) {
                                            object[method](address);
                                        }
                                    }
                                });
                                clearInterval(self.data.get_user_location_timer);
                            }
                        }, 500);
                    }
                }
            },

            // 清除定时任务
            clear_interval_handle() {
                // 清除初始化公共数据回调方法定时任务
                clearInterval(this.data.common_data_init_back_timer);
                // 清除网络状态检查方法定时任务
                var network = this.data.network_type_page_record_timer || null;
                if (network != null) {
                    for (var i in network) {
                        if ((network[i]['timer'] || null) != null) {
                            clearInterval(network[i]['timer']);
                        }
                    }
                }
                this.data.network_type_page_record_timer = null;
                // 清除弹出位置权限提示定时任务
                clearInterval(this.data.get_user_location_timer);
            },

            // 商品访问数据存储缓存
            goods_data_cache_handle(goods_id, goods_data = null) {
                var key = this.data.cache_goods_data_key;
                if((goods_data || null) == null) {
                    var res = uni.getStorageSync(key) || null;
                    return (res != null && res.id == goods_id) ? res : null;
                } else {
                    uni.setStorageSync(key, goods_data);
                }
            },

            // 页面导航标题处理
            set_pages_navigation_bar_title() {
                // 标题
                var value = null;
                // 当前平台
                var client_value = this.application_client_type();
                // 当前页面地址
                var url = this.current_page(false);
                // 支付宝平台以下条件不增加标题
                if(client_value == 'alipay') {
                    // 自定义头页面
                    var pages_always = [
                        'pages/plugins/realstore/detail/detail',
                        'pages/plugins/seckill/index/index',
                        'pages/plugins/points/index/index',
                        'pages/plugins/coupon/index/index',
                        'pages/plugins/signin/detail/detail',
                        'pages/plugins/membershiplevelvip/index/index',
                        'pages/plugins/ask/index/index',
                    ];
                    // 当前tab页面
                    if(this.is_system_tabbar_pages('/'+url) != -1 || pages_always.indexOf(url) != -1) {
                        value = '';
                    }
                }
                // 还没有标题则根据页面自动处理
                if(value === null) {
                    // 解析处理key
                    var arr = url.split('/');
                        arr = arr.slice(1);
                        arr = arr.slice(0, -1);
                    var key = 'pages.'+arr.join('-');
                    // 读取语言
                    var value = i18n.t(key);
                    // 首页则读取当前应用名称
                    if(this.app_tabbar_pages()[0] == '/'+url) {
                        value = this.get_application_title();
                    }
                }
                // 设置标题
                uni.setNavigationBarTitle({
                    title: value || ''
                });
            },

            // 设置导航背景色和颜色
            set_navigation_bar_color(is_white = null) {
                var color = '#000000';
                var bg_color = '#ffffff';
                var arr = [
                    'pages/index/index',
                ];
                var page = this.current_page(false);
                if(is_white === true || (is_white === null && arr.indexOf(page) != -1)) {
                    color = '#ffffff';
                    bg_color = '#000000';
                }
                uni.setNavigationBarColor({
                    frontColor: color,
                    backgroundColor: bg_color,
                });
            },

            // 底部浮动按钮样式处理
            bottom_fixed_style_handle() {
                var obj = this.get_page_object();
                if(obj != null) {
                    // undefined值表示未定义则不处理
                    var temp = obj.bottom_fixed_style == undefined ? ((obj.data || null) == null ? undefined : obj.data.bottom_fixed_style) : '';
                    if(temp !== undefined && this.is_tabbar_pages()) {
                        obj.$vm.setData(
                        {
                            bottom_fixed_style: 'bottom:'+(((this.app_tabbar_height_value()-8)*2)+20)+'rpx'
                        });
                    }
                }
            },

            // 页面加载事件处理
            page_event_onload_handle(params) {
                // 获取用户当前位置
                this.get_user_location();
            },

            // 页面展示事件处理
            page_event_onshow_handle() {
                //隐藏系统tabbar
                this.system_hide_tabbar();

                // 底部浮动按钮样式处理
                this.bottom_fixed_style_handle();

                // 页面顶部导航标题设置
                this.set_pages_navigation_bar_title();

                // 设置导航背景色和颜色
                this.set_navigation_bar_color();
            },
        },

        // 初始化完成时触发（全局只触发一次）
        onLaunch(params) {
            //隐藏系统tabbar
            this.globalData.system_hide_tabbar();
        },

        // 启动，或从后台进入前台显示
        onShow(params) {
            //隐藏系统tabbar
            this.globalData.system_hide_tabbar();

            // 公共数据初始化
            this.globalData.init_config();

            // 设置设备信息
            this.globalData.set_system_info();

            // 参数处理+缓存
            this.globalData.set_launch_cache_info(params);

            // 场景值
            this.globalData.set_scene_data(params);
        },

        // 从前台进入后台
        onHide() {
            this.globalData.clear_interval_handle();
        },

        // 监听应用退出
        onExit() {
            this.globalData.clear_interval_handle();
        },
        methods: {},
    };
</script>
<style>
    @import './common/css/page.css';
    @import './common/css/business.css';
    @import './common/css/plugins.css';
    @import './common/css/lib.css';
    @import './common/css/theme.css';
</style>
<template>
    <view class="page-bottom-fixed">
        <block v-if="data_list_loding_status == 3">
            <form @submit="form_submit" class="form-container">
                <view class="padding-main oh">
                    <view class="form-gorup bg-white form-container-upload oh">
                        <view class="form-gorup-title">图标<text class="form-group-tips">建议100*100px</text></view>
                        <view class="oh">
                            <view class="form-upload-data fl">
                                <block v-if="(recommend_data.icon || null) != null">
                                    <view class="item fl">
                                        <text class="delete-icon" @tap="upload_delete_event">x</text>
                                        <image :src="recommend_data.icon" @tap="upload_show_event" mode="aspectFill"></image>
                                    </view>
                                </block>
                            </view>
                            <image class="upload-icon" :src="common_static_url+'upload-icon.png'" mode="aspectFill" @tap="file_upload_event"></image>
                        </view>
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">标题<text class="form-group-tips-must">*</text></view>
                        <input type="text" name="title" :value="recommend_data.title || ''" placeholder-class="cr-grey" class="cr-base" placeholder="标题格式1~60个字符">
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">描述</view>
                        <input type="text" name="describe" :value="recommend_data.describe || ''" placeholder-class="cr-grey" class="cr-base" placeholder="描述格式最多200个字符">
                    </view>

                    <view class="form-gorup anonymous">
                        <view class="form-gorup-title">是否启用</view>
                        <switch name="is_enable" style="transform:scale(0.9)" class="margin-top-sm" :checked="recommend_data.is_enable == 1"></switch>
                    </view>

                    <view class="form-gorup bg-white">
                        <view class="form-gorup-title">关联商品<text class="form-group-tips-must">*</text></view>
                        <view v-if="(recommend_data.detail_list || null) != null && recommend_data.detail_list.length > 0" class="margin-top-lg view-goods-list">
                            <block v-for="(item, index) in recommend_data.detail_list" :key="index">
                                <view :class="'item oh pr '+(index > 0 ? 'br-t-dashed padding-top-lg margin-top-lg' : '')">
                                    <navigator :url="item.goods.goods_url" hover-class="none" class="br dis-block fl radius oh">
                                        <image :src="item.goods.images" mode="aspectFill" class="dis-block"></image>
                                    </navigator>
                                    <view class="base fr">
                                        <view class="cr-base single-text">{{item.goods.title}}</view>
                                        <view class="margin-top-xs">
                                            <text class="sales-price">{{currency_symbol}}{{item.goods.price}}</text>
                                            <text class="fr cr-grey">{{item.goods.inventory}}{{item.goods.inventory_unit}}</text>
                                        </view>
                                        <view v-if="(item.spec_text_view || null) != null" class="cr-grey margin-top-xs text-size-xs">{{item.spec_text_view}}</view>
                                        <text class="br-red cr-red text-size-xs padding-horizontal-main padding-top-xs padding-bottom-xs round pa cp operate-submit" :data-index="index" @tap="goods_remove_event">移除</text>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <view class="margin-top-sm padding-vertical-main">
                            <text class="br-dashed-gray cr-base text-size-sm padding-horizontal-main padding-top-xs padding-bottom-xs round cp" @tap="goods_add_event">+ 选择商品</text>
                        </view>
                    </view>

                    <view class="bottom-fixed padding-main">
                        <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">提交</button>
                    </view>
                </view>
            </form>

            <!-- 商品选择弹窗 -->
            <component-popup :propShow="popup_goods_choice_status" propPosition="bottom" @onclose="popup_goods_choice_close_event">
                <view class="padding-top-main bg-white">
                    <view class="padding-horizontal-main">
                        <view class="close oh">
                            <view class="fr" @tap.stop="popup_goods_choice_close_event">
                                <uni-icons type="clear" size="46rpx" color="#999"></uni-icons>
                            </view>
                        </view>
                    </view>
                    <view class="popup-goods-choice-container">
                        <view class="nav-search oh br-b margin-top-sm padding-horizontal-main">
                            <picker class="item br round fl padding-horizontal-main" @change="popup_goods_category_event" :value="popup_goods_cetagory_index" :range="goods_category_list" range-key="name">
                                <view :class="'picker ' + (popup_goods_cetagory_index == 0 ? 'cr-grey' : 'cr-base') + ' arrow-bottom'">
                                    {{popup_goods_cetagory_index == 0 ? '商品分类' : goods_category_list[popup_goods_cetagory_index]['name']}}
                                </view>
                            </picker>
                            <input type="search" :value="popup_keywords_value" placeholder-class="cr-grey" class="cr-base item br round fl padding-horizontal-main margin-left-main" placeholder="请输入商品名称" @input="popup_keywords_value_event" @confirm="popup_goods_search_event">
                            <button type="default" size="mini" class="bg-main br-main cr-white text-size-xs round fr" @tap="popup_goods_search_event">搜索</button>
                        </view>
                        <view class="view-goods-list padding-horizontal-main">
                            <block v-if="popup_search_goods_list.length > 0">
                                <block v-for="(item, index) in popup_search_goods_list" :key="index">
                                    <view :class="'item oh pr margin-top-lg '+(index > 0 ? 'br-t-dashed padding-top-lg' : '')">
                                        <navigator :url="item.goods_url" hover-class="none" class="br dis-block fl radius oh">
                                            <image :src="item.images" mode="aspectFill" class="dis-block"></image>
                                        </navigator>
                                        <view class="base fr">
                                            <view class="cr-base single-text">{{item.title}}</view>
                                            <view class="margin-top-xs sales-price">{{currency_symbol}}{{item.price}}</view>
                                            <view class="cr-grey margin-top-xs text-size-xs">{{item.inventory}}{{item.inventory_unit}}</view>
                                            <text class="br-green cr-green text-size-xs padding-horizontal-main padding-top-xs padding-bottom-xs round pa cp operate-submit" :data-index="index" @tap="popup_goods_choice_event">选择</text>
                                        </view>
                                    </view>
                                </block>
                                <view class="tc br-t-dashed padding-vertical-main margin-top-main cr-grey text-size-xs">当前展示{{popup_search_goods_list.length}}条数据</view>
                            </block>
                            <block v-else>
                                <component-no-data :propStatus="search_data_list_loding_status" :propMsg="search_data_list_loding_msg"></component-no-data>
                            </block>
                        </view>
                    </view>
                </view>
            </component-popup>

            <!-- 规格选择 -->
            <component-goods-spec-choice ref="goods_spec_choice" v-on:specConfirmEvent="spec_confirm_event" propIndex="101"></component-goods-spec-choice>
        </block>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '../../../../common/js/lib/base64.js';
    import componentNoData from "../../../../components/no-data/no-data";
    import componentPopup from "../../../../components/popup/popup";
    import componentGoodsSpecChoice from "../../../../components/goods-spec-choice/goods-spec-choice";
    var common_static_url = app.globalData.get_static_url('common');
    export default {
        data() {
            return {
                common_static_url: common_static_url,
                params: null,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                recommend_data: {},
                form_submit_disabled_status: false,
                currency_symbol: app.globalData.currency_symbol(),
                // 商品选择弹窗
                popup_goods_choice_status: false,
                goods_category_list: [],
                popup_goods_cetagory_index: 0,
                popup_keywords_value: '',
                popup_search_goods_list: [],
                search_data_list_loding_status: 1,
                search_data_list_loding_msg: '请先搜索数据！'
            };
        },

        components: {
            componentNoData,
            componentPopup,
            componentGoodsSpecChoice
        },
        props: {},

        onLoad(params) {
            this.setData({
                params: params
            });
        },

        onShow() {        
            // 数据加载
            this.init();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 初始数据
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
                        uni.stopPullDownRefresh();
                        return false;
                    } else {
                        if((this.params.id || null) != null) {
                            this.get_data();
                        } else {
                            uni.stopPullDownRefresh();
                            this.setData({
                                data_list_loding_status: 3
                            });
                        }
                    }
                } else {
                    uni.stopPullDownRefresh();
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: '请先授权用户信息'
                    });
                }
            },

            // 自提点信息
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url("savedata", "recommend", "distribution"),
                    method: 'POST',
                    data: {id: this.params.id},
                    dataType: 'json',
                    success: res => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 如果存在分类则在最前面增加全部分类额度选项
                            var goods_category_list = data.goods_category_list || [];
                            if(goods_category_list.length > 0) {
                                goods_category_list.unshift({id: null, name: '全部分类'});
                            }
                            this.setData({
                                data_list_loding_status: 3,
                                recommend_data: data.data || {},
                                goods_category_list: goods_category_list,
                                editor_path_type: data.editor_path_type || ''
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 0,
                            data_list_loding_msg: '获取数据失败'
                        });
                    }
                });
            },

            // 数据提交
            form_submit(e) {                
                // 表单数据
                var form_data = e.detail.value;
                
                // 基础数据
                if((this.recommend_data || null) != null) {
                    form_data['id'] = this.recommend_data.id || '';
                    form_data['icon'] = this.recommend_data.icon || '';

                    // 关联商品
                    if((this.recommend_data.detail_list || null) != null && this.recommend_data.detail_list.length > 0) {
                        var goods_data = [];
                        this.recommend_data.detail_list.forEach((item, index) => {
                            goods_data.push({
                                goods_id: item.goods_id,
                                spec: item.spec || ''
                            });
                        });
                        if(goods_data.length > 0) {
                            form_data['goods_data'] = encodeURIComponent(base64.encode(JSON.stringify(goods_data)));
                        }
                    }
                }

                // 校验参数并提交
                var validation = [
                    { fields: "title", msg: "请填写标题" },
                    { fields: "goods_data", msg: "请选择商品" }
                ];
                if (app.globalData.fields_check(form_data, validation)) {
                    this.setData({
                        form_submit_disabled_status: true
                    });
                    uni.showLoading({
                        title: '处理中...'
                    });
                    uni.request({
                        url: app.globalData.get_request_url("save", "recommend", "distribution"),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: res => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
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
                            app.globalData.showToast('服务器请求出错');
                        }
                    });
                }
            },

            // 上传图片预览
            upload_show_event(e) {
                uni.previewImage({
                    current: this.recommend_data.icon,
                    urls: [this.recommend_data.icon]
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
                            var temp_data = self.recommend_data || {};
                            temp_data['icon'] = '';
                            self.setData({
                                recommend_data: temp_data
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
                                var temp_data = self.recommend_data || {};
                                temp_data['icon'] = data.data.url;
                                self.setData({
                                    recommend_data: temp_data
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
            },

            // 商品移除
            goods_remove_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var temp_data = this.recommend_data;
                temp_data.detail_list.splice(index, 1);
                this.setData({
                    recommend_data: temp_data
                });
            },

            // 商品选择开启弹层
            goods_add_event(e) {
                this.setData({
                    popup_goods_choice_status: true
                });
                // 没有商品列表则调用商品搜索方法
                if(this.popup_search_goods_list.length == 0) {
                    this.popup_goods_search_event();
                }
            },

            // 商品选择关闭弹层
            popup_goods_choice_close_event(e) {
                this.setData({
                    popup_goods_choice_status: false
                });
            },

            // 商品分类选择事件
            popup_goods_category_event(e) {
                this.setData({
                    popup_goods_cetagory_index: parseInt(e.detail.value || 0)
                });
            },

            // 商品关键字名称输入事件
            popup_keywords_value_event(e) {
                this.setData({
                    popup_keywords_value: e.detail.value
                });
            },

            // 商品搜索事件
            popup_goods_search_event() {
                var data = {
                    keywords: this.popup_keywords_value,
                }
                if(this.popup_goods_cetagory_index > 0) {
                    data['category_id'] = this.goods_category_list[this.popup_goods_cetagory_index]['id'];
                }

                uni.showLoading({
                    title: '处理中...'
                });
                this.setData({
                    search_data_list_loding_status: 1,
                    search_data_list_loding_msg: '搜索中...',
                });
                uni.request({
                    url: app.globalData.get_request_url("goodssearch", "recommend", "distribution"),
                    method: 'POST',
                    data: data,
                    dataType: 'json',
                    success: res => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var list = res.data.data || [];
                            this.setData({
                                popup_search_goods_list: list,
                                search_data_list_loding_status: (list.length > 0) ? 3 : 0,
                                search_data_list_loding_msg: (list.length > 0) ? '' : '没有相关商品',
                            });
                        } else {
                            this.setData({
                                search_data_list_loding_status: 0,
                                search_data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            search_data_list_loding_status: 2,
                            search_data_list_loding_msg: '服务器请求出错',
                        });
                    }
                });
            },

            // 弹窗商品选择
            popup_goods_choice_event(e) {
                var index = e.currentTarget.dataset.index || 0;
                var goods = this.popup_search_goods_list[index];
                var temp_data = this.recommend_data;
                // 是否多规格
                if(parseInt(goods.is_exist_many_spec || 0) == 1) {
                    if((this.$refs.goods_spec_choice || null) != null) {
                        this.$refs.goods_spec_choice.init(goods.id, goods['specifications']['choose'], goods.buy_min_number, index);
                    }
                } else {
                    var status = true;
                    if((temp_data.detail_list || null) == null) {
                        temp_data.detail_list = [];
                    }
                    if(temp_data.detail_list.length > 0) {
                        for(var i in temp_data.detail_list) {
                            if(temp_data.detail_list[i]['goods_id'] == goods['id']) {
                                status = false;
                                break;
                            }
                        }
                    }
                    // 追加到关联商品中
                    if(status) {
                        temp_data.detail_list.push({
                            goods: goods,
                            goods_id: goods['id'],
                            spec: '',
                            spec_text_view: ''
                        });
                        this.setData({
                            recommend_data: temp_data
                        });
                        app.globalData.showToast('选择成功', 'success');
                    } else {
                        app.globalData.showToast('已存在选择列表');
                    }
                }
            },

            // 规格确认回调事件
            spec_confirm_event(value) {
                var goods = this.popup_search_goods_list[value.out_value];
                var temp_data = this.recommend_data;
                var spec_str = JSON.stringify(value.spec);
                // 数据判断处理
                var status = true;
                if((temp_data.detail_list || null) == null) {
                    temp_data.detail_list = [];
                }
                if(temp_data.detail_list.length > 0) {
                    for(var i in temp_data.detail_list) {
                        if(temp_data.detail_list[i]['goods_id'] == goods['id'] && temp_data.detail_list[i]['spec'] == spec_str) {
                            status = false;
                            break;
                        }
                    }
                }

                // 追加到关联商品中
                if(status) {
                    temp_data.detail_list.push({
                        goods: goods,
                        goods_id: goods['id'],
                        spec: spec_str,
                        spec_text_view: value.spec.map(v => {return v.value}).join(' / ')
                    });
                    this.setData({
                        recommend_data: temp_data
                    });
                    app.globalData.showToast('选择成功', 'success');
                } else {
                    app.globalData.showToast('已存在选择列表');
                }
            },
        }
    };
</script>
<style>
    @import './recommend-form.css';
</style>
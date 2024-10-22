<template>
	<view>
		<view v-if="(data_list || null) != null && data_list.length > 0" class="plugins-shop-data-list oh">
			<block v-for="(item, index) in data_list" :key="index">
				<view class="item oh border-radius-main padding-vertical-xl padding-horizontal-main bg-white spacing-mb pr">
					<view class="item-right-icon">
						<iconfont name="icon-arrow-right" color="#999"></iconfont>
					</view>
					<view class="flex-row align-c" :data-value="item.url" @tap="url_event">
						<image :src="item.logo" mode="aspectFit" class="logo border-radius-xs fl br"></image>
						<view class="right-content fr flex-1 flex-width">
							<view class="title single-text">
								<!-- 认证信息 -->
								<view
									v-if="(config.is_enable_auth || 0) == 1 && ((item.auth_type != -1 && (item.auth_type_msg || null) != null) || ((item.bond_status || 0) == 1 && (item.bond_status_msg || null) != null))"
									class="auth-icon dis-inline-block">
									<!-- 实名认证 -->
									<block v-if="item.auth_type != -1 && (item.auth_type_msg || null) != null">
										<block v-if="item.auth_type == 0">
											<image :src="config.shop_auth_personal_icon" class="icon va-m" mode="aspectFill"></image>
										</block>
										<block v-if="item.auth_type == 1">
											<image :src="config.shop_auth_company_icon" class="icon va-m" mode="aspectFill"></image>
										</block>
									</block>
									<!-- 保证金认证 -->
									<block v-if="(item.bond_status || 0) == 1 && (item.bond_status_msg || null) != null">
										<image :src="config.shop_auth_bond_icon" class="icon va-m" mode="aspectFill"></image>
									</block>
								</view>
								<!-- 标题 -->
								<text class="fw-b text-size va-m">{{item.name}}</text>
							</view>
							<view class="desc multi-text cr-base text-size-xs margin-top-sm padding-top-xs">{{item.describe}}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				config: {},
				data_list: []
			};
		},
		components: {},
		props: {
			propConfig: {
				type: [String, Object],
				default: null
			},
			propData: {
			    type: Object,
			    default: () => {
			        return {};
			    },
			}
		},
		// 属性值改变监听
		watch: {
		    // 数据
		    propData(value, old_value) {
		        this.init();
		    }
		},
		// 页面被展示
		created: function(e) {
			this.init();
		},
		methods: {
            // 初始化
            init() {
                var config = ((this.propConfig || null) == null ? app.globalData.get_config('plugins_base.shop.data') : this.propConfig) || {};
                var data_list = ((this.propData || null) == null || (this.propData.data || null) == null || this.propData.data.length == 0) ? [] : this.propData.data;
                this.setData({
                	config: config,
                	data_list: data_list
                });
            },

			// url事件
			url_event(e) {
				app.globalData.url_event(e);
			}
		}
	};
</script>
<style>
</style>
<template name="shop-header">
  <!-- 搜索 -->
  <view class="search oh">
    <input type="done" placeholder="请输入您搜索的商品关键字" :value="search_keywords_value || ''" class="bg-white wh-auto fl" placeholder-class="cr-grey" @input="search_keywords_event">
    <view class="search-btn fr">
      <button class="mini-btn" type="default" size="mini" hover-class="none" @tap="search_button_event" data-value="/pages/goods-search/goods-search?">搜全站</button>
      <button class="mini-btn" type="default" size="mini" hover-class="none" @tap="search_button_event" :data-value="'/pages/plugins/shop/search/search?shop_id=' + shop.id + '&'">搜本店</button>
    </view>
  </view>
  <!-- 顶部 -->
  <view class="header bg-white oh">
    <image :src="shop.logo_long" mode="widthFix" class="shop-logo fl br-r padding-right-lg"></image>
    <view class="base fr">
      <view class="shop-title single-text">
        <text v-if="((data_base.is_auth_fill_info || 0) == 1 || (data_base.is_auth_upload_pic || 0) == 1) && shop.auth_type == 1 && (shop.auth_type_name || null) != null" class="shop-auth-icon">{{shop.auth_type_name}}</text>
        <text>{{shop.name}}</text>
      </view>
      <view class="base-bottom oh margin-top-sm">
        <view v-if="(data_base.is_service_info || 0) == 1" class="fl margin-right-xxl" @tap="header_service_event">
          <image src="/static/images/user-nav-customer-service-icon.png" mode="scaleToFill" class="va-m"></image>
          <text class="va-m cr-base">在线客服</text>
        </view>
        <view class="fl single-text" @tap="shop_favor_event">
          <image :src="'/images/default-favor-icon-' + shop_favor_info.status + '.png'" mode="scaleToFill" class="va-m"></image>
          <text :class="'va-m ' + (shop_favor_info.status == 1 ? 'cr-main' : '')">{{shop_favor_info.text}}({{shop_favor_info.count}})</text>
        </view>
      </view>
    </view>
  </view>
  <!-- 在线客服 -->
  <view v-if="header_service_status && (data_base.is_service_info || 0) == 1" class="header-service bg-white oh padding-top-xxl br">
    <view v-if="(shop.service_weixin_qrcode || null) != null" class="tc margin-bottom-sm">
      <image :src="shop.service_weixin_qrcode" mode="scaleToFill" @tap="image_show_event" :data-value="shop.service_weixin_qrcode"></image>
      <view>点击长按微信咨询</view>
    </view>
    <view v-if="(shop.service_qq || null) != null" class="item br-t single-text">
      <text>QQ：</text>
      <text @tap="text_copy_event" :data-value="shop.service_qq">{{shop.service_qq}}</text>
    </view>
    <view v-if="(shop.service_tel || null) != null" class="item br-t single-text">
      <text>电话：</text>
      <text @tap="tel_event" :data-value="shop.service_tel">{{shop.service_tel}}</text>
    </view>
    <view v-if="(shop.open_week_name || null) != null && (shop.close_week_name || null) != null" class="item br-t single-text">
      <text>时间：</text>
      <text @tap="text_copy_event" :data-value="shop.open_week_name + '至' + shop.close_week_name + '，' + shop.open_time + '-' + shop.close_time">{{shop.open_week_name}}至{{shop.close_week_name}}，{{shop.open_time}}-{{shop.close_time}}</text>
    </view>
  </view>
  <!-- 导航 -->
  <view class="nav nav-roll bg-white padding-top-lg">
    <view class="item arrow-bottom nav-shop-category fl" @tap="nav_shop_category_event">查看商品分类</view>
    <scroll-view scroll-x class="nav-scroll">
      <block v-if="shop_navigation.length > 0">
        <block v-for="(item, index) in shop_navigation" :key="index">
          <view class="item" @tap="nav_event" :data-value="item.url" :data-index="index">{{item.name}}</view>
        </block>
      </block>
    </scroll-view>
    <view v-if="nav_category_status" class="nav-category bg-white tc">
      <scroll-view scroll-y class="category-scroll">
        <block v-if="shop_goods_category.length > 0">
          <block v-for="(item, index) in shop_goods_category" :key="index">
            <view class="item single-text" @tap="shop_category_event" :data-value="item.id">{{item.name}}</view>
          </block>
        </block>
        <block v-else>
          <view class="padding-top-xxl padding-bottom-xxl cr-grey">暂无数据</view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>
	<script>
		
		export default {
			props: []
		}
    </script>
									
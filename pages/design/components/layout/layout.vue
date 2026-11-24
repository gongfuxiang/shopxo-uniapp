<template>
    <view :class="theme_view">
        <block v-if="(propData || null) != null && propData.length > 0">
            <block v-for="(v, index) in propData" :key="index">
                <view v-if="(v.value || null) != null && (v.children || null) != null && v.children.length > 0 && (v.value_arr || null) != null && v.value_arr.length > 0 && v.children.length == v.value_arr.length && (v.status || 0) == 1"
                :class="'layout-view ' + layout_outer_ent_class(v.config)"
                :style="layout_bg_color_style(v.config) + layout_outer_style(v.config)">
                    <view class="layout-bg-image-layer" :style="layout_bg_image_style(v.config)"></view>
                    <view
                    :class="'layout-content-children ' + layout_inner_ent_class(v.config)"
                    :style="layout_inner_style(v.config)">
                        <block v-for="(vs, indexchn) in v.children" :key="indexchn">
                            <view :class="'layout-content-container ' + layout_ent_class(vs.config)"
                            :style="layout_column_style(v, indexchn) + layout_content_style(vs.config) + layout_bg_color_style(vs.config)">
                                <view class="layout-bg-image-layer" :style="layout_bg_image_style(vs.config)"></view>
                                <block v-if="(vs.children || null) != null && vs.children.length > 0">
                                    <view v-for="(vss, indexlay) in vs.children" :key="indexlay" class="layout-content">
                                        <view v-if="(vss.config || null) != null && vss.config.length !== 0" class="module-content">
                                            <view :class="'module-' + vss.value + '-container'" :style="layout_module_box_style(vss.config)">
                                                <view class="layout-bg-image-layer" :style="layout_module_bg_image_style(vss.config)"></view>
                                                <!-- 单图 -->
                                                <block v-if="vss.value == 'images'">
                                                    <view
                                                    :class="'module-images-content ' + vss.config.frontend_config.media_fixed.media_container_ent"
                                                    :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                        <image @tap="layout_url_event" :data-value="vss.config.url || ''" :src="vss.config.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                    </view>
                                                </block>
                                                <!-- 多图 -->
                                                <block v-else-if="vss.value == 'many-images'">
                                                    <block v-if="vss.config.view_list_show_style == 'rolling'">
                                                        <!-- 滚动：scroll-view 固定 item 宽（对齐 PC），自动播放/导航点由 layout-rolling 处理 -->
                                                        <layout-rolling
                                                            :item-width="layout_rolling_item_width(vss.config)"
                                                            :item-margin="layout_rolling_item_margin(vss.config)"
                                                            :autoplay="layout_rolling_is_auto_play(vss.config)"
                                                            :interval="layout_rolling_interval(vss.config)"
                                                            :show-dots="layout_rolling_is_nav_dot(vss.config)"
                                                            :nav-dot-ent="layout_frontend_cfg(vss.config, 'nav_dot_ent', '')"
                                                            :count="(vss.config.data_list || []).length">
                                                            <view
                                                                v-for="(item, index2dtg) in vss.config.data_list"
                                                                :key="index2dtg"
                                                                class="module-item layout-rolling-item"
                                                                :style="layout_rolling_item_style(vss.config)"
                                                                @tap="layout_url_event"
                                                                :data-value="item.url || ''">
                                                                <view
                                                                :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                                    <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                </view>
                                                            </view>
                                                        </layout-rolling>
                                                    </block>
                                                    <block v-else-if="vss.config.view_list_show_style == 'list'">
                                                        <!-- 列表 -->
                                                        <view :class="'module-list-content ' + vss.config.frontend_config.list_ent">
                                                            <view v-for="(item, index2dtl) in vss.config.data_list" :key="index2dtl" class="item">
                                                                <view class="module-item" :style="vss.config.frontend_config.item_style">
                                                                    <view
                                                                    :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                    :style="vss.config.frontend_config.media_fixed.media_container_style" @tap="layout_url_event" :data-value="item.url || ''">
                                                                        <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </block>
                                                    <block v-if="vss.config.view_list_show_style == 'routine'">
                                                        <!-- 默认轮播 -->
                                                        <swiper
                                                        :indicator-dots="vss.config.data_list.length > 0"
                                                        :indicator-color="indicator_color"
                                                        :indicator-active-color="indicator_active_color"
                                                        :autoplay="vss.config.data_list.length > 0"
                                                        :circular="circular" :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                            <block v-for="(item, index2dtm) in vss.config.data_list" :key="index2dtm">
                                                                <swiper-item :class="vss.config.frontend_config.media_fixed.media_container_ent">
                                                                    <image :src="item.images" mode="aspectFill" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)"
                                                                    @tap="layout_url_event" :data-value="item.url || ''"></image>
                                                                </swiper-item>
                                                            </block>
                                                        </swiper>
                                                    </block>
                                                </block>
                                                <!-- 图文 -->
                                                <block v-else-if="vss.value == 'images-text'">
                                                    <block v-if="vss.config.view_list_show_style == 'rolling'">
                                                        <layout-rolling
                                                            :item-width="layout_rolling_item_width(vss.config)"
                                                            :item-margin="layout_rolling_item_margin(vss.config)"
                                                            :autoplay="layout_rolling_is_auto_play(vss.config)"
                                                            :interval="layout_rolling_interval(vss.config)"
                                                            :show-dots="layout_rolling_is_nav_dot(vss.config)"
                                                            :nav-dot-ent="layout_frontend_cfg(vss.config, 'nav_dot_ent', '')"
                                                            :count="(vss.config.data_list || []).length">
                                                            <view
                                                                v-for="(item, index2twg) in vss.config.data_list"
                                                                :key="index2twg"
                                                                class="module-item layout-rolling-item"
                                                                :style="layout_rolling_item_style(vss.config)"
                                                                @tap="layout_url_event"
                                                                :data-value="item.url || ''">
                                                                <view v-if="(item.images || null) != null"
                                                                :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                                    <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                </view>
                                                                <view v-if="(item.title || null) != null" :style="((vss.config.frontend_config.item_field_style || null) != null && (vss.config.frontend_config.item_field_style[index2twg] || null) != null && (vss.config.frontend_config.item_field_style[index2twg]['title'] || null) != null) ? vss.config.frontend_config.item_field_style[index2twg]['title'] : ''">{{item.title}}</view>
                                                                <view v-if="(item.desc || null) != null" :style="((vss.config.frontend_config.item_field_style || null) != null && (vss.config.frontend_config.item_field_style[index2twg] || null) != null && (vss.config.frontend_config.item_field_style[index2twg]['desc'] || null) != null) ? vss.config.frontend_config.item_field_style[index2twg]['desc'] : ''">{{item.desc}}</view>
                                                            </view>
                                                        </layout-rolling>
                                                    </block>
                                                    <block v-if="vss.config.view_list_show_style == 'leftright'">
                                                        <!-- 左图右文 -->
                                                        <view :class="'module-list-content ' + vss.config.frontend_config.list_ent">
                                                            <view v-for="(item, index2twzy) in vss.config.data_list" :key="index2twzy" class="item">
                                                                <view class="module-item" :style="vss.config.frontend_config.item_style" @tap="layout_url_event" :data-value="item.url || ''">
                                                                    <view v-if="(item.images || null) != null" class="fl">
                                                                        <view
                                                                        :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                        :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                                            <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                        </view>
                                                                    </view>
                                                                    <view class="fl" :style="vss.config.frontend_config.item_right_style">
                                                                        <view v-if="(item.title || null) != null" :style="((vss.config.frontend_config.item_field_style || null) != null && (vss.config.frontend_config.item_field_style[index2twzy] || null) != null && (vss.config.frontend_config.item_field_style[index2twzy]['title'] || null) != null) ? vss.config.frontend_config.item_field_style[index2twzy]['title'] : ''">{{item.title}}</view>
                                                                        <view v-if="(item.desc || null) != null" :style="((vss.config.frontend_config.item_field_style || null) != null && (vss.config.frontend_config.item_field_style[index2twzy] || null) != null && (vss.config.frontend_config.item_field_style[index2twzy]['desc'] || null) != null) ? vss.config.frontend_config.item_field_style[index2twzy]['desc'] : ''">{{item.desc}}</view>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </block>
                                                    <block v-if="vss.config.view_list_show_style == 'updown'">
                                                        <!-- 默认上图下文 -->
                                                        <view :class="'module-list-content ' + vss.config.frontend_config.list_ent">
                                                            <view v-for="(item, index2twsx) in vss.config.data_list" :key="index2twsx" class="item">
                                                                <view class="module-item" :style="vss.config.frontend_config.item_style" @tap="layout_url_event" :data-value="item.url || ''">
                                                                    <view v-if="(item.images || null) != null"
                                                                    :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                    :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                                        <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                    </view>
                                                                    <view v-if="(item.title || null) != null" :style="((vss.config.frontend_config.item_field_style || null) != null && (vss.config.frontend_config.item_field_style[index2twsx] || null) != null && (vss.config.frontend_config.item_field_style[index2twsx]['title'] || null) != null) ? vss.config.frontend_config.item_field_style[index2twsx]['title'] : ''">{{item.title}}</view>
                                                                    <view v-if="(item.desc || null) != null" :style="((vss.config.frontend_config.item_field_style || null) != null && (vss.config.frontend_config.item_field_style[index2twsx] || null) != null && (vss.config.frontend_config.item_field_style[index2twsx]['desc'] || null) != null) ? vss.config.frontend_config.item_field_style[index2twsx]['desc'] : ''">{{item.desc}}</view>
                                                                </view>
                                                            </view>
                                                        </view>
                                                    </block>
                                                </block>
                                                <!-- 图片魔方（新网格：density/gap/start-end + media_fixed） -->
                                                <block v-else-if="vss.value == 'images-magic-cube'">
                                                    <view v-if="layout_magic_cube_is_grid(vss.config)" class="layout-module-images-magic-cube layout-module-images-magic-cube-grid" :class="'layout-module-images-magic-cube-' + (vss.config.view_list_show_style || '')" :style="layout_magic_cube_grid_style(vss.config)">
                                                        <block v-for="(item, mci) in (vss.config.data_list || [])" :key="mci">
                                                            <view v-if="item && item.images && item.start && item.end" class="item-module-magic-cube" :style="layout_magic_cube_item_style(item)">
                                                                <view class="item-module-magic-cube-link" :class="layout_media_fixed_cfg(vss.config, 'media_container_ent', '')" :style="layout_media_fixed_cfg(vss.config, 'media_container_style', '')" :data-value="item.url || ''" @tap="layout_url_event">
                                                                    <image :src="item.images" :mode="layout_magic_cube_image_mode(layout_media_fixed(vss.config))" :class="layout_magic_cube_image_class(layout_media_fixed(vss.config))" :style="layout_media_fixed_cfg(vss.config, 'media_container_style', '')" class="image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                    </view>
                                                    <!-- 旧预设兜底（无 start/end 的历史数据） -->
                                                    <view v-else :class="'oh layout-module-images-magic-cube layout-module-images-magic-cube-'+vss.config.view_list_show_style+' '+(vss.config.frontend_config.list_ent || '')">
                                                        <block v-if="vss.config.view_list_show_style == 'g1'">
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'v2'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'v3'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'v4'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[3] || ''">
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'h2'">
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'h3'">
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'h4'">
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[3] || ''">
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'lr12'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'lr13'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'lr21'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'lr31'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'tb12'">
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="oh">
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                    <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fr" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                    <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'tb13'">
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="oh">
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                    <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                    <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fr" :style="vss.config.frontend_config.item_style[3] || ''">
                                                                    <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'tb21'">
                                                            <view class="oh">
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                    <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                    <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'tb31'">
                                                            <view class="oh">
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                    <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                    <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fr" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                    <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                            <view class="item-module-magic-cube" :style="vss.config.frontend_config.item_style[3] || ''">
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'lrv2h2'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'lrh2v2'">
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                                <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fl" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                            <view class="fr" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                    <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-if="vss.config.view_list_show_style == 'g4'">
                                                            <view class="oh">
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[0] || ''">
                                                                    <view :data-value="vss['config']['data_list'][0]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][0]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fr" :style="vss.config.frontend_config.item_style[1] || ''">
                                                                    <view :data-value="vss['config']['data_list'][1]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][1]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                            <view class="oh">
                                                                <view class="fl" :style="vss.config.frontend_config.item_style[2] || ''">
                                                                    <view :data-value="vss['config']['data_list'][2]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][2]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                                <view class="fr" :style="vss.config.frontend_config.item_style[3] || ''">
                                                                    <view :data-value="vss['config']['data_list'][3]['url'] || ''" @tap="layout_url_event" class="dis-block oh" :style="vss.config.frontend_config.images_style || ''">
                                                                        <image :src="vss['config']['data_list'][3]['images']" mode="widthFix" class="dis-block wh-auto image"></image>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                    </view>
                                                </block>
                                                <!-- 视频（无盒高度时去掉 height:100%/铺满塌陷，与图片同逻辑） -->
                                                <block v-else-if="vss.value == 'video'">
                                                    <view
                                                    :class="'module-video-content ' + layout_media_fixed_cfg(vss.config, 'media_container_ent', '')"
                                                    :style="layout_media_image_style(layout_media_fixed(vss.config))">
                                                        <video
                                                        class="video"
                                                        :src="vss.config.video"
                                                        :autoplay="false"
                                                        :show-center-play-btn="true"
                                                        :controls="true"
                                                        :show-play-btn="true"
                                                        :enable-progress-gesture="false"
                                                        :show-fullscreen-btn="true"
                                                        :show-mute-btn="true"
                                                        :object-fit="layout_media_video_object_fit(layout_media_fixed(vss.config))"
                                                        :poster="(vss.config.content_images || null) != null ? vss.config.content_images : ''"
                                                        :class="layout_media_image_class(layout_media_fixed(vss.config), 'video')"
                                                        :style="layout_media_video_style(layout_media_fixed(vss.config))">
                                                        </video>
                                                    </view>
                                                </block>
                                                <!-- 商品 -->
                                                <block v-else-if="vss.value == 'goods'">
                                                    <block v-if="(vss.config.data_list || null) != null && vss.config.data_list.length > 0">
                                                        <block v-if="vss.config.view_list_show_style == 'rolling'">
                                                            <view class="module-goods-content">
                                                                <layout-rolling
                                                                    :item-width="layout_rolling_item_width(vss.config)"
                                                                    :item-margin="layout_rolling_item_margin(vss.config)"
                                                                    :autoplay="layout_rolling_is_auto_play(vss.config)"
                                                                    :interval="layout_rolling_interval(vss.config)"
                                                                    :show-dots="layout_rolling_is_nav_dot(vss.config)"
                                                                    :nav-dot-ent="layout_frontend_cfg(vss.config, 'nav_dot_ent', '')"
                                                                    :count="(vss.config.data_list || []).length">
                                                                    <view
                                                                        v-for="(item, index2spg) in vss.config.data_list"
                                                                        :key="index2spg"
                                                                        class="module-item layout-rolling-item"
                                                                        :style="layout_rolling_item_style(vss.config)"
                                                                        @tap="layout_url_event"
                                                                        :data-value="item.goods_url || ''">
                                                                        <view
                                                                        :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                        :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                                            <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                        </view>
                                                                        <view class="item-bottom">
                                                                            <block v-if="layout_goods_is_price_top(vss.config)">
                                                                                <view class="module-price-box" :style="layout_goods_price_align_style(vss.config)">
                                                                                    <text class="module-price">{{currency_symbol}}{{item.price}}</text>
                                                                                    <text v-if="layout_goods_show_original(vss.config, item)" class="module-price-original">{{currency_symbol}}{{item.original_price}}</text>
                                                                                </view>
                                                                                <view :class="'module-title ' + layout_goods_title_line_class(vss.config)">{{item.title}}</view>
                                                                            </block>
                                                                            <block v-else>
                                                                                <view :class="'module-title ' + layout_goods_title_line_class(vss.config)">{{item.title}}</view>
                                                                                <view class="module-price-box" :style="layout_goods_price_align_style(vss.config)">
                                                                                    <text class="module-price">{{currency_symbol}}{{item.price}}</text>
                                                                                    <text v-if="layout_goods_show_original(vss.config, item)" class="module-price-original">{{currency_symbol}}{{item.original_price}}</text>
                                                                                </view>
                                                                            </block>
                                                                        </view>
                                                                    </view>
                                                                </layout-rolling>
                                                            </view>
                                                        </block>
                                                        <block v-else-if="vss.config.view_list_show_style == 'leftright'">
                                                            <!-- 左图右文 -->
                                                            <view :class="'module-goods-content module-list-content ' + vss.config.frontend_config.list_ent">
                                                                <view v-for="(item, index2stwzy) in vss.config.data_list" :key="index2stwzy" class="item">
                                                                    <view class="module-item" :style="vss.config.frontend_config.item_style" @tap="layout_url_event" :data-value="item.goods_url || ''">
                                                                        <view class="fl">
                                                                            <view
                                                                            :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                            :style="vss.config.frontend_config.media_fixed.media_container_style">
                                                                                <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                            </view>
                                                                        </view>
                                                                        <view class="fl" :style="vss.config.frontend_config.item_right_style">
                                                                            <block v-if="layout_goods_is_price_top(vss.config)">
                                                                                <view class="module-price-box" :style="layout_goods_price_align_style(vss.config)">
                                                                                    <text class="module-price">{{currency_symbol}}{{item.price}}</text>
                                                                                    <text v-if="layout_goods_show_original(vss.config, item)" class="module-price-original">{{currency_symbol}}{{item.original_price}}</text>
                                                                                </view>
                                                                                <view :class="'module-title ' + layout_goods_title_line_class(vss.config)">{{item.title}}</view>
                                                                            </block>
                                                                            <block v-else>
                                                                                <view :class="'module-title ' + layout_goods_title_line_class(vss.config)">{{item.title}}</view>
                                                                                <view class="module-price-box" :style="layout_goods_price_align_style(vss.config)">
                                                                                    <text class="module-price">{{currency_symbol}}{{item.price}}</text>
                                                                                    <text v-if="layout_goods_show_original(vss.config, item)" class="module-price-original">{{currency_symbol}}{{item.original_price}}</text>
                                                                                </view>
                                                                            </block>
                                                                        </view>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-else>
                                                            <!-- 默认列表 -->
                                                            <view :class="'module-goods-content module-list-content ' + vss.config.frontend_config.list_ent">
                                                                <view v-for="(item, index2spm) in vss.config.data_list" :key="index2spm" class="item">
                                                                    <view class="module-item" :style="vss.config.frontend_config.item_style">
                                                                        <view
                                                                        :class="vss.config.frontend_config.media_fixed.media_container_ent"
                                                                        :style="vss.config.frontend_config.media_fixed.media_container_style" @tap="layout_url_event"
                                                                        :data-value="item.goods_url || ''">
                                                                            <image :src="item.images" :mode="layout_media_image_mode(vss.config.frontend_config.media_fixed)" :class="layout_media_image_class(vss.config.frontend_config.media_fixed, 'image')" :style="layout_media_image_style(vss.config.frontend_config.media_fixed)" class="image"></image>
                                                                            <view class="item-bottom">
                                                                                <block v-if="layout_goods_is_price_top(vss.config)">
                                                                                    <view class="module-price-box" :style="layout_goods_price_align_style(vss.config)">
                                                                                        <text class="module-price">{{currency_symbol}}{{item.price}}</text>
                                                                                        <text v-if="layout_goods_show_original(vss.config, item)" class="module-price-original">{{currency_symbol}}{{item.original_price}}</text>
                                                                                    </view>
                                                                                    <view :class="'module-title ' + layout_goods_title_line_class(vss.config)">{{item.title}}</view>
                                                                                </block>
                                                                                <block v-else>
                                                                                    <view :class="'module-title ' + layout_goods_title_line_class(vss.config)">{{item.title}}</view>
                                                                                    <view class="module-price-box" :style="layout_goods_price_align_style(vss.config)">
                                                                                        <text class="module-price">{{currency_symbol}}{{item.price}}</text>
                                                                                        <text v-if="layout_goods_show_original(vss.config, item)" class="module-price-original">{{currency_symbol}}{{item.original_price}}</text>
                                                                                    </view>
                                                                                </block>
                                                                            </view>
                                                                        </view>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                    </block>
                                                </block>
                                                <!-- 文章 -->
                                                <block v-else-if="vss.value == 'article'">
                                                    <block v-if="(vss.config.data_list || null) != null && vss.config.data_list.length > 0">
                                                        <block v-if="vss.config.view_list_show_style == 'rolling'">
                                                            <view class="module-article-content">
                                                                <layout-rolling
                                                                    :item-width="layout_rolling_item_width(vss.config)"
                                                                    :item-margin="layout_rolling_item_margin(vss.config)"
                                                                    :autoplay="layout_rolling_is_auto_play(vss.config)"
                                                                    :interval="layout_rolling_interval(vss.config)"
                                                                    :show-dots="layout_rolling_is_nav_dot(vss.config)"
                                                                    :nav-dot-ent="layout_frontend_cfg(vss.config, 'nav_dot_ent', '')"
                                                                    :count="(vss.config.data_list || []).length">
                                                                    <view
                                                                        v-for="(item, index2spa) in vss.config.data_list"
                                                                        :key="index2spa"
                                                                        class="module-item layout-rolling-item"
                                                                        :style="layout_rolling_item_style(vss.config)"
                                                                        @tap="layout_url_event"
                                                                        :data-value="item.article_url || item.url || ''">
                                                                        <view v-if="(vss.config.article_is_show_cover || 0) == 1 && (item.images || item.cover)"
                                                                        :class="((vss.config.frontend_config || null) == null || (vss.config.frontend_config.media_fixed || null) == null) ? '' : vss.config.frontend_config.media_fixed.media_container_ent"
                                                                        :style="((vss.config.frontend_config || null) == null || (vss.config.frontend_config.media_fixed || null) == null) ? '' : vss.config.frontend_config.media_fixed.media_container_style">
                                                                            <image :src="item.images || item.cover" :mode="layout_media_image_mode(layout_media_fixed(vss.config))" :class="layout_media_image_class(layout_media_fixed(vss.config), 'image')" :style="layout_media_image_style(layout_media_fixed(vss.config))"></image>
                                                                        </view>
                                                                        <view class="item-bottom">
                                                                            <view :class="article_meta_class(vss.config)">
                                                                                <view class="single-text module-article-title" :style="(item.title_color || null) == null ? '' : ('color:' + item.title_color)">{{item.title}}</view>
                                                                                <view v-if="(vss.config.article_is_show_time || 0) == 1 || (vss.config.article_is_show_access || 0) == 1" class="module-article-meta-row">
                                                                                    <view v-if="(vss.config.article_is_show_time || 0) == 1" class="module-article-time">{{item.add_time || ''}}</view>
                                                                                    <view v-if="(vss.config.article_is_show_access || 0) == 1" class="module-article-access">
                                                                                        <iconfont name="icon-eye" size="24rpx" color="#999" propContainerDisplay="inline-flex"></iconfont>
                                                                                        <text class="module-article-access-num">{{item.access_count || 0}}</text>
                                                                                    </view>
                                                                                </view>
                                                                            </view>
                                                                        </view>
                                                                    </view>
                                                                </layout-rolling>
                                                            </view>
                                                        </block>
                                                        <block v-else-if="vss.config.view_list_show_style == 'leftright'">
                                                            <!-- 左图右文 -->
                                                            <view :class="'module-article-content module-list-content ' + (((vss.config.frontend_config || null) == null) ? '' : (vss.config.frontend_config.list_ent || ''))">
                                                                <view v-for="(item, index2stal) in vss.config.data_list" :key="index2stal" class="item">
                                                                    <view class="module-item" :style="((vss.config.frontend_config || null) == null) ? '' : (vss.config.frontend_config.item_style || '')" @tap="layout_url_event" :data-value="item.article_url || item.url || ''">
                                                                        <view v-if="(vss.config.article_is_show_cover || 0) == 1 && (item.images || item.cover)" class="fl">
                                                                            <view
                                                                            :class="((vss.config.frontend_config || null) == null || (vss.config.frontend_config.media_fixed || null) == null) ? '' : vss.config.frontend_config.media_fixed.media_container_ent"
                                                                            :style="((vss.config.frontend_config || null) == null || (vss.config.frontend_config.media_fixed || null) == null) ? '' : vss.config.frontend_config.media_fixed.media_container_style">
                                                                                <image :src="item.images || item.cover" :mode="layout_media_image_mode(layout_media_fixed(vss.config))" :class="layout_media_image_class(layout_media_fixed(vss.config), 'image')" :style="layout_media_image_style(layout_media_fixed(vss.config))"></image>
                                                                            </view>
                                                                        </view>
                                                                        <view :class="((vss.config.article_is_show_cover || 0) == 1 && (item.images || item.cover)) ? 'fl' : ''" :style="((vss.config.frontend_config || null) == null) ? '' : (vss.config.frontend_config.item_right_style || '')">
                                                                            <view :class="article_meta_class(vss.config)">
                                                                                <view class="single-text module-article-title" :style="(item.title_color || null) == null ? '' : ('color:' + item.title_color)">{{item.title}}</view>
                                                                                <view v-if="(vss.config.article_is_show_time || 0) == 1 || (vss.config.article_is_show_access || 0) == 1" class="module-article-meta-row">
                                                                                    <view v-if="(vss.config.article_is_show_time || 0) == 1" class="module-article-time">{{item.add_time || ''}}</view>
                                                                                    <view v-if="(vss.config.article_is_show_access || 0) == 1" class="module-article-access">
                                                                                        <iconfont name="icon-eye" size="24rpx" color="#999" propContainerDisplay="inline-flex"></iconfont>
                                                                                        <text class="module-article-access-num">{{item.access_count || 0}}</text>
                                                                                    </view>
                                                                                </view>
                                                                            </view>
                                                                        </view>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                        <block v-else>
                                                            <!-- 默认列表 -->
                                                            <view :class="'module-article-content module-list-content ' + (((vss.config.frontend_config || null) == null) ? '' : (vss.config.frontend_config.list_ent || ''))">
                                                                <view v-for="(item, index2sam) in vss.config.data_list" :key="index2sam" class="item">
                                                                    <view class="module-item" :style="((vss.config.frontend_config || null) == null) ? '' : (vss.config.frontend_config.item_style || '')" @tap="layout_url_event" :data-value="item.article_url || item.url || ''">
                                                                        <view v-if="(vss.config.article_is_show_cover || 0) == 1 && (item.images || item.cover)"
                                                                        :class="((vss.config.frontend_config || null) == null || (vss.config.frontend_config.media_fixed || null) == null) ? '' : vss.config.frontend_config.media_fixed.media_container_ent"
                                                                        :style="((vss.config.frontend_config || null) == null || (vss.config.frontend_config.media_fixed || null) == null) ? '' : vss.config.frontend_config.media_fixed.media_container_style">
                                                                            <image :src="item.images || item.cover" :mode="layout_media_image_mode(layout_media_fixed(vss.config))" :class="layout_media_image_class(layout_media_fixed(vss.config), 'image')" :style="layout_media_image_style(layout_media_fixed(vss.config))"></image>
                                                                        </view>
                                                                        <view class="item-bottom">
                                                                            <view :class="article_meta_class(vss.config)">
                                                                                <view class="single-text module-article-title" :style="(item.title_color || null) == null ? '' : ('color:' + item.title_color)">{{item.title}}</view>
                                                                                <view v-if="(vss.config.article_is_show_time || 0) == 1 || (vss.config.article_is_show_access || 0) == 1" class="module-article-meta-row">
                                                                                    <view v-if="(vss.config.article_is_show_time || 0) == 1" class="module-article-time">{{item.add_time || ''}}</view>
                                                                                    <view v-if="(vss.config.article_is_show_access || 0) == 1" class="module-article-access">
                                                                                        <iconfont name="icon-eye" size="24rpx" color="#999" propContainerDisplay="inline-flex"></iconfont>
                                                                                        <text class="module-article-access-num">{{item.access_count || 0}}</text>
                                                                                    </view>
                                                                                </view>
                                                                            </view>
                                                                        </view>
                                                                    </view>
                                                                </view>
                                                            </view>
                                                        </block>
                                                    </block>
                                                </block>
                                                <!-- 标题 -->
                                                <block v-else-if="vss.value == 'title'">
                                                    <view class="module-title-content">
                                                        <view v-if="(vss.config.title_type || 'text') == 'image' && (vss.config.title_images || null) != null" class="title-main title-main-image">
                                                            <image :src="vss.config.title_images" mode="heightFix" class="title-main-img"></image>
                                                        </view>
                                                        <view v-else-if="(vss.config.title_type || 'text') == 'icon' && (vss.config.title_icon || null) != null" class="title-main title-main-icon" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_title_main || null) != null) ? vss.config.frontend_config.style_title_main : ''">
                                                            <iconfont :name="'icon-' + vss.config.title_icon" size="32rpx" :color="vss.config.title_color || (((vss.config.frontend_config || null) != null && (vss.config.frontend_config.title_color || null) != null) ? vss.config.frontend_config.title_color : '')" propContainerDisplay="inline-flex"></iconfont>
                                                        </view>
                                                        <text v-else class="title-main" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_title_main || null) != null) ? vss.config.frontend_config.style_title_main : ''">
                                                            {{vss.config.title}}
                                                        </text>
                                                        <text v-if="(vss.config.title_vice || null) != null" class="title-vice"
                                                        :style="vss.config.frontend_config.style_title_vice">
                                                            {{vss.config.title_vice}}
                                                        </text>
                                                        <view v-if="(vss.config.title_more || null) != null" class="more-content">
                                                            <view
                                                            :style="vss.config.frontend_config.style_title_more" @tap="layout_url_event"
                                                            :data-value="vss.config.title_more_url || ''">
                                                                {{vss.config.title_more}} >
                                                            </view>
                                                        </view>
                                                    </view>
                                                </block>
                                                <!-- 热区：坐标相对图片层，随图等比缩放 -->
                                                <block v-else-if="vss.value == 'hot-zone' && (vss.config.images || null) != null">
                                                    <view class="module-hot-zone-media">
                                                        <image :src="vss.config.images" mode="widthFix" class="wh-auto dis-block" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.images_style || null) != null) ? vss.config.frontend_config.images_style : ''"></image>
                                                        <view
                                                            v-for="(hz, hz_index) in (vss.config.data_list || [])"
                                                            :key="hz_index"
                                                            class="module-hot-zone-item"
                                                            :style="'left:' + (hz.left || 0) + '%;top:' + (hz.top || 0) + '%;width:' + (hz.width || 0) + '%;height:' + (hz.height || 0) + '%;'"
                                                            @tap="layout_url_event"
                                                            :data-value="hz.url || ''"
                                                        ></view>
                                                    </view>
                                                </block>
                                                <!-- 公告 -->
                                                <block v-else-if="vss.value == 'notice'">
                                                    <view class="module-notice-content" :class="((vss.config.style_type || '') == 'text' && parseInt(vss.config.text_is_scroll || 0) != 1) ? 'notice-style-text' : ''">
                                                        <view v-if="(vss.config.title_type || 'text') == 'image' && (vss.config.title_images || null) != null" class="notice-title notice-title-image">
                                                            <image :src="vss.config.title_images" mode="heightFix" class="notice-title-img"></image>
                                                        </view>
                                                        <view v-else-if="(vss.config.title_type || 'text') == 'icon' && (vss.config.title_icon || null) != null" class="notice-title notice-title-icon" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_title || null) != null) ? vss.config.frontend_config.style_title : ''">
                                                            <iconfont :name="'icon-' + vss.config.title_icon" size="36rpx" :color="vss.config.title_color || (((vss.config.frontend_config || null) != null && (vss.config.frontend_config.title_color || null) != null) ? vss.config.frontend_config.title_color : '')" propContainerDisplay="inline-flex"></iconfont>
                                                        </view>
                                                        <view v-else-if="(vss.config.title_type || 'text') == 'text' && (vss.config.title || null) != null && vss.config.title !== ''" class="notice-title" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_title || null) != null) ? vss.config.frontend_config.style_title : ''">{{vss.config.title}}</view>
                                                        <notice-marquee
                                                            v-if="(vss.config.style_type || '') == 'text' && parseInt(vss.config.text_is_scroll || 0) == 1"
                                                            :text="vss.config.content_text || ''"
                                                            :speed="vss.config.scroll_speed || 3"
                                                            :pxPerSec="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.marquee_px_per_sec || null) != null) ? vss.config.frontend_config.marquee_px_per_sec : 0"
                                                            :colorStyle="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_news || null) != null) ? vss.config.frontend_config.style_news : ''"
                                                        />
                                                        <view v-else-if="(vss.config.style_type || '') == 'text'" class="notice-text flex-1" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_news || null) != null) ? vss.config.frontend_config.style_news : ''">{{vss.config.content_text || ''}}</view>
                                                        <swiper
                                                            v-else
                                                            class="notice-swiper flex-1"
                                                            circular
                                                            :indicator-dots="false"
                                                            :autoplay="true"
                                                            :duration="400"
                                                            :interval="(parseInt(vss.config.interval || 3) || 3) * 1000"
                                                            :vertical="(vss.config.direction || 'vertical') != 'horizontal'"
                                                            :key="vss.config.direction"
                                                        >
                                                            <swiper-item v-for="(nt, nt_index) in (vss.config.data_list || [])" :key="nt_index">
                                                                <view class="notice-item ht-auto flex-row align-c" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_news || null) != null) ? vss.config.frontend_config.style_news : ''" @tap="layout_url_event" :data-value="nt.url || ''">
                                                                    <view class="text-line-1">{{nt.title || ''}}</view>
                                                                </view>
                                                            </swiper-item>
                                                        </swiper>
                                                        <view v-if="(vss.config.more || null) != null" class="notice-more" :style="((vss.config.frontend_config || null) != null && (vss.config.frontend_config.style_more || null) != null) ? vss.config.frontend_config.style_more : ''" @tap="layout_url_event" :data-value="vss.config.more_url || ''">
                                                            {{vss.config.more}} >
                                                        </view>
                                                    </view>
                                                </block>
                                                <!-- 富文本 -->
                                                <block v-else-if="vss.value == 'rich-text' && (vss.config.html || null) != null">
                                                    <mp-html :content="vss.config.html" />
                                                </block>
                                                <!-- 自定义html -->
                                                <block v-else-if="vss.value == 'custom' && (vss.config.custom || null) != null">
                                                    <mp-html :content="vss.config.custom" />
                                                </block>
                                            </view>
                                        </view>
                                    </view>
                                </block>
                            </view>
                        </block>
                    </view>
                </view>
            </block>
        </block>
    </view>
</template>
<script>
    const app = getApp();
    import layoutRolling from '@/pages/design/components/layout/layout-rolling.vue';
    import noticeMarquee from '@/pages/design/components/layout/notice-marquee.vue';
    // 显式注册：layout 常被其它分包异步引用，仅靠 easycom 时小程序偶发找不到 mp-html
    import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                // 基础配置
                is_first: 1,
                currency_symbol: app.globalData.currency_symbol(),
                // 轮播基础配置（激活点用主题主色）
                indicator_color: 'rgba(0, 0, 0, .2)',
                indicator_active_color: app.globalData.get_theme_color() || '#1677ff',
                circular: true
            };
        },

        components: {
            'layout-rolling': layoutRolling,
            'notice-marquee': noticeMarquee,
            'mp-html': mpHtml
        },
        props: {
            propData: Array
        },
        watch: {
            // 有明确高度时补 class，替代小程序禁止的 [style*=...] 属性选择器
            propData: {
                immediate: true,
                handler(list) {
                    this.layout_enrich_media_fixed_height(list);
                }
            }
        },
        // 在组件实例进入页面节点树时执行
        beforeMount: function() {
            this.init_config();
        },
        // 页面被展示
        onPageShow: function() {
            this.init_config();
            
            // 非首次进入则重新初始化配置接口
            if (this.is_first == 0) {
                app.globalData.init_config();
            }

            this.setData({
                is_first: 0
            });
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol') || app.globalData.data.currency_symbol,
                        indicator_active_color: app.globalData.get_theme_color() || '#1677ff'
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },

            // 链接地址事件
            layout_url_event(e) {
                app.globalData.url_event(e);
            },

            // 媒体容器有数值高度时加 is-fixed-height，供 class 选择器使用（避开小程序属性选择器限制）
            layout_enrich_media_fixed_height(list) {
                if (!list || !list.length) {
                    return;
                }
                for (var i = 0; i < list.length; i++) {
                    var children = (list[i] && list[i].children) || [];
                    for (var j = 0; j < children.length; j++) {
                        var modules = (children[j] && children[j].children) || [];
                        for (var k = 0; k < modules.length; k++) {
                            var cfg = modules[k] && modules[k].config;
                            var mf = cfg && cfg.frontend_config && cfg.frontend_config.media_fixed;
                            if (!mf || typeof mf !== 'object') {
                                continue;
                            }
                            if (!this.layout_media_flags(mf).has_box) {
                                continue;
                            }
                            var ent = String(mf.media_container_ent || '');
                            if (ent.indexOf('is-fixed-height') < 0) {
                                mf.media_container_ent = (ent + ' is-fixed-height').replace(/\s+/g, ' ').trim();
                            }
                        }
                    }
                }
            },

            // 解析媒体开关：宽100% / 高100% / 居中 / 铺满
            layout_media_flags(media_fixed) {
                var ent = String(((media_fixed || {}).media_ent) || '');
                var style = String(((media_fixed || {}).media_container_style) || '');
                return {
                    is_width: ent.indexOf('module-fixed-doc-ent-width') >= 0,
                    is_height: ent.indexOf('module-fixed-doc-ent-height') >= 0,
                    is_auto: ent.indexOf('module-fixed-doc-ent-auto') >= 0,
                    is_cover: ent.indexOf('module-fixed-doc-ent-cover') >= 0,
                    // 只有写了 height/max-height 数值才算有盒高度；单纯 height:100% 不算
                    has_box: /(?:^|;)\s*(max-)?height\s*:\s*[0-9.]+(px|rpx|rem|em|vh)/.test(style)
                };
            },

            // 媒体图片 mode
            // 铺满/高度100% 只有在容器有明确高度时才能用 aspectFill；否则用 widthFix，避免 height:100% 塌成 0
            layout_media_image_mode(media_fixed) {
                var f = this.layout_media_flags(media_fixed);
                if ((f.is_cover || f.is_height) && f.has_box) {
                    return 'aspectFill';
                }
                return 'widthFix';
            },

            // 媒体图片样式
            layout_media_image_style(media_fixed) {
                media_fixed = media_fixed || {};
                var style = String(media_fixed.media_container_style || '');
                var f = this.layout_media_flags(media_fixed);

                // 无盒高度时：绝不写 height:100%，只保证能看见
                if (!f.has_box) {
                    if ((f.is_width || f.is_cover || f.is_height) && style.indexOf('width:') === -1) {
                        style += 'width:100%;';
                    }
                    // 去掉样式里可能残留的百分比高度，防止塌陷
                    style = style.replace(/(?:^|;)\s*height\s*:\s*100%\s*;?/g, ';').replace(/;;+/g, ';');
                    return style;
                }

                // 有盒高度：铺满/高度100% 时宽高拉满，配合 aspectFill
                if (f.is_cover || f.is_height) {
                    if (style.indexOf('width:') === -1) {
                        style += 'width:100%;';
                    }
                    if (!/(?:^|;)\s*height\s*:/.test(style)) {
                        style += 'height:100%;';
                    }
                } else if (f.is_width && style.indexOf('width:') === -1) {
                    style += 'width:100%;';
                }
                return style;
            },

            // 媒体图片 class：无盒高度时去掉会强制 height:100% 的 cover/height class
            layout_media_image_class(media_fixed, extra) {
                media_fixed = media_fixed || {};
                var ent = String(media_fixed.media_ent || '');
                var f = this.layout_media_flags(media_fixed);
                if (!f.has_box) {
                    ent = ent
                        .replace(/module-fixed-doc-ent-cover/g, '')
                        .replace(/module-fixed-doc-ent-height/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                }
                return (ent + ' ' + (extra || '')).replace(/\s+/g, ' ').trim();
            },

            // 视频样式：无明确高度时不能 height:100%/auto（小程序原生 video 会塌成 0）
            layout_media_video_style(media_fixed) {
                media_fixed = media_fixed || {};
                var style = this.layout_media_image_style(media_fixed);
                var f = this.layout_media_flags(media_fixed);
                if (style.indexOf('width:') === -1) {
                    style += 'width:100%;';
                }
                if (f.has_box) {
                    if ((f.is_cover || f.is_height) && !/(?:^|;)\s*height\s*:/.test(style)) {
                        style += 'height:100%;';
                    }
                    return style;
                }
                // 无盒：给 16:9 默认高度，保证看得见；铺满/高100% 在此高度内生效
                if (!/(?:^|;)\s*height\s*:/.test(style) && !/(?:^|;)\s*max-height\s*:/.test(style)) {
                    style += 'height:422rpx;';
                }
                return style;
            },

            layout_media_video_object_fit(media_fixed) {
                var f = this.layout_media_flags(media_fixed);
                if (f.is_cover) {
                    return 'cover';
                }
                return 'contain';
            },

            // frontend_config 字段（小程序模板不能写 || {}，统一走方法）
            layout_frontend_cfg(config, key, def) {
                config = config || {};
                var fc = config.frontend_config;
                if (fc == null || typeof fc !== 'object') {
                    return def;
                }
                var v = fc[key];
                if (v === undefined || v === null || v === '') {
                    return def;
                }
                return v;
            },
            layout_media_fixed(config) {
                var mf = this.layout_frontend_cfg(config, 'media_fixed', null);
                return (mf != null && typeof mf === 'object') ? mf : {};
            },
            layout_media_fixed_cfg(config, key, def) {
                var mf = this.layout_media_fixed(config);
                var v = mf[key];
                if (v === undefined || v === null || v === '') {
                    return def;
                }
                return v;
            },
            // 商品配置取值（兼容 config / frontend_config）
            layout_goods_cfg(config, key, def) {
                config = config || {};
                var v = config[key];
                if (v === undefined || v === null || v === '') {
                    var fc = config.frontend_config;
                    if (fc != null && typeof fc === 'object') {
                        v = fc[key];
                    }
                }
                if (v === undefined || v === null || v === '') {
                    return def;
                }
                return v;
            },
            layout_goods_flag(config, key) {
                var v = this.layout_goods_cfg(config, key, 0);
                return v === true || v === 1 || v === '1';
            },
            // 商品标题行数 class（默认 2 行）
            layout_goods_title_line_class(config) {
                var n = parseInt(this.layout_goods_cfg(config, 'goods_title_line', 2), 10);
                return (n === 1) ? 'module-title-line-1' : 'module-title-line-2';
            },
            // 价格在标题上方
            layout_goods_is_price_top(config) {
                return this.layout_goods_flag(config, 'goods_is_price_top');
            },
            // 价格对齐
            layout_goods_price_align_style(config) {
                var align = this.layout_goods_cfg(config, 'goods_price_align', 'left');
                if (['left', 'center', 'right'].indexOf(align) < 0) {
                    align = 'left';
                }
                return 'text-align:' + align + ';';
            },
            // 显示原价（有有效原价才展示）
            layout_goods_show_original(config, item) {
                if (!this.layout_goods_flag(config, 'goods_is_show_original_price')) {
                    return false;
                }
                var orig = (item || {}).original_price;
                return orig != null && orig !== '' && parseFloat(orig) > 0;
            },

            // 滚动模式配置（对齐 PC is_auto_play / is_nav_dot / item_width）
            layout_rolling_value(config) {
                return ((config || {}).view_list_show_style_value_arr) || {};
            },
            layout_rolling_flag(val) {
                return val === true || val === 1 || val === '1';
            },
            layout_rolling_is_auto_play(config) {
                return this.layout_rolling_flag(this.layout_rolling_value(config).is_auto_play);
            },
            // 自动播放间隔（毫秒），配置为秒，默认 3，最大 30
            layout_rolling_interval(config) {
                var n = parseInt(this.layout_rolling_value(config).auto_play_interval || 3, 10);
                if (isNaN(n) || n < 1) {
                    n = 3;
                }
                if (n > 30) {
                    n = 30;
                }
                return n * 1000;
            },
            layout_rolling_is_nav_dot(config) {
                var fc = (config || {}).frontend_config || {};
                if (String(fc.nav_dot_ent || '').indexOf('slides-rolling-not-dot') >= 0) {
                    return false;
                }
                return this.layout_rolling_flag(this.layout_rolling_value(config).is_nav_dot);
            },
            layout_rolling_item_width(config) {
                return parseInt(this.layout_rolling_value(config).item_width || 200, 10) || 200;
            },
            layout_rolling_item_margin(config) {
                var m = this.layout_rolling_value(config).item_margin;
                if (m === undefined || m === null || m === '') {
                    return 20;
                }
                var n = parseInt(m, 10);
                return isNaN(n) ? 20 : n;
            },
            // 与 PC 一致：配置宽/间距 + frontend_config.item_style（内边距/外边距/边线等）
            layout_rolling_item_style(config) {
                var w = this.layout_rolling_item_width(config);
                var m = this.layout_rolling_item_margin(config);
                var item_style = (((config || {}).frontend_config || {}).item_style) || '';
                if (item_style && typeof item_style !== 'string') {
                    item_style = '';
                }
                return 'width:' + w + 'px;margin-right:' + m + 'px;flex-shrink:0;box-sizing:border-box;' + item_style;
            },

            // 图片魔方：是否新网格（is_grid / density / start-end）
            layout_magic_cube_is_grid(config) {
                config = config || {};
                var fc = config.frontend_config || {};
                if (parseInt(fc.is_grid || 0, 10) === 1) {
                    return true;
                }
                if (config.magic_cube_density || fc.magic_cube_density) {
                    return true;
                }
                var list = config.data_list || [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i] && list[i].start && list[i].end) {
                        return true;
                    }
                }
                return false;
            },

            layout_magic_cube_density(config) {
                config = config || {};
                var fc = config.frontend_config || {};
                var d = parseInt(config.magic_cube_density || fc.magic_cube_density || 4, 10);
                if ([4, 6, 8].indexOf(d) < 0) {
                    d = 4;
                }
                return d;
            },

            layout_magic_cube_gap(config) {
                config = config || {};
                var fc = config.frontend_config || {};
                var gap = 0;
                if (config.magic_cube_gap !== undefined && config.magic_cube_gap !== null && config.magic_cube_gap !== '') {
                    gap = parseInt(config.magic_cube_gap, 10) || 0;
                } else if (config.style_margin !== undefined && config.style_margin !== '' && config.style_margin_top === undefined) {
                    gap = parseInt(config.style_margin, 10) || 0;
                } else {
                    var m = String(fc.list_ent || '').match(/module-list-content-avg-(\d+)/);
                    if (m) {
                        gap = parseInt(m[1], 10) || 0;
                    }
                }
                return gap;
            },

            layout_magic_cube_grid_style(config) {
                var d = this.layout_magic_cube_density(config);
                var gap = this.layout_magic_cube_gap(config);
                return 'display:grid;grid-template-columns:repeat(' + d + ',minmax(0,1fr));grid-template-rows:repeat(' + d + ',minmax(0,1fr));gap:' + gap + 'px;';
            },

            layout_magic_cube_item_style(item) {
                item = item || {};
                var start = item.start || {};
                var end = item.end || {};
                var sx = parseInt(start.x || 1, 10);
                var sy = parseInt(start.y || 1, 10);
                var ex = parseInt(end.x || sx, 10) + 1;
                var ey = parseInt(end.y || sy, 10) + 1;
                return 'grid-column:' + sx + ' / ' + ex + ';grid-row:' + sy + ' / ' + ey + ';';
            },

            // 魔方格子本身有尺寸：铺满→aspectFill，否则 aspectFit（对齐 Web object-fit）
            layout_magic_cube_image_mode(media_fixed) {
                var f = this.layout_media_flags(media_fixed);
                if (f.is_cover) {
                    return 'aspectFill';
                }
                return 'aspectFit';
            },

            layout_magic_cube_image_class(media_fixed) {
                media_fixed = media_fixed || {};
                return (String(media_fixed.media_ent || '') + ' image').replace(/\s+/g, ' ').trim();
            },

            // 布局：手机模式不独行（勾选=保持多列比例；默认=独行）
            layout_is_mobile_no_stack(config) {
                config = config || {};
                if (config.is_mobile_no_stack !== undefined && config.is_mobile_no_stack !== null && config.is_mobile_no_stack !== '') {
                    return parseInt(config.is_mobile_no_stack, 10) === 1;
                }
                // 兼容旧字段：is_mobile_stack=0 表示不独行
                if (config.is_mobile_stack !== undefined && config.is_mobile_stack !== null && config.is_mobile_stack !== '') {
                    return parseInt(config.is_mobile_stack, 10) === 0;
                }
                return false;
            },

            // 多列列宽：不独行时按 value_arr 十二栅格比例并排
            // 独行/单列用 width:auto，让左右外边距正常内缩，不会 100%+margin 撑出屏幕
            layout_column_style(v, index) {
                if ((v || null) == null || (v.value_arr || null) == null || v.value_arr.length <= 1) {
                    return 'width:auto;max-width:100%;box-sizing:border-box;';
                }
                if (!this.layout_is_mobile_no_stack(v.config)) {
                    return 'width:auto;max-width:100%;box-sizing:border-box;';
                }
                var n = parseInt(v.value_arr[index] || 0, 10);
                if (n <= 0) {
                    n = 12;
                }
                return 'width:' + ((n / 12) * 100) + '%;float:left;box-sizing:border-box;max-width:100%;';
            },

            // 以下样式一律直出设计页已保存的 frontend_config，不做解析/重算
            layout_fc(config) {
                if ((config || null) == null || (config.frontend_config || null) == null) {
                    return {};
                }
                return config.frontend_config;
            },
            layout_fc_str(config, key) {
                var v = this.layout_fc(config)[key];
                return (v === undefined || v === null) ? '' : String(v);
            },

            // 容积/模块：完整 ent
            layout_ent_class(config) {
                return this.layout_fc_str(config, 'ent').replace(/\s+/g, ' ').trim();
            },

            // 布局外层 class（边距/边线/圆角）
            layout_outer_ent_class(config) {
                return this.layout_fc_str(config, 'outer_ent').replace(/\s+/g, ' ').trim();
            },

            // 布局内层 class（限宽居中）
            layout_inner_ent_class(config) {
                return this.layout_fc_str(config, 'ent').replace(/\s+/g, ' ').trim();
            },

            // 布局外层 style（圆角/边线色）
            layout_outer_style(config) {
                return this.layout_fc_str(config, 'outer_style');
            },

            // 布局内层 style
            layout_inner_style(config) {
                return this.layout_fc_str(config, 'style');
            },

            // 容积内容样式
            layout_content_style(config) {
                return this.layout_fc_str(config, 'style');
            },

            // 背景色/渐变层
            layout_bg_color_style(config) {
                var fc = this.layout_fc(config);
                if ((fc.bg_color_style || null) != null && fc.bg_color_style !== '') {
                    return String(fc.bg_color_style);
                }
                return (fc.bg_style || null) != null ? String(fc.bg_style) : '';
            },

            // 背景图层
            layout_bg_image_style(config) {
                return this.layout_fc_str(config, 'bg_image_style');
            },

            // 模块外层：内容样式 + 色层
            layout_module_box_style(config) {
                return this.layout_content_style(config) + this.layout_bg_color_style(config);
            },

            // 模块图层
            layout_module_bg_image_style(config) {
                return this.layout_bg_image_style(config);
            },

            // 文章标题行 class（开关开=与标题同行靠右，关=独立一行）
            article_meta_class(config) {
                config = config || {};
                var show_time = parseInt(config.article_is_show_time || 0, 10) === 1;
                var show_access = parseInt(config.article_is_show_access || 0, 10) === 1;
                if (!show_time && !show_access) {
                    return 'module-article-meta';
                }
                var show_info = parseInt(config.article_is_show_info || 0, 10) === 1;
                return 'module-article-meta ' + (show_info ? 'module-article-meta-with-info' : 'module-article-meta-info-alone');
            }
        }
    };
</script>
<style>
    /**
     * 布局基础：外层色/渐变 + 绝对定位空图层（与 PC / DIY 一致）
     * border-box：内边距计入宽度
     * width:auto：外边距在块级下自动挤占宽度，避免 width:100% + margin 往右侧溢出
     */
    .layout-view,
    .layout-content-children,
    .layout-content-container,
    .layout-content,
    .module-content,
    .module-content > [class*="module-"][class*="-container"]{
        position:relative;
        z-index:0;
        box-sizing:border-box;
        max-width:100%;
    }
    .layout-view,
    .layout-content-children,
    .layout-content-container{
        display:block;
        width:auto;
        overflow:hidden;
    }
    /* 布局内容层保持居中；有 am-container 时用限宽，勿被 max-width:100% 盖掉 */
    .layout-view > .layout-content-children{
        width:100%;
        margin-left:auto;
        margin-right:auto;
        box-sizing:border-box;
    }
    .layout-view > .layout-content-children:not(.am-container){
        max-width:100%;
    }
    .layout-view > .layout-content-children.am-container{
        max-width:1000px;
    }
    .layout-bg-image-layer{
        position:absolute;left:0;right:0;top:0;bottom:0;width:100%;height:100%;
        box-sizing:border-box;background-color:transparent;pointer-events:none;z-index:-1;
        border-radius:inherit;
    }
    
    /**
     * 模块类型样式 - 数据列表
     */
    .module-list-content .item{float:left}
    .module-list-content-avg-1{width:calc(100% + 1px);margin-left:-1px;margin-top:-1px;}
    .module-list-content-avg-2{width:calc(100% + 2px);margin-left:-2px;margin-top:-2px;}
    .module-list-content-avg-3{width:calc(100% + 3px);margin-left:-3px;margin-top:-3px;}
    .module-list-content-avg-4{width:calc(100% + 4px);margin-left:-4px;margin-top:-4px;}
    .module-list-content-avg-5{width:calc(100% + 5px);margin-left:-5px;margin-top:-5px;}
    .module-list-content-avg-6{width:calc(100% + 6px);margin-left:-6px;margin-top:-6px;}
    .module-list-content-avg-7{width:calc(100% + 7px);margin-left:-7px;margin-top:-7px;}
    .module-list-content-avg-8{width:calc(100% + 8px);margin-left:-8px;margin-top:-8px;}
    .module-list-content-avg-9{width:calc(100% + 9px);margin-left:-9px;margin-top:-9px;}
    .module-list-content-avg-10{width:calc(100% + 10px);margin-left:-10px;margin-top:-10px;}
    .module-list-content-avg-11{width:calc(100% + 11px);margin-left:-11px;margin-top:-11px;}
    .module-list-content-avg-12{width:calc(100% + 12px);margin-left:-12px;margin-top:-12px;}
    .module-list-content-avg-13{width:calc(100% + 13px);margin-left:-13px;margin-top:-13px;}
    .module-list-content-avg-14{width:calc(100% + 14px);margin-left:-14px;margin-top:-14px;}
    .module-list-content-avg-15{width:calc(100% + 15px);margin-left:-15px;margin-top:-15px;}
    .module-list-content-avg-16{width:calc(100% + 16px);margin-left:-16px;margin-top:-16px;}
    .module-list-content-avg-17{width:calc(100% + 17px);margin-left:-17px;margin-top:-17px;}
    .module-list-content-avg-18{width:calc(100% + 18px);margin-left:-18px;margin-top:-18px;}
    .module-list-content-avg-19{width:calc(100% + 19px);margin-left:-19px;margin-top:-19px;}
    .module-list-content-avg-20{width:calc(100% + 20px);margin-left:-20px;margin-top:-20px;}
    .module-list-content-avg-21{width:calc(100% + 21px);margin-left:-21px;margin-top:-21px;}
    .module-list-content-avg-22{width:calc(100% + 22px);margin-left:-22px;margin-top:-22px;}
    .module-list-content-avg-23{width:calc(100% + 23px);margin-left:-23px;margin-top:-23px;}
    .module-list-content-avg-24{width:calc(100% + 24px);margin-left:-24px;margin-top:-24px;}
    .module-list-content-avg-25{width:calc(100% + 25px);margin-left:-25px;margin-top:-25px;}
    .module-list-content-avg-26{width:calc(100% + 26px);margin-left:-26px;margin-top:-26px;}
    .module-list-content-avg-27{width:calc(100% + 27px);margin-left:-27px;margin-top:-27px;}
    .module-list-content-avg-28{width:calc(100% + 28px);margin-left:-28px;margin-top:-28px;}
    .module-list-content-avg-29{width:calc(100% + 29px);margin-left:-29px;margin-top:-29px;}
    .module-list-content-avg-30{width:calc(100% + 30px);margin-left:-30px;margin-top:-30px;}
    .module-list-sm-1 .item{width:100%;}
    .module-list-sm-2 .item{width:50%;}
    .module-list-sm-3 .item{width:33.33%;}
    .module-list-sm-4 .item{width:25%;}
    .module-list-sm-5 .item{width:20%;}
    .module-list-sm-6 .item{width:16.66%;}
    .module-list-sm-7 .item{width:14.28%;}
    .module-list-sm-8 .item{width:12.5%;}
    .module-list-sm-9 .item{width:11.11%;}
    .module-list-sm-10 .item{width:10%;}
    .module-list-sm-11 .item{width:9.09%;}
    .module-list-sm-12 .item{width:8.33%;}
    
    /**
     * 商品列表
     */
    .module-goods-content .module-item{background:#fff}
    .module-goods-content .module-item .item-bottom{margin-top:5px}
    .module-goods-content .module-item .module-title{margin-bottom:5px;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;min-height:40px;height:40px;line-height:20px;font-size:12px;white-space:initial}
    .module-goods-content .module-item .module-title.module-title-line-1{-webkit-line-clamp:1;min-height:20px;height:20px}
    .module-goods-content .module-item .module-title.module-title-line-2{-webkit-line-clamp:2;min-height:40px;height:40px}
    .module-goods-content .module-item .module-price-box{width:100%;line-height:22px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .module-goods-content .module-item .module-price-box + .module-title{margin-top:5px;margin-bottom:0}
    .module-goods-content .module-item .module-price{color:var(--color-price, #E22C08);font-weight:bold;word-wrap:normal;text-overflow:ellipsis;white-space:nowrap;font-size:14px;}
    .module-goods-content .module-item .module-price-original{margin-left:8px;color:#999;font-size:12px;font-weight:normal;text-decoration:line-through}

    /**
     * 文章列表
     */
    .module-article-content .module-item{background:#fff}
    .module-article-content .module-item .item-bottom{margin-top:5px}
    .module-article-content .module-article-meta{min-width:0}
    .module-article-content .module-article-meta-with-info{display:flex;align-items:center}
    .module-article-content .module-article-title{margin:0;line-height:20px;font-size:14px;color:#333}
    .module-article-content .module-article-meta-with-info .module-article-title{flex:1 1 auto;min-width:0;margin-right:8px}
    .module-article-content .module-article-meta-row{display:flex;align-items:center;white-space:nowrap;line-height:18px;font-size:12px;color:#999}
    .module-article-content .module-article-meta-with-info .module-article-meta-row{flex:0 0 auto;justify-content:flex-end;margin-left:auto}
    .module-article-content .module-article-meta-info-alone .module-article-meta-row{justify-content:space-between;margin-top:2px}
    .module-article-content .module-article-time{margin:0;min-width:0}
    .module-article-content .module-article-access{display:inline-flex;align-items:center;flex:0 0 auto;margin-left:8px}
    .module-article-content .module-article-meta-info-alone .module-article-access{margin-left:0}
    .module-article-content .module-article-access-num{margin-left:2px}

    /**
     * 布局圆角
     */
    .layout-sm-border-radius-1{border-radius:1px;}
    .layout-sm-border-radius-2{border-radius:2px;}
    .layout-sm-border-radius-3{border-radius:3px;}
    .layout-sm-border-radius-4{border-radius:4px;}
    .layout-sm-border-radius-5{border-radius:5px;}
    .layout-sm-border-radius-6{border-radius:6px;}
    .layout-sm-border-radius-7{border-radius:7px;}
    .layout-sm-border-radius-8{border-radius:8px;}
    .layout-sm-border-radius-9{border-radius:9px;}
    .layout-sm-border-radius-10{border-radius:10px;}
    .layout-sm-border-radius-11{border-radius:11px;}
    .layout-sm-border-radius-12{border-radius:12px;}
    .layout-sm-border-radius-13{border-radius:13px;}
    .layout-sm-border-radius-14{border-radius:14px;}
    .layout-sm-border-radius-15{border-radius:15px;}
    .layout-sm-border-radius-16{border-radius:16px;}
    .layout-sm-border-radius-17{border-radius:17px;}
    .layout-sm-border-radius-18{border-radius:18px;}
    .layout-sm-border-radius-19{border-radius:19px;}
    .layout-sm-border-radius-20{border-radius:20px;}
    .layout-sm-border-radius-21{border-radius:21px;}
    .layout-sm-border-radius-22{border-radius:22px;}
    .layout-sm-border-radius-23{border-radius:23px;}
    .layout-sm-border-radius-24{border-radius:24px;}
    .layout-sm-border-radius-25{border-radius:25px;}
    .layout-sm-border-radius-26{border-radius:26px;}
    .layout-sm-border-radius-27{border-radius:27px;}
    .layout-sm-border-radius-28{border-radius:28px;}
    .layout-sm-border-radius-29{border-radius:29px;}
    .layout-sm-border-radius-30{border-radius:30px;}
     
    /**
     * 布局样式 - 边线大小
     */
    .layout-sm-border-top-1{border-top:1px;}
    .layout-sm-border-top-2{border-top:2px;}
    .layout-sm-border-top-3{border-top:3px;}
    .layout-sm-border-top-4{border-top:4px;}
    .layout-sm-border-top-5{border-top:5px;}
    .layout-sm-border-top-6{border-top:6px;}
    .layout-sm-border-top-7{border-top:7px;}
    .layout-sm-border-top-8{border-top:8px;}
    .layout-sm-border-top-9{border-top:9px;}
    .layout-sm-border-top-10{border-top:10px;}
    
    .layout-sm-border-right-1{border-right:1px;}
    .layout-sm-border-right-2{border-right:2px;}
    .layout-sm-border-right-3{border-right:3px;}
    .layout-sm-border-right-4{border-right:4px;}
    .layout-sm-border-right-5{border-right:5px;}
    .layout-sm-border-right-6{border-right:6px;}
    .layout-sm-border-right-7{border-right:7px;}
    .layout-sm-border-right-8{border-right:8px;}
    .layout-sm-border-right-9{border-right:9px;}
    .layout-sm-border-right-10{border-right:10px;}
    
    .layout-sm-border-bottom-1{border-bottom:1px;}
    .layout-sm-border-bottom-2{border-bottom:2px;}
    .layout-sm-border-bottom-3{border-bottom:3px;}
    .layout-sm-border-bottom-4{border-bottom:4px;}
    .layout-sm-border-bottom-5{border-bottom:5px;}
    .layout-sm-border-bottom-6{border-bottom:6px;}
    .layout-sm-border-bottom-7{border-bottom:7px;}
    .layout-sm-border-bottom-8{border-bottom:8px;}
    .layout-sm-border-bottom-9{border-bottom:9px;}
    .layout-sm-border-bottom-10{border-bottom:10px;}
    
    .layout-sm-border-left-1{border-left:1px;}
    .layout-sm-border-left-2{border-left:2px;}
    .layout-sm-border-left-3{border-left:3px;}
    .layout-sm-border-left-4{border-left:4px;}
    .layout-sm-border-left-5{border-left:5px;}
    .layout-sm-border-left-6{border-left:6px;}
    .layout-sm-border-left-7{border-left:7px;}
    .layout-sm-border-left-8{border-left:8px;}
    .layout-sm-border-left-9{border-left:9px;}
    .layout-sm-border-left-10{border-left:10px;}
     
    /**
     * 布局边线 - 边线类型
     */
    .layout-sm-border-top-solid{border-top-style:solid;}
    .layout-sm-border-top-dashed{border-top-style:dashed;}
    .layout-sm-border-top-dotted{border-top-style:dotted;}
    .layout-sm-border-top-double{border-top-style:double;}
    
    .layout-sm-border-right-solid{border-right-style:solid;}
    .layout-sm-border-right-dashed{border-right-style:dashed;}
    .layout-sm-border-right-dotted{border-right-style:dotted;}
    .layout-sm-border-right-double{border-right-style:double;}
    
    .layout-sm-border-bottom-solid{border-bottom-style:solid;}
    .layout-sm-border-bottom-dashed{border-bottom-style:dashed;}
    .layout-sm-border-bottom-dotted{border-bottom-style:dotted;}
    .layout-sm-border-bottom-double{border-bottom-style:double;}
    
    .layout-sm-border-left-solid{border-left-style:solid;}
    .layout-sm-border-left-dashed{border-left-style:dashed;}
    .layout-sm-border-left-dotted{border-left-style:dotted;}
    .layout-sm-border-left-double{border-left-style:double;}
     
    /**
     * 布局外边距
     */
    .layout-sm-margin-top-1{margin-top:1px;}
    .layout-sm-margin-top-2{margin-top:2px;}
    .layout-sm-margin-top-3{margin-top:3px;}
    .layout-sm-margin-top-4{margin-top:4px;}
    .layout-sm-margin-top-5{margin-top:5px;}
    .layout-sm-margin-top-6{margin-top:6px;}
    .layout-sm-margin-top-7{margin-top:7px;}
    .layout-sm-margin-top-8{margin-top:8px;}
    .layout-sm-margin-top-9{margin-top:9px;}
    .layout-sm-margin-top-10{margin-top:10px;}
    .layout-sm-margin-top-11{margin-top:11px;}
    .layout-sm-margin-top-12{margin-top:12px;}
    .layout-sm-margin-top-13{margin-top:13px;}
    .layout-sm-margin-top-14{margin-top:14px;}
    .layout-sm-margin-top-15{margin-top:15px;}
    .layout-sm-margin-top-16{margin-top:16px;}
    .layout-sm-margin-top-17{margin-top:17px;}
    .layout-sm-margin-top-18{margin-top:18px;}
    .layout-sm-margin-top-19{margin-top:19px;}
    .layout-sm-margin-top-20{margin-top:20px;}
    .layout-sm-margin-top-21{margin-top:21px;}
    .layout-sm-margin-top-22{margin-top:22px;}
    .layout-sm-margin-top-23{margin-top:23px;}
    .layout-sm-margin-top-24{margin-top:24px;}
    .layout-sm-margin-top-25{margin-top:25px;}
    .layout-sm-margin-top-26{margin-top:26px;}
    .layout-sm-margin-top-27{margin-top:27px;}
    .layout-sm-margin-top-28{margin-top:28px;}
    .layout-sm-margin-top-29{margin-top:29px;}
    .layout-sm-margin-top-30{margin-top:30px;}
    .layout-sm-margin-top-31{margin-top:31px;}
    .layout-sm-margin-top-32{margin-top:32px;}
    .layout-sm-margin-top-33{margin-top:33px;}
    .layout-sm-margin-top-34{margin-top:34px;}
    .layout-sm-margin-top-35{margin-top:35px;}
    .layout-sm-margin-top-36{margin-top:36px;}
    .layout-sm-margin-top-37{margin-top:37px;}
    .layout-sm-margin-top-38{margin-top:38px;}
    .layout-sm-margin-top-39{margin-top:39px;}
    .layout-sm-margin-top-40{margin-top:40px;}
    .layout-sm-margin-top-41{margin-top:41px;}
    .layout-sm-margin-top-42{margin-top:42px;}
    .layout-sm-margin-top-43{margin-top:43px;}
    .layout-sm-margin-top-44{margin-top:44px;}
    .layout-sm-margin-top-45{margin-top:45px;}
    .layout-sm-margin-top-46{margin-top:46px;}
    .layout-sm-margin-top-47{margin-top:47px;}
    .layout-sm-margin-top-48{margin-top:48px;}
    .layout-sm-margin-top-49{margin-top:49px;}
    .layout-sm-margin-top-50{margin-top:50px;}
    .layout-sm-margin-top-51{margin-top:51px;}
    .layout-sm-margin-top-52{margin-top:52px;}
    .layout-sm-margin-top-53{margin-top:53px;}
    .layout-sm-margin-top-54{margin-top:54px;}
    .layout-sm-margin-top-55{margin-top:55px;}
    .layout-sm-margin-top-56{margin-top:56px;}
    .layout-sm-margin-top-57{margin-top:57px;}
    .layout-sm-margin-top-58{margin-top:58px;}
    .layout-sm-margin-top-59{margin-top:59px;}
    .layout-sm-margin-top-60{margin-top:60px;}
    
    .layout-sm-margin-right-1{margin-right:1px;}
    .layout-sm-margin-right-2{margin-right:2px;}
    .layout-sm-margin-right-3{margin-right:3px;}
    .layout-sm-margin-right-4{margin-right:4px;}
    .layout-sm-margin-right-5{margin-right:5px;}
    .layout-sm-margin-right-6{margin-right:6px;}
    .layout-sm-margin-right-7{margin-right:7px;}
    .layout-sm-margin-right-8{margin-right:8px;}
    .layout-sm-margin-right-9{margin-right:9px;}
    .layout-sm-margin-right-10{margin-right:10px;}
    .layout-sm-margin-right-11{margin-right:11px;}
    .layout-sm-margin-right-12{margin-right:12px;}
    .layout-sm-margin-right-13{margin-right:13px;}
    .layout-sm-margin-right-14{margin-right:14px;}
    .layout-sm-margin-right-15{margin-right:15px;}
    .layout-sm-margin-right-16{margin-right:16px;}
    .layout-sm-margin-right-17{margin-right:17px;}
    .layout-sm-margin-right-18{margin-right:18px;}
    .layout-sm-margin-right-19{margin-right:19px;}
    .layout-sm-margin-right-20{margin-right:20px;}
    .layout-sm-margin-right-21{margin-right:21px;}
    .layout-sm-margin-right-22{margin-right:22px;}
    .layout-sm-margin-right-23{margin-right:23px;}
    .layout-sm-margin-right-24{margin-right:24px;}
    .layout-sm-margin-right-25{margin-right:25px;}
    .layout-sm-margin-right-26{margin-right:26px;}
    .layout-sm-margin-right-27{margin-right:27px;}
    .layout-sm-margin-right-28{margin-right:28px;}
    .layout-sm-margin-right-29{margin-right:29px;}
    .layout-sm-margin-right-30{margin-right:30px;}
    .layout-sm-margin-right-31{margin-right:31px;}
    .layout-sm-margin-right-32{margin-right:32px;}
    .layout-sm-margin-right-33{margin-right:33px;}
    .layout-sm-margin-right-34{margin-right:34px;}
    .layout-sm-margin-right-35{margin-right:35px;}
    .layout-sm-margin-right-36{margin-right:36px;}
    .layout-sm-margin-right-37{margin-right:37px;}
    .layout-sm-margin-right-38{margin-right:38px;}
    .layout-sm-margin-right-39{margin-right:39px;}
    .layout-sm-margin-right-40{margin-right:40px;}
    .layout-sm-margin-right-41{margin-right:41px;}
    .layout-sm-margin-right-42{margin-right:42px;}
    .layout-sm-margin-right-43{margin-right:43px;}
    .layout-sm-margin-right-44{margin-right:44px;}
    .layout-sm-margin-right-45{margin-right:45px;}
    .layout-sm-margin-right-46{margin-right:46px;}
    .layout-sm-margin-right-47{margin-right:47px;}
    .layout-sm-margin-right-48{margin-right:48px;}
    .layout-sm-margin-right-49{margin-right:49px;}
    .layout-sm-margin-right-50{margin-right:50px;}
    .layout-sm-margin-right-51{margin-right:51px;}
    .layout-sm-margin-right-52{margin-right:52px;}
    .layout-sm-margin-right-53{margin-right:53px;}
    .layout-sm-margin-right-54{margin-right:54px;}
    .layout-sm-margin-right-55{margin-right:55px;}
    .layout-sm-margin-right-56{margin-right:56px;}
    .layout-sm-margin-right-57{margin-right:57px;}
    .layout-sm-margin-right-58{margin-right:58px;}
    .layout-sm-margin-right-59{margin-right:59px;}
    .layout-sm-margin-right-60{margin-right:60px;}
    
    .layout-sm-margin-bottom-1{margin-bottom:1px;}
    .layout-sm-margin-bottom-2{margin-bottom:2px;}
    .layout-sm-margin-bottom-3{margin-bottom:3px;}
    .layout-sm-margin-bottom-4{margin-bottom:4px;}
    .layout-sm-margin-bottom-5{margin-bottom:5px;}
    .layout-sm-margin-bottom-6{margin-bottom:6px;}
    .layout-sm-margin-bottom-7{margin-bottom:7px;}
    .layout-sm-margin-bottom-8{margin-bottom:8px;}
    .layout-sm-margin-bottom-9{margin-bottom:9px;}
    .layout-sm-margin-bottom-10{margin-bottom:10px;}
    .layout-sm-margin-bottom-11{margin-bottom:11px;}
    .layout-sm-margin-bottom-12{margin-bottom:12px;}
    .layout-sm-margin-bottom-13{margin-bottom:13px;}
    .layout-sm-margin-bottom-14{margin-bottom:14px;}
    .layout-sm-margin-bottom-15{margin-bottom:15px;}
    .layout-sm-margin-bottom-16{margin-bottom:16px;}
    .layout-sm-margin-bottom-17{margin-bottom:17px;}
    .layout-sm-margin-bottom-18{margin-bottom:18px;}
    .layout-sm-margin-bottom-19{margin-bottom:19px;}
    .layout-sm-margin-bottom-20{margin-bottom:20px;}
    .layout-sm-margin-bottom-21{margin-bottom:21px;}
    .layout-sm-margin-bottom-22{margin-bottom:22px;}
    .layout-sm-margin-bottom-23{margin-bottom:23px;}
    .layout-sm-margin-bottom-24{margin-bottom:24px;}
    .layout-sm-margin-bottom-25{margin-bottom:25px;}
    .layout-sm-margin-bottom-26{margin-bottom:26px;}
    .layout-sm-margin-bottom-27{margin-bottom:27px;}
    .layout-sm-margin-bottom-28{margin-bottom:28px;}
    .layout-sm-margin-bottom-29{margin-bottom:29px;}
    .layout-sm-margin-bottom-30{margin-bottom:30px;}
    .layout-sm-margin-bottom-31{margin-bottom:31px;}
    .layout-sm-margin-bottom-32{margin-bottom:32px;}
    .layout-sm-margin-bottom-33{margin-bottom:33px;}
    .layout-sm-margin-bottom-34{margin-bottom:34px;}
    .layout-sm-margin-bottom-35{margin-bottom:35px;}
    .layout-sm-margin-bottom-36{margin-bottom:36px;}
    .layout-sm-margin-bottom-37{margin-bottom:37px;}
    .layout-sm-margin-bottom-38{margin-bottom:38px;}
    .layout-sm-margin-bottom-39{margin-bottom:39px;}
    .layout-sm-margin-bottom-40{margin-bottom:40px;}
    .layout-sm-margin-bottom-41{margin-bottom:41px;}
    .layout-sm-margin-bottom-42{margin-bottom:42px;}
    .layout-sm-margin-bottom-43{margin-bottom:43px;}
    .layout-sm-margin-bottom-44{margin-bottom:44px;}
    .layout-sm-margin-bottom-45{margin-bottom:45px;}
    .layout-sm-margin-bottom-46{margin-bottom:46px;}
    .layout-sm-margin-bottom-47{margin-bottom:47px;}
    .layout-sm-margin-bottom-48{margin-bottom:48px;}
    .layout-sm-margin-bottom-49{margin-bottom:49px;}
    .layout-sm-margin-bottom-50{margin-bottom:50px;}
    .layout-sm-margin-bottom-51{margin-bottom:51px;}
    .layout-sm-margin-bottom-52{margin-bottom:52px;}
    .layout-sm-margin-bottom-53{margin-bottom:53px;}
    .layout-sm-margin-bottom-54{margin-bottom:54px;}
    .layout-sm-margin-bottom-55{margin-bottom:55px;}
    .layout-sm-margin-bottom-56{margin-bottom:56px;}
    .layout-sm-margin-bottom-57{margin-bottom:57px;}
    .layout-sm-margin-bottom-58{margin-bottom:58px;}
    .layout-sm-margin-bottom-59{margin-bottom:59px;}
    .layout-sm-margin-bottom-60{margin-bottom:60px;}
    
    .layout-sm-margin-left-1{margin-left:1px;}
    .layout-sm-margin-left-2{margin-left:2px;}
    .layout-sm-margin-left-3{margin-left:3px;}
    .layout-sm-margin-left-4{margin-left:4px;}
    .layout-sm-margin-left-5{margin-left:5px;}
    .layout-sm-margin-left-6{margin-left:6px;}
    .layout-sm-margin-left-7{margin-left:7px;}
    .layout-sm-margin-left-8{margin-left:8px;}
    .layout-sm-margin-left-9{margin-left:9px;}
    .layout-sm-margin-left-10{margin-left:10px;}
    .layout-sm-margin-left-11{margin-left:11px;}
    .layout-sm-margin-left-12{margin-left:12px;}
    .layout-sm-margin-left-13{margin-left:13px;}
    .layout-sm-margin-left-14{margin-left:14px;}
    .layout-sm-margin-left-15{margin-left:15px;}
    .layout-sm-margin-left-16{margin-left:16px;}
    .layout-sm-margin-left-17{margin-left:17px;}
    .layout-sm-margin-left-18{margin-left:18px;}
    .layout-sm-margin-left-19{margin-left:19px;}
    .layout-sm-margin-left-20{margin-left:20px;}
    .layout-sm-margin-left-21{margin-left:21px;}
    .layout-sm-margin-left-22{margin-left:22px;}
    .layout-sm-margin-left-23{margin-left:23px;}
    .layout-sm-margin-left-24{margin-left:24px;}
    .layout-sm-margin-left-25{margin-left:25px;}
    .layout-sm-margin-left-26{margin-left:26px;}
    .layout-sm-margin-left-27{margin-left:27px;}
    .layout-sm-margin-left-28{margin-left:28px;}
    .layout-sm-margin-left-29{margin-left:29px;}
    .layout-sm-margin-left-30{margin-left:30px;}
    .layout-sm-margin-left-31{margin-left:31px;}
    .layout-sm-margin-left-32{margin-left:32px;}
    .layout-sm-margin-left-33{margin-left:33px;}
    .layout-sm-margin-left-34{margin-left:34px;}
    .layout-sm-margin-left-35{margin-left:35px;}
    .layout-sm-margin-left-36{margin-left:36px;}
    .layout-sm-margin-left-37{margin-left:37px;}
    .layout-sm-margin-left-38{margin-left:38px;}
    .layout-sm-margin-left-39{margin-left:39px;}
    .layout-sm-margin-left-40{margin-left:40px;}
    .layout-sm-margin-left-41{margin-left:41px;}
    .layout-sm-margin-left-42{margin-left:42px;}
    .layout-sm-margin-left-43{margin-left:43px;}
    .layout-sm-margin-left-44{margin-left:44px;}
    .layout-sm-margin-left-45{margin-left:45px;}
    .layout-sm-margin-left-46{margin-left:46px;}
    .layout-sm-margin-left-47{margin-left:47px;}
    .layout-sm-margin-left-48{margin-left:48px;}
    .layout-sm-margin-left-49{margin-left:49px;}
    .layout-sm-margin-left-50{margin-left:50px;}
    .layout-sm-margin-left-51{margin-left:51px;}
    .layout-sm-margin-left-52{margin-left:52px;}
    .layout-sm-margin-left-53{margin-left:53px;}
    .layout-sm-margin-left-54{margin-left:54px;}
    .layout-sm-margin-left-55{margin-left:55px;}
    .layout-sm-margin-left-56{margin-left:56px;}
    .layout-sm-margin-left-57{margin-left:57px;}
    .layout-sm-margin-left-58{margin-left:58px;}
    .layout-sm-margin-left-59{margin-left:59px;}
    .layout-sm-margin-left-60{margin-left:60px;}
     
    /**
     * 布局内边距
     */
    .layout-sm-padding-top-1{padding-top:1px;}
    .layout-sm-padding-top-2{padding-top:2px;}
    .layout-sm-padding-top-3{padding-top:3px;}
    .layout-sm-padding-top-4{padding-top:4px;}
    .layout-sm-padding-top-5{padding-top:5px;}
    .layout-sm-padding-top-6{padding-top:6px;}
    .layout-sm-padding-top-7{padding-top:7px;}
    .layout-sm-padding-top-8{padding-top:8px;}
    .layout-sm-padding-top-9{padding-top:9px;}
    .layout-sm-padding-top-10{padding-top:10px;}
    .layout-sm-padding-top-11{padding-top:11px;}
    .layout-sm-padding-top-12{padding-top:12px;}
    .layout-sm-padding-top-13{padding-top:13px;}
    .layout-sm-padding-top-14{padding-top:14px;}
    .layout-sm-padding-top-15{padding-top:15px;}
    .layout-sm-padding-top-16{padding-top:16px;}
    .layout-sm-padding-top-17{padding-top:17px;}
    .layout-sm-padding-top-18{padding-top:18px;}
    .layout-sm-padding-top-19{padding-top:19px;}
    .layout-sm-padding-top-20{padding-top:20px;}
    .layout-sm-padding-top-21{padding-top:21px;}
    .layout-sm-padding-top-22{padding-top:22px;}
    .layout-sm-padding-top-23{padding-top:23px;}
    .layout-sm-padding-top-24{padding-top:24px;}
    .layout-sm-padding-top-25{padding-top:25px;}
    .layout-sm-padding-top-26{padding-top:26px;}
    .layout-sm-padding-top-27{padding-top:27px;}
    .layout-sm-padding-top-28{padding-top:28px;}
    .layout-sm-padding-top-29{padding-top:29px;}
    .layout-sm-padding-top-30{padding-top:30px;}
    .layout-sm-padding-top-31{padding-top:31px;}
    .layout-sm-padding-top-32{padding-top:32px;}
    .layout-sm-padding-top-33{padding-top:33px;}
    .layout-sm-padding-top-34{padding-top:34px;}
    .layout-sm-padding-top-35{padding-top:35px;}
    .layout-sm-padding-top-36{padding-top:36px;}
    .layout-sm-padding-top-37{padding-top:37px;}
    .layout-sm-padding-top-38{padding-top:38px;}
    .layout-sm-padding-top-39{padding-top:39px;}
    .layout-sm-padding-top-40{padding-top:40px;}
    .layout-sm-padding-top-41{padding-top:41px;}
    .layout-sm-padding-top-42{padding-top:42px;}
    .layout-sm-padding-top-43{padding-top:43px;}
    .layout-sm-padding-top-44{padding-top:44px;}
    .layout-sm-padding-top-45{padding-top:45px;}
    .layout-sm-padding-top-46{padding-top:46px;}
    .layout-sm-padding-top-47{padding-top:47px;}
    .layout-sm-padding-top-48{padding-top:48px;}
    .layout-sm-padding-top-49{padding-top:49px;}
    .layout-sm-padding-top-50{padding-top:50px;}
    .layout-sm-padding-top-51{padding-top:51px;}
    .layout-sm-padding-top-52{padding-top:52px;}
    .layout-sm-padding-top-53{padding-top:53px;}
    .layout-sm-padding-top-54{padding-top:54px;}
    .layout-sm-padding-top-55{padding-top:55px;}
    .layout-sm-padding-top-56{padding-top:56px;}
    .layout-sm-padding-top-57{padding-top:57px;}
    .layout-sm-padding-top-58{padding-top:58px;}
    .layout-sm-padding-top-59{padding-top:59px;}
    .layout-sm-padding-top-60{padding-top:60px;}
    
    .layout-sm-padding-right-1{padding-right:1px;}
    .layout-sm-padding-right-2{padding-right:2px;}
    .layout-sm-padding-right-3{padding-right:3px;}
    .layout-sm-padding-right-4{padding-right:4px;}
    .layout-sm-padding-right-5{padding-right:5px;}
    .layout-sm-padding-right-6{padding-right:6px;}
    .layout-sm-padding-right-7{padding-right:7px;}
    .layout-sm-padding-right-8{padding-right:8px;}
    .layout-sm-padding-right-9{padding-right:9px;}
    .layout-sm-padding-right-10{padding-right:10px;}
    .layout-sm-padding-right-11{padding-right:11px;}
    .layout-sm-padding-right-12{padding-right:12px;}
    .layout-sm-padding-right-13{padding-right:13px;}
    .layout-sm-padding-right-14{padding-right:14px;}
    .layout-sm-padding-right-15{padding-right:15px;}
    .layout-sm-padding-right-16{padding-right:16px;}
    .layout-sm-padding-right-17{padding-right:17px;}
    .layout-sm-padding-right-18{padding-right:18px;}
    .layout-sm-padding-right-19{padding-right:19px;}
    .layout-sm-padding-right-20{padding-right:20px;}
    .layout-sm-padding-right-21{padding-right:21px;}
    .layout-sm-padding-right-22{padding-right:22px;}
    .layout-sm-padding-right-23{padding-right:23px;}
    .layout-sm-padding-right-24{padding-right:24px;}
    .layout-sm-padding-right-25{padding-right:25px;}
    .layout-sm-padding-right-26{padding-right:26px;}
    .layout-sm-padding-right-27{padding-right:27px;}
    .layout-sm-padding-right-28{padding-right:28px;}
    .layout-sm-padding-right-29{padding-right:29px;}
    .layout-sm-padding-right-30{padding-right:30px;}
    .layout-sm-padding-right-31{padding-right:31px;}
    .layout-sm-padding-right-32{padding-right:32px;}
    .layout-sm-padding-right-33{padding-right:33px;}
    .layout-sm-padding-right-34{padding-right:34px;}
    .layout-sm-padding-right-35{padding-right:35px;}
    .layout-sm-padding-right-36{padding-right:36px;}
    .layout-sm-padding-right-37{padding-right:37px;}
    .layout-sm-padding-right-38{padding-right:38px;}
    .layout-sm-padding-right-39{padding-right:39px;}
    .layout-sm-padding-right-40{padding-right:40px;}
    .layout-sm-padding-right-41{padding-right:41px;}
    .layout-sm-padding-right-42{padding-right:42px;}
    .layout-sm-padding-right-43{padding-right:43px;}
    .layout-sm-padding-right-44{padding-right:44px;}
    .layout-sm-padding-right-45{padding-right:45px;}
    .layout-sm-padding-right-46{padding-right:46px;}
    .layout-sm-padding-right-47{padding-right:47px;}
    .layout-sm-padding-right-48{padding-right:48px;}
    .layout-sm-padding-right-49{padding-right:49px;}
    .layout-sm-padding-right-50{padding-right:50px;}
    .layout-sm-padding-right-51{padding-right:51px;}
    .layout-sm-padding-right-52{padding-right:52px;}
    .layout-sm-padding-right-53{padding-right:53px;}
    .layout-sm-padding-right-54{padding-right:54px;}
    .layout-sm-padding-right-55{padding-right:55px;}
    .layout-sm-padding-right-56{padding-right:56px;}
    .layout-sm-padding-right-57{padding-right:57px;}
    .layout-sm-padding-right-58{padding-right:58px;}
    .layout-sm-padding-right-59{padding-right:59px;}
    .layout-sm-padding-right-60{padding-right:60px;}
    
    .layout-sm-padding-bottom-1{padding-bottom:1px;}
    .layout-sm-padding-bottom-2{padding-bottom:2px;}
    .layout-sm-padding-bottom-3{padding-bottom:3px;}
    .layout-sm-padding-bottom-4{padding-bottom:4px;}
    .layout-sm-padding-bottom-5{padding-bottom:5px;}
    .layout-sm-padding-bottom-6{padding-bottom:6px;}
    .layout-sm-padding-bottom-7{padding-bottom:7px;}
    .layout-sm-padding-bottom-8{padding-bottom:8px;}
    .layout-sm-padding-bottom-9{padding-bottom:9px;}
    .layout-sm-padding-bottom-10{padding-bottom:10px;}
    .layout-sm-padding-bottom-11{padding-bottom:11px;}
    .layout-sm-padding-bottom-12{padding-bottom:12px;}
    .layout-sm-padding-bottom-13{padding-bottom:13px;}
    .layout-sm-padding-bottom-14{padding-bottom:14px;}
    .layout-sm-padding-bottom-15{padding-bottom:15px;}
    .layout-sm-padding-bottom-16{padding-bottom:16px;}
    .layout-sm-padding-bottom-17{padding-bottom:17px;}
    .layout-sm-padding-bottom-18{padding-bottom:18px;}
    .layout-sm-padding-bottom-19{padding-bottom:19px;}
    .layout-sm-padding-bottom-20{padding-bottom:20px;}
    .layout-sm-padding-bottom-21{padding-bottom:21px;}
    .layout-sm-padding-bottom-22{padding-bottom:22px;}
    .layout-sm-padding-bottom-23{padding-bottom:23px;}
    .layout-sm-padding-bottom-24{padding-bottom:24px;}
    .layout-sm-padding-bottom-25{padding-bottom:25px;}
    .layout-sm-padding-bottom-26{padding-bottom:26px;}
    .layout-sm-padding-bottom-27{padding-bottom:27px;}
    .layout-sm-padding-bottom-28{padding-bottom:28px;}
    .layout-sm-padding-bottom-29{padding-bottom:29px;}
    .layout-sm-padding-bottom-30{padding-bottom:30px;}
    .layout-sm-padding-bottom-31{padding-bottom:31px;}
    .layout-sm-padding-bottom-32{padding-bottom:32px;}
    .layout-sm-padding-bottom-33{padding-bottom:33px;}
    .layout-sm-padding-bottom-34{padding-bottom:34px;}
    .layout-sm-padding-bottom-35{padding-bottom:35px;}
    .layout-sm-padding-bottom-36{padding-bottom:36px;}
    .layout-sm-padding-bottom-37{padding-bottom:37px;}
    .layout-sm-padding-bottom-38{padding-bottom:38px;}
    .layout-sm-padding-bottom-39{padding-bottom:39px;}
    .layout-sm-padding-bottom-40{padding-bottom:40px;}
    .layout-sm-padding-bottom-41{padding-bottom:41px;}
    .layout-sm-padding-bottom-42{padding-bottom:42px;}
    .layout-sm-padding-bottom-43{padding-bottom:43px;}
    .layout-sm-padding-bottom-44{padding-bottom:44px;}
    .layout-sm-padding-bottom-45{padding-bottom:45px;}
    .layout-sm-padding-bottom-46{padding-bottom:46px;}
    .layout-sm-padding-bottom-47{padding-bottom:47px;}
    .layout-sm-padding-bottom-48{padding-bottom:48px;}
    .layout-sm-padding-bottom-49{padding-bottom:49px;}
    .layout-sm-padding-bottom-50{padding-bottom:50px;}
    .layout-sm-padding-bottom-51{padding-bottom:51px;}
    .layout-sm-padding-bottom-52{padding-bottom:52px;}
    .layout-sm-padding-bottom-53{padding-bottom:53px;}
    .layout-sm-padding-bottom-54{padding-bottom:54px;}
    .layout-sm-padding-bottom-55{padding-bottom:55px;}
    .layout-sm-padding-bottom-56{padding-bottom:56px;}
    .layout-sm-padding-bottom-57{padding-bottom:57px;}
    .layout-sm-padding-bottom-58{padding-bottom:58px;}
    .layout-sm-padding-bottom-59{padding-bottom:59px;}
    .layout-sm-padding-bottom-60{padding-bottom:60px;}
    
    .layout-sm-padding-left-1{padding-left:1px;}
    .layout-sm-padding-left-2{padding-left:2px;}
    .layout-sm-padding-left-3{padding-left:3px;}
    .layout-sm-padding-left-4{padding-left:4px;}
    .layout-sm-padding-left-5{padding-left:5px;}
    .layout-sm-padding-left-6{padding-left:6px;}
    .layout-sm-padding-left-7{padding-left:7px;}
    .layout-sm-padding-left-8{padding-left:8px;}
    .layout-sm-padding-left-9{padding-left:9px;}
    .layout-sm-padding-left-10{padding-left:10px;}
    .layout-sm-padding-left-11{padding-left:11px;}
    .layout-sm-padding-left-12{padding-left:12px;}
    .layout-sm-padding-left-13{padding-left:13px;}
    .layout-sm-padding-left-14{padding-left:14px;}
    .layout-sm-padding-left-15{padding-left:15px;}
    .layout-sm-padding-left-16{padding-left:16px;}
    .layout-sm-padding-left-17{padding-left:17px;}
    .layout-sm-padding-left-18{padding-left:18px;}
    .layout-sm-padding-left-19{padding-left:19px;}
    .layout-sm-padding-left-20{padding-left:20px;}
    .layout-sm-padding-left-21{padding-left:21px;}
    .layout-sm-padding-left-22{padding-left:22px;}
    .layout-sm-padding-left-23{padding-left:23px;}
    .layout-sm-padding-left-24{padding-left:24px;}
    .layout-sm-padding-left-25{padding-left:25px;}
    .layout-sm-padding-left-26{padding-left:26px;}
    .layout-sm-padding-left-27{padding-left:27px;}
    .layout-sm-padding-left-28{padding-left:28px;}
    .layout-sm-padding-left-29{padding-left:29px;}
    .layout-sm-padding-left-30{padding-left:30px;}
    .layout-sm-padding-left-31{padding-left:31px;}
    .layout-sm-padding-left-32{padding-left:32px;}
    .layout-sm-padding-left-33{padding-left:33px;}
    .layout-sm-padding-left-34{padding-left:34px;}
    .layout-sm-padding-left-35{padding-left:35px;}
    .layout-sm-padding-left-36{padding-left:36px;}
    .layout-sm-padding-left-37{padding-left:37px;}
    .layout-sm-padding-left-38{padding-left:38px;}
    .layout-sm-padding-left-39{padding-left:39px;}
    .layout-sm-padding-left-40{padding-left:40px;}
    .layout-sm-padding-left-41{padding-left:41px;}
    .layout-sm-padding-left-42{padding-left:42px;}
    .layout-sm-padding-left-43{padding-left:43px;}
    .layout-sm-padding-left-44{padding-left:44px;}
    .layout-sm-padding-left-45{padding-left:45px;}
    .layout-sm-padding-left-46{padding-left:46px;}
    .layout-sm-padding-left-47{padding-left:47px;}
    .layout-sm-padding-left-48{padding-left:48px;}
    .layout-sm-padding-left-49{padding-left:49px;}
    .layout-sm-padding-left-50{padding-left:50px;}
    .layout-sm-padding-left-51{padding-left:51px;}
    .layout-sm-padding-left-52{padding-left:52px;}
    .layout-sm-padding-left-53{padding-left:53px;}
    .layout-sm-padding-left-54{padding-left:54px;}
    .layout-sm-padding-left-55{padding-left:55px;}
    .layout-sm-padding-left-56{padding-left:56px;}
    .layout-sm-padding-left-57{padding-left:57px;}
    .layout-sm-padding-left-58{padding-left:58px;}
    .layout-sm-padding-left-59{padding-left:59px;}
    .layout-sm-padding-left-60{padding-left:60px;}
     
     
    /**
     * 模块基础样式
     */
    .module-content,
    .module-images-container,
    .module-slider-container,
    .module-video-container,
    .module-title-container,
    .module-goods-container,
    .module-article-container,
    .module-list-content,
    .module-list-content .item .module-item,
    .module-list-content .item .module-item .module-title,
    .module-list-content .item .module-item .module-price,
    .module-list-content .item .module-item .module-article-title {overflow: hidden;}
     
    /**
     * 模块类型样式 - 标题
     */
    .module-title-container .module-title-content{position:relative}
    .module-title-container .title-main{font-size:16px;font-weight:600;color:#666;display:inline-flex;align-items:center}
    .module-title-container .title-main-image .title-main-img{height:32rpx;width:auto;display:block}
    .module-title-container .title-main-icon{font-size:32rpx;line-height:1}
    .module-title-container .title-vice{color:#999;font-size:12px;margin-left:10px}
    .module-title-container .more-content{position:absolute;top:calc(50% - 8px);right:0;font-size:12px;}

    /**
     * 热区 / 公告 / 富文本
     */
    .module-hot-zone-container{position:relative}
    .module-hot-zone-media{position:relative;width:100%;overflow:hidden;line-height:0}
    .module-hot-zone-media > .wh-auto,
    .module-hot-zone-media > .image{display:block;width:100%}
    .module-hot-zone-media .module-hot-zone-item{position:absolute;box-sizing:border-box}
    .module-notice-content{display:flex;align-items:center;gap:16rpx;min-height:72rpx;padding:0 16rpx;box-sizing:border-box}
    .module-notice-content.notice-style-text{align-items:flex-start;padding-top:16rpx;padding-bottom:16rpx}
    .module-notice-content .notice-title{flex-shrink:0;font-weight:600;display:inline-flex;align-items:center}
    .module-notice-content .notice-title-image .notice-title-img{height:36rpx;width:auto;display:block}
    .module-notice-content .notice-title-icon{font-size:36rpx;line-height:1}
    .module-notice-content .notice-swiper{flex:1;min-width:0;height:56rpx}
    .module-notice-content .notice-item{height:56rpx;line-height:56rpx}
    .module-notice-content .notice-text{flex:1;min-width:0;line-height:1.6;white-space:pre-wrap;word-break:break-word}
    .module-notice-content .notice-more{flex-shrink:0;font-size:24rpx;color:#999}
    .module-rich-text-container{overflow:hidden}
     
    /**
     * 模块内容基础样式
     */
    .layout-content .image,
    .layout-content .video{display:block;max-width:100%;max-height:100%}
     
    /**
     * 不展示滚动导航点
     */
    .layout-content .slides-rolling-not-dot{margin-bottom:0px}
     
    /**
     * 媒体文件固定大小
     */
    .module-fixed-doc{display:block;overflow:hidden;position:relative;}
    .module-fixed-doc-ent-width{width:100% !important;}
    .module-fixed-doc-ent-height{height:auto !important;}
    .module-fixed-doc-ent-auto{margin:0 auto !important;}
    /* 铺满：只做裁剪语义，禁止无高度时写死 height:100%（小程序会变成 0） */
    .module-fixed-doc-ent-cover{width:100% !important;height:auto !important;}
    /* 有明确高度时用 class is-fixed-height（小程序禁止 [style*=] 属性选择器） */
    .module-fixed-doc.is-fixed-height .module-fixed-doc-ent-height,
    .module-fixed-doc.is-fixed-height .module-fixed-doc-ent-cover,
    .module-images-content.is-fixed-height .module-fixed-doc-ent-height,
    .module-images-content.is-fixed-height .module-fixed-doc-ent-cover,
    .module-video-content.is-fixed-height .module-fixed-doc-ent-height,
    .module-video-content.is-fixed-height .module-fixed-doc-ent-cover,
    .is-fixed-height .module-fixed-doc-ent-height,
    .is-fixed-height .module-fixed-doc-ent-cover{
        width:100% !important;
        height:100% !important;
    }
    /* 视频：有默认/明确高度时，覆盖全局 height:auto，避免看不见 */
    .module-video-content .video.module-fixed-doc-ent-height,
    .module-video-content .video.module-fixed-doc-ent-cover{
        width:100% !important;
        height:100% !important;
    }

    /**
     * 图片魔方（新网格，对齐 Web layout.css）
     */
    .layout-module-images-magic-cube-grid{
        display:grid;
        width:100%;
        aspect-ratio:1 / 1;
        min-height:320rpx;
        box-sizing:border-box;
    }
    .layout-module-images-magic-cube-grid .item-module-magic-cube{
        position:relative;
        min-width:0;
        min-height:0;
        overflow:hidden;
    }
    .layout-module-images-magic-cube-grid .item-module-magic-cube-link{
        position:absolute;
        left:0;
        top:0;
        right:0;
        bottom:0;
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
    }
    /* 格子有固定尺寸，图片拉满盒，由 mode 控制 contain/cover；覆盖全局 height:auto !important */
    .layout-module-images-magic-cube-grid .item-module-magic-cube-link .image{
        display:block;
        width:100% !important;
        height:100% !important;
        max-width:100%;
        max-height:100%;
    }
    .layout-module-images-magic-cube-grid .item-module-magic-cube-link .image.module-fixed-doc-ent-auto{
        margin:0 auto !important;
    }
    
    /**
     * 滚动列表
     */
    .layout-rolling-item{overflow:hidden}
</style>
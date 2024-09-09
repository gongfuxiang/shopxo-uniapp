<template>
    <view class="footer-nav flex-row jc-c align-c">
        <view class="footer-nav-content flex-row jc-c align-c w" :style="style_container">
            <ul class="flex-row jc-sa align-c w">
                <li v-for="(item, index) in nav_content" :key="index" class="flex-1 flex-col jc-c align-c gap-5" @mouseenter="is_hover = index" @mouseleave="is_hover = 0">
                    <view v-if="nav_style !== 2" class="img re">
                        <view class="img-item abs radius-xs animate-linear w" :class="is_hover != index ? 'active' : ''">
                            <!-- <image-empty v-model="item.img[0]" error-img-style="width:1.5rem;height:1.5rem;"></image-empty> -->
                        </view>
                        <view class="img-item abs radius-xs animate-linear w" :class="is_hover == index ? 'active' : ''">
                            <!-- <image-empty v-model="item.img_checked[0]" error-img-style="width:1.5rem;height:1.5rem;"></image-empty> -->
                        </view>
                    </view>
                    <span v-if="nav_style !== 1" class="animate-linear size-12 re z-i" :style="is_hover == index ? text_color_checked : default_text_color">{{ item.name }}</span>
                </li>
            </ul>
        </view>
    </view>
</template>

<script>
    import { common_styles_computer } from '@/common/js/common/common.js';
    export default {
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                style_container: '',
                style: '',
                nav_content: [],
                nav_style: 0,
                default_text_color: '',
                text_color_checked: '',
                is_hover: 0,
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const new_content = this.value.content || {};
                const new_style = this.value.style || {};
                this.nav_content = new_content.nav_content || [];
                this.nav_style = new_content.nav_style || 0;
                this.default_text_color = 'color:' + new_style.default_text_color || 'rgba(0, 0, 0, 1)';
                this.text_color_checked = 'color:' + new_style.text_color_checked || 'rgba(204, 204, 204, 1)';

                this.style_container = common_styles_computer(new_style.common_style);
                let footer_height = new_style.common_style.padding_top + new_style.common_style.padding_bottom + new_style.common_style.margin_top + new_style.common_style.margin_bottom + 50;
                if (footer_height >= 70) {
                    footer_height = footer_height;
                } else {
                    footer_height = 70;
                }
                // footer_nav_counter_store.padding_footer_computer(footer_height);
            },
        },
    };
</script>

<style></style>

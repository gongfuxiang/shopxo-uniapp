<template>
    <view class="footer-nav flex-row jc-c align-c" :class="showFooter ? 'br-2 br-primary' : ''" @click="footer_nav_event">
        <view class="footer-nav-content flex-row jc-c align-c w" :style="style_container">
            <ul class="flex-row jc-sa align-c w">
                <li v-for="(item, index) in nav_content" :key="index" class="flex-1 flex-col jc-c align-c gap-5" @mouseenter="is_hover = index" @mouseleave="is_hover = 0">
                    <view v-if="nav_style !== 2" class="img re">
                        <view class="img-item abs radius-xs animate-linear w" :class="is_hover != index ? 'active' : ''">
                            <image-empty v-model="item.img[0]" error-img-style="width:1.5rem;height:1.5rem;"></image-empty>
                        </view>
                        <view class="img-item abs radius-xs animate-linear w" :class="is_hover == index ? 'active' : ''">
                            <image-empty v-model="item.img_checked[0]" error-img-style="width:1.5rem;height:1.5rem;"></image-empty>
                        </view>
                    </view>
                    <span v-if="nav_style !== 1" class="animate-linear size-12 re z-i" :style="is_hover == index ? text_color_checked : default_text_color">{{ item.name }}</span>
                </li>
            </ul>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {};
        },
        methods: {},
    };
</script>

<style></style>

<template>
    <view class="ht">
        <componentDiyHeader></componentDiyHeader>
        <view v-if="value.diy_data.length > 0" :style="diy_content_style">
            <view v-for="(item, index) in value.diy_data" :key="index">
                <componentDiySearch></componentDiySearch>
                <componentDiyAuxiliaryLine v-if="item.key == 'row-line'" :value="item.com_data"></componentDiyAuxiliaryLine>
            </view>
        </view>
        <componentDiyFooter :value="value.footer.com_data" @footer-height="footer_height_computer"></componentDiyFooter>
    </view>
</template>

<script>
    import componentDiyHeader from '@/components/diy/header';
    import componentDiyFooter from '@/components/diy/footer';
    import componentDiySearch from '@/components/diy/search';
    import componentDiyAuxiliaryLine from '@/components/diy/auxiliary-line';
    export default {
        name: 'diy',
        props: {
            value: {
                type: Object,
                default: () => ({}),
            },
        },
        components: {
            componentDiyHeader,
            componentDiyFooter,
            componentDiySearch,
            componentDiyAuxiliaryLine,
        },
        data() {
            return {
                // 底部菜单导航高度计算
                padding_footer_computer: 140,
            };
        },

                computed: {
          diy_content_style(){
              return {
                  paddingBottom: this.padding_footer_computer
              }
          }
                },
        methods: {
            footer_height_computer(number) {
                this.padding_footer_computer = number * 2 + 'rpx';
            },
        },
    };
</script>

<style></style>

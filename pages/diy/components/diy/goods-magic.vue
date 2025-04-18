<template>
    <componentGoodsList ref="diy_goods_list" :propDiyIndex="propDiyIndex" :propKey="propKey" :propIndex="propIndex" :propValue="propValue" :propNewList="data_source_content_list" :propIsUseAuto="false" @goods_buy_event="goods_buy_event"></componentGoodsList>
</template>

<script>
    const app = getApp();
    import { isEmpty } from '@/common/js/common/common.js';
    import componentGoodsList from '@/pages/diy/components/diy/goods-list';
    export default {
        components: {
            componentGoodsList
        },
        props: {
            propValue: {
                type: Object,
                default: () => ({}),
            },
            propIsCommonStyle: {
                type: Boolean,
                default: true,
            },
            propKey: {
                type: [String, Number],
                default: '',
            },
            propDiyIndex: {
                type: Number,
                default: 0,
            },
            // 组件渲染的下标
            propIndex: {
                type: Number,
                default: 0,
            },
        },
        data() {
            return {
                data_source_content_list: [],
            };
        },
        watch: {
            propKey(val) {
                this.init();
            },
            propValue(new_value, old_value) {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let new_list = [];
                const new_form = this.propValue.content || null;
                if (Number(new_form.data_source_content.data_type) === 0 && !isEmpty(new_form.data_source_content.data_list)) {
                    const list = new_form.data_source_content?.data_list || [];
                    new_list = list.map((item) => ({
                        ...item.data,
                        title: !isEmpty(item.new_title) ? item.new_title : item.data.title,
                        new_cover: item.new_cover,
                    }));;
                } else if (!isEmpty(new_form.data_source_content.data_auto_list)) {
                    new_list = new_form.data_source_content.data_auto_list;
                }
                this.setData({
                    data_source_content_list: new_list,
                });
            },
            goods_buy_event(index, goods = {}, params = {}, back_data = null) {
                this.$emit('goods_buy_event', index, goods, params, back_data);
            },
            goods_cart_back_event(e) {
                if ((this.$refs.diy_goods_list || null) != null) {
                    this.$refs.diy_goods_list.goods_cart_back_event(e);
                }
            },
        }
    };
</script>

<style scoped lang="scss">
</style>

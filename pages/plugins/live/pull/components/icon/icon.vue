<template>
    <!-- #ifdef APP-NVUE -->
	<text :style="[{ color: color, 'font-size': iconSize, 'font-family': 'iconfont' }]" class="icon-font" :class="'cr-' + type" @tap="_onClick">{{ iconfontCode }}</text>
	<!-- #endif -->
    <!-- #ifndef APP-NVUE -->       
    <text :style="{ color: color, 'font-size': iconSize }" class="icon-font" :class="'icon-' + name + ' cr-' + type" @tap="_onClick"></text>
    <!-- #endif -->
</template>

<script>
    //#ifdef APP-NVUE
    import dataIconfont from '@/static/icon/iconfont.json';
    import iconUrl from '@/static/icon/iconfont.ttf';
    //#endif
    /**
     * Icons 图标
     * @description 用于展示 icons 图标
     * @property {Number} size 图标大小
     * @property {String} name 图标图案，参考示例
     * @property {String} color 图标颜色
     * @property {String} type 图标常规颜色 info / primary / error/ warning / success
     */
    export default {
        name: 'u-icon',
        props: {
            name: {
                type: String,
                default: '',
            },
            type: {
                type: String,
                default: 'info',
            },
            size: {
                type: [Number, String],
                default: 32,
            },
            color: {
                type: String,
                default: '',
            }
        },
        computed: {
            //#region 获取图标大小
            iconSize() {
                return this.getVal(this.size);
            },
            //#ifdef APP-NVUE
            // appnvue页面做的特殊处理
            iconfontCode() {
                const code = this.dataIconfont.glyphs.find(v => v.font_class === this.name);
                if (code != null) {
                    return unescape(`%u${code.unicode}`);
                }
                return ''
            }
            //#endif
            //#endregion
        },
        //#ifdef APP-NVUE
        data() {
            return {
                dataIconfont: dataIconfont,
                iconUrl: iconUrl
            }
        },
        mounted() {
            const domModule = weex.requireModule("dom");
            domModule.addRule('fontFace', {
                'fontFamily': 'iconfont',
                'src': `url('${this.iconUrl}')`
            })
        },
        //#endif
        methods: {
            //#region 获取图标大小
            getVal(val) {
                const reg = /^[0-9]*$/g;
                return typeof val === 'number' || reg.test(val) ? val.toString() + 'rpx' : val;
            },
            //#endregion
            //#region 点击事件处理
            _onClick() {
                this.$emit('click');
            }
            //#endregion
        }
    }
</script>

<style lang="scss" scoped>
    /* #ifndef APP-NVUE */
    @import url('@/static/icon/iconfont.css');
        /* #ifndef MP-WEIXIN */
        @font-face {
            font-family: "iconfont";
            src: url('@/static/icon/iconfont.ttf');
        }
        /* #endif */
    /* #endif */
    .icon-font {
        /* #ifndef APP-NVUE */
    	font-family: 'iconfont' !important;
        /* #endif */
    	text-decoration: none;
    	text-align: center;
    }
</style>
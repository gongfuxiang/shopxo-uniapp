<template>
    <view :class="'wh-auto pr allSignList-' + propIndex + propKey" :style="'height:' + propDataHeight * propScale + 'px;'">
       <view v-for="(item, index) in new_list" :key="index" :data-id="item.id" :data-location-x="item.location.x" :data-location-y="item.location.y" :class="'sign-' + propIndex + propKey + ' main-content ' + get_animation_class(item.com_data)" :style="'left:' + get_percentage_count(item.location.x, item.com_data.data_follow, 'left') + ';top:' + get_percentage_count(item.location.y, item.com_data.data_follow, 'top') + ';width:' + get_percentage_count(item.com_data.com_width, item.com_data.data_follow, 'width', item.com_data.is_width_auto, item.com_data.max_width, item.key, item.is_enable) + ';height:' + get_percentage_count(item.com_data.com_height, item.com_data.data_follow, 'height', item.com_data.is_height_auto, item.com_data.max_height, item.key, item.is_enable) + ';z-index:' + (item.is_enable == '1' ? (new_list.length - 1 > 0 ? (new_list.length - 1) - index : 0) : -999)">
            <view v-if="item.is_enable == '1'" :class="'wh-auto ht-auto ' + get_animation_class(item.com_data)">
                <template v-if="item.key == 'text'">
                    <model-text :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propFieldList="propFieldList" :propSourceList="propSourceList" :propConfigLoop="propConfigLoop" :propIsCustom="propIsCustom" :propIsCustomGroup="propIsCustomGroup" :propCustomGroupFieldId="propCustomGroupFieldId" :propTitleParams="propShowData.data_name" @url_event="url_event"></model-text>
                </template>
                <template v-else-if="item.key == 'img'">
                    <model-image :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propFieldList="propFieldList" :propSourceList="propSourceList" :propConfigLoop="propConfigLoop" :propIsCustom="propIsCustom" :propIsCustomGroup="propIsCustomGroup" :propCustomGroupFieldId="propCustomGroupFieldId" :propImgParams="propShowData.data_logo" @url_event="url_event"></model-image>
                </template>
                <template v-else-if="item.key == 'auxiliary-line'">
                    <model-lines :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propFieldList="propFieldList" :propSourceList="propSourceList" :propConfigLoop="propConfigLoop" :propIsCustom="propIsCustom" :propIsCustomGroup="propIsCustomGroup" :propCustomGroupFieldId="propCustomGroupFieldId"></model-lines>
                </template>
                <template v-else-if="item.key == 'icon'">
                    <model-icon :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propFieldList="propFieldList" :propSourceList="propSourceList" :propConfigLoop="propConfigLoop" :propIsCustom="propIsCustom" :propIsCustomGroup="propIsCustomGroup" :propCustomGroupFieldId="propCustomGroupFieldId" @url_event="url_event"></model-icon>
                </template>
                <template v-else-if="item.key == 'panel'">
                    <model-panel :propKey="propKey" :propValue="item.com_data" :propScale="propScale" :propFieldList="propFieldList" :propSourceList="propSourceList" :propConfigLoop="propConfigLoop" :propIsCustom="propIsCustom" :propIsCustomGroup="propIsCustomGroup" :propCustomGroupFieldId="propCustomGroupFieldId" @url_event="url_event"></model-panel>
                </template>
            </view>    
        </view>
    </view>
</template>

<script>
import modelText from '@/pages/diy/components/diy/modules/custom/model-text.vue';
import modelLines from '@/pages/diy/components/diy/modules/custom/model-lines.vue';
import modelImage from '@/pages/diy/components/diy/modules/custom/model-image.vue';
import modelIcon from '@/pages/diy/components/diy/modules/custom/model-icon.vue';
import modelPanel from '@/pages/diy/components/diy/modules/custom/model-panel.vue';
import { location_compute, isEmpty } from '@/common/js/common/common.js';
export default {
    components: {
        modelText,
        modelLines,
        modelImage,
        modelIcon,
        modelPanel,
    },
    props: {
        propCustomList: {
            type: Array,
            default: () => {
                return [];
            },
            required: true,
        },
        propIndex: {
            type: Number,
            default: 0,
        },
        propSourceList: {
            type: Object,
            default: () => {
                return {};
            }
        },
        propDataHeight: {
            type: Number,
            default: 0,
        },
        propScale: {
            type: Number,
            default: 1,
        },
        propDataIndex: {
            type: Number,
            default: 1,
        },
        propDataSplitIndex: {
            type: Number,
            default: 1,
        },
        propIsCustom: {
            type: Boolean,
            default: false,
        },
        propIsCustomGroup: {
            type: Boolean,
            default: false
        },
        propShowData: {
            type: Object,
            default: () => ({
                data_key: 'id',
                data_name: 'name'
            }),
        },
        propKey: {
            type: [String, Number],
            default: '',
        },
        propCustomGroupFieldId: {
            type: String,
            default: ''
        },
        propFieldList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        propConfigLoop: {
            type: String,
            default: "1"
        }
    },
    data() {
        return {
            new_list: [],
            custom_width: 0,
        };
    },
    watch: {
        propKey(val) {
            // 初始化
            this.init(this.propCustomList);
        },
        propCustomList(val) {
            this.init(val);
        }
    },
    computed: {
        get_percentage_count() {
            return (num, data_follow, type, is_auto = '0', max_size = 0, key = '', is_enable = '0') => {
                // 检查类型是否为'left'或'top'，如果是，则根据跟随数据计算样式
                if (['left', 'top'].includes(type)) {
                    const { id = '', type: follow_type = 'left' } = data_follow || { id: '', type: 'left' };
                    // 如果id不为空且follow_type与type匹配，则返回原始值的字符串表示
                    if (id !== '' && follow_type === type) {
                        return `${num}px`;
                    }
                    // 如果条件不满足，则根据比例缩放num并返回
                    return `${num * this.propScale}px`;
                } else {
                    // 如果is_auto设置为'1'，则根据type和max_size计算自动样式
                    if (is_auto === '1') {
                        if (type === 'width' || type === 'height') {
                            if (typeof max_size === 'number' && max_size >= 0) {
                                const scaledMaxSize = max_size * this.propScale;
                                const autoStyle = 'auto;';
                                const maxSizeStyle = scaledMaxSize > 0 ? ` max-${type}: ${scaledMaxSize}px;` : '';
                                const whiteSpaceStyle = type === 'width' && scaledMaxSize <= 0 ? ' white-space:nowrap;' : '';
                                return `${ autoStyle }${ maxSizeStyle }${ whiteSpaceStyle }`;
                            } else {
                                return 'auto;';
                            }
                        }
                    } else {
                        // 如果隐藏了，返回宽高为空的值
                        if (is_enable == '1') {
                            // 微信小程序图片等比缩放对小数点后的内容支持的不是特别的好，需要取向上取整数
                            if (key == 'img' && ['width', 'height'].includes(type)) {
                                // 如果is_auto未设置或条件不满足，则根据比例缩放num并返回
                                return `${ Math.round(num * this.propScale) }px`;
                            } else {
                                // 如果is_auto未设置或条件不满足，则根据比例缩放num并返回
                                return `${num * this.propScale}px`;
                            }
                        } else {
                            return `0px`;
                        }
                        
                    }
                }
            };
        },
        get_animation_class() {
            return (data) => {
                const { type = 'none', number = 'infinite' } = data?.animation_style || {};
                if (type != 'none') {
                    return type + (number == 'infinite' ? `-${number}` : '');
                } else {
                    return '';
                }
            };
        }
    },
    mounted() {
        this.init(this.propCustomList);
    },
    methods: {
        async init(val) {
            // 如果为空就不进行渲染
            if (isEmpty(val)) {
                return;
            }
            await this.get_custom_width();
            this.set_new_list(val);
        },
        get_custom_width() {
            // 获取当前容器的宽度
            const query = uni.createSelectorQuery().in(this);
            query.select('.allSignList-' + this.propIndex + this.propKey)
                .boundingClientRect((res) => {
                    if (res) {
                       this.setData({
                            custom_width: res.width,
                       });
                    }
                })
                .exec();
        },
        async set_new_list(val) {
            // 第一次渲染先渲染全部数据
            this.setData({
                new_list: val
            });
            // 判断是否有跟随的数据
            const follow_list = val.filter(item => item.com_data.data_follow && item.com_data?.data_follow?.id !== '');
            if (follow_list.length > 0) {
                // 等待页面渲染完成之后再获取内容
                await this.$nextTick();
                // 第二次如果有跟随数据，更新对应数据的内容， 如果有超出容器范围的数据，限制其超出容器范围
                const query = uni.createSelectorQuery().in(this);
                query.selectAll('.sign-' + this.propIndex + this.propKey)
                    .boundingClientRect((rect) => {
                        if (rect) {
                            // 将返回的内容转成map对象，方便快速查找，节省性能
                            const idMap = new Map(rect.map(item => [item.dataset.id, item]));
                            // 历史数据拷贝，方便后续操作避免每次都更新数据，统一重新渲染
                            const val = JSON.parse(JSON.stringify(this.new_list));
                            val.forEach((item1) => {
                                const { data_follow } = item1.com_data;
                                const targetItem = idMap.get(data_follow?.id);
                                if (targetItem) {
                                    const text_item = item1.key == 'text' ? idMap.get((item1?.id || '')+ '') : undefined;
                                    if (data_follow?.type === 'left') {
                                        // 更新位置信息 
                                        const location_x = this.updateLocation(targetItem, data_follow, this.propScale, true);
                                        // 获取组件的宽度，如果是宽度自适应，则需要重新计算位置
                                        let item_width = item1.com_data.com_width;
                                        // 如果是宽度自适应,需要重新判断一下处理逻辑
                                        if (item1.com_data?.is_width_auto === '1' && text_item) {
                                            item_width = text_item.width;
                                        }
                                        // 根据容器信息更新位置信息
                                        item1.location.x = location_compute(item_width, location_x, this.custom_width);
                                    } else if (data_follow?.type === 'top') {
                                        // 更新位置信息 
                                        const location_y = this.updateLocation(targetItem, data_follow, this.propScale, false);
                                        // 获取组件的宽度，如果是宽度自适应，则需要重新计算位置
                                        let item_height = item1.com_data.com_height;
                                        // 如果是高度自适应,需要重新判断一下处理逻辑
                                        if (item1.com_data?.is_height_auto === '1' && text_item) {
                                            item_height = text_item.height;
                                        }
                                        // 根据容器信息更新位置信息
                                        item1.location.y = location_compute(item_height, location_y, this.propDataHeight * this.propScale);
                                    }
                                }
                            });
                            this.setData({
                                new_list: val
                            });
                        }
                    })
                    .exec();
            }
        },
        updateLocation(targetItem, data_follow, scale, isX) {
            try {
                const locationValueStr = targetItem.dataset[`location${isX ? 'X' : 'Y'}`];
                if (locationValueStr == null) {
                    return;
                }
                const locationValue = parseFloat(locationValueStr);
                if (isNaN(locationValue) || scale <= 0 || (isX ? targetItem.width < 0 : targetItem.height < 0)) return;

                return ((locationValue + (data_follow?.spacing || 0)) * scale) + (isX ? targetItem.width : targetItem.height);
            } catch (error) {
                console.error(`Error updating location ${isX ? 'X' : 'Y'}:`, error);
            }
        },
        url_event(e) {
            this.$emit('url_event', e, this.propDataIndex, this.propDataSplitIndex);
        }
    },
};
</script>

<style lang="scss" scoped>
.main-content {
    position: absolute;
    overflow: hidden;
}
</style>
<template> 
    <view class="flex-row align-s wh-auto ht-auto"> 
        <image class="comment-avatar" :src="propComment.user.avatar" mode="aspectFill"></image>
        <view class="comment-info flex-col jc-c" style="margin-left: 20rpx;" @tap="comment_reply">
            <view class="flex-row jc-sb">
                <text class="comment-user">{{ propComment.user.user_name_view }}</text>
                <view class="pr" style="margin-left: 20rpx;">
                    <!-- 直接实现下拉菜单 -->
                    <view ref="commentOption" class="comment-option" @tap.stop="toggle_dropdown">
                        <u-icon propName="ellipsis" propColor="#999" propSize="28rpx"></u-icon>
                    </view>
                    <!-- 下拉菜单 -->
                    <!-- #ifdef APP-NVUE -->
                    <view v-if="drop_down_visible && dropdownOptions && Array.isArray(dropdownOptions)" class="dropdown-menu" :style="dropdownMenuStyle" @tap.stop>
                    <!-- #endif -->
                    <!-- #ifndef APP-NVUE -->
                    <view v-if="drop_down_visible && dropdownOptions && Array.isArray(dropdownOptions)" class="dropdown-menu" @tap.stop>
                    <!-- #endif -->
                        <view v-for="(item, index) in dropdownOptions.filter(item => (propComment.is_can_delete == 1 && item.type == 'delete') || (propComment.is_can_report == 1 && item.type == 'report'))" :key="index" class="dropdown-item" :data-value="item" @tap.stop="handle_dropdown_item_click">
                            <text style="font-size: 28rpx;color: #666;">{{ item.label }}</text>
                        </view>
                    </view>
                </view> 
            </view>
            <text v-if="!isEmpty(propComment.reply_comments_text)" class="comment-reply-text">{{ propComment.reply_comments_text}}</text>
            <text class="comment-text">{{ propComment.content }}</text>
            <!-- <view class="comment-images flex-row align-c gap-5"> -->
            <template v-if="!isEmpty(propComment.images)">
                <image :src="propComment.images" :data-image="propComment.images" @tap="upload_show_event" mode="aspectFill" class="comment-images"></image>
            </template>
            <!-- </view> -->
            <view class="comment-operation flex-row align-c jc-sb">
                <view class="comment-operation-left flex-row align-c">
                    <text class="comment-time">{{ propComment.add_time }}</text>
                    <text class="comment-reply flex-row align-c gap-5" style="margin-left: 20rpx;">{{ propReplyContent || $t('common.reply') }}({{ propComment.comments_count }})</text>
                </view>
                <view class="comment-operation-right flex-row align-c" style="margin-left: 20rpx;" @tap.stop="comment_like">
                    <u-icon propName="givealike-o-fine" :propColor="propComment.is_give_thumbs == 0 ? '#000' : '#F4B73F'" propSize="28rpx"></u-icon>
                    <text class="comment-like-num" style="margin-left: 10rpx;">{{ propComment.give_thumbs_count || 0 }}</text>
                </view>
            </view>
            <slot name="sub-comment"></slot>
        </view>
    </view>
</template>

<script>
    const app = getApp();
    //#ifdef APP-NVUE
    import i18n from '@/locale/index.js';
    const dom = weex.requireModule('dom');
    // nvue页面在方法中使用时的处理
    import { initVueI18n } from '@dcloudio/uni-i18n';
    import indexNvue from '@/locale/index-nvue.js';
    const { t } = initVueI18n(indexNvue)
    //#endif
   import { isEmpty } from '@/common/js/common/common.js';
   export default {
        //#ifdef APP-NVUE
       i18n,
        //#endif
        props: {
            propComment: {
                type: Object,
                default: () => {
                   return {};
                },
            },
            propId: {
                type: [String, Number],
                default: '',
            },
            propReplyContent: {
                type: String,
                default: ''
            },
            // 控制下拉菜单显示状态
            propDropDownVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
           return {
                // 下拉菜单选项数据
                dropdownOptions: [],
                // 下拉菜单位置信息
                dropdownMenuTop: 0,
                dropdownMenuLeft: 0
            };
        },
        mounted() {
            this.init();
        },
        computed: {
            // 使用 computed 属性映射 props 状态
            drop_down_visible() {
               return this.propDropDownVisible;
            },
            // 下拉菜单样式
            dropdownMenuStyle() {
               return `top: ${this.dropdownMenuTop}px;`;
            }
        },
       methods: {
            isEmpty,
            init() {
                //#ifdef APP-NVUE
                this.dropdownOptions = [
                    { label: t('common_delete'), type: 'delete' },
                    { label: t('common_complaint'), type: 'report' }
                ]
                //#endif
                //#ifndef APP-NVUE
                this.dropdownOptions = [
                    { label: this.$t('common.del'), type: 'delete' },
                    { label: this.$t('common.complaint'), type: 'report' }
                ]
                //#endif
            },
            // 回复
            comment_reply(e) {
                this.$emit('comment_reply', this.propComment, e);
            },
            // 点赞
            comment_like(e) {
                if (!app.globalData.is_single_page_check()) {
                   return false;
                }
                var user= app.globalData.get_user_info(this, 'comment_like', e);
                if (user != false) {
                    this.$emit('comment_like', this.propId, e);
                }
                //#ifdef APP-NVUE
                e.stopPropagation();
                //#endif 
            },
            // 上传图片预览
            upload_show_event(e) {
                const image = e?.currentTarget?.dataset?.image || '';
                uni.previewImage({
                    current: 0,
                    urls: [image],
                });
            },
            // 切换下拉菜单
            toggle_dropdown(e) {
                // 获取 comment-option 的位置信息
                this.getDropdownPosition();
                
                // 通知父组件切换当前组件的下拉菜单状态
                this.$emit('toggle_dropdown', this.propId);
                
                e.stopPropagation();
            },
            
            // 获取下拉菜单位置
            getDropdownPosition() {
                try {
                    // #ifdef APP-NVUE
                    // nvue 环境使用 dom 模块的 getComponentRect 方法
                    const commentOptionEl = this.$refs.commentOption;
                    if (commentOptionEl) {
                        dom.getComponentRect(commentOptionEl, (res) => {
                            if (res && res.size) {
                                const { top, left, width } = res.size;
                                // 计算菜单位置：在触发元素下方，右侧对齐
                                this.dropdownMenuTop = top + 20;
                            }
                        });
                    }
                    // #endif
                } catch (error) {
                    console.error('获取下拉菜单位置失败:', error);
                }
            },
            
            // 处理下拉菜单项点击
            handle_dropdown_item_click(e) {
                if (!app.globalData.is_single_page_check()) {
                   e.stopPropagation();
                   return false;
                }
                var user = app.globalData.get_user_info(this, 'comment_like', e);
                if (user != false) {
                    const item = e.currentTarget.dataset.value || {};
                    this.$emit('dropdown_item_click', this.propId, item);
                }
                e.stopPropagation();
            }
        }
    }   
</script>

<style lang="scss" scoped>
.comment-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
}
.comment-info {
    flex: 1;
    gap: 6rpx;
}
.comment-user {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
}

.comment-text {
    font-size: 28rpx;
    color: #333333;
    line-height: 40rpx;
}

.comment-time {
    font-size: 28rpx;
    color: #999999;
    line-height: 34rpx;
}
.comment-reply {
    font-weight: 700;
    font-size: 24rpx;
    color: #666666;
    line-height: 34rpx;
}
.comment-like-num {
    font-size: 24rpx;
    color: #999999;
    line-height: 34rpx;
}
.comment-image {
    width: 50rpx;
    height: 50rpx;
}

/* 下拉菜单样式 */
.dropdown-menu {
    /* #ifndef APP-NVUE */
    position: absolute;
    right: 0;
    /* #endif */
    /* #ifdef APP-NVUE */
    position: fixed;
    right: 30rpx;
    /* #endif */
    background: #ffffff;
    border-radius: 8rpx;
    box-shadow: 0 6rpx 16rpx 0 rgba(0, 0, 0, 0.15);
    border: 1rpx solid #e5e5e5;
    min-width: 160rpx;
    z-index: 9999;
    top: 100%;
    margin-top: 8rpx;
    padding: 10rpx 0;
}

.dropdown-item {
    padding: 20rpx 30rpx;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    /* #ifndef APP-NVUE */
    &:not(.dropdown-item-divided):active {
        background-color: #f5f5f5;
    }
    
    &.dropdown-item-divided:not(:first-child)::before {
        content: '';
        position: absolute;
        top: 0;
        left: 30rpx;
        right: 30rpx;
        height: 1rpx;
        background-color: #f0f0f0;
    }
    /* #endif */
    
    &:first-child {
        border-radius: 8rpx 8rpx 0 0;
    }
    
    &:last-child {
        border-radius: 0 0 8rpx 8rpx;
    }
    
    &:first-child:last-child {
        border-radius: 8rpx;
    }
}
.comment-reply-text {
    color: #ccc;
    font-size: 28rpx;
    padding: 0 10rpx;
}
.comment-operation {
    margin-top: 10rpx;
}
.comment-images {
    width: 80rpx;
    height: 80rpx;
}
</style>
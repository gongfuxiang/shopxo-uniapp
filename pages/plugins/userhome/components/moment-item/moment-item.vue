<template>
    <view :class="'bg-white border-radius-main padding-main' + (propSpacingMb ? ' spacing-mb' : '')">
        <view v-if="propShowUser" class="flex-row align-c" :data-value="item.user_home_url || ('/pages/plugins/userhome/home/home?id=' + item.user_id)" @tap="url_event">
            <image class="avatar circle" :src="(item.user && item.user.avatar) || ''" mode="aspectFill"></image>
            <view class="flex-1 flex-width padding-left-main">
                <view class="fw-b">{{ (item.user && item.user.user_name_view) || '' }}</view>
            </view>
        </view>
        <view class="margin-top-sm">
            <view :data-value="item.url || ''" @tap="detail_event">
                <view class="content-text">{{ item.content }}</view>
                <view v-if="(item.topic_list || []).length > 0" class="margin-top-xs">
                    <text v-for="(topic, ti) in item.topic_list" :key="ti" class="cr-main margin-right-sm text-size-sm">#{{ topic.name }}</text>
                </view>
            </view>
            <view v-if="(item.images || []).length > 0" class="moment-images margin-top-sm">
                <view v-for="(img, ii) in item.images" :key="ii" class="moment-img-item radius" :data-index="ii" @tap.stop="preview_event">
                    <image class="moment-img" :src="img" mode="aspectFill"></image>
                </view>
            </view>
            <view v-if="item.video_url" class="margin-top-sm" @tap.stop="">
                <video class="moment-video radius" :src="item.video_url" controls object-fit="cover"></video>
            </view>
        </view>
        <view class="flex-row align-c margin-top-sm text-size-sm cr-grey-9 flex-wrap action-row">
            <!-- 与 PC 一致：仅审核通过展示点赞/评论/浏览；待审仍可编辑删除 -->
            <view v-if="propShowLike && item.show_like == 1" class="action-item margin-right-xl" :class="item.is_like == 1 ? 'cr-main' : ''" @tap.stop="like_event">
                <iconfont :name="item.is_like == 1 ? 'icon-givealike' : 'icon-givealike-o'" size="28rpx" :color="item.is_like == 1 ? theme_color : '#999'" propClass="va-m"></iconfont>
                <text v-if="item.like_count > 0" class="margin-left-xs va-m">{{ item.like_count }}</text>
            </view>
            <view v-if="propShowComment && item.show_comment == 1" class="action-item margin-right-xl" :class="compose_open ? 'cr-main' : ''" @tap.stop="comment_toggle_event">
                <iconfont name="icon-message-o" size="28rpx" :color="compose_open ? theme_color : '#999'" propClass="va-m"></iconfont>
                <text v-if="comment_count > 0" class="margin-left-xs va-m">{{ comment_count }}</text>
            </view>
            <view v-if="propEnableDetail && item.url" class="action-item margin-right-xl" @tap.stop="detail_event">
                <iconfont name="icon-detail" size="28rpx" color="#999" propClass="va-m"></iconfont>
            </view>
            <view v-if="propShowOwner && item.operate_data && item.operate_data.is_edit == 1" class="action-item margin-right-xl" @tap.stop="edit_event">
                <iconfont name="icon-edit" size="28rpx" color="#999" propClass="va-m"></iconfont>
            </view>
            <view v-if="propShowOwner && item.operate_data && item.operate_data.is_delete == 1" class="action-item margin-right-xl" @tap.stop="delete_event">
                <iconfont name="icon-delete" size="28rpx" color="#E22C08" propClass="va-m"></iconfont>
            </view>
            <view v-if="propShowAccess && item.show_access == 1" class="action-item margin-right-xl">
                <iconfont name="icon-eye" size="28rpx" color="#999" propClass="va-m"></iconfont>
                <text v-if="item.access_count > 0" class="margin-left-xs va-m">{{ item.access_count }}</text>
            </view>
            <view v-if="item.show_share == 1 && item.audit_status == 2" class="action-item margin-right-xl" @tap.stop="share_event">
                <iconfont name="icon-share" size="28rpx" color="#999" propClass="va-m"></iconfont>
            </view>
            <!-- 审核文案放图标后；已拒绝整块可点看原因 -->
            <view v-if="item.audit_status != 2 && item.audit_status_name" class="action-item reject-status margin-right-xl cr-yellow" @tap.stop="audit_reject_tip_event">
                <text class="reject-status-text">{{ item.audit_status_name }}</text>
                <text v-if="item.audit_status == 3" class="reject-tip-icon">!</text>
            </view>
            <text class="margin-left-auto">{{ item.add_time_text || item.add_time }}</text>
        </view>

        <view v-if="show_comment_panel" :class="has_comment_list ? 'comment-box margin-top-sm' : ''" @tap.stop="">
            <component-moment-comment
                ref="comment"
                :propMomentId="item.id"
                :propList="item.comment_preview || []"
                :propHasMore="item.comment_more || 0"
                :propCommentCount="comment_count"
                :propEnableLike="propShowLike"
                :propPopupMode="true"
                :propComposeOpen="compose_open"
                @compose-change="compose_change_event"
                @count-change="count_change_event"
            ></component-moment-comment>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentMomentComment from '@/pages/plugins/userhome/components/moment-comment/moment-comment';
    export default {
        components: {
            componentMomentComment,
        },
        props: {
            propItem: { type: Object, default: () => ({}) },
            propShowUser: { type: Boolean, default: true },
            propShowLike: { type: Boolean, default: true },
            propShowComment: { type: Boolean, default: true },
            propShowAccess: { type: Boolean, default: true },
            propShowOwner: { type: Boolean, default: false },
            propEnableDetail: { type: Boolean, default: true },
            propShowCommentPreview: { type: Boolean, default: true },
            propSpacingMb: { type: Boolean, default: true },
        },
        // 组件数据
        data() {
            return {
                theme_color: app.globalData.get_theme_color(),
                compose_open: false,
                comment_count: 0,
            };
        },
        watch: {
            // 切换动态时重置评论态
            'propItem.id': {
                immediate: true,
                handler() {
                    this.compose_open = false;
                    this.comment_count = parseInt((this.propItem && this.propItem.comment_count) || 0) || 0;
                },
            },
            // 同步评论数
            'propItem.comment_count'(val) {
                this.comment_count = parseInt(val || 0) || 0;
            },
        },
        computed: {
            // 当前动态数据
            item() {
                return this.propItem || {};
            },
            // 是否展示评论区
            show_comment_panel() {
                return this.propShowCommentPreview && this.propShowComment && this.item.show_comment == 1;
            },
            // 是否有评论列表/更多
            has_comment_list() {
                var preview = this.item.comment_preview || [];
                return preview.length > 0 || !!this.item.comment_more || this.comment_count > 0;
            },
        },
        methods: {
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 查看详情
            detail_event() {
                // url 由后台按终端生成，前端直接使用
                if (!this.propEnableDetail || !this.item.url) {
                    return;
                }
                app.globalData.url_event({ currentTarget: { dataset: { value: this.item.url } } });
            },
            // 预览图片
            preview_event(e) {
                var index = parseInt(e.currentTarget.dataset.index || 0);
                var urls = this.item.images || [];
                if (!urls.length) {
                    return;
                }
                uni.previewImage({ current: urls[index] || urls[0], urls: urls });
            },
            // 点赞
            like_event() {
                this.$emit('like', this.item);
            },
            // 编辑（待审/驳回）
            edit_event() {
                this.$emit('edit', this.item);
            },
            // 删除
            delete_event() {
                this.$emit('delete', this.item);
            },
            // 分享
            share_event() {
                this.$emit('share', this.item);
            },
            // 已拒绝：点状态文案或叹号查看原因
            audit_reject_tip_event() {
                if (!this.item || this.item.audit_status != 3) {
                    return;
                }
                var reason = this.item.audit_reject_reason || '';
                if (!reason) {
                    return;
                }
                uni.showModal({
                    title: this.item.audit_status_name || '',
                    content: reason,
                    showCancel: false,
                });
            },
            // 切换评论
            comment_toggle_event() {
                if (this.compose_open) {
                    this.compose_open = false;
                    return;
                }
                var user = app.globalData.get_user_info(this, 'comment_toggle_event');
                if (user == false) {
                    return;
                }
                this.compose_open = true;
            },
            // 评论框状态
            compose_change_event(open) {
                this.compose_open = !!open;
            },
            // 评论数变更
            count_change_event(count) {
                this.comment_count = parseInt(count || 0) || 0;
                this.$emit('comment-count', { item: this.item, count: this.comment_count });
            },
        },
    };
</script>
<style scoped>
    .avatar {
        width: 72rpx;
        height: 72rpx;
        flex-shrink: 0;
    }
    .content-text {
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;
    }
    .moment-images {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10rpx;
    }
    .moment-img-item {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        overflow: hidden;
    }
    .moment-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .moment-video {
        width: 100%;
        height: 360rpx;
    }
    .action-item {
        display: inline-flex;
        align-items: center;
    }
    .reject-status {
        align-items: center;
    }
    .reject-status-text,
    .reject-tip-icon {
        line-height: 28rpx;
        vertical-align: middle;
    }
    .reject-tip-icon {
        width: 28rpx;
        height: 28rpx;
        margin-left: 8rpx;
        border-radius: 50%;
        border: 2rpx solid #f0ad4e;
        color: #f0ad4e;
        font-size: 20rpx;
        font-weight: 700;
        text-align: center;
        box-sizing: border-box;
    }
    .comment-box {
        padding-top: 12rpx;
    }
</style>

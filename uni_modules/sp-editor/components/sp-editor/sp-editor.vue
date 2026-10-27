<template>
    <view class="wrapper">
        <view class="editor-wrapper" :class="tools.length > 8 ? 'two-row' : 'one-row'">
            <editor id="editor" class="ql-container" show-img-size show-img-toolbar show-img-resize :placeholder="placeholder" :read-only="readOnly" @statuschange="onStatusChange" @ready="onEditorReady" @input="onEditorInput"></editor>
        </view>
        <PickerColor ref="colorPicker" :color="{ r: 0, g: 0, b: 0, a: 1 }" @confirm="confirmColor"></PickerColor>
        <view class="toolbar" @tap="format">
            <!-- 字体加粗 -->
            <view v-if="tools.indexOf('bold') !== -1" :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
            <!-- 斜体 -->
            <view v-if="tools.indexOf('italic') !== -1" :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
            <!-- 下划线 -->
            <view v-if="tools.indexOf('underline') !== -1" :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>
            <!-- 字体删除线 -->
            <view v-if="tools.indexOf('strike') !== -1" :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian" data-name="strike"></view>
            <!-- #ifndef MP-BAIDU -->
            <!-- 左对齐 -->
            <view v-if="tools.indexOf('left') !== -1" :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align" data-value="left"></view>
            <!-- #endif -->
            <!-- 居中对齐 -->
            <view v-if="tools.indexOf('center') !== -1" :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi" data-name="align" data-value="center"></view>
            <!-- 右对齐 -->
            <view v-if="tools.indexOf('right') !== -1" :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align" data-value="right"></view>
            <!-- #ifndef MP-BAIDU -->
            <view v-if="tools.indexOf('fontSize') !== -1" :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize" data-name="fontSize" data-value="24px"></view>
            <!-- #endif -->
            <view v-if="tools.indexOf('color') !== -1" :style="{ color: textColor }" class="iconfont icon-text_color" data-name="color" :data-value="textColor"></view>
            <view v-if="tools.indexOf('fontbgcolor') !== -1" :style="{ color: backgroundColor }" class="iconfont icon-fontbgcolor" data-name="background-color" :data-value="backgroundColor"></view>
            <view v-if="tools.indexOf('ordered') !== -1" :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie" data-name="list" data-value="ordered"></view>
            <view v-if="tools.indexOf('bullet') !== -1" :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie" data-name="list" data-value="bullet"></view>

            <view v-if="tools.indexOf('images') !== -1" class="iconfont icon-charutupian" @tap="insertImage"></view>
            <view v-if="tools.indexOf('undo') !== -1" class="iconfont icon-undo" @tap="undo"></view>
            <view v-if="tools.indexOf('redo') !== -1" class="iconfont icon-redo" @tap="redo"></view>
        </view>
    </view>
</template>

<script>
    import PickerColor from './color-picker';
    export default {
        components: {
            PickerColor,
        },
        props: {
            placeholder: {
                type: String,
                default: '写点什么吧 ~',
            },
            // 是否只读
            readOnly: {
                type: Boolean,
                default: false,
            },
            // 最大字数限制，-1不限
            maxlength: {
                type: Number,
                default: -1,
            },
            // 初始模板
            templates: {
                type: String,
                default: '',
            },
            tools: {
                type: Array,
                default: () => {
                    return ['bold', 'color', 'underline', 'left', 'center', 'right', 'fontSize', 'images'];
                },
            },
        },
        data() {
            return {
                formats: {},
                textColor: '',
                backgroundColor: '',
                curColor: 'text',
            };
        },
        onLoad() {
            // #ifndef MP-BAIDU
            uni.loadFontFace({
                family: 'Pacifico',
                source: 'url("https://sungd.github.io/Pacifico.ttf")',
            });
            // #endif
        },
        methods: {
            onEditorReady() {
                // #ifdef MP-BAIDU
                this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
                this.bind_editor();
                // #endif

                // #ifdef APP-PLUS || MP-WEIXIN || H5
                this.bind_editor();
                uni.createSelectorQuery()
                    .in(this)
                    .select('#editor')
                    .context((res) => {
                        if (res && res.context) {
                            this.editorCtx = res.context;
                        }
                        this.bind_editor();
                    })
                    .exec();
                // #endif
            },
            bind_editor() {
                if (this._editor_inited) {
                    return;
                }
                const ctx = this.editorCtx && typeof this.editorCtx.setContents === 'function' ? this.editorCtx : this.h5_editor_ctx();
                if (!ctx) {
                    const times = this._editor_bind_times || 0;
                    if (times < 8) {
                        this._editor_bind_times = times + 1;
                        setTimeout(() => this.bind_editor(), 50);
                    }
                    return;
                }
                this.editorCtx = ctx;
                this._editor_inited = true;
                this.$emit('init', ctx);
                if (this.templates) {
                    this.preRender();
                }
            },
            h5_editor_ctx() {
                const root = this.$el;
                if (!root || typeof root.querySelector !== 'function') {
                    return null;
                }
                const quill = find_quill(root);
                const editor = root.querySelector('.ql-editor');
                if (!quill && !editor) {
                    return null;
                }
                return {
                    setContents({ html }) {
                        apply_editor_html(quill, editor, html);
                    },
                    getContents({ success, fail }) {
                        try {
                            const node = (quill && quill.root) || editor;
                            success && success({
                                html: (node && node.innerHTML) || '',
                                text: quill && typeof quill.getText === 'function' ? quill.getText() : ((node && (node.innerText || node.textContent)) || ''),
                            });
                        } catch (err) {
                            fail && fail(err);
                        }
                    },
                    format(name, value) {
                        quill && quill.format(name, value);
                    },
                    undo() {
                        quill && quill.history && quill.history.undo();
                    },
                    redo() {
                        quill && quill.history && quill.history.redo();
                    },
                    insertText(opt) {
                        quill && quill.insertText(Math.max(0, quill.getLength() - 1), (opt && opt.text) || '');
                    },
                    insertImage(opt) {
                        quill && quill.insertEmbed(Math.max(0, quill.getLength() - 1), 'image', opt && opt.src);
                    },
                };
            },
            preRender() {
                // 初始化富文本时自带的文字模板
                this.editorCtx.setContents({
                    html: this.templates,
                });
            },
            undo() {
                this.editorCtx.undo();
            },
            redo() {
                this.editorCtx.redo();
            },
            format(e) {
                let { name, value } = e.target.dataset;
                if (!name) return;
                // console.log('==== name :', name);
                switch (name) {
                    case 'color':
                    case 'background-color':
                        this.curColor = name;
                        this.showPicker();
                        break;
                    default:
                        this.editorCtx.format(name, value);
                        break;
                }
            },
            showPicker() {
                this.$refs.colorPicker.open();
            },
            confirmColor(e) {
                switch (this.curColor) {
                    case 'color':
                        this.textColor = e.hex;
                        this.editorCtx.format('color', e.hex);
                        break;
                    case 'background-color':
                        this.backgroundColor = e.hex;
                        this.editorCtx.format('background-color', e.hex);
                        break;
                }
                // 建议在更改颜色时，插入一个空以重置颜色区块，否则可能会导致颜色切换失效
                this.editorCtx.insertText({ text: '' });
            },
            onStatusChange(e) {
                this.formats = e.detail;
                // console.log('==== e :', e, this.textColor)
            },
            insertImage() {
                // #ifdef APP-PLUS || H5
                uni.chooseImage({
                    // count: 1, // 默认9
                    success: (res) => {
                        const { tempFiles } = res;
                        // 将文件和编辑器示例抛出，由开发者自行上传和插入图片
                        this.$emit('upinImage', tempFiles, this.editorCtx);
                    },
                    fail() {
                        uni.showToast({
                            title: '未授权访问相册权限，请授权后使用',
                            icon: 'none',
                        });
                    },
                });
                // #endif

                // #ifdef MP-WEIXIN
                // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
                uni.chooseMedia({
                    // count: 1, // 默认9
                    mediaType: ['image', 'video'],
                    sourceType: ['album', 'camera'],
                    success: (res) => {
                        // 同上chooseImage处理
                        const { tempFiles } = res;
                        this.$emit('upinImage', tempFiles, this.editorCtx);
                    },
                    fail() {
                        uni.showToast({
                            title: '未授权访问相册权限，请授权后使用',
                            icon: 'none',
                        });
                    },
                });
                // #endif
            },
            onEditorInput(e) {
                const detail = e && e.detail;
                if (detail && typeof detail === 'object' && (detail.html != null || detail.text != null)) {
                    this.emit_editor_content(detail.html || '', detail.text || '');
                    return;
                }
                // H5 的 editor 走的是原生 input，内容在可编辑节点上，此时 editorCtx 还没有
                const node = this.editor_root(e);
                if (node) {
                    this.emit_editor_content(node.innerHTML || '', node.innerText || node.textContent || '');
                    return;
                }
                if (!this.editorCtx || typeof this.editorCtx.getContents !== 'function') {
                    return;
                }
                this.editorCtx.getContents({
                    success: (res) => {
                        this.emit_editor_content((res && res.html) || '', (res && res.text) || '');
                    },
                });
            },
            editor_root(e) {
                const node = e && (e.target || e.currentTarget);
                if (!node || typeof node.closest !== 'function') {
                    return null;
                }
                return node.closest('[contenteditable="true"]') || node.closest('.ql-editor');
            },
            emit_editor_content(html, text) {
                let maxlength = parseInt(this.maxlength);
                let textStr = String(text || '').replace(/\s/g, '');
                if (textStr.length > maxlength && maxlength != -1) {
                    uni.showModal({
                        content: `超过${maxlength}字数啦~`,
                        confirmText: '确定',
                        showCancel: false,
                        success: () => {
                            this.$emit('overMax', { html, text });
                        },
                    });
                    return;
                }
                this.$emit('input', { html, text });
            },
        },
    };
    function find_quill(root) {
        if (!root) {
            return null;
        }
        if (root.__quill) {
            return root.__quill;
        }
        const nodes = root.querySelectorAll ? root.querySelectorAll('*') : [];
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].__quill) {
                return nodes[i].__quill;
            }
        }
        return null;
    }
    function apply_editor_html(quill, editor, html) {
        const value = html || '';
        if (quill && quill.clipboard && typeof quill.setContents === 'function') {
            try {
                let delta = null;
                try {
                    delta = quill.clipboard.convert(value);
                } catch (e) {
                    delta = quill.clipboard.convert({ html: value });
                }
                if (delta) {
                    quill.setContents(delta, 'silent');
                    return;
                }
            } catch (e) {}
        }
        const node = (quill && quill.root) || editor;
        if (!node) {
            return;
        }
        node.innerHTML = value || '<p><br></p>';
        if (node.classList) {
            const plain = value.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, '').replace(/\s/g, '');
            node.classList.toggle('ql-blank', !plain);
        }
    }
</script>

<style scoped>
    @import './editor-icon.css';

    .wrapper {
        height: 100%;
    }

    .iconfont {
        display: inline-block;
        padding: 16rpx 0;
        width: 12.5%;
        cursor: pointer;
        font-size: 20px;
        text-align: center;
    }

    .toolbar {
        box-sizing: border-box;
        border-top: 1px solid #e4e4e4;
        font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }

    .editor-wrapper {
        overflow: auto;
    }

    .editor-wrapper.one-row {
        height: calc(100% - 80rpx);
    }

    .editor-wrapper.two-row {
        height: calc(100% - 160rpx);
    }

    .ql-container {
        padding: 8rpx 16rpx;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        line-height: 1.5;
        overflow-y: auto !important;
    }

    ::v-deep .ql-editor.ql-blank::before {
        font-style: normal;
        color: #cccccc;
    }

    .ql-active {
        color: #66ccff;
    }
</style>

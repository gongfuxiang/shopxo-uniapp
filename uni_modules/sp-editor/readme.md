# sp-editor

## props参数

```
props: {
	placeholder: {
		type: String,
		default: '写点什么吧 ~'
	},
	// 是否只读
	readOnly: {
		type: Boolean,
		default: false
	},
	// 最大字数限制，-1不限
	maxlength: {
		type: Number,
		default: -1
	},
	// 初始模板
	templates: {
		type: String,
		default: ''
	}
}
```

## emit方法

```
<template>
	<sp-editor @input="input" @upinImage="upinImage"></sp-editor>
</template>

<script setup>
function input(e) {
	console.log('==== input :', e)
}

function upinImage(tempFiles, editorCtx) {
	// 使用 uniCloud.uploadFile 上传图片的示例方法（可适用多选上传）
	tempFiles.forEach(async (item) => {
		uni.showLoading({
			title: '上传中请稍后',
			mask: true
		})
		let upfile = await uniCloud.uploadFile({
			filePath: item.path,
			// 同名会导致报错 policy_does_not_allow_file_overwrite
			// cloudPath可由 想要存储的文件夹/文件名 拼接，若不拼文件夹名则默认存储在cloudstorage文件夹中
			cloudPath: `cloudstorage/${item.name}`,
			cloudPathAsRealPath: true
		})
		editorCtx.insertImage({
			src: upfile.fileID,
			width: '80%',
			success: function () {
				uni.hideLoading()
			}
		})
	})
}
</script>

```

## 注意事项
	1. 该组件在使用过程中推荐在外层套上个父盒子，并给父盒子高度，组件在封装时进行了高度计算，会自动撑满父盒子
	2. 如遇到在内置浏览器中发生无法拖动调节颜色板的问题，只需调出开发者调试面板，点击重置左上角选择dom的箭头后，便能调出模拟器手势光标，便可正常拖动了
<template>
	<text class="iconfont" :class="name" :style="[{color: color}]" @click="$emit('click', $event)"></text>
</template>

<script>
	export default {
		props: {
			name: String,
			color: String
		}
	}
</script>

<style scoped>
	@import url("./iconfont.css");

	.iconfont {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: inherit;
	}
</style>
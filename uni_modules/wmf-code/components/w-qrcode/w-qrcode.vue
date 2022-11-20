<template>
	<view @longtap.stop="longtap">
		<canvas 
			:width="info.destWidth" 
			:height="info.destHeight" 
			:canvas-id="item.id" 
			:id="item.id" 
			:style="{width:info.width,height: info.height}" 
			v-for="item in info.listCode" 
			:key="item.id" 
			@error="handleError"></canvas>
	</view>
</template>
 <!-- #ifdef  VUE3 -->
<script setup name="WQrcode">
	import {reactive, watch,onMounted,nextTick,getCurrentInstance ,defineExpose } from 'vue';
	import { QRCode, GetImg,GetPixelRatio,GetPx } from '@/uni_modules/wmf-code/js_sdk/index.js';
	import { getUUid, deepClone,platform } from '../../common/helper.js'
	//定义props
	const props = defineProps({
	    options:{
	    	type: Object,
	    	required: true,
	    	default: () =>{
	    	  	return {}
	    	}
	    }
	});
	const emits = defineEmits(['generate','press','error'])
	const opt = props.options;
	const that = getCurrentInstance();
	const SIZE = GetPx(opt.size);
	let info = reactive({
		destHeight: SIZE * GetPixelRatio() + 'px',
		destWidth: SIZE * GetPixelRatio() + 'px',
		width: SIZE + 'px',
		height: SIZE + 'px',
		listCode:[],
		id: getUUid(),  
	})
	onMounted(()=>{
		SpecialTreatment(opt);
		nextTick(()=>{
			generateCode(opt)
		})
	});
	watch(()=>props.options,(val)=>{
		SpecialTreatment(val);
		const SIZE_Dynamic = GetPx(val.size);
		info.destWidth= GetPixelRatio() * SIZE_Dynamic + 'px',
		info.destHeight= GetPixelRatio() * SIZE_Dynamic + 'px',
		info.width= SIZE_Dynamic + 'px',
		info.height= SIZE_Dynamic + 'px',
			setTimeout(()=>{
				generateCode(val)
		},50)
	},{ deep: true })
	const SpecialTreatment =(val)=> {//渲染多个canvas特殊处理
		let obj = deepClone(val);
		obj.id = info.id;
		info.listCode = [obj]
	};
	const generateCode = (val)=>{
		try{
			const parameter = {...val,source: platform(),id: info.id,ctx: that};
			QRCode(parameter,(res)=>{
			   	emits('generate',res)
			})
		}catch(err){console.warn(err)}
	};
	const GetCodeImg = async ()=> {
		try{
		   	return await GetImg({id: info.id,source: platform(),width: opt.width,height: opt.height,ctx: that});
		}catch(e){console.warn(e)}
	};
	// 长按事件
	const longtap = (e)=>{
		emits('press',e)
	}
	// canvas创建错误 触发
	const handleError = (e)=>{
		emits('error',e.detail)
	}
	defineExpose({
	    GetCodeImg
	})
</script>
<!-- #endif -->

<!-- #ifndef VUE3 -->
<script>
	import { QRCode, GetImg,GetPixelRatio,GetPx } from '@/uni_modules/wmf-code/js_sdk/index.js';
	import { getUUid, deepClone,platform } from '../../common/helper.js'
	export default {
		name: 'WQrcode',
		props:{
			options:{
				type: Object,
				required: true,
				default: () =>{
					return {
						
					}
				}
			}
		},
		data () {
			return {
				info:{
					destHeight: 0,
					destWidth: 0,
					width: 0,
					height: 0,
					listCode:[],
				},
				destHeight: 0,
				destWidth: 0,
				width: 0,
				height: 0,
				listCode:[],
				id: getUUid(),
			}
		},
		mounted() {
			this.info.height = this.info.width = GetPx(this.options.size) + 'px';
			this.info.destHeight = this.info.destWidth = GetPx(this.options.size) * GetPixelRatio() + 'px';
			this.SpecialTreatment(this.options)
			this.$nextTick(()=>{
				this.generateCode();
			})
		},
		watch: {
			options:{
				deep: true,
				handler (val) {
					this.info.height = this.info.width = GetPx(val.size) + 'px';
					this.info.destHeight = this.info.destWidth = GetPx(val.size) * GetPixelRatio() + 'px';
					this.SpecialTreatment(val)
					setTimeout(()=>{// h5平台动态改变canvas大小
						this.generateCode();
					},50)
				}
			}
		},
		methods: {
			longtap (e){// 长按事件
				this.$emit('press',e);
			},
			handleError (e) {//当发生错误时触发 error 事件，字节跳动小程序与飞书小程序不支持
				this.$emit('error',e.detail)
			},
			SpecialTreatment (val) {//微信小程序渲染多个canvas特殊处理
					let obj = deepClone(val);
					obj.id = this.id;
					this.info.listCode = [obj]
			},
			// 生成二维码
			generateCode () {
				try{
					const parameter = {...this.options,source: platform(),id: this.id,ctx: this};
					QRCode(parameter,(res)=>{
						this.$emit('generate',res)
					})
				}catch(err){console.warn(err)}
			},
			// 获取二维码图片
			async GetCodeImg (){
				try{
					return  await GetImg({id: this.id,source: platform(),width: this.options.size,height: this.options.size,ctx: this});
				}catch(e){console.warn(e)}
			}
		}
	}
</script>
<!-- #endif -->
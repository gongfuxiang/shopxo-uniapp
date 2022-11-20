<template>
	<view @longtap.stop="longtap">
		<canvas 
			:width="info.orient == 'vertical' ? info.destHeight : info.destWidth " 
			:height="info.orient == 'vertical' ? info.destWidth : info.destHeight" 
			:canvas-id="item.id" 
			:id="item.id" 
			:style="{width:info.orient == 'vertical' ? info.height : info.width,height: info.orient == 'vertical' ? info.width : info.height}" 
			v-for="item in info.listCode" 
			:key="item.id"
			@error="handleError"></canvas>
	</view>
</template>
 <!-- #ifdef  VUE3 -->
<script setup name="WBarcode">
	import { 
		reactive,
		watch,
		onMounted,
		nextTick,
		getCurrentInstance,
		defineExpose
	} from 'vue';
	import { 
		BarCode, 
		GetImg,
		GetPixelRatio,
		GetPx ,
	} from '../../js_sdk/index.js';
	import { 
		getUUid, 
		deepClone,
		platform,
	} from '../../common/helper.js'
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
	const HSize = opt.text ? opt.text.size || 40 +  opt.text.padding || 20 : 0;
	let info = reactive({
		id: getUUid(),
		destWidth: GetPixelRatio() * GetPx(opt.width) + 'px',
		destHeight: GetPixelRatio() * GetPx(opt.height + HSize) + 'px',
		width: GetPx(opt.width) + 'px',
		height: GetPx(opt.height + HSize) + 'px',
		orient: opt.orient || 'horizontal',
		listCode: []
	})
	onMounted(()=>{
		SpecialTreatment(opt);
		nextTick(()=>{
			generateCode(opt)
		})
	});
	watch(()=>props.options,(val)=>{
		SpecialTreatment(val);
		const HSize = val.text ? val.text.size || 40 +  val.text.padding || 20 : 0;
		info.destWidth= GetPixelRatio() * GetPx(val.width) + 'px',
		info.destHeight= GetPixelRatio() * GetPx(val.height + HSize) + 'px',
		info.orient = val.orient || 'horizontal',
		info.width= GetPx(val.width) + 'px',
		info.height= GetPx(val.height + HSize) + 'px',
		setTimeout(()=>{
			generateCode(val)
		},100)
	},{ deep: true })
	const generateCode = (val)=> {
		try{
			const parameter = {...val,orient: info.orient,source: platform(),id: info.id,ctx: that};
			BarCode(parameter,(res)=>{
		  		emits('generate',res)
		  	})
		}catch(err){console.warn(err)}
	}
	const GetCodeImg = async ()=> {
		try{
		  	return await GetImg({id: info.id,source: platform(),width: opt.orient == 'vertical' ? opt.height : opt.width,height: opt.orient == 'vertical' ? opt.width : opt.height,ctx: that});
		}catch(e){console.warn(e)}
	};
	const SpecialTreatment = (val) => {//渲染多个canvas特殊处理
		let obj = deepClone(val);
		obj.id = info.id;
		info.listCode = [obj];
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
	import { BarCode, GetImg,GetPixelRatio,GetPx } from '../../js_sdk/index.js';
	import { getUUid, deepClone,platform } from '../../common/helper.js'
	export default {
		name: 'WBarcode',
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
					listCode: [],
					orient: 'horizontal'
				},
				id: getUUid()
			}
		},
		mounted() {
			const HSize = this.options.text ? ((this.options.text.size || 40) + ( this.options.text.padding || 20)) : 0;
			this.info.height = GetPx(this.options.height + HSize) + 'px';
			this.info.orient = this.options.orient || 'horizontal';
			this.info.width = GetPx(this.options.width) + 'px';
			this.info.destHeight = GetPx(this.options.height + HSize) * GetPixelRatio() + 'px';
			this.info.destWidth = GetPx(this.options.width) * GetPixelRatio() + 'px';
			this.SpecialTreatment(this.options)
			this.$nextTick(()=>{
				this.generateCode();
			})
		},
		watch: {
			options:{
				deep: true,
				handler (val) {
					const HSize = val.text ? val.text.size || 40 +  val.text.padding || 20 : 0;
					this.info.height = GetPx(val.height + HSize) + 'px';
					this.info.width = GetPx(val.width) + 'px';
					this.info.destHeight = GetPx(val.height + HSize) * GetPixelRatio() + 'px';
					this.info.destWidth = GetPx(val.width) * GetPixelRatio() + 'px';
					this.info.orient = val.orient || 'horizontal'
					this.SpecialTreatment(val)
					setTimeout(()=>{// h5平台动态改变canvas大小
						this.generateCode();
					},100)
				}
			}
		},
		methods: {
			longtap (e){
				this.$emit('press',e)
			},
			handleError (e) {//当发生错误时触发 error 事件，字节跳动小程序与飞书小程序不支持
				this.$emit('error',e.detail)
			},
			SpecialTreatment (val) {//微信小程序渲染多个canvas特殊处理
				let obj = deepClone(val);
				obj.id = this.id;
				this.info.listCode = [obj]
			},
			generateCode () {
				try{
					const parameter = {...this.options,orient: this.info.orient,source: platform(),id: this.id,ctx: this};
					BarCode(parameter,(res)=>{
						this.$emit('generate',res)
					})
				}catch(err){console.log(err)}
			},
			async GetCodeImg (){
				try{
					const pars = {
						id: this.id,
						source: platform(),
						width: this.options.orient == 'vertical' ? this.info.height : this.info.width,
						height: this.options.orient == 'vertical' ? this.info.width : this.info.height,
						ctx: this,
					}
					return  await GetImg(pars);
				}catch(e){console.warn(e)}
			}
		}
	}
</script>
<!-- #endif -->

export default {
	methods: {
		bannerConfigs(height = '300rpx') {
			return {
				padding: '30rpx',
				gridRows: 1,
				gridColumns: 1,
				gridRowsGap: '40rpx',
				gridColumnsGap: '24rpx',
				itemDirection: 'row',
				itemGap: '30rpx',
				itemAlign: 'center',
				headShow: true,
				headWidth: '100%',
				headHeight: height,
				headBorderRadius: '20rpx',
				textShow: false,
				textRows: 3,
				textRowsGap: '20rpx',
				textWidth: '100%',
				textHeight: '30rpx',
				textBorderRadius: '6rpx',
				...this.configs
			}
		},
		
		infoConfigs() {
			return {
				padding: '30rpx',
				gridRows: 1,
				gridColumns: 1,
				gridRowsGap: '50rpx',
				gridColumnsGap: '24rpx',
				itemDirection: 'row',
				itemGap: '30rpx',
				itemAlign: 'flex-start',
				headShow: true,
				headWidth: '150rpx',
				headHeight: '150rpx',
				headBorderRadius: '50%',
				textShow: true,
				textRows: 3,
				textRowsGap: '30rpx',
				textWidth: ['50%', '100%', '100%', '80%'],
				textHeight: ['40rpx', '24rpx', '24rpx', '24rpx'],
				textBorderRadius: '6rpx',
				...this.configs
			}
		},
		
		textConfigs() {
			return {
				padding: '30rpx',
				gridRows: 1,
				gridColumns: 1,
				gridRowsGap: '50rpx',
				gridColumnsGap: '24rpx',
				itemDirection: 'row',
				itemGap: '30rpx',
				itemAlign: 'flex-start',
				headShow: false,
				headWidth: '100rpx',
				headHeight: '100rpx',
				headBorderRadius: '50%',
				textShow: true,
				textRows: 4,
				textRowsGap: '30rpx',
				textWidth: ['50%', '100%', '100%', '80%'],
				textHeight: '30rpx',
				textBorderRadius: '6rpx',
				...this.configs
			}
		},
		
		menuConfigs(row = 2) {
			return {
				padding: '30rpx',
				gridRows: row,
				gridColumns: 5,
				gridRowsGap: '40rpx',
				gridColumnsGap: '40rpx',
				itemDirection: 'column',
				itemGap: '16rpx',
				itemAlign: 'center',
				headShow: true,
				headWidth: '100rpx',
				headHeight: '100rpx',
				headBorderRadius: '50%',
				textShow: true,
				textRows: 1,
				textRowsGap: '0rpx',
				textWidth: '100%',
				textHeight: '24rpx',
				textBorderRadius: '6rpx',
				...this.configs
			} 
		},
		
		listConfigs(row = 2) {
			return {
				padding: '30rpx',
				gridRows: row,
				gridColumns: 1,
				gridRowsGap: '50rpx',
				gridColumnsGap: '24rpx',
				itemDirection: 'row',
				itemGap: '30rpx',
				itemAlign: 'flex-start',
				headShow: true,
				headWidth: '200rpx',
				headHeight: '200rpx',
				headBorderRadius: '16rpx',
				textShow: true,
				textRows: 4,
				textRowsGap: '30rpx',
				textWidth: ['50%', '100%', '100%', '80%'],
				textHeight: ['38rpx', '24rpx', '24rpx', '24rpx'],
				textBorderRadius: '6rpx',
				...this.configs
			} 
		},
		
		waterfallConfigs(row = 2) {
			return {
				padding: '30rpx',
				gridRows: row,
				gridColumns: 2,
				gridRowsGap: '40rpx',
				gridColumnsGap: '24rpx',
				itemDirection: 'column',
				itemGap: '16rpx',
				itemAlign: 'center',
				headShow: true,
				headWidth: '100%',
				headHeight: '300rpx',
				headBorderRadius: '12rpx',
				textShow: true,
				textRows: 2,
				textRowsGap: '12rpx',
				textWidth: ['85%', '85%'],
				textHeight: ['30rpx', '20rpx'],
				textBorderRadius: '6rpx',
				...this.configs
			} 
		},
	}
}

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}
// 深度克隆
function deepClone(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj;
	if (typeof obj !== "object" && typeof obj !== 'function') {
		//原始类型直接返回
		return obj;
	}
	var o = isArray(obj) ? [] : {};
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
		}
	}
	return o;
}

function getUUid(len = 32, firstU = true, radix = null) {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	let uuid = [];
	radix = radix || chars.length;

	if (len) {
		// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
		for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		let r;
		// rfc4122标准要求返回的uuid中,某些位为固定的字符
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (let i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
	if (firstU) {
		uuid.shift();
		return 'u' + uuid.join('');
	} else {
		return uuid.join('');
	}
}
function platform () {
	let val = null;
	// #ifdef  VUE3
	val = 'VUE3'
	// #endif
	// #ifdef  APP-PLUS
	val = 'APP-PLUS'
	// #endif
	// #ifdef  APP-PLUS-NVUE || APP-NVUE
	val = 'NVUE'
	// #endif
	// #ifdef  H5
	val = 'H5'
	// #endif
	// #ifdef  MP-WEIXIN
	val = 'MP-WEIXIN'
	// #endif
	// #ifdef  MP-ALIPAY
	val = 'MP-ALIPAY'
	// #endif
	// #ifdef  MP-BAIDU
	val = 'MP-BAIDU'
	// #endif
	// #ifdef  MP-TOUTIAO
	val = 'MP-TOUTIAO'
	// #endif
	// #ifdef  MP-LARK
	val = 'MP-LARK'
	// #endif
	// #ifdef  MP-TOUTIAO
	val = 'MP-QQ'
	// #endif
	// #ifdef  MP-KUAISHOU
	val = 'MP-KUAISHOU'
	// #endif
	// #ifdef  MP-360
	val = 'MP-360'
	// #endif
	// #ifdef  QUICKAPP-WEBVIEW
	val = 'QUICKAPP-WEBVIEW'
	// #endif
	// #ifdef  QUICKAPP-WEBVIEW-UNION
	val = 'QUICKAPP-WEBVIEW-UNION'
	// #endif
	// #ifdef  QUICKAPP-WEBVIEW-HUAWEI
	val = 'QUICKAPP-WEBVIEW-HUAWEI'
	// #endif
	return val;

}
export {
	deepClone,
	getUUid,
	platform
};

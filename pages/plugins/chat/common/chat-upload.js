/**
 * 客服媒体上传：对齐 PC ChatUploadMediaFile / ChatUploadMediaFileChunked
 * - chunk_size = 2 * 1024 * 1024
 * - file.size > chunk_size：分片 + chat_chunk_*（全端）
 * - App 分片：plus.io file.slice + XHR FormData，不写临时文件
 */
import { get_request_api_url, isEmpty } from './chat-host.js';
import { CHAT_USER_API } from './chat-request.js';

/** 对齐 PC：var chunk_size = 2 * 1024 * 1024; if(file.size > chunk_size) */
export const CHAT_UPLOAD_CHUNK_SIZE = 2 * 1024 * 1024;
const RESUME_STORE_KEY = 'cache_chat_upload_resume';

const is_h5 = () => {
	// #ifdef H5
	return true;
	// #endif
	// #ifndef H5
	return false;
	// #endif
};

const is_app_plus = () => {
	// #ifdef APP-PLUS
	return typeof plus != 'undefined' && !!plus.io;
	// #endif
	// #ifndef APP-PLUS
	return false;
	// #endif
};

const get_xhr_ctor = () => {
	if (typeof XMLHttpRequest != 'undefined') {
		return XMLHttpRequest;
	}
	try {
		if (typeof plus != 'undefined' && plus.net && plus.net.XMLHttpRequest) {
			return plus.net.XMLHttpRequest;
		}
	} catch (e) {}
	return null;
};

const can_blob_chunk_xhr = () => {
	return typeof FormData != 'undefined' && !!get_xhr_ctor();
};

const yield_ui = () => new Promise((resolve) => setTimeout(resolve, 0));

/** App 分片：缓存 plus.io File，避免每片重复 resolve */
let plus_file_session_path = '';
let plus_file_session_file = null;
const clear_plus_file_session = () => {
	plus_file_session_path = '';
	plus_file_session_file = null;
};
const get_plus_file_for_upload = async (file_path) => {
	const key = String(file_path || '');
	if (plus_file_session_file && plus_file_session_path == key) {
		return plus_file_session_file;
	}
	const file = await resolve_plus_file(file_path);
	plus_file_session_path = key;
	plus_file_session_file = file;
	return file;
};

const now_ms = () => Date.now();

export const chat_upload_make_chunk_key = (prefix = 'up') => {
	return String(prefix || 'up') + now_ms() + Math.floor(Math.random() * 1000);
};

const read_resume_map = () => {
	try {
		const raw = uni.getStorageSync(RESUME_STORE_KEY);
		return raw && typeof raw == 'object' ? raw : {};
	} catch (e) {
		return {};
	}
};

const write_resume_map = (map) => {
	try {
		uni.setStorageSync(RESUME_STORE_KEY, map || {});
	} catch (e) {}
};

export const chat_upload_clear_resume = (chunk_key) => {
	const key = String(chunk_key || '');
	if (!key) {
		return;
	}
	const map = read_resume_map();
	if (map[key]) {
		delete map[key];
		write_resume_map(map);
	}
};

const save_resume = (state) => {
	if (!state || !state.chunk_key) {
		return;
	}
	const map = read_resume_map();
	map[state.chunk_key] = {
		chunk_key: state.chunk_key,
		file_path: state.file_path,
		file_name: state.file_name,
		file_size: state.file_size,
		data_type: state.data_type,
		next_index: parseInt(state.next_index || 0) || 0,
		chunk_total: parseInt(state.chunk_total || 0) || 0,
		voice: parseInt(state.voice || 0) == 1 ? 1 : 0,
		updated_at: now_ms(),
	};
	write_resume_map(map);
};

const load_resume = (chunk_key, file_path, file_size) => {
	const key = String(chunk_key || '');
	if (!key) {
		return null;
	}
	const row = read_resume_map()[key];
	if (!row) {
		return null;
	}
	if (String(row.file_path || '') != String(file_path || '')) {
		return null;
	}
	if (parseInt(row.file_size || 0) != parseInt(file_size || 0)) {
		return null;
	}
	// 超过 24h 的断点作废
	if (now_ms() - (parseInt(row.updated_at || 0) || 0) > 24 * 60 * 60 * 1000) {
		chat_upload_clear_resume(key);
		return null;
	}
	return row;
};

const collect_path_aliases = (file_path) => {
	const urls = [];
	const add = (u) => {
		if (u && urls.indexOf(u) < 0) {
			urls.push(u);
		}
	};
	add(file_path);
	const s = String(file_path || '');
	if (s.indexOf('file://') == 0) {
		add(s.replace(/^file:\/\//, ''));
	}
	// #ifdef APP-PLUS
	try {
		if (typeof plus != 'undefined' && plus.io && plus.io.convertLocalFileSystemURL) {
			const abs = plus.io.convertLocalFileSystemURL(s);
			add(abs);
			if (abs && String(abs).indexOf('file://') != 0 && String(abs).indexOf('/') == 0) {
				add('file://' + abs);
			}
		}
	} catch (e) {}
	// #endif
	return urls;
};

const get_plus_file_meta = (urls) => {
	return new Promise((resolve) => {
		// #ifndef APP-PLUS
		resolve({ size: 0, digest: '', path: urls[0] || '' });
		return;
		// #endif
		// #ifdef APP-PLUS
		if (typeof plus == 'undefined' || !plus.io) {
			resolve({ size: 0, digest: '', path: urls[0] || '' });
			return;
		}
		const try_url = (i) => {
			if (i >= urls.length) {
				resolve({ size: 0, digest: '', path: urls[0] || '' });
				return;
			}
			plus.io.resolveLocalFileSystemURL(urls[i], (entry) => {
				entry.file((file) => {
					const size = parseInt((file && file.size) || 0) || 0;
					if (size > 0) {
						resolve({ size, digest: '', path: urls[i] });
						return;
					}
					try_url(i + 1);
				}, () => try_url(i + 1));
			}, () => try_url(i + 1));
		};
		try_url(0);
		// #endif
	});
};

const get_android_file_size = (file_path) => {
	// #ifdef APP-PLUS
	try {
		const s = android_abs_path_from(file_path);
		const File = plus.android.importClass('java.io.File');
		const f = new File(s);
		if (f.exists()) {
			const n = parseInt(String(f.length()) || '0') || 0;
			if (n > 0) {
				return n;
			}
		}
	} catch (e) {}
	// #endif
	return 0;
};

const get_file_meta = (file_path) => {
	return new Promise((resolve) => {
		const urls = collect_path_aliases(file_path);
		const finish = (row) => {
			const android_size = get_android_file_size(row.path || file_path);
			const size = Math.max(parseInt(row.size || 0) || 0, android_size);
			resolve({
				size,
				digest: row.digest || '',
				path: row.path || file_path,
			});
		};
		const try_info = (i) => {
			if (i >= urls.length) {
				get_plus_file_meta(urls).then(finish);
				return;
			}
			uni.getFileInfo({
				filePath: urls[i],
				success: (res) => {
					const size = parseInt(res.size || 0) || 0;
					if (size > 0) {
						finish({ size, digest: res.digest || '', path: urls[i] });
						return;
					}
					try_info(i + 1);
				},
				fail: () => try_info(i + 1),
			});
		};
		try_info(0);
	});
};

const parse_upload_response = (raw) => {
	if (raw == null) {
		return null;
	}
	if (typeof raw == 'object') {
		return raw;
	}
	try {
		return JSON.parse(String(raw));
	} catch (e) {
		return null;
	}
};

/** 从上传接口响应里提取可读错误（后端没 msg 时也给 code / HTTP 状态） */
const upload_fail_message = (result, raw, status_code) => {
	if (result && typeof result == 'object') {
		const msg = String(result.msg || result.message || result.error_msg || '').trim();
		if (msg) {
			return msg;
		}
		if (result.code != null && result.code != 0) {
			return '上传失败(' + result.code + ')';
		}
	}
	if (status_code && status_code != 200) {
		return '上传失败(HTTP ' + status_code + ')';
	}
	if (raw != null && typeof raw == 'string') {
		const s = raw.trim();
		if (s && s.length <= 160 && s.indexOf('<') < 0) {
			return s;
		}
	}
	return '上传失败';
};

const build_upload_url = (user_type = 'work') => {
	// 咨询端：upload,index,chat（pluginscontrol=index&pluginsaction=upload）
	// 工作台 admin-app 走 index,seller,chat + business_action=upload，此处仅 user 端
	if (user_type == 'user') {
		return get_request_api_url(CHAT_USER_API.UPLOAD);
	}
	return get_request_api_url(CHAT_USER_API.UPLOAD);
};

const upload_api_log = (tag, payload) => {
	try {
		console.log('[chat_upload]', tag, payload);
	} catch (e) {}
};

const log_upload_request = (mode, url, formData, extra = {}) => {
	upload_api_log('→ request', {
		mode,
		url,
		formData,
		...extra,
	});
};

const log_upload_response = (mode, url, raw, extra = {}) => {
	const result = parse_upload_response(raw);
	upload_api_log('← response', {
		mode,
		url,
		raw,
		result,
		...extra,
	});
	return result;
};

const guess_file_name = (file_path, data_type, file_name) => {
	const raw = String(file_name || '').trim();
	if (raw && raw.indexOf('.') >= 0) {
		return raw;
	}
	const from_path = String(file_path || '').split('/').pop().split('\\').pop() || '';
	try {
		const decoded = decodeURIComponent(from_path);
		if (decoded && decoded.indexOf('.') >= 0 && decoded.indexOf('blob:') != 0) {
			return decoded;
		}
	} catch (e) {}
	if (from_path && from_path.indexOf('.') >= 0 && from_path.indexOf(':') < 0) {
		return from_path;
	}
	const map = {
		images: 'image.jpg',
		video: 'video.mp4',
		audio: 'audio.mp3',
		file: 'file.bin',
	};
	return map[data_type] || (raw || 'file.bin');
};

const base_form_data = (opts) => {
	const form = {
		business_control: 'index',
		business_action: 'upload',
		type: opts.data_type || 'file',
		user_type: opts.user_type || 'work',
		file_name: String(opts.file_name || ''),
	};
	if (parseInt(opts.voice || 0) == 1) {
		form.voice = '1';
	}
	return form;
};

/** 大文件上传超时（毫秒） */
const upload_timeout_ms = (file_size) => {
	const mb = (Number(file_size) || 0) / (1024 * 1024);
	if (mb <= 10) {
		return 60000;
	}
	if (mb <= 50) {
		return 120000;
	}
	return 300000;
};

/** 对齐 PC：Math.min(99, Math.floor((loaded / total) * 99)) */
const upload_progress_pct = (loaded, total) => {
	const t = Number(total || 0);
	if (!(t > 0)) {
		return 0;
	}
	return Math.min(99, Math.floor((Number(loaded || 0) / t) * 99));
};

/** 整文件上传（仅 ≤ chunk_size） */
const upload_whole_file = (file_path, opts, on_progress) => {
	return new Promise((resolve, reject) => {
		const formData = base_form_data(opts);
		const timeout = upload_timeout_ms(opts.file_size || 0);
		const upload_url = build_upload_url(opts.user_type || 'work');
		const urls = collect_path_aliases(file_path);
		const try_upload = (i) => {
			if (i >= urls.length) {
				reject(new Error('网络异常错误'));
				return;
			}
			log_upload_request('uploadFile', upload_url, formData, {
				filePath: urls[i],
				file_size: opts.file_size || 0,
			});
			const task = uni.uploadFile({
				url: upload_url,
				filePath: urls[i],
				name: 'file',
				timeout,
				formData,
				success: (res) => {
					const status_code = res ? res.statusCode : 0;
					const result = log_upload_response('uploadFile', upload_url, res.data, {
						statusCode: status_code,
						filePath: urls[i],
					});
					if (status_code && status_code != 200) {
						reject(new Error(upload_fail_message(result, res.data, status_code)));
						return;
					}
					if (!result || result.code != 0 || !result.data) {
						reject(new Error(upload_fail_message(result, res.data, status_code)));
						return;
					}
					if (typeof on_progress == 'function') {
						on_progress(100);
					}
					resolve(result);
				},
				fail: () => {
					upload_api_log('← response', {
						mode: 'uploadFile',
						url: upload_url,
						ok: false,
						filePath: urls[i],
						errMsg: 'uploadFile:fail',
					});
					try_upload(i + 1);
				},
			});
			if (task && typeof task.onProgressUpdate == 'function') {
				task.onProgressUpdate((e) => {
					let raw = Number(e.progress || 0);
					if (raw > 0 && raw <= 1) {
						raw = raw * 100;
					}
					const loaded = Math.floor((raw / 100) * (opts.file_size || 0));
					const p = upload_progress_pct(loaded, opts.file_size || 0);
					if (p > 0 && typeof on_progress == 'function') {
						on_progress(p);
					}
				});
			}
		};
		try_upload(0);
	});
};

/** H5 / App：Blob 分片 + FormData + XHR（对齐 PC，不写临时文件） */
const upload_blob_chunk_xhr = (blob, opts, chunk_meta, on_chunk_progress) => {
	return new Promise((resolve, reject) => {
		try {
			const fd = new FormData();
			const form = {
				...base_form_data(opts),
				chat_chunk_index: String(chunk_meta.index),
				chat_chunk_total: String(chunk_meta.total),
				chat_chunk_key: String(chunk_meta.key),
				file_name: String(opts.file_name || 'file.bin'),
				// 对齐 PC：必须是原文件总大小，不能用当前分片 blob.size
				file_size: String(opts.file_size || 0),
			};
			Object.keys(form).forEach((k) => {
				fd.append(k, form[k]);
			});
			// 对齐 PC：object.append('file', blob, file.name) 每片都用原文件名
			fd.append('file', blob, opts.file_name || 'file.bin');
			const upload_url = build_upload_url(opts.user_type || 'work');
			log_upload_request('xhr-chunk', upload_url, form, {
				chunk_index: chunk_meta.index,
				chunk_total: chunk_meta.total,
				chunk_size: blob && blob.size,
			});
			const XHR = get_xhr_ctor();
			if (!XHR) {
				reject(new Error('当前端不支持大文件分片'));
				return;
			}
			const xhr = new XHR();
			xhr.open('POST', upload_url);
			// 对齐 PC timeout: 60000
			xhr.timeout = 60000;
			xhr.onload = () => {
				const result = log_upload_response('xhr-chunk', upload_url, xhr.responseText, {
					chunk_index: chunk_meta.index,
					chunk_total: chunk_meta.total,
					status: xhr.status,
				});
				if (xhr.status && xhr.status != 200) {
					reject(new Error(upload_fail_message(result, xhr.responseText, xhr.status)));
					return;
				}
				if (!result || result.code != 0) {
					reject(new Error(upload_fail_message(result, xhr.responseText, xhr.status)));
					return;
				}
				resolve(result);
			};
			xhr.onerror = () => {
				upload_api_log('← response', {
					mode: 'xhr-chunk',
					url: upload_url,
					ok: false,
					chunk_index: chunk_meta.index,
					errMsg: 'xhr.onerror',
				});
				reject(new Error('网络异常错误'));
			};
			xhr.ontimeout = () => {
				upload_api_log('← response', {
					mode: 'xhr-chunk',
					url: upload_url,
					ok: false,
					chunk_index: chunk_meta.index,
					errMsg: 'xhr.ontimeout',
				});
				reject(new Error('上传超时'));
			};
			if (xhr.upload && typeof on_chunk_progress == 'function') {
				xhr.upload.onprogress = (e) => {
					if (!e.lengthComputable || e.total <= 0) {
						return;
					}
					on_chunk_progress(e.loaded, e.total);
				};
			}
			xhr.send(fd);
		} catch (e) {
			reject(e || new Error('上传失败'));
		}
	});
};

/** H5 blob: 路径整文件上传（uni.uploadFile 对 blob URL 不可靠） */
const upload_whole_blob_h5 = (blob, opts, on_progress) => {
	return new Promise((resolve, reject) => {
		try {
			const fd = new FormData();
			const form = base_form_data(opts);
			Object.keys(form).forEach((k) => {
				fd.append(k, form[k]);
			});
			fd.append('file', blob, opts.file_name || 'file.bin');
			const upload_url = build_upload_url(opts.user_type || 'work');
			log_upload_request('xhr-whole', upload_url, form, {
				file_size: blob && blob.size,
			});
			const XHR = get_xhr_ctor();
			if (!XHR) {
				reject(new Error('当前端不支持大文件分片'));
				return;
			}
			const xhr = new XHR();
			xhr.open('POST', upload_url);
			xhr.timeout = 60000;
			xhr.onload = () => {
				const result = log_upload_response('xhr-whole', upload_url, xhr.responseText, {
					status: xhr.status,
				});
				if (xhr.status && xhr.status != 200) {
					reject(new Error(upload_fail_message(result, xhr.responseText, xhr.status)));
					return;
				}
				if (!result || result.code != 0 || !result.data) {
					reject(new Error(upload_fail_message(result, xhr.responseText, xhr.status)));
					return;
				}
				if (typeof on_progress == 'function') {
					on_progress(100);
				}
				resolve(result);
			};
			xhr.onerror = () => {
				upload_api_log('← response', { mode: 'xhr-whole', url: upload_url, ok: false, errMsg: 'xhr.onerror' });
				reject(new Error('网络异常错误'));
			};
			xhr.ontimeout = () => {
				upload_api_log('← response', { mode: 'xhr-whole', url: upload_url, ok: false, errMsg: 'xhr.ontimeout' });
				reject(new Error('上传超时'));
			};
			if (xhr.upload && typeof on_progress == 'function') {
				xhr.upload.onprogress = (e) => {
					if (!e.lengthComputable || e.total <= 0) {
						return;
					}
					const p = upload_progress_pct(e.loaded, e.total);
					if (p > 0) {
						on_progress(p);
					}
				};
			}
			xhr.send(fd);
		} catch (e) {
			reject(e || new Error('上传失败'));
		}
	});
};

const fetch_path_as_blob = async (file_path) => {
	if (typeof fetch != 'function') {
		throw new Error('当前环境不支持分片上传');
	}
	const res = await fetch(file_path);
	if (!res) {
		throw new Error('读取本地文件失败');
	}
	if (!res.ok && String(file_path).indexOf('blob:') != 0) {
		throw new Error('读取本地文件失败');
	}
	return await res.blob();
};

const get_fs = () => {
	try {
		if (typeof uni.getFileSystemManager == 'function') {
			return uni.getFileSystemManager();
		}
	} catch (e) {}
	// #ifdef MP-WEIXIN
	try {
		if (typeof wx != 'undefined' && typeof wx.getFileSystemManager == 'function') {
			return wx.getFileSystemManager();
		}
	} catch (e) {}
	// #endif
	return null;
};

const get_temp_dir = () => {
	// #ifdef MP-WEIXIN
	try {
		if (typeof wx != 'undefined' && wx.env && wx.env.USER_DATA_PATH) {
			return wx.env.USER_DATA_PATH;
		}
	} catch (e) {}
	// #endif
	try {
		if (typeof uni.env != 'undefined' && uni.env && uni.env.USER_DATA_PATH) {
			return uni.env.USER_DATA_PATH;
		}
	} catch (e) {}
	// #ifdef APP-PLUS
	return '_doc';
	// #endif
	return '';
};

/** fs 按偏移读分片 → 写临时文件 → uploadFile（App/小程序首选） */
const upload_file_chunk_by_fs = (file_path, opts, chunk_meta, on_chunk_progress) => {
	return new Promise((resolve, reject) => {
		const fs = get_fs();
		const temp_dir = get_temp_dir();
		if (!fs || !temp_dir) {
			reject(new Error('当前端不支持大文件分片'));
			return;
		}
		const start = (chunk_meta.index - 1) * CHAT_UPLOAD_CHUNK_SIZE;
		const length = Math.min(CHAT_UPLOAD_CHUNK_SIZE, (opts.file_size || 0) - start);
		const name = chunk_temp_name(chunk_meta, opts.file_name);
		const temp_path = String(temp_dir).replace(/\/$/, '') + '/' + name;
		upload_api_log('chunk-fs-read', {
			index: chunk_meta.index,
			start,
			length,
			file_path,
		});
		fs.readFile({
			filePath: file_path,
			position: start,
			length,
			success: (read_res) => {
				upload_api_log('chunk-fs-read-ok', {
					index: chunk_meta.index,
					data_type: typeof read_res.data,
				});
				const write_opts = {
					filePath: temp_path,
					data: read_res.data,
					success: () => {
						upload_chunk_file(temp_path, opts, chunk_meta, length, on_chunk_progress, () => {
							try {
								fs.unlink({ filePath: temp_path });
							} catch (e) {}
						}).then(resolve, reject);
					},
					fail: (err) => {
						upload_api_log('chunk-fs-write-fail', { index: chunk_meta.index, err });
						reject(new Error('写入分片失败'));
					},
				};
				if (typeof read_res.data == 'string') {
					write_opts.encoding = 'binary';
				}
				fs.writeFile(write_opts);
			},
			fail: (err) => {
				upload_api_log('chunk-fs-read-fail', { index: chunk_meta.index, err });
				reject(new Error('读取分片失败'));
			},
		});
	});
};

const upload_file_chunk_fs_paths = (file_path) => {
	const paths = collect_path_aliases(file_path);
	// #ifdef APP-PLUS
	try {
		const raw = android_abs_path_from(file_path);
		if (raw && paths.indexOf(raw) < 0) {
			paths.push(raw);
		}
	} catch (e) {}
	// #endif
	return paths;
};

const upload_file_chunk_by_fs_try_paths = async (file_path, opts, chunk_meta, on_chunk_progress) => {
	const paths = upload_file_chunk_fs_paths(file_path);
	let last_err = null;
	for (let i = 0; i < paths.length; i++) {
		try {
			return await upload_file_chunk_by_fs(paths[i], opts, chunk_meta, on_chunk_progress);
		} catch (err) {
			last_err = err;
		}
	}
	throw last_err || new Error('读取分片失败');
};

const chunk_temp_name = (chunk_meta, file_name) => {
	const name_ext = String(file_name || '').match(/\.[a-z0-9]{1,8}$/i);
	const temp_ext = name_ext ? name_ext[0] : '';
	return 'chat_chunk_' + chunk_meta.key + '_' + chunk_meta.index + temp_ext;
};

const upload_chunk_file = (temp_path, opts, chunk_meta, length, on_chunk_progress, cleanup) => {
	return new Promise((resolve, reject) => {
		const formData = {
			...base_form_data(opts),
			chat_chunk_index: String(chunk_meta.index),
			chat_chunk_total: String(chunk_meta.total),
			chat_chunk_key: String(chunk_meta.key),
			file_name: String(opts.file_name || 'file.bin'),
			file_size: String(opts.file_size || 0),
		};
		const upload_url = build_upload_url(opts.user_type || 'work');
		const timeout = upload_timeout_ms(opts.file_size || 0);
		log_upload_request('uploadFile-chunk', upload_url, formData, {
			filePath: temp_path,
			chunk_size: length,
		});
		const task = uni.uploadFile({
			url: upload_url,
			filePath: temp_path,
			timeout,
			name: 'file',
			formData,
			success: (res) => {
				if (typeof cleanup == 'function') {
					cleanup();
				}
				const result = log_upload_response('uploadFile-chunk', upload_url, res.data, {
					statusCode: res.statusCode,
					filePath: temp_path,
					chunk_index: chunk_meta.index,
				});
				if (res.statusCode && res.statusCode != 200) {
					reject(new Error(upload_fail_message(result, res.data, res.statusCode)));
					return;
				}
				if (!result || result.code != 0) {
					reject(new Error(upload_fail_message(result, res.data, res.statusCode)));
					return;
				}
				resolve(result);
			},
			fail: () => {
				if (typeof cleanup == 'function') {
					cleanup();
				}
				upload_api_log('← response', {
					mode: 'uploadFile-chunk',
					url: upload_url,
					ok: false,
					filePath: temp_path,
					chunk_index: chunk_meta.index,
					errMsg: 'uploadFile:fail',
				});
				reject(new Error('网络异常错误'));
			},
		});
		if (task && typeof task.onProgressUpdate == 'function' && typeof on_chunk_progress == 'function') {
			task.onProgressUpdate((e) => {
				const loaded = Math.floor((Number(e.progress || 0) / 100) * length);
				on_chunk_progress(loaded, length);
			});
		}
	});
};

/** App：plus.io 读原文件 slice 后直接 XHR 上传分片 */
const resolve_plus_file = (file_path) => {
	return new Promise((resolve, reject) => {
		// #ifndef APP-PLUS
		reject(new Error('读取分片失败'));
		return;
		// #endif
		// #ifdef APP-PLUS
		if (!is_app_plus()) {
			reject(new Error('读取分片失败'));
			return;
		}
		const urls = collect_path_aliases(file_path);
		const try_url = (i) => {
			if (i >= urls.length) {
				reject(new Error('读取分片失败'));
				return;
			}
			plus.io.resolveLocalFileSystemURL(urls[i], (entry) => {
				entry.file((file) => {
					if (file && typeof file.slice == 'function') {
						resolve(file);
						return;
					}
					try_url(i + 1);
				}, () => try_url(i + 1));
			}, () => try_url(i + 1));
		};
		try_url(0);
		// #endif
	});
};

const android_abs_path_from = (file_path) => {
	let s = String(file_path || '');
	if (s.indexOf('file://') == 0) {
		s = s.slice(7);
	} else if (s.indexOf('_doc') == 0 || s.indexOf('_www') == 0) {
		try {
			const abs = plus.io.convertLocalFileSystemURL(s);
			s = String(abs || '');
			if (s.indexOf('file://') == 0) {
				s = s.slice(7);
			}
		} catch (e) {}
	}
	if (s && s.indexOf('/') != 0 && /^storage\//.test(s)) {
		s = '/' + s;
	}
	return s;
};

/** App：FileChannel.transferTo 按偏移拷分片（避免 raf.read / plus.io writer 异常） */
const upload_file_chunk_android_java = (file_path, opts, chunk_meta, on_chunk_progress) => {
	return new Promise((resolve, reject) => {
		// #ifndef APP-PLUS
		reject(new Error('当前端不支持大文件分片'));
		return;
		// #endif
		// #ifdef APP-PLUS
		let raf = null;
		let fos = null;
		let in_ch = null;
		let out_ch = null;
		const close_all = () => {
			try { if (in_ch) in_ch.close(); } catch (e) {}
			try { if (out_ch) out_ch.close(); } catch (e) {}
			try { if (raf) raf.close(); } catch (e) {}
			try { if (fos) fos.close(); } catch (e) {}
		};
		try {
			const start = (chunk_meta.index - 1) * CHAT_UPLOAD_CHUNK_SIZE;
			const length = Math.min(CHAT_UPLOAD_CHUNK_SIZE, (opts.file_size || 0) - start);
			const src_abs = android_abs_path_from(file_path);
			const name = chunk_temp_name(chunk_meta, opts.file_name);
			const dest_rel = '_doc/' + name;
			const dest_abs = android_abs_path_from(dest_rel);
			upload_api_log('chunk-java-begin', {
				index: chunk_meta.index,
				start,
				length,
				src_abs,
				dest_abs,
			});
			const File = plus.android.importClass('java.io.File');
			const RandomAccessFile = plus.android.importClass('java.io.RandomAccessFile');
			const FileOutputStream = plus.android.importClass('java.io.FileOutputStream');
			const src_file = new File(src_abs);
			if (!src_file.exists()) {
				upload_api_log('chunk-java-fail', {
					index: chunk_meta.index,
					msg: '源文件不存在',
					src_abs,
				});
				reject(new Error('读取分片失败'));
				return;
			}
			const dest_file = new File(dest_abs);
			const parent = dest_file.getParentFile();
			if (parent && !parent.exists()) {
				parent.mkdirs();
			}
			raf = new RandomAccessFile(src_file, 'r');
			plus.android.importClass(raf);
			in_ch = raf.getChannel();
			plus.android.importClass(in_ch);
			fos = new FileOutputStream(dest_file);
			plus.android.importClass(fos);
			out_ch = fos.getChannel();
			plus.android.importClass(out_ch);
			const transferred = parseInt(String(in_ch.transferTo(start, length, out_ch) || '0')) || 0;
			close_all();
			raf = null;
			fos = null;
			in_ch = null;
			out_ch = null;
			const dest_size = parseInt(String(dest_file.length()) || '0') || 0;
			if (!(transferred > 0) || !dest_file.exists() || dest_size <= 0) {
				upload_api_log('chunk-java-fail', {
					index: chunk_meta.index,
					msg: '写入分片失败',
					transferred,
					dest_size,
					dest_abs,
				});
				try { dest_file.delete(); } catch (e) {}
				reject(new Error('写入分片失败'));
				return;
			}
			upload_api_log('chunk-java-done', {
				index: chunk_meta.index,
				transferred,
				dest_size,
			});
			upload_chunk_file(dest_rel, opts, chunk_meta, length, on_chunk_progress, () => {
				try {
					dest_file.delete();
				} catch (e) {}
			}).then(resolve, reject);
		} catch (e) {
			close_all();
			upload_api_log('chunk-java-fail', {
				index: chunk_meta.index,
				msg: (e && e.message) || String(e),
			});
			reject(e || new Error('写入分片失败'));
		}
		// #endif
	});
};

const upload_file_chunk_plus_disk = (blob, opts, chunk_meta, length, on_chunk_progress) => {
	return new Promise((resolve, reject) => {
		// #ifndef APP-PLUS
		reject(new Error('当前端不支持大文件分片'));
		return;
		// #endif
		// #ifdef APP-PLUS
		if (!is_app_plus()) {
			reject(new Error('当前端不支持大文件分片'));
			return;
		}
		const name = chunk_temp_name(chunk_meta, opts.file_name);
		upload_api_log('chunk-disk-write', { index: chunk_meta.index, name, length });
		plus.io.resolveLocalFileSystemURL('_doc/', (dir) => {
			dir.getFile(name, { create: true, exclusive: false }, (fe) => {
				fe.createWriter((writer) => {
					writer.onerror = () => reject(new Error('写入分片失败'));
					writer.onwrite = () => {
						const temp_path = '_doc/' + name;
						upload_chunk_file(temp_path, opts, chunk_meta, length, on_chunk_progress, () => {
							try {
								fe.remove(() => {}, () => {});
							} catch (e) {}
						}).then(resolve, reject);
					};
					writer.write(blob);
				}, () => reject(new Error('写入分片失败')));
			}, () => reject(new Error('写入分片失败')));
		}, () => reject(new Error('写入分片失败')));
		// #endif
	});
};

const upload_file_chunk_plus = async (file_path, opts, chunk_meta, on_chunk_progress) => {
	const start = (chunk_meta.index - 1) * CHAT_UPLOAD_CHUNK_SIZE;
	const end = Math.min(start + CHAT_UPLOAD_CHUNK_SIZE, opts.file_size || 0);
	const length = end - start;
	upload_api_log('chunk-plus-begin', { index: chunk_meta.index, start, length });
	const file = await get_plus_file_for_upload(file_path);
	const blob = file.slice(start, end);
	upload_api_log('chunk-plus-slice', { index: chunk_meta.index, blob_size: blob && blob.size });
	// App 上 XHR+FormData 发 Blob 容易卡死，只用临时文件 + uploadFile
	return await upload_file_chunk_plus_disk(blob, opts, chunk_meta, length, on_chunk_progress);
};

/** 非 H5：读文件片段写临时文件再 uploadFile */
const upload_file_chunk_native = async (file_path, opts, chunk_meta, on_chunk_progress) => {
	// #ifdef APP-PLUS
	if (is_app_plus()) {
		try {
			return await upload_file_chunk_android_java(file_path, opts, chunk_meta, on_chunk_progress);
		} catch (err) {
			upload_api_log('chunk-java-fallback-fs', {
				index: chunk_meta.index,
				msg: err && err.message,
			});
		}
		const fs = get_fs();
		const temp_dir = get_temp_dir();
		if (fs && temp_dir) {
			try {
				return await upload_file_chunk_by_fs_try_paths(file_path, opts, chunk_meta, on_chunk_progress);
			} catch (err) {
				upload_api_log('chunk-fs-fail', {
					index: chunk_meta.index,
					msg: err && err.message,
				});
			}
		}
		return Promise.reject(new Error('分片上传失败'));
	}
	// #endif
	const fs_outer = get_fs();
	const temp_dir_outer = get_temp_dir();
	if (!fs_outer || !temp_dir_outer) {
		return Promise.reject(new Error('当前端不支持大文件分片'));
	}
	return upload_file_chunk_by_fs(file_path, opts, chunk_meta, on_chunk_progress);
};

/**
 * 上传聊天文件
 * - >2MB：对齐 PC 分片（全端）
 * - ≤2MB：整文件上传
 */
export const chat_upload_file = async (options = {}) => {
	const file_path = options.file_path || '';
	upload_api_log('start', {
		file_path,
		data_type: options.data_type || 'file',
		chunk_key: options.chunk_key || '',
	});
	clear_plus_file_session();
	try {
		if (isEmpty(file_path)) {
			throw new Error('附件无效');
		}
	const on_progress = typeof options.on_progress == 'function' ? options.on_progress : null;
	const check_alive = typeof options.check_alive == 'function' ? options.check_alive : () => true;
	const data_type = options.data_type || 'file';
	let file_name = guess_file_name(file_path, data_type, options.file_name);
	if (data_type == 'video' && !/\.mp4$/i.test(file_name)) {
		file_name = (String(file_name || '').replace(/\.[^.]+$/, '') || 'video') + '.mp4';
	}
	const voice = parseInt(options.voice || 0) == 1 ? 1 : 0;
	const user_type = options.user_type || 'work';
	const chunk_key = String(options.chunk_key || chat_upload_make_chunk_key());

	const meta = await get_file_meta(file_path);
	const upload_path = meta.path || file_path;
	let file_size = parseInt(meta.size || 0) || 0;
	// H5 部分路径 getFileInfo 失败时用 blob.size
	let whole_blob = null;
	if (!(file_size > 0) && is_h5()) {
		whole_blob = await fetch_path_as_blob(file_path);
		file_size = whole_blob.size || 0;
	}
	if (!(file_size > 0)) {
		throw new Error('无法获取文件大小');
	}
	upload_api_log('meta', {
		file_path: upload_path,
		file_size,
		file_size_mb: (file_size / (1024 * 1024)).toFixed(2),
		file_name,
		use_chunk: file_size > CHAT_UPLOAD_CHUNK_SIZE,
		chunk_total: file_size > CHAT_UPLOAD_CHUNK_SIZE ? Math.ceil(file_size / CHAT_UPLOAD_CHUNK_SIZE) : 1,
	});

	const opts = {
		file_path: upload_path,
		file_name,
		file_size,
		data_type,
		voice,
		user_type,
		chunk_key,
	};

	const upload_whole = async () => {
		if (is_h5() && String(file_path).indexOf('blob:') == 0) {
			if (!whole_blob) {
				whole_blob = await fetch_path_as_blob(file_path);
			}
			return await upload_whole_blob_h5(whole_blob, opts, on_progress);
		}
		return await upload_whole_file(upload_path, opts, on_progress);
	};

	const report_progress = (bytes) => {
		if (typeof on_progress != 'function' || !(file_size > 0)) {
			return;
		}
		on_progress(upload_progress_pct(bytes, file_size));
	};

	const upload_chunked = async () => {
		const chunk_total = Math.ceil(file_size / CHAT_UPLOAD_CHUNK_SIZE);
		upload_api_log('chunk-begin', { chunk_total, file_size, chunk_key });
		const resume = load_resume(chunk_key, upload_path, file_size);
		let start_index = resume ? Math.max(0, parseInt(resume.next_index || 0) || 0) : 0;
		if (start_index >= chunk_total) {
			start_index = 0;
		}
		if (start_index > 0) {
			report_progress(start_index * CHAT_UPLOAD_CHUNK_SIZE);
		}
		if (!whole_blob && is_h5()) {
			whole_blob = await fetch_path_as_blob(file_path);
		}
		let last_result = null;
		for (let i = start_index; i < chunk_total; i++) {
			if (!check_alive()) {
				throw new Error('页面已关闭');
			}
			if (i > start_index) {
				await yield_ui();
			}
			const start = i * CHAT_UPLOAD_CHUNK_SIZE;
			const end = Math.min(start + CHAT_UPLOAD_CHUNK_SIZE, file_size);
			const chunk_meta = {
				index: i + 1,
				total: chunk_total,
				key: chunk_key,
			};
			const on_chunk_progress = (loaded, total) => {
				const bytes = start + Math.min(Number(loaded || 0), Number(total || 0) || 0);
				report_progress(bytes);
			};
			report_progress(start);
			upload_api_log('chunk-upload', { index: chunk_meta.index, start, end });
			try {
				if (is_h5() && whole_blob) {
					const slice = whole_blob.slice(start, end);
					last_result = await upload_blob_chunk_xhr(slice, opts, chunk_meta, on_chunk_progress);
				} else {
					last_result = await upload_file_chunk_native(upload_path, opts, chunk_meta, on_chunk_progress);
				}
			} catch (err) {
				save_resume({
					...opts,
					next_index: i,
					chunk_total,
				});
				throw err;
			}
			if (i < chunk_total - 1) {
				if (!last_result || last_result.code != 0) {
					save_resume({
						...opts,
						next_index: i,
						chunk_total,
					});
					throw new Error(upload_fail_message(last_result, null, 0));
				}
			}
			save_resume({
				...opts,
				next_index: i + 1,
				chunk_total,
			});
			report_progress(end);
		}
		chat_upload_clear_resume(chunk_key);
		if (typeof on_progress == 'function') {
			on_progress(100);
		}
		if (!last_result || last_result.code != 0 || !last_result.data) {
			throw new Error(upload_fail_message(last_result, null, 0));
		}
		return last_result;
	};

	// 对齐 PC：file.size > chunk_size 才分片
	const use_chunk = file_size > CHAT_UPLOAD_CHUNK_SIZE;
	if (!use_chunk) {
		const result = await upload_whole();
		chat_upload_clear_resume(chunk_key);
		return result;
	}
	return await upload_chunked();
	} finally {
		clear_plus_file_session();
	}
};

export default {
	CHAT_UPLOAD_CHUNK_SIZE,
	chat_upload_make_chunk_key,
	chat_upload_clear_resume,
	chat_upload_file,
};

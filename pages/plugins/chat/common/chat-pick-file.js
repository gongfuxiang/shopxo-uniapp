/**
 * 打开系统文件选择（文件管理器），并尽量按后缀过滤
 * App WebView 用 input accept；Android Intent MIME；iOS UTI
 */
let picking = false;
let ios_picker_keep = null;

const MIME_MAP = {
	pdf: ['application/pdf'],
	doc: ['application/msword'],
	docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	xls: ['application/vnd.ms-excel'],
	xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
	ppt: ['application/vnd.ms-powerpoint'],
	pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
	txt: ['text/plain'],
	zip: ['application/zip'],
	rar: ['application/vnd.rar', 'application/x-rar-compressed'],
	'7z': ['application/x-7z-compressed'],
	mp3: ['audio/mpeg', 'audio/mp3'],
	jpg: ['image/jpeg'],
	jpeg: ['image/jpeg'],
	png: ['image/png'],
	gif: ['image/gif'],
	webp: ['image/webp'],
	mp4: ['video/mp4'],
};

const UTI_MAP = {
	pdf: ['com.adobe.pdf'],
	doc: ['com.microsoft.word.doc'],
	docx: ['org.openxmlformats.wordprocessingml.document'],
	xls: ['com.microsoft.excel.xls'],
	xlsx: ['org.openxmlformats.spreadsheetml.sheet'],
	ppt: ['com.microsoft.powerpoint.ppt'],
	pptx: ['org.openxmlformats.presentationml.presentation'],
	txt: ['public.plain-text', 'public.text'],
	zip: ['public.zip-archive'],
	rar: ['com.rarlab.rar-archive'],
	'7z': ['org.7-zip.7-zip-archive'],
	mp3: ['public.mp3', 'public.mpeg-4-audio', 'public.audio'],
	jpg: ['public.jpeg'],
	jpeg: ['public.jpeg'],
	png: ['public.png'],
	gif: ['com.compuserve.gif'],
	webp: ['org.webmproject.webp'],
	mp4: ['public.mpeg-4', 'public.movie'],
};

const norm_exts = (list) => {
	return (list || []).map((ext) => String(ext || '').replace(/^\./, '').toLowerCase()).filter((item) => item);
};

const ext_dots = (exts) => exts.map((ext) => '.' + ext);

const mime_list = (exts) => {
	const out = [];
	exts.forEach((ext) => {
		(MIME_MAP[ext] || []).forEach((mime) => {
			if (out.indexOf(mime) < 0) {
				out.push(mime);
			}
		});
	});
	return out;
};

const uti_list = (exts) => {
	const out = [];
	exts.forEach((ext) => {
		(UTI_MAP[ext] || []).forEach((uti) => {
			if (out.indexOf(uti) < 0) {
				out.push(uti);
			}
		});
	});
	return out.length > 0 ? out : ['public.item'];
};

const accept_attr = (exts) => {
	const parts = ext_dots(exts).concat(mime_list(exts));
	return parts.length > 0 ? parts.join(',') : '*/*';
};

const file_ext_of = (name) => {
	const n = String(name || '').toLowerCase();
	const m = n.match(/\.([a-z0-9]+)$/);
	return m ? m[1] : '';
};

const ext_from_mime = (mime) => {
	const m = String(mime || '').toLowerCase().split(';')[0].trim();
	if (!m) {
		return '';
	}
	for (const ext of Object.keys(MIME_MAP)) {
		const list = MIME_MAP[ext] || [];
		for (let i = 0; i < list.length; i++) {
			if (list[i] == m) {
				return ext;
			}
		}
	}
	if (m == 'image/jpeg' || m == 'image/jpg') {
		return 'jpg';
	}
	if (m.indexOf('image/') == 0) {
		const sub = m.split('/')[1] || '';
		if (sub == 'jpeg') {
			return 'jpg';
		}
		if (['png', 'gif', 'webp'].indexOf(sub) >= 0) {
			return sub;
		}
	}
	if (m == 'video/mp4') {
		return 'mp4';
	}
	return '';
};

const is_ext_allowed = (ext, mime, exts) => {
	if (!exts || exts.length == 0) {
		return true;
	}
	const e = String(ext || '').toLowerCase();
	if (e && exts.indexOf(e) >= 0) {
		return true;
	}
	const guessed = ext_from_mime(mime);
	return !!(guessed && exts.indexOf(guessed) >= 0);
};

const fail_quiet = (fail, err) => {
	picking = false;
	const msg = String((err && err.errMsg) || '');
	if (msg.indexOf('cancel') >= 0) {
		return;
	}
	if (typeof fail == 'function') {
		fail(err || { errMsg: 'chooseFile:fail' });
	}
};

const safe_file_name = (name, fallback) => {
	const raw = String(name || '').trim() || fallback;
	return raw.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 120) || fallback;
};

/** App 上传要用可访问的本地路径，_doc 相对路径 getFileInfo/uploadFile 经常失败 */
const to_upload_path = (rel) => {
	const s = String(rel || '');
	if (!s) {
		return '';
	}
	try {
		if (typeof plus != 'undefined' && plus.io && plus.io.convertLocalFileSystemURL) {
			const abs = plus.io.convertLocalFileSystemURL(s);
			if (abs) {
				return String(abs).indexOf('file://') == 0 || String(abs).indexOf('/') != 0 ? abs : ('file://' + abs);
			}
		}
	} catch (e) {}
	return s;
};

const entry_upload_path = (entry, rel) => {
	try {
		if (entry && typeof entry.toLocalURL == 'function') {
			const url = entry.toLocalURL();
			if (url) {
				return url;
			}
		}
	} catch (e) {}
	return to_upload_path(rel) || rel;
};

const persist_app_file = (file, success, fail) => {
	const name = safe_file_name(file && file.name, 'file.bin');
	if (!file || typeof plus == 'undefined' || !plus.io) {
		fail_quiet(fail, { errMsg: 'chooseFile:fail' });
		return;
	}
	const dest = Date.now() + '_' + name;
	const rel = '_doc/chat_pick/' + dest;
	const write_to_entry = (entry, data, on_write_fail) => {
		const fail_write = () => {
			if (typeof on_write_fail == 'function') {
				on_write_fail();
				return;
			}
			fail_quiet(fail, { errMsg: 'chooseFile:fail' });
		};
		entry.createWriter((writer) => {
			writer.onerror = fail_write;
			writer.onwriteend = () => {
				entry.file((saved) => {
					if (!saved || !(saved.size > 0)) {
						fail_write();
						return;
					}
					picking = false;
					success(entry_upload_path(entry, rel), name);
				}, fail_write);
			};
			try {
				writer.write(data);
			} catch (e) {
				fail_write();
			}
		}, fail_write);
	};
	const write_via_reader = (entry) => {
		if (typeof FileReader == 'undefined') {
			fail_quiet(fail, { errMsg: 'chooseFile:fail' });
			return;
		}
		const reader = new FileReader();
		reader.onerror = () => fail_quiet(fail, { errMsg: 'chooseFile:fail' });
		reader.onload = () => write_to_entry(entry, reader.result);
		reader.readAsArrayBuffer(file);
	};
	plus.io.resolveLocalFileSystemURL('_doc/', (root) => {
		root.getDirectory('chat_pick', { create: true }, (dir) => {
			dir.getFile(dest, { create: true, exclusive: false }, (entry) => {
				write_to_entry(entry, file, () => write_via_reader(entry));
			}, () => fail_quiet(fail, { errMsg: 'chooseFile:fail' }));
		}, () => fail_quiet(fail, { errMsg: 'chooseFile:fail' }));
	}, () => fail_quiet(fail, { errMsg: 'chooseFile:fail' }));
};

const pick_html_input = (exts, success, fail) => {
	if (typeof document == 'undefined' || !document.createElement) {
		return false;
	}
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = accept_attr(exts);
	input.multiple = false;
	input.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;z-index:99999;';
	let finished = false;
	const finish = (file) => {
		if (finished) {
			return;
		}
		finished = true;
		if (input.parentNode) {
			input.parentNode.removeChild(input);
		}
		if (!file) {
			fail_quiet(fail, { errMsg: 'chooseFile:fail cancel' });
			return;
		}
		// #ifdef APP-PLUS
		persist_app_file(file, success, fail);
		return;
		// #endif
		if (typeof URL != 'undefined' && typeof URL.createObjectURL == 'function') {
			picking = false;
			success(URL.createObjectURL(file), file.name || '');
			return;
		}
		fail_quiet(fail, { errMsg: 'chooseFile:fail' });
	};
	input.onchange = () => {
		finish((input.files && input.files[0]) || null);
	};
	input.addEventListener('cancel', () => {
		finish(null);
	});
	(document.body || document.documentElement).appendChild(input);
	input.click();
	return true;
};

// #ifdef APP-PLUS
const ANDROID_REQ = 39107;
let android_prev_result = null;

const android_uri_name = (resolver, uri, fallback) => {
	let name = fallback;
	try {
		const cursor = resolver.query(uri, null, null, null, null);
		if (cursor) {
			plus.android.importClass(cursor);
			if (cursor.moveToFirst()) {
				const idx = cursor.getColumnIndex('_display_name');
				if (idx >= 0) {
					const n = cursor.getString(idx);
					if (n) {
						name = n;
					}
				}
			}
			cursor.close();
		}
	} catch (e) {}
	return safe_file_name(name, fallback);
};

const android_abs_path = (rel) => {
	let abs = plus.io.convertLocalFileSystemURL(rel);
	abs = String(abs || '');
	return abs.indexOf('file://') == 0 ? abs.replace(/^file:\/\//, '') : abs;
};

const copy_android_stream = (input, abs) => {
	plus.android.importClass(input);
	const FileOutputStream = plus.android.importClass('java.io.FileOutputStream');
	const fos = new FileOutputStream(abs);
	plus.android.importClass(fos);
	let copied = 0;
	try {
		const FileUtils = plus.android.importClass('android.os.FileUtils');
		copied = parseInt(FileUtils.copy(input, fos) || 0) || 0;
	} catch (e) {
		try {
			const ByteBuffer = plus.android.importClass('java.nio.ByteBuffer');
			const Channels = plus.android.importClass('java.nio.channels.Channels');
			const in_ch = Channels.newChannel(input);
			const out_ch = fos.getChannel();
			plus.android.importClass(in_ch);
			plus.android.importClass(out_ch);
			const buf = ByteBuffer.allocate(262144);
			let n = 0;
			while ((n = in_ch.read(buf)) > 0) {
				buf.flip();
				out_ch.write(buf);
				buf.clear();
				copied += n;
			}
		} catch (e2) {
			copied = 0;
		}
	}
	try { fos.flush(); } catch (e) {}
	try { fos.close(); } catch (e) {}
	try { input.close(); } catch (e) {}
	return copied;
};

const copy_android_bitmap = (resolver, uri, abs) => {
	let input = null;
	try {
		input = resolver.openInputStream(uri);
	} catch (e) {
		return 0;
	}
	if (!input) {
		return 0;
	}
	plus.android.importClass(input);
	const BitmapFactory = plus.android.importClass('android.graphics.BitmapFactory');
	const Bitmap = plus.android.importClass('android.graphics.Bitmap');
	const bmp = BitmapFactory.decodeStream(input);
	try { input.close(); } catch (e) {}
	if (!bmp) {
		return 0;
	}
	const FileOutputStream = plus.android.importClass('java.io.FileOutputStream');
	const fos = new FileOutputStream(abs);
	plus.android.importClass(fos);
	const ok = bmp.compress(Bitmap.CompressFormat.JPEG, 90, fos);
	try { fos.flush(); } catch (e) {}
	try { fos.close(); } catch (e) {}
	try { bmp.recycle(); } catch (e) {}
	return ok ? 1 : 0;
};

const copy_android_uri = (uri, fallback) => {
	const main = plus.android.runtimeMainActivity();
	plus.android.importClass(main);
	const resolver = main.getContentResolver();
	plus.android.importClass(resolver);
	plus.android.importClass(uri);
	let waiting = null;
	try {
		waiting = plus.nativeUI.showWaiting('正在读取附件...', { modal: true });
	} catch (e) {}
	const close_waiting = () => {
		try {
			if (waiting) {
				waiting.close();
				waiting = null;
			}
		} catch (e) {}
	};
	try {
		resolver.takePersistableUriPermission(uri, 1);
	} catch (e) {}
	let name = android_uri_name(resolver, uri, fallback);
	let mime = '';
	try {
		mime = String(resolver.getType(uri) || '');
	} catch (e) {}
	const is_image = mime.indexOf('image/') == 0 || ['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(file_ext_of(name)) >= 0;
	const is_video = mime.indexOf('video/') == 0 || file_ext_of(name) == 'mp4';
	if (is_image && file_ext_of(name) == '') {
		name = safe_file_name(name.replace(/\.[^.]+$/, '') + '.jpg', 'image.jpg');
	}
	if (is_video && file_ext_of(name) == '') {
		name = safe_file_name(name.replace(/\.[^.]+$/, '') + '.mp4', 'video.mp4');
	}
	const rel = '_doc/chat_pick/' + Date.now() + '_' + name;
	const abs = android_abs_path(rel);
	const File = plus.android.importClass('java.io.File');
	const dest = new File(abs);
	const parent = dest.getParentFile();
	if (parent && !parent.exists()) {
		parent.mkdirs();
	}
	const ok_file = () => dest.exists() && dest.length() > 0;
	let input = null;
	try {
		input = resolver.openInputStream(uri);
	} catch (e) {
		input = null;
	}
	if (input && copy_android_stream(input, abs) > 0 && ok_file()) {
		close_waiting();
		return { path: rel, name, mime };
	}
	if (is_image && copy_android_bitmap(resolver, uri, abs) > 0 && ok_file()) {
		const jpg_name = file_ext_of(name) == 'jpg' || file_ext_of(name) == 'jpeg' ? name : (name.replace(/\.[^.]+$/, '') + '.jpg');
		close_waiting();
		return { path: rel, name: jpg_name, mime: mime || 'image/jpeg' };
	}
	let pfd = null;
	try {
		pfd = resolver.openFileDescriptor(uri, 'r');
	} catch (e) {
		pfd = null;
	}
	if (pfd) {
		plus.android.importClass(pfd);
		const FileInputStream = plus.android.importClass('java.io.FileInputStream');
		const fis = new FileInputStream(pfd.getFileDescriptor());
		const total = copy_android_stream(fis, abs);
		try { pfd.close(); } catch (e) {}
		if (total > 0 && ok_file()) {
			close_waiting();
			return { path: rel, name, mime };
		}
	}
	close_waiting();
	return null;
};

const put_android_mime_types = (intent, Intent, mimes) => {
	if (!mimes || mimes.length == 0) {
		intent.setType('*/*');
		return;
	}
	if (mimes.length == 1) {
		intent.setType(mimes[0]);
		return;
	}
	intent.setType('*/*');
	try {
		const ArrayList = plus.android.importClass('java.util.ArrayList');
		const list = new ArrayList();
		for (let i = 0; i < mimes.length; i++) {
			list.add(mimes[i]);
		}
		intent.putStringArrayListExtra('android.intent.extra.MIME_TYPES', list);
	} catch (e) {
		try {
			const arr = plus.android.newObject('[Ljava.lang.String;', mimes);
			intent.putExtra(Intent.EXTRA_MIME_TYPES, arr);
		} catch (e2) {
			intent.setType(mimes[0]);
		}
	}
};

const pick_android_intent = (exts, fallback, success, fail) => {
	const main = plus.android.runtimeMainActivity();
	plus.android.importClass(main);
	const Intent = plus.android.importClass('android.content.Intent');
	const mimes = mime_list(exts);
	const build_intent = (action) => {
		const intent = new Intent(action);
		intent.addCategory(Intent.CATEGORY_OPENABLE);
		intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
		if (action == Intent.ACTION_OPEN_DOCUMENT) {
			intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
		}
		put_android_mime_types(intent, Intent, mimes);
		return intent;
	};
	let intent = null;
	try {
		intent = build_intent(Intent.ACTION_OPEN_DOCUMENT);
	} catch (e) {
		intent = build_intent(Intent.ACTION_GET_CONTENT);
	}
	android_prev_result = main.onActivityResult;
	main.onActivityResult = (request_code, result_code, data) => {
		if (request_code != ANDROID_REQ) {
			if (typeof android_prev_result == 'function') {
				android_prev_result(request_code, result_code, data);
			}
			return;
		}
		main.onActivityResult = android_prev_result;
		if (result_code != -1 || !data) {
			fail_quiet(fail, { errMsg: 'chooseFile:fail cancel' });
			return;
		}
		try {
			plus.android.importClass(data);
			let uri = data.getData();
			if (!uri) {
				const clip = data.getClipData();
				if (clip) {
					plus.android.importClass(clip);
					uri = clip.getItemAt(0).getUri();
				}
			}
			if (!uri) {
				try {
					uri = data.getParcelableExtra(Intent.EXTRA_STREAM);
				} catch (e) {}
			}
			if (!uri) {
				fail_quiet(fail, { errMsg: 'chooseFile:fail cancel' });
				return;
			}
			setTimeout(() => {
				try {
					const copied = copy_android_uri(uri, fallback);
					if (!copied || !copied.path) {
						fail_quiet(fail, { errMsg: 'chooseFile:fail' });
						return;
					}
					const ext = file_ext_of(copied.name) || file_ext_of(copied.path);
					if (exts.length > 0 && !is_ext_allowed(ext, copied.mime, exts)) {
						fail_quiet(fail, { errMsg: 'chooseFile:fail type' });
						return;
					}
					picking = false;
					success(to_upload_path(copied.path) || copied.path, copied.name, { mime: copied.mime || '' });
				} catch (e) {
					fail_quiet(fail, { errMsg: 'chooseFile:fail' });
				}
			}, 80);
		} catch (e) {
			fail_quiet(fail, { errMsg: 'chooseFile:fail' });
		}
	};
	main.startActivityForResult(intent, ANDROID_REQ);
};

const pick_ios_files = (exts, fallback, success, fail) => {
	const UIDocumentPickerViewController = plus.ios.importClass('UIDocumentPickerViewController');
	const UIApplication = plus.ios.importClass('UIApplication');
	const picker = UIDocumentPickerViewController.alloc().initWithDocumentTypesInMode(uti_list(exts), 0);
	plus.ios.invoke(picker, 'setAllowsMultipleSelection:', false);
	const delegate = plus.ios.implements('UIDocumentPickerDelegate', {
		'documentPicker:didPickDocumentsAtURLs:': (_ctl, urls) => {
			try {
				const url = plus.ios.invoke(urls, 'objectAtIndex:', 0);
				try {
					plus.ios.invoke(url, 'startAccessingSecurityScopedResource');
				} catch (e) {}
				const path = plus.ios.invoke(url, 'path') || '';
				const abs = plus.ios.invoke(url, 'absoluteString') || '';
				if (!path && !abs) {
					fail_quiet(fail, { errMsg: 'chooseFile:fail cancel' });
					return;
				}
				const name = safe_file_name(String(path || abs).split('/').pop(), fallback);
				const try_paths = [];
				if (path) {
					try_paths.push(String(path).indexOf('file://') == 0 ? path : ('file://' + path));
					try_paths.push(path);
				}
				if (abs) {
					try_paths.push(abs);
				}
				const finish_ios = (ok_path) => {
					try {
						plus.ios.invoke(url, 'stopAccessingSecurityScopedResource');
					} catch (e) {}
					if (ok_path) {
						picking = false;
						success(ok_path, name);
						return;
					}
					fail_quiet(fail, { errMsg: 'chooseFile:fail' });
				};
				const save_entry = (entry) => {
					plus.io.resolveLocalFileSystemURL('_doc/', (root) => {
						root.getDirectory('chat_pick', { create: true }, (dir) => {
							const dest_name = Date.now() + '_' + name;
							entry.copyTo(dir, dest_name, () => {
								const rel = '_doc/chat_pick/' + dest_name;
								dir.getFile(dest_name, {}, (saved) => {
									finish_ios(entry_upload_path(saved, rel));
								}, () => finish_ios(to_upload_path(rel) || rel));
							}, () => {
								entry.file((file) => persist_app_file(file, (p, n) => {
									try {
										plus.ios.invoke(url, 'stopAccessingSecurityScopedResource');
									} catch (e) {}
									success(p, n);
								}, fail), () => finish_ios(''));
							});
						}, () => finish_ios(''));
					}, () => finish_ios(''));
				};
				const try_resolve = (i) => {
					if (i >= try_paths.length) {
						finish_ios('');
						return;
					}
					plus.io.resolveLocalFileSystemURL(try_paths[i], save_entry, () => try_resolve(i + 1));
				};
				try_resolve(0);
			} catch (e) {
				fail_quiet(fail, { errMsg: 'chooseFile:fail' });
			}
		},
		'documentPickerWasCancelled:': () => {
			fail_quiet(fail, { errMsg: 'chooseFile:fail cancel' });
		},
	});
	ios_picker_keep = { picker, delegate };
	plus.ios.invoke(picker, 'setDelegate:', delegate);
	let current = UIApplication.sharedApplication().keyWindow.rootViewController;
	for (let i = 0; i < 8; i++) {
		const presented = plus.ios.invoke(current, 'presentedViewController');
		if (!presented) {
			break;
		}
		current = presented;
	}
	plus.ios.invoke(current, 'presentViewController:animated:completion:', picker, true, null);
};

const pick_app = (kind, exts, success, fail) => {
	const fallback = kind == 'audio' ? 'audio.mp3' : 'file.bin';
	const os = (plus.os && plus.os.name) || '';
	if (os == 'iOS') {
		try {
			pick_ios_files(exts, fallback, success, fail);
			return;
		} catch (e) {}
	}
	if (os == 'Android') {
		try {
			pick_android_intent(exts, fallback, success, fail);
			return;
		} catch (e) {}
	}
	if (pick_html_input(exts, success, fail)) {
		return;
	}
	fail_quiet(fail, { errMsg: 'chooseFile:fail 无法打开文件管理器' });
};
// #endif

const pick_mp_or_h5 = (exts, success, fail) => {
	// #ifdef MP-WEIXIN
	uni.chooseMessageFile({
		count: 1,
		type: 'file',
		extension: ext_dots(exts),
		success: (res) => {
			const file = (res.tempFiles && res.tempFiles[0]) || {};
			picking = false;
			success(file.path || file.tempFilePath, file.name || '');
		},
		fail: (err) => fail_quiet(fail, err),
	});
	return;
	// #endif
	if (pick_html_input(exts, success, fail)) {
		return;
	}
	if (typeof uni.chooseFile == 'function') {
		uni.chooseFile({
			count: 1,
			type: 'all',
			extension: ext_dots(exts),
			success: (res) => {
				const file = (res.tempFiles && res.tempFiles[0]) || {};
				picking = false;
				success(file.path || file.tempFilePath || (res.tempFilePaths && res.tempFilePaths[0]), file.name || '');
			},
			fail: (err) => fail_quiet(fail, err),
		});
		return;
	}
	fail_quiet(fail, { errMsg: 'chooseFile:fail 无法打开文件管理器' });
};

export const pick_chat_local_file = (options = {}) => {
	const kind = options.kind == 'audio' ? 'audio' : 'file';
	const exts = norm_exts(options.extensions || []);
	const success = typeof options.success == 'function' ? options.success : () => {};
	const fail = typeof options.fail == 'function' ? options.fail : () => {};
	if (picking) {
		return;
	}
	picking = true;
	setTimeout(() => {
		picking = false;
	}, 800);
	const on_ok = (path, name, meta) => {
		if (!path) {
			fail_quiet(fail, { errMsg: 'chooseFile:fail' });
			return;
		}
		let file_name = name || '';
		if (kind == 'audio' && file_name && file_name.indexOf('.') < 0) {
			file_name = file_name + '.mp3';
		}
		const ext = file_ext_of(file_name) || file_ext_of(path);
		const mime = (meta && meta.mime) || '';
		if (exts.length > 0 && !is_ext_allowed(ext, mime, exts)) {
			fail_quiet(fail, { errMsg: 'chooseFile:fail type' });
			return;
		}
		picking = false;
		success({ path, name: file_name });
	};

	// #ifdef APP-PLUS
	const run = () => pick_app(kind, exts, on_ok, fail);
	if (typeof plus != 'undefined') {
		run();
		return;
	}
	if (typeof document != 'undefined' && document.addEventListener) {
		const on_ready = () => {
			document.removeEventListener('plusready', on_ready);
			run();
		};
		document.addEventListener('plusready', on_ready);
		return;
	}
	fail_quiet(fail, { errMsg: 'chooseFile:fail 无法打开文件管理器' });
	return;
	// #endif

	pick_mp_or_h5(exts, on_ok, fail);
};

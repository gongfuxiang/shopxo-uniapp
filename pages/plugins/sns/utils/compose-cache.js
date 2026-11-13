/**
 * 评论/发布共用配置缓存，避免列表每条动态重复打 config、saveinfo
 */
const app = getApp();

var config_cache = null;
var config_pending = null;
var saveinfo_cache = null;
var saveinfo_pending = null;

// POST 请求并返回 data（失败返回 null）
function request_post(url) {
    return new Promise((resolve) => {
        uni.request({
            url: url,
            method: 'POST',
            data: {},
            dataType: 'json',
            success: (res) => {
                resolve(res && res.data && res.data.code == 0 ? res.data.data || {} : null);
            },
            fail: () => {
                resolve(null);
            },
        });
    });
}

// 获取微社区配置（带缓存；force 强制刷新）
export function getSnsConfig(force) {
    if (!force && config_cache) {
        return Promise.resolve(config_cache);
    }
    if (!force && config_pending) {
        return config_pending;
    }
    config_pending = request_post(app.globalData.get_request_url('config', 'index', 'sns')).then((data) => {
        if (data) {
            config_cache = data;
        }
        config_pending = null;
        return config_cache || {};
    });
    return config_pending;
}

// 获取动态发布初始化（表情/上传路径等，带缓存）
export function getMomentSaveinfo(force) {
    if (!force && saveinfo_cache) {
        return Promise.resolve(saveinfo_cache);
    }
    if (!force && saveinfo_pending) {
        return saveinfo_pending;
    }
    // 未登录时 saveinfo 可能失败，不缓存空结果以免挡住后续登录
    if (!app.globalData.get_user_cache_info()) {
        return Promise.resolve({});
    }
    saveinfo_pending = request_post(app.globalData.get_request_url('saveinfo', 'moment', 'sns')).then((data) => {
        if (data) {
            saveinfo_cache = data;
        }
        saveinfo_pending = null;
        return saveinfo_cache || {};
    });
    return saveinfo_pending;
}

// 清空配置缓存
export function clearSnsComposeCache() {
    config_cache = null;
    config_pending = null;
    saveinfo_cache = null;
    saveinfo_pending = null;
}

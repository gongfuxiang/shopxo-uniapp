const LIVE_ROOM_STATUS_LIST = [
    { type: '0', name: '离线' },
    { type: '1', name: '直播中' },
    { type: '2', name: '离开' },
    { type: '3', name: '封禁' },
];
// 获取直播间状态值
export function get_live_room_status(data) {
    if (!data) return null;
    const raw = data.status !== undefined && data.status !== null && data.status !== '' ? data.status : data.live_status;
    if (raw === '' || raw === undefined || raw === null) return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
}
// 是否显示直播状态角标
export function should_show_live_status(data) {
    return get_live_room_status(data) !== null;
}
// 获取直播间状态名称
export function get_live_room_status_name(data) {
    if (data && data.status_name) return String(data.status_name);
    const s = get_live_room_status(data);
    if (s === null) return '';
    const item = LIVE_ROOM_STATUS_LIST.find((it) => String(it.type) === String(s));
    return item ? item.name : '';
}
// 获取观看人数
export function get_live_online_count(data) {
    if (!data) return '0';
    return data.online_count ?? data.viewer_count ?? data.access_count ?? '0';
}
// 格式化直播状态筛选
export function format_live_status(status) {
    if (Array.isArray(status)) return status.filter((s) => s !== '' && s != null).join(',');
    return status ? String(status) : '';
}
// 格式化是否推荐筛选
export function format_live_is_recommended(val) {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return Number.isNaN(n) ? undefined : n;
}

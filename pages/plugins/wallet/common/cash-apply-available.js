/**
 * 提现申请可用性（与后端 CashService::CashApplyAvailableData 保持一致）
 */

/**
 * 金额格式化为两位小数
 * @param   {number|string} value [原始金额]
 * @return  {string}               [两位小数字符串]
 */
function priceFormat(value) {
    var num = parseFloat(value);
    if (isNaN(num)) {
        num = 0;
    }
    return num.toFixed(2);
}

/**
 * 提现不可用提示文案（接口未返回时的本地兜底，与后端 CashApplyUnavailableText 一致）
 * @param   {string} unavailable_type [不可用类型]
 * @param   {object} data              [可用性金额数据]
 * @param   {string} symbol             [货币符号]
 * @return  {object}                    [unavailable_title、unavailable_desc]
 */
export function BuildCashApplyUnavailableText(unavailable_type, data, symbol) {
    symbol = symbol || '';
    switch (unavailable_type) {
        case 'zero_balance':
            return {
                unavailable_title: '当前暂无可提现余额',
                unavailable_desc: '您的钱包可用余额为 ' + symbol + '0.00，暂无法发起提现申请。请先充值或等待账户入账后再试。',
            };
        case 'no_cashable_money':
            var give_tip = (data.is_retain_give || 0) == 1 ? '（赠送金额 ' + symbol + (data.give_money || '0.00') + ' 不可提现）' : '';
            return {
                unavailable_title: '当前余额不可提现',
                unavailable_desc: '您的可用余额 ' + symbol + (data.normal_money || '0.00') + ' 中，可提现部分为 ' + symbol + '0.00' + give_tip + '，暂无法发起提现申请。',
            };
        case 'below_minimum':
        default:
            return {
                unavailable_title: '未达到最低提现金额',
                unavailable_desc: '当前可提现 ' + symbol + (data.can_cash_max_money || '0.00') + '，平台要求单次提现最低 ' + symbol + (data.cash_minimum_amount || '0.00') + '，余额不足最低门槛，暂无法发起提现申请。',
            };
    }
}

/**
 * 提现申请前置可用性（接口未返回 cash_apply_available 时的本地兜底）
 * @param   {object|null} user_wallet [用户钱包]
 * @param   {object|null} base          [插件配置]
 * @param   {string}      symbol        [货币符号]
 * @return  {object|null}               [与接口 cash_apply_available 结构一致]
 */
export function BuildCashApplyAvailable(user_wallet, base, symbol) {
    if (user_wallet == null || base == null) {
        return null;
    }
    var normal = parseFloat(user_wallet.normal_money || 0);
    if (isNaN(normal)) {
        normal = 0;
    }
    var give = parseFloat(user_wallet.give_money || 0);
    if (isNaN(give)) {
        give = 0;
    }
    var is_retain_give = base.is_cash_retain_give === undefined || base.is_cash_retain_give == 1;
    var can_cash_max_money = is_retain_give ? Math.max(0, normal - give) : normal;
    can_cash_max_money = parseFloat(priceFormat(can_cash_max_money));
    var cash_minimum_amount = parseFloat(base.cash_minimum_amount || 0);
    if (isNaN(cash_minimum_amount)) {
        cash_minimum_amount = 0;
    }

    var unavailable_type = '';
    if (can_cash_max_money <= 0) {
        unavailable_type = normal <= 0 ? 'zero_balance' : 'no_cashable_money';
    } else if (cash_minimum_amount > 0 && can_cash_max_money < cash_minimum_amount) {
        unavailable_type = 'below_minimum';
    }

    var result = {
        is_available: unavailable_type ? 0 : 1,
        unavailable_type: unavailable_type,
        can_cash_max_money: priceFormat(can_cash_max_money),
        cash_minimum_amount: cash_minimum_amount > 0 ? priceFormat(cash_minimum_amount) : '0.00',
        normal_money: priceFormat(normal),
        give_money: priceFormat(give),
        is_retain_give: is_retain_give ? 1 : 0,
        unavailable_title: '',
        unavailable_desc: '',
    };
    if (unavailable_type) {
        var message = BuildCashApplyUnavailableText(unavailable_type, result, symbol);
        result.unavailable_title = message.unavailable_title;
        result.unavailable_desc = message.unavailable_desc;
    }
    return result;
}

/**
 * 是否可进入提现申请流程
 * @param   {object|null} cash_apply_available [可用性数据]
 * @return  {boolean}
 */
export function IsCashApplyAvailable(cash_apply_available) {
    if (cash_apply_available == null) {
        return false;
    }
    return cash_apply_available.is_available == 1 || cash_apply_available.is_available === true;
}

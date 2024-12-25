'use strict';
exports.main = async(event, context) => {
    const res = await uniCloud.getPhoneNumber({
        provider: 'univerify',
        access_token: event.access_token,
        openid: event.openid
    });
    return (res.code == 0) ? res.phoneNumber : null;
}
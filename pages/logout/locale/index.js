import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "logout": "账号注销"
    },
    "logout": {
        "confirm_cancellation": "确认注销",
        "after_account_cancellation_cannot_restored_sure": "账号注销后不可恢复、确定继续吗？"
    }
};
var en = {
    "pages": {
        "logout": "Account cancellation"
    },
    "logout": {
        "confirm_cancellation": "Confirm cancellation",
        "after_account_cancellation_cannot_restored_sure": "After account cancellation, it cannot be restored. Are you sure to continue?"
    }
};
export default createPageLocaleMixin({ zh, en });

import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    pages: {
        about: "关于我们"
    }
};
var en = {
    pages: {
        about: "About Us"
    }
};
export default createPageLocaleMixin({ zh, en });

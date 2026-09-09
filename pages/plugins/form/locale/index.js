import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {},
    "form": {
        "provide_detailed_description_problem_answer_soon": "请详细描述问题，我们将尽快为您解答！"
    }
};
var en = {
    "pages": {},
    "form": {
        "provide_detailed_description_problem_answer_soon": "Please provide a detailed description of the problem, and we will answer it as soon as possible!"
    }
};
export default createPageLocaleMixin({ zh, en });

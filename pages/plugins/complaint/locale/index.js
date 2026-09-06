import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-complaint-form": "投诉/举报",
        "plugins-complaint-user": "投诉/举报列表"
    },
    "complaint-form": {
        "complaint_report_type": "投诉/举报类型",
        "select_type_complaint_report": "请选择投诉/举报类型",
        "proof_image": "证明图片"
    }
};
var en = {
    "pages": {
        "plugins-complaint-form": "Complaint/Report",
        "plugins-complaint-user": "Complaint/Report List"
    },
    "complaint-form": {
        "complaint_report_type": "Complaint/Report Type",
        "select_type_complaint_report": "Please select the type of complaint/report",
        "proof_image": "Proof image"
    }
};
var spa = {
    "pages": {
        "plugins-complaint-form": "Queja/Denuncia",
        "plugins-complaint-user": "Lista de quejas/denuncias"
    },
    "complaint-form": {
        "complaint_report_type": "Tipo de queja/denuncia",
        "select_type_complaint_report": "Seleccione el tipo de queja/denuncia",
        "proof_image": "Imagen de prueba"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

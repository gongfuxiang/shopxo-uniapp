import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var spa = {
    common: {
        selected: 'Seleccionado'
    },
    'goods-batch-buy': {
        species: 'tipos',
        amount: 'Importe:',
        relevant_info_available: 'No hay información relacionada',
        incorrect_operation_event_type: 'Tipo de evento de operación incorrecto',
        out_stock: 'Sin existencias'
    }
};
export default createPageLocaleMixin({ spa });

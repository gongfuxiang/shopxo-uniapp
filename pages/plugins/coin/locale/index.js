import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-coin-collection": "收款",
        "plugins-coin-user": "虚拟币",
        "plugins-coin-recharge": "充值",
        "plugins-coin-recharge-pay": "充值支付",
        "plugins-coin-convert": "转换",
        "plugins-coin-cash": "提现",
        "plugins-coin-detail": "明细",
        "plugins-coin-transfer": "转账",
        "plugins-coin-transfer-list": "转账明细",
        "plugins-coin-transaction-list": "交易明细",
        "plugins-coin-cash-list": "提现明细",
        "plugins-coin-convert-list": "转换明细",
        "plugins-coin-recharge-list": "充值明细"
    },
    "cash": {
        "withdrawable_currency": "可提现币",
        "withdrawal_quantity": "提现数量",
        "all_withdrawals": "全部提现",
        "withdrawal_address": "提币地址",
        "withdrawal_network": "提币网络",
        "network_data": "无网络数据",
        "apply_withdrawal": "申请提现",
        "enter_withdrawal_address": "请输入提币地址",
        "enter_withdrawal_note_info": "请输入提现备注信息",
        "network_data_empty_contact_customer_service": "网络数据为空、请联系客服！",
        "enter_withdrawal_quantity": "请输入提现数量"
    },
    "cash-list": {
        "withdrawal_number": "提现单号：",
        "platform": "平台：",
        "recharge_network": "充值网络：",
        "recharge_address": "充值地址：",
        "withdrawal_currency": "提现币：",
        "account_type": "账户种类",
        "withdrawal_type": "提现类型",
        "network_type": "网络类型",
        "sure_delete_withdrawal_order": "确定删除这条提现订单吗"
    },
    "collection": {
        "scan_initiate_transfer_other_party_verify": "扫一扫向对方发起转账，请核对认真账户后再确认转账！"
    },
    "convert": {
        "balance": "余额:",
        "convert_now": "立即转换",
        "transfer_out_receive_selection_cannot_same": "转出和接收选择不能相同",
        "enter_conversion_currency": "请输入转换币"
    },
    "convert-list": {
        "transfer_account": "转入账户：",
        "conversion_order_number": "转换单号：",
        "transfer_out_balance": "转出余额：",
        "transfer_out_account": "转出账户：",
        "latest_currency": "最新币：",
        "remarks": "备注：",
        "initiate_account": "发起账户",
        "receiving_account": "接收账户"
    },
    "recharge-list": {
        "recharge_order_number": "充值单号：",
        "recharged_coins": "充值币：",
        "sure_delete_recharge_order": "确定删除这条充值订单吗"
    },
    "recharge-pay": {
        "payment_voucher": "支付凭证",
        "upload_up_10_images": "（最多上传10张图）",
        "payment_remarks": "支付备注",
        "enter_note": "请输入备注",
        "upload_voucher": "请上传凭证"
    },
    "transaction-list": {
        "currency_type": "币类型：",
        "operation_currency": "操作币：",
        "original_currency": "原始币：",
        "description": "描述：",
        "currency_type_2": "币类型"
    },
    "transfer-list": {
        "transfer_order_number": "转账单号：",
        "payee": "收款人：",
        "transfer_currency": "转账币：",
        "transfer_remarks": "转账备注："
    },
    "detail": {
        "operation_type": "操作类型：",
        "number_operations": "操作数量：",
        "original_quantity": "原始数量：",
        "latest_quantity": "最新数量：",
        "view_more_details": "查看更多明细",
        "account_details": "账户详情"
    },
    "recharge": {
        "recharge_address": "充币地址",
        "coin_charging_network": "充币网络",
        "choose_recharge_coins": "选择充值币",
        "other_quantities": "其他数量",
        "recharge_instructions_2": "充值说明：",
        "enter_recharge_quantity": "请输入充值数量",
        "select_enter_recharge_quantity": "请选择或输入充值数量"
    },
    "transfer": {
        "transfer_currency": "转账币",
        "transfer_immediately": "立即转账",
        "enter_transfer_currency": "请输入转账币"
    }
};
var en = {
    "pages": {
        "plugins-coin-collection": "Collection",
        "plugins-coin-user": "Virtual currency",
        "plugins-coin-recharge": "Recharge",
        "plugins-coin-recharge-pay": "Recharge payment",
        "plugins-coin-convert": "conversion",
        "plugins-coin-cash": "Withdrawal",
        "plugins-coin-detail": "detail",
        "plugins-coin-transfer": "Transfer",
        "plugins-coin-transfer-list": "Transfer details",
        "plugins-coin-transaction-list": "Transaction details",
        "plugins-coin-cash-list": "Withdrawal details",
        "plugins-coin-convert-list": "Conversion details",
        "plugins-coin-recharge-list": "Recharge details"
    },
    "cash": {
        "withdrawable_currency": "Withdrawable currency",
        "withdrawal_quantity": "Withdrawal quantity",
        "all_withdrawals": "All withdrawals",
        "withdrawal_address": "Withdrawal address",
        "withdrawal_network": "Withdrawal network",
        "network_data": "No network data",
        "apply_withdrawal": "Apply for withdrawal",
        "enter_withdrawal_address": "Please enter the withdrawal address",
        "enter_withdrawal_note_info": "Please enter withdrawal note info",
        "network_data_empty_contact_customer_service": "Network data is empty, please contact customer service!",
        "enter_withdrawal_quantity": "Please enter the withdrawal quantity"
    },
    "cash-list": {
        "withdrawal_number": "Withdrawal number:",
        "platform": "Platform:",
        "recharge_network": "Recharge network:",
        "recharge_address": "Recharge address:",
        "withdrawal_currency": "Withdrawal currency:",
        "account_type": "Account type",
        "withdrawal_type": "Withdrawal type",
        "network_type": "Network type",
        "sure_delete_withdrawal_order": "Are you sure to delete this withdrawal order"
    },
    "collection": {
        "scan_initiate_transfer_other_party_verify": "Scan to initiate a transfer to the other party. Please verify your account carefully before confirming the transfer!"
    },
    "convert": {
        "balance": "Balance:",
        "convert_now": "convert now",
        "transfer_out_receive_selection_cannot_same": "Transfer out and receive selection cannot be the same",
        "enter_conversion_currency": "Please enter the conversion currency"
    },
    "convert-list": {
        "transfer_account": "Transfer to account:",
        "conversion_order_number": "Conversion order number:",
        "transfer_out_balance": "Transfer out balance:",
        "transfer_out_account": "Transfer out account:",
        "latest_currency": "Latest Currency:",
        "remarks": "Remarks:",
        "initiate_account": "Initiate account",
        "receiving_account": "Receiving account"
    },
    "recharge-list": {
        "recharge_order_number": "Recharge order number:",
        "recharged_coins": "Recharged coins:",
        "sure_delete_recharge_order": "Are you sure to delete this recharge order"
    },
    "recharge-pay": {
        "payment_voucher": "Payment voucher",
        "upload_up_10_images": "(Upload up to 10 images)",
        "payment_remarks": "Payment remarks",
        "enter_note": "Please enter a note",
        "upload_voucher": "Please upload the voucher"
    },
    "transaction-list": {
        "currency_type": "Currency type:",
        "operation_currency": "Operation currency:",
        "original_currency": "Original currency:",
        "description": "Description:",
        "currency_type_2": "Currency type"
    },
    "transfer-list": {
        "transfer_order_number": "Transfer order number:",
        "payee": "Payee:",
        "transfer_currency": "Transfer currency:",
        "transfer_remarks": "Transfer remarks:"
    },
    "detail": {
        "operation_type": "Operation type:",
        "number_operations": "Number of operations:",
        "original_quantity": "Original quantity:",
        "latest_quantity": "Latest quantity:",
        "view_more_details": "View more details",
        "account_details": "account details "
    },
    "recharge": {
        "recharge_address": "Recharge address",
        "coin_charging_network": "Coin charging network",
        "choose_recharge_coins": "Choose recharge coins",
        "other_quantities": "Other quantities",
        "recharge_instructions_2": "Recharge instructions:",
        "enter_recharge_quantity": "Please enter the recharge quantity",
        "select_enter_recharge_quantity": "Please select or enter the recharge quantity"
    },
    "transfer": {
        "transfer_currency": "Transfer currency",
        "transfer_immediately": "Transfer immediately",
        "enter_transfer_currency": "Please enter the transfer currency"
    }
};
var spa = {
    "pages": {
        "plugins-coin-collection": "Cobro",
        "plugins-coin-user": "Moneda virtual",
        "plugins-coin-recharge": "Recarga",
        "plugins-coin-recharge-pay": "Pago de recarga",
        "plugins-coin-convert": "Conversión",
        "plugins-coin-cash": "Retiro",
        "plugins-coin-detail": "Detalle",
        "plugins-coin-transfer": "Transferencia",
        "plugins-coin-transfer-list": "Detalle de transferencias",
        "plugins-coin-transaction-list": "Detalle de transacciones",
        "plugins-coin-cash-list": "Detalle de retiros",
        "plugins-coin-convert-list": "Detalle de conversiones",
        "plugins-coin-recharge-list": "Detalle de recargas"
    },
    "cash": {
        "withdrawable_currency": "Moneda retirable",
        "withdrawal_quantity": "Cantidad de retiro",
        "all_withdrawals": "Retirar todo",
        "withdrawal_address": "Dirección de retiro",
        "withdrawal_network": "Red de retiro",
        "network_data": "Sin datos de red",
        "apply_withdrawal": "Solicitar retiro",
        "enter_withdrawal_address": "Introduzca la dirección de retiro",
        "enter_withdrawal_note_info": "Introduzca la nota de retiro",
        "network_data_empty_contact_customer_service": "No hay datos de red, contacte al servicio de atención.",
        "enter_withdrawal_quantity": "Introduzca la cantidad de retiro"
    },
    "cash-list": {
        "withdrawal_number": "N.º de retiro:",
        "platform": "Plataforma:",
        "recharge_network": "Red de recarga:",
        "recharge_address": "Dirección de recarga:",
        "withdrawal_currency": "Moneda de retiro:",
        "account_type": "Tipo de cuenta",
        "withdrawal_type": "Tipo de retiro",
        "network_type": "Tipo de red",
        "sure_delete_withdrawal_order": "¿Eliminar este pedido de retiro?"
    },
    "collection": {
        "scan_initiate_transfer_other_party_verify": "Escanee para iniciar una transferencia. Verifique la cuenta antes de confirmar."
    },
    "convert": {
        "balance": "Saldo:",
        "convert_now": "Convertir ahora",
        "transfer_out_receive_selection_cannot_same": "La cuenta de origen y destino no pueden ser la misma",
        "enter_conversion_currency": "Introduzca la moneda de conversión"
    },
    "convert-list": {
        "transfer_account": "Cuenta de destino:",
        "conversion_order_number": "N.º de conversión:",
        "transfer_out_balance": "Saldo de origen:",
        "transfer_out_account": "Cuenta de origen:",
        "latest_currency": "Moneda más reciente:",
        "remarks": "Nota:",
        "initiate_account": "Cuenta de origen",
        "receiving_account": "Cuenta de destino"
    },
    "recharge-list": {
        "recharge_order_number": "N.º de recarga:",
        "recharged_coins": "Monedas recargadas:",
        "sure_delete_recharge_order": "¿Eliminar este pedido de recarga?"
    },
    "recharge-pay": {
        "payment_voucher": "Comprobante de pago",
        "upload_up_10_images": "(Hasta 10 imágenes)",
        "payment_remarks": "Nota de pago",
        "enter_note": "Introduzca una nota",
        "upload_voucher": "Suba el comprobante"
    },
    "transaction-list": {
        "currency_type": "Tipo de moneda:",
        "operation_currency": "Moneda de operación:",
        "original_currency": "Moneda original:",
        "description": "Descripción:",
        "currency_type_2": "Tipo de moneda"
    },
    "transfer-list": {
        "transfer_order_number": "N.º de transferencia:",
        "payee": "Beneficiario:",
        "transfer_currency": "Moneda de transferencia:",
        "transfer_remarks": "Nota de transferencia:"
    },
    "detail": {
        "operation_type": "Tipo de operación:",
        "number_operations": "Cantidad de operación:",
        "original_quantity": "Cantidad original:",
        "latest_quantity": "Cantidad más reciente:",
        "view_more_details": "Ver más detalles",
        "account_details": "Detalle de la cuenta"
    },
    "recharge": {
        "recharge_address": "Dirección de recarga",
        "coin_charging_network": "Red de recarga",
        "choose_recharge_coins": "Elegir moneda de recarga",
        "other_quantities": "Otras cantidades",
        "recharge_instructions_2": "Instrucciones de recarga:",
        "enter_recharge_quantity": "Introduzca la cantidad de recarga",
        "select_enter_recharge_quantity": "Seleccione o introduzca la cantidad de recarga"
    },
    "transfer": {
        "transfer_currency": "Moneda de transferencia",
        "transfer_immediately": "Transferir ahora",
        "enter_transfer_currency": "Introduzca la moneda de transferencia"
    }
};
export default createPageLocaleMixin({ zh, en, spa });

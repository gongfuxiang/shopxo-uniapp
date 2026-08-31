var zh = {
    "pages": {
        "plugins-realstore-index": "门店",
        "plugins-realstore-search": "门店搜索",
        "plugins-realstore-detail": "门店详情",
        "plugins-realstore-favor": "门店收藏",
        "plugins-realstore-orderallot-list": "门店订单",
        "plugins-realstore-orderallot-detail": "门店订单详情",
        "plugins-realstore-batchorder-list": "批次订单",
        "plugins-realstore-frequencycard-list": "次卡",
        "plugins-realstore-frequencycard-used": "次卡使用记录",
        "plugins-realstore-check": "订单核销",
        "plugins-realstore-staff-list": "服务人员",
        "plugins-realstore-staff-detail": "预约服务"
    },
    "batchorder-list": {
        "progress": "进行中"
    },
    "frequencycard-used": {
        "deduction_frequency": "扣除次数",
        "description": "描述说明",
        "operators": "操作人员"
    },
    "realstore-staff": {
        "book_service_staff": "预约服务人员",
        "store": "门店：",
        "position": "职位：",
        "bookable_staff_across_all_stores": "全部门店可预约服务人员",
        "select": "选择",
        "booked": "已预约",
        "book": "去预约",
        "invalid_parameters": "参数有误",
        "id": "工号：",
        "phone": "联系电话：",
        "bookable_services": "可预约服务",
        "selected": "已选择",
        "bookable_services_2": "暂无可预约服务",
        "search_staff_name": "搜索服务人员姓名"
    },
    "goods-detail": {
        "store_introduction": "门店介绍",
        "store_products": "门店商品"
    },
    "index": {
        "select_location": "选择位置",
        "enter_store_name": "输入门店名称",
        "latest_stores": "最新门店"
    },
    "detail": {
        "business_hours": "营业时间：",
        "map": "导航",
        "product_search": "商品搜索"
    },
    "frequencycard-list": {
        "usage_records": "使用记录",
        "suspend": "暂停",
        "finish": "结束",
        "available_times": "可用次数",
        "used_times": "已用次数",
        "starting_time": "起始时间"
    },
    "orderallot-detail": {
        "order_type": "订单类型",
        "booking_data": "预约数据"
    },
    "orderallot-list": {
        "service": "服务中",
        "received": "已接收"
    }
};
var en = {
    "pages": {
        "plugins-realstore-index": "store",
        "plugins-realstore-search": "Store Search",
        "plugins-realstore-detail": "Store details",
        "plugins-realstore-favor": "Store Collection",
        "plugins-realstore-orderallot-list": "Store orders",
        "plugins-realstore-orderallot-detail": "Store Order Details",
        "plugins-realstore-batchorder-list": "Batch orders",
        "plugins-realstore-frequencycard-list": "Secondary card",
        "plugins-realstore-frequencycard-used": "Secondary Card Usage Record",
        "plugins-realstore-check": "Order verification",
        "plugins-realstore-staff-list": "Service Staff",
        "plugins-realstore-staff-detail": "Book Service"
    },
    "batchorder-list": {
        "progress": "In progress"
    },
    "frequencycard-used": {
        "deduction_frequency": "Deduction frequency",
        "description": "Description",
        "operators": "Operators"
    },
    "realstore-staff": {
        "book_service_staff": "Book Service Staff",
        "store": "Store: ",
        "position": "Position: ",
        "bookable_staff_across_all_stores": "Bookable staff across all stores",
        "select": "Select",
        "booked": "Booked",
        "book": "Book",
        "invalid_parameters": "Invalid parameters",
        "id": "ID: ",
        "phone": "Phone: ",
        "bookable_services": "Bookable Services",
        "selected": "Selected",
        "bookable_services_2": "No bookable services",
        "search_staff_name": "Search staff name"
    },
    "goods-detail": {
        "store_introduction": "Store Introduction",
        "store_products": "Store products"
    },
    "index": {
        "select_location": "Select location",
        "enter_store_name": "Enter store name",
        "latest_stores": "Latest stores"
    },
    "detail": {
        "business_hours": "Business hours:",
        "map": "Map",
        "product_search": "Product search"
    },
    "frequencycard-list": {
        "usage_records": "Usage records",
        "suspend": "suspend",
        "finish": "finish",
        "available_times": "Available times",
        "used_times": "Used times",
        "starting_time": "Starting time"
    },
    "orderallot-detail": {
        "order_type": "Order type",
        "booking_data": "Booking data"
    },
    "orderallot-list": {
        "service": "In service",
        "received": "Received"
    }
};
var merged = false;
function usePluginLocale(i18n) {
    if (merged || !i18n || typeof i18n.mergeLocaleMessage != 'function') {
        return;
    }
    merged = true;
    i18n.mergeLocaleMessage('zh', zh);
    i18n.mergeLocaleMessage('zh-Hans', zh);
    i18n.mergeLocaleMessage('en', en);
}

export default {
    beforeCreate() {
        usePluginLocale(this.$i18n);
    }
};

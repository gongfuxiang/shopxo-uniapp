import { createPageLocaleMixin } from '@/locale/merge-page-locale.js';
var zh = {
    "pages": {
        "plugins-distribution-user": "我的分销",
        "plugins-distribution-order": "分销订单",
        "plugins-distribution-order-detail": "订单详情",
        "plugins-distribution-profit": "收益明细",
        "plugins-distribution-profit-detail": "收益详情",
        "plugins-distribution-team": "我的团队",
        "plugins-distribution-map": "客户分布",
        "plugins-distribution-recommend-list": "我的推荐宝",
        "plugins-distribution-recommend-detail": "推荐宝详情",
        "plugins-distribution-recommend-form": "推荐宝添加/编辑",
        "plugins-distribution-poster": "推广奖励",
        "plugins-distribution-extraction": "取货点",
        "plugins-distribution-extraction-apply": "取货点信息",
        "plugins-distribution-extraction-order": "取货订单",
        "plugins-distribution-extraction-switch": "取货点切换",
        "plugins-distribution-introduce": "等级介绍",
        "plugins-distribution-promotion-user": "推广用户",
        "plugins-distribution-promotion-order": "推广订单",
        "plugins-distribution-visit-list": "客户拜访",
        "plugins-distribution-visit-form": "客户拜访新增/编辑",
        "plugins-distribution-apply": "申请分销",
        "plugins-distribution-apply-form": "填写申请"
    },
    "apply": {
        "distribution_application_been_approved": "您的分销申请已通过",
        "level": "，等级：",
        "review_time": "审核时间：",
        "application_time": "申请时间：",
        "application_info": "申请信息",
        "distribution_application_under_review_wait_patie": "您的分销申请正在审核中，请耐心等待。",
        "modify_info_submit_again": "可修改信息后重新提交申请",
        "tap_go_fill_fill_application_info": "请点击去填写页面填写申请信息后提交审核",
        "go_fill": "去填写",
        "reapply": "重新申请",
        "fill_application_form_now": "是否立即填写申请表单？",
        "previous_application_not_approved": "上次申请未通过"
    },
    "apply-form": {
        "modifications_resubmitted_review_confirm_info_co": "修改后将重新提交审核，请确认信息无误。",
        "application_form_configured_yet_contact_administ": "申请表单暂未配置，请联系管理员",
        "submit_application": "提交申请",
        "save_changes": "保存修改"
    },
    "extraction-order": {
        "picking_up_goods": "取货",
        "enter_pickup_code": "请输入取货码",
        "order_number_pickup_code": "订单号/取货码",
        "enter_pickup_code_2": "请输入取件码",
        "incorrect_operation_data": "操作数据有误"
    },
    "introduce": {
        "level_certificate": "等级证书",
        "rebate_ratio": "返佣比例",
        "first_level": "一级",
        "second_level": "二级",
        "level": "三级",
        "level_rules": "等级规则",
        "unconditional": "无条件"
    },
    "map": {
        "total_number_orders_placed": "下单总数",
        "view_orders": "查看订单"
    },
    "visit-form": {
        "visit_content": "拜访内容",
        "visiting_photos": "拜访照片",
        "visit_content_up_230_characters_long": "拜访内容,最多230个字符",
        "select_customer": "请选择客户",
        "fill_visit_details": "请填写拜访内容",
        "upload_visit_photos": "请上传拜访照片"
    },
    "visit-list": {
        "visit_description": "拜访描述",
        "visiting_pictures": "拜访图片"
    },
    "user-detail": {
        "contacts": "联系人",
        "contact_phone_number": "联系电话"
    },
    "user": {
        "pickup_point": "取货点",
        "superior_user": "上级用户",
        "basic_statistics": "基础统计",
        "rebate_statistics": "返佣统计",
        "go_promote": "去推广",
        "query": "查询",
        "enter_user_info_search_first": "请先输入用户信息搜索！",
        "application": "申请",
        "enter_user_id_first_name_nickname": "输入用户ID/名/昵称/会员码/手机/邮箱",
        "custom": "自定义",
        "searching": "查询中...",
        "search_users_first": "请先搜索用户",
        "apply_distribution": "申请分销"
    },
    "order-detail": {
        "user_profile_picture": "用户头像",
        "user_nickname": "用户昵称",
        "order_time_2": "下单时间"
    },
    "extraction": {
        "apply_now": "立即申请",
        "application_info_currently_under_review": "申请信息正在审核中...",
        "pickup_point_info": "取货点信息",
        "edit_information": "编辑信息",
        "pickup_order_statistics": "取货订单统计",
        "view_pickup_orders": "查看取货订单",
        "processed": "已处理",
        "current_status_also_been_terminated_data": "当前状态也解约，可重新编辑数据提交审核。",
        "application_info_review_failed": "申请信息审核失败",
        "reason": "原因："
    },
    "extraction-apply": {
        "logo_image": "logo图片",
        "suggest_300_300px": "建议300*300px",
        "alias": "别名",
        "select_province_first": "请先选择省份",
        "select_city_first": "请先选择城市",
        "attention_editing_info_re_reviewed_before": "注意：编辑信息将重新审核后方可生效",
        "alias_format_up_16_characters_long": "别名格式最多 16 个字符",
        "contact_format_between_16_characters": "联系人格式 2~16 个字符之间",
        "landline_mobile_phone": "座机 或 手机",
        "detailed_address_format_between_80_characters": "详细地址格式 1~80 个字符之间",
        "select_province": "请选择省",
        "select_city": "请选择市",
        "select_district_county": "请选择区/县",
        "data_acquisition_failed": "获取数据失败",
        "select_district_county_2": "请选择区县",
        "data_needs_re_reviewed_before_take": "数据需重新审核后方可生效"
    },
    "poster": {
        "poster_sharing": "海报分享",
        "after_saving_poster_send_wechat_friends": "保存海报后，发送给微信好友/群、QQ好友/群，分享到分朋友圈，微博等进行推广，轻轻松松赚返利！",
        "view_long_press_save": "查看长按保存",
        "regenerate": "生成"
    },
    "profit": {
        "revenue_amount": "收益金额"
    },
    "promotion-order": {
        "total_gmv_newly_added_customers": "新增客户总GMV",
        "total_gmv_orders": "订单总GMV"
    },
    "promotion-user": {
        "user_orders": "用户订单",
        "promote_users": "推广用户",
        "consumed_users": "已消费用户",
        "unconsumed_users": "未消费用户",
        "new_customers_added": "新增客户",
        "new_customers_valid": "新增客户(有效)",
        "new_customers_need_repurchase": "新增客户(需复购)",
        "consumer_orders": "消费订单",
        "last_order_time": "最后下单时间",
        "subordinate_orders": "下级订单",
        "last_order_time_subordinates": "下级最后下单时间",
        "ordered": "已下单",
        "not_placed_order": "未下单"
    },
    "recommend-form": {
        "icon": "图标",
        "suggest_100_100px": "建议100*100px",
        "related_products": "关联商品",
        "select_product": "+ 选择商品",
        "current_display": "当前展示",
        "title_format_60_characters": "标题格式1~60个字符",
        "description_format_up_200_characters_long": "描述格式最多200个字符",
        "enter_product_name": "请输入商品名称",
        "search_data_first": "请先搜索数据！",
        "fill_title": "请填写标题",
        "select_product_2": "请选择商品",
        "searching": "搜索中...",
        "selection_list_already_exists": "已存在选择列表"
    },
    "team": {
        "binding_time": "绑定时间：",
        "expiration_time": "过期时间：",
        "release_time": "解除时间：",
        "reverse": "反向",
        "order_placement_time": "下单时间：",
        "whether_place_order": "是否下单：",
        "reset": "重置",
        "start_time": "开始时间"
    }
};
var en = {
    "pages": {
        "plugins-distribution-user": "My Distribution",
        "plugins-distribution-order": "Distribution orders",
        "plugins-distribution-order-detail": "Order details",
        "plugins-distribution-profit": "Revenue details",
        "plugins-distribution-profit-detail": "Revenue details",
        "plugins-distribution-team": "My team",
        "plugins-distribution-map": "Customer distribution",
        "plugins-distribution-recommend-list": "My Recommended Treasure",
        "plugins-distribution-recommend-detail": "Recommended Treasure Details",
        "plugins-distribution-recommend-form": "Recommended Treasure Add/Edit",
        "plugins-distribution-poster": "Promotion rewards",
        "plugins-distribution-extraction": "Pickup point",
        "plugins-distribution-extraction-apply": "Pickup point info",
        "plugins-distribution-extraction-order": "Pickup order",
        "plugins-distribution-extraction-switch": "Pickup point switching",
        "plugins-distribution-introduce": "Level Introduction",
        "plugins-distribution-promotion-user": "Promote users",
        "plugins-distribution-promotion-order": "Promote orders",
        "plugins-distribution-visit-list": "Customer visits",
        "plugins-distribution-visit-form": "Customer visit addition/editing",
        "plugins-distribution-apply": "Apply for distribution",
        "plugins-distribution-apply-form": "Fill in application"
    },
    "apply": {
        "distribution_application_been_approved": "Your distribution application has been approved",
        "level": ", level: ",
        "review_time": "Review time: ",
        "application_time": "Application time: ",
        "application_info": "Application info",
        "distribution_application_under_review_wait_patie": "Your distribution application is under review. Please wait patiently.",
        "modify_info_submit_again": "You can modify the info and submit again",
        "tap_go_fill_fill_application_info": "Please tap \"Go fill in\" to fill in the application info and submit for review",
        "go_fill": "Go fill in",
        "reapply": "Reapply",
        "fill_application_form_now": "Fill in the application form now?",
        "previous_application_not_approved": "The previous application was not approved"
    },
    "apply-form": {
        "modifications_resubmitted_review_confirm_info_co": "Modifications will be resubmitted for review. Please confirm the info is correct.",
        "application_form_configured_yet_contact_administ": "The application form is not configured yet. Please contact the administrator",
        "submit_application": "Submit application",
        "save_changes": "Save changes"
    },
    "extraction-order": {
        "picking_up_goods": "Picking up goods",
        "enter_pickup_code": "Please enter the pickup code",
        "order_number_pickup_code": "Order number/pickup code",
        "enter_pickup_code_2": "Please enter the pickup code",
        "incorrect_operation_data": "Incorrect operation data"
    },
    "introduce": {
        "level_certificate": "Level certificate",
        "rebate_ratio": "Rebate ratio",
        "first_level": "First level",
        "second_level": "second level",
        "level": "Level 3",
        "level_rules": "Level rules",
        "unconditional": "Unconditional"
    },
    "map": {
        "total_number_orders_placed": "Total number of orders placed",
        "view_orders": "View orders"
    },
    "visit-form": {
        "visit_content": "Visit content",
        "visiting_photos": "Visiting photos",
        "visit_content_up_230_characters_long": "Visit content, up to 230 characters long",
        "select_customer": "Please select a customer",
        "fill_visit_details": "Please fill in the visit details",
        "upload_visit_photos": "Please upload visit photos"
    },
    "visit-list": {
        "visit_description": "Visit description",
        "visiting_pictures": "Visiting pictures"
    },
    "user-detail": {
        "contacts": "contacts",
        "contact_phone_number": "Contact phone number"
    },
    "user": {
        "pickup_point": "Pickup point",
        "superior_user": "Superior user",
        "basic_statistics": "Basic statistics",
        "rebate_statistics": "Rebate statistics",
        "go_promote": "Go promote",
        "query": "query",
        "enter_user_info_search_first": "Please enter user info to search first!",
        "application": "application",
        "enter_user_id_first_name_nickname": "Enter user ID/first name/nickname/member code/mobile phone/email",
        "custom": "custom",
        "searching": "Searching",
        "search_users_first": "Please search for users first",
        "apply_distribution": "Apply for distribution"
    },
    "order-detail": {
        "user_profile_picture": "User profile picture",
        "user_nickname": "User nickname",
        "order_time_2": "Order time"
    },
    "extraction": {
        "apply_now": "Apply Now",
        "application_info_currently_under_review": "The application info is currently under review",
        "pickup_point_info": "Pickup point info",
        "edit_information": "Edit Information",
        "pickup_order_statistics": "Pickup order statistics",
        "view_pickup_orders": "View pickup orders",
        "processed": "Processed",
        "current_status_also_been_terminated_data": "The current status has also been terminated, and the data can be re edited and submitted for review.",
        "application_info_review_failed": "Application info review failed",
        "reason": "Reason:"
    },
    "extraction-apply": {
        "logo_image": "Logo image",
        "suggest_300_300px": "Suggest 300*300px",
        "alias": "alias",
        "select_province_first": "Please select a province first",
        "select_city_first": "Please select a city first",
        "attention_editing_info_re_reviewed_before": "Attention: Editing info will be re reviewed before it can take effect",
        "alias_format_up_16_characters_long": "The alias format can be up to 16 characters long",
        "contact_format_between_16_characters": "Contact format between 2-16 characters",
        "landline_mobile_phone": "Landline or mobile phone",
        "detailed_address_format_between_80_characters": "Detailed address format between 1 and 80 characters",
        "select_province": "Please select a province",
        "select_city": "Please select a city",
        "select_district_county": "Please select district/county",
        "data_acquisition_failed": "Data acquisition failed",
        "select_district_county_2": "Please select a district or county",
        "data_needs_re_reviewed_before_take": "The data needs to be re reviewed before it can take effect"
    },
    "poster": {
        "poster_sharing": "Poster sharing",
        "after_saving_poster_send_wechat_friends": "After saving the poster, send it to WeChat friends/groups, QQ friends/groups, share it on social media, Weibo, etc. for promotion, and easily earn rebates!",
        "view_long_press_save": "View long press save",
        "regenerate": "Regenerate"
    },
    "profit": {
        "revenue_amount": "Revenue amount"
    },
    "promotion-order": {
        "total_gmv_newly_added_customers": "Total GMV of newly added customers",
        "total_gmv_orders": "Total GMV of orders"
    },
    "promotion-user": {
        "user_orders": "User orders",
        "promote_users": "Promote users",
        "consumed_users": "Consumed users",
        "unconsumed_users": "Unconsumed users",
        "new_customers_added": "New customers added",
        "new_customers_valid": "New customers (valid)",
        "new_customers_need_repurchase": "New customers (need to repurchase)",
        "consumer_orders": "Consumer orders",
        "last_order_time": "Last order time",
        "subordinate_orders": "Subordinate orders",
        "last_order_time_subordinates": "Last order time for subordinates",
        "ordered": "Ordered",
        "not_placed_order": "No order placed"
    },
    "recommend-form": {
        "icon": "icon",
        "suggest_100_100px": "Suggest 100 * 100px",
        "related_products": "Related products",
        "select_product": "+Select product",
        "current_display": "Current Display",
        "title_format_60_characters": "Title format: 1~60 characters",
        "description_format_up_200_characters_long": "Description format can be up to 200 characters long",
        "enter_product_name": "Please enter the product name",
        "search_data_first": "Please search for data first!",
        "fill_title": "Please fill in the title",
        "select_product_2": "Please select the product",
        "searching": "Searching",
        "selection_list_already_exists": "Selection list already exists"
    },
    "team": {
        "binding_time": "Binding time:",
        "expiration_time": "Expiration time:",
        "release_time": "Release time:",
        "reverse": "reverse",
        "order_placement_time": "Order placement time:",
        "whether_place_order": "Whether to place an order:",
        "reset": "Reset",
        "start_time": "start time"
    }
};
export default createPageLocaleMixin({ zh, en });

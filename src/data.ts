export const sampleData: Array<Array<any>> =
    [
    [
        "access-control.required",
        "Bắt buộc",
        "必須",
        "Required  ",
        "จำเป็น",
        "必填"
    ],
    [
        "access-control.name",
        "Mã",
        "コード",
        "Code  ",
        "โค้ด",
        "代码"
    ],
    [
        "access-control.name-description",
        "Không thể sử dụng mã đã có",
        "すでにあるコードは使用できません。",
        "Existing codes cannot be used  ",
        "โค้ดที่มีอยู่แล้วไม่สามารถใช้ได้",
        "无法使用已存在的代码。"
    ],
    [
        "access-control.performer",
        "Cách chỉ định người thực hiện",
        "実行者の指定方法",
        "How to specify the executor  ",
        "วิธีกำหนดผู้ปฏิบัติ",
        "执行者指定方式"
    ],
    [
        "access-control.tag-name",
        "Tên mã",
        "コード名称",
        "Code name  ",
        "ชื่อโค้ด",
        "代码名称"
    ],
    [
        "access-control.submit",
        "Lưu lại",
        "保存する",
        "Save  ",
        "บันทึก",
        "保存"
    ],
    [
        "access-control.cancel",
        "Hủy bỏ",
        "キャンセル",
        "Cancel  ",
        "ยกเลิก",
        "取消"
    ],
    [
        "access-control.title",
        "Quyền hạn theo vị trí",
        "ポジション権限",
        "Position permissions  ",
        "สิทธิ์ตำแหน่ง",
        "职位权限"
    ],
    [
        "access-control.sub-title",
        "Bạn có thể quản lý quyền chỉnh sửa và xem thông tin nhân viên cũng như phát lệnh dựa trên vị trí kết hợp giữa phòng ban và chức vụ",
        "部署や役職を組み合わせたポジションに対して、社員情報の編集・閲覧の制御や発令の制御を管理できます。誰が（実行者）、誰の、どの社員情報を参照・編集できるのか、の順で設定してください。",
        "You can manage the control of editing/viewing employee information and issuing orders for positions that combine departments and roles  ",
        "สามารถกำหนดสิทธิ์การเข้าถึง การแก้ไขข้อมูลพนักงานและออกประกาศตามตำแหน่ง หน้าที่และแผนก  กรุณาตั้งค่า ใคร(ผู้ปฏิบัติ)  เป็นผู้สามารถดู แก้ไขข้อมูลพนักงานคนไหนได้",
        "可为由部门与职位组合而成的岗位设置权限，用于管理员工信息的查看、编辑和指令操作权限。请依照“谁执行 → 处理谁的 → 哪些员工信息”的顺序进行设置。"
    ],
    [
        "access-control.add-btn",
        "Hãy thiết lập theo thứ tự: Ai (người thực hiện), của ai, và thông tin nhân viên nào được tham chiếu hoặc chỉnh sửa",
        "新規追加",
        "Please configure in the order: Who (executor), whose, and which employee information can be referenced/edited  ",
        "1",
        "新增"
    ],
    [
        "access-control.policy-setting.large-branch",
        "Thêm mới",
        "大型店舗 支店長クラス",
        "Add new  ",
        "ระดับผู้จัดการสาขา สาขาขนาดใหญ่",
        "大型门店 分店经理级别"
    ],
    [
        "access-control.description-title",
        "Cửa hàng lớn – Cấp chi nhánh trưởng",
        "よくある質問",
        "Large store - Branch manager level  ",
        "คำถามที่พบบ่อย",
        "常见问题"
    ],
    [
        "access-control.first-faq",
        "Câu hỏi thường gặp",
        "システム設定>権限管理における設定を行なっている場合は、ポジション権限での設定状態が優先されます。",
        "Frequently Asked Questions  ",
        "ตั้งค่าระบบ>กรณีตั้งค่ากำหนดสิทธิ์จะเรียงตามลำดับสถานะสิทธิ์ตำแหน่ง",
        "若已在系统设置 > 权限管理中设定权限时，以岗位权限中的设定为优先。"
    ],
    [
        "access-control.second-faq",
        "Nếu có thiết lập tại Cài đặt hệ thống > Quản lý quyền hạn, thì thiết lập quyền theo vị trí sẽ được ưu tiên",
        "見る人が複数のコードに該当する場合は、権限が制限されていない設定状態が優先されます。",
        "If settings are configured in System Settings > Permission Management, the settings in position permissions will take precedence  ",
        "กรณีที่ผู้ดูมีหลายโค้ดที่เข้าข่าย จะเรียงลำดับจากสถานะตั้งค่าที่ไม่ได้กำหนดสิทธิ์",
        "当查看人符合多个代码的条件时，未被限制的权限将被设定为优先。"
    ],
    [
        "access-control.third-faq",
        "Nếu người xem thuộc nhiều mã, mã không bị giới hạn quyền sẽ được ưu tiên",
        "見る人が部署や役職を兼務している場合は、それぞれに該当するコードが適用されます。",
        "If the viewer falls under multiple codes, the setting without restrictions takes precedence  ",
        "กรณีที่ผู้ดูควบหลายแผนก ตำแหน่ง โค้ดของแต่ละอันจะถูกใช้งาน",
        "查看人若同时兼任多个部门或职务，各自对应的代码权限均会被适用。"
    ],
    [
        "access-control.permission-btn",
        "Nếu người xem kiêm nhiệm nhiều phòng ban/chức vụ, tất cả mã liên quan đều được áp dụng",
        "権限管理はこちら",
        "If the viewer holds multiple departments or positions concurrently, all applicable codes will be applied  ",
        "ควบคุมสิทธิ์ที่นี่",
        "前往权限管理"
    ],
    [
        "access-control.add-target",
        "Quản lý quyền hạn tại đây",
        "マスタランク設定はこちら",
        "Permission management is here  ",
        "ตั้งค่ามาสเตอร์แรงค์ที่นี่",
        "前往主数据等级级设置"
    ],
    [
        "access-control.family-name",
        "Thiết lập cấp bậc master tại đây",
        "氏名",
        "Master rank settings are here  ",
        "ชื่อ",
        "姓名"
    ],
    [
        "access-control.messages.error-regex-half-width",
        "Họ tên",
        "半角英数値のみ入力できます。",
        "Name  ",
        "1",
        "只能用半角英文字母和数字输入"
    ],
    [
        "access-control.character",
        "Chỉ được nhập ký tự alphabet và số dạng bán rộng",
        "文字",
        "Only alphanumeric characters can be entered  ",
        "ตัวอักษร",
        "文字"
    ],
    [
        "access-control.confirm-checkbox",
        "Ký tự",
        "上記の内容に同意する",
        "Character  ",
        "เห็นด้วยกับเนื้อหาข้างต้น",
        "同意上述内容"
    ],
    [
        "access-control.search-placeholder",
        "Đồng ý với nội dung trên",
        "番号や名称で検索",
        "Agree to the above content  ",
        "ค้นหาด้วยหมายเลข ชื่อ",
        "通过编号或名称搜索"
    ],
    [
        "access-control.code",
        "Tìm kiếm theo số hoặc tên",
        "コード",
        "Search by number or name  ",
        "โค้ด",
        "代码"
    ],
    [
        "access-control.items",
        "Mã",
        "10件",
        "Code  ",
        "10 รายการ",
        "10条"
    ],
    [
        "access-control.items",
        "10 mục",
        "20件",
        "10 items  ",
        "20 รายการ",
        "20条"
    ],
    [
        "access-control.items",
        "20 mục",
        "50件",
        "20 items  ",
        "50 รายการ",
        "50条"
    ],
    [
        "access-control.table.code-number",
        "50 mục",
        "コード番号",
        "50 items  ",
        "เบอร์โค้ด",
        "代码编号"
    ],
    [
        "access-control.table.code-name",
        "Mã số",
        "コード名称",
        "Code number  ",
        "ชื่อโค้ด",
        "代码名称"
    ],
    [
        "access-control.table.code-status",
        "Tên mã",
        "ステータス",
        "Code name  ",
        "สถานะ",
        "状态"
    ],
    [
        "access-control.table.no-data",
        "Trạng thái",
        "データはありません",
        "Status  ",
        "ไม่มีข้อมูล",
        "无数据"
    ],
    [
        "access-control.status.invalid",
        "Không có dữ liệu",
        "無効",
        "No data  ",
        "ปิดใช้งาน",
        "无效"
    ],
    [
        "access-control.status.applied",
        "Vô hiệu",
        "有効",
        "Inactive  ",
        "เปิดใช้งาน",
        "有效"
    ],
    [
        "access-control.status.applying",
        "Hiệu lực",
        "処理中",
        "Active  ",
        "กำลังประมวลผล",
        "处理中"
    ],
    [
        "access-control.status.not-applied",
        "Đang xử lý",
        "変更が適用されていません",
        "Processing  ",
        "การเปลี่ยนแปลงไม่ได้รับการแก้ไข",
        "变更不适用"
    ],
    [
        "access-control.include-sub-department",
        "Thay đổi chưa được áp dụng",
        "配下部署を含める",
        "Changes have not been applied  ",
        "รวมถึงแผนกใต้บังคับบัญชา",
        "包含下属部门"
    ],
    [
        "access-control.remove-restriction",
        "Bao gồm các phòng ban cấp dưới",
        "設定を削除する",
        "Include subordinate departments  ",
        "ลบการตั้งค่า",
        "删除设定"
    ],
    [
        "access-control.menu-setting",
        "Xóa cài đặt",
        "メニュー設定",
        "Delete setting  ",
        "ตั้งค่าเมนู",
        "菜单设定"
    ],
    [
        "access-control.employee-restriction",
        "Cài đặt menu",
        "社員情報閲覧制限",
        "Menu settings  ",
        "จำกัดการเข้าถึงข้อมูลพนักงาน",
        "员工信息查看限制"
    ],
    [
        "access-control.delete2",
        "Giới hạn xem thông tin nhân viên",
        "削除する",
        "Employee information viewing restriction  ",
        "ลบ",
        "删除"
    ],
    [
        "access-control.delete-warning",
        "Xóa",
        "削除を実行すると、元に戻すことができません。",
        "Delete  ",
        "หากทำการลบข้อมูลแล้วจะไม่สามารถคืนค่าได้",
        "执行删除后将无法还原"
    ],
    [
        "access-control.toast-msg.deleted-success",
        "Khi xóa sẽ không thể khôi phục",
        "削除しました",
        "Once deleted, it cannot be undone  ",
        "ทำการลบเรียบร้อย",
        "已删除"
    ],
    [
        "access-control.toast-msg.has-error",
        "Đã xóa",
        "エラーが発生しました",
        "Deleted  ",
        "เกิดข้อผิดพลาด",
        "发生错误"
    ],
    [
        "access-control.start-date",
        "Đã xảy ra lỗi",
        "開始日時",
        "An error has occurred  ",
        "วัน เวลาที่เริ่ม",
        "开始时间"
    ],
    [
        "access-control.end-date",
        "Thời gian bắt đầu",
        "終了日時",
        "Start date and time  ",
        "วัน เวลาที่แล้วเสร็จ",
        "结束时间"
    ],
    [
        "access-control.input-placeholder",
        "Thời gian kết thúc",
        "入力してください",
        "End date and time  ",
        "กรุณากรอก",
        "请输入"
    ],
    [
        "access-control.select-placeholder",
        "Vui lòng nhập",
        "選択してください",
        "Please enter  ",
        "กรุณาเลือก",
        "请选择"
    ],
    [
        "access-control.published-info",
        "Vui lòng chọn",
        "発令情報に従う",
        "Please select  ",
        "ปฏิบัติตามข้อมูลที่ออกประกาศ",
        "依照任命信息"
    ],
    [
        "access-control.by-name",
        "Theo thông tin phát lệnh",
        "バイネーム",
        "Follow order information  ",
        "by name",
        "by name"
    ],
    [
        "access-control.will-enroll",
        "Theo tên",
        "在籍予定",
        "By name  ",
        "กำหนดทำงาน",
        "预计在职"
    ],
    [
        "access-control.rejoin",
        "Dự kiến làm việc",
        "再入社予定",
        "Scheduled to be employed  ",
        "กำหนด",
        "预计复职"
    ],
    [
        "access-control.enrollment",
        "Dự kiến tái gia nhập",
        "在籍",
        "Scheduled to rejoin  ",
        "ทำงาน",
        "在职"
    ],
    [
        "access-control.job-assignment",
        "Đang làm việc",
        "出向",
        "Employed  ",
        "ประจำการที่อื่น",
        "外派"
    ],
    [
        "access-control.leave",
        "Phái cử",
        "休職",
        "Seconded  ",
        "พักงาน",
        "休职"
    ],
    [
        "access-control.retire",
        "Nghỉ việc tạm thời",
        "退職",
        "On leave  ",
        "ลาออก",
        "离职"
    ],
    [
        "access-control.paginate",
        "Đã nghỉ việc",
        "{total}件中 {from}~{to}件を表示中",
        "Resigned  ",
        "แสดงผลรายการ {จาก}~{ถึง} ของรายการ {ทั้งหมด}",
        "正在显示第 {from}～{to} 条，共 {total} 条"
    ],
    [
        "access-control.config-output",
        "Hiển thị từ {from} đến {to} trong tổng số {total} mục",
        "設定の出力",
        "Showing {from} to {to} of {total} entries  ",
        "ส่งออกข้อมูล",
        "导出设定"
    ],
    [
        "access-control.enable",
        "Xuất cài đặt",
        "有効にする",
        "Export settings  ",
        "เปิดการใช้งาน",
        "启用"
    ],
    [
        "access-control.disable",
        "Bật",
        "無効にする",
        "Enable  ",
        "ปิดการใช้งาน",
        "停用"
    ],
    [
        "access-control.update-auth-setting",
        "Tắt",
        "ただいまポジション権限の設定を更新中です。",
        "Disable  ",
        "ขณะนี้กำลังอัพเดทการตั้งค่าสิทธิ์ตำแหน่ง",
        "正在更新岗位权限设定"
    ],
    [
        "access-control.not-any-changes",
        "Đang cập nhật quyền hạn theo vị trí",
        "変更が適用されていません。画面右上の3点リーダーから「有効にする」処理を行なってください。",
        "Currently updating position permissions  ",
        "การเปลี่ยนแปลงไม่สำเร็จ กรุณา\"เปิดการใช้งาน\"จาก 3 Point leader ด้านขวาบนจอ",
        "更改尚未应用。请点击页面右上角的三点图标执行“启用”操作。"
    ],
    [
        "access-control.executor",
        "Chưa áp dụng thay đổi",
        "実行者",
        "Changes have not been applied. Please click the three-dot menu at the top right and select \"Enable\"  ",
        "ผู้ปฏิบัติ",
        "操作人"
    ],
    [
        "access-control.group-setting-desc",
        "Vui lòng nhấn vào biểu tượng ba chấm ở góc trên bên phải để bật",
        "設定対象となるグループの設定です。「発令情報に従う」で実行者を指定すると、発令に従って自動的に対象者が変動します。",
        "Executor  ",
        "การตั้งค่ากลุ่มที่เป็นกลุ่มเป้าหมาย หากกำหนดค่าผู้ปฏิบัติเป็น \"ปฏิบัติตามข้อมูลที่ออกประกาศ\"  เป้าหมายจะมีการเปลี่ยนแปลงตามการออกประกาศโดยอัตโนมัติ",
        "为设定对象的群组设定。选择“依照任命信息”指定操作人时，根据任命自动变更对象成员。"
    ],
    [
        "access-control.target-setting-desc",
        "Người thực hiện",
        "実行者は、どの社員情報を参照・編集できるのか、発令を行えるのかを設定します。誰（：対象者）の社員情報にアクセスできるかは、部署・役職などの発令情報によって指定するか、バイネームで指定してください。",
        "Settings for the target group  ",
        "ผู้ปฏิบัติตั้งค่าพนักงานคนไหนสามารถดู แก้ไขได้หรือไม่ได้ ออกประกาศได้หรือไม่ได้  การสามารถเข้าถึงข้อมูลพนักงานคนไหน(:บุคคลเป้าหมาย) ให้กำหนดโดยข้อมูลออกประกาศเช่น แผนก ตำแหน่งเป็นต้น หรือกำหนดด้วย by name",
        "操作人可设定查看、编辑员工信息，也可以设定是否执行任命操作。可通过部门、职位等任命信息指定查看或编辑“谁（对象）”的信息，也可通过姓名指定。"
    ],
    [
        "access-control.activate-code",
        "Cài đặt áp dụng cho nhóm",
        "コードを有効にする",
        "If the executor is specified as \"Follow order information\", the target person will automatically change based on the order  ",
        "เปิดใช้งานโค้ด",
        "使代码生效"
    ],
    [
        "access-control.activate-status-desc",
        "Khi chỉ định người thực hiện theo \"Thông tin phát lệnh\", đối tượng sẽ tự động thay đổi",
        "を有効にします。有効にすると、社員情報閲覧制限の設定が、実行者に適用されます。",
        "Set which employee information the executor can reference/edit and whether they can issue orders  ",
        "เปิดการใช้งาน หากเปิดการใช้งานแล้วการตั้งค่ากำหนดสิทธิ์ดูข้อมูลพนักงานจะถูกใช้ที่ผู้ปฏิบัติ",
        "使代码生效。代码生效后，员工信息查看限制设定将适用于操作人。"
    ],
    [
        "access-control.disable-code",
        "Thiết lập thông tin nhân viên nào người thực hiện có thể xem/chỉnh sửa và có quyền phát lệnh",
        "コードを無効にする",
        "Access to employee information is defined either by order information such as department/role or specified by name  ",
        "ปิดการใช้งานโค้ด",
        "停用代码"
    ],
    [
        "access-control.disable-status-desc",
        "Quyền truy cập thông tin nhân viên được xác định theo phát lệnh hoặc chỉ định cụ thể theo tên",
        "を無効にします。コードを無効にすると、設定が適用されなくなります。",
        "Enable code  ",
        "ปิดการใช้งาน หากปิดการใช้งานแล้วการตั้งค่าจะไม่ถูกใช้งาน",
        "将停用该代码。停用后，此设定将不再生效。"
    ],
    [
        "access-control.toast-msg.changed-success",
        "Bật mã",
        "変更しました",
        "When enabled, employee information viewing restrictions will apply to the executor  ",
        "เปลี่ยนแปลงแล้ว",
        "已更改"
    ],
    [
        "access-control.remove-code",
        "Khi bật, giới hạn xem thông tin nhân viên sẽ được áp dụng cho người thực hiện",
        "コードを削除する",
        "Disable code  ",
        "ลบโค้ด",
        "删除代码"
    ],
    [
        "access-control.remove-status-desc",
        "Tắt mã",
        "を削除します。削除したコードは、元に戻すことができません。",
        "When disabled, the settings will no longer be applied  ",
        "ลบ โค้ดที่ลบแล้วจะไม่สามารถคืนค่าได้",
        "删除。被删除的代码无法还原。"
    ],
    [
        "access-control.self",
        "Khi tắt, các thiết lập sẽ không còn hiệu lực",
        "本人",
        "Changes made  ",
        "ตนเอง",
        "本人"
    ],
    [
        "access-control.edit",
        "Đã thay đổi",
        "編集する",
        "Delete code  ",
        "แก้ไข",
        "编辑"
    ],
    [
        "access-control.editable-desc",
        "Xóa mã",
        "実行者が本人のどの社員情報を参照・編集できるのか、発令を行えるのかを設定します。",
        "Deleting a code cannot be undone  ",
        "ผู้ปฏิบัติตั้งค่าให้ตนเองสามารถดู แก้ไขข้อมูลพนักงานคนอื่นได้ ออกประกาศได้",
        "操作人可以设置自己查看、编辑哪些员工信息，也可以设置自己是否可以进行任命操作。"
    ],
    [
        "access-control.others",
        "Mã đã xóa sẽ không thể khôi phục",
        "他者",
        "Self  ",
        "ผู้อื่น",
        "他人"
    ],
    [
        "access-control.refer-instruction",
        "Chính bản thân",
        "実行者が他者のどの社員情報を参照・編集できるのか、発令を行えるのかを設定します。",
        "Set which of their own employee information the executor can reference/edit and issue orders for  ",
        "ผู้ปฏิบัติตั้งค่าให้ผู้อื่นสามารถดู แก้ไขข้อมูลพนักงานคนอื่นได้ ออกประกาศได้",
        "操作人可以设置他人查看、编辑哪些员工信息，也可以设置他人是否可以进行任命操作。"
    ],
    [
        "access-control.setting-by-announcement",
        "Thiết lập thông tin nào của bản thân có thể được xem/chỉnh sửa và phát lệnh",
        "設定一覧（発令情報に従う）",
        "Others  ",
        "รายการการตั้งค่า(ตามข้อมูลประกาศ)",
        "设定列表（根据任命信息）"
    ],
    [
        "access-control.setting-by-individual",
        "Người khác",
        "設定一覧（個別）",
        "Set which employee information of others the executor can reference/edit and issue orders for  ",
        "รายการการตั้งค่า(รายบุคคล)",
        "设定列表（个别）"
    ],
    [
        "access-control.conflict-condition",
        "Thiết lập thông tin nào của người khác có thể được xem/chỉnh sửa và phát lệnh",
        "「発令情報に従う」の設定と重複する場合は、「個別」の設定が優先されます。",
        "Settings list (follow order information)  ",
        "กรณีตั้งค่า \"ตามข้อมูลประกาศ\" ซ้ำซ้อนกันจะเรียงตาม \"รายบุคคล\" ก่อน",
        "如果与“根据任命信息”的设定存在重复，则优先“个别”设定。"
    ],
    [
        "access-control.retired-people",
        "Danh sách thiết lập (Theo phát lệnh)",
        "退職者",
        "Settings list (individual)  ",
        "ผู้ลาออก",
        "离职者"
    ],
    [
        "access-control.access-instruction",
        "Danh sách thiết lập (Cá nhân)",
        "実行者は退職した社員の情報にアクセスできるか設定してください。",
        "If overlapping with “Follow order information,” the “Individual” settings take precedence  ",
        "ผู้ปฏิบัติกรุณาตั้งค่าว่าสามารถเข้าถึงข้อมูลพนักงานที่ลาออกได้หรือไม่",
        "请设定操作人是否可以访问已离职员工的信息。"
    ],
    [
        "access-control.enroll-classification",
        "Nếu trùng với thiết lập “Theo phát lệnh”, thì thiết lập “Cá nhân” sẽ được ưu tiên",
        "在籍区分",
        "Resigned employees  ",
        "ประเภทการทำงาน",
        "在籍区分"
    ],
    [
        "access-control.employee-info",
        "Người đã nghỉ việc",
        "社員情報",
        "Set whether the executor can access information of resigned employees  ",
        "ข้อมูลพนักงาน",
        "员工信息"
    ],
    [
        "access-control.configured",
        "Cài đặt quyền truy cập thông tin của nhân viên đã nghỉ",
        "設定済み",
        "Employment status  ",
        "ตั้งค่าแล้วเสร็จ",
        "已设定"
    ],
    [
        "access-control.not-set",
        "Phân loại tình trạng làm việc",
        "未設定",
        "Employee information  ",
        "ยังไม่ได้ตั้งค่า",
        "未设定"
    ],
    [
        "access-control.allow",
        "Thông tin nhân viên",
        "許可",
        "Set  ",
        "อนุมัติ",
        "允许"
    ],
    [
        "access-control.restriction",
        "Đã cài đặt",
        "制限",
        "Not set  ",
        "จำกัด",
        "限制"
    ],
    [
        "access-control.remove-restriction-desc",
        "Chưa cài đặt",
        "の設定を削除します。削除した設定は、元に戻すことができません。",
        "Allowed  ",
        "ลบการตั้งค่าของ  การตั้งค่าที่ลบไปแล้วไม่สามารคืนค่าได้",
        "删除该设定。删除后将无法恢复。"
    ],
    [
        "access-control.target-spec",
        "Cho phép",
        "対象の指定",
        "Restricted  ",
        "กำหนดเป้าหมาย",
        "指定"
    ],
    [
        "access-control.list-people-desc",
        "Hạn chế",
        "以下の情報に当てはまる人を含める",
        "Delete setting  ",
        "ข้อมูลด้านล่างครอบคลุมถึงคนที่กำหนด",
        "包含符合以下信息的人员"
    ],
    [
        "access-control.project",
        "Xóa thiết lập",
        "項目",
        "Deleted settings cannot be undone  ",
        "หัวข้อ",
        "项目"
    ],
    [
        "access-control.value",
        "Thiết lập đã xóa sẽ không thể hoàn tác",
        "値",
        "Specify target  ",
        "ค่า",
        "数值"
    ],
    [
        "access-control.delete",
        "Chỉ định đối tượng",
        "削除",
        "Include people who match the following information  ",
        "ลบ",
        "删除"
    ],
    [
        "access-control.add-item",
        "Bao gồm những người khớp với các thông tin sau",
        "項目を追加する",
        "Item  ",
        "เพิ่มหัวข้อ",
        "添加项目"
    ],
    [
        "access-control.exclude-spec",
        "Hạng mục",
        "対象外の指定",
        "Value  ",
        "กำหนดไม่ใช่เป้าหมาย",
        "排除对象指定"
    ],
    [
        "access-control.exclude-desc",
        "Giá trị",
        "以下の情報に当てはまる人を除外する",
        "Delete  ",
        "ข้อมูลด้านล่างไม่ครอบคลุมถึงคนที่กำหนด",
        "排除符合以下信息的人员"
    ],
    [
        "access-control.include-subordinates",
        "Xóa",
        "配下を含む",
        "Add item  ",
        "รวมผู้ใต้บังคับบัญชา",
        "包含下属"
    ],
    [
        "access-control.not-include-sub",
        "Thêm hạng mục",
        "配下を含まない",
        "Exclude target  ",
        "ไม่รวมผู้ใต้บังคับบัญชา",
        "不包含下属"
    ],
    [
        "access-control.enter-department",
        "Loại trừ đối tượng",
        "部署を入力してください",
        "Exclude people who match the following information  ",
        "กรุณากรอกแผนก",
        "请输入部门"
    ],
    [
        "access-control.no-setting",
        "Loại trừ những người khớp với các thông tin sau",
        "設定なし",
        "Include subordinates  ",
        "ไม่มีการกำหนดค่า",
        "未设定"
    ],
    [
        "access-control.by-affiliate-department",
        "Bao gồm cấp dưới",
        "所属部署",
        "Do not include subordinates  ",
        "แผนกสังกัดของตนเอง",
        "所属部门"
    ],
    [
        "access-control.by-manager-department",
        "Không bao gồm cấp dưới",
        "所属長部署",
        "Please enter department  ",
        "แผนกสังกัดของหัวหน้า",
        "直属上级部门"
    ],
    [
        "access-control.include-sub",
        "Vui lòng nhập phòng ban",
        "配下含む",
        "No settings  ",
        "รวมผู้ใต้บังคับบัญชา",
        "包含下属"
    ],
    [
        "access-control.not-include-sub",
        "Không có thiết lập",
        "配下含まない",
        "Affiliated department  ",
        "ไม่รวมผู้ใต้บังคับบัญชา",
        "不包含下属"
    ],
    [
        "access-control.list-executor",
        "Phòng ban trực thuộc",
        "実行者一覧",
        "Manager's department  ",
        "รายการผู้ปฏิบัติ",
        "操作人列表"
    ],
    [
        "access-control.re-check",
        "Phòng ban trưởng trực thuộc",
        "実行者を確認する",
        "Include subordinates  ",
        "ตรวจสอบผู้ปฏิบัติ",
        "确认操作人"
    ],
    [
        "access-control.output",
        "Bao gồm cấp dưới",
        "出力する",
        "Do not include subordinates  ",
        "ส่งออก",
        "导出"
    ],
    [
        "access-control.export-data",
        "Không bao gồm cấp dưới",
        "データを出力します。",
        "Executor list  ",
        "ส่งออกข้อมูล",
        "导出数据。"
    ],
    [
        "access-control.deploy",
        "Danh sách người thực hiện",
        "部署",
        "Check executor  ",
        "แผนก",
        "部门"
    ],
    [
        "access-control.post",
        "Xác nhận người thực hiện",
        "役職",
        "Export  ",
        "ตำแหน่ง",
        "职位"
    ],
    [
        "access-control.profile",
        "Xuất dữ liệu",
        "プロフィール",
        "Department  ",
        "โปรไฟล์",
        "个人资料"
    ],
    [
        "access-control.access-employee-instruction",
        "Phòng ban",
        "対象者のどの社員情報にアクセスできるのかを設定してください。未設定の場合、実行者は該当情報を参照できません。",
        "Position  ",
        "กรุณาตั้งค่าการเข้าถึงข้อมูลพนักงานของบุคคลเป้าหมาย หากไม่ได้ตั้งค่าผู้ปฏิบัติจะไม่สามารถดูข้อมูลที่เกี่ยวข้องได้",
        "请设定可访问的员工信息范围。若未进行设定，操作者将无法查看相关信息。"
    ],
    [
        "access-control.saved",
        "Chức vụ",
        "保存しました",
        "Profile  ",
        "บันทึกข้อมูลแล้ว",
        "已保存"
    ],
    [
        "access-control.spec-base-person",
        "Hồ sơ cá nhân",
        "本人を基準に指定する",
        "Set which employee information of the target can be accessed  ",
        "กำหนดตนเองเป็นมาตราฐาน",
        "以本人为基准指定"
    ],
    [
        "access-control.spec-lower",
        "Cài đặt thông tin nhân viên cụ thể nào người thực hiện có thể truy cập",
        "マスタで指定する",
        "If not set, the executor cannot reference the corresponding information  ",
        "กำหนดโดยมาสเตอร์",
        "从主数据中指定"
    ],
    [
        "access-control.similar",
        "Nếu chưa cài đặt, sẽ không thể truy cập",
        "本人と同等",
        "Saved  ",
        "เทียบเท่าตนเอง",
        "与本人相同"
    ],
    [
        "access-control.below",
        "Đã lưu",
        "本人以下",
        "Specify based on self  ",
        "น้อยกว่าตนเอง",
        "低于本人"
    ],
    [
        "access-control.lower",
        "Chỉ định dựa trên bản thân",
        "本人より下",
        "Specify in Master  ",
        "ใต้ตนเอง",
        "低于本人等级"
    ],
    [
        "access-control.by-department",
        "Chỉ định từ Master",
        "組織図から選択",
        "Same as self  ",
        "เลือกจากผังองค์กร",
        "从组织结构图中选择"
    ],
    [
        "access-control.by-affiliate-department",
        "Bằng cấp bản thân",
        "所属部署",
        "Below self  ",
        "แผนกสังกัดของตนเอง",
        "所属部门"
    ],
    [
        "access-control.by-manager-department",
        "Thấp hơn bản thân",
        "所属長部署",
        "Lower than self  ",
        "แผนกสังกัดของหัวหน้า",
        "直属上级部门"
    ],
    [
        "access-control.target-destination",
        "Dưới cấp bản thân",
        "対象者の指定",
        "Select from org chart  ",
        "กำหนดบุคคลเป้าหมาย",
        "指定对象"
    ],
    [
        "access-control.target-desc",
        "Chọn từ sơ đồ tổ chức",
        "誰の社員情報にアクセスできるのかを指定してください。",
        "Affiliated department  ",
        "กรุณากำหนดข้อมูลพนักงานคนไหนสามารถเข้าถึงได้",
        "请指定可以访问的员工信息。"
    ],
    [
        "access-control.relevant-instruction",
        "Phòng ban trực thuộc",
        "本人と同等：見る人の役職|等級A|等級B などが見られる人のそれと同じ",
        "Manager's department  ",
        "เทียบเท่ากับตนเอง : ให้การเข้าถึงข้อมูลเหมือนกันกับตำแหน่งตนเอง เช่น ชั้นA ชั้นB เป็นต้น",
        "与本人同级：查看者的职位｜等级A｜等级B等 与被查看者相同"
    ],
    [
        "access-control.below-instruction",
        "Phòng ban trưởng trực thuộc",
        "本人以下：見る人の役職|等級A|等級Bなどが見られる人と同等もしくはそれより下",
        "Specify target  ",
        "ตนเองและตำ่กว่า : ให้การเข้าถึงข้อมูลเหมือนกันหรือต่ำกว่ากับตำแหน่งตนเอง เช่น ชั้นA ชั้นB เป็นต้น",
        "低于本人：查看者的职位｜等级A｜等级B等与被查看人其相同或更低"
    ],
    [
        "access-control.lower-instruction",
        "Chỉ định đối tượng",
        "本人より下：見る人の役職|等級A|等級Bなどが見られる人のそれより下",
        "Specify whose employee information can be accessed  ",
        "ตำ่กว่าตนเอง : ให้การเข้าถึงข้อมูลในระดับที่ต่ำกว่ากับตำแหน่งตนเอง เช่น ชั้นA ชั้นB เป็นต้น",
        "比本人更低：查看者的职位｜等级A｜等级B等低于被查看人"
    ],
    [
        "access-control.example-instruction",
        "Chỉ định ai là người mà người thực hiện có thể truy cập thông tin",
        "例えば、部署「人事部、営業部」と役職「本人より下」を選択した場合は、下記に当てはまる社員が対象になります。",
        "Same as self: Viewable if same as viewer's role | Grade A | Grade B  ",
        "ตัวอย่างเช่น กรณีเลือก แผนกบุคคล แผนกขาย หัวข้อตนเองและตำ่กว่าจะครอบคลุมพนักงานเป้าหมายตามด้านล่างนี้",
        "例如，若选择部门“人事部、营业部”与职位“比本人更低”，则以下员工将被视为对象："
    ],
    [
        "access-control.hr-executor",
        "Bằng cấp bản thân: Chức vụ/cấp bậc giống như người thực hiện",
        "人事部の自分（:実行者）より下の役職の社員",
        "Below self: Viewable if same or lower than viewer's role | Grade A | Grade B  ",
        "พนักงานที่ตำแหน่งตำ่กว่าตนเอง(ผู้ปฏิบัติ)แผนกบุคคล",
        "人事部中职位低于自己（操作人）的员工"
    ],
    [
        "access-control.sale-executor",
        "Thấp hơn bản thân: Tương đương hoặc thấp hơn người thực hiện",
        "営業部の自分（:実行者）より下の役職の社員",
        "Lower than self: Viewable only if lower than viewer's role | Grade A | Grade B  ",
        "พนักงานที่ตำแหน่งตำ่กว่าตนเอง(ผู้ปฏิบัติ)แผนกขาย",
        "营业部中职位低于自己（操作人）的员工"
    ],
    [
        "access-control.master-rank-settings-btn",
        "Dưới cấp bản thân: Thấp hơn người thực hiện",
        "マスタランク設定はこちら",
        "Example: If selecting department “HR, Sales” and role “Lower than self,” the target employees are:  ",
        "ตั้งค่ามาสเตอร์แรงค์ที่นี่",
        "点击此处进行主数据等级设置"
    ],
    [
        "access-control.target_policies.input_name",
        "Ví dụ: Nếu chọn phòng ban “Phòng Nhân sự, Phòng Kinh doanh” và chức vụ “Dưới cấp bản thân”, thì áp dụng cho",
        "対象者の指定方",
        "Employees in HR with lower roles than the executor  ",
        "วิธีกำหนดบุคคลเป้าหมาย",
        "对象者的指定方法"
    ],
    [
        "access-control.issue-process",
        "Nhân viên có chức vụ thấp hơn trong Phòng Nhân sự và Phòng Kinh doanh so với người thực hiện",
        "発令処理",
        "Employees in Sales with lower roles than the executor  ",
        "ดำเนินการออกประกาศ",
        "指令处理"
    ],
    [
        "access-control.issuance-instruction",
        "Thiết lập cấp bậc Master tại đây",
        "対象者の発令を実行（編集）できるのかを設定してください。システム設定 > 権限管理 > 管理者メニュー において「発令」が「表示可」なロールが適用されている実行者のみが対象です。",
        "Master rank settings are here  ",
        "กรุณาตั้งค่าให้สามารถดำเนินการออกประกาศ(แก้ไข) บุคคลเป้าหมายได้หรือไม่ได้ ในตั้งค่าระบบ >ควบคุมสิทธิ์ >เมนูผู้ควบคุม จะมีผู้ปฏิบัติที่มีหน้าที่ \"ออกประกาศ\"  \"ให้แสดงผล\" เท่านั้น",
        "请设定是否可以对对象执行（编辑）指令。仅当操作者在「系统设置 > 权限管理 > 管理者菜单」中所适用的角色对“指令”为“可见”时才为对象。"
    ],
    [
        "access-control.access-goal-management",
        "Cách chỉ định đối tượng",
        "対象者に目標管理の設定や出力ができるのかを設定してください。システム設定 > 権限管理 > 管理者メニューにおいて「目標管理設定」が「表示可」なロールが適用されている実行者のみが対象です。",
        "Target specification method  ",
        "กรุณาตั้งค่าการควบคุมเป้าหมาย ส่งออกให้กับบุคคลเป้าหมาย  ในตั้งค่าระบบ >ควบคุมสิทธิ์ >เมนูผู้ควบคุม จะมีผู้ปฏิบัติที่มีหน้าที่ \"ตั้งค่าการควบคุมเป้าหมาย\" \"ให้แสดงผล\" เท่านั้น",
        "请设定是否可以对对象进行目标管理的设定与数据输出。仅当操作人在「系统设置 > 权限管理 > 管理者菜单」中所适用的角色对“目标管理设定”为“可见”时才为对象。"
    ],
    [
        "access-control.target-setting-title",
        "Xử lý phát lệnh",
        "できること",
        "Order processing  ",
        "ส่ิงที่สามารถทำได้",
        "可执行的事项："
    ],
    [
        "access-control.goal-setting-admin",
        "Thiết lập quyền chỉnh sửa phát lệnh của đối tượng",
        "管理者メニュー > 目標管理設定 にて対象者の下記の設定が行える",
        "Set whether the executor can issue (edit) orders for the target  ",
        "สามารถตั้งค่าตามด้านล่างของบุคคลเป้าหมายได้ที่ เมนูผู้ควบคุม >ตั้งค่าควบคุมเป้าหมาย",
        "可通过 管理者菜单 > 目标管理设置 执行以下设定"
    ],
    [
        "access-control.list.announcement1",
        "Chỉ áp dụng với người thực hiện có vai trò được chỉ định là “Hiển thị” trong Quản lý hệ thống > Quản lý quyền hạn > Menu quản trị",
        "\"管理者メニュー > 発令処理にて対象者の入社・配属・異動・休職・再入社・退職の発令処理を行える\"",
        "Only executors with a role marked “Visible” in System Settings > Permission Management > Admin Menu are applicable  ",
        "สามารถดำเนินการประกาศการเข้าทำงาน คู่สมรส โยกย้าย พักงาน เข้าทำงานใหม่ ลาออกได้ที่ เมนูผู้ควบคุม >ดำเนินการประกาศ",
        "可通过 “管理者菜单 > 指令处理” 处理对象的入职・分配・调动・休职・再入职・离职等指令"
    ],
    [
        "access-control.list.announcement2",
        "Thiết lập quyền thiết lập và xuất quản lý mục tiêu",
        "\"対象者の パーソナルプロファイル > 履歴編集 において、発令情報の編集が行える\"",
        "Set whether the executor can configure or export goal management for the target  ",
        "สามารถแก้ไขข้อมูลออกประกาศได้ที่ แฟ้มส่วนบุคคล > แก้ไขประวัติ  ของบุคคลเป้าหมาย",
        "可在对象的 个人档案 > 履历编辑 中编辑指令信息"
    ],
    [
        "access-control.list.announcement3",
        "Chỉ người thực hiện có vai trò “Hiển thị” trong Quản lý hệ thống > Quản lý quyền hạn > Menu quản trị",
        "\"一括登録>発令処理>入社・配属・異動・休職・再入社・退職 にて発令情報の出力・更新が行える\"",
        "Only executors with a role marked “Visible” in System Settings > Permission Management > Admin Menu are applicable  ",
        "สามารถส่งออกข้อมูล อัพเดทข้อมูลออกประกาศได้ที่ ลงทะเบียนทั้งหมด >ดำเนินการออกประกาศ >เข้าทำงาน คู่สมรส โยกย้าย พักงาน เข้าทำงานใหม่ ลาออก",
        "可通过 ”批量注册 > 指令处理 > 入职・分配・调动・休职・再入职・离职“ 执行导出与更新指令信息的操作"
    ],
    [
        "access-control.list-mbo1",
        "Có thể thực hiện",
        "評価ルート組織設定",
        "Capabilities  ",
        "ตั้งค่าเส้นทางการประเมินองค์กร",
        "评价路线组织设置"
    ],
    [
        "access-control.list-mbo2",
        "Tại Menu quản trị > Quản lý mục tiêu có thể thiết lập các nội dung sau cho đối tượng",
        "評価ルート個人設定",
        "In Admin Menu > Goal Management, the following settings can be configured for the target  ",
        "ตั้งค่าเส้นทางการประเมินบุคคล",
        "评价路线个人设置"
    ],
    [
        "access-control.list-mbo3",
        "Tại Menu quản trị > Xử lý phát lệnh có thể thực hiện các thao tác nhập công ty, điều chuyển, nghỉ việc tạm thời, tái nhập công ty, nghỉ việc",
        "評価ルート操作",
        "In Admin Menu > Order Processing, entry, assignment, transfer, leave, re-entry, and resignation can be issued for the target  ",
        "การใช้งานเส้นทางการประเมิน",
        "评价路线操作"
    ],
    [
        "access-control.list-mbo4",
        "Tại Hồ sơ cá nhân > Chỉnh sửa lịch sử có thể chỉnh sửa thông tin phát lệnh",
        "目標データ",
        "In Personal Profile > Edit History, order information can be edited  ",
        "ข้อมูลเป้าหมาย",
        "目标数据"
    ],
    [
        "access-control.list-mbo5",
        "Tại Đăng ký hàng loạt > Xử lý phát lệnh có thể xuất và cập nhật thông tin phát lệnh",
        "最終評点調整",
        "In Bulk Registration > Order Processing, order info can be exported/updated for entry, assignment, transfer, leave, re-entry, resignation  ",
        "ปรับคะแนนประเมินขั้นสุดท้าย",
        "最终评分调整"
    ],
    [
        "access-control.list-mbo6",
        "Thiết lập tổ chức lộ trình đánh giá",
        "賞与係数調整",
        "Evaluation route organization setting  ",
        "ปรับค่าสัมประสิทธิ์โบนัส",
        "奖金系数调整"
    ],
    [
        "access-control.list-mbo7",
        "Thiết lập cá nhân lộ trình đánh giá",
        "目標実施する・しない",
        "Evaluation route individual setting  ",
        "ดำเนินการ/ไม่ดำเนินการ เป้าหมาย",
        "是否实施目标"
    ],
    [
        "access-control.list-mbo8",
        "Thao tác lộ trình đánh giá",
        "目標テンプレート（個別）",
        "Evaluation route operations  ",
        "เทมเพลตเป้าหมาย(บุคคล)",
        "目标模板（个别）"
    ],
    [
        "access-control.list-mbo9",
        "Dữ liệu mục tiêu",
        "目標テンプレート（標準）",
        "Goal data  ",
        "เทมเพลตเป้าหมาย(มาตรฐาน)",
        "目标模板（标准）"
    ],
    [
        "access-control.list-mbo10",
        "Điều chỉnh điểm đánh giá cuối cùng",
        "ワークフロースキップ",
        "Final evaluation score adjustment  ",
        "ข้ามขั้นตอนการทำงาน",
        "跳过工作流"
    ],
    [
        "access-control.all",
        "Điều chỉnh hệ số thưởng",
        "すべて",
        "Bonus coefficient adjustment  ",
        "ทั้งหมด",
        "全部"
    ],
    [
        "access-control.permission-target-setting",
        "Thực hiện mục tiêu hay không",
        "権限設定対象",
        "Goal execution (yes/no)  ",
        "เป้าหมายตั้งค่าสิทธิ์",
        "权限设定对象"
    ],
    [
        "access-control.editable",
        "Mẫu mục tiêu (cá nhân)",
        "編集可",
        "Goal template (individual)  ",
        "แก้ไขได้",
        "可编辑"
    ],
    [
        "access-control.refer-advice",
        "Mẫu mục tiêu (chuẩn)",
        "参照可",
        "Goal template (standard)  ",
        "ดูได้",
        "可查看"
    ],
    [
        "access-control.not-able-refer",
        "Bỏ qua quy trình",
        "参照不可",
        "Workflow skip  ",
        "ดูไม่ได้",
        "不可查看"
    ],
    [
        "access-control.category-list",
        "Tất cả",
        "カテゴリー一覧",
        "All  ",
        "ตารางหมวดหมู่",
        "类别列表"
    ],
    [
        "access-control.available",
        "Đối tượng cài đặt quyền",
        "利用可",
        "Permission target  ",
        "ใช้งานได้",
        "可利用"
    ],
    [
        "access-control.unavailable",
        "Có thể chỉnh sửa",
        "利用不可",
        "Editable  ",
        "ใช้งานไม่ได้",
        "不可利用"
    ],
    [
        "access-control.submit",
        "Có thể xem",
        "保存する",
        "Viewable  ",
        "บันทึก",
        "保存"
    ],
    [
        "access-control.profile-refer",
        "Không thể xem",
        "対象者のどの社員情報にアクセスできるのかを設定してください。未設定の場合、実行者は該当情報を参照できません。",
        "Not viewable  ",
        "กรุณาตั้งค่าการเข้าถึงข้อมูลพนักงานของบุคคลเป้าหมาย หากไม่ได้ตั้งค่าผู้ปฏิบัติจะไม่สามารถดูข้อมูลที่เกี่ยวข้องได้",
        "请设定对象人员可以访问的员工的信息。若未设定，操作者将无法查看相关信息。"
    ],
    [
        "access-control.how-target",
        "Danh sách danh mục",
        "対象者の指定方法",
        "Category list  ",
        "วิธีกำหนดบุคคลเป้าหมาย",
        "对象人员的指定方法"
    ],
    [
        "access-control.employment-classification",
        "Có thể sử dụng",
        "雇用区分",
        "Available  ",
        "ประเภทการจ้างงาน",
        "雇佣区分"
    ],
    [
        "access-control.gradeA",
        "Không thể sử dụng",
        "等級A",
        "Unavailable  ",
        "ชั้นA",
        "等级A"
    ],
    [
        "access-control.gradeB",
        "Lưu lại",
        "等級B",
        "Save  ",
        "ชั้นB",
        "等级B"
    ],
    [
        "access-control.gradeC",
        "Cài đặt thông tin nhân viên cụ thể nào người thực hiện có thể truy cập",
        "等級C",
        "Set which employee information of the target can be accessed  ",
        "ชั้นC",
        "等级C"
    ],
    [
        "access-control.occupation",
        "Nếu chưa cài đặt, sẽ không thể truy cập",
        "職種",
        "If not set, the executor cannot reference the corresponding information  ",
        "อาชีพ",
        "职种"
    ],
    [
        "access-control.position",
        "Cách chỉ định đối tượng",
        "職務",
        "Target specification method  ",
        "ตำแหน่ง",
        "职务"
    ],
    [
        "access-control.role",
        "Phân loại hợp đồng lao động",
        "役割",
        "Employment category  ",
        "หน้าที่",
        "角色"
    ],
    [
        "access-control.responsible-area",
        "Cấp bậc A",
        "担当エリア",
        "Grade A  ",
        "พื้นที่รับผิดชอบ",
        "负责区域"
    ],
]

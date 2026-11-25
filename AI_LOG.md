# AI_LOG.md – Nhật ký sử dụng AI

Nhật ký ghi lại các nội dung đã hỏi AI trong quá trình làm ứng dụng **Quản lý sự kiện câu lạc bộ** và vị trí áp dụng trong mã nguồn.

## 1. Tìm kiếm, phân nhóm và phân trang danh sách

**Đã hỏi AI:** Cách tìm sự kiện theo tên, chia nhóm đã/sắp diễn ra và phân trang mà không dùng thư viện ngoài.

**Áp dụng:**
- `src/pages/EventListPage.tsx:49–67`: lọc bằng `filter()`, sắp xếp bằng `sort()`, chia trang bằng `Math.ceil()` và `slice()`; đổi từ khóa thì quay về trang 1.
- `src/pages/EventListPage.tsx:150–160`: các nút Đầu, Trước, số trang, Sau, Cuối.
- `src/utils/date.ts:3–8, 27–32`: xác định trạng thái theo ngày và chia hai nhóm sự kiện.

## 2. Tổ chức gọi API

**Đã hỏi AI:** Cách gom các yêu cầu CRUD vào `services/` và dùng chung cấu hình Axios.

**Áp dụng:**
- `src/services/api.ts:3–6`: tạo Axios instance, đọc `VITE_API_BASE_URL` và đặt thời gian chờ.
- `src/services/eventsService.ts:4–26`: các hàm GET danh sách, GET theo ID, POST, PATCH và DELETE.
- Các trang gọi hàm service thay vì gọi Axios trực tiếp.

## 3. Route động và trang không tìm thấy

**Đã hỏi AI:** Cách đọc ID từ URL để tải chi tiết/chỉnh sửa và xử lý ID không tồn tại.

**Áp dụng:**
- `src/App.tsx:10–16`: route danh sách, thêm mới, chi tiết, chỉnh sửa và 404.
- `src/pages/EventDetailPage.tsx:9–32, 48–60`: dùng `useParams()` lấy ID, gọi API và hiển thị loading/lỗi.
- `src/pages/EventFormPage.tsx:19–64, 111–123`: lấy dữ liệu cũ khi sửa và báo không tìm thấy khi tải thất bại.

## 4. Dùng chung form thêm và sửa

**Đã hỏi AI:** Cách dùng một form cho hai chức năng, tự điền dữ liệu khi sửa và chọn API theo chế độ.

**Áp dụng:**
- `src/pages/EventFormPage.tsx:8–29`: dữ liệu mặc định, xác định `isEdit` và các state của form.
- `src/pages/EventFormPage.tsx:31–64`: GET sự kiện theo ID và đưa dữ liệu vào form.
- `src/pages/EventFormPage.tsx:95–108`: gọi POST khi thêm, PATCH khi sửa; khóa nút trong lúc gửi và điều hướng sau khi thành công.

## 5. Validate tập trung và kiểm tra khi rời ô

**Đã hỏi AI:** Cách gom quy tắc validate vào một hàm, hiển thị lỗi khi blur và kiểm tra lại toàn bộ trước khi gửi.

**Áp dụng:**
- `src/utils/validateEvent.ts:3–57`: kiểm tra tên, ngày, giờ, địa điểm/URL và số chỗ; luật ngày quá khứ chỉ áp dụng khi thêm mới.
- `src/pages/EventFormPage.tsx:66–80, 86–94`: cập nhật giá trị, ghi nhận trường đã tương tác và chặn submit khi còn lỗi.
- `src/components/TextField.tsx:37–52`: nhận lỗi từ form, đổi kiểu hiển thị và đặt thông báo ngay dưới ô nhập.

## 6. Trường nhập thay đổi theo hình thức sự kiện

**Đã hỏi AI:** Cách chỉ hiện ô địa điểm với sự kiện trực tiếp hoặc ô đường dẫn với sự kiện trực tuyến.

**Áp dụng:**
- `src/pages/EventFormPage.tsx:146–166`: chọn hình thức bằng radio và render trường tương ứng.
- `src/utils/validateEvent.ts:34–51`: chỉ bắt buộc địa điểm hoặc URL theo hình thức đã chọn.

## 7. Component xác nhận và thông báo tự viết

**Đã hỏi AI:** Cách thay `confirm()`/`alert()` bằng hộp thoại xác nhận và thông báo trong giao diện.

**Áp dụng:**
- `src/components/ConfirmDialog.tsx:1–22`: hộp thoại nhận nội dung, trạng thái đang xử lý và callback xác nhận/hủy.
- `src/components/Toast.tsx:1–15`: thông báo thành công hoặc lỗi.
- `src/pages/EventListPage.tsx:69–82` và `src/pages/EventDetailPage.tsx:34–46, 106–107`: xác nhận xóa, gọi DELETE và hiển thị kết quả.
- `src/pages/EventFormPage.tsx:95–103`, `src/pages/EventListPage.tsx:41–47`: truyền thông báo qua `navigate` và đọc `location.state` ở trang danh sách.

## 8. Xử lý và trình bày ngày tổ chức

**Đã hỏi AI:** Cách so sánh ngày theo ngày hiện tại, định dạng ngày tiếng Việt và trình bày ngày/tháng/năm trong ô lịch nhỏ.

**Áp dụng:**
- `src/utils/date.ts:3–24`: xác định sự kiện đã/sắp diễn ra, định dạng ngày và tách ngày/tháng/năm.
- `src/components/EventItem.tsx:11–18`: hiển thị ngày, tháng và năm thành các dòng riêng trong ô lịch.

## 9. Xác định đúng menu đang mở

**Đã hỏi AI:** Cách tránh nhận nhầm đường dẫn thêm mới là trang chi tiết và làm nổi bật đúng mục menu.

**Áp dụng:**
- `src/layouts/MainLayout.tsx:4–10`: kiểm tra đường dẫn bằng biểu thức chính quy và tạo class cho trạng thái menu.
- `src/layouts/MainLayout.tsx:21–23`: giữ mục Danh sách nổi bật ở trang danh sách/chi tiết; mục Thêm sự kiện nổi bật ở trang thêm/sửa.

## 10. Kiểu dữ liệu cho sự kiện và form

**Đã hỏi AI:** Cách khai báo kiểu dữ liệu form, kiểu lỗi theo từng trường và cập nhật trường an toàn với TypeScript.

**Áp dụng:**
- `src/types/event.ts:1–17`: khai báo `ClubEvent`, `EventFormValues`, `EventFormErrors`, `EventFormat` và `EventStatus`.
- `src/pages/EventFormPage.tsx:66–70`: dùng `keyof` trong `updateValue()` để giới hạn tên trường và kiểu giá trị được cập nhật.

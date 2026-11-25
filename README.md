# Club Events – Quản lý sự kiện câu lạc bộ

Ứng dụng CRUD quản lý sự kiện câu lạc bộ được xây dựng bằng React, TypeScript, React Router, Tailwind CSS, Axios và JSON Server.

## 1. Công nghệ

- React 19.3.1 + TypeScript 7.0.2 + React Types 19.3.1
- Vite 8.3.8
- Tailwind CSS 4.3.5 (toàn bộ giao diện viết bằng utility classes, không có CSS tự viết)
- React Router 8.5.3
- Axios 1.21.1
- JSON Server 1.0.0-beta.15

Lưu ý: JSON Server `1.0.0-beta.15` hiện là phiên bản được gắn tag `latest` trên npm, nhưng tên phiên bản vẫn mang nhãn beta. Các API CRUD trong bài chỉ sử dụng GET, POST, PUT và DELETE cơ bản.

Yêu cầu Node.js: `20.19+` hoặc `22.12+`.

## 2. Cài đặt và chạy

```bash
npm install
```

Mở hai Terminal tại thư mục dự án.

Terminal 1 – chạy API:

```bash
npm run api
```

API mặc định: `http://localhost:3001/events`.

Terminal 2 – chạy React:

```bash
npm run dev
```

Mở địa chỉ Vite in ra trong Terminal, mặc định `http://localhost:5173`.

Kiểm tra TypeScript và build:

```bash
npm run build
```

## 3. Chức năng

- Xem danh sách sự kiện; chia thành nhóm “Sắp diễn ra” và “Đã diễn ra” theo ngày hiện tại.
- Tìm sự kiện theo tên và phân trang ở frontend (5 sự kiện/trang).
- Xem chi tiết `/su-kien/:id`.
- Thêm mới `/su-kien/them-moi`.
- Chỉnh sửa `/su-kien/:id/sua`.
- Xóa sự kiện từ danh sách hoặc trang chi tiết, có hộp thoại xác nhận chứa tên sự kiện.
- Một hàm `validateEvent()` dùng chung cho thêm và sửa; kiểm tra khi rời ô và khi gửi form.
- Hiển thị trạng thái tải, lỗi API, danh sách trống và thông báo thành công.

## 4. Cấu trúc thư mục

```text
src/
├── components/       # TextField, EventItem, Toast, ConfirmDialog
├── layouts/          # Header, Footer và khung trang
├── pages/            # Danh sách, chi tiết, form, 404
├── services/         # Axios instance và hàm gọi API
├── types/            # Kiểu dữ liệu TypeScript
└── utils/             # Validate và xử lý ngày
server/
└── db.json            # Dữ liệu JSON Server
```

## 5. Phân trang

Phân trang được xử lý đơn giản ở frontend sau khi GET danh sách từ API:

- `PAGE_SIZE = 5`: số bản ghi mỗi trang.
- `totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE)`.
- `slice(startIndex, startIndex + PAGE_SIZE)`: lấy dữ liệu của trang đang chọn.
- `useState` lưu số trang hiện tại; khi thay từ khóa tìm kiếm, trang được đưa về 1.

Cách này chỉ sử dụng `useState` và các phương thức mảng cơ bản, không cần thư viện phân trang riêng.

## 6. Tailwind CSS

Toàn bộ giao diện dùng class Tailwind trực tiếp trong JSX. `src/index.css` chỉ có dòng `@import "tailwindcss";`, không có stylesheet tự viết hay CSS module.

Phong cách tham chiếu SoundWave: nền xám nhạt, vùng nội dung trắng, chữ Arial, liên kết xanh, viền mảnh, góc vuông và bố cục gọn. Không dùng gradient, shadow trang trí hoặc thư viện UI.

## 7. Chụp ảnh và video nộp bài

Sau khi chạy ứng dụng, chụp ảnh màn hình và lưu vào `screenshots/`:

1. `event-list.png` – trang danh sách.
2. `event-form-validation.png` – form có lỗi validate.
3. `mobile-view.png` – giao diện ở kích thước điện thoại.

Quay video giới thiệu ứng dụng, tải lên Google Drive và thay dòng dưới bằng liên kết chia sẻ video:

`[Dán link Google Drive video giới thiệu tại đây]`

## 8. GitHub

Không đưa `node_modules/` hoặc `dist/` lên GitHub. Sau khi kiểm tra ứng dụng:

```bash
git init
git add .
git commit -m "Complete club events CRUD app"
git branch -M main
git remote add origin <URL_REPOSITORY>
git push -u origin main
```

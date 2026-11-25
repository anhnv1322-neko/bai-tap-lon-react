import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center border border-[#cccccc] bg-white px-5 text-center">
      <div className="text-[72px] font-bold leading-none tracking-[-5px] text-[#d7d7d7]">404</div>
      <h1 className="mt-4 text-xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-2 text-sm text-[#666666]">Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.</p>
      <Link to="/" className="mt-5 border border-[#1e496b] bg-[#285d86] px-4 py-2 text-[13px] text-white no-underline hover:bg-[#1e496b]">Quay về danh sách</Link>
    </div>
  )
}
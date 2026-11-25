import { Link, NavLink, Outlet, useLocation } from 'react-router'

export default function MainLayout() {
  const location = useLocation()
  const isDetailPage = /^\/su-kien\/(?!them-moi$)[^/]+$/.test(location.pathname)
  const isEditPage = /^\/su-kien\/[^/]+\/sua$/.test(location.pathname)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `border-l border-[#dddddd] px-3 py-2 text-[13px] no-underline hover:bg-[#e7e7e7] hover:text-[#075b9a] ${
      isActive ? 'bg-[#e7e7e7] font-bold text-[#075b9a] underline' : 'text-[#333333]'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-[#eeeeee] font-[Arial,Helvetica,sans-serif] text-[14px] leading-[1.5] text-[#222222]">
      <header className="border-b-2 border-[#285d86] bg-white">
        <div className="mx-auto flex min-h-[58px] w-full max-w-[1100px] px-4 flex-wrap items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-[22px] font-bold tracking-[-1px] text-[#222222] no-underline hover:text-[#222222]">
            <span>Event Manager</span>
          </Link>
          <nav aria-label="Điều hướng chính" className="flex flex-1 flex-wrap items-center">
            <NavLink to="/" end className={({ isActive }) => navClass({ isActive: isActive || isDetailPage })}>Danh sách sự kiện</NavLink>
            <NavLink to="/su-kien/them-moi" className={({ isActive }) => navClass({ isActive: isActive || isEditPage })}>Thêm sự kiện</NavLink>
          </nav>
          <span className="hidden text-xs text-[#666666] md:inline">QUẢN LÝ HOẠT ĐỘNG CÂU LẠC BỘ</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-4 flex-1 py-6 md:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-[#cccccc] bg-white">
        <div className="mx-auto flex w-full max-w-[1100px] px-4 flex-col gap-1 py-4 text-xs text-[#666666] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Event Manager</span>
          <span>Hệ thống quản lý sự kiện câu lạc bộ</span>
        </div>
      </footer>
    </div>
  )
}
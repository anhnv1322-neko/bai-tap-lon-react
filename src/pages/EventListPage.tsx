import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import EventItem from '../components/EventItem'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { deleteEvent, getEvents } from '../services/eventsService'
import type { ClubEvent } from '../types/event'
import { getEventStatus, groupEvents } from '../utils/date'

const PAGE_SIZE = 5

export default function EventListPage() {
  const [events, setEvents] = useState<ClubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  async function loadEvents() {
    try {
      setLoading(true)
      setError('')
      const data = await getEvents()
      setEvents(data)
    } catch {
      setError('Không thể tải danh sách. Hãy kiểm tra JSON Server đã chạy bằng lệnh npm run api chưa.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadEvents()
  }, [])

  useEffect(() => {
    const state = location.state as { message?: string } | null
    if (state?.message) {
      setToast({ message: state.message, type: 'success' })
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const filteredEvents = events
    .filter((event) => event.name.toLowerCase().includes(keyword.trim().toLowerCase()))
    .sort((a, b) => {
      const aUpcoming = getEventStatus(a.date) === 'upcoming'
      const bUpcoming = getEventStatus(b.date) === 'upcoming'
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1
      return aUpcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    })

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageEvents = filteredEvents.slice(startIndex, startIndex + PAGE_SIZE)
  const groupedEvents = groupEvents(pageEvents)

  function changeKeyword(value: string) {
    setKeyword(value)
    setPage(1)
  }

  async function confirmDelete() {
    if (!selectedEvent) return
    try {
      setDeleting(true)
      await deleteEvent(selectedEvent.id)
      setEvents((current) => current.filter((event) => event.id !== selectedEvent.id))
      setToast({ message: `Đã xóa sự kiện “${selectedEvent.name}”.`, type: 'success' })
      setSelectedEvent(null)
    } catch {
      setToast({ message: 'Xóa sự kiện thất bại. Vui lòng thử lại.', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <section className="border border-[#cccccc] bg-white p-5 md:p-6">
        <div className="text-xs font-bold text-[#666666]">QUẢN LÝ HOẠT ĐỘNG CÂU LẠC BỘ</div>
        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[21px] font-bold leading-tight text-[#222222]">Danh sách sự kiện</h1>
            <p className="mt-2 max-w-2xl text-[13px] text-[#555555]">Theo dõi các hoạt động đã tổ chức và những sự kiện sắp diễn ra của câu lạc bộ.</p>
          </div>
          <Link to="/su-kien/them-moi" className="inline-flex min-h-9 items-center justify-center border border-[#1e496b] bg-[#285d86] px-4 py-2 text-[13px] text-white no-underline hover:bg-[#1e496b]">＋ Thêm sự kiện</Link>
        </div>
      </section>

      <section className="mt-5 border border-[#cccccc] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#cccccc] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-[#222222]">Các sự kiện của câu lạc bộ</h2>
            <p className="text-xs text-[#777777]">{loading ? 'Đang tải dữ liệu...' : `${filteredEvents.length} sự kiện`}</p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <input
              value={keyword}
              onChange={(event) => changeKeyword(event.target.value)}
              placeholder="Tìm theo tên sự kiện..."
              aria-label="Tìm theo tên sự kiện"
              className="h-9 min-w-0 flex-1 border border-[#cccccc] bg-white px-3 text-[13px] outline-none placeholder:text-[#999999] focus:border-[#285d86] sm:w-64 sm:flex-none"
            />
            {keyword && <button type="button" onClick={() => changeKeyword('')} className="h-9 border border-[#aaaaaa] bg-[#f5f5f5] px-3 text-xs hover:bg-[#e8eef3]">Xóa</button>}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-[#666666]">Đang tải danh sách sự kiện...</div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="font-bold text-[#a32929]">Không thể kết nối máy chủ</p>
            <p className="max-w-xl text-sm text-[#666666]">{error}</p>
            <button type="button" onClick={() => void loadEvents()} className="border border-[#aaaaaa] bg-[#f5f5f5] px-4 py-2 text-sm hover:bg-[#e8eef3]">Thử tải lại</button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-bold text-[#333333]">{keyword ? 'Không tìm thấy sự kiện phù hợp.' : 'Chưa có sự kiện nào.'}</p>
            <p className="mt-1 text-sm text-[#777777]">{keyword ? 'Hãy thử từ khóa khác.' : 'Bạn có thể tạo sự kiện đầu tiên.'}</p>
            {!keyword && <Link to="/su-kien/them-moi" className="mt-3 inline-block text-sm text-[#075b9a] underline">Thêm sự kiện</Link>}
          </div>
        ) : (
          <>
            {groupedEvents.upcoming.length > 0 && (
              <div>
                <div className="flex items-center justify-between border-b border-[#cccccc] bg-[#f5f5f5] px-4 py-2">
                  <h3 className="font-bold text-[#333333]">Sắp diễn ra</h3>
                  <span className="text-xs text-[#666666]">{groupedEvents.upcoming.length} sự kiện</span>
                </div>
                {groupedEvents.upcoming.map((event) => <EventItem key={event.id} event={event} onDelete={setSelectedEvent} />)}
              </div>
            )}
            {groupedEvents.past.length > 0 && (
              <div>
                <div className="flex items-center justify-between border-y border-[#cccccc] bg-[#f5f5f5] px-4 py-2">
                  <h3 className="font-bold text-[#333333]">Đã diễn ra</h3>
                  <span className="text-xs text-[#666666]">{groupedEvents.past.length} sự kiện</span>
                </div>
                {groupedEvents.past.map((event) => <EventItem key={event.id} event={event} onDelete={setSelectedEvent} />)}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-[#cccccc] bg-[#fafafa] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#666666]">Hiển thị {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filteredEvents.length)} trong tổng số {filteredEvents.length} sự kiện</p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage(1)} disabled={currentPage === 1} className="border border-[#cccccc] bg-white px-2.5 py-1 text-xs text-[#333333] hover:bg-[#e8eef3] disabled:cursor-not-allowed disabled:opacity-40">Đầu</button>
                <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="border border-[#cccccc] bg-white px-2.5 py-1 text-xs text-[#333333] hover:bg-[#e8eef3] disabled:cursor-not-allowed disabled:opacity-40">Trước</button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`min-w-8 border px-2.5 py-1 text-xs ${currentPage === pageNumber ? 'border-[#285d86] bg-[#285d86] text-white' : 'border-[#cccccc] bg-white text-[#333333] hover:bg-[#e8eef3]'}`}>{pageNumber}</button>
                ))}
                <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="border border-[#cccccc] bg-white px-2.5 py-1 text-xs text-[#333333] hover:bg-[#e8eef3] disabled:cursor-not-allowed disabled:opacity-40">Sau</button>
                <button type="button" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} className="border border-[#cccccc] bg-white px-2.5 py-1 text-xs text-[#333333] hover:bg-[#e8eef3] disabled:cursor-not-allowed disabled:opacity-40">Cuối</button>
              </div>
            </div>
          </>
        )}
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {selectedEvent && (
        <ConfirmDialog
          title="Xác nhận xóa sự kiện"
          message={`Bạn có chắc chắn muốn xóa “${selectedEvent.name}”? Thao tác này không thể hoàn tác.`}
          busy={deleting}
          onCancel={() => setSelectedEvent(null)}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </>
  )
}
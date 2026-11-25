import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import { deleteEvent, getEventById } from '../services/eventsService'
import type { ClubEvent } from '../types/event'
import { formatDate, getEventStatus } from '../utils/date'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<ClubEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(id || '')
        setEvent(data)
      } catch {
        setError('Không tìm thấy sự kiện hoặc không thể kết nối máy chủ.')
      } finally {
        setLoading(false)
      }
    }

    void loadEvent()
  }, [id])

  async function confirmDelete() {
    if (!event) return
    try {
      setDeleting(true)
      await deleteEvent(event.id)
      navigate('/', { state: { message: `Đã xóa sự kiện “${event.name}”.` } })
    } catch {
      setToast({ message: 'Xóa sự kiện thất bại. Vui lòng thử lại.', type: 'error' })
    } finally {
      setDeleting(false)
      setConfirm(false)
    }
  }

  if (loading) {
    return <div className="border border-[#cccccc] bg-white p-10 text-center text-sm text-[#666666]">Đang tải chi tiết sự kiện...</div>
  }

  if (error || !event) {
    return (
      <div className="border border-[#cccccc] bg-white p-8 text-center">
        <h1 className="text-lg font-bold">Không tìm thấy sự kiện</h1>
        <p className="mt-2 text-sm text-[#666666]">{error || 'Sự kiện không tồn tại.'}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-[#075b9a] underline">Quay về danh sách</Link>
      </div>
    )
  }

  const upcoming = getEventStatus(event.date) === 'upcoming'
  const placeLabel = event.format === 'Trực tiếp' ? 'Địa điểm' : 'Đường dẫn tham gia'

  return (
    <>
      <div className="mb-4 text-xs text-[#666666]"><Link to="/" className="text-[#075b9a] underline">Danh sách sự kiện</Link><span className="px-2">/</span>Chi tiết</div>
      <section className="border border-[#cccccc] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#cccccc] p-5 sm:flex-row sm:items-start sm:justify-between md:p-6">
          <div>
            <div className="text-xs font-bold text-[#666666]">THÔNG TIN SỰ KIỆN</div>
            <h1 className="mt-1 text-[21px] font-bold leading-tight">{event.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className={`border px-2 py-1 ${upcoming ? 'border-[#9ab89c] bg-[#f1f6ee] text-[#315f37]' : 'border-[#cccccc] bg-[#f5f5f5] text-[#555555]'}`}>{upcoming ? 'Sắp diễn ra' : 'Đã diễn ra'}</span>
              <span className="border border-[#cccccc] bg-[#f5f5f5] px-2 py-1 text-[#555555]">{event.format}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/su-kien/${event.id}/sua`} className="inline-flex items-center border border-[#aaaaaa] bg-[#f5f5f5] px-3 py-2 text-[13px] text-[#333333] no-underline hover:bg-[#e8eef3]">Sửa thông tin</Link>
            <button type="button" onClick={() => setConfirm(true)} className="border border-[#b45b55] bg-white px-3 py-2 text-[13px] text-[#a32929] hover:bg-[#fff5f5]">Xóa</button>
          </div>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_250px] md:p-6">
          <div>
            <h2 className="border-b border-[#cccccc] pb-2 font-bold">Thông tin tổ chức</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div><dt className="text-xs text-[#777777]">Ngày tổ chức</dt><dd className="mt-1 text-sm font-bold">{formatDate(event.date)}</dd></div>
              <div><dt className="text-xs text-[#777777]">Thời gian</dt><dd className="mt-1 text-sm font-bold">{event.startTime} – {event.endTime}</dd></div>
              <div><dt className="text-xs text-[#777777]">Hình thức</dt><dd className="mt-1 text-sm font-bold">{event.format}</dd></div>
              <div><dt className="text-xs text-[#777777]">{placeLabel}</dt><dd className="mt-1 break-all text-sm font-bold">{event.format === 'Trực tiếp' ? event.location : <a href={event.meetingUrl} target="_blank" rel="noreferrer" className="text-[#075b9a] underline">{event.meetingUrl}</a>}</dd></div>
              <div><dt className="text-xs text-[#777777]">Số chỗ tối đa</dt><dd className="mt-1 text-sm font-bold">{event.capacity} người</dd></div>
            </dl>
          </div>
          <aside className="border border-[#cccccc] bg-[#f7f7f7] p-4">
            <h2 className="font-bold">{upcoming ? 'Sự kiện sắp tới' : 'Sự kiện đã kết thúc'}</h2>
            <p className="mt-2 text-[13px] text-[#666666]">{upcoming ? 'Lưu lại thời gian và địa điểm để tham gia đúng giờ.' : 'Hoạt động này đã được tổ chức.'}</p>
            <div className="mt-4 border-t border-[#cccccc] pt-3">
              <p className="text-xs text-[#777777]">Sức chứa tối đa</p>
              <p className="text-2xl font-bold text-[#285d86]">{event.capacity} <span className="text-sm font-normal text-[#666666]">người</span></p>
            </div>
          </aside>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && <ConfirmDialog title="Xác nhận xóa sự kiện" message={`Bạn có chắc chắn muốn xóa “${event.name}”? Thao tác này không thể hoàn tác.`} busy={deleting} onCancel={() => setConfirm(false)} onConfirm={() => void confirmDelete()} />}
    </>
  )
}
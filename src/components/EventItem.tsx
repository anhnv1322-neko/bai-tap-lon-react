import { Link } from 'react-router'
import type { ClubEvent } from '../types/event'
import { getDateParts } from '../utils/date'

interface EventItemProps {
  event: ClubEvent
  onDelete: (event: ClubEvent) => void
}

export default function EventItem({ event, onDelete }: EventItemProps) {
  const date = getDateParts(event.date)

  return (
    <article className="grid grid-cols-[62px_minmax(0,1fr)] gap-3 border-b border-[#dddddd] px-3 py-3 hover:bg-[#f5f5f5] sm:grid-cols-[64px_minmax(0,1fr)_190px_140px] sm:items-center sm:gap-4">
      <div className="flex h-[68px] w-[62px] shrink-0 flex-col items-center justify-center border border-[#cccccc] bg-white text-center">
        <strong className="text-[21px] font-bold leading-6 text-[#285d86]">{date.day}</strong>
        <span className="mt-0.5 text-[9px] font-bold uppercase leading-3 tracking-wide text-[#666666]">Tháng {date.month}</span>
        <span className="mt-0.5 border-t border-[#e5e5e5] pt-0.5 text-[10px] leading-3 text-[#777777]">{date.year}</span>
      </div>

      <div className="min-w-0">
        <Link to={`/su-kien/${event.id}`} className="block truncate text-[14px] font-bold text-[#075b9a] underline hover:text-[#b3261e]">
          {event.name}
        </Link>
        <p className="mt-0.5 text-xs text-[#666666]">
          {event.startTime} – {event.endTime}
          <span className="px-2 text-[#aaaaaa]">|</span>
          {event.format === 'Trực tiếp' ? event.location : 'Trực tuyến'}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-[#777777] sm:hidden">
          <span>{event.format}</span>
          <span>{event.capacity} chỗ</span>
        </div>
      </div>

      <div className="hidden text-xs text-[#555555] sm:block">
        <div>{event.format}</div>
        <div className="mt-1 text-[#777777]">Tối đa {event.capacity} người</div>
      </div>

      <div className="col-span-2 flex items-center gap-3 pl-[74px] text-xs sm:col-span-1 sm:justify-end sm:pl-0">
        <Link to={`/su-kien/${event.id}`} className="text-[#075b9a] underline hover:text-[#b3261e]">Chi tiết</Link>
        <Link to={`/su-kien/${event.id}/sua`} className="text-[#075b9a] underline hover:text-[#b3261e]">Sửa</Link>
        <button type="button" onClick={() => onDelete(event)} className="text-[#b3261e] underline hover:text-[#7f1d1d]">Xóa</button>
      </div>
    </article>
  )
}
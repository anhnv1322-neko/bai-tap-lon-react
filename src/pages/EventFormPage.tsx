import { useEffect, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import TextField from '../components/TextField'
import { createEvent, getEventById, updateEvent } from '../services/eventsService'
import type { EventFormErrors, EventFormValues } from '../types/event'
import { validateEvent } from '../utils/validateEvent'

const emptyForm: EventFormValues = {
  name: '',
  date: '',
  startTime: '',
  endTime: '',
  format: 'Trực tiếp',
  location: '',
  meetingUrl: '',
  capacity: 50,
}

export default function EventFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [values, setValues] = useState<EventFormValues>(emptyForm)
  const [errors, setErrors] = useState<EventFormErrors>({})
  const [touched, setTouched] = useState<string[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [pageError, setPageError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!isEdit || !id) {
      setLoading(false)
      setPageError('')
      return
    }

    setLoading(true)
    setPageError('')
    setTouched([])
    setErrors({})

    async function loadEvent() {
      try {
        const event = await getEventById(id!)
        setValues({
          name: event.name,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          format: event.format,
          location: event.location,
          meetingUrl: event.meetingUrl,
          capacity: event.capacity,
        })
      } catch {
        setPageError('Không tìm thấy sự kiện hoặc không thể kết nối máy chủ.')
      } finally {
        setLoading(false)
      }
    }

    void loadEvent()
  }, [id, isEdit])

  function updateValue<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    const nextValues = { ...values, [key]: value }
    setValues(nextValues)
    if (touched.length > 0) setErrors(validateEvent(nextValues, !isEdit))
  }

  function markTouched(event: FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = event.target.name
    setTouched((current) => current.includes(name) ? current : [...current, name])
    setErrors(validateEvent(values, !isEdit))
  }

  function getError(name: keyof EventFormValues) {
    return touched.includes(name) ? errors[name] : undefined
  }

  function handleTextChange(key: 'name' | 'location' | 'meetingUrl', event: ChangeEvent<HTMLInputElement>) {
    updateValue(key, event.target.value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateEvent(values, !isEdit)
    setErrors(nextErrors)
    setTouched(Object.keys(values))
    setSubmitError('')

    if (Object.keys(nextErrors).length > 0) return

    try {
      setSubmitting(true)
      if (isEdit && id) {
        await updateEvent(id, values)
        navigate('/', { state: { message: 'Cập nhật sự kiện thành công.' } })
      } else {
        await createEvent(values)
        navigate('/', { state: { message: 'Thêm sự kiện thành công.' } })
      }
    } catch {
      setSubmitError('Không thể lưu dữ liệu. Hãy kiểm tra JSON Server và thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="border border-[#cccccc] bg-white p-10 text-center text-sm text-[#666666]">Đang tải thông tin sự kiện...</div>
  }

  if (pageError) {
    return (
      <div className="border border-[#cccccc] bg-white p-8 text-center">
        <h1 className="text-lg font-bold">Không tìm thấy sự kiện</h1>
        <p className="mt-2 text-sm text-[#666666]">{pageError}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-[#075b9a] underline">Quay về danh sách</Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 text-xs text-[#666666]"><Link to="/" className="text-[#075b9a] underline">Danh sách sự kiện</Link><span className="px-2">/</span>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}</div>
      <section className="border border-[#cccccc] bg-white">
        <div className="border-b border-[#cccccc] p-5 md:p-6">
          <div className="text-xs font-bold text-[#666666]">QUẢN LÝ HOẠT ĐỘNG CÂU LẠC BỘ</div>
          <h1 className="mt-1 text-[21px] font-bold leading-tight">{isEdit ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}</h1>
          <p className="mt-2 text-[13px] text-[#666666]">Nhập đầy đủ thông tin theo các trường bên dưới.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
            <div className="md:col-span-2">
              <TextField label="Tên sự kiện" name="name" value={values.name} placeholder="Ví dụ: Workshop React cơ bản" onChange={(event) => handleTextChange('name', event)} onBlur={markTouched} error={getError('name')} required />
            </div>
            <TextField label="Ngày tổ chức" name="date" type="date" value={values.date} onChange={(event) => updateValue('date', event.target.value)} onBlur={markTouched} error={getError('date')} required />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Giờ bắt đầu" name="startTime" type="time" value={values.startTime} onChange={(event) => updateValue('startTime', event.target.value)} onBlur={markTouched} error={getError('startTime')} required />
              <TextField label="Giờ kết thúc" name="endTime" type="time" value={values.endTime} onChange={(event) => updateValue('endTime', event.target.value)} onBlur={markTouched} error={getError('endTime')} required />
            </div>

            <fieldset className="md:col-span-2">
              <legend className="mb-2 text-[13px] font-bold">Hình thức <span className="text-[#b3261e">*</span></legend>
              <div className="flex flex-wrap gap-5">
                {(['Trực tiếp', 'Trực tuyến'] as const).map((format) => (
                  <label key={format} className="flex cursor-pointer items-center gap-2 text-[13px]">
                    <input type="radio" name="format" value={format} checked={values.format === format} onChange={() => updateValue('format', format)} className="accent-[#285d86]" />
                    {format}
                  </label>
                ))}
              </div>
            </fieldset>

            {values.format === 'Trực tiếp' ? (
              <div className="md:col-span-2">
                <TextField label="Địa điểm" name="location" value={values.location} placeholder="Nhập địa điểm tổ chức" onChange={(event) => handleTextChange('location', event)} onBlur={markTouched} error={getError('location')} required />
              </div>
            ) : (
              <div className="md:col-span-2">
                <TextField label="Đường dẫn tham gia" name="meetingUrl" type="url" value={values.meetingUrl} placeholder="https://meet.google.com/..." onChange={(event) => handleTextChange('meetingUrl', event)} onBlur={markTouched} error={getError('meetingUrl')} required />
              </div>
            )}

            <div className="md:col-span-2 md:max-w-xs">
              <TextField label="Số chỗ tối đa" name="capacity" type="number" min={1} max={500} step={1} value={values.capacity === 0 ? '' : String(values.capacity)} onChange={(event) => updateValue('capacity', event.target.value === '' ? 0 : Number(event.target.value))} onBlur={markTouched} error={getError('capacity')} required />
              <p className="mt-1 text-[11px] text-[#777777]">Nhập số nguyên từ 1 đến 500.</p>
            </div>
          </div>

          {submitError && <p className="mx-5 mb-3 border border-[#dfb2b2] bg-[#fffafa] px-3 py-2 text-sm text-[#a32929] md:mx-6">{submitError}</p>}
          <div className="flex flex-col gap-3 border-t border-[#cccccc] bg-[#fafafa] p-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-xs text-[#777777]"><span className="text-[#b3261e">*</span> Trường bắt buộc</p>
            <div className="flex gap-2">
              <Link to="/" className="inline-flex items-center justify-center border border-[#aaaaaa] bg-white px-4 py-2 text-[13px] text-[#333333] no-underline hover:bg-[#eeeeee]">Hủy</Link>
              <button type="submit" disabled={submitting} className="border border-[#1e496b] bg-[#285d86] px-4 py-2 text-[13px] text-white hover:bg-[#1e496b] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo sự kiện'}</button>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}
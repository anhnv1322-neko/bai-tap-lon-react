import type { EventFormErrors, EventFormValues } from '../types/event'

export function validateEvent(values: EventFormValues, isCreate: boolean): EventFormErrors {
  const errors: EventFormErrors = {}

  const name = values.name.trim()
  if (name === '') {
    errors.name = 'Vui lòng nhập tên sự kiện.'
  } else if (name.length < 5 || name.length > 100) {
    errors.name = 'Tên sự kiện phải từ 5 đến 100 ký tự.'
  }

  if (values.date === '') {
    errors.date = 'Vui lòng chọn ngày tổ chức.'
  } else if (isCreate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(`${values.date}T00:00:00`)
    if (eventDate < today) {
      errors.date = 'Ngày tổ chức không được ở trong quá khứ.'
    }
  }

  if (values.startTime === '') {
    errors.startTime = 'Vui lòng chọn giờ bắt đầu.'
  }

  if (values.endTime === '') {
    errors.endTime = 'Vui lòng chọn giờ kết thúc.'
  } else if (values.startTime !== '' && values.endTime <= values.startTime) {
    errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.'
  }

  if (values.format === 'Trực tiếp') {
    if (values.location.trim() === '') {
      errors.location = 'Vui lòng nhập địa điểm tổ chức.'
    }
  } else {
    if (values.meetingUrl.trim() === '') {
      errors.meetingUrl = 'Vui lòng nhập đường dẫn tham gia.'
    } else {
      try {
        const url = new URL(values.meetingUrl)
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          errors.meetingUrl = 'Đường dẫn phải bắt đầu bằng http:// hoặc https://.'
        }
      } catch {
        errors.meetingUrl = 'Đường dẫn tham gia không đúng định dạng URL.'
      }
    }
  }

  if (!Number.isInteger(values.capacity) || values.capacity < 1 || values.capacity > 500) {
    errors.capacity = 'Số chỗ tối đa phải là số nguyên từ 1 đến 500.'
  }

  return errors
}
export type EventFormat = 'Trực tiếp' | 'Trực tuyến'

export interface ClubEvent {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
  format: EventFormat
  location: string
  meetingUrl: string
  capacity: number
}

export type EventFormValues = Omit<ClubEvent, 'id'>
export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>
export type EventStatus = 'upcoming' | 'past'
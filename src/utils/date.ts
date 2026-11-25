import type { ClubEvent, EventStatus } from '../types/event'

export function getEventStatus(date: string): EventStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(`${date}T00:00:00`)
  return eventDate >= today ? 'upcoming' : 'past'
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export function getDateParts(date: string) {
  const value = new Date(`${date}T00:00:00`)
  return {
    day: new Intl.DateTimeFormat('vi-VN', { day: '2-digit' }).format(value),
    month: new Intl.DateTimeFormat('vi-VN', { month: '2-digit' }).format(value),
    year: String(value.getFullYear()),
  }
}

export function groupEvents(events: ClubEvent[]) {
  return {
    upcoming: events.filter((event) => getEventStatus(event.date) === 'upcoming'),
    past: events.filter((event) => getEventStatus(event.date) === 'past'),
  }
}
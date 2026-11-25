import api from './api'
import type { ClubEvent, EventFormValues } from '../types/event'

export async function getEvents(): Promise<ClubEvent[]> {
  const response = await api.get<ClubEvent[]>('/events')
  return response.data
}

export async function getEventById(id: string): Promise<ClubEvent> {
  const response = await api.get<ClubEvent>(`/events/${id}`)
  return response.data
}

export async function createEvent(values: EventFormValues): Promise<ClubEvent> {
  const response = await api.post<ClubEvent>('/events', values)
  return response.data
}

export async function updateEvent(id: string, values: EventFormValues): Promise<ClubEvent> {
  const response = await api.patch<ClubEvent>(`/events/${id}`, values)
  return response.data
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`)
}
import { Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import EventFormPage from './pages/EventFormPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<EventListPage />} />
        <Route path="su-kien/them-moi" element={<EventFormPage />} />
        <Route path="su-kien/:id/sua" element={<EventFormPage />} />
        <Route path="su-kien/:id" element={<EventDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
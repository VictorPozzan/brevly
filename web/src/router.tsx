import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Redirect } from './pages/Redirect'
import { NotFound } from './pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/:shortCode" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

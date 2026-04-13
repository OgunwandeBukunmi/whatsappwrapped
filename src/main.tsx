import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Special from './pages/special.tsx';
import { Analytics } from "@vercel/analytics/react"
import App from './App.tsx'

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="/" element={<App />} />
    <Route path="/special" element={<Special />} />
  </>

))


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <RouterProvider router={router} />
  </StrictMode>,
)

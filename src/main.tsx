import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Special from './pages/special.tsx';
import { Analytics } from "@vercel/analytics/react"
import App from './App.tsx'
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

posthog.init('phc_xRnMkzDU4qzEYYJ5dk2gqXSfnRnPjjBM3QjeaPMqyDzp', {
  api_host: 'https://us.i.posthog.com',

})

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path="/" element={<App />} />
    <Route path="/special" element={<Special />} />
  </>

))


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <PostHogProvider client={posthog}>
      <RouterProvider router={router} />
    </PostHogProvider>
  </StrictMode>,
)

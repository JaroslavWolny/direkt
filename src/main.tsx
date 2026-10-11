import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'
import { onNeedReload } from './update'

// Záchranná brzda: ?sw-reset zahodí service worker i cache a načte appku načisto.
if (location.search.includes('sw-reset')) {
  void (async () => {
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? []
    await Promise.all(regs.map((r) => r.unregister()))
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
    location.replace(location.pathname) // bez parametru => žádná smyčka
  })()
} else {
  // autoUpdate + immediate: nová verze se nasadí sama; reload počká, než doběhne trénink (R14).
  registerSW({ immediate: true, onNeedReload })
}

// Seznam pod pevnou hlavičkou ukáže po odrolování hranu (kap. 10). Scroll nebublá → capture.
document.addEventListener(
  'scroll',
  (e) => {
    if (e.target instanceof HTMLElement) e.target.toggleAttribute('data-scrolled', e.target.scrollTop > 0)
  },
  { capture: true, passive: true },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

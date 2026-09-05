import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// HashRouter keeps routing self-contained regardless of what path/subpath
// the built app is served from (GitHub Pages project subpath, a preview
// host, a custom domain root, etc.) — no server-side rewrite rules needed.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)

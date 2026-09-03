import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './task-modal.css'
import './theme.css'
import './nickname.css'
import './task-manager.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

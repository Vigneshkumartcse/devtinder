import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Component/Signup.jsx'
import './index.css'
import App from './App.jsx'
import Signup from './Component/Signup.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Signup/> 
  </StrictMode>,
)

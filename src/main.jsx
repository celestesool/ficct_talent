import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { getTheme, applyThemeToCSS, DEFAULT_THEME } from './config/themes'

// Aplicar el tema guardado o el por defecto al cargar la página
const savedTheme = localStorage.getItem('colorTheme') || DEFAULT_THEME;
applyThemeToCSS(getTheme(savedTheme));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

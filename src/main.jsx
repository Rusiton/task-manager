import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppProvider from './Pages/Context/AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <App />
  </AppProvider>
)

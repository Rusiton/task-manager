import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppProvider from './Pages/Context/AppProvider.jsx'
import PageLoader from './Pages/Components/PageLoader.jsx'

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <PageLoader />
    <App />
  </AppProvider>
)

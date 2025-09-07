import './App.css'
import { AppContext } from './Pages/Context/AppContext'
import { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Pages/Layout'
import Home from './Pages/Home'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'

function App() {
  const { user } = useContext(AppContext)
  const [theme, setTheme] = useState(user ? user.settings.theme : 'light')

  /**
   * Update user local configuration
   */
  useEffect(() => {
    if (user) setTheme(user.settings.theme)
    else setTheme('light')
  }, [user])

  /**
   * Update application's color theme
   */
  useEffect(() => {
    document.getElementById('root').classList.toggle('theme-dark', theme == 'dark')
    document.getElementById('root').classList.toggle('theme-light', theme == 'light')
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path='/register' element={user ? <Home /> : <Register />} />
          <Route path='/login' element={user ? <Home /> : <Login />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

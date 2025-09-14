import './App.css'

import { AppContext } from './Pages/Context/AppContext'
import { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoutes from './Utils/ProtectedRoutes'

import Layout from './Pages/Layout'
import Home from './Pages/Home'
import Register from './Pages/Auth/Register'
import Login from './Pages/Auth/Login'
import Profile from './Pages/User/Profile'
import Settings from './Pages/User/Settings'
import Boards from './Pages/Boards/Boards'
import CreateBoard from './Pages/Boards/CreateBoard'
import Board from './Pages/Boards/Board'

function App() {
  const { isLoadingUser, user } = useContext(AppContext)
  const [theme, setTheme] = useState(user ? user.settings.theme : 'light')

  /**
   * Update user local configuration
   */
  useEffect(() => {
    if (user) {
      setTheme(user.settings.theme)
    }
    else {
      setTheme('light')
    }
  }, [user])

  /**
   * Update application's color theme
   */
  useEffect(() => {
    document.getElementById('root').classList.toggle('theme-dark', theme == 'dark')
    document.getElementById('root').classList.toggle('theme-light', theme == 'light')
  }, [theme])


  return !isLoadingUser && (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Layout />} >

          <Route index element={<Home />} />

          {/* User-only routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path='/user' element={ <Navigate to={user ? `/user/${user.name}` : '/login'} /> } />  
            <Route path='/user/:username' element={ <Profile /> } />  
            <Route path='/user/settings' element={ <Settings /> } />  

            <Route path='/boards' element={ <Boards /> } />
            <Route path='/boards/:boardToken' element={ <Board /> } />
            <Route path='/boards/new' element={ <CreateBoard /> } />
          </Route>

          {/* Guest-only routes */}
          <Route element={<ProtectedRoutes to='guest' />}>
            <Route path='/register' element={ <Register /> } />
            <Route path='/login' element={ <Login /> } />  
          </Route>
          
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

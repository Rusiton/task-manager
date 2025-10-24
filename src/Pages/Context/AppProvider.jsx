import api from '../../Utils/ApiClient'
import { AppContext } from './AppContext'
import { useEffect, useState } from 'react'

export default function AppProvider({ children }) {
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
    const [user, setUser] = useState(null)
    const [lastRouteParameter, setLastRouteParameter] = useState(null)
    const [modal, setModal] = useState(null)

    useEffect(() => {
        async function getUser() {
            setIsLoadingUser(true)

            if (!accessToken || accessToken === '') {
                setIsLoadingUser(false)
                return
            }

            const result = await api.get('/auth/users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            
            if (result.success) {
                setUser(result.data)
            }

            setIsLoadingUser(false)
        }

        getUser()

    }, [accessToken])


    const logoutUser = async () => {
        const result = await api.post('/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setUser(null)
            setAccessToken(null)
            localStorage.removeItem('accessToken')

            window.location.href = '/login'
        }
    }

    
    return (
        <AppContext.Provider 
            value={{ 
                isLoadingUser, 
                accessToken, 
                setAccessToken, 
                user, 
                setUser,
                logoutUser, 
                lastRouteParameter, 
                setLastRouteParameter,
                modal,
                setModal
            }}>
            { children }
        </AppContext.Provider>
    )
}
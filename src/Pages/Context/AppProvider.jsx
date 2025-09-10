import api from '../../Utils/ApiClient'
import { AppContext } from './AppContext'
import { useEffect, useState } from 'react'

export default function AppProvider({ children }) {
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
    const [user, setUser] = useState(null)

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


    async function logoutUser() {
        const response = await fetch('/api/auth/logout', {
            method: 'post',
            headers : {
                Authentication: `Bearer ${accessToken}`
            }
        })

        const data = await response.json()

        if (response.ok) {
            setUser(null)
            setAccessToken(null)
            localStorage.removeItem('accessToken')

            return
        }

        console.error(data.errors)
    }

    
    return (
        <AppContext.Provider value={{ isLoadingUser, accessToken, setAccessToken, user, logoutUser }}>
            { children }
        </AppContext.Provider>
    )
}
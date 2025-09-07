import { AppContext } from './AppContext'
import { useEffect, useState } from 'react'

export default function AppProvider({ children}) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function getUser() {
            const response = await fetch('/api/auth/users', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const data = await response.json()

            if (response.ok) {
                setUser(data)
            }
        }

        if (accessToken) {
            getUser()
        }
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
        <AppContext.Provider value={{ accessToken, setAccessToken, user, logoutUser }}>
            { children }
        </AppContext.Provider>
    )
}
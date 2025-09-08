import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../../Utils/ApiClient";

export default function Login() {
    const { setAccessToken } = useContext(AppContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({})
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    
    async function handleLogin(e) {
        e.preventDefault()
        
        const result = await api.post('/auth/login', formData)

        if (!result.success) {
            setErrors(result.error.errors)
            return
        }

        const accessToken = result.data.accessToken

        localStorage.setItem('accessToken', accessToken)
        setAccessToken(accessToken)

        navigate('/')
    }

    return (
        <div className="w-full h-full flex gap-4">
            <div className="w-3/12 min-w-68 p-4 bg-[var(--blue)] shadow-[4px_0px_3px_0px_rgba(0,_0,_0,_0.1)]">
                <h1 className="title text-white">Sign In</h1>
                <p className="text-sm text-white font-semibold select-none">Fill the form with your account information.</p>
            </div>

            <div className="flex-1 flex-wrap flex items-center justify-center">
                <form onSubmit={handleLogin}>
                    <h2 className="text-2xl font-light select-none">Sign Into Your Account</h2>

                    <div>
                        <label htmlFor="input-email">Your Email</label>
                        <input 
                            type="text" 
                            className="text-input"
                            id="input-email" 
                            name="email" 
                            autoComplete="off" 
                            required
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <p className="error">{errors.email}</p>
                    </div>

                    <div>
                        <label htmlFor="input-password">Password</label>
                        <div className="h-10 flex items-center">
                            <input 
                                type={passwordVisibility ? 'text' : 'password'} 
                                className="password-input"
                                id="input-password" 
                                name="password" 
                                autoComplete="off"
                                required
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <button 
                                type="button" 
                                className="h-full w-10 rounded-r-lg bg-[var(--quinary)] cursor-pointer transition-colors hover:bg-[var(--quaternary)]" 
                                onClick={() => setPasswordVisibility(!passwordVisibility)}>
                                <FontAwesomeIcon icon={passwordVisibility ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <p className="error">{errors.password}</p>
                    </div>

                    <div>
                        <button className="primary-btn">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import api from "../../Utils/ApiClient";

export default function Register() {
    const { setAccessToken } = useContext(AppContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const [errors, setErrors] = useState({})
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    
    async function handleRegister(e) {
        e.preventDefault()
        
        const result = await api.post('/auth/register', formData)

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
        <div className="w-full h-full flex">
            <div className="z-10 w-3/12 min-w-68 p-4 bg-[var(--blue)] shadow-[4px_0px_3px_0px_rgba(0,_0,_0,_0.1)]">
                <h1 className="title text-white">Get started</h1>
                <p className="text-sm text-white font-semibold select-none">Let's create a new account for you. You just need to fill one simple form.</p>
            </div>

            <div className="flex-1 bg-[var(--primary)] flex-wrap flex items-center justify-center">
                <form onSubmit={handleRegister} className="w-3/4 p-4 space-y-8">
                    <h2 className="text-2xl font-light select-none">Sign Up Now</h2>

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
                        <label htmlFor="input-username">Your Name</label>
                        <input 
                            type="text" 
                            className="text-input"
                            id="input-username" 
                            name="username" 
                            autoComplete="off"
                            required
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <p className="error">{errors.name}</p>
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
                        <label htmlFor="input-password-confirmation">Confirmed Password</label>
                        <input 
                            type={passwordVisibility ? 'text' : 'password'}  
                            className="password-input"
                            id="input-password-confirmation" 
                            name="passwordConfirmation" 
                            autoComplete="off"
                            required
                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                        />
                    </div>

                    <div>
                        <button className="primary-btn">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
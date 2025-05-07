"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { mockUsers } from "../../data/mockData"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError("")

        // Find user in mock data - only allow SuperDirector and SuperAdmin
        const user = mockUsers.find(
            (user) =>
                user.username === username &&
                user.password === password &&
                (user.role === "SuperDirector" || user.role === "SuperAdmin"),
        )

        if (user) {
            // Remove password from user object before storing
            const { password, ...userWithoutPassword } = user
            login(userWithoutPassword)

            // Redirect based on role
            if (user.role === "SuperDirector") {
                navigate("/super-director")
            } else if (user.role === "SuperAdmin") {
                navigate("/super-admin")
            }
        } else {
            setError("Noto'g'ri foydalanuvchi nomi yoki parol")
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Med CRM</h1>
                    <p>Tibbiyot markazlari boshqaruv tizimi</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Foydalanuvchi nomi</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Parol</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button">
                        Kirish
                    </button>
                </form>
                <div className="login-help">
                    <p>Tizimga kirish uchun quyidagi test foydalanuvchilardan foydalaning:</p>
                    <ul>
                        <li>SuperDirector: username: director, password: 123456</li>
                        <li>SuperAdmin: username: admin, password: 123456</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Login

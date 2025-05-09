"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { loginUser } from "../../api/apiLogin"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            // Call the API login function
            const result = await loginUser(username, password)

            if (result.success) {
                // Login successful
                login(result.user)

                console.log("Login successful, user data:", result.user)

                // Map API roles to application roles
                const userRole = mapApiRoleToAppRole(result.user.role, result.user.is_superuser)

                // Redirect based on mapped role
                if (userRole === "SuperDirector") {
                    navigate("/super-director")
                } else if (userRole === "SuperAdmin") {
                    navigate("/super-admin")
                } else {
                    setError("You don't have permission to access the system.")
                }
            } else {
                // Login failed
                setError(result.error || "Noto'g'ri foydalanuvchi nomi yoki parol")
            }
        } catch (err) {
            setError("Tizimga kirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
            console.error("Login error:", err)
        } finally {
            setLoading(false)
        }
    }

    // Helper function to map API roles to application roles
    const mapApiRoleToAppRole = (apiRole, isSuperuser) => {
        console.log("Mapping role:", apiRole, "isSuperuser:", isSuperuser)

        if (isSuperuser) {
            if (apiRole === "doctor") {
                return "SuperDirector"
            } else if (apiRole === "admin") {
                return "SuperAdmin"
            }
        }

        return apiRole
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
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Parol</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Kirish..." : "Kirish"}
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

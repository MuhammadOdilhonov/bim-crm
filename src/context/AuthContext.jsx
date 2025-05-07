"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in from localStorage
        const user = localStorage.getItem("medCrmUser")
        if (user) {
            setCurrentUser(JSON.parse(user))
        }
        setLoading(false)
    }, [])

    const login = (userData) => {
        setCurrentUser(userData)
        localStorage.setItem("medCrmUser", JSON.stringify(userData))
        return true
    }

    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem("medCrmUser")
    }

    const value = {
        currentUser,
        login,
        logout,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}

"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { getCurrentUser, logoutUser } from "../api/apiLogin"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in from localStorage using the API function
        const user = getCurrentUser()
        if (user) {
            console.log("AuthContext - Loaded user from localStorage:", user)
            setCurrentUser(user)
        }
        setLoading(false)
    }, [])

    const login = (userData) => {
        console.log("AuthContext - Login with user data:", userData)
        setCurrentUser(userData)
        return true
    }

    const logout = () => {
        console.log("AuthContext - Logging out user")
        logoutUser() // Call the API logout function
        setCurrentUser(null)
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

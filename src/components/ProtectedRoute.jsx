"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser, loading } = useAuth()

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    if (!currentUser) {
        return <Navigate to="/login" />
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Redirect to appropriate dashboard based on role
        if (currentUser.role === "SuperDirector") {
            return <Navigate to="/super-director" />
        } else if (currentUser.role === "SuperAdmin") {
            return <Navigate to="/super-admin" />
        } else {
            return <Navigate to="/login" />
        }
    }

    return children
}

export default ProtectedRoute

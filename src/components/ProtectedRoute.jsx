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

    // Get the application role from the user data
    const userRole = currentUser.appRole || mapApiRoleToAppRole(currentUser.role, currentUser.is_superuser)

    console.log("ProtectedRoute - User role:", userRole, "Allowed roles:", allowedRoles)

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        if (userRole === "SuperDirector") {
            return <Navigate to="/super-director" />
        } else if (userRole === "SuperAdmin") {
            return <Navigate to="/super-admin" />
        } else {
            return <Navigate to="/login" />
        }
    }

    return children
}

// Helper function to map API roles to application roles
const mapApiRoleToAppRole = (apiRole, isSuperuser) => {
    if (isSuperuser) {
        if (apiRole === "director" || apiRole === "doctor") {
            return "SuperDirector"
        } else if (apiRole === "admin") {
            return "SuperAdmin"
        }
    }

    return apiRole
}

export default ProtectedRoute

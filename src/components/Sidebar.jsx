"use client"

import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Sidebar = ({ routes, collapsed, toggleSidebar }) => {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    // Determine the display role
    const displayRole = () => {
        if (!currentUser) return ""

        // Use appRole if available, otherwise map from API role
        return currentUser.appRole || mapApiRoleToAppRole(currentUser.role, currentUser.is_superuser)
    }

    // Helper function to map API roles to application roles
    const mapApiRoleToAppRole = (apiRole, isSuperuser) => {
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
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <h2 className="logo">Med CRM</h2>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            <div className="user-info">
                <div className="avatar">{currentUser?.name?.charAt(0) || "U"}</div>
                {!collapsed && (
                    <div className="user-details">
                        <h3>{currentUser?.name}</h3>
                        <p>{displayRole()}</p>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {routes.map((route, index) => (
                        <li key={index}>
                            <NavLink
                                to={route.path}
                                end={route.path.split("/").length <= 2}
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                <span className="icon">{route.icon}</span>
                                {!collapsed && <span className="label">{route.name}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="icon">⏏</span>
                    {!collapsed && <span className="label">Chiqish</span>}
                </button>
            </div>
        </div>
    )
}

export default Sidebar

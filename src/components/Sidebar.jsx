"use client"

import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const Sidebar = ({ routes }) => {
    const [collapsed, setCollapsed] = useState(false)
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <h2 className="logo">Med CRM</h2>
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            <div className="user-info">
                <div className="avatar">{currentUser?.name?.charAt(0) || "U"}</div>
                {!collapsed && (
                    <div className="user-details">
                        <h3>{currentUser?.name}</h3>
                        <p>{currentUser?.role}</p>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {routes.map((route, index) => (
                        <li key={index}>
                            <NavLink to={route.path} className={({ isActive }) => (isActive ? "active" : "")}>
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

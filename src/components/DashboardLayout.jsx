"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useAuth } from "../context/AuthContext"

const DashboardLayout = ({ title, routes }) => {
    const { currentUser } = useAuth()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const location = useLocation()

    useEffect(() => {
        console.log("DashboardLayout mounted")
        console.log("Current location:", location.pathname)

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [location])

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    return (
        <div className="dashboard-container">
            <Sidebar routes={routes} collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
            <div className={`dashboard-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
                <Header title={title} user={currentUser} toggleSidebar={toggleSidebar} />
                <main className="content-area">
                    {/* Debug info */}
                    <div style={{ padding: "10px", background: "#f0f0f0", marginBottom: "10px", display: "none" }}>
                        <p>Current path: {location.pathname}</p>
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout

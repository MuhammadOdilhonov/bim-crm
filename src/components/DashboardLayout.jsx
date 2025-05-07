"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useAuth } from "../context/AuthContext"

const DashboardLayout = ({ title, routes }) => {
    const { currentUser } = useAuth()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="dashboard-container">
            <Sidebar routes={routes} />
            <div className="dashboard-content">
                <Header title={title} user={currentUser} />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout

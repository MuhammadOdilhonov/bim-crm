"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"

const SuperAdminDashboard = () => {
    const location = useLocation()

    useEffect(() => {
        console.log("SuperAdminDashboard mounted")
        console.log("Current path in SuperAdminDashboard:", location.pathname)
    }, [location])

    const routes = [
        { name: "Mijoz so'rovlari", path: "/super-admin", icon: "📨" },
        { name: "Lid instagaram", path: "/super-admin/instagram", icon: "📨" },
        { name: "Klinikalar", path: "/super-admin/clinics", icon: "🏥" },
        { name: "Tariflar", path: "/super-admin/tariffs", icon: "💰" },
        { path: "/super-admin/inactive-clinics", name: "Nofaol klinikalar", icon: "⏸️"},
    ]

    return <DashboardLayout title="Super Admin Panel" routes={routes} />
}

export default SuperAdminDashboard

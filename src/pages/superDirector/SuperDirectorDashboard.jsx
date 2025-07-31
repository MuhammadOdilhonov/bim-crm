"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"

const SuperDirectorDashboard = () => {
    const location = useLocation()

    useEffect(() => {
        console.log("SuperDirectorDashboard mounted")
        console.log("Current path in SuperDirectorDashboard:", location.pathname)
    }, [location])

    const routes = [
        { name: "Umumiy ko'rinish", path: "/super-director", icon: "📊" },
        { name: "Klinikalar", path: "/super-director/clinics", icon: "🏥" },
        { name: "So'rovlar", path: "/super-director/requests", icon: "📨" },
        { name: "Lid instagram", path: "/super-director/instagram", icon: "📱" },
        { name: "Tariflar", path: "/super-director/tariffs", icon: "💰" },
        { name: "API muammolari", path: "/super-director/api-issues", icon: "⚠️" },
        { name: "Nofaol klinikalar", path: "/super-director/inactive-clinics", icon: "⏸️" },
    ]

    return <DashboardLayout title="Super Director Panel" routes={routes} />
}

export default SuperDirectorDashboard

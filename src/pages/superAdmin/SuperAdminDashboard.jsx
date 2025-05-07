import { Routes, Route } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import ClientRequests from "./ClientRequests"

const SuperAdminDashboard = () => {
    const routes = [{ name: "Mijoz so'rovlari", path: "", icon: "📨" }]

    return (
        <DashboardLayout title="Super Admin Panel" routes={routes}>
            <Routes>
                <Route path="/" element={<ClientRequests />} />
            </Routes>
        </DashboardLayout>
    )
}

export default SuperAdminDashboard

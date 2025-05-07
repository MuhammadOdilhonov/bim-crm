import { Routes, Route } from "react-router-dom"
import DashboardLayout from "../../components/DashboardLayout"
import Overview from "./Overview"
import Clinics from "./Clinics"
import ClinicDetails from "./ClinicDetails"
import Requests from "./Requests"
import ApiIssues from "./ApiIssues"

const SuperDirectorDashboard = () => {
    const routes = [
        { name: "Umumiy ko'rinish", path: "", icon: "📊" },
        { name: "Klinikalar", path: "clinics", icon: "🏥" },
        { name: "So'rovlar", path: "requests", icon: "📨" },
        { name: "API muammolari", path: "api-issues", icon: "🔧" },
    ]

    return (
        <DashboardLayout title="Super Director Panel" routes={routes}>
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/clinics" element={<Clinics />} />
                <Route path="/clinics/:id" element={<ClinicDetails />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/api-issues" element={<ApiIssues />} />
            </Routes>
        </DashboardLayout>
    )
}

export default SuperDirectorDashboard

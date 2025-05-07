import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/Login"
import SuperDirectorDashboard from "./pages/superDirector/SuperDirectorDashboard"
import SuperAdminDashboard from "./pages/superAdmin/SuperAdminDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

// Import individual pages for direct routing
import Overview from "./pages/superDirector/Overview"
import Clinics from "./pages/superDirector/Clinics"
import ClinicDetails from "./pages/superDirector/ClinicDetails"
import Requests from "./pages/superDirector/Requests"
import ApiIssues from "./pages/superDirector/ApiIssues"
import ClientRequests from "./pages/superAdmin/ClientRequests"
import AdminClinics from "./pages/superAdmin/AdminClinics"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* SuperDirector Routes */}
            <Route
              path="/super-director"
              element={
                <ProtectedRoute allowedRoles={["SuperDirector"]}>
                  <SuperDirectorDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="clinics" element={<Clinics />} />
              <Route path="clinics/:id" element={<ClinicDetails />} />
              <Route path="requests" element={<Requests />} />
              <Route path="api-issues" element={<ApiIssues />} />
            </Route>

            {/* SuperAdmin Routes */}
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClientRequests />} />
              <Route path="clinics" element={<AdminClinics />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

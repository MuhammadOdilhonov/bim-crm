import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/Login"
import SuperDirectorDashboard from "./pages/superDirector/SuperDirectorDashboard"
import SuperAdminDashboard from "./pages/superAdmin/SuperAdminDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/super-director/*"
              element={
                <ProtectedRoute allowedRoles={["SuperDirector"]}>
                  <SuperDirectorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/super-admin/*"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

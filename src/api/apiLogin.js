import client from "./apiSevice"

// Login API function
export const loginUser = async (username, password) => {
    try {
        console.log("Attempting login with:", username)
        const response = await client.post("/admin/login/", {
            username,
            password,
        })

        console.log("Login API response:", response.data)

        // If login is successful, store the token and user data
        if (response.data && response.data.token) {
            // Store token in localStorage
            localStorage.setItem("medCrmToken", response.data.token)
            localStorage.setItem("medCrmRefreshToken", response.data.refresh)

            // Store user data in localStorage with mapped role
            const userData = {
                id: response.data.user.id,
                username: response.data.user.username,
                email: response.data.user.email,
                role: response.data.user.role,
                is_superuser: response.data.user.is_superuser,
                name: response.data.user.username, // Using username as name for display
                appRole: mapApiRoleToAppRole(response.data.user.role, response.data.user.is_superuser),
            }

            localStorage.setItem("medCrmUser", JSON.stringify(userData))

            return {
                success: true,
                user: userData,
            }
        }

        return {
            success: false,
            error: "Login failed. Please check your credentials.",
        }
    } catch (error) {
        console.error("Login API error:", error.response?.data || error.message)

        // Handle API error response
        if (error.response && error.response.data) {
            return {
                success: false,
                error: error.response.data.error || "Login failed. Please check your credentials.",
            }
        }

        // Handle network or other errors
        return {
            success: false,
            error: "Network error. Please try again later.",
        }
    }
}

// Helper function to map API roles to application roles
const mapApiRoleToAppRole = (apiRole, isSuperuser) => {
    if (isSuperuser) {
        if (apiRole === "director" || apiRole === "doctor") {
            return "SuperDirector"
        } else if (apiRole === "admin") {
            return "SuperAdmin"
        }
    }

    return apiRole
}

// Function to check if user is logged in
export const isLoggedIn = () => {
    return localStorage.getItem("medCrmToken") !== null
}

// Function to get current user data
export const getCurrentUser = () => {
    const userData = localStorage.getItem("medCrmUser")
    return userData ? JSON.parse(userData) : null
}

// Function to logout user
export const logoutUser = () => {
    localStorage.removeItem("medCrmToken")
    localStorage.removeItem("medCrmRefreshToken")
    localStorage.removeItem("medCrmUser")
}

// Function to get auth token
export const getAuthToken = () => {
    return localStorage.getItem("medCrmToken")
}

// Function to get refresh token
export const getRefreshToken = () => {
    return localStorage.getItem("medCrmRefreshToken")
}

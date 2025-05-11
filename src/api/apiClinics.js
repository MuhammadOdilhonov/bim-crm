import client from "./apiSevice"

// Get all clinics with pagination
export const getAllClinics = async (page = 1, pageSize = 10, searchTerm = "", statusFilter = "all") => {
    try {
        const response = await client.get("/admin/clinics/", {
            params: {
                page,
                page_size: pageSize,
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : undefined,
            },
        })

        console.log("API response - getAllClinics:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching clinics:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch clinics",
        }
    }
}

// Get clinic details by ID
export const getClinicDetails = async (clinicId) => {
    try {
        const response = await client.get(`admin/clinics/${clinicId}/`)

        console.log("API response - getClinicDetails:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching clinic details:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch clinic details",
        }
    }
}

// Get clinic subscription details
export const getClinicSubscription = async (clinicId) => {
    try {
        const response = await client.get(`admin/clinics/${clinicId}/subscription/`)

        console.log("API response - getClinicSubscription:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching clinic subscription:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch clinic subscription",
        }
    }
}

// Get clinic financial details
export const getClinicFinancial = async (clinicId) => {
    try {
        const response = await client.get(`admin/clinics/${clinicId}/financial/`)

        console.log("API response - getClinicFinancial:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching clinic financial data:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch clinic financial data",
        }
    }
}

// Get clinic branches
export const getClinicBranches = async (clinicId) => {
    try {
        const response = await client.get(`admin/clinics/${clinicId}/branches/`)

        console.log("API response - getClinicBranches:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching clinic branches:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch clinic branches",
        }
    }
}

// Get branch statistics
export const getBranchStatistics = async (clinicId) => {
    try {
        const response = await client.get(`admin/clinics/${clinicId}/branches/statistics/`)

        console.log("API response - getBranchStatistics:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching branch statistics:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch branch statistics",
        }
    }
}

// Create a new clinic
export const createClinic = async (clinicData) => {
    try {
        const response = await client.post("/clinics/", clinicData)

        console.log("API response - createClinic:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error creating clinic:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to create clinic",
        }
    }
}

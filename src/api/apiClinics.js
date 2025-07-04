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

// Get clinic subscription history
export const getClinicSubscriptionHistory = async (clinicId, page = 1, pageSize = 10) => {
    try {
        const response = await client.get(`admin/clinic/${clinicId}/subscription-history/`, {
            params: {
                page,
                page_size: pageSize,
            },
        })

        console.log("API response - getClinicSubscriptionHistory:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching clinic subscription history:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch clinic subscription history",
        }
    }
}

// Update clinic details
export const updateClinicDetails = async (clinicId, clinicData) => {
    try {
        const response = await client.patch(`admin/clinics/${clinicId}/`, clinicData)

        console.log("API response - updateClinicDetails:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error updating clinic details:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update clinic details",
        }
    }
}

// Delete clinic
export const deleteClinic = async (clinicId) => {
    try {
        const response = await client.delete(`admin/clinics/${clinicId}/`)

        console.log("API response - deleteClinic:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error deleting clinic:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete clinic",
        }
    }
}

// Create a new clinic with image
export const createClinicWithImage = async (clinicData) => {
    try {
        const formData = new FormData()

        // Add text fields
        Object.keys(clinicData).forEach((key) => {
            if (key !== "image" && clinicData[key] !== null && clinicData[key] !== undefined) {
                formData.append(key, clinicData[key])
            }
        })

        // Add image if provided
        if (clinicData.image) {
            formData.append("image", clinicData.image)
        }

        const response = await client.post("/clinics/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        console.log("API response - createClinicWithImage:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error creating clinic with image:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to create clinic",
        }
    }
}

// Send notification to clinic
export const notifyClinic = async (clinicId, notificationData) => {
    try {
        const response = await client.post(`admin/clinics/${clinicId}/notify/`, notificationData)

        console.log("API response - notifyClinic:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error sending notification to clinic:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to send notification to clinic",
        }
    }
}

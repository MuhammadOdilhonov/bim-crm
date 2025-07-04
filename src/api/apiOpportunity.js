import client from "./apiSevice"

// Get inactive clinics with pagination
export const getInactiveClinics = async (page = 1, pageSize = 10) => {
    try {
        const response = await client.get(`/admin/inactive-clinics/?page=${page}&page_size=${pageSize}`)
        return response.data
    } catch (error) {
        console.error("Error fetching inactive clinics:", error)
        throw error
    }
}

// Add days to inactive clinic
export const addDaysToClinic = async (clinicId, days, comment = "") => {
    try {
        const response = await client.post(`/admin/inactive-clinics/${clinicId}/add_days/`, {
            days: days,
            comment: comment,
        })
        return response.data
    } catch (error) {
        console.error("Error adding days to clinic:", error)
        throw error
    }
}

// Get inactive clinic details
export const getInactiveClinicDetails = async (clinicId) => {
    try {
        const response = await client.get(`/admin/inactive-clinics/${clinicId}/`)
        return response.data
    } catch (error) {
        console.error("Error fetching inactive clinic details:", error)
        throw error
    }
}

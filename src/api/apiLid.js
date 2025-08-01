import client from "./apiSevice"

// Get all targets with pagination and filters
export const getTargets = async (page = 1, search = "", location = "", status = "") => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
        })

        if (search) params.append("search", search)
        if (location) params.append("location", location)
        if (status) params.append("status", status)

        const response = await client.get(`/admin/targets/?${params.toString()}`)

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Get targets error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch targets",
        }
    }
}

// Get single target by ID
export const getTargetById = async (id) => {
    try {
        const response = await client.get(`/admin/targets/${id}/`)

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Get target by ID error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch target details",
        }
    }
}

// Add comment to target
export const addTargetComment = async (id, comment) => {
    try {
        const response = await client.patch(`/admin/targets/${id}/`, {
            comment: comment,
        })

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Add comment error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to add comment",
        }
    }
}

// Update target status
export const updateTargetStatus = async (id, status) => {
    try {
        const response = await client.patch(`/admin/targets/${id}/`, {
            status: status,
        })

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Update status error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update status",
        }
    }
}

// Delete target
export const deleteTarget = async (id) => {
    try {
        await client.delete(`/admin/targets/${id}/`)

        return {
            success: true,
        }
    } catch (error) {
        console.error("Delete target error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete target",
        }
    }
}

// Get locations for filter
export const getLocations = async () => {
    try {
        const response = await client.get("/admin/targets/locations/")

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Get locations error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch locations",
            data: [],
        }
    }
}

// Get target statistics
export const getTargetStats = async () => {
    try {
        const response = await client.get("/admin/targets/stats/")

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Get target stats error:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch statistics",
            data: {
                total: 0,
                aloqada: 0,
                kutilmoqda: 0,
                mijozga_aylandi: 0,
            },
        }
    }
}

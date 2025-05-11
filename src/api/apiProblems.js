import client from "./apiSevice"

// Get all API issues with pagination
export const getAllApiIssues = async (page = 1, pageSize = 10, searchTerm = "", statusFilter = "all") => {
    try {
        const response = await client.get("/admin/api-issues/", {
            params: {
                page,
                page_size: pageSize,
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : undefined,
            },
        })

        console.log("API response - getAllApiIssues:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching API issues:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch API issues",
        }
    }
}

// Update API issue status
export const updateApiIssueStatus = async (issueId, status) => {
    try {
        const response = await client.patch(`/admin/api-issues/${issueId}/`, {
            status: status,
        })

        console.log("API response - updateApiIssueStatus:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error updating API issue status:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update API issue status",
        }
    }
}

// Get API issue details
export const getApiIssueDetails = async (issueId) => {
    try {
        const response = await client.get(`/admin/api-issues/${issueId}/`)

        console.log("API response - getApiIssueDetails:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching API issue details:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch API issue details",
        }
    }
}

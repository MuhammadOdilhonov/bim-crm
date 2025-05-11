import client from "./apiSevice"

// Get all contact requests with pagination
export const getAllContactRequests = async (page = 1, pageSize = 10, searchTerm = "", statusFilter = "all") => {
    try {
        const response = await client.get("/contact-requests/", {
            params: {
                page,
                page_size: pageSize,
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : undefined,
            },
        })

        console.log("API response - getAllContactRequests:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching contact requests:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch contact requests",
        }
    }
}

// Update contact request status
export const updateContactRequestStatus = async (requestId, status, description) => {
    try {
        const response = await client.patch(`/contact-requests/${requestId}/`, {
            status: status,
            description: description,
        })

        console.log("API response - updateContactRequestStatus:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error updating contact request:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update contact request",
        }
    }
}

// Get contact request details
export const getContactRequestDetails = async (requestId) => {
    try {
        const response = await client.get(`/contact-requests/${requestId}/`)

        console.log("API response - getContactRequestDetails:", response.data)
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.error("Error fetching contact request details:", error.response?.data || error.message)
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch contact request details",
        }
    }
}

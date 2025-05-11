import client from "./apiSevice"

// Get all tariff plans with pagination
export const getAllTariffPlans = async (page = 1, pageSize = 10, searchTerm = "", statusFilter = "all") => {
  try {
    const response = await client.get("/admin/subscription-plans/", {
      params: {
        page,
        page_size: pageSize,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
      },
    })

    console.log("API response - getAllTariffPlans:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error fetching tariff plans:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch tariff plans",
    }
  }
}

// Create a new tariff plan
export const createTariffPlan = async (tariffData) => {
  try {
    const response = await client.post("/admin/subscription-plans/", tariffData)

    console.log("API response - createTariffPlan:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error creating tariff plan:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create tariff plan",
    }
  }
}

// Search for clinics
export const searchClinics = async (searchTerm = "") => {
  try {
    const response = await client.get(`/admin/clinics/select/`, {
      params: {
        search: searchTerm,
      },
    })

    console.log("API response - searchClinics:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error searching clinics:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to search clinics",
    }
  }
}

// Search for tariff plans
export const searchTariffPlans = async (searchTerm = "") => {
  try {
    const response = await client.get(`/admin/subscription-plans/select/`, {
      params: {
        search: searchTerm,
      },
    })

    console.log("API response - searchTariffPlans:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error searching tariff plans:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to search tariff plans",
    }
  }
}

// Assign a tariff to a clinic
export const assignTariffToClinic = async (assignmentData) => {
  try {
    const response = await client.post("/admin/clinic-subscriptions/", assignmentData)

    console.log("API response - assignTariffToClinic:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error assigning tariff to clinic:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to assign tariff to clinic",
    }
  }
}

// Get tariff assignment history
export const getTariffAssignmentHistory = async (page = 1, pageSize = 10) => {
  try {
    const response = await client.get("/admin/clinic-subscription-history/", {
      params: {
        page,
        page_size: pageSize,
      },
    })

    console.log("API response - getTariffAssignmentHistory:", response.data)

    // Check if the response has a paginated structure
    if (response.data && response.data.results) {
      return {
        success: true,
        data: response.data.results || [],
        totalCount: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous,
      }
    }

    // If not paginated, ensure we're returning an array
    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : [],
      totalCount: Array.isArray(response.data) ? response.data.length : 0,
    }
  } catch (error) {
    console.error("Error fetching tariff assignment history:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch tariff assignment history",
    }
  }
}

// Update tariff assignment status
export const updateTariffAssignmentStatus = async (assignmentId, status) => {
  try {
    const response = await client.patch(`/admin/clinic-subscription-history/${assignmentId}`, {
      status: status,
    })

    console.log("API response - updateTariffAssignmentStatus:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error updating tariff assignment status:", error.response?.data || error.message)
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update tariff assignment status",
    }
  }
}

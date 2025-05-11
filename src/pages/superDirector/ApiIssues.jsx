"use client"

import { useState, useEffect } from "react"
import { getAllApiIssues, updateApiIssueStatus } from "../../api/apiProblems"
import Pagination from "../../components/Pagination"
import Modal from "../../components/Modal"

const ApiIssues = () => {
    const [issues, setIssues] = useState([])
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(10)
    const [totalItems, setTotalItems] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updatingIssue, setUpdatingIssue] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedIssue, setSelectedIssue] = useState(null)

    useEffect(() => {
        fetchApiIssues()
    }, [currentPage, statusFilter])

    const fetchApiIssues = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getAllApiIssues(currentPage + 1, itemsPerPage, "", statusFilter)

            if (result.success) {
                setIssues(result.data.results)
                setTotalItems(result.data.count)
            } else {
                setError(result.error)
                setIssues([])
            }
        } catch (err) {
            console.error("Error fetching API issues:", err)
            setError("Failed to load API issues. Please try again later.")
            setIssues([])
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingIssue(id)
        setError(null)

        try {
            const result = await updateApiIssueStatus(id, newStatus)

            if (result.success) {
                // Update the local state with the updated issue
                setIssues(
                    issues.map((issue) =>
                        issue.id === id
                            ? { ...issue, status: newStatus, resolved_at: newStatus === "resolved" ? new Date().toISOString() : null }
                            : issue,
                    ),
                )

                // Also update the selected issue if it's currently being viewed
                if (selectedIssue && selectedIssue.id === id) {
                    setSelectedIssue({
                        ...selectedIssue,
                        status: newStatus,
                        resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
                    })
                }
            } else {
                setError(result.error)
            }
        } catch (err) {
            console.error("Error updating API issue status:", err)
            setError("Failed to update API issue status. Please try again later.")
        } finally {
            setUpdatingIssue(null)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    const handleViewIssue = (issue) => {
        setSelectedIssue(issue)
        setIsViewModalOpen(true)
    }

    // Map API status to UI status class
    const getStatusClass = (status) => {
        if (status === "resolved") return "active"
        if (status === "pending") return "pending"
        if (status === "in_progress") return "inactive"
        return "pending" // Default for "error" or other statuses
    }

    // Map API status to UI status text
    const getStatusText = (status) => {
        if (status === "resolved") return "Hal qilingan"
        if (status === "pending") return "Tekshirilmoqda"
        if (status === "in_progress") return "Jarayonda"
        return "Xatolik" // For "error" status
    }

    // Truncate text to 100 characters
    const truncateText = (text, maxLength = 100) => {
        if (!text) return ""
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    return (
        <div className="api-issues-page">
            <h1 style={{ marginBottom: "20px" }}>API muammolari</h1>

            <div className="dashboard-card">
                <div className="card-header">
                    <h2>API muammolari</h2>
                </div>

                <div className="card-body">
                    <div className="filters">
                        <div className="status-filter">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">Barcha holatlar</option>
                                <option value="pending">Tekshirilmoqda</option>
                                <option value="in_progress">Jarayonda</option>
                                <option value="resolved">Hal qilingan</option>
                                <option value="error">Xatolik</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {loading ? (
                        <div className="loading">Ma'lumotlar yuklanmoqda...</div>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Klinika</th>
                                        <th>API nomi</th>
                                        <th>Muammo</th>
                                        <th>Xabar qilingan vaqt</th>
                                        <th>Hal qilingan vaqt</th>
                                        <th>Ta'sirlangan foydalanuvchilar</th>
                                        <th>Holati</th>
                                        <th>Harakatlar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issues.map((issue) => (
                                        <tr key={issue.id}>
                                            <td>{issue.clinic_name}</td>
                                            <td>{issue.api_name}</td>
                                            <td title={issue.issue_description}>{truncateText(issue.issue_description)}</td>
                                            <td>{new Date(issue.reported_at).toLocaleString()}</td>
                                            <td>{issue.resolved_at ? new Date(issue.resolved_at).toLocaleString() : "-"}</td>
                                            <td>{issue.affected_users}</td>
                                            <td>
                                                <span className={`status ${getStatusClass(issue.status)}`}>{getStatusText(issue.status)}</span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn btn-sm btn-secondary" onClick={() => handleViewIssue(issue)}>
                                                        Ko'rish
                                                    </button>

                                                    {issue.status === "error" && (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleStatusChange(issue.id, "pending")}
                                                            disabled={updatingIssue === issue.id}
                                                        >
                                                            {updatingIssue === issue.id ? "..." : "Tekshirish"}
                                                        </button>
                                                    )}

                                                    {issue.status === "pending" && (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleStatusChange(issue.id, "in_progress")}
                                                            disabled={updatingIssue === issue.id}
                                                        >
                                                            {updatingIssue === issue.id ? "..." : "Jarayonga"}
                                                        </button>
                                                    )}

                                                    {issue.status === "in_progress" && (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleStatusChange(issue.id, "resolved")}
                                                            disabled={updatingIssue === issue.id}
                                                        >
                                                            {updatingIssue === issue.id ? "..." : "Hal qilindi"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* View Issue Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="API muammosi ma'lumotlari">
                {selectedIssue && (
                    <div className="view-issue-details">
                        <div className="issue-info">
                            <div className="info-item">
                                <div className="info-label">Klinika:</div>
                                <div className="info-value">{selectedIssue.clinic_name}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">API nomi:</div>
                                <div className="info-value">{selectedIssue.api_name}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Xabar qilingan vaqt:</div>
                                <div className="info-value">{new Date(selectedIssue.reported_at).toLocaleString()}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Hal qilingan vaqt:</div>
                                <div className="info-value">
                                    {selectedIssue.resolved_at ? new Date(selectedIssue.resolved_at).toLocaleString() : "-"}
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Ta'sirlangan foydalanuvchilar:</div>
                                <div className="info-value">{selectedIssue.affected_users}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Holati:</div>
                                <div className="info-value">
                                    <span className={`status ${getStatusClass(selectedIssue.status)}`}>
                                        {getStatusText(selectedIssue.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="issue-description">
                            <h4>Muammo tavsifi:</h4>
                            <div className="description-content">{selectedIssue.issue_description}</div>
                        </div>

                        <div className="status-actions">
                            <h4>Holatni o'zgartirish:</h4>
                            <div className="action-buttons modal-actions">
                                {selectedIssue.status === "error" && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleStatusChange(selectedIssue.id, "pending")}
                                        disabled={updatingIssue === selectedIssue.id}
                                    >
                                        {updatingIssue === selectedIssue.id ? "..." : "Tekshirishga olish"}
                                    </button>
                                )}

                                {selectedIssue.status === "pending" && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleStatusChange(selectedIssue.id, "in_progress")}
                                        disabled={updatingIssue === selectedIssue.id}
                                    >
                                        {updatingIssue === selectedIssue.id ? "..." : "Jarayonga o'tkazish"}
                                    </button>
                                )}

                                {selectedIssue.status === "in_progress" && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleStatusChange(selectedIssue.id, "resolved")}
                                        disabled={updatingIssue === selectedIssue.id}
                                    >
                                        {updatingIssue === selectedIssue.id ? "..." : "Hal qilindi"}
                                    </button>
                                )}

                                {selectedIssue.status === "resolved" && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleStatusChange(selectedIssue.id, "pending")}
                                        disabled={updatingIssue === selectedIssue.id}
                                    >
                                        {updatingIssue === selectedIssue.id ? "..." : "Qayta ochish"}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                                Yopish
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ApiIssues

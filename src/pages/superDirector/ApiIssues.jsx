"use client"

import { useState } from "react"
import { mockApiIssues, mockClinics } from "../../data/mockData"

const ApiIssues = () => {
    const [issues, setIssues] = useState(mockApiIssues)
    const [statusFilter, setStatusFilter] = useState("all")

    // Get clinic names for display
    const getClinicName = (clinicId) => {
        const clinic = mockClinics.find((c) => c.id === clinicId)
        return clinic ? clinic.name : "Unknown Clinic"
    }

    const filteredIssues = issues.filter((issue) => {
        return statusFilter === "all" || issue.status === statusFilter
    })

    const handleStatusChange = (id, newStatus) => {
        setIssues(
            issues.map((issue) =>
                issue.id === id
                    ? { ...issue, status: newStatus, resolvedAt: newStatus === "resolved" ? new Date().toISOString() : null }
                    : issue,
            ),
        )
    }

    return (
        <div className="api-issues-page">
            <div className="dashboard-card">
                <div className="card-header">
                    <h2>API muammolari</h2>
                </div>

                <div className="card-body">
                    <div className="filters">
                        <div className="status-filter">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">Barcha holatlar</option>
                                <option value="investigating">Tekshirilmoqda</option>
                                <option value="in progress">Jarayonda</option>
                                <option value="resolved">Hal qilingan</option>
                            </select>
                        </div>
                    </div>

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
                            {filteredIssues.map((issue) => (
                                <tr key={issue.id}>
                                    <td>{getClinicName(issue.clinicId)}</td>
                                    <td>{issue.apiName}</td>
                                    <td>{issue.issue}</td>
                                    <td>{new Date(issue.reportedAt).toLocaleString()}</td>
                                    <td>{issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleString() : "-"}</td>
                                    <td>{issue.affectedUsers}</td>
                                    <td>
                                        <span
                                            className={`status ${issue.status === "resolved"
                                                    ? "active"
                                                    : issue.status === "investigating"
                                                        ? "pending"
                                                        : "inactive"
                                                }`}
                                        >
                                            {issue.status === "investigating"
                                                ? "Tekshirilmoqda"
                                                : issue.status === "in progress"
                                                    ? "Jarayonda"
                                                    : issue.status === "resolved"
                                                        ? "Hal qilingan"
                                                        : issue.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {issue.status === "investigating" && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleStatusChange(issue.id, "in progress")}
                                                >
                                                    Jarayonga o'tkazish
                                                </button>
                                            )}

                                            {issue.status === "in progress" && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleStatusChange(issue.id, "resolved")}
                                                >
                                                    Hal qilindi
                                                </button>
                                            )}

                                            {issue.status === "resolved" && (
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleStatusChange(issue.id, "investigating")}
                                                >
                                                    Qayta ochish
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .filters {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        
        .status-filter select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
          background-color: white;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
      `}</style>
        </div>
    )
}

export default ApiIssues

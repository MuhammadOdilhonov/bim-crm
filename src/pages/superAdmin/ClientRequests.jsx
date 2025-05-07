"use client"

import { useState, useEffect} from "react"
import { mockRequests } from "../../data/mockData"

const ClientRequests = () => {
    const [requests, setRequests] = useState(mockRequests)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    useEffect(() => {
        
        console.log("ClientRequests component mounted");
        
    }, []);

    const filteredRequests = requests.filter((request) => {
        const matchesSearch =
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.phone.includes(searchTerm)

        const matchesStatus = statusFilter === "all" || request.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleStatusChange = (id, newStatus) => {
        setRequests(requests.map((request) => (request.id === id ? { ...request, status: newStatus } : request)))
    }

    return (
        <div className="client-requests-page">
            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Mijoz so'rovlari</h2>
                </div>

                <div className="card-body">
                    <div className="filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Ism, klinika, email yoki telefon bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="status-filter">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">Barcha holatlar</option>
                                <option value="new">Yangi</option>
                                <option value="contacted">Bog'lanilgan</option>
                            </select>
                        </div>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Sana</th>
                                <th>Ism</th>
                                <th>Email</th>
                                <th>Telefon</th>
                                <th>Klinika nomi</th>
                                <th>Holati</th>
                                <th>Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{new Date(request.date).toLocaleDateString()}</td>
                                    <td>{request.name}</td>
                                    <td>{request.email}</td>
                                    <td>{request.phone}</td>
                                    <td>{request.clinicName}</td>
                                    <td>
                                        <span className={`status ${request.status === "new" ? "pending" : "active"}`}>
                                            {request.status === "new" ? "Yangi" : "Bog'lanilgan"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    // Show request details
                                                    alert(`Xabar: ${request.message}`)
                                                }}
                                            >
                                                Ko'rish
                                            </button>

                                            {request.status === "new" ? (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleStatusChange(request.id, "contacted")}
                                                >
                                                    Bog'lanildi
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleStatusChange(request.id, "new")}
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
        </div>
    )
}

export default ClientRequests

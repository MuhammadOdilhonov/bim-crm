"use client"

import { useState, useEffect } from "react"
import { mockRequests } from "../../data/mockData"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const ClientRequests = () => {
    const [requests, setRequests] = useState(mockRequests)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isContactedModalOpen, setIsContactedModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [contactResult, setContactResult] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(5)

    useEffect(() => {
        console.log("ClientRequests component mounted")
    }, [])

    const filteredRequests = requests.filter((request) => {
        const matchesSearch =
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || request.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Get current items for pagination
    const indexOfLastItem = (currentPage + 1) * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)

    const handleStatusChange = (id, newStatus) => {
        if (newStatus === "contacted") {
            const request = requests.find((r) => r.id === id)
            setSelectedRequest(request)
            setIsContactedModalOpen(true)
        } else {
            setRequests(requests.map((request) => (request.id === id ? { ...request, status: newStatus } : request)))
        }
    }

    const handleContactSubmit = () => {
        if (!contactResult.trim()) {
            alert("Iltimos, natija haqida ma'lumot kiriting")
            return
        }

        setRequests(
            requests.map((request) =>
                request.id === selectedRequest.id ? { ...request, status: "contacted", contactResult: contactResult } : request,
            ),
        )
        setIsContactedModalOpen(false)
        setContactResult("")
    }

    const handleViewRequest = (request) => {
        setSelectedRequest(request)
        setIsViewModalOpen(true)
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    return (
        <div className="requests-page">
            <h1 style={{ marginBottom: "20px" }}>Mijoz so'rovlari</h1>

            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Mijoz so'rovlari</h2>
                </div>

                <div className="card-body">
                    <div className="filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Ism, klinika yoki email bo'yicha qidirish..."
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
                            {currentItems.map((request) => (
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
                                            <button className="btn btn-sm btn-secondary" onClick={() => handleViewRequest(request)}>
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

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredRequests.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Contacted Modal */}
            <Modal isOpen={isContactedModalOpen} onClose={() => setIsContactedModalOpen(false)} title="Bog'lanish natijasi">
                <div className="modal-form">
                    <div className="form-group">
                        <label htmlFor="contactResult">Bog'lanish natijasi</label>
                        <textarea
                            id="contactResult"
                            value={contactResult}
                            onChange={(e) => setContactResult(e.target.value)}
                            placeholder="Mijoz bilan bog'lanish natijasini kiriting..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsContactedModalOpen(false)}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={handleContactSubmit}>
                            Saqlash
                        </button>
                    </div>
                </div>
            </Modal>

            {/* View Request Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="So'rov ma'lumotlari">
                {selectedRequest && (
                    <div className="view-request-details">
                        <div className="request-info">
                            <div className="info-item">
                                <div className="info-label">Ism:</div>
                                <div className="info-value">{selectedRequest.name}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Email:</div>
                                <div className="info-value">{selectedRequest.email}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Telefon:</div>
                                <div className="info-value">{selectedRequest.phone}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Klinika nomi:</div>
                                <div className="info-value">{selectedRequest.clinicName}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Sana:</div>
                                <div className="info-value">{new Date(selectedRequest.date).toLocaleDateString()}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Holati:</div>
                                <div className="info-value">
                                    <span className={`status ${selectedRequest.status === "new" ? "pending" : "active"}`}>
                                        {selectedRequest.status === "new" ? "Yangi" : "Bog'lanilgan"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <h4>Xabar:</h4>
                        <div className="request-message">{selectedRequest.message}</div>

                        {selectedRequest.contactResult && (
                            <>
                                <h4>Bog'lanish natijasi:</h4>
                                <div className="request-message">{selectedRequest.contactResult}</div>
                            </>
                        )}

                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>
                                Yopish
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ClientRequests

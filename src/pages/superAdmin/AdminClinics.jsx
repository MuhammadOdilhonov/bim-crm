"use client"

import { useState, useEffect } from "react"
import { getAllClinics, createClinic } from "../../api/apiClinics"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const AdminClinics = () => {
    const [clinics, setClinics] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isNewClinicModalOpen, setIsNewClinicModalOpen] = useState(false)
    const [newClinic, setNewClinic] = useState({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(5)
    const [totalItems, setTotalItems] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchClinics()
    }, [currentPage, searchTerm, statusFilter])

    const fetchClinics = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getAllClinics(currentPage + 1, itemsPerPage, searchTerm, statusFilter)

            if (result.success) {
                setClinics(result.data.results)
                setTotalItems(result.data.count)
            } else {
                setError(result.error)
                setClinics([])
            }
        } catch (err) {
            console.error("Error fetching clinics:", err)
            setError("Failed to load clinics. Please try again later.")
            setClinics([])
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewClinic({
            ...newClinic,
            [name]: value,
        })
    }

    const handleAddClinic = async () => {
        // Validate form
        if (!newClinic.name || !newClinic.email || !newClinic.phone || !newClinic.licenseNumber) {
            alert("Iltimos, barcha maydonlarni to'ldiring")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            // Prepare data for API
            const clinicData = {
                clinic_name: newClinic.name,
                email: newClinic.email,
                phone: newClinic.phone,
                license_number: newClinic.licenseNumber,
            }

            // Call API to create clinic
            const result = await createClinic(clinicData)

            if (result.success) {
                // Refresh the clinics list
                fetchClinics()

                // Reset form and close modal
                setNewClinic({
                    name: "",
                    email: "",
                    phone: "",
                    licenseNumber: "",
                })
                setIsNewClinicModalOpen(false)
            } else {
                setError(result.error || "Klinika yaratishda xatolik yuz berdi")
            }
        } catch (err) {
            console.error("Error creating clinic:", err)
            setError("Klinika yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        } finally {
            setSubmitting(false)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    // Parse storage string to get used and allocated values
    const parseStorage = (storageString) => {
        try {
            const parts = storageString.split("/").map((part) => part.trim())
            const used = Number.parseFloat(parts[0].replace(/[^0-9.]/g, "")) || 0
            const allocated = Number.parseFloat(parts[1].replace(/[^0-9.]/g, "")) || 0

            return { used, allocated }
        } catch (error) {
            console.error("Error parsing storage string:", error)
            return { used: 0, allocated: 0 }
        }
    }

    // Map API status to UI status
    const mapStatus = (status) => {
        if (status === "Faol") return "active"
        if (status === "Kutilmoqda") return "pending"
        return "inactive"
    }

    return (
        <div className="clinics-page">
            <h1 style={{ marginBottom: "20px" }}>Klinikalar</h1>

            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Klinikalar ro'yxati</h2>
                    <div className="card-actions">
                        <button className="btn btn-primary" onClick={() => setIsNewClinicModalOpen(true)}>
                            + Yangi klinika
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Klinika yoki direktor nomi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="status-filter">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">Barcha holatlar</option>
                                <option value="active">Faol</option>
                                <option value="pending">Kutilmoqda</option>
                                <option value="inactive">Faol emas</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Ma'lumotlar yuklanmoqda...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Klinika nomi</th>
                                        <th>Direktor</th>
                                        <th>Filiallar</th>
                                        <th>Xodimlar</th>
                                        <th>Tarif</th>
                                        <th>Saqlash hajmi</th>
                                        <th>Obuna davri</th>
                                        <th>Holati</th>
                                        <th>Harakatlar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clinics.map((clinic, index) => {
                                        const storage = parseStorage(clinic.storage)
                                        const status = mapStatus(clinic.status)

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="clinic-name">{clinic.clinic_name}</div>
                                                </td>
                                                <td>{clinic.director}</td>
                                                <td>{clinic.branches}</td>
                                                <td>
                                                    <div className="staff-count">
                                                        <span title="Jami xodimlar">{clinic.employees}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="tariff-badge">{clinic.subscription_plan}</span>
                                                </td>
                                                <td>
                                                    <div className="storage-info">
                                                        <div className="storage-bar">
                                                            <div
                                                                className="storage-used"
                                                                style={{
                                                                    width: `${storage.allocated > 0 ? (storage.used / storage.allocated) * 100 : 0}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="storage-text">{clinic.storage}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="subscription-period">{clinic.subscription_period}</div>
                                                </td>
                                                <td>
                                                    <span className={`status ${status}`}>{clinic.status}</span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-secondary">Batafsil</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
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

            {/* New Clinic Modal */}
            <Modal
                isOpen={isNewClinicModalOpen}
                onClose={() => setIsNewClinicModalOpen(false)}
                title="Yangi klinika qo'shish"
            >
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Klinika nomi</label>
                        <input type="text" id="name" name="name" value={newClinic.name} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Elektron pochta</label>
                        <input type="email" id="email" name="email" value={newClinic.email} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Telefon raqami</label>
                        <input type="text" id="phone" name="phone" value={newClinic.phone} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="licenseNumber">Litsenziya raqami</label>
                        <input
                            type="text"
                            id="licenseNumber"
                            name="licenseNumber"
                            value={newClinic.licenseNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsNewClinicModalOpen(false)} disabled={submitting}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={handleAddClinic} disabled={submitting}>
                            {submitting ? "Qo'shilmoqda..." : "Qo'shish"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AdminClinics

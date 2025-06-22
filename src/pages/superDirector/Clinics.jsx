"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllClinics, createClinicWithImage } from "../../api/apiClinics"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const Clinics = () => {
    const [clinics, setClinics] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isNewClinicModalOpen, setIsNewClinicModalOpen] = useState(false)
    const [newClinic, setNewClinic] = useState({
        clinic_name: "",
        email: "",
        phone: "",
        license_number: "",
        address: "",
        director: "",
        image: null,
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(5)
    const [totalItems, setTotalItems] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)

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

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setNewClinic({
                ...newClinic,
                image: file,
            })

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAddClinic = async () => {
        // Validate form
        if (
            !newClinic.clinic_name ||
            !newClinic.email ||
            !newClinic.phone ||
            !newClinic.license_number ||
            !newClinic.address ||
            !newClinic.director
        ) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            // Call API to create clinic with image
            const result = await createClinicWithImage(newClinic)

            if (result.success) {
                // Refresh the clinics list
                fetchClinics()

                // Reset form and close modal
                setNewClinic({
                    clinic_name: "",
                    email: "",
                    phone: "",
                    license_number: "",
                    address: "",
                    director: "",
                    image: null,
                })
                setImagePreview(null)
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
                                                    <Link to={`/super-director/clinics/${clinic.id}`} className="btn btn-sm btn-secondary">
                                                        Batafsil
                                                    </Link>
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
                onClose={() => {
                    setIsNewClinicModalOpen(false)
                    setImagePreview(null)
                }}
                title="Yangi klinika qo'shish"
                size="lg"
            >
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clinic_name">Klinika nomi *</label>
                            <input
                                type="text"
                                id="clinic_name"
                                name="clinic_name"
                                value={newClinic.clinic_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="director">Direktor *</label>
                            <input
                                type="text"
                                id="director"
                                name="director"
                                value={newClinic.director}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Elektron pochta *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={newClinic.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Telefon raqami *</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={newClinic.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Manzil *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={newClinic.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="license_number">Litsenziya raqami *</label>
                        <input
                            type="text"
                            id="license_number"
                            name="license_number"
                            value={newClinic.license_number}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Klinika rasmi</label>
                        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                        {imagePreview && (
                            <div className="image-preview">
                                <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "10px" }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsNewClinicModalOpen(false)
                                setImagePreview(null)
                            }}
                            disabled={submitting}
                        >
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

export default Clinics

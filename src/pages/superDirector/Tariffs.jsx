"use client"

import { useState, useEffect } from "react"
import {
    getAllTariffPlans,
    createTariffPlan,
    searchClinics,
    searchTariffPlans,
    assignTariffToClinic,
    getTariffAssignmentHistory,
    updateTariffAssignmentStatus,
    deleteTariffPlan,
} from "../../api/apiTariffs"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const Tariffs = () => {
    const [tariffs, setTariffs] = useState([])
    const [assignments, setAssignments] = useState([])
    const [totalAssignments, setTotalAssignments] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isNewTariffModalOpen, setIsNewTariffModalOpen] = useState(false)
    const [isAssignTariffModalOpen, setIsAssignTariffModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedTariffForDelete, setSelectedTariffForDelete] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(5)
    const [assignmentsPage, setAssignmentsPage] = useState(0)
    const [assignmentsPerPage] = useState(5)
    const [loading, setLoading] = useState(false)
    const [assignmentsLoading, setAssignmentsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [assignmentsError, setAssignmentsError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const [newTariff, setNewTariff] = useState({
        name: "",
        description: "",
        price: 0,
        storage_limit_gb: 5,
        director_limit: 1,
        admin_limit: 1,
        doctor_limit: 5,
        branch_limit: 1,
    })

    const [newAssignment, setNewAssignment] = useState({
        clinic: "",
        plan: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        discount: 0,
        description_discount: "",
    })

    const [clinicSearchTerm, setClinicSearchTerm] = useState("")
    const [clinicOptions, setClinicOptions] = useState([])
    const [clinicSearchLoading, setClinicSearchLoading] = useState(false)

    const [tariffSearchTerm, setTariffSearchTerm] = useState("")
    const [tariffOptions, setTariffOptions] = useState([])
    const [tariffSearchLoading, setTariffSearchLoading] = useState(false)
    const [selectedTariff, setSelectedTariff] = useState(null)

    useEffect(() => {
        fetchTariffs()
        fetchAssignments()
    }, [currentPage, searchTerm, statusFilter])

    useEffect(() => {
        fetchAssignments()
    }, [assignmentsPage])

    useEffect(() => {
        if (clinicSearchTerm) {
            searchClinicOptions(clinicSearchTerm)
        }
    }, [clinicSearchTerm])

    useEffect(() => {
        if (tariffSearchTerm) {
            searchTariffOptions(tariffSearchTerm)
        }
    }, [tariffSearchTerm])

    const fetchTariffs = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getAllTariffPlans(currentPage + 1, itemsPerPage, searchTerm, statusFilter)

            if (result.success) {
                setTariffs(result.data.results || [])
            } else {
                setError(result.error)
            }
        } catch (err) {
            console.error("Error fetching tariffs:", err)
            setError("Failed to load tariffs. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const fetchAssignments = async () => {
        setAssignmentsLoading(true)
        setAssignmentsError(null)

        try {
            const result = await getTariffAssignmentHistory(assignmentsPage + 1, assignmentsPerPage)

            if (result.success) {
                setAssignments(result.data || [])
                setTotalAssignments(result.totalCount || 0)
            } else {
                setAssignmentsError(result.error)
            }
        } catch (err) {
            console.error("Error fetching assignments:", err)
            setAssignmentsError("Failed to load tariff assignments. Please try again later.")
        } finally {
            setAssignmentsLoading(false)
        }
    }

    const searchClinicOptions = async (search) => {
        setClinicSearchLoading(true)

        try {
            const result = await searchClinics(search)

            if (result.success) {
                setClinicOptions(result.data || [])
            } else {
                console.error("Error searching clinics:", result.error)
            }
        } catch (err) {
            console.error("Error searching clinics:", err)
        } finally {
            setClinicSearchLoading(false)
        }
    }

    const searchTariffOptions = async (search) => {
        setTariffSearchLoading(true)

        try {
            const result = await searchTariffPlans(search)

            if (result.success) {
                setTariffOptions(result.data || [])
            } else {
                console.error("Error searching tariffs:", result.error)
            }
        } catch (err) {
            console.error("Error searching tariffs:", err)
        } finally {
            setTariffSearchLoading(false)
        }
    }

    const handleTariffInputChange = (e) => {
        const { name, value } = e.target
        setNewTariff({
            ...newTariff,
            [name]:
                name === "price" ||
                    name === "storage_limit_gb" ||
                    name === "director_limit" ||
                    name === "admin_limit" ||
                    name === "doctor_limit" ||
                    name === "branch_limit"
                    ? Number(value)
                    : value,
        })
    }

    const handleAssignmentInputChange = (e) => {
        const { name, value } = e.target
        setNewAssignment({
            ...newAssignment,
            [name]: name === "discount" ? Number(value) : value,
        })

        // If tariff plan is selected, find and store the selected tariff details
        if (name === "plan") {
            const selected = tariffOptions.find((tariff) => tariff.id === Number(value))
            setSelectedTariff(selected)
        }
    }

    const handleClinicSearch = (e) => {
        setClinicSearchTerm(e.target.value)
    }

    const handleTariffSearch = (e) => {
        setTariffSearchTerm(e.target.value)
    }

    const handleAddTariff = async () => {
        // Validate form
        if (!newTariff.name || !newTariff.price || !newTariff.storage_limit_gb) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const result = await createTariffPlan(newTariff)

            if (result.success) {
                // Refresh the tariffs list
                fetchTariffs()

                // Reset form and close modal
                setNewTariff({
                    name: "",
                    description: "",
                    price: 0,
                    storage_limit_gb: 5,
                    director_limit: 1,
                    admin_limit: 1,
                    doctor_limit: 5,
                    branch_limit: 1,
                })
                setIsNewTariffModalOpen(false)
            } else {
                setError(result.error || "Tarif yaratishda xatolik yuz berdi")
            }
        } catch (err) {
            console.error("Error creating tariff:", err)
            setError("Tarif yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleAssignTariff = async () => {
        // Validate form
        if (!newAssignment.clinic || !newAssignment.plan || !newAssignment.start_date || !newAssignment.end_date) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const result = await assignTariffToClinic(newAssignment)

            if (result.success) {
                // Refresh the assignments list
                fetchAssignments()

                // Reset form and close modal
                setNewAssignment({
                    clinic: "",
                    plan: "",
                    start_date: new Date().toISOString().split("T")[0],
                    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
                    discount: 0,
                    description_discount: "",
                })
                setSelectedTariff(null)
                setIsAssignTariffModalOpen(false)
            } else {
                setError(result.error || "Tarifni ulashda xatolik yuz berdi")
            }
        } catch (err) {
            console.error("Error assigning tariff:", err)
            setError("Tarifni ulashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateAssignmentStatus = async (id, status) => {
        try {
            const result = await updateTariffAssignmentStatus(id, status)

            if (result.success) {
                // Refresh assignments to get updated data
                fetchAssignments()
            } else {
                setAssignmentsError(result.error || "Tarif holatini yangilashda xatolik yuz berdi")
            }
        } catch (err) {
            console.error("Error updating assignment status:", err)
            setAssignmentsError("Tarif holatini yangilashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        }
    }

    const handleDeleteTariff = (tariff) => {
        setSelectedTariffForDelete(tariff)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        setSubmitting(true)
        setError(null)

        try {
            const result = await deleteTariffPlan(selectedTariffForDelete.id)

            if (result.success) {
                // Remove the deleted tariff from the local state
                setTariffs(tariffs.filter((tariff) => tariff.id !== selectedTariffForDelete.id))
                setIsDeleteModalOpen(false)
                setSelectedTariffForDelete(null)
            } else {
                setError(result.error)
            }
        } catch (err) {
            console.error("Error deleting tariff:", err)
            setError("Failed to delete tariff. Please try again later.")
        } finally {
            setSubmitting(false)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    const handleAssignmentsPageChange = (selectedPage) => {
        setAssignmentsPage(selectedPage)
    }

    // Calculate actual payment amount
    const calculateActualPayment = () => {
        if (!selectedTariff) return 0

        const discount = Number(newAssignment.discount) || 0
        return selectedTariff.price * (1 - discount / 100)
    }

    return (
        <div className="tariffs-page">
            <h1 style={{ marginBottom: "20px" }}>Tariflar</h1>

            {/* Tariffs List */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Tariflar ro'yxati</h2>
                    <div className="card-actions">
                        <button className="btn btn-primary" onClick={() => setIsNewTariffModalOpen(true)}>
                            + Yangi tarif
                        </button>
                        <button className="btn btn-secondary" onClick={() => setIsAssignTariffModalOpen(true)}>
                            Tarifni ulash
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tarif nomi bo'yicha qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="status-filter">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">Barcha holatlar</option>
                                <option value="active">Faol</option>
                                <option value="inactive">Faol emas</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {loading ? (
                        <div className="loading">Ma'lumotlar yuklanmoqda...</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Tarif nomi</th>
                                    <th>Tavsif</th>
                                    <th>Saqlash hajmi</th>
                                    <th>Narxi (so'm)</th>
                                    <th>Limitlar</th>
                                    <th>Harakatlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tariffs.map((tariff) => (
                                    <tr key={tariff.id}>
                                        <td>{tariff.name}</td>
                                        <td>{tariff.description || "-"}</td>
                                        <td>{tariff.storage_limit_gb} GB</td>
                                        <td>{tariff.price.toLocaleString()}</td>
                                        <td>
                                            <div className="limits-info">
                                                <div>Direktor: {tariff.director_limit || 1}</div>
                                                <div>Admin: {tariff.admin_limit || 1}</div>
                                                <div>Shifokor: {tariff.doctor_limit || 5}</div>
                                                <div>Filial: {tariff.branch_limit || 1}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => {
                                                        setNewAssignment({
                                                            ...newAssignment,
                                                            plan: tariff.id.toString(),
                                                        })
                                                        setSelectedTariff(tariff)
                                                        setIsAssignTariffModalOpen(true)
                                                    }}
                                                >
                                                    Ulash
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTariff(tariff)}>
                                                    O'chirish
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={tariffs.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Tariff Assignments */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Tarif ulash tarixi</h2>
                </div>

                <div className="card-body">
                    {assignmentsError && <div className="error-message">{assignmentsError}</div>}

                    {assignmentsLoading ? (
                        <div className="loading">Ma'lumotlar yuklanmoqda...</div>
                    ) : (
                        <>
                            {assignments.length === 0 ? (
                                <div className="no-data">Tarif ulash tarixi mavjud emas</div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Klinika</th>
                                            <th>Tarif</th>
                                            <th>Ulangan sana</th>
                                            <th>Tugash sanasi</th>
                                            <th>Narxi (so'm)</th>
                                            <th>Chegirma</th>
                                            <th>To'langan summa</th>
                                            <th>Holati</th>
                                            <th>Harakatlar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id}>
                                                <td>{assignment.clinic_name}</td>
                                                <td>{assignment.plan_name}</td>
                                                <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
                                                <td>{new Date(assignment.end_date).toLocaleDateString()}</td>
                                                <td>{Number(assignment.price).toLocaleString()}</td>
                                                <td>{assignment.discount}%</td>
                                                <td>{Number(assignment.paid_amount).toLocaleString()}</td>
                                                <td>
                                                    <span className={`status ${assignment.status === "active" ? "active" : "inactive"}`}>
                                                        {assignment.status === "active" ? "Faol" : "Tugagan"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {assignment.status === "active" ? (
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() => handleUpdateAssignmentStatus(assignment.id, "expired")}
                                                            >
                                                                Tugatish
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleUpdateAssignmentStatus(assignment.id, "active")}
                                                            >
                                                                Faollashtirish
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <Pagination
                                itemsPerPage={assignmentsPerPage}
                                totalItems={totalAssignments}
                                currentPage={assignmentsPage}
                                onPageChange={handleAssignmentsPageChange}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* New Tariff Modal */}
            <Modal
                isOpen={isNewTariffModalOpen}
                onClose={() => setIsNewTariffModalOpen(false)}
                title="Yangi tarif qo'shish"
                size="lg"
            >
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Tarif nomi *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newTariff.name}
                            onChange={handleTariffInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Tavsif</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newTariff.description}
                            onChange={handleTariffInputChange}
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="storage_limit_gb">Saqlash hajmi (GB) *</label>
                            <input
                                type="number"
                                id="storage_limit_gb"
                                name="storage_limit_gb"
                                min="1"
                                max="1000"
                                value={newTariff.storage_limit_gb}
                                onChange={handleTariffInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Narxi (so'm) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="0"
                                step="100000"
                                value={newTariff.price}
                                onChange={handleTariffInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="director_limit">Direktor limiti</label>
                            <input
                                type="number"
                                id="director_limit"
                                name="director_limit"
                                min="1"
                                max="10"
                                value={newTariff.director_limit}
                                onChange={handleTariffInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="admin_limit">Admin limiti</label>
                            <input
                                type="number"
                                id="admin_limit"
                                name="admin_limit"
                                min="1"
                                max="50"
                                value={newTariff.admin_limit}
                                onChange={handleTariffInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="doctor_limit">Shifokor limiti</label>
                            <input
                                type="number"
                                id="doctor_limit"
                                name="doctor_limit"
                                min="1"
                                max="100"
                                value={newTariff.doctor_limit}
                                onChange={handleTariffInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="branch_limit">Filial limiti</label>
                            <input
                                type="number"
                                id="branch_limit"
                                name="branch_limit"
                                min="1"
                                max="20"
                                value={newTariff.branch_limit}
                                onChange={handleTariffInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsNewTariffModalOpen(false)} disabled={submitting}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={handleAddTariff} disabled={submitting}>
                            {submitting ? "Qo'shilmoqda..." : "Qo'shish"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Assign Tariff Modal */}
            <Modal
                isOpen={isAssignTariffModalOpen}
                onClose={() => setIsAssignTariffModalOpen(false)}
                title="Tarifni klinikaga ulash"
            >
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clinic">Klinika</label>
                            <div className="search-select">
                                <input
                                    type="text"
                                    placeholder="Klinika nomini qidirish..."
                                    value={clinicSearchTerm}
                                    onChange={handleClinicSearch}
                                />
                                {clinicSearchLoading && <div className="loading-indicator">Qidirilmoqda...</div>}
                                <select
                                    id="clinic"
                                    name="clinic"
                                    value={newAssignment.clinic}
                                    onChange={handleAssignmentInputChange}
                                    required
                                >
                                    <option value="">Klinikani tanlang</option>
                                    {clinicOptions.map((clinic) => (
                                        <option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="plan">Tarif</label>
                            <div className="search-select">
                                <input
                                    type="text"
                                    placeholder="Tarif nomini qidirish..."
                                    value={tariffSearchTerm}
                                    onChange={handleTariffSearch}
                                />
                                {tariffSearchLoading && <div className="loading-indicator">Qidirilmoqda...</div>}
                                <select
                                    id="plan"
                                    name="plan"
                                    value={newAssignment.plan}
                                    onChange={handleAssignmentInputChange}
                                    required
                                >
                                    <option value="">Tarifni tanlang</option>
                                    {tariffOptions.map((tariff) => (
                                        <option key={tariff.id} value={tariff.id}>
                                            {tariff.name} - {tariff.storage_limit_gb} GB - {tariff.price.toLocaleString()} so'm
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_date">Ulangan sana</label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={newAssignment.start_date}
                                onChange={handleAssignmentInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_date">Tugash sanasi</label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={newAssignment.end_date}
                                onChange={handleAssignmentInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="description_discount">Chegirma tavsifi</label>
                            <input
                                type="text"
                                id="description_discount"
                                name="description_discount"
                                value={newAssignment.description_discount}
                                onChange={handleAssignmentInputChange}
                                placeholder="Masalan: Yillik to'lov uchun 10%"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="discount">Chegirma foizi (%)</label>
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                min="0"
                                max="100"
                                value={newAssignment.discount}
                                onChange={handleAssignmentInputChange}
                            />
                        </div>
                    </div>

                    {selectedTariff && (
                        <div className="payment-summary">
                            <h4>To'lov ma'lumotlari</h4>
                            <div className="payment-details">
                                <div className="payment-row">
                                    <span>Tarif narxi:</span>
                                    <span>{selectedTariff.price.toLocaleString()} so'm</span>
                                </div>
                                {Number(newAssignment.discount) > 0 && (
                                    <div className="payment-row">
                                        <span>Chegirma ({newAssignment.discount}%):</span>
                                        <span>{((selectedTariff.price * Number(newAssignment.discount)) / 100).toLocaleString()} so'm</span>
                                    </div>
                                )}
                                <div className="payment-row total">
                                    <span>To'lov summasi:</span>
                                    <span>{calculateActualPayment().toLocaleString()} so'm</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsAssignTariffModalOpen(false)}
                            disabled={submitting}
                        >
                            Bekor qilish
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAssignTariff}
                            disabled={submitting || !newAssignment.clinic || !newAssignment.plan}
                        >
                            {submitting ? "Ulash..." : "Ulash"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Tarifni o'chirish">
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    {selectedTariffForDelete && (
                        <>
                            <p>Haqiqatan ham "{selectedTariffForDelete.name}" tarifini o'chirmoqchimisiz?</p>
                            <p style={{ color: "#e74c3c", fontSize: "14px" }}>
                                Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi.
                            </p>
                        </>
                    )}

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={submitting}>
                            {submitting ? "O'chirilmoqda..." : "O'chirish"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Tariffs

"use client"

import { useState, useEffect } from "react"
import { mockTariffs, mockClinics, mockTariffAssignments } from "../../data/mockData"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const AdminTariffs = () => {
    const [tariffs, setTariffs] = useState(mockTariffs)
    const [clinics, setClinics] = useState(mockClinics)
    const [assignments, setAssignments] = useState(mockTariffAssignments)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isNewTariffModalOpen, setIsNewTariffModalOpen] = useState(false)
    const [isAssignTariffModalOpen, setIsAssignTariffModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(5)
    const [assignmentsPage, setAssignmentsPage] = useState(0)
    const [assignmentsPerPage] = useState(5)

    const [newTariff, setNewTariff] = useState({
        name: "",
        description: "",
        storageGB: 5,
        price: 3000000,
        features: "",
    })

    const [newAssignment, setNewAssignment] = useState({
        clinicId: "",
        tariffId: "",
        assignedDate: new Date().toISOString().split("T")[0],
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        discountApplied: "",
        discountPercentage: 0,
    })

    useEffect(() => {
        console.log("AdminTariffs component mounted")
    }, [])

    // Format storage function
    const formatStorage = (storage) => {
        if (storage.tb > 0) return `${storage.tb} TB`
        if (storage.gb > 0) return `${storage.gb} GB`
        return `${storage.mb} MB`
    }

    // Filter tariffs
    const filteredTariffs = tariffs.filter((tariff) => {
        const matchesSearch = tariff.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && tariff.isActive) ||
            (statusFilter === "inactive" && !tariff.isActive)
        return matchesSearch && matchesStatus
    })

    // Get current tariffs for pagination
    const indexOfLastTariff = (currentPage + 1) * itemsPerPage
    const indexOfFirstTariff = indexOfLastTariff - itemsPerPage
    const currentTariffs = filteredTariffs.slice(indexOfFirstTariff, indexOfLastTariff)

    // Get current assignments for pagination
    const indexOfLastAssignment = (assignmentsPage + 1) * assignmentsPerPage
    const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage
    const currentAssignments = assignments.slice(indexOfFirstAssignment, indexOfLastAssignment)

    // Get clinic name by ID
    const getClinicName = (clinicId) => {
        const clinic = clinics.find((c) => c.id === clinicId)
        return clinic ? clinic.name : "Unknown Clinic"
    }

    // Get tariff name by ID
    const getTariffName = (tariffId) => {
        const tariff = tariffs.find((t) => t.id === tariffId)
        return tariff ? tariff.name : "Unknown Tariff"
    }

    // Handle input change for new tariff
    const handleTariffInputChange = (e) => {
        const { name, value } = e.target
        setNewTariff({
            ...newTariff,
            [name]: value,
        })
    }

    // Handle input change for new assignment
    const handleAssignmentInputChange = (e) => {
        const { name, value } = e.target
        setNewAssignment({
            ...newAssignment,
            [name]: value,
        })
    }

    // Calculate actual payment amount
    const calculateActualPayment = () => {
        if (!newAssignment.tariffId) return 0

        const tariff = tariffs.find((t) => t.id === Number(newAssignment.tariffId))
        if (!tariff) return 0

        const discount = Number(newAssignment.discountPercentage) || 0
        return tariff.price * (1 - discount / 100)
    }

    // Add new tariff
    const handleAddTariff = () => {
        // Create features array from comma-separated string
        const featuresArray = newTariff.features
            .split(",")
            .map((feature) => feature.trim())
            .filter((feature) => feature)

        // Create a new tariff object
        const newTariffObj = {
            id: tariffs.length + 1,
            name: newTariff.name,
            description: newTariff.description,
            storage: {
                mb: 0,
                gb: Number(newTariff.storageGB),
                tb: 0,
            },
            price: Number(newTariff.price),
            features: featuresArray,
            clinicsCount: 0,
            isActive: true,
        }

        // Add the new tariff to the list
        setTariffs([...tariffs, newTariffObj])

        // Reset form and close modal
        setNewTariff({
            name: "",
            description: "",
            storageGB: 5,
            price: 3000000,
            features: "",
        })
        setIsNewTariffModalOpen(false)
    }

    // Assign tariff to clinic
    const handleAssignTariff = () => {
        // Get selected tariff
        const tariff = tariffs.find((t) => t.id === Number(newAssignment.tariffId))
        if (!tariff) return

        // Calculate actual payment
        const actualPayment = calculateActualPayment()

        // Create a new assignment object
        const newAssignmentObj = {
            id: assignments.length + 1,
            clinicId: Number(newAssignment.clinicId),
            tariffId: Number(newAssignment.tariffId),
            assignedDate: newAssignment.assignedDate,
            expiryDate: newAssignment.expiryDate,
            status: "active",
            paymentStatus: "paid",
            paymentAmount: tariff.price,
            discountApplied: newAssignment.discountApplied || "No discounts",
            actualPayment: actualPayment,
        }

        // Add the new assignment to the list
        setAssignments([...assignments, newAssignmentObj])

        // Update clinic's tariff
        setClinics(
            clinics.map((clinic) =>
                clinic.id === Number(newAssignment.clinicId)
                    ? {
                        ...clinic,
                        tariff: tariff.name,
                        tariffPrice: tariff.price,
                        subscriptionStart: newAssignment.assignedDate,
                        subscriptionEnd: newAssignment.expiryDate,
                        storageAllocated: tariff.storage,
                    }
                    : clinic,
            ),
        )

        // Update tariff's clinicsCount
        setTariffs(
            tariffs.map((t) => (t.id === Number(newAssignment.tariffId) ? { ...t, clinicsCount: t.clinicsCount + 1 } : t)),
        )

        // Reset form and close modal
        setNewAssignment({
            clinicId: "",
            tariffId: "",
            assignedDate: new Date().toISOString().split("T")[0],
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
            discountApplied: "",
            discountPercentage: 0,
        })
        setIsAssignTariffModalOpen(false)
    }

    // Toggle tariff status
    const handleToggleTariffStatus = (id) => {
        setTariffs(tariffs.map((tariff) => (tariff.id === id ? { ...tariff, isActive: !tariff.isActive } : tariff)))
    }

    // Handle page change for tariffs
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    // Handle page change for assignments
    const handleAssignmentsPageChange = (selectedPage) => {
        setAssignmentsPage(selectedPage)
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

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Tarif nomi</th>
                                <th>Tavsif</th>
                                <th>Saqlash hajmi</th>
                                <th>Narxi (so'm)</th>
                                <th>Klinikalar soni</th>
                                <th>Holati</th>
                                <th>Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTariffs.map((tariff) => (
                                <tr key={tariff.id}>
                                    <td>{tariff.name}</td>
                                    <td>{tariff.description}</td>
                                    <td>{formatStorage(tariff.storage)}</td>
                                    <td>{tariff.price.toLocaleString()}</td>
                                    <td>{tariff.clinicsCount}</td>
                                    <td>
                                        <span className={`status ${tariff.isActive ? "active" : "inactive"}`}>
                                            {tariff.isActive ? "Faol" : "Faol emas"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn btn-sm btn-secondary">Tahrirlash</button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    setNewAssignment({
                                                        ...newAssignment,
                                                        tariffId: tariff.id.toString(),
                                                    })
                                                    setIsAssignTariffModalOpen(true)
                                                }}
                                            >
                                                Ulash
                                            </button>
                                            <button
                                                className={`btn btn-sm ${tariff.isActive ? "btn-danger" : "btn-success"}`}
                                                onClick={() => handleToggleTariffStatus(tariff.id)}
                                            >
                                                {tariff.isActive ? "O'chirish" : "Yoqish"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredTariffs.length}
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
                            </tr>
                        </thead>
                        <tbody>
                            {currentAssignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td>{getClinicName(assignment.clinicId)}</td>
                                    <td>{getTariffName(assignment.tariffId)}</td>
                                    <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                                    <td>{new Date(assignment.expiryDate).toLocaleDateString()}</td>
                                    <td>{assignment.paymentAmount.toLocaleString()}</td>
                                    <td>{assignment.discountApplied}</td>
                                    <td>{assignment.actualPayment.toLocaleString()}</td>
                                    <td>
                                        <span className={`status ${assignment.status === "active" ? "active" : "inactive"}`}>
                                            {assignment.status === "active" ? "Faol" : "Tugagan"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        itemsPerPage={assignmentsPerPage}
                        totalItems={assignments.length}
                        currentPage={assignmentsPage}
                        onPageChange={handleAssignmentsPageChange}
                    />
                </div>
            </div>

            {/* New Tariff Modal */}
            <Modal isOpen={isNewTariffModalOpen} onClose={() => setIsNewTariffModalOpen(false)} title="Yangi tarif qo'shish">
                <div className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Tarif nomi</label>
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
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="storageGB">Saqlash hajmi (GB)</label>
                            <input
                                type="number"
                                id="storageGB"
                                name="storageGB"
                                min="1"
                                max="1000"
                                value={newTariff.storageGB}
                                onChange={handleTariffInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Narxi (so'm)</label>
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

                    <div className="form-group">
                        <label htmlFor="features">Funksiyalar (vergul bilan ajrating)</label>
                        <textarea
                            id="features"
                            name="features"
                            value={newTariff.features}
                            onChange={handleTariffInputChange}
                            placeholder="Bemorlar bazasi, Shifokorlar jadvali, ..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsNewTariffModalOpen(false)}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={handleAddTariff}>
                            Qo'shish
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
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clinicId">Klinika</label>
                            <select
                                id="clinicId"
                                name="clinicId"
                                value={newAssignment.clinicId}
                                onChange={handleAssignmentInputChange}
                                required
                            >
                                <option value="">Klinikani tanlang</option>
                                {clinics.map((clinic) => (
                                    <option key={clinic.id} value={clinic.id}>
                                        {clinic.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tariffId">Tarif</label>
                            <select
                                id="tariffId"
                                name="tariffId"
                                value={newAssignment.tariffId}
                                onChange={handleAssignmentInputChange}
                                required
                            >
                                <option value="">Tarifni tanlang</option>
                                {tariffs
                                    .filter((tariff) => tariff.isActive)
                                    .map((tariff) => (
                                        <option key={tariff.id} value={tariff.id}>
                                            {tariff.name} - {formatStorage(tariff.storage)} - {tariff.price.toLocaleString()} so'm
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="assignedDate">Ulangan sana</label>
                            <input
                                type="date"
                                id="assignedDate"
                                name="assignedDate"
                                value={newAssignment.assignedDate}
                                onChange={handleAssignmentInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="expiryDate">Tugash sanasi</label>
                            <input
                                type="date"
                                id="expiryDate"
                                name="expiryDate"
                                value={newAssignment.expiryDate}
                                onChange={handleAssignmentInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="discountApplied">Chegirma tavsifi</label>
                            <input
                                type="text"
                                id="discountApplied"
                                name="discountApplied"
                                value={newAssignment.discountApplied}
                                onChange={handleAssignmentInputChange}
                                placeholder="Masalan: Yillik to'lov uchun 10%"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="discountPercentage">Chegirma foizi (%)</label>
                            <input
                                type="number"
                                id="discountPercentage"
                                name="discountPercentage"
                                min="0"
                                max="100"
                                value={newAssignment.discountPercentage}
                                onChange={handleAssignmentInputChange}
                            />
                        </div>
                    </div>

                    {newAssignment.tariffId && (
                        <div className="payment-summary">
                            <h4>To'lov ma'lumotlari</h4>
                            <div className="payment-details">
                                <div className="payment-row">
                                    <span>Tarif narxi:</span>
                                    <span>
                                        {tariffs.find((t) => t.id === Number(newAssignment.tariffId))?.price.toLocaleString()} so'm
                                    </span>
                                </div>
                                {Number(newAssignment.discountPercentage) > 0 && (
                                    <div className="payment-row">
                                        <span>Chegirma ({newAssignment.discountPercentage}%):</span>
                                        <span>
                                            {(
                                                (tariffs.find((t) => t.id === Number(newAssignment.tariffId))?.price || 0) *
                                                (Number(newAssignment.discountPercentage) / 100)
                                            ).toLocaleString()}{" "}
                                            so'm
                                        </span>
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
                        <button className="btn btn-secondary" onClick={() => setIsAssignTariffModalOpen(false)}>
                            Bekor qilish
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAssignTariff}
                            disabled={!newAssignment.clinicId || !newAssignment.tariffId}
                        >
                            Ulash
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AdminTariffs

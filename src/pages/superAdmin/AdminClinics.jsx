"use client"

import { useState, useEffect } from "react"
import { mockClinics } from "../../data/mockData"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const AdminClinics = () => {
    const [clinics, setClinics] = useState(mockClinics)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isNewClinicModalOpen, setIsNewClinicModalOpen] = useState(false)
    const [newClinic, setNewClinic] = useState({
        name: "",
        email: "",
        phone: "",
        director: "",
        licenseNumber: "",
        storageGB: 5,
        price: 5000000,
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(5)

    useEffect(() => {
        console.log("AdminClinics component mounted")
    }, [])

    const filteredClinics = clinics.filter((clinic) => {
        const matchesSearch =
            clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clinic.director.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || clinic.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Get current items for pagination
    const indexOfLastItem = (currentPage + 1) * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredClinics.slice(indexOfFirstItem, indexOfLastItem)

    // Format storage function
    const formatStorage = (storage) => {
        if (storage.tb > 0) return `${storage.tb} TB`
        if (storage.gb > 0) return `${storage.gb} GB`
        return `${storage.mb} MB`
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewClinic({
            ...newClinic,
            [name]: value,
        })
    }

    const handleAddClinic = () => {
        // Create a new clinic object
        const newClinicObj = {
            id: clinics.length + 1,
            name: newClinic.name,
            email: newClinic.email,
            phone: newClinic.phone,
            director: newClinic.director,
            licenseNumber: newClinic.licenseNumber,
            status: "pending",
            subscriptionStart: new Date().toISOString().split("T")[0],
            subscriptionEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
            storageAllocated: {
                mb: 0,
                gb: Number.parseInt(newClinic.storageGB),
                tb: 0,
            },
            storageUsed: {
                mb: 0,
                gb: 0,
                tb: 0,
            },
            tariff: "Standard",
            tariffPrice: Number.parseInt(newClinic.price),
            discounts: "No discounts",
            databaseCost: Number.parseInt(newClinic.price) * 0.3, // 30% of price as database cost
            profit: Number.parseInt(newClinic.price) * 0.7, // 70% of price as profit
            branches: [],
            staff: {
                doctors: 0,
                admins: 0,
                nurses: 0,
                total: 0,
            },
            patients: {
                total: 0,
                daily: 0,
                monthly: 0,
                yearly: 0,
            },
            isTrial: false,
            hasIssues: false,
        }

        // Add the new clinic to the list
        setClinics([...clinics, newClinicObj])

        // Reset form and close modal
        setNewClinic({
            name: "",
            email: "",
            phone: "",
            director: "",
            licenseNumber: "",
            storageGB: 5,
            price: 5000000,
        })
        setIsNewClinicModalOpen(false)
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
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
                            {currentItems.map((clinic) => (
                                <tr key={clinic.id} className={clinic.hasIssues ? "has-issues" : ""}>
                                    <td>
                                        <div className="clinic-name">
                                            {clinic.name}
                                            {clinic.hasIssues && (
                                                <span className="issue-badge" title="API muammolari mavjud">
                                                    ⚠️
                                                </span>
                                            )}
                                            {clinic.isTrial && (
                                                <span className="trial-badge" title="Sinov muddati">
                                                    🆓
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{clinic.director}</td>
                                    <td>{clinic.branches.length}</td>
                                    <td>
                                        <div className="staff-count">
                                            <span title="Jami xodimlar">{clinic.staff.total}</span>
                                            <div className="staff-details">
                                                <span title="Shifokorlar">👨‍⚕️ {clinic.staff.doctors}</span>
                                                <span title="Administratorlar">👨‍💼 {clinic.staff.admins}</span>
                                                <span title="Hamshiralar">👩‍⚕️ {clinic.staff.nurses}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tariff-badge">{clinic.tariff}</span>
                                    </td>
                                    <td>
                                        <div className="storage-info">
                                            <div className="storage-bar">
                                                <div
                                                    className="storage-used"
                                                    style={{
                                                        width: `${((clinic.storageUsed.tb * 1024 * 1024 +
                                                                clinic.storageUsed.gb * 1024 +
                                                                clinic.storageUsed.mb) /
                                                                (clinic.storageAllocated.tb * 1024 * 1024 +
                                                                    clinic.storageAllocated.gb * 1024 +
                                                                    clinic.storageAllocated.mb)) *
                                                            100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="storage-text">
                                                {formatStorage(clinic.storageUsed)} / {formatStorage(clinic.storageAllocated)}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="subscription-period">
                                            <div>{new Date(clinic.subscriptionStart).toLocaleDateString()}</div>
                                            <div>-</div>
                                            <div>{new Date(clinic.subscriptionEnd).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status ${clinic.status}`}>
                                            {clinic.status === "active" ? "Faol" : clinic.status === "pending" ? "Kutilmoqda" : "Faol emas"}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary">Batafsil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredClinics.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {/* New Clinic Modal */}
            <Modal
                isOpen={isNewClinicModalOpen}
                onClose={() => setIsNewClinicModalOpen(false)}
                title="Yangi klinika qo'shish"
            >
                <div className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Klinika nomi</label>
                        <input type="text" id="name" name="name" value={newClinic.name} onChange={handleInputChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Elektron pochta</label>
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
                            <label htmlFor="phone">Telefon raqami</label>
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

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="director">Direktor</label>
                            <input
                                type="text"
                                id="director"
                                name="director"
                                value={newClinic.director}
                                onChange={handleInputChange}
                                required
                            />
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
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="storageGB">Ajratiladigan saqlash hajmi (GB)</label>
                            <input
                                type="number"
                                id="storageGB"
                                name="storageGB"
                                min="1"
                                max="1000"
                                value={newClinic.storageGB}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Narxi (so'm)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="1000000"
                                step="100000"
                                value={newClinic.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsNewClinicModalOpen(false)}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={handleAddClinic}>
                            Qo'shish
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AdminClinics

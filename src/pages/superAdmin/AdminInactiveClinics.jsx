"use client"

import { useState, useEffect } from "react"
import { getInactiveClinics, addDaysToClinic } from "../../api/apiOpportunity"
import Pagination from "../../components/Pagination"
import Modal from "../../components/Modal"

const AdminInactiveClinics = () => {
    const [inactiveClinics, setInactiveClinics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage] = useState(10)

    // Modal states
    const [showAddDaysModal, setShowAddDaysModal] = useState(false)
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [selectedDays, setSelectedDays] = useState(1)
    const [selectedComment, setSelectedComment] = useState("")
    const [addingDays, setAddingDays] = useState(false)

    // Day options
    const dayOptions = [
        { value: 1, label: "1 kun" },
        { value: 3, label: "3 kun" },
        { value: 7, label: "1 hafta" },
        { value: 14, label: "2 hafta" },
        { value: 30, label: "1 oy" },
    ]

    useEffect(() => {
        fetchInactiveClinics()
    }, [currentPage])

    const fetchInactiveClinics = async () => {
        try {
            setLoading(true)
            const response = await getInactiveClinics(currentPage + 1, itemsPerPage)
            setInactiveClinics(response.results)
            setTotalItems(response.count)
            setError(null)
        } catch (err) {
            setError("Nofaol klinikalar ma'lumotlarini yuklashda xatolik yuz berdi")
            console.error("Error fetching inactive clinics:", err)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    const handleAddDays = (clinic) => {
        setSelectedClinic(clinic)
        setSelectedDays(1)
        setSelectedComment("Superadmin tomonidan ogohlantirish va qo'shimcha vaqt berildi.")
        setShowAddDaysModal(true)
    }

    const confirmAddDays = async () => {
        if (!selectedClinic) return

        try {
            setAddingDays(true)
            await addDaysToClinic(selectedClinic.id, selectedDays, selectedComment)

            // Refresh the list
            await fetchInactiveClinics()

            setShowAddDaysModal(false)
            setSelectedClinic(null)
            setSelectedComment("")
            alert("Muvaffaqiyatli! Klinikaga qo'shimcha kunlar berildi.")
        } catch (err) {
            console.error("Error adding days:", err)
            alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
        } finally {
            setAddingDays(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusBadge = (inactiveDays) => {
        if (inactiveDays <= 3) return "status-warning"
        if (inactiveDays <= 7) return "status-danger"
        return "status-critical"
    }

    if (loading) {
        return <div className="loading-spinner">Yuklanmoqda...</div>
    }

    if (error) {
        return <div className="error-message">{error}</div>
    }

    return (
        <div className="inactive-clinics-page">
            <div className="page-header">
                <h1>Nofaol Klinikalar Boshqaruvi</h1>
                <p className="page-description">
                    Faoliyati to'xtatilgan klinikalar ro'yxati va ularga qo'shimcha vaqt berish imkoniyati
                </p>
            </div>

            <div className="inactive-clinics-stats">
                <div className="stat-card">
                    <h3>Jami nofaol klinikalar</h3>
                    <span className="stat-number">{totalItems}</span>
                </div>
                <div className="stat-card">
                    <h3>Kritik holat</h3>
                    <span className="stat-number critical">{inactiveClinics.filter((c) => c.inactive_days > 7).length}</span>
                </div>
            </div>

            {inactiveClinics.length === 0 ? (
                <div className="empty-state">
                    <h3>Nofaol klinikalar topilmadi</h3>
                    <p>Hozircha barcha klinikalar faol holatda</p>
                </div>
            ) : (
                <>
                    <div className="inactive-clinics-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Klinika nomi</th>
                                    <th>Email</th>
                                    <th>Nofaol bo'lgan sana</th>
                                    <th>Nofaol kunlar</th>
                                    <th>Xabardor qilingan</th>
                                    <th>Izoh</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inactiveClinics.map((clinic) => (
                                    <tr key={clinic.id}>
                                        <td>{clinic.id}</td>
                                        <td className="clinic-name">
                                            <strong>{clinic.clinic_name}</strong>
                                        </td>
                                        <td>{clinic.clinic_email}</td>
                                        <td>{formatDate(clinic.since)}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${getStatusBadge(clinic.inactive_days)}`}
                                                title={clinic.last_extension_comment || "Izoh mavjud emas"}
                                            >
                                                {clinic.inactive_days} kun
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`notification-badge ${clinic.notified ? "notified" : "not-notified"}`}>
                                                {clinic.notified ? "Ha" : "Yo'q"}
                                            </span>
                                        </td>
                                        <td className="comment-cell">{clinic.comment || "Izoh yo'q"}</td>
                                        <td className="actions-cell">
                                            <button className="btn btn-primary btn-sm" onClick={() => handleAddDays(clinic)}>
                                                Vaqt qo'shish
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Add Days Modal */}
            <Modal isOpen={showAddDaysModal} onClose={() => setShowAddDaysModal(false)} title="Klinikaga vaqt qo'shish">
                <div className="add-days-modal">
                    {selectedClinic && (
                        <div className="clinic-info">
                            <h4>{selectedClinic.clinic_name}</h4>
                            <p>
                                Hozirgi nofaol kunlar: <strong>{selectedClinic.inactive_days}</strong>
                            </p>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="days-select">Qo'shimcha vaqt tanlang:</label>
                        <select
                            id="days-select"
                            value={selectedDays}
                            onChange={(e) => setSelectedDays(Number.parseInt(e.target.value))}
                            className="form-select"
                        >
                            {dayOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="comment-input">Izoh (ixtiyoriy):</label>
                        <textarea
                            id="comment-input"
                            value={selectedComment}
                            onChange={(e) => setSelectedComment(e.target.value)}
                            className="form-textarea"
                            placeholder="Nima sababdan qo'shimcha vaqt berilayotganini yozing..."
                            rows={3}
                        />
                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={() => setShowAddDaysModal(false)} disabled={addingDays}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={confirmAddDays} disabled={addingDays}>
                            {addingDays ? "Qo'shilmoqda..." : "Vaqt qo'shish"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AdminInactiveClinics

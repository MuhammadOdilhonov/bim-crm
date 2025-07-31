"use client"

import { useState, useEffect } from "react"
import {
    getTargets,
    addTargetComment,
    updateTargetStatus,
    deleteTarget,
    getLocations,
    getTargetStats,
} from "../../api/apiLid"
import Pagination from "../../components/Pagination"
import Modal from "../../components/Modal"

const Instagram = () => {
    const [targets, setTargets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage] = useState(10)

    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [locations, setLocations] = useState([])

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        aloqada: 0,
        kutilmoqda: 0,
        mijozga_aylandi: 0,
    })

    // Modal states
    const [showCommentModal, setShowCommentModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedTarget, setSelectedTarget] = useState(null)
    const [comment, setComment] = useState("")
    const [actionLoading, setActionLoading] = useState(false)

    // Status options
    const statusOptions = [
        { value: "yangi", label: "Yangi" },
        { value: "kutilmoqda", label: "Kutilmoqda" },
        { value: "aloqada", label: "Aloqada" },
        { value: "mijozga_aylandi", label: "Mijozga aylandi" },
        { value: "rad_etildi", label: "Rad etildi" },
        { value: "telefon_kotarmadi", label: "Telefon ko'tarmadi" },
        { value: "keyinroq_qilish", label: "Keyinroq telefon qilishni so'radi" },
        { value: "maslahatlashadi", label: "Maslahatlashadi" },
        { value: "raqam_xato", label: "Raqam xato" },
    ]

    useEffect(() => {
        fetchTargets()
        fetchLocations()
        fetchStats()
    }, [currentPage, searchTerm, selectedLocation, selectedStatus])

    const fetchTargets = async () => {
        setLoading(true)
        try {
            const result = await getTargets(currentPage + 1, searchTerm, selectedLocation, selectedStatus)
            if (result.success) {
                setTargets(result.data.results)
                setTotalItems(result.data.count)
                setError("")
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError("Failed to fetch targets")
        } finally {
            setLoading(false)
        }
    }

    const fetchLocations = async () => {
        const result = await getLocations()
        if (result.success) {
            setLocations(result.data)
        }
    }

    const fetchStats = async () => {
        const result = await getTargetStats()
        if (result.success) {
            setStats(result.data)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage)
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(0)
    }

    const handleLocationFilter = (e) => {
        setSelectedLocation(e.target.value)
        setCurrentPage(0)
    }

    const handleStatusFilter = (e) => {
        setSelectedStatus(e.target.value)
        setCurrentPage(0)
    }

    const openCommentModal = (target) => {
        setSelectedTarget(target)
        setComment(target.comment || "")
        setShowCommentModal(true)
    }

    const openDeleteModal = (target) => {
        setSelectedTarget(target)
        setShowDeleteModal(true)
    }

    const handleAddComment = async () => {
        if (!selectedTarget || !comment.trim()) return

        setActionLoading(true)
        try {
            const result = await addTargetComment(selectedTarget.id, comment.trim())
            if (result.success) {
                setShowCommentModal(false)
                setComment("")
                setSelectedTarget(null)
                fetchTargets()
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError("Failed to add comment")
        } finally {
            setActionLoading(false)
        }
    }

    const handleStatusChange = async (targetId, newStatus) => {
        setActionLoading(true)
        try {
            const result = await updateTargetStatus(targetId, newStatus)
            if (result.success) {
                fetchTargets()
                fetchStats()
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError("Failed to update status")
        } finally {
            setActionLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedTarget) return

        setActionLoading(true)
        try {
            const result = await deleteTarget(selectedTarget.id)
            if (result.success) {
                setShowDeleteModal(false)
                setSelectedTarget(null)
                fetchTargets()
                fetchStats()
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError("Failed to delete target")
        } finally {
            setActionLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusLabel = (status) => {
        const statusOption = statusOptions.find((option) => option.value === status)
        return statusOption ? statusOption.label : status
    }

    const getStatusClass = (status) => {
        const statusClasses = {
            yangi: "new",
            kutilmoqda: "pending",
            aloqada: "active",
            mijozga_aylandi: "success",
            rad_etildi: "danger",
            telefon_kotarmadi: "warning",
            keyinroq_qilish: "info",
            maslahatlashadi: "secondary",
            raqam_xato: "danger",
        }
        return statusClasses[status] || "pending"
    }

    if (loading && targets.length === 0) {
        return (
            <div className="instagram-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="instagram-page">
            <div className="page-header">
                <h1>Instagram Lidlar</h1>
                <p>Instagram orqali kelgan potensial mijozlar</p>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError("")} className="close-error">
                        ×
                    </button>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stats-card total">
                    <div className="stats-icon">
                        <span>👥</span>
                    </div>
                    <div className="stats-info">
                        <h3 className="stats-title">Jami lidlar</h3>
                        <p className="stats-value">{stats.total}</p>
                        <div className="stats-change">Barcha vaqt</div>
                    </div>
                </div>
                <div className="stats-card contacted">
                    <div className="stats-icon">
                        <span>📞</span>
                    </div>
                    <div className="stats-info">
                        <h3 className="stats-title">Aloqada</h3>
                        <p className="stats-value">{stats.aloqada}</p>
                        <div className="stats-change positive">
                            {stats.total > 0 ? Math.round((stats.aloqada / stats.total) * 100) : 0}%
                        </div>
                    </div>
                </div>
                <div className="stats-card pending">
                    <div className="stats-icon">
                        <span>⏳</span>
                    </div>
                    <div className="stats-info">
                        <h3 className="stats-title">Kutilmoqda</h3>
                        <p className="stats-value">{stats.kutilmoqda}</p>
                        <div className="stats-change">
                            {stats.total > 0 ? Math.round((stats.kutilmoqda / stats.total) * 100) : 0}%
                        </div>
                    </div>
                </div>
                <div className="stats-card converted">
                    <div className="stats-icon">
                        <span>✅</span>
                    </div>
                    <div className="stats-info">
                        <h3 className="stats-title">Mijozga aylandi</h3>
                        <p className="stats-value">{stats.mijozga_aylandi}</p>
                        <div className="stats-change positive">
                            {stats.total > 0 ? Math.round((stats.mijozga_aylandi / stats.total) * 100) : 0}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Ism, telefon yoki klinika nomi bo'yicha qidirish..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <div className="location-filter">
                        <select value={selectedLocation} onChange={handleLocationFilter}>
                            <option value="">Barcha hududlar</option>
                            <option value="">Hududni tanlang</option>
                            <option value="Toshkent">Toshkent</option>
                            <option value="Toshkent viloyati">Toshkent viloyati</option>
                            <option value="Samarqand">Samarqand</option>
                            <option value="Buxoro">Buxoro</option>
                            <option value="Andijon">Andijon</option>
                            <option value="Farg'ona">Farg'ona</option>
                            <option value="Namangan">Namangan</option>
                            <option value="Qashqadaryo">Qashqadaryo</option>
                            <option value="Surxondaryo">Surxondaryo</option>
                            <option value="Jizzax">Jizzax</option>
                            <option value="Sirdaryo">Sirdaryo</option>
                            <option value="Navoiy">Navoiy</option>
                            <option value="Xorazm">Xorazm</option>
                            <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
                        </select>
                    </div>
                    <div className="status-filter">
                        <select value={selectedStatus} onChange={handleStatusFilter}>
                            <option value="">Barcha holatlar</option>
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-actions">
                        <button
                            onClick={() => {
                                setSearchTerm("")
                                setSelectedLocation("")
                                setSelectedStatus("")
                                setCurrentPage(0)
                            }}
                            className="btn btn-secondary btn-sm"
                        >
                            Tozalash
                        </button>
                    </div>
                </div>
            </div>

            {/* Targets Table */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Lidlar ro'yxati</h2>
                    <div className="card-actions">
                        <span className="results-count">Jami: {totalItems} ta natija</span>
                        <button onClick={fetchTargets} className="btn btn-sm btn-secondary" disabled={loading}>
                            {loading ? "Yuklanmoqda..." : "Yangilash"}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {targets.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Hech qanday lid topilmadi</h3>
                            <p>Filtrlarni o'zgartirib ko'ring yoki keyinroq qaytib keling</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mijoz ma'lumotlari</th>
                                        <th>Hudud</th>
                                        <th>Klinika nomi</th>
                                        <th>Holat</th>
                                        <th>Sana</th>
                                        <th>Izoh</th>
                                        <th>Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {targets.map((target) => (
                                        <tr key={target.id}>
                                            <td>
                                                <div className="customer-info">
                                                    <div className="customer-name">
                                                        <strong>{target.name}</strong>
                                                    </div>
                                                    <div className="customer-phone">
                                                        <a href={`tel:${target.phone_number}`} className="phone-link">
                                                            {target.phone_number}
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="location-badge">{target.location}</span>
                                            </td>
                                            <td>
                                                <div className="clinic-info">{target.clinic_name}</div>
                                            </td>
                                            <td>
                                                <select
                                                    value={target.status || "yangi"}
                                                    onChange={(e) => handleStatusChange(target.id, e.target.value)}
                                                    className={`status-select ${getStatusClass(target.status || "yangi")}`}
                                                    disabled={actionLoading}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="date-info">
                                                    <div className="date-primary">{new Date(target.created_at).toLocaleDateString("uz-UZ")}</div>
                                                    <div className="date-secondary">
                                                        {new Date(target.created_at).toLocaleTimeString("uz-UZ", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="comment-preview">
                                                    {target.comment ? (
                                                        <div className="has-comment" title={target.comment}>
                                                            <span className="comment-indicator">💬</span>
                                                            <span className="comment-text">
                                                                {target.comment.length > 30 ? `${target.comment.substring(0, 30)}...` : target.comment}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="no-comment">Izoh yo'q</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => openCommentModal(target)}
                                                        className="btn btn-sm btn-secondary"
                                                        title="Izoh qo'shish"
                                                    >
                                                        💬
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(target)}
                                                        className="btn btn-sm btn-danger"
                                                        title="O'chirish"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalItems > itemsPerPage && (
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Comment Modal */}
            <Modal
                isOpen={showCommentModal}
                onClose={() => {
                    setShowCommentModal(false)
                    setComment("")
                    setSelectedTarget(null)
                }}
                title="Izoh qo'shish"
            >
                <div className="comment-modal">
                    {selectedTarget && (
                        <div className="target-info">
                            <h4>{selectedTarget.name}</h4>
                            <p>{selectedTarget.phone_number}</p>
                            <p>
                                {selectedTarget.location} - {selectedTarget.clinic_name}
                            </p>
                            <div className="current-status">
                                <span className={`status-badge ${getStatusClass(selectedTarget.status || "yangi")}`}>
                                    {getStatusLabel(selectedTarget.status || "yangi")}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="comment">Izoh:</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Bu mijoz bilan gaplashgan tajribangizni yozing..."
                            rows="4"
                            maxLength="500"
                        />
                        <div className="character-count">{comment.length}/500 belgi</div>
                    </div>
                    <div className="modal-actions">
                        <button
                            onClick={() => {
                                setShowCommentModal(false)
                                setComment("")
                                setSelectedTarget(null)
                            }}
                            className="btn btn-secondary"
                            disabled={actionLoading}
                        >
                            Bekor qilish
                        </button>
                        <button onClick={handleAddComment} className="btn btn-primary" disabled={actionLoading || !comment.trim()}>
                            {actionLoading ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setSelectedTarget(null)
                }}
                title="Lidni o'chirish"
            >
                <div className="delete-modal">
                    {selectedTarget && (
                        <div className="delete-confirmation">
                            <div className="warning-icon">⚠️</div>
                            <h3>Lidni o'chirishni tasdiqlang</h3>
                            <p>
                                <strong>{selectedTarget.name}</strong> lidini butunlay o'chirishni xohlaysizmi?
                            </p>
                            <div className="target-summary">
                                <div className="summary-item">
                                    <span>Telefon:</span>
                                    <span>{selectedTarget.phone_number}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Hudud:</span>
                                    <span>{selectedTarget.location}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Klinika:</span>
                                    <span>{selectedTarget.clinic_name}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Holat:</span>
                                    <span className={`status-badge ${getStatusClass(selectedTarget.status || "yangi")}`}>
                                        {getStatusLabel(selectedTarget.status || "yangi")}
                                    </span>
                                </div>
                            </div>
                            <div className="warning-text">
                                <strong>Diqqat:</strong> Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi!
                            </div>
                        </div>
                    )}
                    <div className="modal-actions">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false)
                                setSelectedTarget(null)
                            }}
                            className="btn btn-secondary"
                            disabled={actionLoading}
                        >
                            Bekor qilish
                        </button>
                        <button onClick={handleDelete} className="btn btn-danger" disabled={actionLoading}>
                            {actionLoading ? "O'chirilmoqda..." : "Ha, o'chirish"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Instagram

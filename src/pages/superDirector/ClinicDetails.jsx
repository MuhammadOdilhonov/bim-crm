"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
    getClinicDetails,
    getClinicSubscription,
    getClinicFinancial,
    getClinicBranches,
    getBranchStatistics,
    getClinicSubscriptionHistory,
    updateClinicDetails,
    deleteClinic,
} from "../../api/apiClinics"
import Modal from "../../components/Modal"
import Pagination from "../../components/Pagination"

const ClinicDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [clinic, setClinic] = useState(null)
    const [subscription, setSubscription] = useState(null)
    const [financial, setFinancial] = useState(null)
    const [branches, setBranches] = useState([])
    const [branchStats, setBranchStats] = useState([])
    const [subscriptionHistory, setSubscriptionHistory] = useState([])
    const [totalSubscriptionHistory, setTotalSubscriptionHistory] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState("general")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [editFormData, setEditFormData] = useState({})
    const [submitting, setSubmitting] = useState(false)

    // Subscription history pagination
    const [subscriptionHistoryPage, setSubscriptionHistoryPage] = useState(0)
    const [subscriptionHistoryPerPage] = useState(5)
    const [subscriptionHistoryLoading, setSubscriptionHistoryLoading] = useState(false)

    useEffect(() => {
        fetchClinicData()
    }, [id])

    useEffect(() => {
        if (activeTab === "subscription") {
            fetchSubscriptionHistory()
        }
    }, [activeTab, subscriptionHistoryPage])

    const fetchClinicData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch clinic general details
            const clinicResult = await getClinicDetails(id)
            if (clinicResult.success) {
                setClinic(clinicResult.data)
                setEditFormData({
                    clinic_name: clinicResult.data.clinic_name,
                    director: clinicResult.data.director,
                    address: clinicResult.data.address,
                    phone: clinicResult.data.phone,
                    email: clinicResult.data.email,
                })
            } else {
                setError(clinicResult.error || "Failed to fetch clinic details")
                return
            }

            // Fetch additional data based on active tab
            await fetchTabData(activeTab)
        } catch (err) {
            console.error("Error fetching clinic data:", err)
            setError("Failed to load clinic data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const fetchTabData = async (tab) => {
        try {
            if (tab === "subscription" && !subscription) {
                const subscriptionResult = await getClinicSubscription(id)
                if (subscriptionResult.success) {
                    setSubscription(subscriptionResult.data)
                }

                const financialResult = await getClinicFinancial(id)
                if (financialResult.success) {
                    setFinancial(financialResult.data)
                }
            } else if (tab === "branches" && branches.length === 0) {
                const branchesResult = await getClinicBranches(id)
                if (branchesResult.success) {
                    setBranches(branchesResult.data)
                }

                const statsResult = await getBranchStatistics(id)
                if (statsResult.success) {
                    setBranchStats(statsResult.data)
                }
            }
        } catch (err) {
            console.error(`Error fetching ${tab} data:`, err)
        }
    }

    const fetchSubscriptionHistory = async () => {
        setSubscriptionHistoryLoading(true)

        try {
            const result = await getClinicSubscriptionHistory(id, subscriptionHistoryPage + 1, subscriptionHistoryPerPage)
            if (result.success) {
                setSubscriptionHistory(result.data.results || [])
                setTotalSubscriptionHistory(result.data.count || 0)
            }
        } catch (err) {
            console.error("Error fetching subscription history:", err)
        } finally {
            setSubscriptionHistoryLoading(false)
        }
    }

    const handleTabChange = async (tab) => {
        setActiveTab(tab)
        await fetchTabData(tab)
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target
        setEditFormData({
            ...editFormData,
            [name]: value,
        })
    }

    const handleEditSubmit = async () => {
        setSubmitting(true)
        setError(null)

        try {
            const result = await updateClinicDetails(id, editFormData)
            if (result.success) {
                setClinic({ ...clinic, ...editFormData })
                setIsEditModalOpen(false)
            } else {
                setError(result.error)
            }
        } catch (err) {
            console.error("Error updating clinic:", err)
            setError("Failed to update clinic. Please try again later.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setSubmitting(true)
        setError(null)

        try {
            const result = await deleteClinic(id)
            if (result.success) {
                navigate("/super-director/clinics")
            } else {
                setError(result.error)
            }
        } catch (err) {
            console.error("Error deleting clinic:", err)
            setError("Failed to delete clinic. Please try again later.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubscriptionHistoryPageChange = (selectedPage) => {
        setSubscriptionHistoryPage(selectedPage)
    }

    if (loading) {
        return <div className="loading">Ma'lumotlar yuklanmoqda...</div>
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Xatolik yuz berdi</h2>
                <p>{error}</p>
                <Link to="/super-director/clinics" className="btn btn-primary">
                    Klinikalar ro'yxatiga qaytish
                </Link>
            </div>
        )
    }

    if (!clinic) {
        return (
            <div className="not-found">
                <h2>Klinika topilmadi</h2>
                <Link to="/super-director/clinics" className="btn btn-primary">
                    Klinikalar ro'yxatiga qaytish
                </Link>
            </div>
        )
    }

    return (
        <div className="clinic-details-page">
            <div className="page-header">
                <div className="breadcrumbs">
                    <Link to="/super-director/clinics">Klinikalar</Link> / {clinic.clinic_name}
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(true)}>
                        Tahrirlash
                    </button>
                    <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                        O'chirish
                    </button>
                </div>
            </div>

            <div className="clinic-header">
                <div className="clinic-info">
                    <h1>{clinic.clinic_name}</h1>
                    <div className="clinic-meta">
                        <span className={`status ${clinic.status ? "active" : "inactive"}`}>
                            {clinic.status ? "Faol" : "Faol emas"}
                        </span>
                        <span className="director">Direktor: {clinic.director}</span>
                    </div>
                </div>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === "general" ? "active" : ""}`} onClick={() => handleTabChange("general")}>
                    Umumiy ma'lumot
                </button>
                <button
                    className={`tab ${activeTab === "subscription" ? "active" : ""}`}
                    onClick={() => handleTabChange("subscription")}
                >
                    Obuna ma'lumotlari
                </button>
                <button
                    className={`tab ${activeTab === "branches" ? "active" : ""}`}
                    onClick={() => handleTabChange("branches")}
                >
                    Filiallar
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "general" && (
                    <div className="dashboard-grid">
                        <div className="grid-col-6">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Klinika ma'lumotlari</h2>
                                </div>
                                <div className="card-body">
                                    <div className="info-list">
                                        <div className="info-item">
                                            <div className="info-label">Klinika nomi</div>
                                            <div className="info-value">{clinic.clinic_name}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Direktor</div>
                                            <div className="info-value">{clinic.director}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Manzil</div>
                                            <div className="info-value">{clinic.address}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Telefon</div>
                                            <div className="info-value">{clinic.phone}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Email</div>
                                            <div className="info-value">{clinic.email}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Holati</div>
                                            <div className="info-value">
                                                <span className={`status ${clinic.status ? "active" : "inactive"}`}>
                                                    {clinic.status ? "Faol" : "Faol emas"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid-col-6">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Saqlash hajmi</h2>
                                </div>
                                <div className="card-body">
                                    <div className="storage-info">
                                        <div className="storage-usage">
                                            <div className="usage-label">Ishlatilgan</div>
                                            <div className="usage-bar">
                                                <div
                                                    className="usage-progress"
                                                    style={{
                                                        width: `${clinic.storage.allocated > 0 ? (clinic.storage.used / clinic.storage.allocated) * 100 : 0
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="usage-value">{clinic.storage.used} GB</div>
                                        </div>

                                        <div className="storage-details">
                                            <div className="storage-item">
                                                <div className="storage-label">Ajratilgan hajm</div>
                                                <div className="storage-value">{clinic.storage.allocated} GB</div>
                                            </div>
                                            <div className="storage-item">
                                                <div className="storage-label">Bo'sh joy</div>
                                                <div className="storage-value">{clinic.storage.remaining} GB</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "subscription" && subscription && financial && (
                    <div className="dashboard-grid">
                        <div className="grid-col-6">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Obuna ma'lumotlari</h2>
                                </div>
                                <div className="card-body">
                                    <div className="info-list">
                                        <div className="info-item">
                                            <div className="info-label">Tarif rejasi</div>
                                            <div className="info-value">{subscription.plan_name}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Obuna boshlanish sanasi</div>
                                            <div className="info-value">{new Date(subscription.start_date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Obuna tugash sanasi</div>
                                            <div className="info-value">{new Date(subscription.end_date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Chegirmalar</div>
                                            <div className="info-value">{subscription.discount || "Yo'q"}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Sinov muddati</div>
                                            <div className="info-value">{subscription.trial_period ? "Ha" : "Yo'q"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid-col-6">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Moliyaviy ma'lumotlar</h2>
                                </div>
                                <div className="card-body">
                                    <div className="info-list">
                                        <div className="info-item">
                                            <div className="info-label">Tarif narxi</div>
                                            <div className="info-value">{financial.subscription_price.toLocaleString()} so'm</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Chegirma miqdori</div>
                                            <div className="info-value">{financial.discount_amount.toLocaleString()} so'm</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Ma'lumotlar bazasi xarajati</div>
                                            <div className="info-value">{financial.data_storage_cost.toLocaleString()} so'm</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Ajratilgan saqlash xarajati</div>
                                            <div className="info-value">{financial.allocated_storage_cost.toLocaleString()} so'm</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Taxminiy foydalanilgan saqlash</div>
                                            <div className="info-value">{financial.estimated_storage_used_gb} GB</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Sof foyda</div>
                                            <div className="info-value profit">{financial.net_profit.toLocaleString()} so'm</div>
                                        </div>
                                    </div>

                                    <div className="financial-chart">
                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment revenue"
                                                style={{ width: "100%" }}
                                                title={`Tarif narxi: ${financial.subscription_price.toLocaleString()} so'm`}
                                            ></div>
                                        </div>

                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment discount"
                                                style={{ width: `${(financial.discount_amount / financial.subscription_price) * 100}%` }}
                                                title={`Chegirma miqdori: ${financial.discount_amount.toLocaleString()} so'm`}
                                            ></div>
                                        </div>

                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment cost"
                                                style={{ width: `${(financial.data_storage_cost / financial.subscription_price) * 100}%` }}
                                                title={`Ma'lumotlar bazasi xarajati: ${financial.data_storage_cost.toLocaleString()} so'm`}
                                            ></div>
                                        </div>

                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment storage-cost"
                                                style={{ width: `${(financial.allocated_storage_cost / financial.subscription_price) * 100}%` }}
                                                title={`Ajratilgan saqlash xarajati: ${financial.allocated_storage_cost.toLocaleString()} so'm`}
                                            ></div>
                                        </div>

                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment profit"
                                                style={{ width: `${(financial.net_profit / financial.subscription_price) * 100}%` }}
                                                title={`Sof foyda: ${financial.net_profit.toLocaleString()} so'm`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription History */}
                        <div className="grid-col-12">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Obuna tarixi</h2>
                                </div>
                                <div className="card-body">
                                    {subscriptionHistoryLoading ? (
                                        <div className="loading">Ma'lumotlar yuklanmoqda...</div>
                                    ) : (
                                        <>
                                            {subscriptionHistory.length === 0 ? (
                                                <div className="no-data">Obuna tarixi mavjud emas</div>
                                            ) : (
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Tarif rejasi</th>
                                                            <th>Boshlanish sanasi</th>
                                                            <th>Tugash sanasi</th>
                                                            <th>Holati</th>
                                                            <th>Chegirma</th>
                                                            <th>To'langan summa</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {subscriptionHistory.map((history, index) => (
                                                            <tr key={index}>
                                                                <td>{history.plan}</td>
                                                                <td>{new Date(history.start_date).toLocaleDateString()}</td>
                                                                <td>{new Date(history.end_date).toLocaleDateString()}</td>
                                                                <td>
                                                                    <span className={`status ${history.status === "active" ? "active" : "inactive"}`}>
                                                                        {history.status === "active" ? "Faol" : "Tugagan"}
                                                                    </span>
                                                                </td>
                                                                <td>{history.discount || "Yo'q"}</td>
                                                                <td>{Number(history.paid_amount).toLocaleString()} so'm</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}

                                            <Pagination
                                                itemsPerPage={subscriptionHistoryPerPage}
                                                totalItems={totalSubscriptionHistory}
                                                currentPage={subscriptionHistoryPage}
                                                onPageChange={handleSubscriptionHistoryPageChange}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "branches" && branches.length > 0 && (
                    <div className="dashboard-grid">
                        <div className="grid-col-12">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Filiallar ro'yxati</h2>
                                    <button className="btn btn-primary">+ Yangi filial</button>
                                </div>
                                <div className="card-body">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Filial nomi</th>
                                                <th>Manzil</th>
                                                <th>Telefon</th>
                                                <th>Shifokorlar</th>
                                                <th>Administratorlar</th>
                                                <th>Hamshiralar</th>
                                                <th>Jami xodimlar</th>
                                                <th>Bemorlar</th>
                                                <th>Harakatlar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {branches.map((branch, index) => (
                                                <tr key={index}>
                                                    <td>{branch.name}</td>
                                                    <td>{branch.address}</td>
                                                    <td>{branch.phone}</td>
                                                    <td>{branch.doctors}</td>
                                                    <td>{branch.administrators}</td>
                                                    <td>{branch.nurses}</td>
                                                    <td>{branch.total_employees}</td>
                                                    <td>{branch.patients}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-secondary">Batafsil</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {branchStats.length > 0 && (
                            <div className="grid-col-12">
                                <div className="dashboard-card">
                                    <div className="card-header">
                                        <h2>Filiallar statistikasi</h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="branches-stats">
                                            <div className="stats-row">
                                                {branchStats.map((branch, index) => (
                                                    <div className="branch-stat-card" key={index}>
                                                        <div className="branch-name">{branch.branch_name}</div>
                                                        <div className="branch-staff">
                                                            <div className="staff-count">
                                                                <span className="count">{branch.employees.total}</span>
                                                                <span className="label">Xodimlar</span>
                                                            </div>
                                                            <div className="staff-breakdown">
                                                                <div className="breakdown-item">
                                                                    <span className="count">{branch.employees.doctors}</span>
                                                                    <span className="label">Shifokor</span>
                                                                </div>
                                                                <div className="breakdown-item">
                                                                    <span className="count">{branch.employees.admins}</span>
                                                                    <span className="label">Admin</span>
                                                                </div>
                                                                <div className="breakdown-item">
                                                                    <span className="count">{branch.employees.nurses}</span>
                                                                    <span className="label">Hamshira</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="branch-patients">
                                                            <div className="patient-count">
                                                                <span className="count">{branch.patients.total}</span>
                                                                <span className="label">Bemorlar</span>
                                                            </div>
                                                            <div className="patient-breakdown">
                                                                <div className="breakdown-item">
                                                                    <span className="count">{branch.patients.daily}</span>
                                                                    <span className="label">Kunlik</span>
                                                                </div>
                                                                <div className="breakdown-item">
                                                                    <span className="count">{branch.patients.monthly}</span>
                                                                    <span className="label">Oylik</span>
                                                                </div>
                                                                <div className="breakdown-item">
                                                                    <span className="count">{branch.patients.yearly}</span>
                                                                    <span className="label">Yillik</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Klinika ma'lumotlarini tahrirlash"
            >
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="clinic_name">Klinika nomi</label>
                        <input
                            type="text"
                            id="clinic_name"
                            name="clinic_name"
                            value={editFormData.clinic_name || ""}
                            onChange={handleEditInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="director">Direktor</label>
                        <input
                            type="text"
                            id="director"
                            name="director"
                            value={editFormData.director || ""}
                            onChange={handleEditInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Manzil</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={editFormData.address || ""}
                            onChange={handleEditInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Telefon</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={editFormData.phone || ""}
                            onChange={handleEditInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={editFormData.email || ""}
                            onChange={handleEditInputChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)} disabled={submitting}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-primary" onClick={handleEditSubmit} disabled={submitting}>
                            {submitting ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Klinikani o'chirish">
                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <p>Haqiqatan ham "{clinic.clinic_name}" klinikasini o'chirmoqchimisiz?</p>
                    <p style={{ color: "#e74c3c", fontSize: "14px" }}>
                        Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi.
                    </p>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={submitting}>
                            Bekor qilish
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
                            {submitting ? "O'chirilmoqda..." : "O'chirish"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ClinicDetails

"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { mockClinics } from "../../data/mockData"

const ClinicDetails = () => {
    const { id } = useParams()
    const [clinic, setClinic] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("general")

    useEffect(() => {
        // Find clinic by id
        const foundClinic = mockClinics.find((c) => c.id === Number.parseInt(id))

        if (foundClinic) {
            setClinic(foundClinic)
        }

        setLoading(false)
    }, [id])

    if (loading) {
        return <div className="loading">Ma'lumotlar yuklanmoqda...</div>
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
                    <Link to="/super-director/clinics">Klinikalar</Link> / {clinic.name}
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">Tahrirlash</button>
                </div>
            </div>

            <div className="clinic-header">
                <div className="clinic-info">
                    <h1>{clinic.name}</h1>
                    <div className="clinic-meta">
                        <span className={`status ${clinic.status}`}>
                            {clinic.status === "active" ? "Faol" : clinic.status === "pending" ? "Kutilmoqda" : "Faol emas"}
                        </span>
                        <span className="director">Direktor: {clinic.director}</span>
                        <span className="branches">Filiallar soni: {clinic.branches.length}</span>
                        {clinic.isTrial && <span className="trial-badge">Sinov muddati</span>}
                        {clinic.hasIssues && <span className="issue-badge">API muammolari mavjud</span>}
                    </div>
                </div>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === "general" ? "active" : ""}`} onClick={() => setActiveTab("general")}>
                    Umumiy ma'lumot
                </button>
                <button
                    className={`tab ${activeTab === "subscription" ? "active" : ""}`}
                    onClick={() => setActiveTab("subscription")}
                >
                    Obuna ma'lumotlari
                </button>
                <button className={`tab ${activeTab === "branches" ? "active" : ""}`} onClick={() => setActiveTab("branches")}>
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
                                            <div className="info-value">{clinic.name}</div>
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
                                                <span className={`status ${clinic.status}`}>
                                                    {clinic.status === "active"
                                                        ? "Faol"
                                                        : clinic.status === "pending"
                                                            ? "Kutilmoqda"
                                                            : "Faol emas"}
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
                                            <div className="usage-value">
                                                {clinic.storageUsed.tb > 0 ? `${clinic.storageUsed.tb} TB ` : ""}
                                                {clinic.storageUsed.gb > 0 ? `${clinic.storageUsed.gb} GB ` : ""}
                                                {clinic.storageUsed.mb > 0 ? `${clinic.storageUsed.mb} MB` : ""}
                                            </div>
                                        </div>

                                        <div className="storage-details">
                                            <div className="storage-item">
                                                <div className="storage-label">Ajratilgan hajm</div>
                                                <div className="storage-value">
                                                    {clinic.storageAllocated.tb > 0 ? `${clinic.storageAllocated.tb} TB ` : ""}
                                                    {clinic.storageAllocated.gb > 0 ? `${clinic.storageAllocated.gb} GB ` : ""}
                                                    {clinic.storageAllocated.mb > 0 ? `${clinic.storageAllocated.mb} MB` : ""}
                                                </div>
                                            </div>
                                            <div className="storage-item">
                                                <div className="storage-label">Bo'sh joy</div>
                                                <div className="storage-value">
                                                    {(clinic.storageAllocated.gb - clinic.storageUsed.gb).toFixed(1)} GB
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "subscription" && (
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
                                            <div className="info-value">{clinic.tariff}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Obuna boshlanish sanasi</div>
                                            <div className="info-value">{new Date(clinic.subscriptionStart).toLocaleDateString()}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Obuna tugash sanasi</div>
                                            <div className="info-value">{new Date(clinic.subscriptionEnd).toLocaleDateString()}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Chegirmalar</div>
                                            <div className="info-value">{clinic.discounts}</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Sinov muddati</div>
                                            <div className="info-value">{clinic.isTrial ? "Ha" : "Yo'q"}</div>
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
                                            <div className="info-value">{clinic.tariffPrice.toLocaleString()} so'm</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Ma'lumotlar bazasi xarajati</div>
                                            <div className="info-value">{clinic.databaseCost.toLocaleString()} so'm</div>
                                        </div>
                                        <div className="info-item">
                                            <div className="info-label">Sof foyda</div>
                                            <div className="info-value profit">{clinic.profit.toLocaleString()} so'm</div>
                                        </div>
                                    </div>

                                    <div className="financial-chart">
                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment revenue"
                                                style={{ width: "100%" }}
                                                title={`Tarif narxi: ${clinic.tariffPrice.toLocaleString()} so'm`}
                                            ></div>
                                        </div>

                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment cost"
                                                style={{ width: `${(clinic.databaseCost / clinic.tariffPrice) * 100}%` }}
                                                title={`Ma'lumotlar bazasi xarajati: ${clinic.databaseCost.toLocaleString()} so'm`}
                                            ></div>
                                        </div>

                                        <div className="chart-bar">
                                            <div
                                                className="chart-segment profit"
                                                style={{ width: `${(clinic.profit / clinic.tariffPrice) * 100}%` }}
                                                title={`Sof foyda: ${clinic.profit.toLocaleString()} so'm`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "branches" && (
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
                                            {clinic.branches.map((branch) => (
                                                <tr key={branch.id}>
                                                    <td>{branch.name}</td>
                                                    <td>{branch.address}</td>
                                                    <td>{branch.phone}</td>
                                                    <td>{branch.staff.doctors}</td>
                                                    <td>{branch.staff.admins}</td>
                                                    <td>{branch.staff.nurses}</td>
                                                    <td>{branch.staff.total}</td>
                                                    <td>{branch.patients.total}</td>
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

                        <div className="grid-col-12">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Filiallar statistikasi</h2>
                                </div>
                                <div className="card-body">
                                    <div className="branches-stats">
                                        <div className="stats-row">
                                            {clinic.branches.map((branch) => (
                                                <div className="branch-stat-card" key={branch.id}>
                                                    <div className="branch-name">{branch.name}</div>
                                                    <div className="branch-staff">
                                                        <div className="staff-count">
                                                            <span className="count">{branch.staff.total}</span>
                                                            <span className="label">Xodimlar</span>
                                                        </div>
                                                        <div className="staff-breakdown">
                                                            <div className="breakdown-item">
                                                                <span className="count">{branch.staff.doctors}</span>
                                                                <span className="label">Shifokor</span>
                                                            </div>
                                                            <div className="breakdown-item">
                                                                <span className="count">{branch.staff.admins}</span>
                                                                <span className="label">Admin</span>
                                                            </div>
                                                            <div className="breakdown-item">
                                                                <span className="count">{branch.staff.nurses}</span>
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClinicDetails

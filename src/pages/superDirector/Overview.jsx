"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { mockStatistics, mockClinics } from "../../data/mockData"

const Overview = () => {
    const [statistics, setStatistics] = useState(mockStatistics)
    const [recentClinics, setRecentClinics] = useState([])

    useEffect(() => {
        // Sort clinics by subscription start date (newest first)
        const sortedClinics = [...mockClinics]
            .sort((a, b) => new Date(b.subscriptionStart) - new Date(a.subscriptionStart))
            .slice(0, 3)

        setRecentClinics(sortedClinics)
    }, [])

    return (
        <div className="overview-page">
            <div className="dashboard-grid">
                {/* Stats Row */}
                <div className="grid-col-3">
                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "#3498db" }}>
                            🏥
                        </div>
                        <div className="stats-info">
                            <p className="stats-title">Jami klinikalar</p>
                            <h3 className="stats-value">{statistics.totalClinics}</h3>
                            <p className="stats-change positive">+2 o'tgan oyga nisbatan</p>
                        </div>
                    </div>
                </div>

                <div className="grid-col-3">
                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "#9b59b6" }}>
                            🏢
                        </div>
                        <div className="stats-info">
                            <p className="stats-title">Jami filiallar</p>
                            <h3 className="stats-value">{statistics.totalBranches}</h3>
                            <p className="stats-change positive">+1 o'tgan oyga nisbatan</p>
                        </div>
                    </div>
                </div>

                <div className="grid-col-3">
                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "#2ecc71" }}>
                            💰
                        </div>
                        <div className="stats-info">
                            <p className="stats-title">Jami daromad</p>
                            <h3 className="stats-value">{statistics.totalRevenue.toLocaleString()} so'm</h3>
                            <p className="stats-change positive">+15% o'tgan oyga nisbatan</p>
                        </div>
                    </div>
                </div>

                <div className="grid-col-3">
                    <div className="stats-card">
                        <div className="stats-icon" style={{ backgroundColor: "#e74c3c" }}>
                            👨‍⚕️
                        </div>
                        <div className="stats-info">
                            <p className="stats-title">Jami xodimlar</p>
                            <h3 className="stats-value">{statistics.totalStaff.total}</h3>
                            <p className="stats-change positive">+12 o'tgan oyga nisbatan</p>
                        </div>
                    </div>
                </div>

                {/* Clinics Status */}
                <div className="grid-col-6">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Klinikalar holati</h2>
                        </div>
                        <div className="card-body">
                            <div className="status-chart">
                                <div className="status-item">
                                    <div className="status-label">Faol</div>
                                    <div className="status-bar">
                                        <div
                                            className="status-progress active"
                                            style={{ width: `${(statistics.activeClinics / statistics.totalClinics) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="status-value">{statistics.activeClinics}</div>
                                </div>

                                <div className="status-item">
                                    <div className="status-label">Kutilmoqda</div>
                                    <div className="status-bar">
                                        <div
                                            className="status-progress pending"
                                            style={{ width: `${(statistics.pendingClinics / statistics.totalClinics) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="status-value">{statistics.pendingClinics}</div>
                                </div>

                                <div className="status-item">
                                    <div className="status-label">Faol emas</div>
                                    <div className="status-bar">
                                        <div
                                            className="status-progress inactive"
                                            style={{ width: `${(statistics.inactiveClinics / statistics.totalClinics) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="status-value">{statistics.inactiveClinics}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="grid-col-6">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Moliyaviy ko'rsatkichlar</h2>
                        </div>
                        <div className="card-body">
                            <div className="financial-summary">
                                <div className="financial-item">
                                    <div className="financial-label">Jami daromad</div>
                                    <div className="financial-value">{statistics.totalRevenue.toLocaleString()} so'm</div>
                                </div>

                                <div className="financial-item">
                                    <div className="financial-label">Ma'lumotlar bazasi xarajati</div>
                                    <div className="financial-value">{statistics.totalDatabaseCost.toLocaleString()} so'm</div>
                                </div>

                                <div className="financial-item">
                                    <div className="financial-label">Sof foyda</div>
                                    <div className="financial-value profit">{statistics.totalProfit.toLocaleString()} so'm</div>
                                </div>

                                <div className="financial-chart">
                                    <div className="chart-bar">
                                        <div
                                            className="chart-segment revenue"
                                            style={{ width: "100%" }}
                                            title={`Jami daromad: ${statistics.totalRevenue.toLocaleString()} so'm`}
                                        ></div>
                                    </div>

                                    <div className="chart-bar">
                                        <div
                                            className="chart-segment cost"
                                            style={{ width: `${(statistics.totalDatabaseCost / statistics.totalRevenue) * 100}%` }}
                                            title={`Ma'lumotlar bazasi xarajati: ${statistics.totalDatabaseCost.toLocaleString()} so'm`}
                                        ></div>
                                    </div>

                                    <div className="chart-bar">
                                        <div
                                            className="chart-segment profit"
                                            style={{ width: `${(statistics.totalProfit / statistics.totalRevenue) * 100}%` }}
                                            title={`Sof foyda: ${statistics.totalProfit.toLocaleString()} so'm`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Storage Summary */}
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
                                                width: `${((statistics.usedStorage.tb * 1024 * 1024 +
                                                        statistics.usedStorage.gb * 1024 +
                                                        statistics.usedStorage.mb) /
                                                        (statistics.totalStorage.tb * 1024 * 1024 +
                                                            statistics.totalStorage.gb * 1024 +
                                                            statistics.totalStorage.mb)) *
                                                    100
                                                    }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="usage-value">
                                        {statistics.usedStorage.tb > 0 ? `${statistics.usedStorage.tb} TB ` : ""}
                                        {statistics.usedStorage.gb > 0 ? `${statistics.usedStorage.gb} GB ` : ""}
                                        {statistics.usedStorage.mb > 0 ? `${statistics.usedStorage.mb} MB` : ""}
                                    </div>
                                </div>

                                <div className="storage-details">
                                    <div className="storage-item">
                                        <div className="storage-label">Ajratilgan hajm</div>
                                        <div className="storage-value">
                                            {statistics.totalStorage.tb > 0 ? `${statistics.totalStorage.tb} TB ` : ""}
                                            {statistics.totalStorage.gb > 0 ? `${statistics.totalStorage.gb} GB ` : ""}
                                            {statistics.totalStorage.mb > 0 ? `${statistics.totalStorage.mb} MB` : ""}
                                        </div>
                                    </div>
                                    <div className="storage-item">
                                        <div className="storage-label">Bo'sh joy</div>
                                        <div className="storage-value">
                                            {(
                                                statistics.totalStorage.gb +
                                                statistics.totalStorage.tb * 1024 -
                                                statistics.usedStorage.gb -
                                                statistics.usedStorage.tb * 1024
                                            ).toFixed(1)}{" "}
                                            GB
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff and Patients Summary */}
                <div className="grid-col-6">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Xodimlar va bemorlar</h2>
                        </div>
                        <div className="card-body">
                            <div className="staff-patients-summary">
                                <div className="summary-section">
                                    <h3>Xodimlar</h3>
                                    <div className="summary-grid">
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.totalStaff.doctors}</div>
                                            <div className="summary-label">Shifokorlar</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.totalStaff.admins}</div>
                                            <div className="summary-label">Administratorlar</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.totalStaff.nurses}</div>
                                            <div className="summary-label">Hamshiralar</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.totalStaff.total}</div>
                                            <div className="summary-label">Jami</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="summary-section">
                                    <h3>Bemorlar</h3>
                                    <div className="summary-grid">
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.totalPatients}</div>
                                            <div className="summary-label">Jami</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.monthlyPatientVisits}</div>
                                            <div className="summary-label">Oylik tashriflar</div>
                                        </div>
                                        <div className="summary-item">
                                            <div className="summary-value">{statistics.yearlyPatientVisits}</div>
                                            <div className="summary-label">Yillik tashriflar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Clinics */}
                <div className="grid-col-12">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Yangi qo'shilgan klinikalar</h2>
                            <Link to="/super-director/clinics" className="btn btn-sm btn-primary">
                                Barchasini ko'rish
                            </Link>
                        </div>
                        <div className="card-body">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Klinika nomi</th>
                                        <th>Direktor</th>
                                        <th>Filiallar soni</th>
                                        <th>Tarif</th>
                                        <th>Obuna davri</th>
                                        <th>Holati</th>
                                        <th>Harakatlar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentClinics.map((clinic) => (
                                        <tr key={clinic.id}>
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
                                            <td>{clinic.tariff}</td>
                                            <td>
                                                {new Date(clinic.subscriptionStart).toLocaleDateString()} -{" "}
                                                {new Date(clinic.subscriptionEnd).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`status ${clinic.status}`}>
                                                    {clinic.status === "active"
                                                        ? "Faol"
                                                        : clinic.status === "pending"
                                                            ? "Kutilmoqda"
                                                            : "Faol emas"}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/super-director/clinics/${clinic.id}`} className="btn btn-sm btn-secondary">
                                                    Batafsil
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview

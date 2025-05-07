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
                                            <td>{clinic.name}</td>
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

            <style jsx>{`
        .status-chart {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .status-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .status-label {
          width: 100px;
          font-size: 14px;
        }
        
        .status-bar {
          flex: 1;
          height: 10px;
          background-color: #f1f1f1;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .status-progress {
          height: 100%;
          border-radius: 5px;
        }
        
        .status-progress.active {
          background-color: #2ecc71;
        }
        
        .status-progress.pending {
          background-color: #f1c40f;
        }
        
        .status-progress.inactive {
          background-color: #e74c3c;
        }
        
        .status-value {
          width: 30px;
          text-align: right;
          font-weight: 600;
        }
        
        .financial-summary {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .financial-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .financial-label {
          font-size: 14px;
        }
        
        .financial-value {
          font-weight: 600;
        }
        
        .financial-value.profit {
          color: #2ecc71;
        }
        
        .financial-chart {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .chart-bar {
          height: 20px;
          background-color: #f1f1f1;
          border-radius: 5px;
          overflow: hidden;
        }
        
        .chart-segment {
          height: 100%;
          border-radius: 5px;
        }
        
        .chart-segment.revenue {
          background-color: #3498db;
        }
        
        .chart-segment.cost {
          background-color: #e74c3c;
        }
        
        .chart-segment.profit {
          background-color: #2ecc71;
        }
      `}</style>
        </div>
    )
}

export default Overview

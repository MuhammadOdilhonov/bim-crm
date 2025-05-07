"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { mockClinics } from "../../data/mockData"

const Clinics = () => {
    const [clinics] = useState(mockClinics)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    useEffect(() => {
        console.log("Clinics component mounted")
    }, [])

    const filteredClinics = clinics.filter((clinic) => {
        const matchesSearch =
            clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clinic.director.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || clinic.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Format storage function
    const formatStorage = (storage) => {
        if (storage.tb > 0) return `${storage.tb} TB`
        if (storage.gb > 0) return `${storage.gb} GB`
        return `${storage.mb} MB`
    }

    return (
        <div className="clinics-page">
            <h1 style={{ marginBottom: "20px" }}>Klinikalar</h1>

            <div className="dashboard-card">
                <div className="card-header">
                    <h2>Klinikalar ro'yxati</h2>
                    <div className="card-actions">
                        <button className="btn btn-primary">+ Yangi klinika</button>
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
                            {filteredClinics.map((clinic) => (
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
    )
}

export default Clinics

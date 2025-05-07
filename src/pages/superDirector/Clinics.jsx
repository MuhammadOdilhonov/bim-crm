"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { mockClinics } from "../../data/mockData"

const Clinics = () => {
    const [clinics, setClinics] = useState(mockClinics)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredClinics = clinics.filter((clinic) => {
        const matchesSearch =
            clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clinic.director.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || clinic.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="clinics-page">
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
                                <th>Filiallar soni</th>
                                <th>Xodimlar soni</th>
                                <th>Tarif</th>
                                <th>Saqlash hajmi</th>
                                <th>Obuna davri</th>
                                <th>Holati</th>
                                <th>Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClinics.map((clinic) => (
                                <tr key={clinic.id}>
                                    <td>{clinic.name}</td>
                                    <td>{clinic.director}</td>
                                    <td>{clinic.branches.length}</td>
                                    <td>{clinic.staff.total}</td>
                                    <td>{clinic.tariff}</td>
                                    <td>
                                        {clinic.storageAllocated.tb > 0 ? `${clinic.storageAllocated.tb} TB` : ""}
                                        {clinic.storageAllocated.gb > 0 ? `${clinic.storageAllocated.gb} GB` : ""}
                                        {clinic.storageAllocated.mb > 0 ? `${clinic.storageAllocated.mb} MB` : ""}
                                    </td>
                                    <td>
                                        {new Date(clinic.subscriptionStart).toLocaleDateString()} -{" "}
                                        {new Date(clinic.subscriptionEnd).toLocaleDateString()}
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

            <style jsx>{`
        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .search-box {
          flex: 1;
        }
        
        .search-box input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }
        
        .status-filter select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
          background-color: white;
        }
      `}</style>
        </div>
    )
}

export default Clinics

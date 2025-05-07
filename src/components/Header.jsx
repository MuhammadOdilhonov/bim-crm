"use client"

import { useState } from "react"

const Header = ({ title, user, toggleSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Mock notifications
    const notifications = [
        { id: 1, text: "Yangi klinika qo'shildi: Salomatlik", time: "10 daqiqa oldin" },
        { id: 2, text: "Shifokor Akbarov hisoboti yuborildi", time: "1 soat oldin" },
        { id: 3, text: "Tizim yangilandi v2.1.0", time: "2 soat oldin" },
    ]

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                    ☰
                </button>
                <h1>{title}</h1>
            </div>

            <div className="header-actions">
                <div className="notification-container">
                    <button
                        className="notification-btn"
                        onClick={() => {
                            setShowNotifications(!showNotifications)
                            if (showUserMenu) setShowUserMenu(false)
                        }}
                    >
                        🔔<span className="notification-badge">{notifications.length}</span>
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <h3>Bildirishnomalar</h3>
                            {notifications.length > 0 ? (
                                <ul>
                                    {notifications.map((notification) => (
                                        <li key={notification.id}>
                                            <p>{notification.text}</p>
                                            <span>{notification.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-notifications">Bildirishnomalar yo'q</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="user-container">
                    <button
                        className="user-btn"
                        onClick={() => {
                            setShowUserMenu(!showUserMenu)
                            if (showNotifications) setShowNotifications(false)
                        }}
                    >
                        <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
                        <span className="user-name">{user?.name}</span>
                    </button>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <ul>
                                <li>
                                    <button className="dropdown-link">Profil</button>
                                </li>
                                <li>
                                    <button className="dropdown-link">Sozlamalar</button>
                                </li>
                                <li>
                                    <button className="dropdown-link">Yordam</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header

"use client"

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal-container modal-${size}`}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    )
}

export default Modal

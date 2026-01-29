const Modal = ({ isOpen, onClose, title, children, size = 'default' }) => {
    if (!isOpen) return null;

    const sizes = {
        small: 'max-w-md',
        default: 'max-w-2xl',
        large: 'max-w-4xl',
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className={`modal ${sizes[size]}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-dark-50">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-dark-400 hover:text-dark-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </>
    );
};

export default Modal;

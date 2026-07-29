import React from 'react'

const RequestsModal = ({
    isOpen,
    onClose,
    requestTab,
    setRequestTab,
    incomingRequests = [],
    sentRequests = []
}) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 transition-all"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="bg-slate-900/90 border border-white/15 backdrop-blur-2xl rounded-2xl p-6 sm:p-7 w-full max-w-md shadow-2xl relative text-white">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    title="Close"
                    className="absolute top-5 right-5 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Modal Header */}
                <div>
                    <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">Chat Requests</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage your deliberate connections.</p>
                </div>

                {/* Tabs Bar */}
                <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1 mt-5">
                    <button
                        onClick={() => setRequestTab('incoming')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            requestTab === 'incoming'
                                ? 'bg-white/15 text-white border border-white/10 shadow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                        </svg>
                        <span>Incoming</span>
                    </button>
                    <button
                        onClick={() => setRequestTab('sent')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            requestTab === 'sent'
                                ? 'bg-white/15 text-white border border-white/10 shadow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        <span>Sent</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[140px] flex flex-col items-center justify-center text-center p-6 mt-2">
                    {requestTab === 'incoming' ? (
                        incomingRequests.length > 0 ? (
                            <div className="w-full flex flex-col gap-2">
                                {incomingRequests.map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                                        <span className="text-sm font-medium">{req.username || req.email}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No pending requests.</p>
                        )
                    ) : (
                        sentRequests.length > 0 ? (
                            <div className="w-full flex flex-col gap-2">
                                {sentRequests.map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                                        <span className="text-sm font-medium">{req.username || req.email}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No sent requests.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default RequestsModal

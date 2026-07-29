import React from 'react'

const AddContactModal = ({
    isOpen,
    onClose,
    findUsernameQuery,
    setFindUsernameQuery,
    onSendRequest
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
                    <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">Find Users</h2>
                    <p className="text-gray-400 text-sm mt-1">Search by username or name to send a chat request.</p>
                </div>

                {/* Username Search Input */}
                <div className="mt-5">
                    <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-xl overflow-hidden px-4 gap-2.5 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 shrink-0">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Type a username or name..."
                            value={findUsernameQuery}
                            onChange={(e) => setFindUsernameQuery(e.target.value)}
                            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-sm"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Search Results / Action List Area */}
                {findUsernameQuery.trim() && (
                    <div className="mt-4 max-h-48 overflow-y-auto flex flex-col gap-2">
                        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
                                    {findUsernameQuery.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium truncate text-white">{findUsernameQuery}</span>
                            </div>
                            <button
                                onClick={() => onSendRequest ? onSendRequest(findUsernameQuery) : null}
                                className="bg-pink-500 hover:bg-fuchsia-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition cursor-pointer shrink-0 shadow-sm"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddContactModal

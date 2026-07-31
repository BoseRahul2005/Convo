import React from 'react'

const RequestListItem = ({ person = {}, status, showActions, onAccept, onReject, onCancel }) => {
    const displayName = person?.username || person?.name || person?.email || 'User'
    const initial = displayName.charAt(0).toUpperCase()
    const shouldShowActions = showActions ?? Boolean(onAccept || onReject)

    return (
        <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/10 transition">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {initial}
                    </div>
                    {shouldShowActions && status && (
                        <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${status === 'pending' ? 'bg-amber-500' : 'bg-amber-500'}`} />
                    )}
                </div>
                <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                    {person?.name && person?.username && (
                        <p className="text-xs text-gray-400 truncate">{person.name}</p>
                    )}
                </div>
            </div>
            {shouldShowActions ? (
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={onAccept}
                        title="Accept"
                        className="w-9 h-9 rounded-xl bg-green-500 hover:bg-green-400 text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </button>
                    <button
                        onClick={onReject}
                        title="Reject"
                        className="w-9 h-9 rounded-xl bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 shrink-0">
                    {status && (
                        <span className="text-xs font-semibold capitalize px-2.5 py-1 rounded-full border shadow-sm shrink-0 bg-amber-500/15 text-amber-300 border-amber-500/30">
                            {status}
                        </span>
                    )}
                    <div className="relative group flex items-center">
                        <button
                            onClick={onCancel}
                            title="Cancel Request"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition cursor-pointer flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RequestListItem


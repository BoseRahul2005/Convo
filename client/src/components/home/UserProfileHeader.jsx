import React from 'react'

const UserProfileHeader = ({ userData, onLogout }) => {
    return (
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                {userData && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                        {userData.username.charAt(0).toUpperCase()}
                    </div>
                )}
                {/* User Details */}
                <div className="min-w-0 flex-1">
                    {userData && (
                        <>
                            <h2 className="text-white text-sm font-semibold truncate leading-tight">{userData.username}</h2>
                            <p className="text-gray-400 text-xs truncate leading-tight">{userData.email}</p>
                        </>
                    )}
                </div>
            </div>
            {/* Logout Button */}
            <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 ml-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
            </button>
        </div>
    )
}

export default UserProfileHeader

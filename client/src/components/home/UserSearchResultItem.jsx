import React from 'react'
import { isRequestSent,isRequestReceived } from '../../utils/requestHelpers'

const UserSearchResultItem = ({
    user,
    userData,
    sentRequests = [],
    incomingRequests = [],
    onSendRequest
}) => {
    const isSelf = Boolean(userData && user?._id === userData._id)
    const isSent = isRequestSent(sentRequests, user?._id)
    const isRecieved = isRequestReceived(incomingRequests, user?._id)

    return (
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-md">
                    {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium truncate text-white leading-tight">{user.username}</h4>
                    {user.name && <p className="text-xs text-gray-400 truncate leading-tight">{user.name}</p>}
                </div>
            </div>
            <button
                onClick={() => onSendRequest(user._id)}
                disabled={isSelf || isSent || isRecieved}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition shrink-0 shadow-sm ${
                    isSelf
                        ? "bg-gray-700 text-white/70 cursor-not-allowed"
                        : isSent
                        ? "bg-white/10 text-gray-300 border border-white/10 cursor-not-allowed"
                        : isRecieved
                        ? "bg-white/10 text-gray-300 border border-white/10 cursor-not-allowed"
                        : "bg-pink-500 hover:bg-fuchsia-500 text-white cursor-pointer"
                }`}
            >
                {isSelf ? "You" : isSent ? "Request Sent" : isRecieved ? "Request Received" : "Send Request"}
            </button>
        </div>
    )
}

export default UserSearchResultItem

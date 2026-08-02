import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { findUsers } from '../../api/requests'
import UserSearchResultItem from './UserSearchResultItem'

const AddContactModal = ({
    isOpen,
    onClose,
    findUserQuery,
    setFindUserQuery,
    onSendRequest,
    userData,
    sentRequests = [],
    incomingRequests = [],
    contacts=[]
}) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!findUserQuery || !findUserQuery.trim()) {
            setSearchResults([])
            return
        }

        const search = setTimeout(async () => {
            setIsSearching(true)
            try {
                const res = await findUsers(findUserQuery);
                if (res.data.success) {
                    setSearchResults(res.data.users || []);
                } else {
                    setSearchResults([]);
                }
            } catch (err) {
                console.log(err);
                toast.error(err.response?.data?.message || err.message || "Something went wrong");
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(search)
    }, [findUserQuery]);

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

                {/* Username and name Search Input */}
                <div className="mt-5">
                    <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-xl overflow-hidden px-4 gap-2.5 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 shrink-0">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Type a username or name..."
                            value={findUserQuery}
                            onChange={(e) => setFindUserQuery(e.target.value)}
                            className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none text-sm"
                            autoFocus
                        />
                        {findUserQuery && (
                            <button
                                type="button"
                                onClick={() => setFindUserQuery('')}
                                className="text-white/50 hover:text-white transition cursor-pointer p-1 shrink-0"
                                title="Clear search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results Area */}
                {findUserQuery.trim() && (
                    <div className="mt-4 max-h-48 overflow-y-auto flex flex-col gap-2">
                        {isSearching ? (
                            <p className="text-gray-400 text-xs text-center py-4">Searching...</p>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <UserSearchResultItem
                                    key={user._id}
                                    user={user}
                                    userData={userData}
                                    sentRequests={sentRequests}
                                    incomingRequests={incomingRequests}
                                    onSendRequest={onSendRequest}
                                    contacts={contacts}
                                />
                            ))
                        ) : (
                            <p className="text-gray-400 text-xs text-center py-4">No users found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddContactModal

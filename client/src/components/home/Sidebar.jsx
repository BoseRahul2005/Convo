import React, { useState, useEffect, useRef } from 'react'
import UserProfileHeader from './UserProfileHeader'
import formatMessageTime from '../../utils/formatMessageTime.js'

const Sidebar = ({
    userData,
    contacts = [],
    selectedContact,
    onSelectContact,
    onLogout,
    onOpenRequests,
    onOpenAddContact,
    searchQuery,
    setSearchQuery
}) => {
    const [sidebarWidth, setSidebarWidth] = useState(340)
    const [isResizing, setIsResizing] = useState(false)
    const isResizingRef = useRef(false)
    const animationFrameRef = useRef(null)

    // Handle smooth horizontal sidebar resizing up to 50% of the screen width
    const startResizing = (e) => {
        if (window.innerWidth < 1000) return;
        e.preventDefault()
        setIsResizing(true)
        isResizingRef.current = true
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'col-resize'
    }

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizingRef.current) return

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                const minWidth = 240
                const maxWidth = window.innerWidth * 0.5
                const newWidth = Math.min(Math.max(e.clientX - 16, minWidth), maxWidth)
                setSidebarWidth(newWidth)
            })
        }

        const handleMouseUp = () => {
            if (isResizingRef.current) {
                setIsResizing(false)
                isResizingRef.current = false
                document.body.style.userSelect = ''
                document.body.style.cursor = ''
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    return (
        <div
            style={{ width: `${sidebarWidth}px` }}
            className={`bg-white/6 border border-white/10 rounded-2xl flex-col p-4 backdrop-blur-md relative shrink-0 shadow-2xl overflow-hidden max-[999px]:!w-full ${
                selectedContact ? 'hidden min-[1000px]:flex' : 'flex'
            } ${isResizing ? 'transition-none select-none' : ''}`}
        >
            {/* Resizer Handle */}
            <div
                onMouseDown={startResizing}
                title="Drag to resize sidebar"
                className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-20 group transition-colors hidden min-[1000px]:block ${isResizing ? 'bg-indigo-500/80 w-3' : 'hover:bg-indigo-500/50'
                    }`}
            >
                {/* Visual grip indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors" />
            </div>

            {/* Top User Profile Header */}
            <UserProfileHeader userData={userData} onLogout={onLogout} />

            {/* Requests & Add Friend Action Bar */}
            <div className="flex items-center gap-2 mt-4">
                <button
                    onClick={onOpenRequests}
                    className="flex-1 flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 h-10 px-3.5 rounded-xl text-sm text-white/90 transition cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                    <span>Requests</span>
                </button>
                <button
                    onClick={onOpenAddContact}
                    title="Add Contact"
                    className="bg-pink-500 hover:bg-fuchsia-500 h-10 w-10 rounded-xl text-white flex items-center justify-center transition cursor-pointer shrink-0 shadow-md shadow-pink-600/30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                </button>
            </div>

            {/* Search / Filter Contacts Input */}
            <div className="mt-3">
                <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-10 rounded-xl overflow-hidden px-3.5 gap-2 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 shrink-0">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Filter contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-white text-sm placeholder-white/60 border-none outline-none"
                    />
                </div>
            </div>

            {/* Contacts List Area */}
            <div className="flex-1 mt-4 overflow-y-auto flex flex-col gap-1.5">
                {contacts.length > 0 ? (
                    contacts.map((contact) => {
                        const isSelected = selectedContact?.contactId === contact.contactId || (selectedContact?._id && selectedContact?._id === contact._id) || (selectedContact?.contactId && selectedContact?.contactId === contact._id) || (contact.contactId && selectedContact?._id === contact.contactId);
                        return (
                            <button
                                key={contact._id || contact.contactId}
                                onClick={() => onSelectContact(contact)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left cursor-pointer ${isSelected
                                        ? 'bg-fuchsia-500/15 border border-fuchsia-500/20'
                                        : 'bg-transparent border border-transparent hover:bg-white/10'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-md">
                                    {(contact.username || contact.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-semibold text-white truncate leading-tight">{contact.username}</h4>
                                    <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                                        {contact.lastMessage || "No messages yet"}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    {contact.lastMessageTime && (
                                        <span className="text-[10px] text-gray-500">
                                            {formatMessageTime(contact.lastMessageTime)}
                                        </span>
                                    )}
                                    {contact.unreadCount > 0 && (
                                        <span className="bg-pink-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                                            {contact.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </button>
                        )
                    })
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <p className="text-gray-400 text-sm">No contacts yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar

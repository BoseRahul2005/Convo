import React, { useState, useEffect, useRef } from 'react'
import UserProfileHeader from './UserProfileHeader'

const Sidebar = ({
    userData,
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
                isResizingRef.current = false
                setIsResizing(false)
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
            className={`bg-white/6 border border-white/10 rounded-2xl flex flex-col p-4 backdrop-blur-md relative shrink-0 shadow-2xl overflow-hidden ${
                isResizing ? 'transition-none select-none' : ''
            }`}
        >
            {/* Resizer Handle */}
            <div
                onMouseDown={startResizing}
                title="Drag to resize sidebar"
                className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-20 group transition-colors ${
                    isResizing ? 'bg-indigo-500/80 w-3' : 'hover:bg-indigo-500/50'
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
            <div className="flex-1 mt-4 overflow-y-auto flex flex-col items-center justify-center text-center p-4">
                <p className="text-gray-400 text-sm">No contacts yet.</p>
            </div>
        </div>
    )
}

export default Sidebar

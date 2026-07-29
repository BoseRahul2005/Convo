import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const Home = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [sidebarWidth, setSidebarWidth] = useState(340)
    const [isResizing, setIsResizing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
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

    const userDetails = async ()=>{
        try{
            const res = await API.get("/user/details");
            if(res.data.success){
                console.log("UserDetails",res.data);
                setUserData(res.data.userData);
            }
            else{
                navigate("/");
            }
        }
        catch(err){
            console.log(err);
            navigate("/");
        }finally{
            setTimeout(()=>{

                setIsLoading(false);
            },3000);
        }
    }

    useEffect(() => {
        userDetails();
    }, []);

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
    
     if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950">
                <img
                    src="/convo-logo.svg"
                    alt="Convo Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 animate-[zoomPulse_1.8s_ease-in-out_infinite] object-contain drop-shadow-[0_0_20px_rgba(236,200,221,0.4)]"
                />
                <p className="text-gray-400 text-sm italic tracking-wide">
                    Patience is bitter, but its fruit is sweet...
                </p>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950 text-white relative overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 box-border">
            {/* Soft Ambient Backdrop */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-gradient-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
                <div className="absolute right-12 bottom-10 w-105 h-55 bg-gradient-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
            </div>

            {/* Left Sidebar Panel */}
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
                        onClick={() => navigate('/')}
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

                {/* Requests & Add Friend Action Bar */}
                <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 h-10 px-3.5 rounded-xl text-sm text-white/90 transition cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                        </svg>
                        <span>Requests</span>
                    </button>
                    <button title="Add Contact" className="bg-pink-500 hover:bg-fuchsia-500 h-10 w-10 rounded-xl text-white flex items-center justify-center transition cursor-pointer shrink-0 shadow-md shadow-pink-600/30">
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

            {/* Main Chat Area */}
            <div className="flex-1 bg-white/6 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                {/* Centered Chat Placeholder */}
                <div className="flex flex-col items-center text-center max-w-sm px-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-white/80 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2 tracking-tight">
                        Deliberate connections
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Select a contact to start chatting, or send a request to someone new.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home

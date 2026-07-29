import React from 'react'

const ChatArea = () => {
    return (
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
    )
}

export default ChatArea

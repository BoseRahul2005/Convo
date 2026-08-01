import React, { useState, useEffect } from 'react'
import fetchMessages from '../../utils/fetchMessages.js';
import sendMessage from '../../utils/sendMessage.js';

const ChatArea = ({ selectedContact, userData, socket }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            const message = await sendMessage(selectedContact.contactId, input);
            if (message.success) {
                setMessages((prev) => [...prev, message.newMessage]);
                setInput('');
            }
        }
    }

    useEffect(() => {
        if (selectedContact) {
            setMessages([]); // clear old messages first
            fetchMessages(selectedContact.contactId, setMessages);
        }
    }, [selectedContact]);

    useEffect(()=>{
        if(!socket||!selectedContact) return;

        const handleNewMessage = (newMessage)=>{
            const isFromCurrentContact= (newMessage.sender._id || newMessage.sender) === selectedContact.contactId
            if(isFromCurrentContact){
                setMessages(prev=>[...prev,newMessage])
            }
        }

        socket.on("new_message",handleNewMessage);
        return()=>{
            socket.off("new_message",handleNewMessage);
        }
    },[socket,selectedContact])

    if (!selectedContact) {
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

    return (
        <div className="flex-1 bg-white/6 border border-white/10 rounded-2xl flex flex-col backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Header Bar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-md">
                        {(selectedContact.username || selectedContact.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-white text-base truncate leading-tight">
                        {selectedContact.username}
                    </span>
                </div>
                <button
                    title="More options"
                    className="p-2 text-gray-400 hover:text-white transition cursor-pointer rounded-xl hover:bg-white/10 shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col justify-end p-4 gap-2 overflow-y-auto">
                {messages.length > 0 ? (
                    messages.map((message) => {
                        const isOwnMessage = (message.sender?._id || message.sender) === userData?._id;
                        return (
                            <div key={message._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isOwnMessage
                                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-2xl rounded-br-md'
                                    : 'bg-white/10 text-white rounded-2xl rounded-bl-md'
                                    }`}>
                                    {message.text}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    /* Empty Messages Area */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/80 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-sm">
                            No messages yet. Say hello to {selectedContact.username}.
                        </p>
                    </div>
                )}
            </div>

            {/* Message Input Bar */}
            <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full px-4 gap-2 transition-all">
                    <input
                        type="text"
                        placeholder={`Message ${selectedContact.username}...`}
                        className="w-full bg-transparent text-white text-sm placeholder-white/40 border-none outline-none px-2"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />
                    <button
                        type="button"
                        className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-pink-500/30 transition cursor-pointer"
                        onClick={handleSend}
                        disabled={!input}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatArea

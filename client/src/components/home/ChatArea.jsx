import React, { useState, useEffect, useRef } from 'react'
import fetchMessages from '../../utils/fetchMessages.js';
import sendMessage from '../../utils/sendMessage.js';
import markSeen from '../../utils/MarkSeen.js';

const ChatArea = ({ selectedContact, userData, socket, onMessageActivity, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (input.trim()) {
            const message = await sendMessage(selectedContact.contactId, input);
            if (message.success) {
                setMessages((prev) => [...prev, message.newMessage]);
                setInput('');
                onMessageActivity();
            }
        }
    }

    const formatDateLabel = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
    }

    useEffect(() => {
        if (selectedContact) {
            setMessages([]); // clear old messages first
            fetchMessages(selectedContact.contactId, setMessages);
            markSeen(selectedContact.contactId).then(() => {
                onMessageActivity();
            })

        }
    }, [selectedContact]);

    useEffect(() => {
        if (!socket || !selectedContact) return;

        const handleNewMessage = (newMessage) => {
            const isFromCurrentContact = (newMessage.sender._id || newMessage.sender) === selectedContact.contactId
            if (isFromCurrentContact) {
                setMessages(prev => [...prev, newMessage])
            }
            onMessageActivity();
        }

        socket.on("new_message", handleNewMessage);
        return () => {
            socket.off("new_message", handleNewMessage);
        }
    }, [socket, selectedContact])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!selectedContact) {
        return (
            <div className="flex-1 bg-white/6 border border-white/10 rounded-2xl flex-col items-center justify-center p-6 backdrop-blur-md shadow-2xl relative overflow-hidden hidden min-[1000px]:flex">
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
        <div className="flex-1 bg-white/6 border border-white/10 rounded-2xl flex flex-col backdrop-blur-md shadow-2xl relative overflow-hidden w-full min-[1000px]:w-auto">
            {/* Header Bar */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        type="button"
                        title="Back to contacts"
                        onClick={onBack}
                        className="p-2 text-gray-400 hover:text-white transition cursor-pointer rounded-xl hover:bg-white/10 shrink-0 min-[1000px]:hidden"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </button>
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
            <div className="flex-1 min-h-0 p-4 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {messages.length > 0 ? (
                    <div className="flex flex-col justify-end min-h-full gap-2">
                        {messages.map((message, index) => {
                            const isOwnMessage = (message.sender?._id || message.sender) === userData?._id;
                            const time = new Date(message.createdAt).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' });

                            const currentDate = new Date(message.createdAt).toDateString();
                            const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                            const showDateSeperator = currentDate !== prevDate;
                            return (
                                <React.Fragment key={message._id || index}>
                                    {
                                        showDateSeperator && (
                                            <div className="flex justify-center my-2">
                                                <span className="bg-white/10 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                                                    {formatDateLabel(message.createdAt)}
                                                </span>
                                            </div>
                                        )
                                    }
                                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm break-words ${isOwnMessage
                                            ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-2xl rounded-br-md'
                                            : 'bg-white/10 text-white rounded-2xl rounded-bl-md'
                                            }`}>
                                            <p>{message.text}</p>
                                            <p className={`text-[10px] mt-1 ${isOwnMessage ? 'text-white/70 text-right' : 'text-gray-400 text-left'}`}>
                                                {time}
                                            </p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    /* Empty Messages Area */
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
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
            <div className="p-4 pb-[env(safe-area-inset-bottom)] border-t border-white/10 shrink-0">
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
                    {input && (
                        <button
                            type="button"
                            onClick={() => setInput('')}
                            className="text-white/50 hover:text-white transition cursor-pointer p-1 shrink-0"
                            title="Clear message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
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

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { toast } from 'react-toastify'
import Loader from '../../components/home/Loader'
import Sidebar from '../../components/home/Sidebar'
import ChatArea from '../../components/home/ChatArea'
import RequestsModal from '../../components/home/RequestsModal'
import AddContactModal from '../../components/home/AddContactModal'

const Home = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false)
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
    const [findUserQuery, setFindUserQuery] = useState('')
    const [requestTab, setRequestTab] = useState('incoming')
    const [incomingRequests, setIncomingRequests] = useState([])
    const [sentRequests, setSentRequests] = useState([])

    const userDetails = async () => {
        try {
            const res = await API.get("/user/details");
            if (res.data.success) {
                setUserData(res.data.userData);
            }
            else {
                navigate("/");
            }
        }
        catch (err) {
            navigate("/");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        }
    }

    const logout = async () => {
        try {
            const res = await API.post("/auth/logout");
            if (res.data.success) {
                toast.success(res.data.message || "Logged out successfully!");
                navigate("/");
            } else {
                toast.error(res.data.message || "Logout failed");
                navigate("/home");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
            navigate("/home");
        }
    }

    useEffect(() => {
        userDetails();
    }, []);

    const handleSendRequest = (username) => {
        toast.success(`Request sent to ${username}`);
        setFindUserQuery('');
        setIsAddContactModalOpen(false);
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="h-screen w-full flex bg-gradient-to-tr from-black via-indigo-950 to-fuchsia-950 text-white relative overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4 box-border">
            {/* Soft Ambient Backdrop */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-gradient-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
                <div className="absolute right-12 bottom-10 w-105 h-55 bg-gradient-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
            </div>

            {/* Left Sidebar Panel */}
            <Sidebar
                userData={userData}
                onLogout={logout}
                onOpenRequests={() => setIsRequestsModalOpen(true)}
                onOpenAddContact={() => setIsAddContactModalOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Main Chat Area */}
            <ChatArea />

            {/* Chat Requests Modal Card */}
            <RequestsModal
                isOpen={isRequestsModalOpen}
                onClose={() => setIsRequestsModalOpen(false)}
                requestTab={requestTab}
                setRequestTab={setRequestTab}
                incomingRequests={incomingRequests}
                sentRequests={sentRequests}
            />

            {/* Find Users / Add Contact Modal Card */}
            <AddContactModal
                isOpen={isAddContactModalOpen}
                onClose={() => setIsAddContactModalOpen(false)}
                findUserQuery={findUserQuery}
                setFindUserQuery={setFindUserQuery}
                onSendRequest={handleSendRequest}
                userData={userData}
            />
        </div>
    )
}

export default Home

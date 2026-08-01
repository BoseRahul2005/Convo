import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/home/Loader'
import Sidebar from '../../components/home/Sidebar'
import ChatArea from '../../components/home/ChatArea'
import RequestsModal from '../../components/home/RequestsModal'
import AddContactModal from '../../components/home/AddContactModal'
import logout from '../../utils/logOutFunc'
import fetchLoggedInUserDetails from '../../utils/loggedInUserDetails'
import fetchPendingRequests from '../../utils/pendingRequests'
import handleSendRequest from '../../utils/handleSendRequest'
import fetchContacts from '../../utils/fetchContacts'

const Home = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);//for the loading spinner
    const [userData, setUserData] = useState(null);//for the logged in user data
    const [searchQuery, setSearchQuery] = useState('');//for the search
    const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);//for the requests modal
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);//for the add contact modal
    const [findUserQuery, setFindUserQuery] = useState('');//for the find user query
    const [requestTab, setRequestTab] = useState('incoming');//for the request tab
    const [pendingRequests, setPendingRequests] = useState([]);
    const socketRef = useRef(null)//for the socket connection
    const [socket, setSocket] = useState(null);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on("chat_request_sent", () => {
            fetchPendingRequests(setPendingRequests);
        });
        socket.on("chat_request_deleted", () => {
            fetchPendingRequests(setPendingRequests);
        });

        socket.on("chat_request_rejected", () => {
            fetchPendingRequests(setPendingRequests);
        });

        socket.on("chat_request_accepted", () => {
            fetchPendingRequests(setPendingRequests);
            fetchContacts(setContacts);
        })

        return () => {
            socket.off("chat_request_sent");
            socket.off("chat_request_deleted");
            socket.off("chat_request_rejected");
        }
    }, [socket]);

    useEffect(() => {
        fetchLoggedInUserDetails(
            setUserData,
            setIsLoading,
            navigate,
            (sock) => {
                socketRef.current = sock;
                setSocket(sock);
            }
        );
        fetchPendingRequests(setPendingRequests);
        fetchContacts(setContacts);
    }, []);

    //everytime when the requests modal is opened, the fetchPendingRequests function will be called to fetch the pending requests
    useEffect(() => {
        if (isRequestsModalOpen) {
            fetchPendingRequests(setPendingRequests);
        }
    }, [isRequestsModalOpen])

    //checks if the loggesd in user is the request reciever
    const incomingRequests = pendingRequests.filter(req =>
        (req.receiver?._id || req.receiver) === userData?._id
    );

    //checks if the loggesd in user is the request sender
    const sentRequests = pendingRequests.filter(req =>
        (req.sender?._id || req.sender) === userData?._id
    );

    //Ater login when user enters the home page it will show a loader page, until isLoading is true, after 1.5 seconds it's value will become false and the home page will be visible
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
                contacts={contacts}
                onLogout={() => logout(navigate)}
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
                setPendingRequests={setPendingRequests}
            />

            {/* Find Users / Add Contact Modal Card */}
            <AddContactModal
                isOpen={isAddContactModalOpen}
                onClose={() => setIsAddContactModalOpen(false)}
                findUserQuery={findUserQuery}
                setFindUserQuery={setFindUserQuery}
                onSendRequest={(userId) => handleSendRequest(userId, setPendingRequests)}
                userData={userData}
                sentRequests={sentRequests}
                incomingRequests={incomingRequests}
                contacts={contacts}
            />
        </div>
    )
}

export default Home

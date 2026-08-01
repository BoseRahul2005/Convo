import API from "../api/axios";
import { toast } from "react-toastify";

const handleSendRequest = async (userId, setPendingRequests) => {
        try {
            const res = await API.post("/chat/send-request", { receiver: userId });
            console.log("Send Request API response:", res.data);
            if (res.data.success) {
                toast.success(res.data.message || "Request sent successfully");
                if (setPendingRequests && res.data.chatRequest) {
                    setPendingRequests(prev => [...prev, res.data.chatRequest]);
                }
            }
        } catch (err) {
            console.log("Send Request Error:", err);
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
        }
    }

export default handleSendRequest;
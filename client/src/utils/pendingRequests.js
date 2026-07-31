import API from "../api/axios";

const fetchPendingRequests = async (setPendingRequests) => {
    try {
        const res = await API.post("/chat/pending-request");
        if (res.data.success) {
            setPendingRequests(res.data.pendingRequests || []);
        }
    } catch (err) {
        console.log("Fetch pending requests error:", err);
    }
}

export default fetchPendingRequests;

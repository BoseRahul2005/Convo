import API from "../api/axios.js"

const fetchMessages = async (contactId, setMessages) => {
    try {
        const res = await API.get(`/msg/all-messages/${contactId}`);
        if (res.data && res.data.success) {
            setMessages(res.data.allMessages);
        }
    } catch (error) {
        console.error(error.response?.data?.message || error.message);
    }
}

export default fetchMessages;
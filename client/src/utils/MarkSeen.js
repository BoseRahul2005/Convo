import API from '../api/axios.js'

const markSeen = async (contactId) => {
    try {
        await API.put(`/msg/mark-seen/${contactId}`);
    }
    catch (error) {
        console.log(error);
    }
}

export default markSeen;
import API from "../api/axios"
import { toast } from 'react-toastify';

const logout = async (navigate) => {
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

export default logout;
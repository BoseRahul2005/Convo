import API from "../api/axios";
import connectSocket from "./connectSocket.js";

const fetchLoggedInUserDetails = async (setUserData, setIsLoading, navigate, setSocket) => {
  try {
    const res = await API.get("/user/details");
    if (res.data.success) {
      setUserData(res.data.userData);
      const socket= connectSocket(res.data.userData._id);
      setSocket(socket);
    } else {
      navigate("/");
    }
  } catch (err) {
    navigate("/");
  } finally {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }
};

export default fetchLoggedInUserDetails;
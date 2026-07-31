import API from "../api/axios";

const fetchLoggedInUserDetails = async (setUserData, setIsLoading, navigate) => {
  try {
    const res = await API.get("/user/details");
    if (res.data.success) {
      setUserData(res.data.userData);
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
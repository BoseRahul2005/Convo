import API from './axios'

export const findUsers = async (query) => {
    return await API.post("/user/find-user", { query });
};

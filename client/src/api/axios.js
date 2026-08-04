//axios- a library helps to get/post info from or to backend server
import axios from 'axios'

//creating a custom axios api, so that every time dont't have to write the whole base url(ex: axios.get(https://localh...))
const API = axios.create({ 
    baseURL: import.meta.env.VITE_API_URL,// the base url where the request goes everytime
    withCredentials:true //to submit the request to http with the cookie which will help the server to identify the logged in user
})

export default API
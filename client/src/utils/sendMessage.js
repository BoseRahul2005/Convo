import API from "../api/axios"


const sendMessage=async(receiverId,text)=>{
    try{
        const res= await API.post(`/msg/send-message/${receiverId}`, {text});
        return res.data;
    }
    catch(error){
        console.log(error)
    }
}

export default sendMessage
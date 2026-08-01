import API from "../api/axios.js";

const fetchContacts= async (setContacts)=>{
    try{
        const res= await API.get("chat/contacts");
        if(res.data.success){
            setContacts(res.data.contacts);
        }
    }
    catch(err){
        console.log(err);
    }
}

export default fetchContacts;
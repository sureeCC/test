import axios from "axios"

export const postData=(endPoint, data)=>{
    axios.post(endPoint,data).then(response=>{
        return response
    }).catch(e=>{
        console.log(e)
        return null
    })
}
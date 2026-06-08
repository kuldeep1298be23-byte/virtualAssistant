//*Jaise hi hum signup karege user ko h then token create hota h and us token ko hum cookies mae store karenge
import jwt from "jsonwebtoken";
const getToken=async (userId)=>{
    try{
        const token=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"10d"})
        return token;
    }
    catch(error){
         console.log(error);
    }
}
export default getToken;
//* sign function to create token
import getToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
//*Jaise hi hum signup karege user ko h then token create hota h and us token ko hum cookies mae store karenge

export const signUp=async(req,res)=>{
    try{
     const {name,email,password}=req.body

     const existEmail=await User.findOne({email})
     if(existEmail) return res.status(400).json({message:"email already exist !"})
     
     if(password.length<6){
        return  res.status(400).json({message:"password must be at least 6 characters !"})
     }
     const hashedPassword=await bcrypt.hash(password,10)//* 10 is salt here,A salt is a random value added to a password before hashing.

     const user=await User.create({
        name,password:hashedPassword,email
     })
     
     const token=await getToken(user._id)//* here we generate token

     res.cookie("token",token,{ //* yaha JWT token cookie me store ho raha hai
         httpOnly:true,
         maxAge:7*24*60*60*1000,
         sameSite:"None",
         secure:true
     })
     return res.status(201).json(user)
    }catch(error){
           return res.status(500).json({message:`sign up error ${error}`})
    }
}

export const Login=async(req,res)=>{
    try{
     const {email,password}=req.body

     const user=await User.findOne({email})
     if(!user) return res.status(400).json({message:"email doesn't exist !"})//* email kae liye user exist karta h ya nhi
     
    const isMatch =await bcrypt.compare(password,user.password) //* jo signup karte time password store kiya tha use match karna h.

    if(!isMatch){
        return res.status(400).json({message:"incorrect password"})
    }

     const token=await getToken(user._id)//* here we generate token

     res.cookie("token",token,{
         httpOnly:true,
         maxAge:7*24*60*60*1000,
         sameSite:"None",
         secure:true
     })
     
     return res.status(200).json(user)
    }catch(error){
           return res.status(500).json({message:`Login error ${error}`})
    }
}

export const LogOut=async (req,res)=>{ //* jaise hi logout karenge then hame token cookie remove karni h.
    try{
           res.clearCookie("token")
           return res.status(200).json({message:"Log Out succesfully"})
    }
    catch(error){
            return res.status(500).json({message:`LogOut error ${error}`})
    }
}

//* yaha saare controllers  bana diye h and inke routes banane h.   
//* Controller = function jisme tum logic likhte ho 
//* Ye khud se kabhi execute nahi hota
//* controller bina route ke kabhi run hi nahi hoga 

//* Route ek gate / entry point hai
//* Controller actual logic handle karta hai

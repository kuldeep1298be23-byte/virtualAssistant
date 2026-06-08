//* here we creating a middleware for authentication, here we getting the current user details.
//* here we getting token from cookie, then find userid from that token, by using jwt secret verify the token
//* and identify the id of the user that create the token.

import jwt from "jsonwebtoken";

const isAuth= async(req,res,next)=>{
   try{
      const token=req.cookies.token;
      if(!token) return res.status(400).json({message:" token not found "});
      const verifyToken=await jwt.verify(token,process.env.JWT_SECRET) //*yaha sae hame userid key nikalni h verifytoken sae.
      req.userId=verifyToken.userId;
      next();
   }
   catch(error){
          console.log(error)
          return  res.status(500).json({message:"is Auth error"});
   }
}

export default isAuth;
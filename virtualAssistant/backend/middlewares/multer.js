//* multor middleware --> jaise hi image hum frontend sae bejenge usse public folder mae dal dega
 import multer from "multer";
 
 const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,"./public")
    },
    filename:(req,file,cb)=>{
     cb(null,file.originalname)
    }
 })

 const upload=multer({storage});
 export default upload;
import multer from "multer"
const storage =multer.diskStorage({ // cb is callback
    destination:(req,file,cb)=>{
       cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
export const upload=multer({storage})
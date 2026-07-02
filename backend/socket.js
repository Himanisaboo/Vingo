//http se server bnaiyenge
//jitne be user honge unke hr ki alg socket id hogi aur socket io unko unhin se pehenga
// ek function bnayenge jo bhi user login hoga uski socket id ko store karega
//socket means user jaise hi user connect hoga to uska socket id store hoga aur jaise hi user disconnect hoga to uska socket id delete hoga
import User from "./models/user.models.js"
export const socketHandler=(io)=>{
   io.on('connection',(socket)=>{
    socket.on('identity',async({userId})=>{
      try{
const user=await User.findByIdAndUpdate(userId,{
    socketId:socket.id,
    isOnline:true
},{new:true})

      }
      catch(error){
console.log(error)
      }
    })
    socket.on('disconnect',async()=>{
        try{
            await User.findOneAndUpdate({socketId:socket.id},{
            socketId:null,
            isOnline:false
        })
        }
        catch(error){
            console.log(error)
        }
    })
})
}
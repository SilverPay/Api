const User=require('../model/User')


const handleLogout=async (req,res)=>{
    //On Client, also delete Access Token


    const cookies=req.cookies
    if(!cookies?.jwt)return res.sendStatus(204)//No Content, though successful   
    const refreshToken=cookies.jwt

  // is refreshToken in DB?
    const foundUser=await User.findOne({refreshToken}).exec()

    if(!foundUser) {
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true}  )
        return res.sendStatus(204)//No Content, but successfull
    }
//Delete the refreshToken in the DB
foundUser.refreshToken=''
const result=await foundUser.save()
console.log(result)

//in production, add secure:true - only serves on https
res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
res.sendStatus(204)

}

module.exports={handleLogout}
const mongoose=require('mongoose')

const url=process.env.DATABASE_URI

const connectDB=async ()=>{
    try {
        // await mongoose.connect(process.env.DATABASE_URI,{
        await mongoose.connect('mongodb+srv://mongotut:testing123@cluster0.rkljslh.mongodb.net/CompanyDB?retryWrites=true&w=majority',{
            useUnifiedTopology:true,
            useNewUrlParser: true
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports=connectDB
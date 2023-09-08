require('dotenv').config()
const express=require('express')
const app=express()
const path=require('path')
const cors=require('cors')
const corsOptions=require('./config/corsOptions')
const {logEvents, loger}=require('./middleware/logger')
const errorHandler=require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser=require('cookie-parser')
const credentials=require('./middleware/credentials')
const mongoose=require('mongoose')
const connectDB=require('./config/dbConn')
const PORT=process.env.PORT||3500

//connect to Mongo DB
connectDB()

//custom middleware logger
app.use(loger)

//Handle Options Credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials)

//cross origin resourse (cors) sharing
app.use(cors(corsOptions))

//built-in middleware to handle url encoded data
app.use(express.urlencoded({extended: false}))

//built in middleware for Json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//serve static files(like css, images etc)
app.use('/',express.static(path.join(__dirname,'/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
//Secure the employee routes with a token. Anything above this is not secured
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))


app.all('*',(req,res)=>{
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname,'views','404.html'))
    }
    else if (req.accepts('json')) {
        res.json({error:'404 Not Found'})
    }else{
       res.type('txt').send('404 Not Found') 
    }
    
})

app.use(errorHandler)

mongoose.connection.once('open',()=>{
    console.log('Connected to Mongo DB')    
    app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`))
})
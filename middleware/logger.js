const {format}=require('date-fns')
const { EventEmitter } = require('stream')
const {v4: uuid}=require('uuid')

const fs=require('fs')
const fsPromises=require('fs').promises
const path=require('path')


const logEvents=async(message,logName)=>{
  
    const dateTime=`${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem=`${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem)

    try {
        if(!fs.existsSync(path.join(__dirname,'..','logs')))
        {
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logName),logItem)
    } catch (error) {
       console.log(error) 
    }
}

const loger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports={logEvents, loger}












//     console.log(__filename)
//     console.log(__dirname)

// var url='http://myLogger.io/log'
// function log(message){
//     //send an HTTP request
//     console.log(message)
// }

// module.exports.log=log 
// //module.exports.endPoint=url

const httpStatus = require('http-status')
const {Error} = require('../util/api_response')

/**
 * Error handler
 */
const handler = (err,req,res,next)=>{
    const env = process.env.NODE_ENV
    console.log(err.message)
    const response = {
        code: err.status,
        errors: err.errors,
        message: err.message || httpStatus[err.status],
        stack: err.stack
    }
    if(env !== 'development'){
        delete response.stack
    }
    if(err.status){
        res.status(err.status)
    }
    else{
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
    }
    res.json(response)
}
exports.handler  = handler

/**
 * Catch a 404 error
 */
exports.notFound = (req,res,next)=>{
    const err = new Error({
        message: 'Not Found',
        status: httpStatus.NOT_FOUND
    })
    return handler(err,req,res)
}
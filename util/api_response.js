const httpStatus = require('http-status')
/**
 * @extends Error
 */
class ExtendableError extends Error{
    constructor({
        message,errors,status,isPublic,stack
    }){
        super(message)
        this.name = this.constructor.name
        this.errors = errors,
        this.status = status
        this.isPublic = isPublic
        this.isOperational = true
        this.stack = stack
        this.message = message

    }
}
/**
 * @extend ExtendableError
 */
class ApiError extends ExtendableError{
    constructor({
        message, errors, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false, stack,
    }){
        super({
            message,
            errors,
            status,
            isPublic,
            stack
        })
    }
}
module.exports = {
    Error: ApiError
}
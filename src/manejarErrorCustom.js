class CustomError extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ServerError extends Error{
    constructor(status, message){
        super(message)
        this.status = status    
    }
}

export {CustomError, ServerError}
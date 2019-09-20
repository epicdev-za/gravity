const uuidV4 = require("uuid/v4");

class GravityException extends Error{

    constructor(status, code, object) {
        super();
        if(typeof status === typeof Error){
            this.status = 500;
            this.description = "An internal server error occurred. Engineers have been notified, please try again later.";
            this.code = this.log(object);
        }else{
            this.status = status;
            this.description = object;
            this.code = code;
        }
    }

    log(err){
        //@todo: Add error logging and notifying
        console.log(err);
        let currentStack = new Error();
        console.log(currentStack.stack);
        return uuidV4();
    }

}

module.exports = GravityException;
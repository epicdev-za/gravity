module.exports = function(req, res, next){
    const body = req.body;

    if(body['grant_type'] !== undefined){
        switch(body['grant_type']){
            case "password":
                grant_type.password(req, res, next);
                break;
            default:
                res.status(400);
                res.send({
                    error: "unsupported_grant_type",
                    error_description: "'" + body['grant_type'] + "' is not supported."
                });
                next();
                break;
        }
    }else{
        res.status(400);
        res.send({
            error: "invalid_request",
            error_description: "Request was missing the 'grant_type' parameter."
        });
        next();
    }
};

function isset(object, key, res, next){
    if(object[key] !== undefined){
        return true;
    }
    res.status(400);
    res.send({
        error: "invalid_request",
        error_description: "Request was missing the '" + key + "' parameter."
    });
    next();
    return false;
}

const grant_type = {
    password(req, res, next){
        const body = req.body;

        if(isset(body, 'username', res, next) && isset(body, 'password', res, next) && isset(body, 'client_id', res, next) && isset(body, 'client_secret', res, next)){

            const username = body['username'];
            const password = body['password'];
            const client_id = body['client_id'];
            const client_secret = body['client_secret'];

            //@todo: Insert DB Query, User Entity, JWT, etc.
            if(client_id === "test" && client_secret === "test"){
                if(username === "test" && password === "test"){
                    res.send({
                        access_token: "test",
                        token_type: "bearer",
                        expires_in: 3600,
                        refresh_token: "test"
                    });
                    next();
                }else{
                    res.status(401);
                    res.send({
                        error: "invalid_grant",
                        error_description: "Invalid username and password combination"
                    });
                    next();
                }
            }else{
                res.status(401);
                res.send({
                    error: "invalid_client",
                    error_description: "Invalid client id and secret combination"
                });
                next();
            }

        }
    }
};
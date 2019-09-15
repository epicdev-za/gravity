const Gravity = require("../../index");
const Plasma = require("plasma");
const sanitizer = require("../../utils/sanitizer");
const Application = require("../../entities/Application");
const clients = require("restify-clients");

module.exports = function(req, res, next){
    if(req.body === undefined) req.body = {};
    const body = req.body;

    if(body['grant_type'] !== undefined){
        switch(body['grant_type']){
            case "client_credentials":
                grant_type.client_credentials(req, res, next);
                break;
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
    client_credentials(req, res, next){
        const body = req.body;

        if(isset(body, 'client_id', res, next) && isset(body, 'client_secret', res, next)){

            const client_id = sanitizer.cleanPermalink(body['client_id']);
            const client_secret = sanitizer.cleanAlphaNumeric(body['client_secret']);

            Plasma.getConnection.fetch(Application, "SELECT * FROM " + Application.getEntity() + " WHERE client_id = $1 AND client_secret = $2", [client_id, client_secret], (err, r) => {
                if (err){
                    res.status(500);
                    res.send({
                        error: Gravity.logError(err),
                        error_description: "An internal server error occurred. Engineers have been notified, please try again later."
                    });
                    next();
                }else{
                    if(r.length === 1){
                        let application = r[0];
                        application.authenticate(req.connection.remoteAddress, undefined, req.headers['user-agent'], (err, token) => {
                            if(err){
                                res.status(500);
                                res.send({
                                    error: Gravity.logError(err),
                                    error_description: "An internal server error occurred. Engineers have been notified, please try again later."
                                });
                                next();
                            }else{
                                res.send(token);
                                next();
                            }
                        });
                    }else{
                        res.status(401);
                        res.send({
                            error: "invalid_client",
                            error_description: "Invalid client id and secret combination"
                        });
                        next();
                    }
                }
            });

        }
    },
    password(req, res, next){
        const body = req.body;

        if(isset(body, 'username', res, next) && isset(body, 'password', res, next) && isset(body, 'client_id', res, next) && isset(body, 'client_secret', res, next)){

            const username = body['username'];
            const password = body['password'];
            const client_id = body['client_id'];
            const client_secret = body['client_secret'];

            Plasma.getConnection.fetch(Application, "SELECT * FROM " + Application.getEntity() + " WHERE client_id = $1 AND client_secret = $2", [client_id, client_secret], (err, r) => {
                if (err){
                    res.status(500);
                    res.send({
                        error: Gravity.logError(err),
                        error_description: "An internal server error occurred. Engineers have been notified, please try again later."
                    });
                    next();
                }else{
                    if(r.length === 1){
                        let application = r[0];

                        try{
                            const config = require("../../gravity.config");
                            let project_key = sanitizer.cleanUUID(config.sanctum.project_key);
                            let location = config.sanctum.location;

                            let client = clients.createJsonClient({
                                url: location
                            });

                            client.post('/sanctum/auth', {
                                project: project_key,
                                username: username,
                                password: password
                            }, function(err, creq, cres, obj){
                                if(err){
                                    if(cres.statusCode === 500){
                                        res.status(500);
                                        res.send({
                                            error: Gravity.logError(err),
                                            error_description: "An internal server error occurred. Engineers have been notified, please try again later."
                                        });
                                        next();
                                    }else{
                                        res.status(cres.statusCode);
                                        res.send(err.body);
                                        next();
                                    }
                                }else{
                                    application.authenticate(req.connection.remoteAddress, obj, req.headers['user-agent'], (err, token) => {
                                        if(err){
                                            res.status(500);
                                            res.send({
                                                error: Gravity.logError(err),
                                                error_description: "An internal server error occurred. Engineers have been notified, please try again later."
                                            });
                                            next();
                                        }else{
                                            res.send(token);
                                            next();
                                        }
                                    });
                                }
                            });
                        }catch (err) {
                            res.status(500);
                            res.send({
                                error: Gravity.logError(err),
                                error_description: "An internal server error occurred. Engineers have been notified, please try again later."
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
            });

        }
    }
};
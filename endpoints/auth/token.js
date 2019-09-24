const Plasma = require("plasma");
const sanitizer = require("../../utils/sanitizer");
const Application = require("../../entities/Application");
const clients = require("restify-clients");
const GravityException = require("../../GravityException");

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
                next(new GravityException(400, "unsupported_grant_type", "'" + body['grant_type'] + "' is not supported."));
        }
    }else{
        next(new GravityException(400, "invalid_request", "Request was missing the 'grant_type' parameter."));
    }
};

function extract(object, key){
    if(object[key] !== undefined){
        return object[key];
    }
    throw new GravityException(400, "invalid_request", "Request was missing the '" + key + "' parameter.");
}

const grant_type = {

    client_credentials(req, res, next){
        const body = req.body;

        let client_id, client_secret;
        try{
            client_id = sanitizer.cleanPermalink(extract(body, 'client_id'));
            client_secret = sanitizer.cleanAlphaNumeric(extract(body, 'client_secret'));
        }catch (e) {
            next(e);
            return;
        }

        Plasma.getConnection.fetch(Application, "SELECT * FROM " + Application.getEntity() + " WHERE client_id = $1 AND client_secret = $2", [client_id, client_secret], function(err, r) {
            if (err){
                next(new GravityException(err));
            }else{
                if(r.length === 1){
                    let application = r[0];
                    application.authenticate(req.connection.remoteAddress, undefined, req.headers['user-agent'], (err, token) => {
                        if(err){
                            next(err);
                        }else{
                            res.send(token);
                            next();
                        }
                    });
                }else{
                    next(new GravityException(401, "invalid_client", "Invalid client id and secret combination."));
                }
            }
        });

    },

    password(req, res, next){
        const body = req.body;

        let username, password, client_id, client_secret;
        try{
            username = extract(body, 'username');
            password = extract(body, 'password');
            client_id = extract(body, 'client_id');
            client_secret = extract(body, 'client_secret');
        }catch (e) {
            next(e);
            return;
        }

        Plasma.getConnection.fetch(Application, "SELECT * FROM " + Application.getEntity() + " WHERE client_id = $1 AND client_secret = $2", [client_id, client_secret], (err, r) => {
            if (err){
                next(new GravityException(err));
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
                                if(typeof cres === typeof undefined || cres === null){
                                    next(err);
                                }else{
                                    next(new GravityException(cres.statusCode, err.body.error, err.body.error_description));
                                }
                            }else{
                                application.authenticate(req.connection.remoteAddress, obj, req.headers['user-agent'], (err, token) => {
                                    if(err){
                                        next(err);
                                    }else{
                                        res.send(token);
                                        next();
                                    }
                                });
                            }
                        });
                    }catch (err) {
                        next(err);
                    }
                }else{
                    next(new GravityException(401, "invalid_client", "Invalid client id and secret combination"));
                }
            }
        });

    }
};
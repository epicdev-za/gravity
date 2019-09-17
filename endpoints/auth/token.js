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
                throw new GravityException(400, "unsupported_grant_type", "'" + body['grant_type'] + "' is not supported.");
        }
    }else{
        throw new GravityException(400, "invalid_request", "Request was missing the 'grant_type' parameter.");
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

        const client_id = sanitizer.cleanPermalink(extract(body, 'client_id'));
        const client_secret = sanitizer.cleanAlphaNumeric(extract(body, 'client_secret'));

        Plasma.getConnection.fetch(Application, "SELECT * FROM " + Application.getEntity() + " WHERE client_id = $1 AND client_secret = $2", [client_id, client_secret], function(err, r) {
            if (err){
                throw new GravityException(err);
            }else{
                if(r.length === 1){
                    let application = r[0];
                    application.authenticate(req.connection.remoteAddress, undefined, req.headers['user-agent'], (err, token) => {
                        if(err){
                            throw new GravityException(err);
                        }else{
                            res.send(token);
                            next();
                        }
                    });
                }else{
                    throw new GravityException(401, "invalid_client", "Invalid client id and secret combination.");
                }
            }
        });

    },

    password(req, res, next){
        const body = req.body;

        const username = extract(body, 'username');
        const password = extract(body, 'password');
        const client_id = extract(body, 'client_id');
        const client_secret = extract(body, 'client_secret');

        Plasma.getConnection.fetch(Application, "SELECT * FROM " + Application.getEntity() + " WHERE client_id = $1 AND client_secret = $2", [client_id, client_secret], (err, r) => {
            if (err){
                throw new GravityException(err);
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
                                    throw new GravityException(new Error(err));
                                }else{
                                    throw new GravityException(cres.statusCode, err.body.error, err.body.error_description);
                                }
                            }else{
                                application.authenticate(req.connection.remoteAddress, obj, req.headers['user-agent'], (err, token) => {
                                    if(err){
                                        throw new GravityException(err);
                                    }else{
                                        res.send(token);
                                        next();
                                    }
                                });
                            }
                        });
                    }catch (err) {
                        throw new GravityException(err);
                    }
                }else{
                    throw new GravityException(401, "invalid_client", "Invalid client id and secret combination");
                }
            }
        });

    }
};
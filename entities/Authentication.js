const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../utils/sanitizer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class Authentication extends Entity{

    constructor(){
        super();
        this.application_uuid = null;
        this.user_uuid = null;
        this.user_agent = null;
        this.ip_address = null;
    }

    static getEntity(){
        return "gravity.authentication";
    }

    clean() {
        super.clean();
        this.application_uuid = sanitizer.cleanUUID(this.application_uuid, true);
        this.user_uuid = sanitizer.cleanUUID(this.user_uuid, true);
        this.user_agent = sanitizer.cleanSymbols(this.user_agent);
        this.ip_address = sanitizer.cleanSymbols(this.ip_address);
    }

    static authenticate(ip, application, user, user_agent, callback){
        const config = require("../gravity.config");

        let authentication = new Authentication().initialise();
        if(user !== undefined){
            authentication.user_uuid = user.uuid;
        }
        if(application !== undefined) {
            authentication.application_uuid = application.uuid;
        }
        authentication.ip_address = ip;
        authentication.user_agent = user_agent;
        authentication.save((err, res) => {
            if(err) {
                callback(err);
            }else{
                let access_token = {
                    auth: authentication.uuid
                };
                if(user !== undefined){
                    access_token.user = user
                }

                access_token = jwt.sign(access_token, config.jwt.secret, {
                    expiresIn: config.jwt.ttl + 's'
                });
                let refresh_token = jwt.sign({
                    access_token: crypto.createHash('sha256').update(access_token).digest('hex')
                }, config.jwt.secret);

                callback(false, {
                    access_token: access_token,
                    token_type: "bearer",
                    expires_in: config.jwt.ttl,
                    refresh_token: refresh_token
                });
            }
        });
    }

    static refresh(access_token, refresh_token, callback){
        const config = require("../gravity.config");

        try{
            let access_object = jwt.decode(access_token, config.jwt.secret); //@todo: Add token expiry verification

            let refresh_hash = jwt.verify(refresh_token, config.jwt.secret).access_token;
            let expected_hash = crypto.createHash('sha256').update(access_token).digest('hex');

            if(refresh_hash === expected_hash){
                access_token = jwt.sign(access_object, config.jwt.secret, {
                    expiresIn: config.jwt.ttl + 's'
                });
                refresh_token = jwt.sign({
                    access_token: crypto.createHash('sha256').update(access_token).digest('hex')
                });

                callback(false, {
                    access_token: access_token,
                    token_type: 'bearer',
                    expires_in: config.jwt.ttl,
                    refresh_token: refresh_token
                });
            }else{
                callback(new Error("Invalid access and refresh token pair"));
            }
        }catch (e) {
            callback(e);
        }
    }

}

module.exports = Authentication;
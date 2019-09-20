const Entity = require("plasma/PlasmaEntity");
const Authentication = require("./Authentication");
const sanitizer = require("../utils/sanitizer");
const jwt = require("jsonwebtoken");

class Application extends Entity{

    constructor(){
        super();
        this.client_id = null;
        this.client_secret = null;
    }

    static getEntity(){
        return "gravity.applications";
    }

    clean() {
        super.clean();
        this.client_id = sanitizer.cleanPermalink(this.client_id);
        this.client_secret = sanitizer.cleanAlphaNumeric(this.client_secret);
    }

    authenticate(ip, user, user_agent, callback){
        const config = require("../gravity.config");

        let authentication = new Authentication().initialise();
        if(user !== undefined){
            authentication.user_uuid = user.uuid;
        }
        authentication.application_uuid = this.uuid;
        authentication.ip_address = ip;
        authentication.user_agent = user_agent;
        authentication.save((err, res) => {
            if(err) callback(err);

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
                access_token: access_token
            }, config.jwt.secret);

            callback(false, {
                access_token: access_token,
                token_type: "bearer",
                expires_in: config.jwt.ttl,
                refresh_token: refresh_token
            });
        });
    }

}

module.exports = Application;
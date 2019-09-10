const Entity = require("plasma/PlasmaEntity");
const Authentication = require("./Authentication");

class Application extends Entity{

    constructor(){
        super();
        this._client_id = null;
        this._client_secret = null;
    }

    static getEntity(){
        return "gravity.applications";
    }

    authenticate(ip, user, user_agent, callback){
        let authentication = new Authentication().initialise();
        authentication.application_uuid = this.uuid;
        authentication.ip_address = ip;
        authentication.user_agent = user_agent;
        authentication.save((err, res) => {
            if(err) callback(err);
            console.log(res);
        });
    }

    get client_id() {
        return this._client_id;
    }

    set client_id(value) {
        this._client_id = value;
    }

    get client_secret() {
        return this._client_secret;
    }

    set client_secret(value) {
        this._client_secret = value;
    }
}

module.exports = Application;
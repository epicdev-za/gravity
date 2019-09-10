const Entity = require("plasma/PlasmaEntity");

class Authentication extends Entity{

    constructor(){
        super();
        this._application_uuid = null;
        this._user_uuid = null;
        this._user_agent = null;
        this._ip_address = null;
    }

    static getEntity(){
        return "gravity.authentication";
    }

    get application_uuid() {
        return this._application_uuid;
    }

    set application_uuid(value) {
        this._application_uuid = value;
    }

    get user_uuid() {
        return this._user_uuid;
    }

    set user_uuid(value) {
        this._user_uuid = value;
    }

    get user_agent() {
        return this._user_agent;
    }

    set user_agent(value) {
        this._user_agent = value;
    }

    get ip_address() {
        return this._ip_address;
    }

    set ip_address(value) {
        this._ip_address = value;
    }
}

module.exports = Authentication;
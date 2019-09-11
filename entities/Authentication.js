const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../utils/sanitizer");

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
        this.application_uuid = sanitizer.cleanUUID(this.application_uuid);
        this.user_uuid = sanitizer.cleanUUID(this.user_uuid, true);
        this.user_agent = sanitizer.cleanSymbols(this.user_agent);
        this.ip_address = sanitizer.cleanSymbols(this.ip_address);
    }

}

module.exports = Authentication;
const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../utils/sanitizer");

class UserRole extends Entity{

    constructor(){
        super();
        this.user_uuid = null;
        this.role_uuid = null;
    }

    static getEntity(){
        return "gravity.user_role";
    }

    clean() {
        super.clean();
        this.user_uuid = sanitizer.cleanUUID(this.user_uuid);
        this.role_uuid = sanitizer.cleanUUID(this.role_uuid);
    }

}

module.exports = UserRole;
const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../utils/sanitizer");

class Permission extends Entity{

    constructor(){
        super();
        this.ref_uuid = null;
        this.key = null;
        this.value = null;
    }

    static getEntity(){
        return "gravity.permission";
    }

    clean() {
        super.clean();
        this.ref_uuid = sanitizer.cleanUUID(this.ref_uuid);
        this.key = sanitizer.cleanSymbols(this.key);
        this.value = sanitizer.cleanBoolean(this.value);
    }

}

module.exports = Permission;
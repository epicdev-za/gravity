const Entity = require("plasma/PlasmaEntity");
const sanitizer = require("../utils/sanitizer");

class Role extends Entity{

    constructor(){
        super();
        this.name = null;
    }

    static getEntity(){
        return "gravity.role";
    }

    clean() {
        super.clean();
        this.name = sanitizer.cleanSymbols(this.name);
    }

}

module.exports = Role;
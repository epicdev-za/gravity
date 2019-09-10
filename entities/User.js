const Entity = require("plasma/PlasmaEntity");

class User extends Entity{

    constructor(){
        super();
        this._username = null;
        this._password = null;
    }

    static getEntity(){
        return "gravity.users";
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }
}

module.exports = User;
const array_marriage = require("array-marriage");
const _project = require("../../gravity.config");

let config = {
    server_name: 'Gravity Server',
    port: 3001,
    db: {
        database: 'gravity',
        host: 'localhost',
        user: 'postgres',
        password: '',
        port: 5432
    },
    endpoints: {

    }
};

module.exports = array_marriage(config, _project);
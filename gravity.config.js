const gravity = require("./index");
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
    jwt: {
        ttl: 900,
        secret: ''
    },
    sanctum: {
        location: 'http://localhost:3002',
        project_key: ''
    },
    endpoints: {
        'auth': {
            children: {
                'token': {
                    method: "post",
                    handler: require("./endpoints/auth/token")
                }
            }
        }
    }
};

module.exports = gravity.mergeConfigs(config, _project);
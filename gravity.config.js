const _project = require("../gravity.config");

let config = {
    server_name: 'Gravity Server',
    port: 3001,
    db: {
        database: 'gravity',
        host: 'localhost',
        username: 'postgres',
        password: '',
        port: 5432
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

for(let key in _project){
    if(_project.hasOwnProperty(key)){
        config[key] = _project[key];
    }
}

//@todo: Add ability to merge endpoints to include instead of overwriting

module.exports = config;
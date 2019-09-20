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

function merge(base, income){
    for(let key in income){
        if(income.hasOwnProperty(key)){
            if(base.hasOwnProperty(key)){
                if(Array.isArray(base[key])){
                    base[key] = base[key].concat(income[key]);
                }else if(typeof(base[key]) === typeof({})){
                    base[key] = merge(base[key], income[key]);
                }else{
                    base[key] = income[key];
                }
            }else{
                base[key] = income[key];
            }
        }
    }
    return base;
}

module.exports = merge(config, _project);
let restify = require("restify");
const config = require("./gravity.config");
const Plasma = require("plasma");
const uuidV4 = require("uuid/v4");

let server = null;

module.exports.start = function(callback){
    if(server === null){
        initializeDB();
        initializeServer(callback);
    }else{
        throw new Error("Server already initialized");
    }
};

module.exports.stop = function(callback){
    if(server !== null){
        server.close(() => {
            server = null;
            if(callback !== undefined) {
                callback();
            }
        });
    }else{
        throw new Error("Server not initialized");
    }
};

module.exports.logError = function(err){
    //@todo: Add error logging and notifying
    console.log(err);
    let currentStack = new Error();
    console.log(currentStack.stack);
    return uuidV4();
};

function initializeDB(){
    let database = new Plasma();
    database.connect(config.db);
}

function initializeServer(callback){
    server = restify.createServer({
        name: 'Gravity Server',
        version: process.env.npm_package_version
    });

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    server.listen(config.port, () => {
        if(callback !== undefined){
            callback(server.name, server.url);
        }
    });

    loadEndpoint(config.endpoints);
}

function loadEndpoint(endpoints, parentPath = []){
    for(let path in endpoints){
        if(endpoints.hasOwnProperty(path)){
            let endpoint = endpoints[path];
            let fullPath = "";
            for(let i = 0; i < parentPath.length; i++){
                fullPath += "/" + parentPath[i];
            }
            fullPath += "/" + path;

            if(endpoint.handler !== undefined && typeof endpoint.handler !== typeof Function){
                throw new Error("Endpoint configuration '" + fullPath + "' has invalid handler type");
            }

            if(typeof endpoint.method === typeof '' && endpoint.handler !== undefined){
                server[endpoint.method](fullPath, endpoint.handler);
            }

            if(endpoint.children !== undefined){
                let childPaths = parentPath;
                childPaths.push(path);
                loadEndpoint(endpoint.children, childPaths);
            }
        }else{
            throw new Error("Endpoints configuration object somehow missing key '" + path.toString() + "' when its known to be in itself");
        }
    }
}
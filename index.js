let restify = require("restify");

let server = null;

module.exports.start = function(callback, port = 3001){
    if(server === null){
        initializeServer(callback, port);
    }else{
        throw new Error("Server already initialized");
    }
};

module.exports.stop = function(callback){
    if(server !== null){
        server.close(callback);
    }else{
        throw new Error("Server not initialized");
    }
};

function initializeServer(callback, port){
    server = restify.createServer({
        name: 'Gravity Server',
        version: process.env.npm_package_version
    });

    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    server.listen(port, () => {
        if(typeof callback !== undefined){
            callback(server.name, server.url);
        }
    });

    server.get('/hello', require("./endpoints/auth/token"));
}
const assert = require("assert");
const clients = require("restify-clients");
const Gravity = require("../index");

let client = clients.createJsonClient({
    url: 'http://localhost:3001',
    version: process.env.npm_package_version
});

describe('Gravity', function(){
    describe('Setup', function(){
        it('should setup the gravity server', function(done){
            Gravity.start((name, url) => {
                assert.strictEqual(name, "Gravity Server");
                assert.strictEqual(url, "http://[::]:3001");
                done();
            });
        });
    });

    describe('Endpoints', function(){
        it('should return success', function(done){
            client.get('/hello', (err, req, res, obj) => {
                assert.ifError(err);
                console.log("Server returned: %j", obj);
                done();
            });
        });
    });

    describe('Stop', function(){
        it('should stop the gravity server', function(done){
            Gravity.stop(() => {
                done();
            });
        });
    });
});
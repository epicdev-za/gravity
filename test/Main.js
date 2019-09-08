const assert = require("assert");
const Gravity = require("../index");

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

    describe('Stop', function(){
        it('should stop the gravity server', function(done){
            Gravity.stop(() => {
                done();
            });
        });
    });
});
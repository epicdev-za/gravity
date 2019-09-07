const assert = require("assert");
const sanitizer = require("../../utils/sanitizer");

describe("SanitizerTest", function(){

    describe("Clean Boolean", function(){
        it("should convert binary to primitive boolean data types", function(){
            assert.strictEqual(sanitizer.cleanBoolean(true), true);
            assert.strictEqual(sanitizer.cleanBoolean(false), false);
            assert.strictEqual(sanitizer.cleanBoolean(1), true);
            assert.strictEqual(sanitizer.cleanBoolean(0), false);
            assert.throws(() => {
                sanitizer.cleanBoolean("error")
            }, Error, "Invalid data property");
        });
    });

    describe("Clean Numerical", function(){
        it("should strip out non numerical characters", function(){

        });
    });

});
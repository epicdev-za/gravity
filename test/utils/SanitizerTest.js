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
        it("should strip out non-numerical characters", function(){
            assert.strictEqual(sanitizer.cleanNumeric(2), 2);
            assert.strictEqual(sanitizer.cleanNumeric("2"), 2);
            assert.strictEqual(sanitizer.cleanNumeric(-2), -2);
            assert.strictEqual(sanitizer.cleanNumeric("-2"), -2);
            assert.strictEqual(sanitizer.cleanNumeric("-2-2"), -22);
            assert.strictEqual(sanitizer.cleanNumeric("45-78987asd446"), 4578987446);
            assert.strictEqual(sanitizer.cleanNumeric("-45-78#&$*^%&*#$98-7asd-446"), -4578987446);
        });
    });

    describe("Clean Alpha", function(){
        it("should strip out any non-alpha characters", function(){
            assert.strictEqual(sanitizer.cleanAlpha("abcdefghijklmnopqrstuvwxyz"), "abcdefghijklmnopqrstuvwxyz");
            assert.strictEqual(sanitizer.cleanAlpha("ab$c^d@#ef^g456hijklmno*#pq#&*(rstuv+__\":<?}wxyz"), "abcdefghijklmnopqrstuvwxyz");
            assert.strictEqual(sanitizer.cleanAlpha(2), "");
        });
    });

    describe("Clean Alpha Numeric", function(){
        it("should strip out any non-alpha characters", function(){
            assert.strictEqual(sanitizer.cleanAlphaNumeric("abcdefghijklmnopqrstuvwxyz0123456789"), "abcdefghijklmnopqrstuvwxyz0123456789");
            assert.strictEqual(sanitizer.cleanAlphaNumeric("ab$c^d@#ef^g456hijklmno*#pq#&*(rstuv+__\":<?}wxyz0123456^$789"), "abcdefg456hijklmnopqrstuvwxyz0123456789");
            assert.strictEqual(sanitizer.cleanAlphaNumeric(2), "2");
        });
    });

    describe("Clean Symbols", function(){
        it("should strip out any extra symbolic characters", function(){
            assert.strictEqual(sanitizer.cleanSymbols("[^a-zA-Z0-9 \\/{}[]:._~\\-!@#\\$%\\^&\\*áàâãªäÁÀÂÃÄÍÌÎÏíìîïéèêëÉÈÊËóòôõºöÓÒÔÕÖúùûüÚÙÛÜçÇñÑ]+"), "^a-zA-Z0-9 /:._~-!@#$%^&*");
        });
    });

    describe("Clean Extra Symbols", function(){
        it("should strip out any uncommon special characters", function(){
            assert.strictEqual(sanitizer.cleanExtraSymbols("[^a-zA-Z0-9 \\/{}[]:._~\\-!@#\\$%\\^&\\*áàâãªäÁÀÂÃÄÍÌÎÏíìîïéèêëÉÈÊËóòôõºöÓÒÔÕÖúùûüÚÙÛÜçÇñÑƒ¿¬½¼«»±•†™©®¾þ]+"), "[^a-zA-Z0-9 /{}[]:._~-!@#$%^&*áàâãªäÁÀÂÃÄÍÌÎÏíìîïéèêëÉÈÊËóòôõºöÓÒÔÕÖúùûüÚÙÛÜçÇñÑ]");
        });
    });

    describe("Clean Permalink", function(){
        it("should convert any string into a permalink friendly version", function(){
            assert.strictEqual(sanitizer.cleanPermalink("            This is a test p-er-malink & link      with 038478 num---bers  and special # $ ^&#^&@ 3#$    "), "this-is-a-test-p-er-malink-and-link-with-038478-num-bers-and-special-3");

            let cleanedOne = sanitizer.cleanPermalink("test with spaces");
            assert.strictEqual(sanitizer.cleanPermalink(cleanedOne), "test-with-spaces");

            let cleanedTwo = sanitizer.cleanPermalink("test ---  -test");
            assert.strictEqual(cleanedTwo, "test-test");
            assert.strictEqual(sanitizer.cleanPermalink(cleanedTwo), "test-test");
        });
    });

});
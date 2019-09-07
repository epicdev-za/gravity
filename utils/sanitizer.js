module.exports = {

    cleanBoolean(data){
        if(data === true || data === 1) return true;
        if(data === false || data === 0) return false;
        throw new Error("Invalid data property");
    },

    cleanNumeric(){

    },

    cleanAlpha(){

    },

    cleanAlphaNumeric(){

    },

    cleanSymbols(){

    },

    cleanExtraSymbols(){

    },

    cleanPermalink(){

    }

};
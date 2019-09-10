module.exports = {

    cleanBoolean(data){
        if(data === true || data === 1) return true;
        if(data === false || data === 0) return false;
        throw new Error("Invalid data property");
    },

    cleanNumeric(data){
        data = data.toString();
        data = data.replace(/[^0-9-]/g, '');
        let negative = data.charAt(0) === '-';
        data = data.replace(/-/g, '');
        data = (negative) ? -data : data;
        return parseInt(data);
    },

    cleanAlpha(data){
        data = data.toString();
        data = data.replace(/[^a-zA-Z]/g, '');
        return data;
    },

    cleanAlphaNumeric(data){
        data = data.toString();
        data = data.replace(/[^a-zA-Z0-9]/g, '');
        return data;
    },

    cleanSymbols(data){
        data = data.toString();
        data = data.replace(/[^a-zA-Z0-9 \/:._,~\-!?@#\$%\^&\*]+/g, '');
        return data;
    },

    cleanExtraSymbols(data){
        data = data.toString();
        data = data.replace(/[^a-zA-Z0-9 \/{}[\]:._~\-!@#\$%\^&\*áàâãªäÁÀÂÃÄÍÌÎÏíìîïéèêëÉÈÊËóòôõºöÓÒÔÕÖúùûüÚÙÛÜçÇñÑ]+/g, '')
        return data;
    },

    cleanPermalink(data){
        data = data.toString();
        data = data.replace(/ & /g, ' and ');
        data = data.replace(/[^a-zA-Z0-9\- ]/g, '');
        data = data.trim();
        data = data.replace(/ {2,}/g, ' ');
        data = data.replace(/ /g, '-');
        data = data.replace(/-{2,}/g, '-');
        data = data.toLowerCase();
        return data;
    }

};
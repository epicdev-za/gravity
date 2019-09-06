module.exports = {
    server_name: 'Gravity Server',
    port: 3001,
    endpoints: {
        'auth': {
            children: {
                'token': {
                    method: "get",
                    handler: require("./endpoints/auth/token")
                }
            }
        }
    }
};
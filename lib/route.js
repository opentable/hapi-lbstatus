var service = require("./provider");

exports.configure = function(server, config){
    server.route([
        {
            method: "GET",
            path: "/_lbstatus",
            config: {
                handler: function(request, reply) {
                    service.lbstatus(server, config, function(result){
                        reply(result).code(200);
                    });
                }
            }
        }
    ]);
};

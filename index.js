var service = require('./lib/provider');

exports.register = function(plugin, options, next){
    plugin.route(
        {
            method: "GET",
            path: "/_lbstatus",
            config: {
                handler: function(request, reply) {
                    service.lbstatus(plugin.servers, options, function(result){
                        reply(result).code(200);
                    });
                }
            }
        }
    );

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
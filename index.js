var service = require('./lib/provider');

exports.register = function(server, options, next){
    server.route(
        {
            method: "GET",
            path: "/_lbstatus",
            config: {
                handler: function(request, reply) {
                    service.lbstatus(request.server, options, function(result){
                        reply(result.body).code(result.code);
                    });
                },
                tags: ['lbstatus', 'non-cacheable'],
                description: 'get the lbstatus (ON or OFF)'
            }
        }
    );

    server.expose('lbstatus', function(cb){
      service.lbstatus(server, options, function(result){
          cb(result.code === 200);
      });
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

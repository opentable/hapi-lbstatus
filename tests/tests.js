describe('lbstatus tests', function(){
    var should = require('should'),
        lbstatus = require('../index'),
        r = [],
        plugin = {
            route: function(routes){
                r = r.concat(routes);
            },
            servers: [{
                inject: function(options, callback){
                    callback({ statusCode: 200 });
                },
                log: function(){}
            }]
        };

    beforeEach(function(){
        r = [];
    });

    it('should register the route', function(){
        lbstatus.register(plugin, {}, function(){});
        r.length.should.eql(1);
    });

    it('should read the file', function(done){
        lbstatus.register(plugin, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(){});

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_ON');
            done();
            return { code: function(){} };
        });
    });

    it('should return off when the file says off', function(done){
        lbstatus.register(plugin, {
            file: __dirname + '/statusfile-off',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(){});

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_OFF');
            done();
            return { code: function(){} };
        });
    });

    it('should return off when the file is missing', function(done){
        lbstatus.register(plugin, {
            file: __dirname + '/statusfile-missing',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(){});

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_OFF');
            done();
            return { code: function(){} };
        });
    });

    it('should return off when the liveness check fails', function(done){
        lbstatus.register(plugin, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(){});

        plugin.servers[0].inject = function(options, callback){
            callback({ code: 500 });
        };

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_OFF');
            done();
            return { code: function(){} };
        });
    });

    it('should use the config value for returning the string', function(done){
        lbstatus.register(plugin, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123',
            on: 'blarg',
            off: 'flarg'
        }, function(){});

        r[0].config.handler({}, function(result){
            result.should.eql('flarg');
            done();
            return { code: function(){} };
        });
    });
});
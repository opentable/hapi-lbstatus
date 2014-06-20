describe('lbstatus tests', function(){
    var should = require('should'),
        provider = require('../lib/provider'),
        servers = [{
            inject: function(options, callback){
                callback({ statusCode: 200 });
            },
            log: function(){}
        }],
        badservers = [{
            inject: function(options, callback){
                callback({ statusCode: 500 });
            },
            log: function(){}
        }];

    it('should register the route', function(){
        var p = require('../index.js'),
            r = [],
            plugin = {
              route: function(route) {
                  r.push(route);
              }
            };

        p.register(plugin, {}, function(){});
        r.length.should.eql(1);
        r[0].path.should.eql('/_lbstatus');
    });

    it('should read the file', function(done){
        provider.lbstatus(servers, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(result){
            result.should.eql('OTWEB_ON');
            done();
        });
    });

    it('should return off when the file says off', function(done){
        provider.lbstatus(servers, {
            file: __dirname + '/statusfile-off',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(result){
            result.should.eql('OTWEB_OFF');
            done();
        });
    });

    it('should return off when the file is missing', function(done){
        provider.lbstatus(servers, {
            file: __dirname + '/statusfile-missing',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(result){
            result.should.eql('OTWEB_OFF');
            done();
        });
    });

    it('should use the config value for returning the string', function(done){
        provider.lbstatus(servers, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123',
            on: 'blarg',
            off: 'flarg'
        }, function(result){
            result.should.eql('blarg');
            done();
        });
    });

    it('should return off when the liveness check fails', function(done){
        provider.lbstatus(badservers, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123',
            on: 'OTWEB_ON',
            off: 'OTWEB_OFF'
        }, function(result){
            result.should.eql('OTWEB_OFF');
            done();
        });
    });
});
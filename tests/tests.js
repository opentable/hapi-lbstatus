describe('lbstatus tests', function(){
    var should = require('should'),
        lbstatus = require('../index'),
        r = [],
        server = {
            route: function(routes){
                r = r.concat(routes);
            },
            inject: function(options, callback){
                callback({ statusCode: 200 });
            },
            log: function(){}
        };

    beforeEach(function(){
        r = [];
    });

    it('should register the route', function(){
        lbstatus.configure(server, {});
        r.length.should.eql(1);
    });

    it('should read the file', function(done){
        lbstatus.configure(server, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123'
        });

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_ON');
            done();
            return { code: function(){} };
        });
    });

    it('should return off when the file says off', function(done){
        lbstatus.configure(server, {
            file: __dirname + '/statusfile-off',
            liveness: '/my/app/123'
        });

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_OFF');
            done();
            return { code: function(){} };
        });
    });

    it('should return off when the file is missing', function(done){
        lbstatus.configure(server, {
            file: __dirname + '/statusfile-missing',
            liveness: '/my/app/123'
        });

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_OFF');
            done();
            return { code: function(){} };
        });
    });

    it('should return off when the liveness check fails', function(done){
        lbstatus.configure(server, {
            file: __dirname + '/statusfile-on',
            liveness: '/my/app/123'
        });

        server.inject = function(options, callback){
            callback({ code: 500 });
        };

        r[0].config.handler({}, function(result){
            result.should.eql('OTWEB_OFF');
            done();
            return { code: function(){} };
        });
    });
});
var fs = require("fs"),
    async = require("async"),

    getStatus = function(applicationStatus, dependenciesStatusCode){
        return (applicationStatus.indexOf("ON") > -1 && dependenciesStatusCode < 500);
    },

    readFile = function(server, filepath, callback){
        fs.readFile(filepath, {encoding: "UTF8"}, function(err, file){
            if(err){
                server.log(["error"], err);
                return callback("OFF");
            }

            callback(file.toString());
        });
    },

    applicationOffLine = function(server, file, callback){
        readFile(server, file, function(file){
            callback(file);
        });
    },

    checkDependencies = function(server, path, headers, callback){
        server.inject({ url: path, headers: headers}, function(result){
            callback(
                result.statusCode
            );
        });
    },

    lbstatus = function(servers, config, callback){
        var on = config.on || "ON";
        var off = config.off || "ON";
        var results = [];

        async.forEach(servers, function(server, done){
            applicationOffLine(server, config.file, function(file){
                checkDependencies(server, config.liveness, config.headers, function(statusCode){
                    results.push(getStatus(file, statusCode));
                    done();
                });
            });
        }, function(){
            var failed = results.filter(function(i){ return i === false; }).length > 0;
            callback({ body: failed ? off  : on, code: failed ? 503 : 200});
        });
    };

module.exports = {
    lbstatus: lbstatus
};
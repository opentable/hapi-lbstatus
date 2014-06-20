var fs = require("fs"),
    async = require("async"),

    getStatus = function(applicationStatus, dependenciesStatusCode){
        return (applicationStatus === "ON" && dependenciesStatusCode < 500);
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

        var results = [];

        async.forEach(servers, function(server, done){
            applicationOffLine(server, config.file, function(file){
                checkDependencies(server, config.liveness, config.headers, function(statusCode){
                    results.push(getStatus(file, statusCode));
                    done();
                });
            });
        }, function(){
            callback(results.filter(
                    function(i){ return i === false; })
                .length === 0 ?
                config.on : config.off);
        });
    };

module.exports = {
    lbstatus: lbstatus
};
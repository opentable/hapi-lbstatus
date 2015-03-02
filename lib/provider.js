var fs = require("fs"),

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

    lbstatus = function(server, config, callback){
        var on = config.on || "ON";
        var off = config.off || "OFF";
        var results = [];

        applicationOffLine(server, config.file, function(file){
            checkDependencies(server, config.liveness, config.headers, function(statusCode){
                var success = getStatus(file, statusCode);
                callback({ body: success ? on  : off, code: success ? 200 : 503});
            });
        });
    };

module.exports = {
    lbstatus: lbstatus
};

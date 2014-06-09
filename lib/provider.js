
var fs = require("fs"),

    _getStatus = function(applicationStatus, dependenciesStatusCode){
        if(applicationStatus.indexOf("ON") > -1 && dependenciesStatusCode < 500){
            return "OTWEB_ON";
        }

        return "OTWEB_OFF";
    },

    _readFile = function(server, filepath, callback){
        fs.readFile(filepath, {encoding: "UTF8"}, function(err, file){
            if(err){
                server.log(["error"], err);
                return callback("OFF");
            }

            callback(file.toString());
        });
    },

    applicationOffLine = function(server, file, callback){
        _readFile(server, file, function(file){
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
        applicationOffLine(server, config.file, function(file){
            checkDependencies(server, config.liveness, config.headers, function(statusCode){
                callback(
                    _getStatus(file, statusCode)
                );
            });
        });
    };

module.exports = {
    lbstatus: lbstatus
};
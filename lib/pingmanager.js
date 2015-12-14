'use strict';
var PingHost = require("./pinghost");
module.exports = PingManager;

var manager = PingManager.prototype;

/*
 * Ping target manager
 * */
function PingManager(options) {
    options = options || {};
    options.workdir = options.workdir || __dirname;

    this._init = false; // init
    this._map = new Map(); // all monitor target
}

/*
* Load all ping host from local file dirs
* */
manager.load = function() {

};

/*
* save all manager hosts to local dir
* */
manager.commit = function (){

};


manager.add = function(target){
    if (target instanceof PingHost) {
        if (!this._map.has(target.hostname)) {
            this._map.add(target.hostname, target);
        }
    } else if (target instanceof "String") {
        var pingHost = PingHost.createFromJSON(target);
        if (pingHost) {
            this._map.add(pingHost.hostname, pingHost);
        }
    }

};


manager.remove = function(hostname){
};
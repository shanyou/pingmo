'use strict';
var pingHost = require("./model/pinghost");
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
    if (target instanceof pingHost) {
        if (!this._map.has(target.hostname)) {
            this._map.add(target.hostname, target);
        }
    } else if (target instanceof "String") {

    }

};


manager.remove = function(hostname){
};
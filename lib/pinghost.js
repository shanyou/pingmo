'use strict';
var debug = require('debug')('pingmo:pinghost');
var util = require('util');
var Emitter = require('events').EventEmitter;
var ping = require ("net-ping");
var dns = require('dns');

/**
 * Created by shanyou on 15/11/28.
 */

/**
 * Ping Target for monitor
 * */
function PingHost(hostname, options) {
    this._running = false;
    this._host = hostname;
    this._ip = null;
    options = options || {};
    //set default value
    options.interval = options.interval || 1000;
    options.ttl = options.ttl || 64;
    options.packetSize = options.packetSize || 64;
    options.timeout = options.timeout || 2000;
    options.retries = options.retries || 1;

    this._options = options;

    this._seq = 0;
}

util.inherits(PingHost, Emitter);

var pingObj = PingHost.prototype;

/**
 * if ping running
* */
Object.defineProperty(pingObj, "isRunning", {
    get function(){
        return this._running;
    }
});



pingObj._pingWithIP = function(cb){
    var self = this;
    cb = cb || function(){};

    if (!self._ip) {
        cb(new Error('invalid ip address'));
    }

    var session = ping.createSession(self._options);
    session.on ("error", function (error) {
        debug("session error, " + error.toString ());
        self.onPingCallback(error);
    });

    var start = process.hrtime();
    session.pingHost(self._ip, function(error){
        var end = process.hrtime();
        var endNano = end[0] * 1e9 + end[1];
        var startNano = start[0]*1e9 + start[1];
        var duration = (endNano - startNano);

        if (error) {
            if (!(error instanceof ping.RequestTimedOutError)) {
                session.close();
            }
            cb(error, {duration: duration});
        }
        else
            cb(null, {duration: duration});
    });
};

pingObj.onPingCallback = function(error, result){
    if (error) {
        this.emit("ping", {
            hostname: this._host,
            ip: this._ip,
            ttl: this._options.ttl,
            timeout: this._options.timeout,
            interval: this._options.interval,
            packetSize: this._options.packetSize,
            retries: this._options.retries,
            duration: result.duration,
            seq: this._seq,
            success: false,
            error: error
        });
    } else {
        debug(result.duration);
        this.emit("ping", {
            hostname: this._host,
            ip: this._ip,
            ttl: this._options.ttl,
            timeout: this._options.timeout,
            interval: this._options.interval,
            packetSize: this._options.packetSize,
            retries: this._options.retries,
            duration: result.duration,
            seq: this._seq,
            success: true
        });
    }

    this._seq++;
    if (this._running) {
        setTimeout(this._pingWithIP.bind(this, this.onPingCallback.bind(this)),
            this._options.interval || 1000);
    }
};

pingObj.start = function() {
    var self = this;
    if (!self._running) {
        self._running = true;
        self._seq = 0;
        if (!self._ip) {
            dns.lookup(self._host, function(err, ip){
                self._ip = ip;
                self.emit("start", {
                    hostname: self._host,
                    ip: self._ip,
                    ttl: self._options.ttl,
                    timeout: self._options.timeout,
                    interval: self._options.interval,
                    packetSize: self._options.packetSize,
                    retries: self._options.retries,
                    seq: self._seq
                });
                self._pingWithIP(self.onPingCallback.bind(self));
            });
        } else {
            this.emit("start", {
                hostname: self._host,
                ip: self._ip,
                ttl: self._options.ttl,
                timeout: self._options.timeout,
                interval: self._options.interval,
                packetSize: self._options.packetSize,
                retries: self._options.retries,
                seq: self._seq
            });
            self._pingWithIP(self.onPingCallback.bind(self));
        }
    }
};

pingObj.stop = function() {
    this._running = false;
    this.emit("stop", {
        hostname: this._host,
        ip: this._ip,
        ttl: this._options.ttl,
        timeout: this._options.timeout,
        interval: this._options.interval,
        packetSize: this._options.packetSize,
        retries: this._options.retries,
        seq: this._seq
    });
};

pingObj.toJSON = function() {
    return JSON.stringify({
        hostname: this._host,
        options:{
            ttl: this._options.ttl,
            timeout: this._options.timeout,
            interval: this._options.interval,
            packetSize: this._options.packetSize,
            retries: this._options.retries
        }
    });
};

/**
 * create PingHost FromJOSN
 * */
PingHost.createFromJSON = function(objString){
    try {
        var obj = JSON.parse(objString);
        if (obj.hostname) {
            return new PingHost(obj.hostname, obj.options);
        }
    } catch(ex) {
        debug("create PingHost Error with " + objString);
    }



};
module.exports = PingHost;

/**
 * Created by shanyou on 15/11/28.
 */
var Promise = require("bluebird");
var ping = require ("net-ping");
var dns = Promise.promisifyAll(require('dns'));
var PingHost = require('./lib/pinghost');
var heapdump = require('heapdump');
var util = require('util');

var pingOption = {
    packetSize: 4,
    ttl: 64,
    timeout: 1000
};

var host = process.argv[2];

var pingHost = new PingHost(host, {
    interval: 1000
});
pingHost.start();
pingHost.on('start', function(res){
    console.log("PING " + res.hostname + " (" + res.ip + ")");
});
pingHost.on('ping', function(res){
    var result;
    if (res.success) {
        result = util.format("%s bytes from %s: icmp_seq=%s ttl=%s time=%s ms",
            res.packetSize,
            res.ip,
            res.seq,
            res.ttl,
            (res.duration/1e6).toFixed(2)
        );
    } else {
        result = util.format("Request timeout for icmp_seq %s", res.seq);
    }

    console.log(result);
});

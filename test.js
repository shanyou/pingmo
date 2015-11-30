/**
 * Created by shanyou on 15/11/28.
 */
var ping = require ("net-ping");
var dns = require('dns');

var pingOption = {
    packetSize: 4,
    ttl: 64,
    timeout: 1000
};

var session = ping.createSession (pingOption);
function _internalPing (address){
    var start = new Date();
    session.pingHost (address, function (error, target) {
        var end = new Date();
        var duration = (end.getTime() - start.getTime());
        if (error)
            console.log (target + ": " + error.toString ());
        else
            console.log (target + ": Alive " + duration + "ms");

        setTimeout(function () {
            _internalPing(address);
        }, 1000);
    });
}

dns.lookup("www.baidu.com", function(err, addr){
    if (err) {
        console.log("can not resolve hostname");
    } else {
        _internalPing(addr);
    }
});
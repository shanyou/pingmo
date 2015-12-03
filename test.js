/**
 * Created by shanyou on 15/11/28.
 */
var Promise = require("bluebird");
var ping = require ("net-ping");
var dns = Promise.promisifyAll(require('dns'));

var pingOption = {
    packetSize: 4,
    ttl: 64,
    timeout: 1000
};

function pingAsync(address) {
  return new Promise(function(resolve, reject){
    console.log('new Promise ');
    var session = ping.createSession(address, pingOption);
    session.on ("error", function (error) {
    	console.trace (error.toString ());
      reject(error);
    });

    console.log('start ping ' + address);
    var start = new Date();
    session.pingHost (address, function (error, target) {
      console.log('end ping');
      var end = new Date();
      var duration = (end.getTime() - start.getTime());
      console.log(duration);
      if (error)
          reject(error);
      else
          resolve({ip: target, duration: duration});
    });
  });
}

var host = process.argv[2];
console.log('begin ping ' + host);
//dns.lookupAsync(host).then(pingAsync).then(function(obj){
//  console.dir(obj);
//}).catch(function(err){
//  console.log(err.message);
//});

function pingping() {
  dns.lookupAsync(host).then(function(ip){
      var session = ping.createSession(ip, pingOption);
      var start = process.hrtime();
      session.pingHost (ip, function (error, target) {
        var end = process.hrtime();
        var endnano = end[0] * 1e9 + end[1];
        var startnano = start[0]*1e9 + start[1];
        if (error) {
          console.log('timeout');
        } else {
          console.log((endnano - startnano)/1e6);
        }
        setTimeout(function () {
            pingping();
        }, 1000);
      });
  });
}

pingping();

function _internalPing (address, session){
    var start = new Date();
    session.pingHost (address, function (error, target) {
        var end = new Date();
        var duration = (end.getTime() - start.getTime());
        if (error)
            console.log (target + ": " + error.toString ());
        else
            console.log (target + ": Alive " + duration + "ms");

        setTimeout(function () {
            _internalPing(address, session);
        }, 1000);
    });
}

'use strict';

/**
 * Created by shanyou on 15/11/28.
 */

/**
 * Ping Target for monitor
 * */
function PingHost(host) {
    this.host = host;
    this.summary = {
        minResp: 0,     // min response time ms
        maxResp: 0,     // max response time ms
        avgResp: 0,     // avg response time ms
        success: 0,     // success count
        fail:0          // fail count
    };

    this.createTime = new Date();

};

module.exports = PingHost;

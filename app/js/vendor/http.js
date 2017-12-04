var http = function(opts) {
    'use strict';
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();

        request.open(opts.method, opts.url);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(request.response);
            } else {
                reject({
                    status: this.status,
                    statusText: request.statusText
                })
            }
        };
        request.onerror = function() {
            reject({
                status: this.status,
                statusText: request.statusText
            });
        };
        request.send(opts.data);
    })
}
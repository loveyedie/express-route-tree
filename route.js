'use strict';

var fs = require('fs'),
    path = require('path');

var controller = {};

function isDirectory(filepath) {
    if (fs.existsSync(filepath)) {
        return fs.statSync(filepath).isDirectory();
    }
}
function initController(dirname) {
    fs.readdirSync(dirname).forEach(function(item) {
        var filepath = path.join(dirname, item);
        if (isDirectory(filepath)) {
            controller[item] = {};
            initController(controlleontrollerr[item], filepath);
        } else if (/\.js$/.test(item)) {
            controller[item.slice(0, -3)] = require(filepath);
            console.log('Loading:', filepath);
        }
    });
}

// to get the original controller object
exports.controller = controller;

/**
 * express-route-tree
 * @param {String} dirname
 * @param {Array} fileRouter
 * @return {Function}
 */
module.exports = function(dirname, fileRouter) {
    initController(dirname);
    return function(req, res, next) {
        var pathArr = req.path.substring(1).split('/'),
            app = controller,
            isGet = req.method === 'GET',
            method;

        if (pathArr[0] && !app[pathArr[0]]) {
            if (fileRouter && fileRouter.indexOf(pathArr[0]) !== -1) {
                return res.sendfile(pathArr[0], { maxAge: _config.maxAge });
            } else {
                return next('unknow route.');
            }
        }
        while (true) {
            // method == "0"
            method = pathArr.shift() || 'index';
            if (typeof app[method] === 'object') {
                app = app[method];
                continue;
            }
            if (!isGet) {
                method = req.method.toLowerCase() + method.substring(0, 1).toUpperCase() + method.substring(1);
            }
            if (typeof app[method] === 'function') {
                pathArr.unshift(req, res, next);
                app[method].apply(null, pathArr);
            } else {
                pathArr.unshift(req, res, next, method.replace('.html', ''));
                app.index.apply(null, pathArr);
            }
            break;
        }
    };
};

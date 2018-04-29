#!/usr/bin/env node
/* istanbul instrument in package github_crud */
/* jslint-utility2 */
/*jslint
    bitwise: true,
    browser: true,
    maxerr: 4,
    maxlen: 100,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;



    // run shared js-env code - init-before
    (function () {
        // init local
        local = {};
        // init modeJs
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        // init utility2_rollup
        local = local.global.utility2_rollup || local;
        /* istanbul ignore next */
        if (!local) {
            local = local.global.utility2_rollup ||
                local.global.utility2_rollup_old ||
                require('./assets.utility2.rollup.js');
            local.fs = null;
        }
        // init exports
        if (local.modeJs === 'browser') {
            local.global.utility2_github_crud = local;
        } else {
            // require builtins
            // local.assert = require('assert');
            local.buffer = require('buffer');
            local.child_process = require('child_process');
            local.cluster = require('cluster');
            local.console = require('console');
            local.constants = require('constants');
            local.crypto = require('crypto');
            local.dgram = require('dgram');
            local.dns = require('dns');
            local.domain = require('domain');
            local.events = require('events');
            local.fs = require('fs');
            local.http = require('http');
            local.https = require('https');
            local.module = require('module');
            local.net = require('net');
            local.os = require('os');
            local.path = require('path');
            local.process = require('process');
            local.punycode = require('punycode');
            local.querystring = require('querystring');
            local.readline = require('readline');
            local.repl = require('repl');
            local.stream = require('stream');
            local.string_decoder = require('string_decoder');
            local.timers = require('timers');
            local.tls = require('tls');
            local.tty = require('tty');
            local.url = require('url');
            local.util = require('util');
            local.v8 = require('v8');
            local.vm = require('vm');
            local.zlib = require('zlib');
/* validateLineSortedReset */
            module.exports = local;
            module.exports.__dirname = __dirname;
        }
        // init lib
        local.local = local.github_crud = local;
    }());



    /* istanbul ignore next */
    // run shared js-env code - function-before
    (function () {
        local.ajax = function (options, onError) {
        /*
         * this function will send an ajax-request with error-handling and timeout
         * example usage:
            local.ajax({
                header: { 'x-header-hello': 'world' },
                method: 'GET',
                url: '/index.html'
            }, function (error, xhr) {
                console.log(xhr.responseText);
                console.log(xhr.statusCode);
            });
         */
            var ajaxProgressUpdate, bufferToNodeBuffer, isDone, modeJs, nop, streamListCleanup, xhr;
            // init standalone handling-behavior
            nop = function () {
            /*
             * this function will do nothing
             */
                return;
            };
            ajaxProgressUpdate = local.ajaxProgressUpdate || nop;
            bufferToNodeBuffer = local.bufferToNodeBuffer || function (arg) {
            /*
             * this function will return the arg
             */
                return arg;
            };
            // init onError
            if (local.onErrorWithStack) {
                onError = local.onErrorWithStack(onError);
            }
            streamListCleanup = function (streamList) {
            /*
             * this function will end or destroy the streams in streamList
             */
                streamList.forEach(function (stream) {
                    // try to end the stream
                    try {
                        stream.end();
                    } catch (errorCaught) {
                        // if error, then try to destroy the stream
                        try {
                            stream.destroy();
                        } catch (ignore) {
                        }
                    }
                });
            };
            modeJs = (function () {
                try {
                    return typeof navigator.userAgent === 'string' &&
                        typeof document.querySelector('body') === 'object' &&
                        typeof XMLHttpRequest.prototype.open === 'function' &&
                        'browser';
                } catch (errorCaughtBrowser) {
                    return module.exports &&
                        typeof process.versions.node === 'string' &&
                        typeof require('http').createServer === 'function' &&
                        'node';
                }
            }());
            // init xhr
            xhr = !options.httpRequest && (modeJs === 'node' ||
                (local.serverLocalUrlTest && local.serverLocalUrlTest(options.url)))
                ? local._http && local._http.XMLHttpRequest && new local._http.XMLHttpRequest()
                : modeJs === 'browser' && new window.XMLHttpRequest();
            if (!xhr) {
                xhr = require('url').parse(options.url);
                xhr.headers = options.headers;
                xhr.method = options.method;
                xhr.timeout = xhr.timeout || local.timeoutDefault || 30000;
                xhr = (
                    options.httpRequest || require(xhr.protocol.slice(0, -1)).request
                )(xhr, function (response) {
                    var chunkList;
                    chunkList = [];
                    xhr.responseStream = response;
                    xhr.responseHeaders = xhr.responseStream.headers;
                    xhr.status = xhr.responseStream.statusCode;
                    xhr.responseStream
                        .on('data', function (chunk) {
                            chunkList.push(chunk);
                        })
                        .on('end', function () {
                            xhr.response = Buffer.concat(chunkList);
                            if (xhr.responseType === 'text' || !xhr.responseType) {
                                xhr.responseText = String(xhr.response);
                            }
                            xhr.onEvent({ type: 'load' });
                        })
                        .on('error', xhr.onEvent);
                });
                xhr.addEventListener = nop;
                xhr.open = nop;
                xhr.requestStream = xhr;
                xhr.responseText = '';
                xhr.send = xhr.end;
                xhr.setRequestHeader = nop;
                setTimeout(function () {
                    xhr.on('error', xhr.onEvent);
                });
            }
            // debug xhr
            local._debugXhr = xhr;
            // init options
            Object.keys(options).forEach(function (key) {
                if (options[key] !== undefined) {
                    xhr[key] = options[key];
                }
            });
            // init headers
            xhr.headers = {};
            Object.keys(options.headers || {}).forEach(function (key) {
                xhr.headers[key.toLowerCase()] = options.headers[key];
            });
            // init method
            xhr.method = xhr.method || 'GET';
            // init timeStart
            xhr.timeStart = Date.now();
            // init timeout
            xhr.timeout = xhr.timeout || local.timeoutDefault || 30000;
            // init timerTimeout
            xhr.timerTimeout = setTimeout(function () {
                xhr.error = xhr.error || new Error('onTimeout - timeout-error - ' +
                    xhr.timeout + ' ms - ' + 'ajax ' + xhr.method + ' ' + xhr.url);
                xhr.abort();
                // cleanup requestStream and responseStream
                streamListCleanup([xhr.requestStream, xhr.responseStream]);
            }, xhr.timeout | 0);
            // init event handling
            xhr.onEvent = function (event) {
                if (event instanceof Error) {
                    xhr.error = xhr.error || event;
                    xhr.onEvent({ type: 'error' });
                    return;
                }
                // init statusCode
                xhr.statusCode = xhr.status;
                switch (event.type) {
                case 'abort':
                case 'error':
                case 'load':
                    // do not run more than once
                    if (isDone) {
                        return;
                    }
                    isDone = xhr._isDone = true;
                    // debug ajaxResponse
                    if (xhr.modeDebug) {
                        console.error('serverLog - ' + JSON.stringify({
                            time: new Date(xhr.timeStart).toISOString(),
                            type: 'ajaxResponse',
                            method: xhr.method,
                            url: xhr.url,
                            statusCode: xhr.statusCode,
                            timeElapsed: Date.now() - xhr.timeStart,
                            // extra
                            data: (function () {
                                try {
                                    return String(xhr.data.slice(0, 256));
                                } catch (ignore) {
                                }
                            }()),
                            responseText: (function () {
                                try {
                                    return String(xhr.responseText.slice(0, 256));
                                } catch (ignore) {
                                }
                            }())
                        }));
                    }
                    // cleanup timerTimeout
                    clearTimeout(xhr.timerTimeout);
                    // cleanup requestStream and responseStream
                    setTimeout(function () {
                        streamListCleanup([xhr.requestStream, xhr.responseStream]);
                    });
                    // decrement ajaxProgressCounter
                    if (local.ajaxProgressCounter) {
                        local.ajaxProgressCounter -= 1;
                    }
                    // handle abort or error event
                    if (!xhr.error &&
                            (event.type === 'abort' ||
                            event.type === 'error' ||
                            xhr.statusCode >= 400)) {
                        xhr.error = new Error('ajax - event ' + event.type);
                    }
                    // debug statusCode
                    (xhr.error || {}).statusCode = xhr.statusCode;
                    // debug statusCode / method / url
                    if (local.errorMessagePrepend && xhr.error) {
                        local.errorMessagePrepend(xhr.error, modeJs + ' - ' +
                            xhr.statusCode + ' ' + xhr.method + ' ' + xhr.url + '\n' +
                            // try to debug responseText
                            (function () {
                                try {
                                    return '    ' + JSON.stringify(xhr.responseText.slice(0, 256) +
                                        '...') + '\n';
                                } catch (ignore) {
                                }
                            }()));
                    }
                    onError(xhr.error, xhr);
                    break;
                }
                ajaxProgressUpdate();
            };
            // increment ajaxProgressCounter
            local.ajaxProgressCounter = local.ajaxProgressCounter || 0;
            local.ajaxProgressCounter += 1;
            xhr.addEventListener('abort', xhr.onEvent);
            xhr.addEventListener('error', xhr.onEvent);
            xhr.addEventListener('load', xhr.onEvent);
            xhr.addEventListener('loadstart', ajaxProgressUpdate);
            xhr.addEventListener('progress', ajaxProgressUpdate);
            if (xhr.upload && xhr.upload.addEventListener) {
                xhr.upload.addEventListener('progress', ajaxProgressUpdate);
            }
            // open url through corsForwardProxyHost
            xhr.corsForwardProxyHost = xhr.corsForwardProxyHost || local.corsForwardProxyHost;
            xhr.location = xhr.location || (local.global && local.global.location) || {};
            if (local.corsForwardProxyHostIfNeeded && local.corsForwardProxyHostIfNeeded(xhr)) {
                xhr.open(xhr.method, local.corsForwardProxyHostIfNeeded(xhr));
                xhr.setRequestHeader('forward-proxy-headers', JSON.stringify(xhr.headers));
                xhr.setRequestHeader('forward-proxy-url', xhr.url);
            // open url
            } else {
                xhr.open(xhr.method, xhr.url);
            }
            Object.keys(xhr.headers).forEach(function (key) {
                xhr.setRequestHeader(key, xhr.headers[key]);
            });
            if (local.FormData && xhr.data instanceof local.FormData) {
                // handle formData
                xhr.data.read(function (error, data) {
                    if (error) {
                        xhr.onEvent(error);
                        return;
                    }
                    // send data
                    xhr.send(bufferToNodeBuffer(data));
                });
            } else {
                // send data
                xhr.send(bufferToNodeBuffer(xhr.data));
            }
            return xhr;
        };

        local.assert = function (passed, message, onError) {
        /*
         * this function will throw the error message if passed is falsey
         */
            var error;
            if (passed) {
                return;
            }
            error = message && message.message
                // if message is an error-object, then leave it as is
                ? message
                : new Error(typeof message === 'string'
                    // if message is a string, then leave it as is
                    ? message
                    // else JSON.stringify message
                    : JSON.stringify(message));
            // debug error
            local._debugAssertError = error;
            onError = onError || function (error) {
                throw error;
            };
            onError(error);
        };

        local.cliRun = function (fnc) {
        /*
         * this function will run the cli
         */
            var nop;
            nop = function () {
            /*
             * this function will do nothing
             */
                return;
            };
            local.cliDict._eval = local.cliDict._eval || function () {
            /*
             * <code>
             * # eval code
             */
                local.global.local = local;
                require('vm').runInThisContext(process.argv[3]);
            };
            local.cliDict['--eval'] = local.cliDict['--eval'] || local.cliDict._eval;
            local.cliDict['-e'] = local.cliDict['-e'] || local.cliDict._eval;
            local.cliDict._help = local.cliDict._help || function () {
            /*
             *
             * # print help
             */
                var commandList, packageJson, text, textDict;
                commandList = [{
                    arg: '<arg1> <arg2> ...',
                    description: 'usage:',
                    command: ['<command>'],
                    file: __filename.replace((/.*\//), '')
                }];
                packageJson = require('./package.json');
                textDict = {};
                Object.keys(local.cliDict).sort().forEach(function (key, ii) {
                    if (key[0] === '_' && key !== '_default') {
                        return;
                    }
                    text = String(local.cliDict[key]);
                    if (key === '_default') {
                        key = '<no-command>';
                    }
                    ii = textDict[text] = textDict[text] || (ii + 1);
                    if (commandList[ii]) {
                        commandList[ii].command.push(key);
                    } else {
                        commandList[ii] = (/\n +?\*(.*?)\n +?\*(.*?)\n/).exec(text);
                        // coverage-hack - ignore else-statement
                        nop(local.global.__coverage__ && (function () {
                            commandList[ii] = commandList[ii] || ['', '', ''];
                        }()));
                        commandList[ii] = {
                            arg: commandList[ii][1].trim(),
                            command: [key],
                            description: commandList[ii][2].trim(),
                            file: commandList[0].file
                        };
                    }
                });
                console.log(packageJson.name + ' (' + packageJson.version + ')\n\n' + commandList
                    .filter(function (element) {
                        return element;
                    }).map(function (element) {
                        return (element.description + '\n' +
                            element.file + '    ' +
                            element.command.sort().join('|') + '    ' +
                            element.arg).trim();
                    })
                    .join('\n\n') + '\n\nexample:\n' + local.path.basename(__filename) +
                    '    --eval    \'console.log("hello world")\'');
            };
            local.cliDict['--help'] = local.cliDict['--help'] || local.cliDict._help;
            local.cliDict['-h'] = local.cliDict['-h'] || local.cliDict._help;
            local.cliDict._default = local.cliDict._default || local.cliDict._help;
            local.cliDict.help = local.cliDict.help || local.cliDict._help;
            local.cliDict._interactive = local.cliDict._interactive || function () {
            /*
             *
             * # start interactive-mode
             */
                local.global.local = local;
                local.replStart();
            };
            if (local.replStart) {
                local.cliDict['--interactive'] = local.cliDict['--interactive'] ||
                    local.cliDict._interactive;
                local.cliDict['-i'] = local.cliDict['-i'] || local.cliDict._interactive;
            }
            local.cliDict._version = local.cliDict._version || function () {
            /*
             *
             * # print version
             */
                console.log(require(__dirname + '/package.json').version);
            };
            local.cliDict['--version'] = local.cliDict['--version'] || local.cliDict._version;
            local.cliDict['-v'] = local.cliDict['-v'] || local.cliDict._version;
            // run fnc()
            fnc = fnc || function () {
                if (local.cliDict[process.argv[2]]) {
                    local.cliDict[process.argv[2]]();
                    return;
                }
                local.cliDict._default();
            };
            fnc();
        };

        local.nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };

        local.onErrorWithStack = function (onError) {
        /*
         * this function will create a new callback that will call onError,
         * and append the current stack to any error
         */
            var onError2, stack;
            stack = new Error().stack.replace((/(.*?)\n.*?$/m), '$1');
            onError2 = function (error, data, meta) {
                if (error &&
                        error !== local.errorDefault &&
                        String(error.stack).indexOf(stack.split('\n')[2]) < 0) {
                    // append the current stack to error.stack
                    error.stack += '\n' + stack;
                }
                onError(error, data, meta);
            };
            // debug onError
            onError2.toString = function () {
                return String(onError);
            };
            return onError2;
        };

        local.onNext = function (options, onError) {
        /*
         * this function will wrap onError inside the recursive function options.onNext,
         * and append the current stack to any error
         */
            options.onNext = local.onErrorWithStack(function (error, data, meta) {
                try {
                    options.modeNext = error && !options.modeErrorIgnore
                        ? Infinity
                        : options.modeNext + 1;
                    onError(error, data, meta);
                } catch (errorCaught) {
                    // throw errorCaught to break infinite recursion-loop
                    if (options.errorCaught) {
                        throw options.errorCaught;
                    }
                    options.errorCaught = errorCaught;
                    options.onNext(errorCaught, data, meta);
                }
            });
            return options;
        };

        local.onParallel = function (onError, onEach, onRetry) {
        /*
         * this function will create a function that will
         * 1. run async tasks in parallel
         * 2. if counter === 0 or error occurred, then call onError with error
         */
            var onParallel;
            onError = local.onErrorWithStack(onError);
            onEach = onEach || local.nop;
            onRetry = onRetry || local.nop;
            onParallel = function (error, data) {
                if (onRetry(error, data)) {
                    return;
                }
                // decrement counter
                onParallel.counter -= 1;
                // validate counter
                local.assert(
                    onParallel.counter >= 0 || error || onParallel.error,
                    'invalid onParallel.counter = ' + onParallel.counter
                );
                // ensure onError is run only once
                if (onParallel.counter < 0) {
                    return;
                }
                // handle error
                if (error) {
                    onParallel.error = error;
                    // ensure counter <= 0
                    onParallel.counter = -Math.abs(onParallel.counter);
                }
                // call onError when isDone
                if (onParallel.counter <= 0) {
                    onError(error, data);
                    return;
                }
                onEach();
            };
            // init counter
            onParallel.counter = 0;
            // return callback
            return onParallel;
        };

        local.onParallelList = function (options, onEach, onError) {
        /*
         * this function will
         * 1. async-run onEach in parallel,
         *    with the given options.rateLimit and options.retryLimit
         * 2. call onError when onParallel.ii + 1 === options.list.length
         */
            var isListEnd, onEach2, onParallel;
            options.list = options.list || [];
            onEach2 = function () {
                while (true) {
                    if (!(onParallel.ii + 1 < options.list.length)) {
                        isListEnd = true;
                        return;
                    }
                    if (!(onParallel.counter < options.rateLimit + 1)) {
                        return;
                    }
                    onParallel.ii += 1;
                    onEach({
                        element: options.list[onParallel.ii],
                        ii: onParallel.ii,
                        list: options.list,
                        retry: 0
                    }, onParallel);
                }
            };
            onParallel = local.onParallel(onError, onEach2, function (error, data) {
                if (error && data && data.retry < options.retryLimit) {
                    local.onErrorDefault(error);
                    data.retry += 1;
                    setTimeout(function () {
                        onParallel.counter -= 1;
                        onEach(data, onParallel);
                    }, 1000);
                    return true;
                }
                // restart if options.list has grown
                if (isListEnd && (onParallel.ii + 1 < options.list.length)) {
                    isListEnd = null;
                    onEach2();
                }
            });
            onParallel.ii = -1;
            options.rateLimit = Number(options.rateLimit) || 6;
            options.rateLimit = Math.max(options.rateLimit, 1);
            options.retryLimit = Number(options.retryLimit) || 2;
            onParallel.counter += 1;
            onEach2();
            onParallel();
        };

        local.onReadyAfter = function (onError) {
        /*
         * this function will call onError when onReadyBefore.counter === 0
         */
            local.onReadyBefore.counter += 1;
            local.taskCreate({ key: 'utility2.onReadyAfter' }, null, onError);
            local.onResetAfter(local.onReadyBefore);
            return onError;
        };
    }());
    switch (local.modeJs) {



    // run node js-env code - function
    case 'node':
        local.githubContentAjax = function (options, onError) {
        /*
         * this function will request the content from github
         */
            // init options
            options = {
                content: options.content,
                headers: {
                    // github oauth authentication
                    Authorization: 'token ' + process.env.GITHUB_TOKEN,
                    // bug-workaround - https://developer.github.com/v3/#user-agent-required
                    'User-Agent': 'undefined'
                },
                httpRequest: options.httpRequest,
                message: options.message,
                method: options.method || 'GET',
                responseJson: {},
                sha: options.sha,
                url: options.url
            };
            options.url = options.url
/* jslint-ignore-begin */
// parse https://github.com/:owner/:repo/blob/:branch/:path
.replace(
    (/^https:\/\/github.com\/([^\/]+?\/[^\/]+?)\/blob\/([^\/]+?)\/(.+)/),
    'https://api.github.com/repos/$1/contents/$3?branch=$2'
)
// parse https://github.com/:owner/:repo/tree/:branch/:path
.replace(
    (/^https:\/\/github.com\/([^\/]+?\/[^\/]+?)\/tree\/([^\/]+?)\/(.+)/),
    'https://api.github.com/repos/$1/contents/$3?branch=$2'
)
// parse https://raw.githubusercontent.com/:owner/:repo/:branch/:path
.replace(
(/^https:\/\/raw.githubusercontent.com\/([^\/]+?\/[^\/]+?)\/([^\/]+?)\/(.+)/),
    'https://api.github.com/repos/$1/contents/$3?branch=$2'
)
// parse https://:owner.github.io/:repo/:path
.replace(
    (/^https:\/\/([^\.]+?)\.github\.io\/([^\/]+?)\/(.+)/),
    'https://api.github.com/repos/$1/$2/contents/$3?branch=gh-pages'
)
/* jslint-ignore-end */
                .replace((/\?branch=(.*)/), function (match0, match1) {
                    options.branch = match1;
                    if (options.method === 'GET') {
                        match0 = match0.replace('branch', 'ref');
                    }
                    return match0;
                });
            if (options.url.indexOf('https://api.github.com/repos/') !== 0) {
                onError(new Error('invalid url ' + options.url));
                return;
            }
            if (options.method !== 'GET') {
                options.message = options.message ||
                    '[ci skip] ' + options.method + ' file ' + options.url
                    .replace((/\?.*/), '');
                options.url += '&message=' + encodeURIComponent(options.message);
                if (options.sha) {
                    options.url += '&sha=' + options.sha;
                }
                options.data = JSON.stringify({
                    branch: options.branch,
                    content: new Buffer(options.content || '').toString('base64'),
                    message: options.message,
                    sha: options.sha
                });
            }
            local.ajax(options, function (error, xhr) {
                console.error('serverLog - ' + JSON.stringify({
                    time: new Date(xhr.timeStart).toISOString(),
                    type: 'githubCrudResponse',
                    method: xhr.method,
                    url: xhr.url,
                    statusCode: xhr.statusCode,
                    timeElapsed: Date.now() - xhr.timeStart
                }));
                try {
                    options.responseJson = JSON.parse(xhr.response);
                } catch (ignore) {
                }
                onError(error, options.responseJson);
            });
        };

        local.githubContentDelete = function (options, onError) {
        /*
         * this function will delete the github file
         * https://developer.github.com/v3/repos/contents/#delete-a-file
         */
            options = {
                httpRequest: options.httpRequest,
                message: options.message,
                url: options.url
            };
            local.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    // get sha
                    local.githubContentAjax({
                        httpRequest: options.httpRequest,
                        url: options.url
                    }, options.onNext);
                    break;
                case 2:
                    // delete file with sha
                    if (!error && data.sha) {
                        local.githubContentAjax({
                            httpRequest: options.httpRequest,
                            message: options.message,
                            method: 'DELETE',
                            sha: data.sha,
                            url: options.url
                        }, options.onNext);
                        return;
                    }
                    // delete tree
                    local.onParallelList({ list: data }, function (options2, onParallel) {
                        onParallel.counter += 1;
                        // recurse
                        local.githubContentDelete({
                            httpRequest: options.httpRequest,
                            message: options.message,
                            url: options2.element.url
                        }, onParallel);
                    }, options.onNext);
                    break;
                default:
                    onError();
                }
            });
            options.modeNext = 0;
            options.onNext();
        };

        local.githubContentGet = function (options, onError) {
        /*
         * this function will get the github file
         * https://developer.github.com/v3/repos/contents/#get-contents
         */
            options = { httpRequest: options.httpRequest, url: options.url };
            local.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    local.githubContentAjax({
                        httpRequest: options.httpRequest,
                        url: options.url
                    }, options.onNext);
                    break;
                case 2:
                    options.onNext(null, new Buffer(data.content || '', 'base64'));
                    break;
                default:
                    onError(error, !error && data);
                }
            });
            options.modeNext = 0;
            options.onNext();
        };

        local.githubContentPut = function (options, onError) {
        /*
         * this function will put options.content into the github file
         * https://developer.github.com/v3/repos/contents/#update-a-file
         */
            options = {
                content: options.content,
                httpRequest: options.httpRequest,
                message: options.message,
                modeErrorIgnore: true,
                url: options.url
            };
            local.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    // get sha
                    local.githubContentAjax({
                        httpRequest: options.httpRequest,
                        url: options.url
                    }, options.onNext);
                    break;
                case 2:
                    // put file with sha
                    local.githubContentAjax({
                        content: options.content,
                        httpRequest: options.httpRequest,
                        message: options.message,
                        method: 'PUT',
                        sha: data.sha,
                        url: options.url
                    }, options.onNext);
                    break;
                default:
                    onError(error);
                }
            });
            options.modeNext = 0;
            options.onNext();
        };

        local.githubContentPutFile = function (options, onError) {
        /*
         * this function will put options.file into the github file
         * https://developer.github.com/v3/repos/contents/#update-a-file
         */
            options = {
                file: options.file,
                httpRequest: options.httpRequest,
                message: options.message,
                url: options.url
            };
            local.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    // get file from url
                    if ((/^(?:http|https):\/\//).test(options.file)) {
                        local.ajax({
                            httpRequest: options.httpRequest,
                            url: options.file
                        }, function (error, response) {
                            options.onNext(error, response && response.data);
                        });
                        return;
                    }
                    // get file
                    local.fs.readFile(options.file, options.onNext);
                    break;
                case 2:
                    local.githubContentPut({
                        content: data,
                        httpRequest: options.httpRequest,
                        message: options.message,
                        // resolve file in url
                        url: (/\/$/).test(options.url)
                            ? options.url + local.path.basename(options.file)
                            : options.url
                    }, options.onNext);
                    break;
                default:
                    onError(error);
                }
            });
            options.modeNext = 0;
            options.onNext();
        };

        local.githubContentTouch = function (options, onError) {
        /*
         * this function will touch options.url
         * https://developer.github.com/v3/repos/contents/#update-a-file
         */
            options = {
                httpRequest: options.httpRequest,
                message: options.message,
                modeErrorIgnore: true,
                url: options.url
            };
            local.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    // get sha
                    local.githubContentAjax({
                        httpRequest: options.httpRequest,
                        url: options.url
                    }, options.onNext);
                    break;
                case 2:
                    // put file with sha
                    local.githubContentAjax({
                        content: new Buffer(data.content || '', 'base64'),
                        httpRequest: options.httpRequest,
                        message: options.message,
                        method: 'PUT',
                        sha: data.sha,
                        url: options.url
                    }, options.onNext);
                    break;
                default:
                    onError(error);
                }
            });
            options.modeNext = 0;
            options.onNext();
        };

        local.githubContentTouchList = function (options, onError) {
        /*
         * this function will touch options.urlList in parallel
         * https://developer.github.com/v3/repos/contents/#update-a-file
         */
            local.onParallelList({ list: options.urlList }, function (options2, onParallel) {
                onParallel.counter += 1;
                local.githubContentTouch({
                    httpRequest: options.httpRequest,
                    message: options.message,
                    modeErrorIgnore: true,
                    url: options2.element
                }, onParallel);
            }, onError);
        };
        break;
    }
    switch (local.modeJs) {



    /* istanbul ignore next */
    // run node js-env code - init-after
    case 'node':
        // init cli
        if (module !== require.main || local.global.utility2_rollup) {
            break;
        }
        local.cliDict = {};
        local.cliDict.delete = function () {
        /*
         * <fileRemote> <commitMessage>
         * # delete <fileRemote> from github
         */
            local.githubContentDelete({
                message: process.argv[4],
                url: process.argv[3]
            }, function (error) {
                // validate no error occurred
                console.assert(!error, error);
            });
        };
        local.cliDict.get = function () {
        /*
         * <fileRemote>
         * # get <fileRemote> from github
         */
            local.githubContentGet({ url: process.argv[3] }, function (error, data) {
                // validate no error occurred
                console.assert(!error, error);
                try {
                    process.stdout.write(data);
                } catch (ignore) {
                }
            });
        };
        local.cliDict.put = function () {
        /*
         * <fileRemote> <fileLocal> <commitMessage>
         * # put <fileLocal> to <fileRemote> on github
         */
            local.githubContentPutFile({
                message: process.argv[5],
                url: process.argv[3],
                file: process.argv[4]
            }, function (error) {
                // validate no error occurred
                console.assert(!error, error);
            });
        };
        local.cliDict.touch = function () {
        /*
         * <fileRemote> <commitMessage>
         * # touch <fileRemote> on github
         */
            local.githubContentTouch({
                message: process.argv[4],
                url: process.argv[3]
            }, function (error) {
                // validate no error occurred
                console.assert(!error, error);
            });
        };
        local.cliDict.touchList = function () {
        /*
         * <fileRemoteList> <commitMessage>
         * # touch comma-separated fileRemoteList on github
         */
            local.githubContentTouchList({
                message: process.argv[4],
                urlList: process.argv[3].split(',').filter(function (element) {
                    return element;
                })
            }, function (error) {
                // validate no error occurred
                console.assert(!error, error);
            });
        };
        local.cliRun();
        break;
    }
}());

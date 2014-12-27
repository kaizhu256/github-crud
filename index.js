#!/usr/bin/env node
/*jslint
  bitwise: true, browser: true,
  indent: 2,
  maxerr: 8,
  node: true, nomen: true,
  regexp: true,
  stupid: true,
  todo: true
*/
(function () {
  'use strict';
  exports.githubUpload = function (options, onError) {
    /*
      this function uploads the data to the github url
    */
    var errorStack,
      finished,
      modeIo,
      onIo,
      request,
      response,
      responseText,
      timerTimeout,
      urlParsed;
    modeIo = 0;
    onIo = function (error) {
      modeIo = error instanceof Error ? -1 : modeIo + 1;
      switch (modeIo) {
      case 1:
        // init stack trace of this function's caller in case of error
        errorStack = new Error().stack;
        // init request and response
        request = response = { destroy: exports.nop };
        // set timerTimeout
        timerTimeout = setTimeout(function () {
          error = new Error('timeout error - 30000 ms - githubUpload - ' + options.url);
          onIo(error);
        }, Number(options.timeout) || 30000);
        // parse url
        urlParsed = (/^https:\/\/github.com\/([^\/]+\/[^\/]+)\/blob\/([^\/]+)\/(.+)/)
          .exec(options.url) ||
          (/^https:\/\/raw.githubusercontent.com\/([^\/]+\/[^\/]+)\/([^\/]+)\/(.+)/)
          .exec(options.url) || {};
        // init options
        options.headers = {
          // github basic authentication
          authorization: process.env.GITHUB_BASIC ? 'basic ' + process.env.GITHUB_BASIC
            // github oauth authentication
            : 'token ' + process.env.GITHUB_TOKEN,
          // bug - github api requires user-agent header
          'user-agent': 'undefined'
        };
        options.hostname = 'api.github.com';
        options.path = '/repos/' + urlParsed[1] + '/contents/' +
          urlParsed[3] + '?ref=' + urlParsed[2];
        request = require('https').request(options, onIo);
        request.on('error', onIo);
        request.end();
        break;
      case 2:
        response = error;
        responseText = '';
        response
          .on('data', function (chunk) {
            responseText += chunk.toString();
            options.sha = (/"sha":"([^"]+)"/).exec(responseText);
            // read response stream until we get the sha hash,
            // then close the response stream
            if (options.sha) {
              options.sha = options.sha[1];
              onIo();
            }
          })
          .on('end', function () {
            // handle case where sha hash does not exist
            if (!options.sha) {
              onIo();
            }
          })
          .on('error', onIo);
        break;
      case 3:
        // cleanup request socket
        request.destroy();
        // cleanup response socket
        response.destroy();
        options.data = JSON.stringify({
          branch: urlParsed[2],
          content: new Buffer(options.data || '').toString('base64'),
          message: '[skip ci] update file ' + options.url,
          // update-file-mode - update old file specified by the sha
          sha: options.sha || undefined
        });
        options.method = 'PUT';
        options.path = '/repos/' + urlParsed[1] + '/contents/' + urlParsed[3];
        request = require('https').request(options, onIo);
        request.on('error', onIo);
        request.end(options.data);
        break;
      case 4:
        response = error;
        responseText = '';
        response
          .on('data', function (chunk) {
            responseText += chunk.toString();
          })
          .on('end', onIo)
          .on('error', onIo);
        break;
      default:
        // if already finished, then ignore error / data
        if (finished) {
          return;
        }
        finished = true;
        // cleanup timerTimeout
        clearTimeout(timerTimeout);
        // cleanup request socket
        request.destroy();
        // cleanup response socket
        response.destroy();
        if (response.statusCode > 201) {
          error = error || new Error(responseText);
        }
        if (error) {
          // add http method / statusCode / url debug info to error.message
          error.message = options.method + ' ' + (response && response.statusCode) +
            ' - https://api.github.com' + options.path + '\n' +
            // trim potentially very long http response
            error.message.slice(0, 4096);
          // debug stack
          error.stack += '\n' + errorStack;
          // debug status code
          error.statusCode = response && response.statusCode;
        }
        onError(error);
      }
    };
    onIo();
  };

  exports.nop = function () {
    /*
      this function performs no operation - nop
    */
    return;
  };

  // upload to the github url process.argv[2], the file/url process.argv[3]
  (function () {
    var chunkList, modeIo, onIo;
    modeIo = 0;
    onIo = function (error, data) {
      modeIo = error instanceof Error ? -1 : modeIo + 1;
      switch (modeIo) {
      case 1:
        // if this module is not the main app, then return
        if (module !== require.main) {
          return;
        }
        // set timerTimeout
        setTimeout(function () {
          throw new Error('timeout error - 30000 ms - githubUpload - ' + process.argv[2]);
        }, 30000).unref();
        // get data from url process.argv[3]
        data = require('url').parse(process.argv[3]);
        if (data.protocol) {
          require(data.protocol === 'https:' ? 'https' : 'http').request(data, onIo)
            .on('error', onIo)
            .end();
          return;
        }
        // skip reading from http response step
        modeIo += 1;
        // get data from file process.argv[3]
        require('fs').readFile(require('path').resolve(process.cwd(), process.argv[3]), onIo);
        break;
      case 2:
        chunkList = [];
        error
          // on data event, push the buffer chunk to chunkList
          .on('data', function (chunk) {
            chunkList.push(chunk);
          })
          // on end event, pass concatenated read buffer to onIo
          .on('end', function () {
            onIo(null, Buffer.concat(chunkList));
          })
          // on error event, pass error to onIo
          .on('error', onIo);
        break;
      case 3:
        // upload data to the github url process.argv[2]
        exports.githubUpload({ data: data, url: process.argv[2] }, onIo);
        break;
      default:
        if (error) {
          throw error;
        }
      }
    };
    onIo();
  }());
}());

var Promise = require('bluebird');
var fetch = require('node-fetch');
var pkg = require('../package.json');

/**
 * @module utils
 */
var utils = (module.exports = {});

/**
 * Given a JSON string, convert it to its base64 representation.
 *
 * @method    jsonToBase64
 * @memberOf  module:utils
 */
utils.jsonToBase64 = function(json) {
  var bytes = new Buffer(JSON.stringify(json));

  return bytes
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Return an object with information about the current client.
 *
 * @method    generateClientInfo
 * @memberOf  module:utils
 *
 * @return {Object}   Object containing client information.
 */
utils.generateClientInfo = function() {
  return {
    name: 'node-auth0',
    version: pkg.version,
    env: {
      node: process.version.replace('v', '')
    }
  };
};

/**
 * Simple wrapper that, given a class, a property name and a method name,
 * creates a new method in the class that is a wrapper for the given
 * property method.
 *
 * @method    wrapPropertyMethod
 * @memberOf  module:utils
 */
utils.wrapPropertyMethod = function(Parent, name, propertyMethod) {
  var path = propertyMethod.split('.');
  var property = path.shift();
  var method = path.pop();

  Object.defineProperty(Parent.prototype, name, {
    enumerable: false,
    get: function() {
      return this[property][method].bind(this[property]);
    }
  });
};

/**
 * Perform a request with the given settings and return a promise that resolves
 * when the request is successfull and rejects when there's an error.
 *
 * @method    getRequestPromise
 * @memberOf  module:utils
 */
utils.getRequestPromise = function(settings) {
  var bodyOptions = settings.method === 'GET' ? {} : { body: JSON.stringify(settings.data) };
  var headers = {
    'Content-Type': 'application/json',
    ...settings.headers
  };

  var result = fetch(settings.url, {
    method: settings.method,
    ...bodyOptions,
    headers
  }).then(res => res.json());

  return Promise.resolve(result);
};

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearKeychain = exports.accessKeychain = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

/**
 * Utility function for consumers to check if they can access the keychain.
 * Just reading from the keychain isn't sufficient on all platforms; we need to
 * test writing to it as well.
 *
 * @export
 * @param {String} serviceName  The top-level identifier for your app to store items in the keychain.
 * @param {String} accountName  A sub-identifier for individual entries.
 * @returns {Promise<Boolean>}  True if the keychain can be accessed, false if it threw an error.
 */
var accessKeychain = exports.accessKeychain = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(serviceName, accountName, logger) {
    var _require, setPassword, deletePassword, accessCheckAccount, wasDeleted;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _require = require('keytar'), setPassword = _require.setPassword, deletePassword = _require.deletePassword;

            // We don't want to overwrite valid data so append a dummy string

            accessCheckAccount = accountName.concat('-access');
            _context.next = 5;
            return setPassword(serviceName, accessCheckAccount, 'access');

          case 5:
            _context.next = 7;
            return deletePassword(serviceName, accessCheckAccount);

          case 7:
            wasDeleted = _context.sent;
            return _context.abrupt('return', wasDeleted);

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);

            if (logger) logger('TransformPasswords: Cannot access keychain', { error: _context.t0 });
            return _context.abrupt('return', false);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function accessKeychain(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Utility function for consumers to clear the keychain when they're done with
 * it (e.g., the user has uninstalled the app).
 *
 * @export
 * @param {String} serviceName  The top-level identifier for your app to store items in the keychain.
 * @param {String} accountName  A sub-identifier for individual entries.
 * @returns {Promise<Boolean>}  True if the entry was removed, false otherwise.
 */


var clearKeychain = exports.clearKeychain = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(serviceName, accountName, logger) {
    var _require2, deletePassword;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _require2 = require('keytar'), deletePassword = _require2.deletePassword;
            _context2.next = 4;
            return deletePassword(serviceName, accountName);

          case 4:
            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](0);

            if (logger) logger('TransformPasswords: Cannot clear keychain', { error: _context2.t0 });
            return _context2.abrupt('return', false);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6]]);
  }));

  return function clearKeychain(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Creates a new transform instance.
 *
 * @export
 * @param {Object} config
 * @param {String} config.serviceName       The top-level identifier for your app to store items in the keychain.
 * @param {String} [config.accountName]     A sub-identifier for individual entries. If not provided, strings taken
 *                                          from `passwordPaths` will be used.
 * @param {String|Array<String>|Function} [config.passwordPaths]  Lodash getter path(s) to passwords in your state, or
 *                                                                a function that, given your state, returns path(s).
 *                                                                Leave empty to write the entire reducer.
 * @param {Boolean} [config.clearPasswords] False to retain passwords in the persisted state.
 * @param {Boolean} [config.serialize]      True to serialize password objects to JSON.
 * @param {Function} [config.logger]        A logging method.
 * @returns {Transform}                     The redux-persist Transform.
 */


exports.default = createPasswordTransform;

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _setWith = require('lodash/setWith');

var _setWith2 = _interopRequireDefault(_setWith);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _unset = require('lodash/unset');

var _unset2 = _interopRequireDefault(_unset);

var _reduxPersist = require('redux-persist');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteIn = function deleteIn(state, path) {
  if ((0, _isEmpty2.default)(path)) return {};
  var valueAtPath = (0, _get2.default)(state, path);
  var stateWithClonedPath = (0, _setWith2.default)((0, _extends3.default)({}, state), path, valueAtPath, _clone2.default);
  (0, _unset2.default)(stateWithClonedPath, path);
  return stateWithClonedPath;
};function createPasswordTransform() {

  /**
   * Transform that occurs before state is persisted. Retrieve the password
   * path(s) from state, set them on the keychain and clear them from state.
   *
   * @param {Object} state  The inbound state
   * @returns               The transformed state that gets persisted
   */
  var inbound = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(state) {
      var inboundState, pathsToGet, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, path;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              inboundState = (0, _extends3.default)({}, state);
              pathsToGet = getPasswordPaths(state);

              if (!pathsToGet) {
                _context3.next = 33;
                break;
              }

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context3.prev = 6;
              _iterator = pathsToGet[Symbol.iterator]();

            case 8:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context3.next = 16;
                break;
              }

              path = _step.value;
              _context3.next = 12;
              return setPasswordForPath(inboundState, path);

            case 12:
              inboundState = _context3.sent;

            case 13:
              _iteratorNormalCompletion = true;
              _context3.next = 8;
              break;

            case 16:
              _context3.next = 22;
              break;

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3['catch'](6);
              _didIteratorError = true;
              _iteratorError = _context3.t0;

            case 22:
              _context3.prev = 22;
              _context3.prev = 23;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 25:
              _context3.prev = 25;

              if (!_didIteratorError) {
                _context3.next = 28;
                break;
              }

              throw _iteratorError;

            case 28:
              return _context3.finish(25);

            case 29:
              return _context3.finish(22);

            case 30:
              return _context3.abrupt('return', inboundState);

            case 33:
              _context3.prev = 33;
              _context3.next = 36;
              return setPassword(serviceName, accountName, coerceString(inboundState, serialize));

            case 36:
              return _context3.abrupt('return', {});

            case 39:
              _context3.prev = 39;
              _context3.t1 = _context3['catch'](33);

              logger('TransformPasswords: Unable to write reducer', { error: _context3.t1 });
              return _context3.abrupt('return', {});

            case 43:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[6, 18, 22, 30], [23,, 25, 29], [33, 39]]);
    }));

    return function inbound(_x8) {
      return _ref3.apply(this, arguments);
    };
  }();

  /**
   * Transform that occurs when the store is being hydrated with state.
   * Retrieve the password path(s), get the actual passwords from the keychain
   * and apply them to the outbound state.
   *
   * @param {Object} state  The outbound state
   * @returns               The transformed state that will hydrate the store
   */


  var outbound = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(state) {
      var outboundState, pathsToSet, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, path, secret;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              outboundState = (0, _extends3.default)({}, state);
              pathsToSet = getPasswordPaths(state);

              if (!pathsToSet) {
                _context4.next = 33;
                break;
              }

              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context4.prev = 6;
              _iterator2 = pathsToSet[Symbol.iterator]();

            case 8:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context4.next = 16;
                break;
              }

              path = _step2.value;
              _context4.next = 12;
              return getPasswordForPath(outboundState, path);

            case 12:
              outboundState = _context4.sent;

            case 13:
              _iteratorNormalCompletion2 = true;
              _context4.next = 8;
              break;

            case 16:
              _context4.next = 22;
              break;

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4['catch'](6);
              _didIteratorError2 = true;
              _iteratorError2 = _context4.t0;

            case 22:
              _context4.prev = 22;
              _context4.prev = 23;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 25:
              _context4.prev = 25;

              if (!_didIteratorError2) {
                _context4.next = 28;
                break;
              }

              throw _iteratorError2;

            case 28:
              return _context4.finish(25);

            case 29:
              return _context4.finish(22);

            case 30:
              return _context4.abrupt('return', outboundState);

            case 33:
              _context4.prev = 33;
              _context4.next = 36;
              return getPassword(serviceName, accountName);

            case 36:
              secret = _context4.sent;
              return _context4.abrupt('return', JSON.parse(secret));

            case 40:
              _context4.prev = 40;
              _context4.t1 = _context4['catch'](33);

              logger('TransformPasswords: Unable to read reducer', { error: _context4.t1 });
              return _context4.abrupt('return', {});

            case 44:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[6, 18, 22, 30], [23,, 25, 29], [33, 40]]);
    }));

    return function outbound(_x9) {
      return _ref4.apply(this, arguments);
    };
  }();

  var setPasswordForPath = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(inboundState, path) {
      var secret;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              secret = (0, _get2.default)(inboundState, path);

              if (secret) {
                _context5.next = 4;
                break;
              }

              logger('TransformPasswords: Nothing found at path', { path: path });
              return _context5.abrupt('return');

            case 4:
              _context5.prev = 4;
              _context5.next = 7;
              return setPassword(serviceName, accountName || path, coerceString(secret, serialize));

            case 7:

              // Clear out the passwords unless directed not to. Use an immutable
              // version of unset to avoid modifying the original state object.
              if (clearPasswords) {
                inboundState = deleteIn(inboundState, path);
              }
              _context5.next = 13;
              break;

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5['catch'](4);

              logger('TransformPasswords: Unable to write ' + path + ' to keytar', { error: _context5.t0 });

            case 13:
              return _context5.abrupt('return', inboundState);

            case 14:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[4, 10]]);
    }));

    return function setPasswordForPath(_x10, _x11) {
      return _ref5.apply(this, arguments);
    };
  }();

  var getPasswordForPath = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(outboundState, path) {
      var secret, toSet;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return getPassword(serviceName, accountName || path);

            case 3:
              secret = _context6.sent;


              // If we found a stored password, set it on the outbound state.
              // Use an immutable version of set to avoid modifying the original
              // state object.
              if (secret) {
                toSet = serialize ? JSON.parse(secret) : secret;

                outboundState = (0, _setWith2.default)((0, _clone2.default)(outboundState), path, toSet, _clone2.default);
              }
              _context6.next = 10;
              break;

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6['catch'](0);

              logger('TransformPasswords: Unable to read ' + path + ' from keytar', { error: _context6.t0 });

            case 10:
              return _context6.abrupt('return', outboundState);

            case 11:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this, [[0, 7]]);
    }));

    return function getPasswordForPath(_x12, _x13) {
      return _ref6.apply(this, arguments);
    };
  }();

  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var serviceName = config.serviceName;
  var accountName = config.accountName;
  var passwordPaths = config.passwordPaths;
  var clearPasswords = config.clearPasswords !== false;
  var serialize = config.serialize || !config.passwordPaths;
  var logger = config.logger || function () {/* noop */};

  if (!serviceName) throw new Error('serviceName is required');
  if (!passwordPaths && !accountName) throw new Error('Either passwordPaths or accountName is required');

  /**
   * Late-require keytar so that we can handle failures.
   */

  var _require3 = require('keytar'),
      getPassword = _require3.getPassword,
      setPassword = _require3.setPassword;

  /**
   * Coerces the `passwordPaths` parameter into an array of paths.
   *
   * @param {Object} state  The state being transformed
   * @returns               An array of paths in state that contain passwords,
   *                        or null if using the entire subkey
   */


  function getPasswordPaths(state) {
    if (!passwordPaths) return null;

    var paths = typeof passwordPaths === 'function' ? passwordPaths(state) : passwordPaths;

    return typeof paths === 'string' ? [paths] : paths;
  }

  return (0, _reduxPersist.createTransform)(inbound, outbound, config);
}

/**
 * Keytar only supports setting strings, so coerce our value to a string or
 * serialize it.
 *
 * @param {any} value         The value being stored
 * @param {Boolean} serialize Whether or not we should JSON.stringify
 * @returns                   The value as a string
 */
function coerceString(value, serialize) {
  return serialize ? JSON.stringify(value) : typeof value !== 'string' ? value.toString() : value;
}
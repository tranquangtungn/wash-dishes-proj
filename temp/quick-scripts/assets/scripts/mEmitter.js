(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/mEmitter.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '68dacJAu0xG3YCxxTQvE4dC', 'mEmitter', __filename);
// scripts/mEmitter.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events');

var mEmitter = function () {
    function mEmitter() {
        _classCallCheck(this, mEmitter);

        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(200);
    }

    _createClass(mEmitter, [{
        key: 'emit',
        value: function emit() {
            var _emiter;

            (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
    }, {
        key: 'registerEvent',
        value: function registerEvent(event, listener) {
            this._emiter.on(event, listener);
        }
    }, {
        key: 'registerOnce',
        value: function registerOnce(event, listener) {
            this._emiter.once(event, listener);
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent(event, listener) {
            this._emiter.removeListener(event, listener);
        }
    }, {
        key: 'detroy',
        value: function detroy() {
            this._emiter.removeAllListeners();
            this._emiter = null;
            mEmitter.instance = null;
        }
    }]);

    return mEmitter;
}();

mEmitter.instance = null;
module.exports = mEmitter;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=mEmitter.js.map
        
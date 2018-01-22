/**
 * @typedef {function|class} ComponentConstructor
 */

/**
 * @typedef {object}                        ComponentRegisterEntry
 * @property {ComponentConstructor}         ComponentConstructor
 * @property {string}                       componentName
 * @property {Object.<string, function>}    componentCallbacks
 */

/**
 * @typedef {Object.<string, ComponentRegisterEntry>} ComponentsRegister
 * Key is the componentName
 */

 /**
 * @typedef {function} LifecycleCallback
 * @param anything passed to the lifecycle when it's called
 */

 /**
 * @typedef {function} ComponentCallback
 * @param anything passed to the lifecycle when it's called
 */

/**
 * @typedef {object} LifecycleCallbacks
 * @property {LifecycleCallback} [onafterlifecycle]
 * @property {LifecycleCallback} [onafter<lifecycle-name>]
 * @property {LifecycleCallback} [onbeforlifecycle]
 * @property {LifecycleCallback} [onbefore<lifecycle-name>]
 */

/**
 * @typedef {object} LifecycleConstructorConfig
 * @property {ComponentsRegister} componentsRegister
 * @property {LifecycleCallbacks} lifecycleCallbacks
 * @property {string} lifecycleName
 * @property {object} shared
 */

/**
 * @typedef {function} LifecycleConstructor
 * @param {LifecycleConstructorConfig} config
 * @return {*}
 */


/* eslint-disable valid-jsdoc
/* disable as dynamic variable name expressions such as onafter<lifecycle-name>
 * are not supported. See https://stackoverflow.com/questions/42806064/jsdoc-property-name

 /**
 * @param {Object.<string, LifecycleConstructor>} lifecycleConstructors
 * @param {LifecycleCallbacks} [callbacks={}]
 * @property {ComponentCallback} [onafterregister]
 * @property {ComponentCallback} [onafterunregister]
 * @property {ComponentCallback} [onbeforeregister]
 * @property {ComponentCallback} [onbeforeunregister]
 * @property {LifecycleCallback} [onafterlifecycle]
 * @property {LifecycleCallback} [onafter<lifecycle-name>]
 * @property {LifecycleCallback} [onbeforlifecycle]
 * @property {LifecycleCallback} [onbefore<lifecycle-name>]
 * @property {function} [onerror]
 * @return {object} instance
 */
/* eslint-enable valid-jsdoc */
module.exports = function (lifecycleConstructors, callbacks) {
  var _callbacks = callbacks || {}
  var _onerror = _callbacks.onerror || function(error) { throw new Error(error) }
  var _componentsRegister = {}
  var _API = {}
  var _activeLifecycles = []
  var _bus = {}
  var _lifecycles = Object.keys(lifecycleConstructors)
  var _i, _len
  var _invalidLifecycleNames = ['register', 'unregister', 'lifecycle']

  if (_lifecycles.length === 0) {
    _onerror('No lifecycles registered.')

    return
  }

  if (_invalidLifecycleNames.some(
    function(invalid) { return _lifecycles.indexOf(invalid) !== -1 }
  )) {
    _onerror(
      'None of ' + JSON.stringify(_invalidLifecycleNames) + ' can be used as lifecycle names.'
    )

    return
  }

  _lifecycles.forEach(function(lifecycle) {
    // lazy initialize lifecycleMethod
    var lifecycleMethod = (function() {
      return lifecycleConstructors[lifecycle]({
        activeLifecycles: _activeLifecycles,
        bus: _bus,
        componentsRegister: _componentsRegister,
        lifecycle: lifecycle
      })
    })()

    // make callStack contain only existing callbacks and the lifecycleMethod
    var callStack = [
      _callbacks.onbeforelifecycle,
      _callbacks['onbefore' + lifecycle],
      lifecycleMethod,
      _callbacks['onafter' + lifecycle],
      _callbacks.onafterlifecycle
    ].filter(function(call) { return call })

    _API[lifecycle] = (function() {
      var lifecycleResult
      var args = Array.prototype.slice.call(arguments)

      _activeLifecycles.push({ arguments: args, lifecycle: lifecycle})

      for (_i = 0, _len = callStack.length; _i < _len; _i++) {
        if (callStack[_i] === lifecycleMethod) {
          // pass received arguments through to lifecycle method
          lifecycleResult = callStack[_i].apply(null, args)
        } else {
          // provided additional info to callbacks
          callStack[_i]({ arguments: args, bus: _bus, lifecycle: lifecycle })
        }
      }

      _activeLifecycles.pop()

      return lifecycleResult
    })
  })

  return Object.assign(_API, {
    /**
     * @param {string}                    componentName
     * @param {function|class}            ComponentConstructor
     * @param {Object.<string, function>} [componentCallbacks={}]
     */
    register: function(componentName, ComponentConstructor, componentCallbacks) {
      var callbackParams = {
        ComponentConstructor: ComponentConstructor,
        bus: _bus,
        componentName: componentName,
        componentsRegister: _componentsRegister
      }

      _callbacks.onbeforeregister &&  _callbacks.onbeforeregister(callbackParams)

      _componentsRegister[componentName] = {
        ComponentConstructor: ComponentConstructor,
        componentCallbacks: componentCallbacks || {},
        componentName: componentName
      }

      _callbacks.onafterregister && _callbacks.onafterregister(callbackParams)
    },

    /**
     * @param {string} componentName
     */
    unregister: function(componentName) {
      if (!_componentsRegister[componentName]) {
        _onerror('Component ' + componentName + 'is not registered.')

        return
      }

      var callbackParams = {
        bus: _bus,
        componentName: componentName,
        componentsRegister: _componentsRegister
      }

      _callbacks.onbeforeunregister && _callbacks.onbeforeunregister(callbackParams)

      delete _componentsRegister[componentName]

      _callbacks.onafterunregister && _callbacks.onafterunregister(callbackParams)
    }
  })
}

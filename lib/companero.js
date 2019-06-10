(function (root, factory) {
  // @ts-ignore
  if (typeof define === 'function' && define.amd) {
      // @ts-ignore
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      // @ts-ignore
      module.exports = factory();
  } else {
      // @ts-ignore
      root.companero = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  /**
   * @param {import("./companero").ComponentsRegister} componentsRegister
   * @param {Object.<string, import("./companero").LifecycleMethod>} lifecycleMethods
   * @param {import("./companero").ConstructorOptions} constructorOptions
   * @param {object} shared
   * @param {function} onerror
   * @return {import("./companero").Instance}
   */
  function getInstance(componentsRegister, lifecycleMethods, constructorOptions, shared, onerror) {
    return {
      /**
       * @param {string} componentName
       * @param {import("./companero").ComponentConstructor} ComponentConstructor
       * @param {any} componentOptions
       */
      register(componentName, ComponentConstructor, componentOptions) {
        var callbackParams = {
          ComponentConstructor: ComponentConstructor,
          componentName,
          componentOptions: componentOptions,
          componentsRegister: componentsRegister,
          shared: shared
        };

        if (typeof constructorOptions.onbeforeregister === 'function') {
          constructorOptions.onbeforeregister(callbackParams);
        }

        componentsRegister[componentName] = {
          ComponentConstructor: ComponentConstructor,
          componentName,
          componentOptions: componentOptions
        };

        if (typeof constructorOptions.onafterregister === 'function') {
          constructorOptions.onafterregister(callbackParams);
        }
      },

      /**
       * @param {string} lifecycleName
       * @param {...any} args
       * @returns {any}
       */
      run(lifecycleName) {
        if (!lifecycleMethods[lifecycleName]) {
          onerror('Lifecycle "' + lifecycleName + '" does not exist.');

          return;
        }
        // remove param 'lifecycleName' from arguments and pass the rest to lifecycle
        var args = Array.prototype.slice.call(arguments).slice(1);

        return lifecycleMethods[lifecycleName].apply(null, args);
      },

      /**
       * @param {string} componentName
       */
      unregister(componentName) {
        var callbackParams = {
          componentName,
          componentsRegister: componentsRegister,
          shared: shared
        };

        if (!componentsRegister[componentName]) {
          onerror('Component ' + componentName + ' is not registered.');

          return;
        }

        if (typeof constructorOptions.onbeforeunregister === 'function') {
          constructorOptions.onbeforeunregister(callbackParams);
        }

        delete componentsRegister[componentName];

        if (typeof constructorOptions.onafterunregister === 'function') {
          constructorOptions.onafterunregister(callbackParams);
        }
      }
    };
  }

  /**
   * Returns Companero instance or undefined if an error occured
   *
   * @param {Object.<string, import("./companero").Lifecycle>} lifecycles
   * @param {import("./companero").ConstructorOptions} [constructorOptions]
   * @returns {import("./companero").Instance|undefined}
   */
  function CompaneroConstructor(lifecycles, constructorOptions) {
    /** @type {import("./companero").ConstructorOptions} */
    var _constructorOptions = constructorOptions || {};
    var _onerror = _constructorOptions.onerror || function(/** @type {string} */ message) {
      throw new Error(message);
    };
    var _lifecycleNames = Object.keys(lifecycles);
    var _shared = {};
    /** @type {import("./companero").ComponentsRegister} */
    var _componentsRegister = {};
    /** @type {Object.<string, import("./companero").LifecycleMethod>} */
    var _lifecycleMethods = {};
    /** @type {Array.<Object.<any, any>>} */
    var _activeLifecycles = [];

    if (_lifecycleNames.length === 0) {
      _onerror('No lifecycles in param lifecycleConstructors.');

      return;
    }
    _lifecycleNames.forEach(function(lifecycleName) {
      /** @type {Array.<Function>} */
      var callStack;
      // lazy initialize lifecycleMethod
      var lifecycleMethodWrapper = (function lifecycleMethodWrapper() {
        // returns Lifecycle
        return lifecycles[lifecycleName]({
          activeLifecycles: _activeLifecycles,
          componentsRegister: _componentsRegister,
          lifecycleName: lifecycleName,
          shared: _shared
        });
      })();

      // make callStack contain only existing callbacks and the lifecycleMethod
      callStack = [
        _constructorOptions.onbeforelifecycle,
        lifecycleMethodWrapper,
        _constructorOptions.onafterlifecycle
      ].filter(function(callback) { return typeof callback === 'function'; });

      _lifecycleMethods[lifecycleName] = (function lifecycle() {
        /** @type {Array.<any>} */
        var lifecycleMethodArguments = Array.prototype.slice.call(arguments);
        var lifecycleResult;
        var i = 0;
        var len = callStack.length;

        _activeLifecycles.push({ lifecycleMethodArguments, lifecycleName });

        for (; i < len; i++) {
          if (callStack[i] === lifecycleMethodWrapper) {
            // pass received arguments to lifecycleMethod
            lifecycleResult = callStack[i].apply(null, lifecycleMethodArguments);
          }
          else {
            // provide additional info to callbacks
            callStack[i]({
              lifecycleMethodArguments: lifecycleMethodArguments,
              lifecycleName: lifecycleName,
              shared: _shared
            });
          }
        }

        _activeLifecycles.pop();

        return lifecycleResult;
      });
    });

    return getInstance(_componentsRegister, _lifecycleMethods, constructorOptions, _shared, _onerror);
  }

  return CompaneroConstructor;
}));
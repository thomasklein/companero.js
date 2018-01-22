const { runlifecycle, getcomponentparams } = require(`./utils`)
const {
  attributeComponentParam,
  attributeComponentNames,
  propertyBusCompontentInstances
} = require(`./config`)

function _initComponent(
  {
    $node, ComponentConstructor, done, doneParams,
    bus, componentName, resolve
  }
) {
  const componentParams = getcomponentparams({ $node, attributeComponentParam, componentName })
  const instance = new ComponentConstructor({ $node, componentName, componentParams })

  if (!bus[propertyBusCompontentInstances][componentName]) {
    bus[propertyBusCompontentInstances][componentName] = []
  }

  bus[propertyBusCompontentInstances][componentName].push({ $node, instance })

  resolve(componentName)
  done && done(Object.assign({ instance }, doneParams))
}

/**
 * @param {LifecycleConstructorConfig} config
 * @return {*}
 */
module.exports = function(config) {
  const { bus, componentsRegister } = config

  bus[propertyBusCompontentInstances] = {}

  /**
   * @param {object} options
   * @property {Selector|Node|NodeList|Array} context
   * @property {boolean} asyncronous
   * @property {boolean} traverseChildNodes
   * @return {Promise}
   */
  return ({
    asyncronous,
    context,
    onerror = error => {throw new Error(error)},
    traverseChildNodes
  }) => {
    return runlifecycle({
      asyncronous, attributeComponentNames, bus, componentsRegister, context,
      lifecycleCallback: _initComponent, onerror, traverseChildNodes
    })
  }
}

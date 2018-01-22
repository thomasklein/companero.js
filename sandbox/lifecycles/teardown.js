const { runlifecycle } = require(`./utils`)
const {
  attributeComponentNames,
  propertyBusCompontentInstances
} = require(`./config`)

function _teardownComponent({
    $node, done, doneParams,
    bus, componentName, resolve
  }) {
  const componentInstances = bus[propertyBusCompontentInstances][componentName]

  for (let i = 0, len = componentInstances.length; i < len; i++) {
    if (componentInstances[i].$node === $node) {
      componentInstances[i].instance.teardown()
      componentInstances.splice(i, 1)
      break
    }
  }

  if (!bus[propertyBusCompontentInstances][componentName].length) {
    delete bus[propertyBusCompontentInstances][componentName]
  }

  resolve(componentName)
  done && done(doneParams)
}

/**
 * @param {LifecycleConstructorConfig} config
 * @return {*}
 */
module.exports = function(config) {
  const { bus, componentsRegister } = config

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
      lifecycleCallback: _teardownComponent, onerror, traverseChildNodes
    })
  }
}

import * as lib from '../../lib/companero'
import { runlifecycle } from './utils'
import {
  attributeComponentNames,
  propertyBusCompontentInstances
} from './config'

function _teardownComponent({
  $node, done, doneParams,
  shared, componentName, resolve
}) {
  const componentInstances = shared[propertyBusCompontentInstances][componentName]

  for (let i = 0, len = componentInstances.length; i < len; i++) {
    if (componentInstances[i].$node === $node) {
      componentInstances[i].instance.teardown()
      componentInstances.splice(i, 1)
      break
    }
  }

  if (!shared[propertyBusCompontentInstances][componentName].length) {
    delete shared[propertyBusCompontentInstances][componentName]
  }

  resolve(componentName)
  done && done(doneParams)
}

export default function lifecycleTeardown(config: lib.LifecycleConfig): lib.LifecycleMethod {
  const { shared, componentsRegister } = config

  /**
   * @param {object} options
   * @property {Selector|Node|NodeList|Array} context
   * @property {boolean} asyncronous
   * @return {Promise}
   */
  return ({
    asyncronous,
    context,
    onerror = (error) => { throw new Error(error) }
  }) => runlifecycle({
    asyncronous,
    attributeComponentNames,
    shared,
    componentsRegister,
    context,
    lifecycleCallback: _teardownComponent,
    lifecycleName: `teardown`,
    onerror
  })
}

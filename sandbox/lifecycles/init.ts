import * as lib from '../../lib/companero'
import { runlifecycle, getcomponentparams } from './utils'
import {
  attributeComponentParam,
  attributeComponentNames,
  propertyBusCompontentInstances
} from './config'

function _initComponent(
  {
    $node, ComponentConstructor, done, doneParams,
    shared, componentName, resolve
  }
) {
  const componentParams = getcomponentparams({ $node, attributeComponentParam, componentName })
  const instance = new ComponentConstructor({ $node, componentName, componentParams })

  if (!shared[propertyBusCompontentInstances][componentName]) {
    shared[propertyBusCompontentInstances][componentName] = []
  }

  shared[propertyBusCompontentInstances][componentName].push({ $node, instance })

  resolve(componentName)
  done && done(Object.assign({ instance }, doneParams))
}

export default function lifecycleInit(config: lib.LifecycleConfig): lib.LifecycleMethod {
  const { shared, componentsRegister } = config
  
  shared[propertyBusCompontentInstances] = {}

  return ({
    asyncronous,
    context,
    onerror = (error: string) => { throw new Error(error) }
  }) => runlifecycle({
    asyncronous,
    attributeComponentNames,
    componentsRegister,
    context,
    lifecycleName: `init`,
    lifecycleCallback: _initComponent,
    onerror,
    shared
  })
}

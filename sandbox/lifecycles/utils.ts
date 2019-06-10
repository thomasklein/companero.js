export function getcomponentparams(
  { attributeComponentParam, $node, componentName }
) {
  return JSON.parse($node.getAttribute(`${attributeComponentParam}-${componentName}`))
}

/**
 * @param {object}  options
 * @property {string}                         options.attribute
 * @property {Selector|Node|NodeList|Array}   options.context
 * @property {function}                       options.onerror
 *
 * @returns {Array}
 */
export function getarrayofcomponentnodes(options) {
  const {
    componentSelector, context, onerror
  } = options
  const componentNodes = []
  let nodes

  if (typeof context === `string`) {
    nodes = window.document.querySelectorAll(`${context}${componentSelector}`)
  } else if (typeof context === `object` && context.nodeName) {
    nodes = [...context.querySelectorAll(componentSelector)]
    if (context.matches(componentSelector)) {
      nodes.splice(0, 0, context) // insert context node as first result node
    }
  } else if (typeof context === `object`
    && (context.constructor === NodeList || context.constructor === Array)) {
    nodes = context
  } else {
    onerror(
      `Param 'context' expected to be either a selector, `
      + `NodeList or a Node but is '${context}'.`
    )

    return componentNodes
  }

  nodes = Array.prototype.slice.call(nodes)

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i]

    componentNodes.push(node)
  }

  return componentNodes
}

export function runlifecycle(
  {
    asyncronous, attributeComponentNames, componentsRegister,
    context, lifecycleName, lifecycleCallback, onerror, shared
  }
) {
  console.log(`var 'componentsRegister': ${JSON.stringify(componentsRegister)}`); 
  const componentsPromises = []
  const componentSelector = `[${attributeComponentNames}]`

  getarrayofcomponentnodes({
    componentSelector, context, onerror
  }).forEach(($node) => {
    $node.getAttribute(attributeComponentNames).split(` `).forEach((componentName) => {
      const { ComponentConstructor, componentOptions } = componentsRegister[componentName]
      const callbackParams = {
        $node,
        arguments: { asyncronous, context },
        shared,
        componentName,
        lifecycleName
      }

      if (typeof componentOptions[`onbefore${lifecycleName}`] === `function`) {
        componentOptions[`onbefore${lifecycleName}`](callbackParams)
      }

      componentsPromises.push(new Promise((resolve) => {
        const lifecycleComponentConfig = {
          $node,
          ComponentConstructor,
          shared,
          componentName,
          done: componentOptions[`onafter${lifecycleName}`],
          doneParams: callbackParams,
          lifecycleName,
          resolve
        }

        if (asyncronous) {
          window.setTimeout(() => { lifecycleCallback(lifecycleComponentConfig) }, 0)
        } else {
          lifecycleCallback(lifecycleComponentConfig)
        }
      }))
    })
  })

  return Promise.all(componentsPromises)
}

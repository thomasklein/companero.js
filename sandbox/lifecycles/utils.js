module.exports.getcomponentparams = function({ attributeComponentParam, $node, componentName }) {
  return JSON.parse($node.getAttribute(`${attributeComponentParam}-${componentName}`))
}

/**
 * @param {object}  options
 * @property {string}                         attribute
 * @property {Selector|Node|NodeList|Array}   context
 * @property {function}                       onerror
 * @property {boolean}                        traverseChildren
 *
 * @return {Array}
 */
module.exports.getarrayofcomponentnodes = function(options) {
  const {
    componentSelector, context, onerror, traverseChildren
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
  } else if (typeof context === `object` &&
    (context.constructor === window.NodeList || context.constructor === window.Array)) {
    nodes = context
  } else {
    onerror(
      `Param 'context' expected to be either a selector, ` +
      `NodeList or a Node but is '${context}'.`
    )

    return
  }

  nodes = window.Array.prototype.slice.call(nodes)

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i]

    componentNodes.push(node)

    if (traverseChildren) {
      window.Array.prototype.slice.call(node.querySelectorAll(componentSelector))
        .forEach((componentChildNode) => {
          componentNodes.push(componentChildNode)
        }
      )
    }
  }

  return componentNodes
}

module.exports.runlifecycle = function(
  { asyncronous, attributeComponentNames, bus, context, componentsRegister,
    lifecycle, lifecycleCallback, onerror, traverseChildNodes }) {
  const componentsPromises = []
  const componentSelector = `[${attributeComponentNames}]`

  module.exports.getarrayofcomponentnodes({
    componentSelector, context, onerror, traverseChildNodes
  }).forEach(($node) => {

    $node.getAttribute(attributeComponentNames).split(` `).forEach((componentName) => {
      const { ComponentConstructor, componentCallbacks } = componentsRegister[componentName]
      const callbackParams = {
        $node,
        arguments: { asyncronous, context, traverseChildNodes },
        bus, componentName, lifecycle
      }

      componentCallbacks[`onbefore${lifecycle}`] &&
        componentCallbacks[`onbefore${lifecycle}`](callbackParams)

      componentsPromises.push(new Promise((resolve) => {
        const lifecycleComponentConfig = {
          $node,
          ComponentConstructor,
          bus,
          componentName,
          done: componentCallbacks[`onafter${lifecycle}`],
          doneParams: callbackParams,
          lifecycle,
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


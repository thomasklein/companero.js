const lib = require(`../companero`)
const init = require(`./lifecycles/init`)
const teardown = require(`./lifecycles/teardown`)
const Logger = require(`./logger`)

const logger = Logger(document.querySelector(`.log`))
const { log, logHeadline } = logger

function addEventListeners() {
  document.querySelector(`.tooglevariablesoutput`).addEventListener(`click`, () => {
    document.querySelectorAll(`summary`).forEach(($node) => {
      $node.click()
    })
  })
}

const logCallbackParams = (callbackName, params) => {
  const { componentName, lifecycle } = params
  let message = ``

  if (callbackName) {
    message += `${callbackName} `
  }
  if (componentName) {
    message += ` (Component '${componentName}')`
  }

  message += ` - lifecycle: '${lifecycle}'`

  log({ color: `blue`, message, variable: params })
}

const logComponentInfo = (config) => {
  logHeadline({
    background: `blue`,
    color: `white`,
    message: `${config.componentName} got initialized`,
    variable: config
  })
}

const companero = lib({ init, teardown }, {
  onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
  onafterlifecycle: (params) => { logCallbackParams(`onafterlifecycle`, params) },
  onafterteardown: (params) => { logCallbackParams(`onafterteardown`, params) },
  onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) },
  onbeforelifecycle: (params) => { logCallbackParams(`onbeforelifecycle`, params) },
  onbeforeteardown: (params) => { logCallbackParams(`onbeforeteardown`, params) }
})

class ComponentClassFactory {
  constructor(instanceConfig) {
    logComponentInfo(instanceConfig)
    this.componentName = instanceConfig.componentName
  }
  teardown() {
    logHeadline({
      background: `orange`,
      color: `white`,
      message: `${this.componentName} got destroyed!`
    })
  }
}

function ComponentFunctionFactory(instanceConfig) {
  logComponentInfo(instanceConfig)

  return {
    teardown() {
      logHeadline({
        background: `orange`,
        color: `white`,
        message: `${instanceConfig.componentName} got destroyed!`
      })
    }
  }
}

addEventListeners()

companero.register(
  `componentA`,
  ComponentClassFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) }
  }
)

companero.register(
  `componentB`,
  ComponentFunctionFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) }
  }
)

companero.register(
  `componentC`,
  ComponentFunctionFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) }
  }
)

companero.register(
  `componentD`,
  ComponentFunctionFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) }
  }
)

companero.register(
  `componentE`,
  ComponentFunctionFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) }
  }
)

const startTimeMs = Date.now()

companero.init({
  asyncronous: true,
  context: document.body,
  traverseChildNodes: true
}).then((initValues) => {
  logHeadline({
    background: `green`,
    color: `white`,
    message: `Finished lifecycle 'init' of all components.`,
    variable: initValues
  })

  companero.teardown({
    asyncronous: true,
    context: document.body,
    traverseChildNodes: true
  }).then((teardownValues) => {
    logHeadline({
      background: `green`,
      color: `white`,
      message: `Finished lifecycle 'teardown' of all components.`,
      variable: teardownValues
    })

    log({
      background: `yellow`,
      color: `black`,
      message: `Total processing time: ${Date.now() - startTimeMs}ms`})
  })
})

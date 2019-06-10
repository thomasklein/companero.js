import lib from '../lib/companero'
import init from './lifecycles/init'
import teardown from './lifecycles/teardown'
import Logger from './logger'

const logger = Logger(document.querySelector(`.log`))
const { log, logHeadline } = logger

const logCallbackParams = (callbackName, params) => {
  const { componentName, lifecycleName } = params
  let message = ``

  if (callbackName) {
    message += `${callbackName} `
  }
  if (componentName) {
    message += ` (ComponentName '${componentName}')`
  }

  if (lifecycleName) {
    message += ` - lifecycleName: '${lifecycleName}'`
  }

  log({ color: `blue`, message, variable: params })
}

/**
 * @param {{ componentName: any; }} config
 */
const logComponentInfo = (config) => {
  logHeadline({
    background: `blue`,
    color: `white`,
    message: `${config.componentName} got initialized`,
    variable: config,
  })
}

const companero = lib({ init, teardown }, {
  onerror: () => {},
  onbeforelifecycle:  (params) => { logCallbackParams(`onbeforelifecycle`, params) },
  onafterlifecycle:   (params) => { logCallbackParams(`onafterlifecycle`, params) },
  onbeforeregister:   (params) => { logCallbackParams(`onbeforeregister`, params) },
  onafterregister:    (params) => { logCallbackParams(`onafterregister`, params) },
})

class ComponentClassFactory {
  componentName: String; 

  constructor(instanceConfig) {
    logComponentInfo(instanceConfig)
    this.componentName = instanceConfig.componentName
  }

  teardown() {
    logHeadline({
      background: `orange`,
      color: `white`,
      message: `${this.componentName} got destroyed!`,
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
        message: `${instanceConfig.componentName} got destroyed!`,
      })
    },
  }
}

companero.register(
  `componentA`,
  // @ts-ignore
  ComponentClassFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) },
  }
)

companero.register(
  `componentB`,
  ComponentFunctionFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) },
  }
)

companero.register(
  `componentC`,
  ComponentFunctionFactory,
  {
    onafterinit: (params) => { logCallbackParams(`onafterinit`, params) },
    onbeforeinit: (params) => { logCallbackParams(`onbeforeinit`, params) },
  }
)

function addEventListeners(): void {
  document.querySelector(`.tooglevariablesoutput`).addEventListener(`click`, () => {
    document.querySelectorAll(`summary`).forEach(($node) => {
      $node.click()
    })
  })

  const $runOptionsContainer = document.querySelector(`.runoptions`)

  $runOptionsContainer.addEventListener(`click`, (evt) => {
    const $asynchronousEl = <HTMLInputElement> $runOptionsContainer.querySelector('[name=asynchronous]')
    const asyncronous = $asynchronousEl.checked

    runWithFormOptions({
      asyncronous
    })
  })
}

function runWithFormOptions({ asyncronous }) {
  document.querySelector('.log').innerHTML = ''

  const startTimeMs = Date.now()

  logHeadline({
    background: `green`,
    color: `white`,
    message: `Run lifecycle 'init' of all components.`
  })

  companero.run(`init`, {
    asyncronous,
    context: document.body
  }).then((initValues) => {
    logHeadline({
      background: `green`,
      color: `white`,
      message: `Finished lifecycle 'init' of all components.`,
      variable: initValues,
    })

    logHeadline({
      background: `green`,
      color: `white`,
      message: `Run lifecycle 'teardown' of all components.`
    })

    companero.run(`teardown`, {
      asyncronous,
      context: document.body
    }).then((teardownValues) => {
      logHeadline({
        background: `green`,
        color: `white`,
        message: `Finished lifecycle 'teardown' of all components.`,
        variable: teardownValues,
      })

      log({
        background: `yellow`,
        color: `black`,
        message: `Total processing time: ${Date.now() - startTimeMs}ms`,
        variable: ``
      })
    })
  })
}

addEventListeners()

runWithFormOptions({asyncronous: false})
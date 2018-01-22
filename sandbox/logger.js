/* eslint-disable no-console */

const defaults = {
  background: `#fff`,
  color: `#000`,
  fontWeight: `normal`
}

module.exports = function (logContainer) {
  function log({
    background = defaults.background,
    color = defaults.color,
    fontWeight = defaults.fontWeight,
    message,
    variable
  }) {
    const logEntry = document.createElement(`details`)

    logEntry.classList.add(`log__entry`)

    if (typeof message !== `undefined`) {
        const style = `color:${color};background:${background};` +
        `font-weight:${fontWeight};padding: 5px;`
        const messageContainer = document.createElement(`summary`)

        messageContainer.style = style
        messageContainer.innerHTML = message
        logEntry.appendChild(messageContainer)
        console.log(`%c${message}`, style)
      }


      if (typeof variable !== `undefined`) {
        const variableContainer = document.createElement(`pre`)

        variableContainer.innerHTML = JSON.stringify(variable, true, `  `)
        logEntry.appendChild(variableContainer)
        console.log(variable)
      }

      logContainer.appendChild(logEntry)
  }

  return {
    log,
    logHeadline(options) {
      log(Object.assign(options, { fontWeight: `bold` }))
    }
  }
}

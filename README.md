**terminal.xr**

## About 
`terminal.xr` best logging system for terminal with txt file recording feature with terminal txt colors

## Installation
PC or VDS: `npm install terminal.xr --save` <br>
Glitch: `pnpm install terminal.xr --save`

## Example usage with Express
```js
const ExpressApp = require("express")()
const xariona = require("terminal.xr")
const logger = new xariona({ saveFile: false, autoAdapterLoader: false, design: { timeStyle: "({time}) =", filename: "output", adapterDir: `./adapters` } })

ExpressApp.listen(process.env.PORT, function () {
    logger.info("ExpressApp Succesfully started!")
})

ExpressApp.get("/", function (req, res) {
    logger.info("Someone entered ExpressApp")
})
```

# with Any control
```js
const xariona = require("terminal.xr")
const logger = new xariona({ saveFile: false, autoAdapterLoader: false, design: { timeStyle: "({time}) =", filename: "output", adapterDir: `./adapters` } })

logger.info("Hello world")
logger.json({ profile: { name: "Xariona", age: "19", job: "hobby coder" } }, false)
logger.debug("Debug level")
logger.log("Log level")
logger.status("Module online!")
logger.success("Code worked!")
```

## How to use tick and cross?
using this `terminal.xr` function here example code!

```js
const xariona = require("terminal.xr")
const logger = new xariona({ saveFile: false, autoAdapterLoader: false, design: { timeStyle: "({time}) =", filename: "output", adapterDir: `./adapters` } })

logger.info(`Tick ${logger.tick}`)
logger.info(`Cross ${logger.cross}`)
logger.info(`Danger ${logger.danger}`)
```

## Make your own Custom Loggers!
# 1.2.0 new update! " Easiest custom logger control! and new syntax "
make your own `terminal.xr` logger! example code!

# How create Custom Logger?

```js
const Adapter = require("terminal.xr/addons/adapter") //Adapter schema in terminal.xr

module.exports = class Test extends Adapter {
    constructor() {
        super()

        this.name = "test" //Your Custom Logger name.
        this.hexColor = "#00ffff" //Your hex color code Ex: #*code*
    }    
}
```

# How to use My custom logger
using your own `terminal.xr` logger example code!
**this function not working if you opened autoAdapterLoader!**

```js
logger.importAdapter(require("../<mydir>/test.js"))

logger.create("Hey this is custom!!", { type: "<Your Adapter name Ex. test>" })
```
## Links
- [NPM](https://www.npmjs.com/package/terminal.xr)

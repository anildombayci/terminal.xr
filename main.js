const fs = require('fs')
const c = require('chalk');
const { resolve } = require("path")

function capitalize(str){
  var arr = str.split("");
  arr = arr.map(x => {
     var charCode = x.charCodeAt(0);
     return charCode>=97 && charCode<=122 ? String.fromCharCode(charCode - 32) : x;
   });
  return arr.join("");
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

function writeFile(ex, options) {
  try {
    var _content = fs.readFileSync(options.design.filename)

    fs.writeFileSync(_content + "\n" + options.design.filename, ex, "utf-8")
  } catch (error) {
    fs.writeFileSync(options.design.filename, ex, "utf-8")
  }
}

var importAdapters = async (on) => {
  var dir = on.options.design.adapterDir
  if (fs.existsSync(resolve(dir))) {
    var thisDir = fs.readdirSync(resolve(dir))
    thisDir.filter(x => x.endsWith(".js")).forEach(adapter => {
      var adap = require(`${dir}/${adapter}`)
          adap = new adap()
          adap.filename = on.options.design.filename
          adap.dirname = on.options.dirname

          on.adapters[adap.name] = adap
    })
  } else {
    fs.mkdirSync(dir.split("./")[1])
    await sleep(300)
    fs.writeFileSync(`${resolve(dir + "/example.js")}`, `const Adapter = require("terminal.xr/addons/adapter") \n\nmodule.exports = class Test extends Adapter { \n constructor() { \n  super()\n\n  this.name ="test"\n  this.hexColor = "#00ffff" \n}\n}`)
    await sleep(3000)
    var thisDir = fs.readdirSync(resolve(dir))
    thisDir.filter(x => x.endsWith(".js")).forEach(adapter => {
      var adap = require(`${dir}/${adapter}`)
          adap = new adap()
          adap.filename = on.options.design.filename
          adap.dirname = on.options.dirname

          on.adapters[adap.name] = adap
    })
  }
}

/*
  var here = new file()
  here.filename = this.options.design.filename
  here.dirname = this.options.dirname

  this.adapters[here.name] = here
*/

class Logger {
    constructor(materials){
      this.options = Object.assign({
        dirname: process.cwd(),
        saveFile: false,
        autoAdapterLoader: false,
        design: {
          timeStyle: "({time}) =",
          filename: "output",
          adapterDir: `${process.cwd()}/terminal.xr/adapters`
        }
      }, materials)

      if (this.options.design.filename) {
        if (this.options.design.filename.endsWith(".txt")) return;
        this.options.design.filename = `${this.options.design.filename}.txt`
      }

      this.adapters = {}
      this.types = ["info", "status", "error", "warn", "log", "success", "debug", "json"]
      this.colors = { info: c.cyanBright, status: c.blueBright, warn: c.yellowBright, success: c.greenBright, error: c.redBright, debug: c.magentaBright, json: c.whiteBright }
      
      if (this.options.autoAdapterLoader === true) {
        importAdapters(this)
      }
}

/**
 * Send INFO level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
info(text, materials = {}) {
  this.create(text, { type: "info", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send LOG level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
log(text, materials = {}) {
  this.create(text, { type: "log", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send WARN level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
warn(text, materials = {}) {
  this.create(text, { type: "warn", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send SUCCESS level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
success(text, materials = {}) {
  this.create(text, { type: "success", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send DEBUG level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
debug(text, materials = {}) {
  this.create(text, { type: "debug", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send ERROR level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
error(text, materials = {}) {
  this.create(text, { type: "error", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send STATUS level message in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings in object
 * @returns Object
 */
status(text, materials = {}) {
  this.create(text, { type: "status", saveFile: materials ? materials.saveFile : false })
}

/**
 * Send your own logger or default logger types in Terminal
 * @param {String} text Terminal message
 * @param {Object} materials Logger settings and your adapter.
 * @param {('info'|'status'|'error'|'warn'|'log'|'success'|'debug'|'json')} materials.type - Types of the logger.
 * @param {Boolean} materials.saveFile Save file to texts?
 * @returns {Object}
 */
create(text, materials = { type, saveFile: false }) {
  var time = this.options.design.timeStyle.replace("{time}", new Date().toLocaleTimeString())
  if (!text) throw new TypeError("Text is not entered")
    if (this.types.includes(materials.type)) {
      if (materials.type === "json") {
        if (typeof text === "object" && !Array.isArray(text)) {
          console.log(time + " JSON: " + this.colors[materials.type](`${JSON.stringify(text, null, 1)}`))
          if (materials.saveFile === true) return writeFile(`${time} ${capitalize(materials.type)} ${JSON.stringify(text, null, 1)}`, this.options)
          else return;
        } else return;
      }
      console.log(`${time} ${capitalize(materials.type)} ${this.colors[materials.type](text)}`)
      if (materials.saveFile === true) return writeFile(`${time} ${capitalize(materials.type)} ${text}`, this.options)
      else return;
    } else if (this.adapters[materials.type]) {
      var here = this.adapters[materials.type]
      console.log(`${time} ${capitalize(here.name)} ${c.hex(here.hexColor)(text)}`)
    }
}

/**
 * Send Module version
 */
version = `${require('./package.json').version}`
/**
 * Paste text a green tick
 */
tick = `${c.greenBright("✔")}`
/**
 * Paste text a red cross
 */
cross = `${c.redBright("✗")}`
/**
 * Paste text a yellow danger
 */
danger = `${c.yellowBright("⚠️")}`

/**
 * Send JSON level objects in Terminal
 * @param {Object} obj Your Object
 * @param {Boolean} saveFile Save file? *true or false*
 * @returns Object
 */
json(obj = {}, saveFile = true) {
  this.create(obj, { type: "json", saveFile: saveFile })
}

/**
 * Import your custom logger adapter in logger.
 * @param {Object} file Custom logger file.
 * @returns Object
 */
importAdapter(file) {
  if (this.options.autoAdapterLoader === true) throw new Error("Auto adapter loader is online. Function is temporarily closed")
  if (!file && typeof file !== "object") throw new Error("Adapter is not loaded! somethings went wrong")
  var here = new file()
  here.filename = this.options.design.filename
  here.dirname = this.options.dirname

  this.adapters[here.name] = here
}

/**
 * Easiest adapter import function.
 * @param {Array} adapters Array in adapter objects
 */
 adapter(adapters) {
  if (this.options.autoAdapterLoader === true) {
    throw new Error("Auto adapter loader is online. Function is temporarily closed");
  } if (!Array.isArray(adapters)) {
    throw new Error("Adapters cabine type is not Array!"); 
  } else if(adapters.length === 0) {
    throw new Error("Adapter length only bigger this zero!");
  }
   
  adapters.forEach((adapter) => {
    this.adapters[adapter.name] = ({
      ...adapter,
      filename: this.options.design.filename,
      dirname: this.options.dirname,
      hexColor: adapter.hexColor || "#00ffff"
    });
  });
}

}

module.exports = Logger

import { homedir } from 'os'
import { join, sep } from 'path'
import fs from 'fs'
import ncp from 'ncp'

export default class Config {
  constructor () {
    if (!!this.constructor.instance) {
      return this.constructor.instance
    }

    this.constructor.instance = this

    this._config = {}
    this._file = '.pulsar.json'
    this._path = join(homedir(), 'Pulsar')

    if (!fs.existsSync(this._path)) {
      fs.mkdirSync(this._path)
    }

    this._enginePath = join(this._path, 'engines')
    this._nodesPath = join(this._path, 'nodes')

    // if (process.env.NODE_ENV === 'production') {
    //   this._enginePath = join(this._path, 'engines')
    //   if (!fs.existsSync(this._enginePath)) {
    //     ncp(join(__dirname, '../../../engines'), this._enginePath, function (err) {
    //       if (err) {
    //         return console.error(err)
    //       }
    //       console.log('---- Copied engines ----')
    //     })
    //   }
    //   this._nodesPath = join(this._path, 'nodes')
    //   if (!fs.existsSync(this._enginePath)) {
    //     ncp(join(__dirname, '../../../nodes'), this._nodesPath, function (err) {
    //       if (err) {
    //         return console.error(err)
    //       }
    //       console.log('---- Copied nodes ----')
    //     })
    //   }
    // } else {
    //   this._enginePath = join(this._path, 'engines')
    //   this._nodesPath = join(this._path, 'nodes')
    //
    // }

    const pathSplit = this._path.split(sep)
    pathSplit.push(this._file)
    this._filePath = join(...pathSplit)
  }

  get config () { return this._config }
  set config (config) { this._config = config }

  checkEngines () {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'production') {
        if (!fs.existsSync(this._enginePath)) {
          ncp(join(__dirname, '../../../engines'), this._enginePath, function (err) {
            if (err) {
              return console.error(err)
            }
            console.log('---- Copied engines ----')
          })
        } else {
          resolve()
        }
      } else {
        if (!fs.existsSync(this._enginePath)) {
          ncp('C:/Users/leege/_pulsar/engines', this._enginePath, function (err) {
            if (err) {
              reject(err)
              // return console.error(err)
            }
            console.log('---- Copied engines ----')
            resolve()
          })
        } else {
          resolve()
        }
      }
    })
  }

  checkNodes () {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'production') {
        if (!fs.existsSync(this._nodesPath)) {
          ncp(join(__dirname, '../../../nodes'), this._nodesPath, function (err) {
            if (err) {
              return console.error(err)
            }
            console.log('---- Copied engines ----')
          })
        } else {
          resolve()
        }
      } else {
        if (!fs.existsSync(this._nodesPath)) {
          ncp('C:/Users/leege/_pulsar/nodes', this._nodesPath, function (err) {
            if (err) {
              reject(err)
              // return console.error(err)
            }
            console.log('---- Copied nodes ----')
            resolve()
          })
        } else {
          resolve()
        }
      }
    })
  }

  initConfig (cb) {
    fs.copyFile('.pulsar.json', this._filePath, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('----- config copied successfully')
        this.readConfig(cb)
      }
    })
  }

  readConfig () {
    return new Promise((resolve, reject) => {
      fs.readFile(this._filePath, (err, data) => {
        if (err) {
          console.error(err)
          if (err.code === 'ENOENT') {
            console.log('----- Config does not exist')
            fs.copyFile('.pulsar.json', this._filePath, (err) => {
              if (err) {
                console.error(err)
              } else {
                console.log('----- config copied successfully')
                fs.readFile(this._filePath, (err, data) => {
                  if (err) {

                  } else {
                    try {
                      const config = JSON.parse(data)
                      this._config = config
                      resolve(this._config)
                    } catch (e) {
                      console.error(e)
                      reject(e)
                    }
                  }
                })
              }
            })
          }
        } else {
          try {
            const config = JSON.parse(data)
            this._config = config
            resolve(this._config)
          } catch (e) {
            console.error(e)
            reject(e)
          }
        }
      })
    })
  }

  setConfig (data, cb) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      this._config[keys[i]] = data[keys[i]]
    }
    const jsonContent = JSON.stringify(this._config, null, 2)

    fs.writeFile(this._filePath, jsonContent, 'utf8', function (err) {
      if (err) {
        console.log('An error occured while writing JSON Object to File.')
        // return console.log(err);
      }
      cb()
    })
  }
}

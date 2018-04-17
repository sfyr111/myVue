import Compile from './compile'
import Wathcher from './watcher'

import { observer } from './observer'

export default class Vue {
  constructor(options = {}) {
    this.$options = options
    let data = this._data = options.data

    Object.keys(data).forEach(key => this._proxyData(key))
    observer(this._data)

    this._init()
  }

  _init() {
    this.$compile = new Compile(this.$options.el, this)
    this.$options.mounted && this.$options.mounted.call(this)
  }

  _proxyData(key) {
    const vm = this
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: false,
      get: function proxyGetter() {
        return vm._data[key]
      },
      set: function proxySetter(newVal) {
        vm._data[key] = newVal
      }
    })
  }

  $watch(key, cb) {
    new Wathcher(this, key, cb)
  }
}

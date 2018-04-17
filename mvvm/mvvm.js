import Compile from './compile'
import Wathcher from './watcher'

import { observer } from './observer'

export default class Vue {
  constructor(options = {}) {
    this.$options = options
    let data = this._data = options.data

    Object.keys(data).forEach(key => this._proxyData(key))

    this.init()
  }

  init() {
    this.initComputed()
    observer(this._data)
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

  initComputed() {
    const { computed } = this.$options
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(key => {
        Object.defineProperty(this, key, {
          set() {},
          get: typeof computed[key] === 'function'
            ? computed[key]
            : computed[key].get
        })
      })
    }
  }
}

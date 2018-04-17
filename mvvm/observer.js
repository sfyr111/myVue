import Dep from './dep.js'

class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(data, key, val) {
    const dep = new Dep()
    observer(val)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function proxyGetter() {
        // Dep.target is a Watcher instance
        Dep.target && dep.depend()
        return val
      },
      set: function proxySetter(newVal) {
        if (val === newVal) return
        val = newVal
        observer(newVal)
        dep.notify()
      }
    })
  }

}

export function observer(data) {
  if (!data || typeof data !== 'object') return
  return new Observer(data)
}

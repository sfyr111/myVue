import Dep from './dep.js'

export function observer(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key])
  })
}

function defineReactive(data, key, val) {
  observer(val)

  const dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function proxyGetter() {
      // view 层绑定几次 addSub 注册几个 Watcher 绑定完了Dep.target = null 继续绑定注册下个数据
      Dep.target && dep.addSub(Dep.target)
      return val
    },
    set: function proxySetter(newVal) {
      if (val === newVal) return
      val = newVal
      dep.notify()
    }
  })
}

Dep.target = null // Watcher 添加完毕
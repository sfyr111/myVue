function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key])
  })
}

function defineReactive(data, key, val) {
  observe(val)

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
      val = newVal
    }
  })
}

class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
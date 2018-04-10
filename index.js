
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

class Watcher {
  constructor() {
    Dep.target = this
  }

  update() {
    console.log('watch update')
  }
}

/**
 *
 * @param value {options.data}
 */
function observer(value) {
  if (!value || (typeof value !== 'object')) {
    return
  }

  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

function defineReactive(obj, key, val) {
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      dep.addSub(Dep.target)
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify()
    }
  })
}

class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
    new Watcher()
    console.log('<div>this._data.test</div>视图绑定 1 次', this._data.test)
    console.log('<div>this._data.test</div>视图绑定 2 次', this._data.test)
    console.log('<div>this._data.test</div>视图绑定 3 次', this._data.test)
    console.log('<div>this._data.test</div>视图绑定 4 次', this._data.test)
    console.log('<div>this._data.test</div>视图绑定 5 次', this._data.test)

    console.log('<div>this._data.AAA</div>视图绑定 1 次', this._data.AAA)
    console.log('<div>this._data.AAA</div>视图绑定 2 次', this._data.AAA)
    console.log('<div>this._data.AAA</div>视图绑定 3 次', this._data.AAA)
  }
}


let vm = new Vue({
  data: {
    test: 'i am a test',
    AAA: 'i am a AAA',
  }
})


vm._data.test = '更新 test'
vm._data.AAA = '更新 AAA'

Dep.target = null
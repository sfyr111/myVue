import Dep from './dep'

export default class Wathcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.cb = cb
    this.expOrFn = expOrFn
    this.newDepIds = new Set()
    this.newDeps = []

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }

    this.value = this.get() // getter
  }

  addDep(dep) {
    const { id } = dep
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      dep.addSub(this)
    }
    console.log(dep.subs)
  }

  update() {
    this.run()
  }

  run() {
    let value = this.get()
    let oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  }

  get() {
    // todo 数据更新后触发 getter -> observer
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  // exp a.b.c
  parseGetter(exp) {
    // /[^A-Za-z0-0_.$]/
    if (/[^\w.$]/.test(exp)) return

    const exps = exp.split('.')

    return obj => {
      if (!obj) return
      exps.forEach((_, index) => obj = obj[exps[index]])
      return obj
    }
  }
}

let uid = 0

export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  depend() {
    Dep.target.addDep(this)
  }

  notify(key) {
    this.subs.forEach(sub => {
      sub.update(key)
    })
  }
}

Dep.target = null
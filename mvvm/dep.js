export default class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
    console.log(this.subs)
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
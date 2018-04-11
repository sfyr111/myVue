import Dep from './dep'

export default class Wathcher {
  constructor() {
    Dep.target = this
  }

  update() {
    console.log('wathcher updating!')
  }
}
import Watcher from './watcher'
import Dep from './dep'
import { observer } from './observer'

export default class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
    new Watcher()
    this._init()
  }

  _init() {
    this._compile(this._data)
  }

  _compile(data) {
    console.log(data.testA)
    console.log(data.testA)
    console.log(data.testA)

    console.log(data.testB)
    console.log(data.testB)
  }
}

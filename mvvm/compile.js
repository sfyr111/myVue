import Watcher from './watcher'

export default class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)

    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }

  init() {
    this.compileElement(this.$fragment)
  }

  compileElement(el) {
    let childNodes = el.childNodes

    Array.from(childNodes).forEach(node => {
      const reg = /\{\{(.*)\}\}/ // {{exp}}
      let text = node.textContent

      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextnode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1) // {{exp}} -> exp
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compileElement(node)
      }
    })
  }

  compile(node) {
    let nodeAttrs = node.attributes

    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name
      if (this.isDirective(attrName)) {
        const exp = attr.value
        const dir = attrName.substring(2)
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir)
        } else {
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }

        node.removeAttribute(attrName)
      }
    })
  }

  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp)
  }

  isDirective(attr) {
    return attr.indexOf('v-') === 0
  }

  isEventDirective(dir) {
    return dir.indexOf('on') === 0
  }

  node2Fragment(el) {
    let child
    let fragment = document.createDocumentFragment()

    while (child = el.firstChild) {
      fragment.appendChild(child)
    }

    return fragment
  }

  isElementNode(node) {
    return node.nodeType == 1
  }

  isTextnode(node) {
    return node.nodeType == 3
  }
}

const compileUtil = {
  text(node, vm, exp) {
    this.createWatcher(node, vm, exp, 'text')
  },

  html(node, vm, exp) {
    this.createWatcher(node, vm, exp, 'html')
  },

  model(node, vm, exp) {
    this.createWatcher(node, vm, exp, 'model')

    let val = this._get(vm, exp) // exp: obj.k.k vm: vm._data

    node.addEventListener('input', e => {
      const newValue = e.target.value
      if (val === newValue) return

      this._set(vm, exp, newValue) // exp: obj.k.k vm: vm._data
      val = newValue // 好像没必要？
    })
  },

  class(node, vm, exp) {
    this.createWatcher(node, vm, exp, 'class')
  },

  createWatcher(node, vm, exp, dir) {
    const updateFn = updater[dir + 'Updater']

    // 初次渲染
    updateFn && updateFn(node, this._get(vm, exp))

    // 把渲染逻辑放到 watcher 里
    new Watcher(vm, exp, (value, oldValue) => updateFn && updateFn(node, value, oldValue))
  },

  eventHandler(node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },

  _get(vm, path) {
    let obj = vm // vm._data
    const pathArr = path.split('.')
    pathArr.forEach(k => obj = obj[k])
    return obj
  },

  _set(vm, path, value) {
    let obj = vm // vm._data
    const pathArr = path.split('.') // [obj, k1, k2]
    pathArr.forEach((k, i) => {
      if (i < pathArr.length - 1) {
        obj = obj[k]
      } else {
        obj[k] = value // obj.k1.k2 = value 触发setter
      }
    })
  }
}

const updater = {
  textUpdater(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },

  htmlUpdater(node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  classUpdater(node, value, oldValue) {
    let className = node.className
    className = className.replace(oldValue, '').replace(/\s$/, '')

    let space = className && String(value) ? ' ' : ''

    node.className = className + space + value
  },

  modelUpdater(node, value, oldValue) {
    node.value = typeof value === 'undefined' ? '' : value
  }
}
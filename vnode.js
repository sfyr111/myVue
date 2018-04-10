class VNode {
  constructor(tag, data, children, text, elm) {
    this.tag = tag // 标签名
    this.data = data // props attrs
    this.children = children // 子节点
    this.text = text // 文本 textContext
    this.elm = elm // dom
  }
}

function createEmptyVNode() {
  const node = new VNode()
  node.text = ''
  return node
}

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

function cloneVNode(node) {
  const cloneVnode = new VNode(
    node.tag,
    node.data,
    node.children,
    node.text,
    node.elm
  )
  return cloneVnode
}
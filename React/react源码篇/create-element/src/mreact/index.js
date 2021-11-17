// ！vnode就代表虚拟dom节点
// ！node代表真实dom节点
// 接收type，props，children，返回一个vnode
function createElement (type, props, children) {
  delete props._source
  delete props._self
  return {
    type,
    props
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { 
  createElement 
}

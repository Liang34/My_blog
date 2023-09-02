// 定义 createElement，其中当然是要将我们的虚拟dom转换为dom对象
import Element from './element'

function createElement(type, props, children) {
    return new Element(type, props, children);
}
export {
    createElement
}
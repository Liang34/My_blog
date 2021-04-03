import {
    createElement
} from './virtualDom'
// 描述一个节点一般有三个属性，节点类型，节点属性， 节点孩子
const vDom = createElement('ul', {
    class: 'list',
    style: 'width: 300px;height: 300px;background-color: orange'
}, [
    createElement('li', {
        class: 'item',
        'data-index': 0
    }, [
        createElement('p', {
            class: 'text'
        }, ['第1个列表项'])
    ]),
    createElement('li', {
        class: 'item',
        'data-index': 1
    }, [
        createElement('p', {
            class: 'text'
        }, [
            createElement('span', {
                class: 'title'
            }, ['第2个列表项'])
        ])
    ]),
    createElement('li', {
        class: 'item',
        'data-index': 2
    }, ['第3个列表项'])
]);
console.log(vDom)
// 生成真实DOM
const rDom = render(vDom);
// 将虚拟dom转换为真实dom
function render(vDom) {
    const {
        type,
        props,
        children
    } = vDom;
    // 创建真实节点
    const el = document.createElement(type);
    // 遍历属性
    for (let key in props) {
        // 设置属性 分 input textarea 
        setAttrs(el, key, props[key]);
    }
    // 处理孩子节点
    children.map((c) => {
        // 如果是元素节点
        if (c instanceof Element) {
            // 递归操作
            c = render(c);
        } else {
            // 对于文本节点，直接创建一个新的节点
            c = document.createTextNode(c);
        }
        el.appendChild(c);
    });
    return el
}
// 给节点设置属性
function setAttrs(node, prop, value) {
    switch (prop) {
        case 'value':
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                node.value = value;
            } else {
                node.setAttribute(prop, value);
            }
            break;
        case 'style':
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(prop, value);
            break;
    }
}
console.log(rDom)
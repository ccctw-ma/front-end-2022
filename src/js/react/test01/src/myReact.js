/**
 * @Author: msc
 * @Date: 2022-07-14 21:33:38
 * @LastEditTime: 2022-07-14 22:33:07
 * @LastEditors: msc
 * @Description: 
 */

import React from 'react';


// const element = {
//     type: "h1",
//     props:{
//         title:"foo",
//         children:"Hello"
//     }
// }


// const node = document.createElement(element.type);
// node['title'] = element.props.title;

// const text = document.createTextNode("")
// text["nodeValue"] = element.props.children;

// node.appendChild(text)
// container.appendChild(node);


function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                typeof child === "object"
                    ? child
                    : createTextElement(child)
            })
        }
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function render(element, container) {
    const dom = element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);
    const isProperty = key => key !== "children"
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = element.props[name]
        })
    element.props.children.forEach(child => {
        render(child, dom)
    })
    container.appendChild(dom);
}

const Flamingo = {
    createElement,
}

/** @jsx Flamigo.createElement */

const element = (
    <div id="foo">
        <a>bar</a>
        <br />
    </div>
)
console.log(element);

const container = document.getElementById('root');
console.log(container);
Flamingo.render(element, container);

export default container;
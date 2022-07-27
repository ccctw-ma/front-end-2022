/**
 * @Author: msc
 * @Date: 2022-07-21 23:47:40
 * @LastEditTime: 2022-07-26 01:26:38
 * @LastEditors: msc
 * @Description: 
 */


import _ from "lodash";
import './style.css';
import Icon from "./icon.jpg";
import Data from "./data.xml";
import printMe from "./print";

function component() {
    let element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    // element.classList.add('hello');
    // const myIcon = new Image();
    // myIcon.src = Icon;
    // element.appendChild(myIcon);
    // console.log(Data);

    let btn = document.createElement('button');
    btn.innerHTML = "Click me and check the console";
    btn.onclick = printMe;

    element.appendChild(btn);
    return element;
}

document.body.appendChild(component());

if (module.hot) {
    module.hot.accept('./print.js', function () {
        console.log('Accepting the updated printMe module');
        printMe();
    })
}
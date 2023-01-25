import css from "./css/mpl4v.css"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./App";
import { configure } from 'mobx';

if (process.env.NODE_ENV === 'development')
    configure({
        enforceActions: "always",
        computedRequiresReaction: true,
        reactionRequiresObservable: true,
        observableRequiresReaction: true,
        disableErrorBoundaries: true
    })
else configure({
    isolateGlobalState: true
})

// append player's css
const style = document.createElement('style');
style.textContent = css;
document.head.append(style);

// append material design iconic font
// NOTE it must be added AFTER player's css
// NOTE you can fix it by
// 1. reset with *:not(.zmdi) AND
// 2. add `.mpl4v` prefix to ALL css rules
const fontStyle = document.createElement('link')
fontStyle.rel = "stylesheet"
fontStyle.href = "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css"
document.head.append(fontStyle)

// player will be added to its special container
// since React.render() wipes render target children
const container = document.body.appendChild(document.createElement('div'))
container.classList.add('mpl4v-container')

ReactDOM.render(<App />, container)


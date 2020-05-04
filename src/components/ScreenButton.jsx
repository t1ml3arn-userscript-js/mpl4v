import React from 'react'

export default function ScreenButton(props) {
    const {showScreen, toogleScreen} = props;

    return (
    <i 
        className={`zmdi mpl4v-fullscreen ${showScreen ? "zmdi-unfold-less" : "zmdi-unfold-more"}`} 
        onClick={toogleScreen}
    ></i>
    )    
}
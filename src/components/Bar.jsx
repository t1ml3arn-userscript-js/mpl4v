import React from "react";
import PropTypes from 'prop-types'

export default function Bar(props) {
    const { progress, classes } = props;
    const styles = {
        width: `${progress}%`,
    };
    // what is common for hor and vert bars ?
    /*
    .bar--hor           { width: value; height: value }
    .indicator--hor     { width: calc(); height: value }

    .bar--vert          { width: value; height: value }
    .indicator--vert    { width: value; height: calc() }
    */
    return <div className={`mpl4v-playback-progressbar__bar mpl4v-bar--hor ${classes}`} style={styles}></div>;
}

Bar.defaultProps = {
    classes: ""
}

Bar.propTypes = {
    progress: PropTypes.number.isRequired,
    classes: PropTypes.string
}
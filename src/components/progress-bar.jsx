import PropTypes from "prop-types";
import React from "react"

export const Bar = (props) => {
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
	return (
	<div 
			className={`mpl4v-playback-progressbar__bar mpl4v-bar--hor ${classes || ""}`} 
			style={styles}
	/>
	)
}

Bar.propTypes = {
	progress: PropTypes.number.isRequired,
	classes: PropTypes.string
}

export function Head(props) {
	const { progress, classes } = props
	const headStyle = {
			left: `${ progress }%`
			// Below is a way to contain the head only
			// inside the bar, but I must know head's size.
			// marginLeft: `-${Math.round(progress*0.1)}px`
	}
	return (
			<div style={ headStyle } className={ `${classes}` }></div>
	)
}

Head.propTypes = {
	progress: PropTypes.number.isRequired,
	classes: PropTypes.string.isRequired,
}

const Progress = { Bar, Head }

export default Progress
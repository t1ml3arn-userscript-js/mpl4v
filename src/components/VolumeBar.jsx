import React from 'react'
import Bar from './Bar'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'

export default class Volume extends ProgressBar {
    constructor(props) {
        super(props)
    }

    render() {
        const { volume } = this.props
        const headStyle = {
            left: `${ volume * 100 }%`
        }

        return (
        <div className={ 'mpl4v-volume-panel' }>
            <i className={"zmdi zmdi-minus mpl4v-volume-down"}></i>
            <div 
                className={ 'mpl4v-volume-bar' }
                ref={ this.barEltRef }
                onMouseDown={ this.startSeek }
            >
                <div className="mpl4v-volume-bar__underlay"></div>
                <Bar classes={ 'mpl4v-bar-progress-color' } progress={ volume * 100 }/>
                <div style={ headStyle } className={ "mpl4v-volume-bar__head " }></div>
            </div>
            <i className={"zmdi zmdi-plus mpl4v-volume-up"}></i>
        </div>
        )
    }
}

Volume.propTypes = {
    volume: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}
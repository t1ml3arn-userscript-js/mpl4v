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
    
        return (
        <div className={ 'mpl4v-volume-panel' }>
            <i class="zmdi zmdi-minus mpl4v-volume-down"></i>
            <div 
                className={ 'mpl4v-volume-bar' }
                ref={ this.barEltRef }
                onMouseDown={ this.startSeek }
            >
                <Bar classes={ 'mpl4v-bar-progress-color' } progress={ volume * 100 }/>
            </div>
            <i class="zmdi zmdi-plus mpl4v-volume-up"></i>
        </div>
        )
    }
}

Volume.propTypes = {
    volume: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}
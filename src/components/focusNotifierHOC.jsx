import React from 'react';
import PropTypes from 'prop-types';

export function focusNotifier(Target) {

    function FocusNotifier(props) {
        const { focusIn, focusOut, ...passedProps } = props;

        return (
        <div 
            className="mpl4v-wrap" 
            onMouseOut={focusOut} 
            onMouseOver={focusIn}
            // TODO more events to handle real focus ?
        >
            <Target {...passedProps} />
        </div>
        )
    }

    FocusNotifier.propTypes = {
        focusIn: PropTypes.func.isRequired,
        focusOut: PropTypes.func.isRequired,
    }
    
    return FocusNotifier
}

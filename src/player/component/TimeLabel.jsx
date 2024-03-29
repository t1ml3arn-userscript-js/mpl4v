import React from "react"
import {formatTime} from "../../utils/utils";

function TimeLabel({ time, duration }) {
    // time need to be presented in format 00:00:00
    return <span className={ "mpl4v-duration mpl4v-drag-initiator" }>{ formatTime(time) } / { formatTime(duration) }</span>
}

export default React.memo(TimeLabel);
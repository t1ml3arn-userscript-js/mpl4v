import React from "react"
import {formatTime} from "../utils/time";

export default function TimeLabel({ time }) {
    // time need to be presented in format 00:00:00
    return <span>{formatTime(time)}</span>;
}
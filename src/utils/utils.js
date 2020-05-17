import PropTypes from "prop-types";

/**
 * Returns time in format "h:mm:ss" 
 * based on given `time` argument.
 * If there is no hours data, they will be omit.
 * @param {number} time Time in seconds
 */
export function formatTime(time) {
    // time is NaN
    if (isNaN(time)) {
        return '00:00'
    // or time is not finite
    } else if (!isFinite(time)) {
        return '00:00'
    } else {
        // NOTE: part "|0" truncates float to integer
        const tt = Math.round(time);
        const hours = (tt / 3600) | 0;
        const minutes = ((tt % 3600) / 60) | 0; // 3721
        const seconds = tt % 60;

        // dont write hourse if there are no them
        const hh = hours > 0 ? `${hours}:` : '';
        const mm = minutes > 9 ? `${minutes}` : `0${minutes}`;
        const ss = seconds > 9 ? `${seconds}` : `0${seconds}`;

        return `${hh}${mm}:${ss}`
    }
}

export const toogleKey = key => state => {
    return {[key]: !state[key]}
}

/**
 * Bound given value into a given range.
 * If the value is not in the range,
 * it will return the minimum or the maximum.
 * @param {number} value value to bound
 * @param {number} min minimal value
 * @param {number} max maximal value
 */
export function bound(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

/**
 * Returns `next` if `target` does not belong
 * [current, next] range, otherwise returns `target` value.
 * @param {number} current Current value
 * @param {number} next Next value
 * @param {number} target Value to which to magnet
 */
export function magnetValue(current, next, target) {
    if (
        target > current && next > target
        || target < current && next < target
    ) {
        return target
    } else
        return next
}

export const RefType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
])
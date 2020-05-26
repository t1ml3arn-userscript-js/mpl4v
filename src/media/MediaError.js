
/**
 * Returns readable message from given error object
 * @param {MediaError} err MediaError object
 */
export default class MediaError {
    static getMessage(err) {
        switch (err.code) {
            case 1:     return "Aborted by user"
            case 2:     return "Network error"
            case 3:     return "Cannot decode"    
            case 4:     return "Source is not suitable"
            default:    return `Unknown error code "${err.code}"`
        }
    }
}
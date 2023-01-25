/** This crunch triggers download of given url */
export default function downloadCrunch(url, fileName) {
    const a = document.body.appendChild(document.createElement('a'))
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    a.click()
    a.remove()
}
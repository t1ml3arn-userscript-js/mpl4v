export default function downloadCrunch(url, saveAs) {
    const a = document.body.appendChild(document.createElement('a'))
    a.href = url
    a.download = saveAs
    a.style.display = 'none'
    a.click()
    a.remove()
}
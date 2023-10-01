const boxError = document.querySelector('#errorBox')
const boxLoading = document.querySelector('#loadingBox')
const boxInfo = document.querySelector('#infoBox')


export function notifyError(message){
    boxError.innerHTML = `<span>${message}</span>`
    boxError.style.display = 'block'

    setTimeout(() => {
        boxError.style.display = 'none'
    },3000)
}
export function notifyLoading(message){
    boxLoading.innerHTML = `<span>${message}</span>`
    boxLoading.style.display = 'block'

    setTimeout(() => {
        boxLoading.style.display = 'none'
    },3000)
}
export function notifyInfo(message){
    boxInfo.innerHTML = `<span>${message}</span>`
    boxInfo.style.display = 'block'

    setTimeout(() => {
        boxInfo.style.display = 'none'
    },3000)
}

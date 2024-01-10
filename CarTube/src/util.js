import page from '../node_modules/page/page.mjs'

import {notifyLoading} from "./views/notification.js";
export function setUserData(data){
    sessionStorage.setItem('auth',JSON.stringify(data))
}
export function getUserData(){
    const auth = sessionStorage.getItem('auth')

    if (auth !== null) {
        return JSON.parse(auth)
    }else{
        return null
    }
}
export function setExpireDate(expDate){
    sessionStorage.setItem('fb-token-exp', expDate.toString())
}
export function getUserId(){
    const auth = sessionStorage.getItem('auth')
    if (auth !== null) {
        return JSON.parse(auth).localId
    }else{
        return null
    }
}
export function clearUserData(){
    sessionStorage.removeItem('auth')
    sessionStorage.removeItem('fb-token-exp')
}
export function sessionFailed(){
    const expDate = new Date(sessionStorage.getItem('fb-token-exp'))
    if (new Date() > expDate){
        document.querySelector('#profile').style.display = 'none'
        document.querySelector('#guest').style.display = 'flex'
        clearUserData()
        notifyLoading('Session failed.Login again!')
        page.redirect('/')

    }else{
        return null
    }
}
export function objectToArray(data){
    if (data === null){
        return []
    }else{
        return Object.entries(data).map(([k,v]) => Object.assign({_id: k},v))
    }

}
export function objectProfileToArray(data){
    if (data === null){
        return []
    }else{
        return Object.entries(data).map(([k,v]) => Object.assign({_id: k},v))
            .filter(r => r._ownerId === getUserId())
    }
}
export function objectSearchToArray(data){
    if (data === null){
        return []
    }else{
        return Object.entries(data).map(([k,v]) => Object.assign({_id: k},v))
    }
}
export function objectCountToArray(data){
    if (data === null){
        return []
    }else{
        return Object.keys(data)
    }
}



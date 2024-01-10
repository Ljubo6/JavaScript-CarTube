import page from '../node_modules/page/page.mjs'
import {notifyError} from "./views/notification.js";
import {getUserData} from "./util.js";
export function validURL(ctx,next){
    const path = ctx.pathname
    if (path) {
        notifyError('Wrong URL')
        page.redirect('/')

    } else {
        next()
    }
}
export function isUser(ctx, next) {
    const user = getUserData()
    if (user) {
        next()
    } else {
        notifyError('Login or register please!')
        page.redirect('/login')
    }
}
export function isGuest(ctx, next) {
    const user = getUserData()
    if (!user) {
        next()
    } else {
        notifyError('You are already registered and logged in')
        page.redirect('/')
    }
}
import {render} from '../node_modules/lit-html/lit-html.js'
import page from '../node_modules/page/page.mjs'
import '../style/styles.css'


import {notifyLoading} from "./views/notification.js";
import { logout as apiLogout} from './api.js'
import {getUserData, getUserId,sessionFailed} from "./util.js";
import {homePage} from "./views/home.js";
import {loginPage, registerPage} from "./views/auth.js";
import {createPage} from "./views/create.js";
import {catalogPage} from "./views/catalog.js";
import {detailsPage} from "./views/details.js";
import {editPage} from "./views/edit.js";
import {profilePage} from "./views/profile.js";
import {searchPage} from "./views/search.js";
import {isGuest, isUser, validURL} from "./guards.js";


const main = document.querySelector('#site-content')
document.querySelector('#logoutBtn').addEventListener('click',logout)
setUserNav()

page('/',decorateContext,homePage)
page('/login',decorateContext,isGuest,loginPage)
page('/register',decorateContext,isGuest,registerPage)
page('/create',decorateContext,isUser,createPage)
page('/all-listings',decorateContext,catalogPage)
page('/details/:id',decorateContext,detailsPage)
page('/edit/:id',decorateContext,isUser,editPage)
page('/profile',decorateContext,isUser,profilePage)
page('/search',decorateContext,searchPage)
page('*',validURL)

page.start()

function decorateContext(ctx,next){
    ctx.render = (content) => render(content,main)
    ctx.setUserNav = setUserNav
    ctx.user = getUserData()
    ctx.userId = getUserId()
    next()
}
function setUserNav(){
    const user =  getUserData()
    if (user){
        document.querySelector('#profile').style.display = 'block'
        document.querySelector('#guest').style.display = 'none'
        document.querySelector('#user-greeting').textContent = `Welcome ${user.email}`
    }else{
        document.querySelector('#profile').style.display = 'none'
        document.querySelector('#guest').style.display = 'block'
    }
}
function logout(){
    apiLogout()
    setUserNav()
    notifyLoading('Logout success')
    page.redirect('/')
}



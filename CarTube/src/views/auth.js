import {html} from '../../node_modules/lit-html/lit-html.js'
import {login,register} from "../api.js";
import {notifyError,notifyLoading,notifyInfo} from "./notification.js";
const loginTemplate = (onSubmit) => html`
    <!-- Login Page -->
    <div class="row">
        <form @submit="${onSubmit}">
            <h1 class="">Login</h1>
            <p>Please enter your credentials.</p>
            <hr>
            <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control form-control-lg" id="email" placeholder="name@example.com" name="email">
            </div>
            <div class="col-md-6 mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control form-control-lg" id="password" placeholder="********" name="password">
            </div>
            <input type="submit" class="btn btn-success" value="Login">
        </form>
        <div class="signin">
            <p>Dont have an account?
                <a href="/register">Sign up</a>.
            </p>
        </div>
    </div>
`
export function loginPage(ctx){
    ctx.render(loginTemplate(onSubmit))
    function onSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)
        const email = formData.get('email').trim()
        const password = formData.get('password').trim()
        try{
            if (!email || !password){
                throw new Error('All fields are required')
            }

            login(email,password).then(() => {
                event.target.reset()
                ctx.setUserNav()
                notifyLoading('Login success')
                ctx.page.redirect('/')
            }).catch((error) => {
                console.error('login error:',error)
                notifyError('Email or password is not correct')

            })
        }catch (error) {
            notifyError(error.message)
        }
    }
}

const registerTemplate = (onSubmit) => html`
    <!-- Register Page -->
    <div class="row">
        <form @submit="${onSubmit}">
            <h1>Register</h1>
            <p>Please enter your credentials.</p>
            <hr>
            <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="text" class="form-control form-control-lg" id="email" placeholder="name@example.com" name="email">
            </div>
            <div class="col-md-6 mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control form-control-lg" id="password" placeholder="********" name="password">
            </div>
            <div class="col-md-6 mb-3">
                <label for="repeatPassword" class="form-label">Repeat Password</label>
                <input type="password" class="form-control form-control-lg" id="repeatPassword" placeholder="********" name="repeatPass">
            </div>
            <input type="submit" class="btn btn-success" value="Register">
        </form>
        <div class="signin">
            <p>Already have an account?
                <a href="/login">Sign in</a>.
            </p>
        </div>
    </div>
`
export function registerPage(ctx){
    ctx.render(registerTemplate(onSubmit))
    function onSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)
        const email = formData.get('email').trim()
        const password = formData.get('password').trim()
        const repeatPass = formData.get('repeatPass').trim()
        try{
            if (!email || !password || !repeatPass){
                throw new Error('All fields are required!')
            }
            if(password !== repeatPass){
                throw new Error('Password don\'t match')
            }
            register(email,password).then(() => {
                event.target.reset()
                ctx.setUserNav()
                notifyLoading('Register success')
                ctx.page.redirect('/')
            }).catch((error) => {
                console.error('Registration error:',error)
                notifyError('User with this email already exist')
            })
        }catch (error) {
            notifyError(error.message)
        }
    }
}
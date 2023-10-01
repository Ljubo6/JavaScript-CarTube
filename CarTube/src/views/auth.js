import {html} from '../../node_modules/lit-html/lit-html.js'
import {login,register} from "../api.js";
import {notifyError,notifyLoading,notifyInfo} from "./notification.js";

const loginTemplate = (onSubmit) => html`
    <!-- Login Page -->
    <section id="login">
        <div class="container">
            <form @submit="${onSubmit}" id="login-form">
                <h1>Login</h1>
                <p>Please enter your credentials.</p>
                <hr>

                <p>Email</p>
                <input placeholder="Enter Email" name="email" type="email">

                <p>Password</p>
                <input type="password" placeholder="Enter Password" name="password">
                <input type="submit" class="registerbtn" value="Login">
            </form>
            <div class="signin">
                <p>Dont have an account?
                    <a href="/register">Sign up</a>.
                </p>
            </div>
        </div>
    </section>
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
    <section id="register">
        <div class="container">
            <form @submit="${onSubmit}" id="register-form">
                <h1>Register</h1>
                <p>Please fill in this form to create an account.</p>
                <hr>

                <p>Email</p>
                <input type="email" placeholder="Enter Email" name="email">

                <p>Password</p>
                <input type="password" placeholder="Enter Password" name="password">

                <p>Repeat Password</p>
                <input type="password" placeholder="Repeat Password" name="repeatPass">
                <hr>

                <input type="submit" class="registerbtn" value="Register">
            </form>
            <div class="signin">
                <p>Already have an account?
                    <a href="/login">Sign in</a>.
                </p>
            </div>
        </div>
    </section>
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
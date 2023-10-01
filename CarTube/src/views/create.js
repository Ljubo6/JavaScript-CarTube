import {html} from '../../node_modules/lit-html/lit-html.js'
import {createCar} from "../api.js";
import {notifyError, notifyInfo} from "./notification.js";
import {sessionFailed} from "../util.js";
const createTemplate = (onSubmit) => html`
    <!-- Create Listing Page -->
    <section id="create-listing">
        <div class="container">
            <form @submit="${onSubmit}" id="create-form">
                <h1>Create Car Listing</h1>
                <p>Please fill in this form to create an listing.</p>
                <hr>

                <p>Car Brand</p>
                <input type="text" placeholder="Enter Car Brand" name="brand">

                <p>Car Model</p>
                <input type="text" placeholder="Enter Car Model" name="model">

                <p>Description</p>
                <input type="text" placeholder="Enter Description" name="description">

                <p>Car Year</p>
                <input type="text" placeholder="Enter Car Year" name="year">

                <p>Car Image</p>
                <input type="text" placeholder="Enter Car Image" name="imageUrl">

                <p>Car Price</p>
                <input type="text" placeholder="Enter Car Price" name="price">

                <hr>
                <input type="submit" class="registerbtn" value="Create Listing">
            </form>
        </div>
    </section>

`
export function createPage(ctx){
    sessionFailed()
    ctx.render(createTemplate(onSubmit))
    function onSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)
        const car = {
            brand: formData.get('brand').trim(),
            model: formData.get('model').trim(),
            description: formData.get('description').trim(),
            year: Number(formData.get('year').trim()),
            imageUrl: formData.get('imageUrl').trim(),
            price: Number(formData.get('price').trim()),
        }
        try{
            if(Number.isNaN(car.year) || Number.isNaN(car.price)){
                throw new Error('Year and price must be a positive number!')
            }
            if(Object.values(car).some(x => !x)){
                throw new Error('All fields are required!')
            }

            createCar(car).then(() => {
                event.target.reset()
                notifyInfo('Creation successful')
                ctx.page.redirect('/')
            }).catch((error) => {
                console.error('Creation error',error)
                notifyError('Creation failed.Please try again')
            })
        }catch (error) {
            notifyError(error.message)
        }



    }
}
import {html} from '../../node_modules/lit-html/lit-html.js'
import {editCar, getById} from "../api.js";
import {notifyInfo} from "./notification.js";
import {sessionFailed} from "../util.js";

const editTemplate = (car,onSubmit) => html`
    <!-- Edit Listing Page -->
    <section id="edit-listing">
        <div class="container">

            <form @submit=${onSubmit} id="edit-form">
                <h1>Edit Car Listing</h1>
                <p>Please fill in this form to edit an listing.</p>
                <hr>

                <p>Car Brand</p>
                <input type="text" placeholder="Enter Car Brand" name="brand" .value=${car.brand}>

                <p>Car Model</p>
                <input type="text" placeholder="Enter Car Model" name="model" .value=${car.model}>

                <p>Description</p>
                <input type="text" placeholder="Enter Description" name="description" .value=${car.description}>

                <p>Car Year</p>
                <input type="text" placeholder="Enter Car Year" name="year" .value=${car.year}>

                <p>Car Image</p>
                <input type="text" placeholder="Enter Car Image" name="imageUrl" .value=${car.imageUrl}>

                <p>Car Price</p>
                <input type="text" placeholder="Enter Car Price" name="price" .value=${car.price}>

                <hr>
                <input type="submit" class="registerbtn" value="Edit Listing">
            </form>
        </div>
    </section>
`

export function editPage(ctx){

    const carId = ctx.params.id
    getById(carId).then((car) => {
        sessionFailed()
        ctx.render(editTemplate(car,onSubmit))

        function onSubmit(event){
            event.preventDefault()
            const formData = new FormData(event.target)
            const editedCar = {
                brand: formData.get('brand').trim(),
                model: formData.get('model').trim(),
                description: formData.get('description').trim(),
                year: Number(formData.get('year').trim()),
                imageUrl: formData.get('imageUrl').trim(),
                price: Number(formData.get('price').trim())
            }
            try{
                if(Number.isNaN(editedCar.year) || Number.isNaN(editedCar.price)){
                    throw new Error('Year and price must be a positive number!')
                }
                if(Object.values(editedCar).some(x => !x)){
                    throw new Error('All fields are required!')
                }

                editCar(carId,editedCar).then(() => {
                    event.target.reset()
                    notifyInfo('Edit successful')
                    ctx.page.redirect(`/details/${carId}`)
                }).catch((error) => {
                    console.error('Edit error',error)
                    notifyInfo('Edition failed.Try again')
                    ctx.page.redirect(`/`)
                })
            }catch (error) {
                notifyInfo(error.message)
            }

        }
    })
}
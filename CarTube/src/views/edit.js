import {html} from '../../node_modules/lit-html/lit-html.js'
import {editCar, getById} from "../api.js";
import {notifyInfo} from "./notification.js";
import {sessionFailed} from "../util.js";

const editTemplate = (car,onSubmit) => html`
    <!-- Edit Listing Page -->
    <div class="row">
        <form @submit=${onSubmit}>
            <h1>Edit Car Listing</h1>
            <p>Please fill in this form to create an listing.</p>
            <hr>

            <div class="col-md-6 mb-3">
                <label for="brand" class="form-label">Car Brand</label>
                <input type="text" class="form-control form-control-lg" id="brand" name="brand" placeholder="Enter Car Brand" .value=${car.brand}>
            </div>
            <div class="col-md-6 mb-3">
                <label for="model" class="form-label">Car Model</label>
                <input type="text" class="form-control form-control-lg" id="model" name="model" placeholder="Enter Car Model" .value=${car.model}>
            </div>
            <div class="col-md-6 mb-3">
                <label for="description" class="form-label">Car Description</label>
                <input type="text" class="form-control form-control-lg" id="description" name="description" placeholder="Enter Car Description" .value=${car.description}>
            </div>
            <div class="col-md-6 mb-3">
                <label for="year" class="form-label">Car Year</label>
                <input type="text" class="form-control form-control-lg" id="year" name="year" placeholder="Enter Car Year" .value=${car.year}>
            </div>
            <div class="col-md-6 mb-3">
                <label for="imageUrl" class="form-label">Car ImageUrl</label>
                <input type="text" class="form-control form-control-lg" id="imageUrl" name="imageUrl" placeholder="Enter Car ImageUrl" .value=${car.imageUrl}>
            </div>
            <div class="col-md-6 mb-3">
                <label for="price" class="form-label">Car Price</label>
                <input type="text" class="form-control form-control-lg" id="price" name="price" placeholder="Enter Car Price" .value=${car.price}>
            </div>

            <hr>
            <input type="submit" class="btn btn-success" value="Edit Listing">
        </form>
    </div>
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
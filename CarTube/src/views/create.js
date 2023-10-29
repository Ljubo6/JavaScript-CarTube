import {html} from '../../node_modules/lit-html/lit-html.js'
import {createCar} from "../api.js";
import {notifyError, notifyInfo} from "./notification.js";
import {sessionFailed} from "../util.js";
const createTemplate = (onSubmit) => html`
    <!-- Create Listing Page -->
    <div class="row">
        <form @submit="${onSubmit}">
            <h1>Create Car Listing</h1>
            <p>Please fill in this form to create an listing.</p>
            <hr>
            <div class="col-md-6 mb-3">
                <label for="brand" class="form-label">Car Brand</label>
                <input type="text" class="form-control form-control-lg" id="brand" name="brand" placeholder="Enter Car Brand">
            </div>
            <div class="col-md-6 mb-3">
                <label for="model" class="form-label">Car Model</label>
                <input type="text" class="form-control form-control-lg" id="model" name="model" placeholder="Enter Car Model">
            </div>
            <div class="col-md-6 mb-3">
                <label for="description" class="form-label">Car Description</label>
                <input type="text" class="form-control form-control-lg" id="description" name="description" placeholder="Enter Car Description">
            </div>
            <div class="col-md-6 mb-3">
                <label for="year" class="form-label">Car Year</label>
                <input type="text" class="form-control form-control-lg" id="year" name="year" placeholder="Enter Car Year">
            </div>
            <div class="col-md-6 mb-3">
                <label for="imageUrl" class="form-label">Car ImageUrl</label>
                <input type="text" class="form-control form-control-lg" id="imageUrl" name="imageUrl" placeholder="Enter Car ImageUrl">
            </div>
            <div class="col-md-6 mb-3">
                <label for="price" class="form-label">Car Price</label>
                <input type="text" class="form-control form-control-lg" id="price" name="price" placeholder="Enter Car Price">
            </div>
            <hr>
            <input type="submit" class="btn btn-success" value="Create Listing">
        </form>
    </div>

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
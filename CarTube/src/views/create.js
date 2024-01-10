import {html} from '../../node_modules/lit-html/lit-html.js'
import {upload} from "../upload.js";
import {createCar} from "../api.js";
import {notifyError, notifyInfo} from "./notification.js";
import {sessionFailed} from "../util.js";

import {ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import {storage} from '../api.js'
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
                <input type="text" class="form-control form-control-lg" id="imageUrl" name="imageUrl" readonly  placeholder="Enter Car ImageUrl">
            </div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="loadImageButton">
                Load image
            </button>
            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <input type="file" id="file">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="price" class="form-label">Car Price</label>
                <input type="text" class="form-control form-control-lg" id="price" name="price" placeholder="Enter Car Price">
            </div>
            <hr>
            <button type="submit" class="btn btn-success">Create Listing</button>
        </form>
    </div>

`
export function createPage(ctx){
    sessionFailed()

    ctx.render(createTemplate(onSubmit))
    const loadImageButton = document.getElementById('loadImageButton');
    if (loadImageButton) {
        loadImageButton.addEventListener('click', (event) => {
            event.preventDefault();
        });
    }

    upload('#file',{
        multi:false,
        accept:['.png','.jpg','.jpeg','.gif'],
        onUpload(files,blocks){
            files.forEach((file,index) => {
                const storageRef = ref(storage,`images/${file.name}`)
                const uploadTask = uploadBytesResumable(storageRef, file)
                uploadTask.on('state_changed',snapshot => {
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                    const block = blocks[index].querySelector('.preview-info-progress')
                    block.textContent = percentage
                    block.style.width = percentage

                },error => {
                    console.log(error)
                },() => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        const img = document.getElementById('imageUrl')
                        img.value = downloadURL

                        console.log(img)
                    });
                })
            })
        }
    })
    function onSubmit(event){
        sessionFailed()
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

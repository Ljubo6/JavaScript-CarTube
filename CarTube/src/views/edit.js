import {html} from '../../node_modules/lit-html/lit-html.js'
import {upload} from "../upload.js";
import {editCar, getById, storage} from "../api.js";
import {notifyInfo} from "./notification.js";
import {sessionFailed} from "../util.js";

import {ref,uploadBytesResumable,getDownloadURL,deleteObject } from "firebase/storage"


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
                <input type="text" class="form-control form-control-lg" id="imageUrl" name="imageUrl" placeholder="Enter Car ImageUrl" readonly .value=${car.imageUrl}>
            </div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="editImage">
                Edit image
            </button>
            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-show="false">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <input type="file" id="retriveFile">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="modalBody">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="price" class="form-label">Car Price</label>
                <input type="text" class="form-control form-control-lg" id="price" name="price" placeholder="Enter Car Price" .value=${car.price}>
            </div>

            <hr>
            <button type="submit" class="btn btn-success">Edit Listing</button>
        </form>
    </div>
`
export function editPage(ctx){

    const carId = ctx.params.id
    getById(carId).then((car) => {

        sessionFailed()

        ctx.render(editTemplate(car,onSubmit))



        upload('#retriveFile',{
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
                    const oldImageUrl = car.imageUrl;
                    if (oldImageUrl) {
                        const oldImageRef = ref(storage, `${getImageNameFromUrl(oldImageUrl)}`);
                        deleteObject(oldImageRef).then(() => {
                            console.log('Old image deleted successfully');
                        }).catch((error) => {
                            console.error('Error deleting old image', error);
                        });
                    }

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

function getImageNameFromUrl(url) {
    const urlObject = new URL(url);
    const pathName = urlObject.pathname;
    const pathParts = pathName.split('/');
    const fileNameWithEncoding = pathParts[pathParts.length - 1];
    const fileName = decodeURIComponent(fileNameWithEncoding);

    return fileName;
}
import {html} from '../../node_modules/lit-html/lit-html.js'
import {addLike, deleteById, getById, storage} from "../api.js";
import {getUserData, getUserId,sessionFailed} from "../util.js";
import {deleteObject, ref} from "firebase/storage";
const detailsTemplate = (car,isOwner,onDelete,likes,userLike,isUser,onLike) => html`
    <!-- Listing Details Page -->
    <div class="row">
        <h1>Details</h1>
        <div class="d-flex justify-content-center align-items-center">
            <div class="col-md-8">
                <div class="card h-100">
                    <img src=${car.imageUrl} class="card-img-top" alt="car-image">
                    <div class="card-body">
                        <div class="d-flex justify-content-start flex-column align-items-start">
                            <h3 class="card-text">Brand: ${car.brand}</h3>
                            <h3 class="card-text">Model: ${car.model}</h3>
                            <h3 class="card-text">Year: ${car.year}</h3>
                            <h3 class="card-text">Price $: ${car.price}</h3>
                        </div>
                        <p class="card-text text-start">${car.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="justify-content-center mb-5">
                            ${isOwner ? html`
                    <a href="/edit/${car._id}" class="btn btn-primary">Edit</a>
                    <a @click="${onDelete}" href="javascript:void(0)" class="btn btn-danger">Delete</a>
                ` : ''}
                            <span class="btn btn-success">Liked ${likes}</span>
                            ${isUser && !isOwner && !userLike ? html`<a @click=${onLike} href="javascript:void(0)"
                                                            class="btn btn-success">Like</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
export function detailsPage(ctx){
    const carId = ctx.params.id
    let isUser = !!ctx.user
    getById(carId).then((car) => {
        const isOwner = car._ownerId === getUserId()
        const likes = car.likes
        const arr = car.likesArray
        const url = car.imageUrl
        let email = ''
        let newArr = []
        let userLike = false
        if(isUser){
            userLike = !!car.likesArray.includes(getUserData().email)
            email = getUserData().email
        }
        ctx.render(detailsTemplate(car,isOwner,onDelete,likes,userLike,isUser,onLike))
        function onDelete(){
            const confirmed = confirm('Are you sure')
            if (confirmed){
                sessionFailed()
                deleteById(carId).then(() => {
                    const imageRef = ref(storage, `${getImageNameFromUrl(url)}`);
                    deleteObject(imageRef).then(() => {
                        console.log('Image deleted successfully');
                    }).catch((error) => {
                        console.error('Error deleting old image', error);
                    });
                    ctx.page.redirect('/all-listings')
                })
            }
        }
        function onLike(){
            arr.push(email)
            newArr = arr.slice()
            addLike(carId,{likes: likes + 1,likesArray: newArr  }).then(() => {
                ctx.page.redirect(`/details/${carId}`)
            }).catch((error) => {
                console.error('Like error',error)
                return alert('Liking failed.Please try again')
            })
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
import {html} from '../../node_modules/lit-html/lit-html.js'
import {addLike, deleteById, getById} from "../api.js";
import {getUserData, getUserId,sessionFailed} from "../util.js";

const detailsTemplate = (car,isOwner,onDelete,likes,userLike,isUser,onLike) => html`
    <!-- Listing Details Page -->
    <section id="listing-details">
        <h1>Details</h1>
        <div class="details-info">
            <img src=${car.imageUrl}>
            <hr>
            <ul class="listing-props">
                <li><span>Brand:</span>${car.brand}</li>
                <li><span>Model:</span>${car.model}</li>
                <li><span>Year:</span>${car.year}</li>
                <li><span>Price:</span>${car.price}</li>
            </ul>

            <p class="description-para">${car.description}</p>
            <div class="d-flex justify-content-center mb-5">
                ${isOwner ? html`
                    <a href="/edit/${car._id}" class="button-list">Edit</a>
                    <a @click="${onDelete}" href="javascript:void(0)" class="button-list">Delete</a>
                ` : ''}
                <span class="button-likes">Liked ${likes}</span>
                ${isUser && !isOwner && !userLike ? html`<a @click=${onLike} href="javascript:void(0)"
                                                            class="button-like">Like</a>` : ''}
            </div>
        </div>
    </section>
`
export function detailsPage(ctx){
    const carId = ctx.params.id
    let isUser = !!ctx.user
    getById(carId).then((car) => {
        const isOwner = car._ownerId === getUserId()
        const likes = car.likes
        const arr = car.likesArray
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
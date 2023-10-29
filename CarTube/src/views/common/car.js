import {html} from '../../../node_modules/lit-html/lit-html.js'
export const carTemplate = (car) => html`
    <div class="col">
        <div class="card h-100">
            <img src=${car.imageUrl} class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${car.brand} ${car.model}</h5>
                <p class="card-text">Year: ${car.year}</p>
                <p class="card-text">Price: ${car.price} $</p>
            </div>
            <div class="card-footer">
                <a href="/details/${car._id}" class="btn btn-success">Details</a>
            </div>
        </div>
    </div>
`
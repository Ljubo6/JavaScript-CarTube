import {html} from '../../node_modules/lit-html/lit-html.js'
import {getAll, getCollectionSize} from "../api.js";
import {carTemplate} from "./common/car.js";
import {objectCountToArray} from "../util.js";


const catalogTemplate = (cars,page,pages,key) => html`
    <!-- All Listings Page -->
    <section id="car-listings">
        <h1>Car Listings</h1>
        <div class="listings">
            <div>Page ${page} / ${pages}
                ${page > 1 ? html`<a class="button-list" href="/all-listings?page=${page - 1}=${key}">&lt; Prev</a>` : ''}
                ${page < pages ? html`<a class="button-list" href="/all-listings?page=${page + 1}=${key}">Next &gt;</a>` : ''}
            </div>
            ${cars.length === 0 ? html`<p class="no-cars">No cars in database.</p>` : cars.map(carTemplate)}
            
            
        </div>
    </section>
`

export function catalogPage(ctx){


    getCollectionSize().then(keys => {
        const page = Number(ctx.querystring.split('=')[1]) || 1;
        const arrKeys = objectCountToArray(keys)
        let count = objectCountToArray(keys).length
        const pages = Math.ceil(count / 3);
        let index = (page - 1) * 3
        let key = arrKeys[index]
        getAll(arrKeys[index]).then((cars) => {
            ctx.render(catalogTemplate(cars,page,pages,key))
        })
    })


}
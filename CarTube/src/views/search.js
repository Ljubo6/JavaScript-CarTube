import {html} from '../../node_modules/lit-html/lit-html.js'
import {carTemplate} from "./common/car.js";
import {search} from "../api.js";

const searchTemplate = (cars,onSearch,year) => html`
    <div class="row d-flex justify-content-center">
        <h1 class="mb-5">Filter by year</h1>
        <div class="mb-3 col-6">
            <input type="text" class="form-control form-control-lg mb-3" id="search-input"  name="search" placeholder="Enter desired production year" .value=${year || ''}>
        </div>
        <div class="mb-3">
            <button @click=${onSearch} class="btn btn-success w-auto">Search</button>
        </div>
        <h2 class="mb-3">Results:</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 d-flex justify-content-center">
            ${cars.length === 0 ? html`<p class="no-cars">No results.</p>` : cars.map(carTemplate)}
        </div>
    </div>
`
export function searchPage(ctx){
    const year = Number(ctx.querystring.split('=')[1]);
    let cars = []
    if (Number.isNaN(year) === false) {
        search(year)
            .then((cars) => {
                ctx.render(searchTemplate(cars, onSearch, year));
            })
            .catch((error) => {
                console.error("Error by search: ", error);
            });
    }
    ctx.render(searchTemplate(cars, onSearch, year));
    function onSearch(){
        const query = Number(document.getElementById('search-input').value);

        if (Number.isNaN(query) === false) {
            ctx.page.redirect('/search?query=' + query);
        }else{
            alert('Year must be a positive number');
        }
    }
}
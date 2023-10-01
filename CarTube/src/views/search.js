import {html} from '../../node_modules/lit-html/lit-html.js'
import {carTemplate} from "./common/car.js";
import {search} from "../api.js";

const searchTemplate = (cars,onSearch,year) => html`
<section id="search-cars">
    <h1>Filter by year</h1>

    <div class="container">
        <input id="search-input" type="text" name="search" placeholder="Enter desired production year" .value=${year || ''}>
        <button @click=${onSearch} class="button-list">Search</button>
    </div>

    <h2>Results:</h2>
    <div class="listings">

        ${cars.length === 0 ? html`<p class="no-cars"> No results.</p>` : cars.map(carTemplate)}

        
    </div>
</section>
`;
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
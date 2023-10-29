import {html} from '../../node_modules/lit-html/lit-html.js'
import carImage from '/images/car-png.webp';
const homeTemplate = () => html`
    <!-- Home Page -->
    <div class="row">
        <h1 class="mb-3 mb-md-5 mt-md-3">Welcome To Car Tube</h1>
        <img class="hero mb-3 mb-md-5" src="${carImage}" alt="carIntro">
        <h2 class="mb-3 mb-md-5">To see all the listings, click the link below:</h2>
        <div class="mb-3">
            <a href="/all-listings" class="btn btn-success">Listings</a>
        </div>
    </div>
`
export function homePage(ctx){
    ctx.render(homeTemplate())
}
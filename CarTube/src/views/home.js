import {html} from '../../node_modules/lit-html/lit-html.js'
import carImage from '/images/car-png.webp';

const homeTemplate = () => html`
    <!-- Home Page -->
    <section id="main">
        <div id="welcome-container">
            <h1>Welcome To Car Tube</h1>
            <img class="hero" src="${carImage}" alt="carIntro">
            <h2>To see all the listings click the link below:</h2>
            <div>
                <a href="/all-listings" class="button">Listings</a>
            </div>
        </div>
    </section>
`

export function homePage(ctx){
    ctx.render(homeTemplate())
}
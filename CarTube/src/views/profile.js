import {html} from '../../node_modules/lit-html/lit-html.js'
import {getProfile, getProfilePagination} from "../api.js";
import {carTemplate} from "./common/car.js";
import {sessionFailed} from "../util.js";
import {getUserId, objectCountToArray} from "../util.js";


const profileTemplate = (cars) => html`
    <!-- My Listings Page -->
    <h1>My car listings</h1>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 d-flex justify-content-center">
        ${cars.length === 0 ? html`<p class="no-cars">You haven't listed any cars yet.</p>` : cars.map(carTemplate)}
    </div>
`
export function profilePage(ctx){
    sessionFailed()
    const page = Number(ctx.querystring.split('=')[1]) || 1;
    getProfile().then((cars) => {
        const arrKeys = cars.map(c => c._id)
        let count = arrKeys.length
        const pages = Math.ceil(count / 3);
        let index = (page - 1) * 3
        let key = arrKeys[index]
        getProfile(key).then((cars) =>{
            ctx.render(profileTemplate(cars))
        })
    })
}
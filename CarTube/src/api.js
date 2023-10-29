import {
    getUserData,
    getUserId,
    objectToArray,
    setUserData,
    clearUserData,
    objectSearchToArray,
    setExpireDate
} from "./util.js";

import page from '../node_modules/page/page.mjs'
import {notifyError} from "./views/notification.js";

const apikey = 'AIzaSyDh1waIL7GhJQqjOpenoE-rVLWfQFDdoAU';

const databaseUrl = 'https://javascript-cartube-default-rtdb.firebaseio.com/';

const endpoints = {
    LOGIN: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    REGISTER: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    CARS: 'cars',
    CARS_BY_ID: 'cars/'
};

function host(url,page ) {
    let result = databaseUrl + url + '.json';
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}&orderBy="$key"&startAt="${page}"&limitToFirst=4&print=pretty`;
    }else{
        result += `?orderBy="$key"&startAt="${page}"&limitToFirst=4&print=pretty`
    }
    return result;
}
function hostEditDetails(url) {
    let result = databaseUrl + url + '.json';
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}`;
    }
    return result;
}
function hostSearch(url,search) {
    let result = databaseUrl + url + '.json';
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}`;
    }
    if(auth !== null && search !== undefined){
        result += `&orderBy="year"&equalTo=${search}&print=pretty`
    }else{
        result += `?orderBy="year"&equalTo=${search}&print=pretty`
    }
    return result;
}
function hostProfile(url) {
    let result = databaseUrl + url + '.json';
    const auth = getUserData();
    const id = getUserId()
    result += `?auth=${auth.idToken}&orderBy="_ownerId"&equalTo="${id}"&print=pretty`;
    return result
}
function hostProfilePagination(url,page='') {
    let result = databaseUrl + url + '.json';
    const auth = getUserData();
    const id = getUserId()
    result += `?auth=${auth.idToken}&orderBy="$key"&startAt="${page}"&limitToFirst=${3}&print=pretty`;
    return result
}
function countObject(url){
    let result = databaseUrl + url + '.json';
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}&orderBy="$key"`;
    }else{
        result += `?orderBy="$key"`
    }
    return result;
}
function request(url, method, body) {
    let options = {
        method,
    };
    if (body) {
        Object.assign(options, {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.hasOwnProperty('error')) {
                const message = data.error.message;
                throw new Error(message);
            }
            return data;
        });
}
function get(url) {
    return request(url, 'GET');
}
function post(url, body) {
    return request(url, 'POST', body);
}
function del(url) {
    return request(url, 'DELETE');
}
function patch(url, body) {
    return request(url, 'PATCH', body);
}
export function login(email, password) {
    return post(endpoints.LOGIN + apikey, {
        email,
        password,
        returnSecureToken: true
    })
    .then(response => {
        setUserData(response);
        const expDate = new Date(new Date().getTime() + Number(response.expiresIn) * 1000)
        setExpireDate(expDate)
        return response;
    });
}

export function register(email, password) {
    return post(endpoints.REGISTER + apikey, {
        email,
        password,
        returnSecureToken: true
    })
    .then(response => {
        setUserData(response);
        return response;
    });
}
export function logout(){
    clearUserData()
}
export function getAll(page) {
    return get(host(endpoints.CARS,page))
        .then(records => {
            // const sorted = records.sort((a, b) => ...);
            return objectToArray(records);
        });
}
export function getById(id) {
    return get(hostEditDetails(endpoints.CARS_BY_ID + id))
        .then(record => {
            record._id = id;
            return record;
        }).catch((error) => {
            notifyError('ID is not valid')
            page.redirect('/')
        });
}
export function getProfile() {
    return get(hostProfile(endpoints.CARS)).then(records => {
        return objectToArray(records)
    })
}
export function getProfilePagination(page) {
    return get(hostProfile(endpoints.CARS)).then(records => {
        return objectToArray(records)
    })
}

export function createCar(car) {
    const data = Object.assign({
        _ownerId: getUserId(),
        likes:0,
        likesArray:['']
    }, car);
    return post(hostEditDetails(endpoints.CARS), data);
}

export function editCar(id, car) {
    return patch(hostEditDetails(endpoints.CARS_BY_ID + id), car);
}

export function addLike(id, car) {
    return patch(hostEditDetails(endpoints.CARS_BY_ID + id), car);
}
export function deleteById(id) {
    return del(hostEditDetails(endpoints.CARS_BY_ID + id));
}
export function search(year) {
    return get(hostSearch(endpoints.CARS,year))
        .then(records => {
            return objectSearchToArray(records)
        });
}
export function getCollectionSize(){
    return get(countObject(endpoints.CARS))
}



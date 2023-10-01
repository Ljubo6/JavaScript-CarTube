import { getUserData, getUserId, objectToArray, setUserData } from "../util.js";

const apikey = 'AIzaSyDh1waIL7GhJQqjOpenoE-rVLWfQFDdoAU';

const databaseUrl = 'https://javascript-cartube-default-rtdb.firebaseio.com/';

const endpoints = {
    LOGIN: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    REGISTER: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    CARS: 'cars',
    CARS_BY_ID: 'cars/'
};

function host(url){
    let result = databaseUrl + url + '.json'
    const auth = getUserData()
    if(auth !== null){
        result += `?auth=${auth.idToken}`
    }
    return result

}
function request(url,method,body){
    let options = {
        method,
    }
    if (body){
        Object.assign(options, {
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(body)
        })
    }
    return fetch(url,options).then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok')
        }
        return response.json()
    }).then(data => {
        if (data && data.hasOwnProperty('error')){
            const message = data.error.message
            throw new Error(message)
        }
        return data
    })

}
export function get(url){
    return request(url,'GET')
}
export function post(url,body){
    return request(url,'POST',body)
}
export function patch(url,body){
    return request(url,'PATCH',body)
}
export function del(url){
    return request(url,'DELETE')
}
export function login(email,password){
    return post(endpoints.LOGIN + apikey,{
        email,
        password,
        returnSecureToken:true
    }).then(response => {
        setUserData(response)
        return response
    })
}
export function register(email,password){
    return post(endpoints.REGISTER + apikey,{
        email,
        password,
        returnSecureToken:true
    }).then(response => {
        setUserData()
        return response
    })
}
export function getAll(){
    return get(host(endpoints.CARS))
        .then(records => {
            return objectToArray(records)
        })
}
export function getById(id){
    return get(host(endpoints.CARS_BY_ID + id))
        .then(record => {
            record._id = id
            return record
        })
}
export function createCar(car){
    const data = Object.assign({
        _ownerId: getUserId()
    },car)
    return post(host(endpoints.CARS),data)
}
export function editCar(id,car){
    return patch(host(endpoints.CARS_BY_ID + id),car)
}
export function deleteById(id){
    return del(host(endpoints.CARS_BY_ID + id))
}
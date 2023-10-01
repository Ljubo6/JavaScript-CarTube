import page from '../node_modules/page/page.mjs'
import {notifyError} from "./views/notification.js";
import {getUserData} from "./util.js";
export function validURL(ctx,next){
    const path = ctx.pathname; // Вземете пътя от текущия URL адрес
    if (path) {
        notifyError('Wrong URL')
        page.redirect('/'); // При невалиден адрес, пренасочете към началната страница

    } else {
        next(); // Продължете към следващия маршрут (ако пътят е валиден)
    }
}

// Гард защитник за потребители (проверява дали потребителят е влезнал)
export function isUser(ctx, next) {
    const user = getUserData(); // Получаване на потребителските данни
    if (user) {
        // Потребителят е влезнал, продължаваме към следващата страница
        next();
    } else {
        // Потребителят не е влезнал, пренасочваме към страницата за вход
        notifyError('Login or register please!')
        page.redirect('/login');
    }
}

// Гард защитник за гости (проверява дали потребителят не е влезнал)
export function isGuest(ctx, next) {
    const user = getUserData(); // Получаване на потребителските данни
    if (!user) {
        // Потребителят не е влезнал, продължаваме към следващата страница
        next();
    } else {
        // Потребителят е влезнал, пренасочваме към началната страница или друга страница за гости
        notifyError('You are already registered and logged in')
        page.redirect('/');
    }
}
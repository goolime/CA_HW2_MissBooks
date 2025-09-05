export const utilService = {
    loadFromStorage,
    saveToStorage,
    makeId,
    makeLorem,
    getRandomIntInclusive,
    getDayName,
    getMonthName,
    animateCSS,
    getCurrencySign,
    getCurrencys,
    capitalizeFirstLetter
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    const words = ['The sky', 'above', 'the port', 'was', 'the color' ,'of nature', 'tuned', 'to', 'a live channel', 'All', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)]
        if (size >= 1 ) txt += ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

function getDayName(date, locale) {
    date = new Date(date)
    return date.toLocaleDateString(locale, { weekday: 'long' })
}

function getMonthName(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return monthNames[date.getMonth()]
}

function animateCSS(el, animation='bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}

function getCurrencySign(currencyCode) {
    const currencySigns = {
        USD: '$',
        EUR: '€',
        ILS: '₪',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
        NZD: 'NZ$',
        YEN: '¥'
    }
    return currencySigns[currencyCode] || currencyCode;
}

function getCurrencys(){
    return [
        {
            currencyCode: 'USD' ,
            currencySign: '$'
        },
        {
            currencyCode: 'EUR' ,
            currencySign: '€'},
        {
            currencyCode: 'ILS' ,
            currencySign: '₪'},
        {
            currencyCode: 'GBP' ,
            currencySign: '£'},
        {
            currencyCode: 'AUD' ,
            currencySign: 'A$'},
        {
            currencyCode: 'CAD' ,
            currencySign: 'C$'},
        {
            currencyCode: 'NZD' ,
            currencySign: 'NZ$'},
        {
            currencyCode: 'YEN' ,
            currencySign: '¥'}
    ]
}

function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Handle non-string input or empty strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce(func, time = 500) {
    var timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, time);
    }
}
/*
*   Module for utilities and helpers.
*/

import { playBtn, textInput } from './app.js';

//Character mapping
export const characters = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    ñ: 15,
    o: 16,
    p: 17,
    q: 18,
    r: 19,
    s: 20,
    t: 21,
    u: 22,
    v: 23,
    w: 24,
    x: 25,
    y: 26,
    z: 27,
    0: 28,
    1: 29,
    2: 30,
    3: 31,
    4: 32,
    5: 33,
    6: 34,
    7: 35,
    8: 36,
    9: 37,
    '¡': 38,
    '!': 39,
    '¿': 40,
    '?': 41,
    '.': 42,
    ':': 43,
    ',': 44,
    ';': 45,
    '(': 46,
    ')': 47,
    '"': 48,
    "'": 49,
    '`': 50,
    '-': 51,
    _: 52,
    '/': 53,
    '+': 54,
    '%': 55,
    $: 56,
    '#': 57,
    '&': 58,
    '=': 59,
    '{': 60,
    '}': 61,
    '*': 62,
    '^': 63,
    '[': 64,
    ']': 65,
    '<': 66,
    '>': 67,
    ü: 68,
    ç: 69,
    ö: 70,
    á: 71,
    é: 72,
    í: 73,
    ó: 74,
    ú: 75,
    ' ': 76,
    '\n': 77,
};

//Mapping values between min-max
export const mapping = (total, input, max, min) => {
    let mappedValue = (input / total) * (max - min) + min;
    mappedValue = parseFloat(mappedValue).toFixed(2);
    return mappedValue;
};

//Revsere number
export const reverseNumber = (num, max, min) => {
    return (max + min) - num;
}

//Get random value between min-max (min incluido y max excluido)
export const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomValueWithDecimals = (min, max) => {
    let randomNum = Math.random() * (max - min) + min;
    return randomNum.toFixed(2);
};

//Enable/Disable UI Controls
export const setUIControls = action => {
    const controls = document.querySelector('#controls');
    if (action === 'enable') {
        controls.classList.remove('disabled');
    } else if (action === 'disable') {
        controls.classList.add('disabled');
    }
};

export const performanceFinished = counter => {
    playBtn.classList.remove('play');
    if (textInput.value === '') {
        textInput.placeholder = 'Ingrese texto nuevamente';
    }

    setTimeout(() => counter.remove(), 3000);
};

export const createCounter = (number, timeStamp) => {
    let counter = document.createElement('span');
    let counterContainer = document.querySelector('#counters');
    counter.innerText = number;
    counter.id = `counter${timeStamp}`;
    counter.classList.add('counter');
    counterContainer.appendChild(counter);
    return counter;
};

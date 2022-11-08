/*
*   Module for utilities and helpers.
*/

import { playBtn, textInput } from './app.js';

//Character mapping
export const characters = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    ñ: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26,
    0: 27,
    1: 28,
    2: 29,
    3: 30,
    4: 31,
    5: 32,
    6: 33,
    7: 34,
    8: 35,
    9: 36,
    '¡': 37,
    '!': 38,
    '¿': 39,
    '?': 40,
    '.': 41,
    ':': 42,
    ',': 43,
    ';': 44,
    '(': 45,
    ')': 46,
    '"': 47,
    "'": 48,
    '`': 49,
    '-': 50,
    _: 51,
    '/': 52,
    '+': 53,
    '%': 54,
    $: 55,
    '#': 56,
    '&': 57,
    '=': 58,
    '{': 59,
    '}': 60,
    '*': 61,
    '^': 62,
    '[': 63,
    ']': 64,
    '<': 65,
    '>': 66,
    ü: 67,
    ç: 68,
    ö: 69,
    á: 70,
    é: 71,
    í: 72,
    ó: 73,
    ú: 74,
    ' ': 75,
    '\n': 76,
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

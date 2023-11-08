console.log('script connection');

import { animationState } from "./data.js";
import { getItemByKeyCode, getItemByClass } from "./utils.js";

// размеры канваса внутри
const CANVAS_WIDTH = 150;
const CANVAS_HEIGHT = 200;
// получение элементов
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const navigation = document.querySelector('.navigation');
const speed = document.querySelector('.range');
const showSpeed = document.querySelector('.showSpeed');

// картинка спрайт анимации
const image = new Image();
image.src = './assets/data.png';

// высота фрейма ряда откуда берем кадр
const heightFrame = 160; // высота одного кадра 
const widthFrame = 95.2; // ширина одно кадра
let typeAnimation = 1; // тип анимации число от 0 до 4 (по оси y спрайта)
let gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
let stageFrame = 10; // погрешность
let countFrame = 12 // количество кадров анимации в спрайте

// тут мы выбираем ряд с анимациями
navigation.addEventListener('click', e => {
    // нахождение объекта по классу
    const item = getItemByClass({ data: animationState, e });

    if (!item) {
        return;
    }

    countFrame = item.count; // 12
    typeAnimation = item.index * heightFrame; // 0 * 160, 1 * 160, 2 * 160, 3 * 160 по оси Y
});

document.addEventListener('keydown', e => {
    // нахождение объекта по коду клавиатуры
    const item = getItemByKeyCode({ data: animationState, e });

    if (!item) {
        return;
    }

    countFrame = item.count; // 12
    typeAnimation = item.index * heightFrame; // 0 * 160, 1 * 160, 2 * 160, 3 * 160 по оси Y
});


//  тут выбираем скорость анимации
speed.addEventListener('change', e => {
    const value = e.target.value;

    if (typeof Number(value) !== 'number') {
        return;
    }
    showSpeed.textContent = value;
    stageFrame = 51 - value;
});



function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let position = Math.floor(gameFrame / stageFrame) % countFrame;

    ctx.drawImage(image, position * widthFrame, typeAnimation, widthFrame, heightFrame, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
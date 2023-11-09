console.log('script connection');

import { animationState } from "./data.js";
import { getItemByKeyCode, getItemByClass } from "./utils.js";

// размеры канваса внутри
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
// получение элементов
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const navigation = document.querySelector('.navigation');
const speed = document.querySelector('.range');
const showSpeed = document.querySelector('.showSpeed');

// картинки спрайт анимации
// персонаж
const imagePeople = new Image();
imagePeople.src = './assets/data.png';
// первый слой
const imageLayer1 = new Image();
imageLayer1.src = './assets/background_1.png';


// высота фрейма ряда откуда берем кадр
const heightFrame = 160; // высота одного кадра 
const widthFrame = 95.2; // ширина одно кадра
let typeAnimation = 2 * heightFrame; // тип анимации число от 0 до 4 (по оси y спрайта)
let gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
let stageFrame = 10; // погрешность
let countFrame = 12 // количество кадров анимации в спрайте
const heightPeople = 150; // высота человека в канвасе после вырезания из спрайта
const widthPeople = 100; // ширина человека в канвасе после вырезания из спрайта
const positionXPeopleFromCanvas = Math.floor(CANVAS_WIDTH / 2) - Math.floor(widthPeople / 2); // позиция человека в канвасе ширину канваса делим на 2 и минусуем ширину человека делим на 2
const positionYPeopleFromCanvas = 25; // пересчитаем высоту относительно первого слоя земли позже
let drawLeftOrFightLayer1 = 0; // направление движение слоя земли
let drawLeftOrFightLayer2 = 2400; // второй кадр для земли

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


// запуск анимации человека
function animatePeople() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // очистка всего канваса 60 раз в секунду

    let position = Math.floor(gameFrame / stageFrame) % countFrame;

    // когда 9 аргументов логи ка такая
    ctx.drawImage(
        imagePeople, // сама картинка спрайт общая
        position * widthFrame, // сдвиг по оси Х кадра спрайта для среза картинки (точка Х)
        typeAnimation, // тип анимации персонажа сдвиг по оси Y для среза (точка У)
        widthFrame, // ширина которую нужно срезать в картинке спрайта относительно Х
        heightFrame, // высота которую нужно срезать относительно Y
        positionXPeopleFromCanvas, // итоговая картинка куда будет положена в канвасе по оси Х
        positionYPeopleFromCanvas, // итоговая картинка куда будет положена в канвасе по оси У
        widthPeople, // ширина срезанной картинки
        heightPeople, // высота срезеной картинки 
    );

    if (drawLeftOrFightLayer1 <= -2400) {
        drawLeftOrFightLayer1 = 0
    } else {
        drawLeftOrFightLayer1-=1
    }

    if (drawLeftOrFightLayer2 <= 0) {
        drawLeftOrFightLayer2 = 2400
    } else {
        drawLeftOrFightLayer2-=1
    }

    ctx.drawImage(
        imageLayer1, 
        drawLeftOrFightLayer1, 
        -433, 
    );

    ctx.drawImage(
        imageLayer1, 
        drawLeftOrFightLayer2, 
        -433, 
    );

    
    gameFrame++;
    requestAnimationFrame(animatePeople);
}


animatePeople();
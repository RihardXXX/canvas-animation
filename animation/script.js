console.log('script connection');

import { animationState } from "./data.js";
import { 
    getItemByKeyCode, 
    getItemByClass, 
    useLayer,
    useAnimationObject, 
} from "./utils.js";

// размеры канваса внутри
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 250;
// получение элементов
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


// высота фрейма ряда откуда берем кадр
const heightFrame = 160; // высота одного кадра 
const widthFrame = 95.2; // ширина одно кадра
let typeAnimation = 2 * heightFrame; // тип анимации число от 0 до 4 (по оси y спрайта)
let gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
let stageFrame = 12.5; // погрешность
let countFrame = 12 // количество кадров анимации в спрайте
const heightPeople = 150; // высота человека в канвасе после вырезания из спрайта
const widthPeople = 100; // ширина человека в канвасе после вырезания из спрайта
const positionXPeopleInCanvas = Math.floor(CANVAS_WIDTH / 2) - Math.floor(widthPeople / 2); // позиция человека в канвасе ширину канваса делим на 2 и минусуем ширину человека делим на 2
const positionYPeopleInCanvas = 25; // пересчитаем высоту относительно первого слоя земли позже


// Управляемые объекты
// небо
const sky = useLayer({
    imageUrl: './assets/background_2.png',
    speed: 0.2,
    ctxCanvas: ctx,
    positionX1: 0,
    positionX2: 600,
    positionY: 0,
    widthImage: 600,
    heightImage: 150,
});

// человек
const people = useAnimationObject({
    imageUrl: './assets/data.png',
    ctxCanvas: ctx,
    gameFrame,
    stageFrame,
    countFrame,
    typeAnimation,
    widthFrameImageCut: 95.2,
    heightFrameImageCut: 160,
    positionXPeopleInCanvas,
    positionYPeopleInCanvas,
    widthCutImageByCanvas: widthPeople,
    heightCutImageBYCanvas: heightPeople,
});

// земля
const earth = useLayer({
    imageUrl: './assets/background_1.png',
    speed: 3,
    ctxCanvas: ctx,
    positionX1: 0,
    positionX2: 2400,
    positionY: -433,
    widthImage: 2400,
    heightImage: 720,
});



const navigation = document.querySelector('.navigation');
const speed = document.querySelector('.range');
const showSpeed = document.querySelector('.showSpeed');
// Слушатели событий
// тут мы выбираем ряд с анимациями
navigation.addEventListener('mousedown', e => {
    // нахождение объекта по классу
    const item = getItemByClass({ data: animationState, e });

    if (!item) {
        return;
    }

    countFrame = item.count; // 12
    typeAnimation = item.index * heightFrame; // 0 * 160, 1 * 160, 2 * 160, 3 * 160 по оси Y
    people.changeTypeAnimation(typeAnimation);
    // если выбрано левое направление меняем движение слоя
    if (item.name === 'left') {
        earth.setReverse(true);
    }

    if (item.name === 'right') {
        earth.setReverse(false);
    }

    animate();
});

navigation.addEventListener('mouseup', e => {
    // нахождение объекта по классу
    cancelAnimationFrame(reqAnimFrameId);
});

document.addEventListener('keydown', e => {

    // чтобы нажатие сработало один раз
    if (e.repeat) return;

    // нахождение объекта по коду клавиатуры
    const item = getItemByKeyCode({ data: animationState, e });

    if (!item) {
        return;
    }

    countFrame = item.count; // 12
    typeAnimation = item.index * heightFrame; // 0 * 160, 1 * 160, 2 * 160, 3 * 160 по оси Y
    people.changeTypeAnimation(typeAnimation);
    // если выбрано левое направление меняем движение слоя
    if (item.name === 'left') {
        earth.setReverse(true);
    }

    if (item.name === 'right') {
        earth.setReverse(false);
    }

    animate();
});

document.addEventListener('keyup', e => {

    // чтобы поднятие клавы сработало разово сработало один раз
    if (e.repeat) return;

    // отмена анимации
    cancelAnimationFrame(reqAnimFrameId);
});


//  тут выбираем скорость анимации
speed.addEventListener('change', e => {
    let value = e.target.value;

    if (typeof Number(value) !== 'number') {
        return;
    }
    showSpeed.textContent = value;

    if (value == 50) {
        value = 49;
    }

    stageFrame = (50 - value) / 2;
    // изменение скорости анимации человека
    // console.log(stageFrame);
    people.changeSpeedAnimation(stageFrame);
    // изменение скорости движения земли
    // console.log(value);
    earth.changeSpeed(value / 8);
});


var reqAnimFrameId;

// запуск анимаций всех
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // очистка всего канваса 60 раз в секунду

    // анимация неба
    sky.drawImage();
    sky.updated();

    // когда 9 аргументов логика такая
    // персонаж
    people.drawImage();
    people.updated();

    // движение земли
    earth.drawImage();
    earth.updated();
    
    reqAnimFrameId = requestAnimationFrame(animate);
}

// картинки когда будут готовы можно сделать первый рендер
Promise.all([
    sky.thePictureIsReady(),
    people.thePictureIsReady(),
    earth.thePictureIsReady(),
])
    .then(() => {
        // анимация неба
        sky.drawImage();
        // персонаж
        people.drawImage();
        // движение земли
        earth.drawImage();
    })
    .catch(() => {
        console.error('first render error');
    })


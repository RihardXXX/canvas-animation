/** @type {HTMLCanvasElement} */

console.log('script connection');

import { checkPlatform } from "./platform.js";
import { animationState } from "./data.js";
import { getItemByKeyCode, getItemByClass, getRandomInt } from "./utils.js";
import { useAnimationObject, useLayer, useMonster } from './hooks.js';

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
// позиция человека в канвасе ширину канваса делим на 2 и минусуем ширину человека делим на 2
const positionXPeopleInCanvas = Math.floor(CANVAS_WIDTH / 2) - Math.floor(widthPeople / 2); 
let positionYPeopleInCanvas = 25; // пересчитаем высоту относительно первого слоя земли позже


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

// задний фон города
const city = useLayer({
    imageUrl: './assets/background_3.png',
    speed: 1,
    ctxCanvas: ctx,
    positionX1: 0,
    positionX2: 600,
    positionY: 0,
    widthImage: 600,
    heightImage: 172,
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

// создание монстров
const listMonsters = [];
for (let i= 0; i < 10; i++) {
    listMonsters.push(useMonster({ imageUrl: './assets/monster1.png', ctxCanvas: ctx }));
}


const navigation = document.querySelector('.navigation');
const speed = document.querySelector('.range');
const showSpeed = document.querySelector('.showSpeed');


// при изменении размера окна проверять какая платформа
// и переключаем слушатели
if (window) {
    window.addEventListener("resize", () => {
        // проверка платформы и навешивание событий в зависимости от платформы
        const { desktop, tablet, mobile } = checkPlatform();
        selectPlatform({ desktop, tablet, mobile });
    });
}

// function select platform
// выбор слушателей событий в зависимости от платформы
function selectPlatform({ desktop, tablet, mobile }) {

    if (desktop) {
        console.log('desktop');
        // анимация и слой
        navigation.addEventListener('mousedown', startHandler);
        // турбо режим
        navigation.addEventListener('mousedown', turbo);
        // прыжок
        navigation.addEventListener('mousedown', jump);
        navigation.addEventListener('mouseup', e => {
            if (e.target.classList[0] === 'jump') {
                return;
            }
            cancelAnimationFrame(reqAnimFrameId);
        });
    
        document.addEventListener('keydown', e => {
            startHandler(e, true);
        });
    
        document.addEventListener('keyup', e => {
            // чтобы поднятие клавы сработало разово сработало один раз
            if (e.repeat) return;
            // отмена анимации
            cancelAnimationFrame(reqAnimFrameId);
            // cancelAnimationFrame(reqAnimFrameMonster);
        });
    
    } else if (tablet || mobile) {
        console.log('tablet || mobile');
        navigation.addEventListener('touchstart', startHandler);
        navigation.addEventListener('touchstart', turbo);
        navigation.addEventListener('touchstart', jump);
        navigation.addEventListener('touchend', e => {
            // if (e.target.classList[0] === 'jump') {
            //     return;
            // }
            // нахождение объекта по классу
            cancelAnimationFrame(reqAnimFrameId);
        });
    }
}

// проверка платформы и навешивание событий в зависимости от платформы
const { desktop, tablet, mobile } = checkPlatform();
selectPlatform({ desktop, tablet, mobile });

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
    people.changeSpeedAnimation(stageFrame);
    // изменение скорости движения земли
    earth.changeSpeed(value / 8);
    city.changeSpeed(value / 12);
});


// функции слушатели событий
function startHandler(e, isKeyboard) {

    // чтобы нажатие сработало один раз если через клаву идет активация функции
    if (isKeyboard && e.repeat) return;

    // нахождение объекта по классу если через клаву то запуск другой функции
    // для анимация персонажа
    const item = isKeyboard 
        ? getItemByKeyCode({ data: animationState, e }) 
        : getItemByClass({ data: animationState, e });

    if (!item) {
        return;
    }

    countFrame = item.count; // 12
    typeAnimation = item.index * heightFrame; // 0 * 160, 1 * 160, 2 * 160, 3 * 160 по оси Y
    people.changeTypeAnimation(typeAnimation);

    // останавливаем анимацию монстров первого рендера
    cancelAnimationFrame(reqAnimFrameMonster);

    // если выбрано левое направление меняем движение слоя
    if (item.name === 'left') {
        earth.setReverse(true);
        city.setReverse(true);
        // listMonsters.forEach(monster => monster.setReverse(true));
        animate();
        animateMonster();
    }

    if (item.name === 'right') {
        earth.setReverse(false);
        city.setReverse(false);
        // listMonsters.forEach(monster => monster.setReverse(false));
        animate();
        animateMonster();
    }
    console.log('xxx');
}


// прыжок персонажа
function jump(e) {
    if (e.target.classList[0] !== 'jump') {
        return;
    }

    console.log('jump');


    cancelAnimationFrame(reqAnimFrameMonster);
    animateJump();
    animateMonster();

    // для мобилки включаем
    if (tablet || mobile) {
        animate();
        cancelAnimationFrame(reqAnimFrameMonster);
        animateMonster();
    }
}

// турбо режим срабатывает при удержании
function turbo(e) {
    if (e.target.classList[0] === 'turbo') {
        cancelAnimationFrame(reqAnimFrameMonster);
        animate();
        animateMonster();
        return;
    }
}

var reqAnimFrameId;

// массив объектов со слоями и данными
const listObjects = [
    sky,
    city,
    earth,
    // ...listMonsters,
    people,
]

// запуск анимаций всех
function animate() {

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // очистка всего канваса 60 раз в секунду

    // движение всех слоев и объектов сразу
    listObjects.forEach(object => {
        object.drawImage();
        object.updated();
    });
    
    reqAnimFrameId = requestAnimationFrame(animate);
}


var reqAnimFrameIdJump;
// запуск анимации пряжка он не останавливается поэтому создаем отдельным потоком
function animateJump() {
    // стираем только область человека в прыжке
    ctx.clearRect(    
        0,
        0,
        CANVAS_WIDTH, 
        CANVAS_HEIGHT
    ); // очистка всего канваса 60 раз в секунду

    // после прыжка чтобы фон не терялся
    listObjects.forEach(item => item.drawImage());
    
    const countJump = people.changePositionYPeopleInCanvas();

    // после 1 прыжка отключать анимацию
    if (countJump === 1) {
        // console.log(countJump);
        cancelAnimationFrame(reqAnimFrameIdJump);
        // сбрасываем счетчик, чтобы могли прыгнуть повторно
        people.resetJumpCount();
        return;
    }

    people.drawImage();
    reqAnimFrameIdJump = requestAnimationFrame(animateJump);
}

var reqAnimFrameMonster;
// анимация монстров движения в отдельном потоке
function animateMonster() {

    if (!reqAnimFrameId || !reqAnimFrameIdJump) {
        ctx.clearRect(    
            0,
            0,
            CANVAS_WIDTH, 
            CANVAS_HEIGHT
        ); // очистка всего канваса 60 раз в секунду

        // движение всех слоев и объектов сразу
        listObjects.forEach(object => {
            object.drawImage();
            // object.updated();
        });
    } else if (reqAnimFrameIdJump) {
        ctx.clearRect(    
            0,
            0,
            CANVAS_WIDTH, 
            CANVAS_HEIGHT
        ); // очистка всего канваса 60 раз в секунду

        // движение всех слоев и объектов сразу
        listObjects.forEach(object => {
            object.drawImage();
            // object.updated();
        });
    }

    listMonsters.forEach(monster => {
        monster.updated();
        monster.drawImage();
    })

    reqAnimFrameMonster = requestAnimationFrame(animateMonster);
}

// картинки когда будут готовы можно сделать первый рендер
Promise.all(listObjects.map(item => item.thePictureIsReady()))
    .then(() => {
        // когда картинки готовы запускаем первый рендер
        listObjects.forEach(item => item.drawImage());
        animateMonster();
    })
    .catch(() => {
        console.error('first render error');
    })


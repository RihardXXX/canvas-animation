console.log('script connection');

import { animationState } from "./data.js";
import { 
    getItemByKeyCode, 
    getItemByClass, 
    useLayer,
    useAnimationObject, 
} from "./utils.js";

// size type
let desktop;
let tablet;
let mobile;

if (document) {
    const width = document.documentElement.clientWidth;
    if (width <= 650) {
        mobile = true;
    } else if ((width > 650) && (width < 1024)) {
        tablet = true;
    } else {
        desktop = true;
    }
}

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



const navigation = document.querySelector('.navigation');
const speed = document.querySelector('.range');
const showSpeed = document.querySelector('.showSpeed');


if (desktop) {
    console.log('desktop');
    // анимация и слой
    navigation.addEventListener('mousedown', startHandler);
    // турбо режим
    navigation.addEventListener('mousedown', turbo);

    navigation.addEventListener('mouseup', e => {
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
    });

} else if (tablet || mobile) {

    console.log('tablet || mobile');

    navigation.addEventListener('touchstart', startHandler);
    navigation.addEventListener('touchstart', turbo);

    navigation.addEventListener('touchend', e => {
        // нахождение объекта по классу
        cancelAnimationFrame(reqAnimFrameId);
    });

}


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
    // если выбрано левое направление меняем движение слоя
    if (item.name === 'left') {
        earth.setReverse(true);
        city.setReverse(true);
        animate();
    }

    if (item.name === 'right') {
        earth.setReverse(false);
        city.setReverse(false);
        animate();
    }

    console.log(e);
}


// прыжок персонажа
// function jump(e) {
//     if (e.target.classList[0] !== 'jump') {
//         return;
//     }

//     console.log('jump');
//     for (let i = positionYPeopleInCanvas; i > 0; i--) {
//         people.changePositionYPeopleInCanvas(positionYPeopleInCanvas - );
//     }

//     animate();
// }

// турбо режим срабатывает при удержании
function turbo(e) {
    if (e.target.classList[0] === 'turbo') {
        animate();
        return;
    }
}

var reqAnimFrameId;

// запуск анимаций всех
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // очистка всего канваса 60 раз в секунду

    // анимация неба
    sky.drawImage();
    sky.updated();

    // анимация заднего фона города
    city.drawImage();
    city.updated();

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
    city.thePictureIsReady(),
    people.thePictureIsReady(),
    earth.thePictureIsReady(),
])
    .then(() => {
        // анимация неба
        sky.drawImage();
        // город
        city.drawImage();
        // персонаж
        people.drawImage();
        // движение земли
        earth.drawImage();
    })
    .catch(() => {
        console.error('first render error');
    })


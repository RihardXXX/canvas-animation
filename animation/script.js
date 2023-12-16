/** @type {HTMLCanvasElement} */

console.log('script connection');

import { checkPlatform } from "./platform.js";
import { animationState } from "./data.js";
import { 
    getItemByKeyCode, 
    getItemByClass, 
    coincidenceRectangle, 
    uuidv4 
} from "./utils.js";
import { useAnimationObject, useLayer, useMonster, useNotificationBoomMonster } from './hooks.js';

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
const widthPeople = 80; // ширина человека в канвасе после вырезания из спрайта
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
let listMonsters = [];

for (let i= 0; i < 10; i++) {
    listMonsters.push(useMonster({ imageUrl: './assets/monster1.png', ctxCanvas: ctx, id: uuidv4() }));
}

// элементы дом к которому цепляемся
const navigation = document.querySelector('.navigation');
const speed = document.querySelector('.range');
const showSpeed = document.querySelector('.showSpeed');
const monsterCount = document.querySelector('.monster__count span');
const timerElement = document.querySelector('.timer span');
const helpText = document.querySelector('.help__text');

// запуск таймера игры
// timerGame(59, timerElement);


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
    
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
    
    } else if (tablet || mobile) {
        console.log('tablet || mobile');
        navigation.addEventListener('touchstart', startHandler);
        navigation.addEventListener('touchstart', turbo);
        navigation.addEventListener('touchstart', jump);
        navigation.addEventListener('touchend', touchendHandler);
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
}

function keyDownHandler(e) {
    console.log('keyDownHandler');
    startHandler(e, true);
}

function keyUpHandler(e) {
    // чтобы поднятие клавы сработало разово сработало один раз
    if (e.repeat) return;
    // отмена анимации
    cancelAnimationFrame(reqAnimFrameId);
    // cancelAnimationFrame(reqAnimFrameMonster);
}

function touchendHandler() {
    cancelAnimationFrame(reqAnimFrameId);
}


// прыжок персонажа
function jump(e) {
    if (e.target.classList[0] !== 'jump') {
        return;
    }

    console.log('jump');


    // cancelAnimationFrame(reqAnimFrameMonster);
    // animateJump();
    // animateMonster();

    // для мобилки включаем
    if (tablet || mobile) {
        animate();
        cancelAnimationFrame(reqAnimFrameMonster);
        animateJump();
        animateMonster();
    } else {
        cancelAnimationFrame(reqAnimFrameMonster);
        animateJump();
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

// анимация для монстров
var reqAnimFrameMonster;
// количество касаний за минуту
var isCoincidence = [];
// уведомление о касании монстра
var notification;
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

    // тут будем при движении монстров сравнивать касаются ли они человека
    const people = listObjects[3];

    // ctx.strokeStyle = "green";
    // ctx.strokeRect(
    //     people.getPositionXJump(), 
    //     people.getPositionYJump(), 
    //     people.getWidthOnCanvas(), 
    //     people.getHeightOnCanvas()
    // );

    // listMonsters.forEach(monster => {
    //     ctx.strokeRect(
    //         monster.getPositionX(),  
    //         monster.getPositionY(), 
    //         monster.getWidth(), 
    //         monster.getHeight()
    //     );
    // })

    let result = coincidenceRectangle({
        mainObject: {
            x: people.getPositionXJump(), 
            y: people.getPositionYJump(), 
            width: people.getWidthOnCanvas(), 
            height: people.getHeightOnCanvas(),
        },
        otherObjects: listMonsters.map(monster => ({ 
            x: monster.getPositionX(), 
            y: monster.getPositionY(), 
            width: monster.getWidth(), 
            height: monster.getHeight(),
            id: monster.getId(),
         })),
    });

    if (Boolean(result.length)) {
        const monsterSuper = result[0];
        // удаляем из общего списка монстров монстра который тронул человека
        listMonsters = listMonsters.filter(monster => monster.getId() !== monsterSuper.id);
        // добавляем в список совпадений для количества попаданий
        isCoincidence.push(monsterSuper);
        // создаем нового монстра и кладем его в список монстров, чтобы количество монстров не уменьшалось
        listMonsters.push(useMonster({ imageUrl: './assets/monster1.png', ctxCanvas: ctx, id: uuidv4() }));
        // увеличиваем количество попаданий монстров в счетчике
        monsterCount.textContent = Number(isCoincidence.length);

        // инициализация уведомления о касания монстра
        notification = useNotificationBoomMonster({
            ctxCanvas: ctx,
            x: 0,
            y: 50,
            message: 'БУМ',
        });
        // cancelAnimationFrame(reqAnimFrameMonster);
        // return;
    }

    if (notification) {
            
        // console.log(112);
        notification.drawMessage();
        stop = notification.updated();

        // console.log('stop: ', stop);
        
        if (stop) {
            notification = undefined;
            stop = '';
        }
    }

    reqAnimFrameMonster = requestAnimationFrame(animateMonster);
}

// картинки когда будут готовы можно сделать первый рендер
async function firstRenderImage(listObjects, animateMonster) {
    return new Promise(resolve => {
        listObjects.forEach(item => item.drawImage());
        animateMonster();
        resolve();
    })
}


// старт таймера
async function timerGame(seconds, element) {
    return new Promise(resolve => {
        var idTimer = setInterval(() => {

            element.textContent = seconds < 10 
                                    ? `0${seconds}` 
                                    : seconds;
            seconds--;
    
            if (seconds < 0) {
                clearInterval(idTimer);
                resolve();
            }
    
        }, 1000);
    })
}

// приветственный текст к началу игры
async function disabledElementsToggle(...elements) {
    if (!elements.length) {
        return;
    }

    return new Promise(resolve => {
        elements.forEach(element => {
            element.classList.toggle('disabled__element');
        });
        resolve();
    })
}

// запуск функция поочереди
async function startGame(fns = [
        // закрываем элемент канвас и управления
        async () => await disabledElementsToggle(canvas, navigation),
        // показываем приветственный текст
        async () => await changeHelpText(helpText, 0),
        // скрываем текст помощи
        () => hiddenHelpText(helpText),
        // открываем канвас и элементы управления
        async () => await disabledElementsToggle(canvas, navigation),
        // делаем первый рендер картинки и анимацию монстров
        async () => await firstRenderImage(listObjects, animateMonster),
        // запускаем таймер игры
        async () => await timerGame(10, timerElement),
        // завершение игры
        async () => await gameOver(),
    ]) {

    console.log('start game');

    if (!fns.length) {
        return;
    }

    console.log('start game2');
    // асинхронный вызов функций с ожиданием
    for (const fn of fns) {
        await fn();
    }
}

var btnStartGame = document.querySelector('.start__game');

function timerStart(resolve, count, elem) {
    var idInterval = setInterval(() => {
        if (count === 0) {
            clearInterval(idInterval);
            btnStartGame.removeEventListener('click', timerStart);
            resolve();
        }

        elem.innerHTML = `<span class="heart">${count}</span>`;
        count--;
    }, 1000);
}

// изменение приветственного текста
async function changeHelpText(elem, count) {
    if (!elem) {
        return;
    }

    return new Promise(resolve => {
        btnStartGame.addEventListener('click', () => timerStart(resolve, count, elem));
    });
}

// прячем текст помощи
function hiddenHelpText(elem) {
    if (!elem) {
        return;
    }

    elem.style.display = 'none';
}

// сообщаем о том что игра закончилась и вы набрали баллов
async function gameOver() {
    
    // если таймер дошел до нуля
    // 1. Останавливаем все анимации +
    // 2. Отключаем все кнопки и слушатели +
    // 3. Выводим окно о том что столько то столкновений
    console.log('gameOver');
    // массив идентификаторов анимаций
    [
        reqAnimFrameMonster,
        reqAnimFrameIdJump,
        reqAnimFrameId
    ].forEach(
        reqAnimFrameValue => cancelAnimationFrame(reqAnimFrameValue)
    );

    if (desktop) {
        [
            startHandler,
            turbo,
            jump
        ].forEach(
            listenerFunction => navigation.removeEventListener('mousedown', listenerFunction)
        );

        console.log('desktop remove');
    
        [
            { eventName: 'keydown', handler: keyDownHandler },
            { eventName: 'keyup', handler: keyUpHandler },
        ].forEach(
            ({ eventName, handler }) =>  document.removeEventListener(eventName, handler)
        );
    } else if(tablet || mobile) {
        [
            { eventName: 'touchstart', handler: startHandler },
            { eventName: 'touchstart', handler: turbo },
            { eventName: 'touchstart', handler: jump},
            { eventName: 'touchend', handler: touchendHandler },
        ].forEach(
            ({ eventName, handler }) =>  navigation.removeEventListener(eventName, handler)
        );
    }    


    await showResultGame(helpText, monsterCount.textContent);
}

// показываем сообщение в модалке сколько было столкновений
async function showResultGame(elem, countMonsters) {
    if (!elem) {
        return;
    }

    await disabledElementsToggle(canvas, navigation)

    elem.innerHTML = `
        <h1>
            Игра окончена <br> у вас ${countMonsters} столкновений с монстрами
        </h1>
        <br>
        <br>
        <button class="start__game">
            начать игру заново
        </button>
    `;

    var btnStartGame = document.querySelector('.start__game');

    elem.style.display = 'block';

    btnStartGame.addEventListener('click', () => window.location.reload());
}


// массив функций для старта игры
startGame();
// test commit for rebase
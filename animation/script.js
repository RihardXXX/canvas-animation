console.log('script connection');

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

// массив типов анимаций, количества кадров, их позиция
const animationState = [
    {
        name: 'up',
        countFrame: 12,
    },
    {
        name: 'left',
        countFrame: 12,
    },
    {
        name: 'right',
        countFrame: 12,
    },
    {
        name: 'down',
        countFrame: 12,
    },
];

// собираем данные
animationState.map((item, index) => {
    const location = [];

});

// высота фрейма ряда откуда берем кадр
const heightFrame = 160; // высота одного кадра 
const widthFrame = 95.2; // ширина одно кадра
let typeAnimation = 0; // тип анимации число от 0 до 4 (по оси y спрайта)

// тут мы выбираем ряд с анимациями
navigation.addEventListener('click', e => {
    switch(e.target.classList[0]) {
        case 'left':
            typeAnimation = 1 * heightFrame;
            break;
        case 'right':
            typeAnimation = 2 * heightFrame;
            break;
        case 'up':
            typeAnimation = 0 * heightFrame;
            break;
        case 'down':
            typeAnimation = 3 * heightFrame;
            break;  
        default:
            break;          
    }

});


let gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
let stageFrame = 10; // погрешность


//  тут выбираем скорость анимации
speed.addEventListener('change', e => {
    const value = e.target.value
    if (typeof Number(value) !== 'number') {
        return;
    }
    showSpeed.textContent = value;
    stageFrame = 51 - value;
});



function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let position = Math.floor(gameFrame / stageFrame) % 12;

    ctx.drawImage(image, position * widthFrame, typeAnimation, widthFrame, heightFrame, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
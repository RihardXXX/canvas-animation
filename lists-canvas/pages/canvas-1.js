'use-strict'

console.log('connection canvas-1.js');

import { useArc, useLetter } from "./hooks.js";

// размеры канваса внутри
// ширина и высота окна за вычетом полосы прокрутки если вдруг она появится
// const CANVAS_WIDTH = window.innerWidth;
// const CANVAS_HEIGHT = window.innerHeight;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
// получение элементов
const canvas = document.getElementById('canvas-1');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var letter = useLetter({ ctx: ctx });

var arc = useArc({ 
    ctx,
    dotCenter: 100,
    radiusParams: 50,
    startAngle: 0,
    endAngle: 0.1
 })

var animateId;
var result;
// запуск анимаций буквы
function animate() {
    // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // очистка всего канваса 60 раз в секунду
    // letter.draw();
    result = arc.draw();
    if (result === 'stop') {
        cancelAnimationFrame(animateId)
        return
    }
    animateId = requestAnimationFrame(animate);
}

document.querySelector('#start').addEventListener('click', animate)
document.querySelector('#reset').addEventListener('click', () => {
    window.location.reload();   
})

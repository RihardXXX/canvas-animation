

export function useLetter({ ctx }) {
    var gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
    const countFrame = 6;
    var stageFrame = 2; // погрешность
    var xPosition = 600;
    var yPosition = 0;

    ctx.beginPath(); // Начинает новый путь
    ctx.moveTo(yPosition, xPosition); // начало движения линии
    ctx.lineJoin = "round"; // скругление
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    var leftOrRight = true;
    // Shadow
    // ctx.shadowColor = "black"; // цвет тени
    // ctx.shadowBlur = 5; // степень размытия тени
    //

    function left() {
        console.log('left');
        console.log('xPosition', xPosition);
        // необходимо для переключения на правую функцию
        if (xPosition <= 0) {
            leftOrRight = false;
            xPosition = 0;
            ctx.beginPath(); // Начинает новый путь
            ctx.moveTo(yPosition, xPosition); // начало движения линии
        }
        xPosition -= stageFrame
        yPosition += 1 * Math.sin(.6); 
        ctx.lineTo(yPosition, xPosition);
    }

    function right() {
        console.log('right');
        console.log('xPosition', xPosition);
        if (xPosition >= 600) {
            leftOrRight = null; // полностью отключить работу функции 
            return
        }
        xPosition += stageFrame
        yPosition += 1 * Math.cos(.6); 
        ctx.lineTo(yPosition, xPosition);
    }

    function draw() {

        if (leftOrRight) {
            left()
        } else if(leftOrRight === false) {
            right()
        }

        ctx.stroke(); // Отображает путь
        gameFrame++;
    }


    return {
        draw,
    }
}

export function useArc({ 
        ctx, 
        dotCenter, 
        radiusParams, 
        startAngle,
        endAngle, 
        anticlockwise=false,
        CANVAS_WIDTH,
        CANVAS_HEIGHT, 
    }) {

    var x = dotCenter
    var y = dotCenter
    var radius = radiusParams
    var start = startAngle
    var end = endAngle
    var fullRadian = 2 * Math.PI // 6.28
    var gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
    var step = 0.03
    ctx.shadowColor = "rgba(4, 255, 0, 0.8)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    var start1 = start + 1
    var end1 = end + 1

    function drawStyle1() {
        // console.log('draw');
        if (end >= 6.28) {
            start = 0
            end = 0
            gameFrame = 0
            // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            // return 'stop';
        }
        ctx.beginPath();
        end += step
        ctx.arc(x, y, radius, start, end, anticlockwise);
        ctx.stroke();
        gameFrame++
    }

    function drawStyle2() {
        ctx.beginPath();
        start += step
        end += step
        ctx.arc(x, y, radius, start, end, anticlockwise);
        ctx.stroke();

        gameFrame++
    }

    function drawStyle3() {
        ctx.beginPath();
        start += step
        end += step
        ctx.arc(x, y, radius, start, end, anticlockwise);
        ctx.stroke();

        ctx.beginPath();
        start1 -= step
        end1 -= step
        ctx.arc(x, y, radius - 15, start1, end1, true);
        ctx.stroke();
        
        gameFrame++
    }

    return {
        drawStyle1,
        drawStyle2,
        drawStyle3,
    }
}
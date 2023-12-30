

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
    // Shadow
    // ctx.shadowColor = "black"; // цвет тени
    // ctx.shadowBlur = 5; // степень размытия тени
    //

    function left() {
        xPosition -= stageFrame
        yPosition += 1 * Math.sin(.7); 
        ctx.lineTo(yPosition, xPosition);
        if (xPosition <= 0) {
            return;
        }
    }

    function right() {
        
    }

    function draw() {



        // changeByPosition = Math.floor(gameFrame / stageFrame) % 600;

        // if (xPosition <= 0) {
        //     xPosition = 600;
        //     yPosition = 0;
        //     ctx.clearRect(0, 0, 400, 600);
        //     ctx.beginPath(); // Начинает новый путь
        //     ctx.moveTo(yPosition, xPosition); // начало движения линии
        // }

        left();


        ctx.stroke(); // Отображает путь
        gameFrame++;
    }
    
    // // обновление координат
    // const updated = () => {
    //     // тут анимация
    //     positionXInImage = Math.floor(gameFrame / stageFrame) % countFrame;

    //     // движение по оси X
    //     if (positionXMonsterInCanvas < -60) {
    //         positionXMonsterInCanvas = 1200;
    //     }
    //     positionXMonsterInCanvas -= speed;

    //     // углы движения и кривая синусоидная по оси Y
    //     positionYMonsterInCanvas += getRandomInt(1, 2) * Math.sin(angle); // синус угла
    //     angle += angleSpeed; // тут шаг угла меняем
    //     // angle += 0.2; // тут шаг угла меняем

    //     gameFrame++;
    // }
    // единица измерения для рисования

    return {
        draw,
    }
}
import { getRandomInt } from "./utils.js";
// хуки слоев и их движение

// земля, небо, город
const useLayer = ({ 
    imageUrl, 
    speed, 
    ctxCanvas, 
    positionX1, 
    positionX2, 
    positionY, 
    widthImage, 
    heightImage, 
    reverse 
}) => {

    const image = new Image();
    image.src = imageUrl;

    // функция отсчета координат
    const updated = () => {

        if (reverse) {
            // кадры ставим друг за другом и если кадры уходят влево то ставим вперед
            if (positionX1 >= widthImage) {
                positionX1 = -widthImage + speed;
            } else {
                positionX1 = positionX1 + speed
            }

            if (positionX2 >= widthImage) {
                positionX2 = -widthImage + speed;
            } else {
                positionX2 = positionX2 + speed;
            }

            return;
        }

        // кадры ставим друг за другом и если кадры уходят влево то ставим вперед
        if (positionX1 <= -widthImage) {
            positionX1 = widthImage + positionX2 - speed;
        } else {
            positionX1 = positionX1 - speed
        }

        if (positionX2 <= -widthImage) {
            positionX2 = widthImage + positionX1 - speed;
        } else {
            positionX2 = positionX2 - speed;
        }
       
    }

    // функция отрисовки
    const drawImage = () => {
        ctxCanvas.drawImage(
            image,
            positionX1,
            positionY,
            widthImage,
            heightImage
        )
        ctxCanvas.drawImage(
            image,
            positionX2,
            positionY,
            widthImage,
            heightImage
        )
    }

    // увеличить скорость слоя
    const changeSpeed = newSpeed => {
        speed = newSpeed;
    }

    // изменить направление движения слоя
    const setReverse = status => {
        reverse = status;
    }

    // состояние что картинка готова
    const thePictureIsReady = async  () => {
        return new Promise(resolve => {
            image.onload = function() {
                resolve();
            }
        })
    }

    return {
        updated,
        drawImage,
        changeSpeed,
        setReverse,
        thePictureIsReady,
    };
};

// хуки анимации объектов
// человек
const useAnimationObject = ({ 
        imageUrl, 
        ctxCanvas, 
        gameFrame, 
        stageFrame, 
        countFrame,
        typeAnimation,
        widthFrameImageCut,
        heightFrameImageCut, 
        positionXPeopleInCanvas,
        positionYPeopleInCanvas,
        widthCutImageByCanvas,
        heightCutImageBYCanvas,
    }) => {

    const image = new Image();
    image.src = imageUrl;

    // для анимации движения внутри спрайта шаг X
    let positionX = 0;

    const updated = () => {
        // когда 9 аргументов логика такая
        // персонаж
        positionX = Math.floor(gameFrame / stageFrame) % countFrame;
        gameFrame++;
    }

    const drawImage = () => {
        ctxCanvas.drawImage(
            image, // сама картинка спрайт общая
            positionX * widthFrameImageCut, // сдвиг по оси Х кадра спрайта для среза картинки (точка Х)
            typeAnimation, // тип анимации персонажа сдвиг по оси Y для среза (точка У)
            widthFrameImageCut, // ширина которую нужно срезать в картинке спрайта относительно Х
            heightFrameImageCut, // высота которую нужно срезать относительно Y
            positionXPeopleInCanvas, // итоговая картинка куда будет положена в канвасе по оси Х
            positionYPeopleInCanvas, // итоговая картинка куда будет положена в канвасе по оси У
            widthCutImageByCanvas, // ширина срезанной картинки
            heightCutImageBYCanvas, // высота срезанной картинки 
        );
    }

    // тип анимации
    const changeTypeAnimation = newTypeAnimation => {
        typeAnimation = newTypeAnimation;
    }

    // скорость анимации
    const changeSpeedAnimation = newStageFrame => {
        stageFrame = newStageFrame;
    }

    // состояние что картинка готова
    const thePictureIsReady = async  () => {
        return new Promise(resolve => {
            image.onload = function() {
                resolve();
            }
        })
    }

    // направление прыжка
    var up = true;
    // чтобы прыгнуть один раз
    var jumpCount = 0;

    // функция прыжка
    const changePositionYPeopleInCanvas = () => {
        function dec() {
            if (positionYPeopleInCanvas < -50) {
                up = false;
                positionYPeopleInCanvas = -50;
                return;
            }
            positionYPeopleInCanvas -= 0.5;
        }

        function inc() {
            if (positionYPeopleInCanvas > 20) {
                up = true;
                positionYPeopleInCanvas = 20;
                jumpCount++; // чтобы совершить прыжок один раз
                return;
            }
            positionYPeopleInCanvas += 0.5;
        }

        if (up) {
            dec();
        } else {
            inc();
        }

        return jumpCount;
    }

    // чтобы счетчик сбить и прыгать можно было не один раз
    var resetJumpCount = () => jumpCount = 0;

    // из замыкания получаемый примитивный тип
    // если бы был объектом то можно было тупо на переменную ссылаться
    var getPositionYJump = () => positionYPeopleInCanvas;
    var getPositionXJump = () => positionXPeopleInCanvas;
    var getWidthOnCanvas = () => widthCutImageByCanvas;
    var getHeightOnCanvas = () => heightCutImageBYCanvas;

    return {
        updated,
        drawImage,
        changeTypeAnimation,
        changeSpeedAnimation,
        thePictureIsReady,
        changePositionYPeopleInCanvas,
        resetJumpCount,
        getPositionYJump,
        getPositionXJump,
        getWidthOnCanvas,
        getHeightOnCanvas,
    };
}


// функция для создания монстров

const useMonster = ({ imageUrl, ctxCanvas, reverse, id }) => {
    // некоторые данные будут захардкодены

    let gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
    let stageFrame = getRandomInt(2, 12); // погрешность
    const countFrame = 6;
    let positionXInImage = 0; 
    let positionYInImage = 0; 
    const widthFrameImageCut = 293;
    const heightFrameImageCut = 155;
    let positionXMonsterInCanvas = getRandomInt(600, 1200);
    let positionYMonsterInCanvas = getRandomInt(80, 300);
    // let positionYMonsterInCanvas = 160;
    const widthCutImageByCanvas = 60;
    const heightCutImageByCanvas = 40;
    const speed = 2.5 * Math.random();
    // let upOrDown = getRandomInt(1, 2) === 1; // изначальное направление движения монстра
    let angle = Math.random() * 2; // угол наклона в радианах для волнового движения момент
    let angleSpeed = Math.random() * 0.5; // угол увеличения
    // Sin синус угла A равняется делению стороны A (катет) / C (гипотенуза)




    // работа с изображением создание и степень готовности
    const image = new Image();
    image.src = imageUrl;

    // состояние что картинка готова
    const thePictureIsReady = async  () => {
        return new Promise(resolve => {
            image.onload = function() {
                resolve();
            }
        })
    }

    // обновление координат
    const updated = () => {
        // тут анимация
        positionXInImage = Math.floor(gameFrame / stageFrame) % countFrame;

        // движение по оси X
        if (positionXMonsterInCanvas < -60) {
            positionXMonsterInCanvas = 1200;
        }
        positionXMonsterInCanvas -= speed;

        // углы движения и кривая синусоидная по оси Y
        positionYMonsterInCanvas += getRandomInt(1, 2) * Math.sin(angle); // синус угла
        angle += angleSpeed; // тут шаг угла меняем
        // angle += 0.2; // тут шаг угла меняем

        gameFrame++;
    }

    // рисование на холсте
    const drawImage = () => {
        ctxCanvas.drawImage(
            image, // сама картинка спрайт общая
            positionXInImage * widthFrameImageCut, // сдвиг по оси Х кадра спрайта для среза картинки (точка Х)
            positionYInImage, // тип анимации персонажа сдвиг по оси Y для среза (точка У)
            widthFrameImageCut, // ширина которую нужно срезать в картинке спрайта относительно Х
            heightFrameImageCut, // высота которую нужно срезать относительно Y
            positionXMonsterInCanvas, // итоговая картинка куда будет положена в канвасе по оси Х
            positionYMonsterInCanvas, // итоговая картинка куда будет положена в канвасе по оси У
            widthCutImageByCanvas, // ширина срезанной картинки
            heightCutImageByCanvas, // высота срезанной картинки 
        );
    }

    // изменить направление движения слоя
    const setReverse = status => {
        reverse = status;
    }

        // из замыкания получаемый примитивный тип
    // если бы был объектом то можно было тупо на переменную ссылаться
    var getPositionY = () => positionYMonsterInCanvas;
    var getPositionX = () => positionXMonsterInCanvas;
    var getWidth = () => widthCutImageByCanvas;
    var getHeight = () => heightCutImageByCanvas;
    var getId = () => id;

    return {
        thePictureIsReady,
        updated,
        drawImage,
        setReverse,
        getPositionX,
        getPositionY,
        getWidth,
        getHeight,
        getId,
    }
}

// уведомление о касании монстра 
// функция которая будет уведомллять о том что произошло столкновение
function useNotificationBoomMonster({
        ctxCanvas,
        x,
        y,
        message,
    }) {
        console.log('notificationBoomMonster');

        var speed = 1.25;

        ctxCanvas.font = "36px serif";
        ctxCanvas.textBaseline = "bottom";
        ctxCanvas.fillStyle = "#ff0000";

        // обновление координат
        function updated(){
            if (x >= 60) {
                return 'stop';
            }
            x += speed;
        }

        // рисование на холсте
        function drawMessage(){
            ctxCanvas.fillText(message, x, y);;
        }

        return {
            updated,
            drawMessage,
        }
}

function useLocalStorage() {
    var result = 'result';

    // первичная инициализация хранилища пустым массивом
    (function initialState() {
        if (!getResults()) {
            localStorage.setItem(result, JSON.stringify([]));
        }
    })();

    // получение результата 10 игр
    function getResults() {
        if (!localStorage) {
            return;
        }
        return JSON.parse(localStorage.getItem(result));
    }

    // установка нового результата если он не выходит в топ 10 то не добавляем
    // сохраняем 10 лучших результатов с датами
    function setResults(newItem) {
        if (newItem) {
            return;
        }

        var data = getResults();

        if (data.length >= 10) {
            const currentTotal = newItem.total;

            // если текущие результат меньше тех что в базе хранения то игнорируем сохранение
            const isMinCurrent = data.every(item => item.total > currentTotal);

            if (isMinCurrent) {
                return;
            }

            // иначе сохраняем в бд данный результат предварительно
        } else {
            // если меньше 10 то добавляем и сортируем а потом сохраняем
            data.push(newItem);
            const newData = data.toSorted((a, b) => a.total - b.total);
            localStorage.setItem(result, JSON.stringify(newData));
        }
    }

    return {
        getResults,
        setResults,
    }
}

function useCurrentDate() {

}

export {
    useAnimationObject,
    useLayer,
    useMonster,
    useNotificationBoomMonster,
    useLocalStorage,
    useCurrentDate,
}
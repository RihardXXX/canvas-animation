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

    // для прыжка персонажа регулировка по оси Y на самом канвасе
    let positionYJump = positionYPeopleInCanvas; // 25

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
            if (positionYPeopleInCanvas < 0) {
                up = false;
                positionYPeopleInCanvas = 0;
                return;
            }
            positionYPeopleInCanvas -= 0.5;
        }

        function inc() {
            if (positionYPeopleInCanvas > 25) {
                up = true;
                positionYPeopleInCanvas = 25;
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
    const resetJumpCount = () => jumpCount = 0;

    return {
        updated,
        drawImage,
        changeTypeAnimation,
        changeSpeedAnimation,
        thePictureIsReady,
        changePositionYPeopleInCanvas,
        resetJumpCount,
    };
}


// функция для создания монстров

const useMonster = ({ imageUrl, ctxCanvas, reverse }) => {
    // некоторые данные будут захардкодены

    let gameFrame = 0; // общий счетчик который увеличивается при кадрировании 60 кадров в секунду
    let stageFrame = getRandomInt(2, 12); // погрешность
    const countFrame = 6;
    let positionXInImage = 0; 
    let positionYInImage = 0; 
    const widthFrameImageCut = 293;
    const heightFrameImageCut = 155;
    let positionXMonsterInCanvas = getRandomInt(600, 1200);
    let positionYMonsterInCanvas = getRandomInt(0, 250);
    const widthCutImageByCanvas = 60;
    const heightCutImageByCanvas = 40;
    const speed = 2.5 * Math.random();
    let upOrDown = getRandomInt(1, 2) === 1; // изначальное направление движения монстра



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

        // а тут движение монстра
        // 
        if (reverse) {
            if (positionXMonsterInCanvas === -60) {
                positionXMonsterInCanvas = 1200
            }
            positionXMonsterInCanvas += speed;
            if (upOrDown) {
                positionYMonsterInCanvas += speed;
            } else {
                positionYMonsterInCanvas -= speed;
            }

            if (positionYMonsterInCanvas < -40) {
                positionYMonsterInCanvas = 0;
                upOrDown = !upOrDown;
            }
            if (positionYMonsterInCanvas > 290) {
                positionYMonsterInCanvas = 250;
                upOrDown = !upOrDown;
            }
        } else {
            if (positionXMonsterInCanvas === -60) {
                positionXMonsterInCanvas = 1200
            }
            positionXMonsterInCanvas -= speed;
            if (upOrDown) {
                positionYMonsterInCanvas -= speed;
            } else {
                positionYMonsterInCanvas += speed;
            }

            if (positionYMonsterInCanvas < -40) {
                positionYMonsterInCanvas = 0;
                upOrDown = !upOrDown;
            }
            if (positionYMonsterInCanvas > 290) {
                positionYMonsterInCanvas = 250;
                upOrDown = !upOrDown;
            }
        }
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

    return {
        thePictureIsReady,
        updated,
        drawImage,
        setReverse,
    }
}

export {
    useAnimationObject,
    useLayer,
    useMonster,
}
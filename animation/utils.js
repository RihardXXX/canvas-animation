// функции утилиты

// возвращаем объект по стрелкам клавиатуры
const getItemByKeyCode = ({ data, e }) => {
    switch(e.code) {
        case 'ArrowLeft':
            return data.find(item => 'left' === item.name);
        case 'ArrowRight':
            return data.find(item => 'right' === item.name);
        case 'ArrowUp':
            return data.find(item => 'up' === item.name);
        case 'ArrowDown':
            return data.find(item => 'down' === item.name);
        default:
            return null;          
    }
}


// возвращаем объект по классу
const getItemByClass = ({ data, e }) => {
    switch(e.target.classList[0]) {
        case 'left':
            return data.find(item => 'left' === item.name);
        case 'right':
            return data.find(item => 'right' === item.name);
        case 'up':
            return data.find(item => 'up' === item.name);
        case 'down':
            return data.find(item => 'down' === item.name);
        default:
            return null;       
    }
}

// хуки слоев и их движение
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


export {
    getItemByClass,
    getItemByKeyCode,
    useLayer,
    useAnimationObject,
}
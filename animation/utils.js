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
const useLayer = ({ imageUrl, speed, ctxCanvas, positionX1, positionX2, positionY, widthImage, heightImage }) => {

    const image = new Image();
    image.src = imageUrl;

    // функция отсчета координат
    const updated = () => {
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

    return {
        updated,
        drawImage,
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
    
    let position = 0

    const updated = () => {
        // когда 9 аргументов логика такая
        // персонаж
        position = Math.floor(gameFrame / stageFrame) % countFrame;
    }

    const drawImage = () => {
        ctxCanvas.drawImage(
            image, // сама картинка спрайт общая
            position * widthFrameImageCut, // сдвиг по оси Х кадра спрайта для среза картинки (точка Х)
            typeAnimation, // тип анимации персонажа сдвиг по оси Y для среза (точка У)
            widthFrameImageCut, // ширина которую нужно срезать в картинке спрайта относительно Х
            heightFrameImageCut, // высота которую нужно срезать относительно Y
            positionXPeopleInCanvas, // итоговая картинка куда будет положена в канвасе по оси Х
            positionYPeopleInCanvas, // итоговая картинка куда будет положена в канвасе по оси У
            widthCutImageByCanvas, // ширина срезанной картинки
            heightCutImageBYCanvas, // высота срезеной картинки 
        );
    }

    return {
        updated,
        drawImage,
    };
}

export {
    getItemByClass,
    getItemByKeyCode,
    useLayer,
    useAnimationObject,
}
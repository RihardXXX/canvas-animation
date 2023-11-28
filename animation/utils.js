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

// генерация случайных целых числе в диапазоне
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функция совпадения то есть касания основного объекта другими объектами
const coincidence = ({ mainObject, otherObjects }) => {
    if (typeof mainObject !== 'object') {
        throw new Error('первый аргумент должен быть объектом');
    }

    if (typeof otherObjects !== 'array') {
        throw new Error('второй аргумент должен быть массивом');
    }

    // возвращаем объект который коснулся главного объекта
    let result;

    // тут мы берем координаты главного объекта с которым будем сравнивать 
    const { x: xMain, y: yMain, width: widthMain, height: heightMain } = mainObject;

    // тут мы проверяем массив объектов на пересечение с главным объектом
    otherObjects.forEach(object => {
        if (xMain > object.x + object.width ||
            xMain + widthMain < object.x ||
            yMain > object.y + object.height ||
            yMain + heightMain < object.height) 
        {
            // нет совпадений
        } else {
            // совпало возвращаем совпавший объект
            result = object;
            return;
        }
    });

    return result;
}


export {
    getItemByClass,
    getItemByKeyCode,
    getRandomInt,
    coincidence,
}
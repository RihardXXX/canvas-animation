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
// если сущности являются прямоугольниками
const coincidenceRectangle = ({ mainObject, otherObjects }) => {
    if (typeof mainObject !== 'object') {
        throw new Error('первый аргумент должен быть объектом');
    }

    if (!Array.isArray(otherObjects)) {
        throw new Error('второй аргумент должен быть массивом');
    }

    // возвращаем объект который коснулся главного объекта
    // let result;

    // тут мы берем координаты главного объекта с которым будем сравнивать 
    const { x: xMain, y: yMain, width: widthMain, height: heightMain } = mainObject;

    // тут мы проверяем массив объектов на пересечение с главным объектом
    // сравниваем точку x и точку x + ширину второго объекта
    var result = otherObjects
            .filter(item => {
                if (xMain > item.x + item.width ||
                    xMain + widthMain < item.x ||
                    yMain > item.y + item.height ||
                    yMain + heightMain < item.y) 
                {
                    return false;
                } else {
                    // совпало возвращаем совпавший объект
                    return true;
                }
            }).map(item => ({ id: item.id }));

    return result;
}

// функция совпадения то есть касания основного объекта другими объектами
// если сущности являются круги
const coincidenceCircle = ({ mainObject, otherObjects })  => {
    if (typeof mainObject !== 'object') {
        throw new Error('первый аргумент должен быть объектом');
    }

    if (!Array.isArray(otherObjects)) {
        throw new Error('второй аргумент должен быть массивом');
    }

    // возвращаем объект который коснулся главного объекта
    let result;

    // координаты и радиус главного объекта
    const { x: xMain, y: yMain, radius: radiusMain } = mainObject;

    // тут мы будем сравнивать сумму радиусов окружностей с прямой которая соединят центры кругов
    // если прямая соединяющая центры кругов равна сумме радиусов или меньше ее то получилось совпадение
    // прямую которая соединяет центры кругов вычисляется как гипотенуза прямоугольного треугольника
    // катеты вычисляются как разница координат
    otherObjects.forEach(item => {
        // вычисляем катет первый 
        // обязательно узнаем какой из кругов впереди
        const dx = xMain > item.x 
                    ? xMain - item.x 
                    : item.x - xMain;

        const dy = yMain > item.y 
                    ? yMain - item.y 
                    : item.y - yMain;

        // Теорема Пифагора вычисляем гипотенузу (расстояние от центра круга первого и  до второго прямая)
        const distanceBetweenCircles = Math.sqrt(dx * dx + dy * dy);
        
        // Сумма радиусов кругов
        const sumRadiusesCircle = item.radius + radiusMain;

        if (distanceBetweenCircles < sumRadiusesCircle) {
            // коснулся и круги вошли друг в друга

        } else if (distanceBetweenCircles === sumRadiusesCircle) {
            // момент прикосновения

            result = item;
            return;
        } else {
            // нет касания
        }
    });

    return result;
}

// генерация уникальных айди
const uuidv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

export {
    getItemByClass,
    getItemByKeyCode,
    getRandomInt,
    coincidenceRectangle,
    coincidenceCircle,
    uuidv4,
}
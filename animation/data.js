// массив типов анимаций, количества кадров, их позиция
let animationState = [
    {
        index: 0,
        name: 'down',
        count: 12,
    },
    {
        index: 1,
        name: 'left',
        count: 12,
    },
    {
        index: 2,
        name: 'right',
        count: 12,
    },
    {
        index: 3,
        name: 'up',
        count: 12,
    },
];

// собираем данные
animationState = animationState.map((item, index) => {
    const location = [];

    for (let i = 0; i < item.count; i++) {
        location.push({
            x: i * 95.2, // расположение кадров анимации  по оси X
            y: index * 160, // расположение кадров по оси Y
        })
    }

    return {
        ...item,
        location,
    }
});

// console.log('animationState: ', animationState);

export {
    animationState,
}
// с каким устройством работаем

function checkPlatform() {
    // size type
    let desktop;
    let tablet;
    let mobile;

    if (document) {
        const width = document.documentElement.clientWidth;
        if (width <= 650) {
            mobile = true;
        } else if ((width > 650) && (width < 1024)) {
            tablet = true;
        } else {
            desktop = true;
        }
    }

    return {
        desktop,
        tablet, 
        mobile,
    }
}

export {
    checkPlatform,
}
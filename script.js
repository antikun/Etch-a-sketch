// I got the makeRipple function from https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/ 

function makeRipple(e) {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${e.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }
    button.appendChild(circle);
}

const buttons = document.querySelectorAll(".opt-btns");
buttons.forEach(button => {
    button.addEventListener("click", makeRipple)
});

// GLOBAL VARIABLES

const mainColor = document.querySelector("#main-color");
const pen = document.querySelector("#pen");
const slider = document.querySelector("#grid-slider");
const pad = document.querySelector(".pad");
const eraser = document.querySelector("#eraser");
const bgColorBtn = document.querySelector("#bg-color-btn");
const rainbowBtn = document.querySelector("#rainbow");
const shaderBtn = document.querySelector("#shader");
const ligthenerBtn = document.querySelector("#lightener");
const fillBtn = document.querySelector("#bucket");

// SETTING THE GRID FUNCTIONS

function makeDivs(num) {
    while (pad.firstChild) {
        pad.removeChild(pad.firstChild);
    }

    const outputValue = document.querySelectorAll(".slider-value");
    outputValue.forEach(output => output.textContent = num);

    const gridNum = num ** 2;
    for (let i = 0; i < gridNum; i++) {
        const div = document.createElement("div");
        div.style.width = div.style.height = `${((pad.clientWidth) / num)}px`;
        div.classList.add("grid-cell", "cell-border");
        pad.append(div);
    }
}

makeDivs(slider.value); // sets initial grid

window.addEventListener("resize", () => { // makes the grid responsive
    pad.childNodes.forEach(div => {
        const newDivWidth = `${pad.clientWidth / slider.value}px`;
        div.style.width = div.style.height = newDivWidth;
    });
});

slider.addEventListener("input", () => {
    makeDivs(slider.value);
});

// COLORING FUNCTIONS

// let clicks = 0;

// function getRainbowColor() {
//     const rainbowColors = ["red", "orange", "yellow", "green", "blue", "indigo"];
//     if (clicks > rainbowColors.length) {
//         clicks = 1
//     }
//     return rainbowColors[clicks - 1]
// }

function makeRandomColor() {
    const getRandomNum = () => {
        return Math.floor(Math.random() * 255) + 1;
    }

    return `rgb(${getRandomNum()}, ${getRandomNum()}, ${getRandomNum()})`;
}

function applyShader(color) {
    const oldRGB = color.slice(4, -1).split(",");

    const newR = parseInt(parseInt(oldRGB[0]) * (1 - 0.1));
    const newG = parseInt(parseInt(oldRGB[1]) * (1 - 0.1));
    const newB = parseInt(parseInt(oldRGB[2]) * (1 - 0.1));

    return `rgb(${newR}, ${newG}, ${newB})`;
}

function applyLightener(color) {
    const oldRGB = color.slice(4, -1).split(",");

    const calculateNewValue = (oldValue) => {
        return oldValue + (255 - oldValue) * 0.1
    }

    const newR = calculateNewValue(parseInt(oldRGB[0]))
    const newG = calculateNewValue(parseInt(oldRGB[1]))
    const newB = calculateNewValue(parseInt(oldRGB[2]))

    return `rgb(${newR}, ${newG}, ${newB})`;
}

const draw = (e) => {
    e.preventDefault();
    if (pad.contains(e.target) && e.target != pad) {
        if (pen.classList.contains("selected")) {
            e.target.style.backgroundColor = mainColor.value;
        } else if (eraser.classList.contains("selected")) {
            e.target.style.backgroundColor = "transparent";
        } else if (bgColorBtn.classList.contains("selected")) {
            pad.style.backgroundColor = mainColor.value;
        } else if (rainbowBtn.classList.contains("selected")) {
            // clicks++;
            e.target.style.backgroundColor = makeRandomColor();
        } else if (shaderBtn.classList.contains("selected")) {
            const currentColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = applyShader(currentColor);
        } else if (ligthenerBtn.classList.contains("selected")) {
            const currentColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = applyLightener(currentColor);
        }
        // else if (fillBtn.classList.contains("selected")) {

        // }
    }
};

// EVENT LISTENERS

pad.addEventListener("mousedown", (e) => {
    e.preventDefault();
    draw(e);
    document.addEventListener("mouseover", draw);
    document.addEventListener("mouseup", () => {
        document.removeEventListener("mouseover", draw);
    });
})

const toolsBtns = document.querySelectorAll(".tools-btns");
toolsBtns.forEach(button => {
    button.addEventListener("click", () => {
        for (let btn of toolsBtns) {
            btn.classList.remove("selected", "rainbow")
        }
        button.classList.add("selected");
    });
})

rainbowBtn.addEventListener("click", () => {
    rainbowBtn.classList.add("rainbow");
})
// GOLD BUTTONS

function toggleGrid() {
    pad.childNodes.forEach(div => {
        div.classList.toggle("cell-border");
    })
}

const gridBtn = document.querySelector("#toggle-grid");
gridBtn.addEventListener("click", toggleGrid);

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", () => {
    pad.childNodes.forEach(div => {
        div.style.backgroundColor = "";
    })
});

// COLOR SWATCH BACKGROUND

mainColor.addEventListener("input", () => {
    mainColor.style.backgroundColor = mainColor.value;
})



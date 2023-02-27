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
const grabberBtn = document.querySelector("#grabber");

const USER_INPUT = {
    selected: "Pen",
    color: "",
    targets: [],
    previousColor: []
}


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

slider.addEventListener("change", () => {
    makeDivs(slider.value);
});

// COLORING FUNCTIONS

let clicks = 0;

function getRainbowColor() {
    const rainbowColors = ["rgb(255, 0, 0)", "rgb(255,165,0)", "rgb(255,255,0)", "rgb(0, 255, 0)", "rgb(0,0,255)", "rgb(75,0,130)"];
    if (clicks > rainbowColors.length) {
        clicks = 1
    }
    return rainbowColors[clicks - 1]
}

// function makeRandomColor() {
//     const getRandomNum = () => {
//         return Math.floor(Math.random() * 255) + 1;
//     }

//     return `rgb(${getRandomNum()}, ${getRandomNum()}, ${getRandomNum()})`;
// }

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

function convertRGBtoHEX(input) {
    const rgbValues = input.slice(4, -1).split(",");
    const hexValues = [];

    const replaceNums = (num, arr) => {
        if (num === 10) {
            arr.push("a")
        } else if (num === 11) {
            arr.push("b")
        } else if (num === 12) {
            arr.push("c")
        } else if (num === 13) {
            arr.push("d")
        } else if (num === 14) {
            arr.push("e")
        } else if (num === 15) {
            arr.push("f")
        } else {
            arr.push(num);
        }
    }

    rgbValues.forEach(value => {
        const firstChar = Math.floor(value / 16);
        const secondChar = ((value / 16 - firstChar) * 16) * 1000 / 1000;
        replaceNums(firstChar, hexValues);
        replaceNums(secondChar, hexValues);
    });

    return `#${hexValues.join("")}`;
}


function prepareUndo(e) {
    if (USER_INPUT.targets.length > 100) {
        USER_INPUT.targets.splice(0, 50)
    }
    if (USER_INPUT.previousColor.length > 100) {
        USER_INPUT.previousColor.splice(0, 50)
    }
    USER_INPUT.targets.push(e.target);
    USER_INPUT.previousColor.push(e.target.style.backgroundColor);
}

const draw = (e) => {
    e.preventDefault();
    prepareUndo(e);
    if (pad.contains(e.target) && e.target != pad) {
        if (USER_INPUT.selected === "Pen") {
            e.target.style.backgroundColor = mainColor.value;
        } else if (USER_INPUT.selected === "Eraser") {
            e.target.style.backgroundColor = "transparent";
        } else if (USER_INPUT.selected === "Background") {
            pad.style.backgroundColor = mainColor.value;
        } else if (USER_INPUT.selected === "Unicorn") {
            clicks++;
            e.target.style.backgroundColor = getRainbowColor();
        } else if (USER_INPUT.selected === "Shader") {
            const currentColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = applyShader(currentColor);
        } else if (USER_INPUT.selected === "Lightener") {
            const currentColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = applyLightener(currentColor);
        } else if (USER_INPUT.selected === "Color Grab") {
            if (e.target.style.backgroundColor === "") { return }
            const targetColor = convertRGBtoHEX(e.target.style.backgroundColor)
            mainColor.value = targetColor;
            mainColor.style.backgroundColor = targetColor;
        }
    }
};

function undoColorFill() {
    const target = USER_INPUT.targets;
    const color = USER_INPUT.previousColor;
    if (target.length === 0) { return }
    target[target.length - 1].style.backgroundColor = color[color.length - 1];
    target.pop();
    color.pop();
}

// EVENT LISTENERS

const undoBtn = document.querySelector("#undo");
undoBtn.addEventListener("click", undoColorFill);

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
        USER_INPUT.selected = button.textContent;
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


// const newArr = [];
// newArr.splice(0, newArr.length);
    // USER_INPUT.targets.push({...pad.children});
    // const newObj = [...USER_INPUT.targets];
    // for(let prop in newObj[0]) {
    //   newObj[0].prop = newObj[0][prop].style.backgroundColor;
    // }
    // USER_INPUT.previousColor.push(newObj)
    // newArr.forEach(item => {
    //   for (let i = 0; i < pad.children.length; i++) {
    //   USER_INPUT.previousColor.push(item[i].style.backgroundColor);
    // }
    // });
  //   USER_INPUT.targets.forEach(target => {
  //     for (let i = 0; i < pad.children.length; i++) {
  //       newArr.push(target[i].style.backgroundColor)
  //     }
  //   })
  // USER_INPUT.previousColor.push(newArr);

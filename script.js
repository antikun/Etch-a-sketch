const USER_INPUT = {
    selected: "Pen",
    color: document.querySelector("#main-color"),
    slider: document.querySelector("#grid-slider"),
    grid: document.querySelectorAll(".slider-value"),
    pad: document.querySelector(".pad"),
    targets: [],
    previousColor: [],
    clicks: 0
};

function makeDivs() { //sets the grid
    while (USER_INPUT.pad.firstChild) { //removes all child nodes before appending new divs
        USER_INPUT.pad.removeChild(USER_INPUT.pad.firstChild);
    }

    const num = USER_INPUT.slider.value;

    USER_INPUT.grid.forEach(output => output.textContent = num);

    const gridNum = num ** 2;
    for (let i = 0; i < gridNum; i++) {
        const div = document.createElement("div");
        div.style.width = div.style.height = `${((USER_INPUT.pad.clientWidth) / num)}px`;
        div.classList.add("grid-cell", "cell-border");
        USER_INPUT.pad.append(div);
    }
}


// COLORING FUNCTIONS

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

function draw(e) {
    e.preventDefault();
    prepareUndo(e);

    function getRainbowColor() {
        const rainbowColors = ["rgb(255, 0, 0)", "rgb(255,165,0)", "rgb(255,255,0)", "rgb(0, 255, 0)", "rgb(0,0,255)", "rgb(75,0,130)"];
        if (USER_INPUT.clicks > rainbowColors.length) {
            USER_INPUT.clicks = 1
        }
        return rainbowColors[USER_INPUT.clicks - 1]
    }

    if (USER_INPUT.pad.contains(e.target) && e.target != USER_INPUT.pad) {
        if (USER_INPUT.selected === "Pen") {
            e.target.style.backgroundColor = USER_INPUT.color.value;
        } else if (USER_INPUT.selected === "Eraser") {
            e.target.style.backgroundColor = "transparent";
        } else if (USER_INPUT.selected === "Background") {
            USER_INPUT.pad.style.backgroundColor = USER_INPUT.color.value;
        } else if (USER_INPUT.selected === "Unicorn") {
            USER_INPUT.clicks++;
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
            USER_INPUT.color.value = targetColor;
            USER_INPUT.color.style.backgroundColor = targetColor;
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

function toggleGrid() {
    USER_INPUT.pad.childNodes.forEach(div => {
        div.classList.toggle("cell-border");
    })
}

function makeRipple(e) { // I got the makeRipple function from https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/ 
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

function setEventListeners() {
    USER_INPUT.slider.addEventListener("change", makeDivs);
    USER_INPUT.slider.addEventListener("input", () => {
        USER_INPUT.grid.forEach(output => output.textContent = USER_INPUT.slider.value)
    });

    window.addEventListener("resize", () => { // makes the grid responsive
        USER_INPUT.pad.childNodes.forEach(div => {
            const newDivWidth = `${USER_INPUT.pad.clientWidth / USER_INPUT.slider.value}px`;
            div.style.width = div.style.height = newDivWidth;
        });
    });

    const toolsBtns = document.querySelectorAll(".tools-btns");
    toolsBtns.forEach(button => {
        button.addEventListener("click", () => {
            for (let btn of toolsBtns) {
                btn.classList.remove("selected", "rainbow")
            }
            button.classList.add("selected");
            USER_INPUT.selected = button.textContent;
        });
    });

    document.querySelectorAll(".opt-btns").forEach(button => {
        button.addEventListener("click", makeRipple)
    });

    USER_INPUT.pad.addEventListener("mousedown", (e) => {
        e.preventDefault();

        draw(e);
        document.addEventListener("mouseover", draw);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mouseover", draw);
        });
    });

    const rainbowBtn = document.querySelector("#rainbow");
    rainbowBtn.addEventListener("click", () => {
        rainbowBtn.classList.add("rainbow");
    });

    document.querySelector("#undo").addEventListener("click", undoColorFill);

    USER_INPUT.color.addEventListener("input", () => {
        USER_INPUT.color.style.backgroundColor = USER_INPUT.color.value;
    });

    document.querySelector("#toggle-grid").addEventListener("click", toggleGrid);

    document.querySelector("#clear").addEventListener("click", () => {
        USER_INPUT.pad.childNodes.forEach(div => {
            div.style.backgroundColor = "";
        });
        USER_INPUT.targets.splice(0, USER_INPUT.targets.length);
        USER_INPUT.previousColor.splice(0, USER_INPUT.previousColor.length);
    });
}

function main() {
    makeDivs();
    setEventListeners();
}

main();

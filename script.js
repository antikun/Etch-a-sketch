const userInput = {
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
    while (userInput.pad.firstChild) { //removes all child nodes before appending new divs
        userInput.pad.removeChild(userInput.pad.firstChild);
    }

    if (window.innerWidth > 1024) {
        userInput.slider.max = 64;
    }

    const num = userInput.slider.value;

    userInput.grid.forEach(output => output.textContent = num);

    const gridNum = num ** 2;
    for (let i = 0; i < gridNum; i++) {
        const div = document.createElement("div");
        div.style.width = div.style.height = `${((userInput.pad.clientWidth) / num)}px`;
        div.classList.add("grid-cell", "cell-border");
        userInput.pad.append(div);
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
    if (userInput.targets.length > 100) {
        userInput.targets.splice(0, 50)
    }
    if (userInput.previousColor.length > 100) {
        userInput.previousColor.splice(0, 50)
    }
    userInput.targets.push(e.target);
    userInput.previousColor.push(e.target.style.backgroundColor);
}

function draw(e) {
    e.preventDefault();
    prepareUndo(e);

    function getRainbowColor() {
        const rainbowColors = ["rgb(255, 0, 0)", "rgb(255,165,0)", "rgb(255,255,0)", "rgb(0, 255, 0)", "rgb(0,0,255)", "rgb(75,0,130)"];
        if (userInput.clicks > rainbowColors.length) {
            userInput.clicks = 1
        }
        return rainbowColors[userInput.clicks - 1]
    }

    if (userInput.pad.contains(e.target) && e.target != userInput.pad) {
        if (userInput.selected === "Pen") {
            e.target.style.backgroundColor = userInput.color.value;
        } else if (userInput.selected === "Eraser") {
            e.target.style.backgroundColor = "transparent";
        } else if (userInput.selected === "Background") {
            userInput.pad.style.backgroundColor = userInput.color.value;
        } else if (userInput.selected === "Unicorn") {
            userInput.clicks++;
            e.target.style.backgroundColor = getRainbowColor();
        } else if (userInput.selected === "Shader") {
            const currentColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = applyShader(currentColor);
        } else if (userInput.selected === "Lightener") {
            const currentColor = e.target.style.backgroundColor;
            e.target.style.backgroundColor = applyLightener(currentColor);
        } else if (userInput.selected === "Color Grab") {
            if (e.target.style.backgroundColor === "") { return }
            const targetColor = convertRGBtoHEX(e.target.style.backgroundColor)
            userInput.color.value = targetColor;
            userInput.color.style.backgroundColor = targetColor;
        }
    }
};

function undoColorFill() {
    const target = userInput.targets;
    const color = userInput.previousColor;
    if (target.length === 0) { return }
    target[target.length - 1].style.backgroundColor = color[color.length - 1];
    target.pop();
    color.pop();
}

function toggleGrid() {
    userInput.pad.childNodes.forEach(div => {
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
    userInput.slider.addEventListener("change", makeDivs);
    userInput.slider.addEventListener("input", () => {
        userInput.grid.forEach(output => output.textContent = userInput.slider.value)
    });

    window.addEventListener("resize", () => { // makes the grid responsive
        if (window.innerWidth < 1024) {
            userInput.slider.max = 40;
        } else {
            userInput.slider.max = 64;
        }
        userInput.pad.childNodes.forEach(div => {
            const newDivWidth = `${userInput.pad.clientWidth / userInput.slider.value}px`;
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
            userInput.selected = button.textContent;
        });
    });

    document.querySelectorAll(".opt-btns").forEach(button => {
        button.addEventListener("click", makeRipple)
    });

    userInput.pad.addEventListener("mousedown", (e) => {
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

    userInput.color.addEventListener("input", () => {
        userInput.color.style.backgroundColor = userInput.color.value;
    });

    document.querySelector("#toggle-grid").addEventListener("click", toggleGrid);

    document.querySelector("#clear").addEventListener("click", () => {
        userInput.pad.childNodes.forEach(div => {
            div.style.backgroundColor = "";
        });
        userInput.targets.splice(0, userInput.targets.length);
        userInput.previousColor.splice(0, userInput.previousColor.length);
    });
}

function main() {
    makeDivs();
    setEventListeners();
}

main();

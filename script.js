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

const buttons = document.querySelectorAll(".btn");
buttons.forEach(button => {
    button.addEventListener("click", makeRipple)
});



const mainColor = document.querySelector("#main-color");
const pen = document.querySelector("#pen");
const slider = document.querySelector("#grid-slider");
const pad = document.querySelector(".pad");
const eraser = document.querySelector("#eraser");
const bgColorBtn = document.querySelector("#bg-color-btn");

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

makeDivs(slider.value);

window.addEventListener("resize", () => {
    pad.childNodes.forEach(div => {
        const newDivWidth = `${pad.clientWidth / slider.value}px`;
        div.style.width = div.style.height = newDivWidth;
    });
});

slider.addEventListener("input", () => {
    makeDivs(slider.value);
});

const draw = (e) => {
    if (pad.contains(e.target) && e.target != pad) {
        if (pen.classList.contains("selected")) {
            e.target.style.backgroundColor = mainColor.value;
        } else if (eraser.classList.contains("selected")) {
            e.target.style.backgroundColor = "transparent";
        } else if (bgColorBtn.classList.contains("selected")) {
            pad.style.backgroundColor = mainColor.value;
        }
    }
};



pad.onmousedown = function (e) {
    draw(e);

    document.addEventListener("mousemove", draw);
    document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", draw);
    });
}

const toolsBtns = document.querySelectorAll(".tools-btns");
toolsBtns.forEach(button => {
    button.addEventListener("click", () => {
        for (let btn of toolsBtns) {
            btn.classList.remove("selected")
        }
        button.classList.add("selected");
    });
})

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
})
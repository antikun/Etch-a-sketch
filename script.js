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


const pen = document.querySelector("#pen");
const slider = document.querySelector("#grid-slider");
const pad = document.querySelector(".pad");

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
        div.classList.add("grid-cell");
        pad.append(div);
    }
}

makeDivs(slider.value);

window.addEventListener("resize", () => {
    let divWidth = `${pad.clientWidth / slider.value}px`;
    const padWidth = pad.clientWidth;
    const temp = padWidth;
    console.log(divWidth)
    console.log(padWidth)
    // pad.childNodes.forEach(div => { div.width = div.height = divWidth });
});

slider.addEventListener("input", () => {
    makeDivs(slider.value);
});

pad.onmousedown = function (e) {
    e.preventDefault();
    console.log(e.target)
    const mainColor = document.querySelector("#main-color");
    const draw = (e) => {
        e.preventDefault();
        if (pad.contains(e.target) && e.target != pad) {
            e.target.style.backgroundColor = mainColor.value;
        }
    }
    draw(e);

    pad.addEventListener("mousemove", draw);
    document.addEventListener("mouseup", () => {
        pad.removeEventListener("mousemove", draw);
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
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
})


const pen = document.querySelector("#pen");
const pad = document.querySelector(".pad")

function makeDivs(num) {
    const gridNum = num ** 2;
    for (let i = 0; i < gridNum; i++) {
        const div = document.createElement("div");
        div.style.width = div.style.height = `${(pad.offsetWidth / num)}px`;
        div.classList.add("square")
        pad.append(div);
    }
}
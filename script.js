function runCalc() {
    const onButton = document.querySelector(".button-container.on button");
    const offButton = document.querySelector(".button-container.off button");
    onButton.addEventListener("click", () => initCalc());
    offButton.addEventListener("click", () => offCalc());
    initCalc();
}

function initCalc() {
  const buttons = document.querySelectorAll(".button-container button");
  clearDisplay();
  buttons.forEach((button) => {
    if (button.textContent !== "off" && button.textContent != "on/c") {
        console.log(button.textContent);
      button.removeEventListener("click", buttonClick);
      button.addEventListener("click", buttonClick);
    }
  });
}

function offCalc() {
    const buttons = document.querySelectorAll(".button-container button");
    clearDisplay();
    buttons.forEach((button) => {
      if (button.textContent !== "off" || button.textContent != "on/c") {
        button.removeEventListener("click", buttonClick);
      }
    });
}

function clearDisplay() {
    const display = document.querySelector(".display");
    display.textContent = "";
}

function buttonClick(e) {
    const button = e.target;
    const display = document.querySelector(".display");
    display.textContent = button.textContent;

}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error";
  }
  return a / b;
}

function operate(a, b, operator) {
  switch (operator) {
    case "+":
      return add(a, b);
      break;
    case "-":
      return subtract(a, b);
      break;
    case "*":
      return multiply(a, b);
      break;
    case "/":
      return divide(a, b);
      break;
    default:
      return "Unidentified operation";
      break;
  }
}

runCalc();

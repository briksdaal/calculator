const onButton = document.querySelector(".button-container.on button");
const offButton = document.querySelector(".button-container.off button");
const buttons = document.querySelectorAll(".button-container button");

const leftOperand = new Operand();
const rightOperand = new Operand();
const operator = new Operator();
const display = new Display();

let activeOperand = leftOperand;
leftOperand.value = 0;

function Operand() {
  this.value = null;
  this.locked = false;
  this.isEmpty = () => {
    return this.value === null;
  };
  this.pushDigit = (digit) => {
    this.value = this.value * 10 + +digit;
  };
  this.lock = () => this.locked = true;
  this.isLocked = () => this.locked;
  this.reset = () => {
    this.value = null;
    this.locked = false;
  };
  this.toString = () =>
    !this.isEmpty()
      ? allDigits(this.value.toString())
        ? `${this.value}`
        : "Error"
      : "Empty";
}

function Operator() {
  this.value = null;
  this.locked = false;
  this.set = (c) => this.value = c;
  this.reset = () => {
    this.value = null;
    this.locked = false;
  };
  this.isEmpty = () => {
    return this.value === null;
  };
  this.toString = () => (!this.isEmpty() ? ` ${this.type} ` : "Empty");
}

function Display() {
  this.value = 0;
  this.firstOperandValue = null;
  this.secondOperandValue = null;
  this.operatorValue = null;
  this.element = document.querySelector(".display");
  this.reset = () => {
    this.value = "";
    this.element.textContent = this.value;
  };
  this.set = () => {
    this.value = activeOperand.toString();
    this.element.textContent = this.value;
  };
}

function buttonClick(e) {
  const buttonContent = e.target.textContent;
  if (isDigit(buttonContent)) {
    activeOperand.pushDigit(buttonContent);
    display.set();
  } else if (isEqualSign(buttonContent)) {

  } else if (isOperator(buttonContent)) {
    leftOperand.lock();
    operator.set(buttonContent);
    activeOperand = rightOperand;
  }

  console.log(leftOperand.toString());
  console.log(operator.toString());
  console.log(rightOperand.toString());
}

function runCalc() {
  onButton.addEventListener("click", () => initCalc());
  offButton.addEventListener("click", () => offCalc());
  initCalc();
}

function initCalc() {
  leftOperand.reset();
  leftOperand.value = 0;
  rightOperand.reset();
  operator.reset();
  display.set();
  // rightOperand.reset();
  buttons.forEach((button) => {
    if (button.textContent !== "off" && button.textContent != "on/c") {
      button.removeEventListener("click", buttonClick);
      button.addEventListener("click", buttonClick);
    }
  });
}

function offCalc() {
  display.reset();
  buttons.forEach((button) => {
    if (button.textContent !== "off" || button.textContent != "on/c") {
      button.removeEventListener("click", buttonClick);
    }
  });
}

// function clearDisplay() {
//   display.textContent = "";
// }

function isDigit(c) {
  return (
    typeof c === "string" &&
    c.charCodeAt() >= "0".charCodeAt() &&
    c.charCodeAt() <= "9".charCodeAt()
  );
}

function isEqualSign(c) {
  return c === "=";
}

function isOperator(c) {
  return c === "+" || c === "-" || c === "×" || c === "÷";
}

function allDigits(str) {
  return str && Array.from(str.split("")).every((c) => isDigit(c));
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

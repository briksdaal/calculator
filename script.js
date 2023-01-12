const onButton = document.querySelector(".button-container.on button");
const offButton = document.querySelector(".button-container.off button");
const buttons = document.querySelectorAll(".button-container button");

const leftOperand = new Operand();
const rightOperand = new Operand();
const operator = new Operator();
const display = new Display();

let activeOperand = leftOperand;
leftOperand.set(0);

function Operand() {
  this.value = null;
  this.locked = false;
  this.getValue = () => this.value;
  this.isEmpty = () => {
    return this.value === null;
  };
  this.pushDigit = (digit) => {
    this.value = this.value * 10 + +digit;
  };
  this.set = (value) => (this.value = value);
  this.lock = () => (this.locked = true);
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
  // operator: 0 = "+", 1 = "-"", 2 = "×", 3 ="÷"
  this.value = null;
  this.operatorEnum = null;;
  this.locked = false;
  this.set = (c) => {
    if (c === "+") {
      this.operatorEnum = 0;
    } else if (c === "-") {
      this.operatorEnum = 1;
    } else if (c === "×") {
      this.operatorEnum = 2;
    } else {
      this.operatorEnum = 3;
    }
    this.value = c;
  };
  this.reset = () => {
    this.value = null;
    this.operator = null;
    this.locked = false;
  };
  this.isEmpty = () => {
    return this.value === null || this.value === undefined;
  };
  this.getEnum = () => this.operatorEnum;
  this.toString = () => (!this.isEmpty() ? `${this.value}` : "Empty");
}

function Display() {
  this.value = 0;
  this.minorDisplayValue = "";
  this.firstOperandValue = null;
  this.secondOperandValue = null;
  this.operatorValue = null;
  this.majorDisplay = document.querySelector(".display .major-display");
  this.minorDisplay = document.querySelector(".display .minor-display");
  this.reset = () => {
    this.value = "";
    this.majorDisplay.textContent = this.value;
    this.minorDisplayValue = "";
    this.minorDisplay.textContent = this.minorDisplayValue;
  };
  this.setMajor = (operand) => {
    this.value = operand.toString();
    this.majorDisplay.textContent = this.value;
  };
  this.setMinor = () => {
    this.minorDisplayValue.textContent = `${leftOperand.toString()} ${operator.toString()} ${rightOperand.toString()}`;
  };
}

function buttonClick(e) {
  const buttonContent = e.target.textContent;
  if (isDigit(buttonContent)) {
    activeOperand.pushDigit(buttonContent);
    display.setMajor(activeOperand);
  } else if (isEqualSign(buttonContent) && !rightOperand.isEmpty()) {
    const calculated = operate(leftOperand.getValue(), rightOperand.getValue(), operator.getEnum());
    console.log(`${leftOperand.getValue()}, ${rightOperand.getValue()}, ${operator.getEnum()}`);
    console.log(calculated);
    display.setMinor();
    leftOperand.set(calculated);
    display.setMajor(leftOperand);

  } else if (isOperator(buttonContent)) {
    leftOperand.lock();
    operator.set(buttonContent);
    activeOperand = rightOperand;
  }

  // console.log(leftOperand.toString());
  // console.log(operator.toString());
  // console.log(rightOperand.toString());
}

function runCalc() {
  onButton.addEventListener("click", () => initCalc());
  offButton.addEventListener("click", () => offCalc());
  initCalc();
}

function initCalc() {
  leftOperand.reset();
  leftOperand.set(0);
  activeOperand = leftOperand;
  rightOperand.reset();
  operator.reset();
  display.setMajor(activeOperand);
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
  str = str.split(".");
  if (str.length > 2)
    return false;
  str = str.join("");
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
    case 0:
      return add(a, b);
      break;
    case 1:
      return subtract(a, b);
      break;
    case 2:
      return multiply(a, b);
      break;
    case 3:
      return divide(a, b);
      break;
    default:
      return "Unidentified operation";
      break;
  }
}

runCalc();

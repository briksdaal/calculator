const ROUNDINGDIGITS = 10;

const onButton = document.querySelector(".button-container.on button");
const offButton = document.querySelector(".button-container.off button");
const buttons = document.querySelectorAll(".button-container button");

const leftOperand = new Operand();
const rightOperand = new Operand();
const operator = new Operator();
const display = new Display();

let activeOperand = leftOperand;
// leftOperand.set(0);

function Operand() {
  this.value = "";
  this.continue = false;
  this.hasDecimalPoint = false;
  this.numsAfterDecimal = -1;
  this.getValue = () => this.value;
  this.isEmpty = () => this.value === "";
  this.pushDigit = (digit) => {
    if (this.value === "" && digit === ".") this.value = "0";
    if (this.numsAfterDecimal >= ROUNDINGDIGITS) return;
    if (this.value === "0" && !this.hasDecimalPoint) {
      this.value = "";
    }
    if (this.hasDecimalPoint) this.numsAfterDecimal++;
    this.value = this.value + digit;
    // console.log(this.value);

    // old number and not string based memory

    // if (!this.hasDecimalPoint) {
    //   this.value = this.value * 10 + +digit;
    // } else {
    //   this.value = this.value + (+digit) / (10 ** ++this.numsAfterDecimal);
    // }
  };
  this.set = (value) => (this.value = value);
  this.flagContinued = () => (this.continue = true);
  this.isContinued = () => this.continue;
  this.reset = () => {
    this.value = "";
    this.locked = false;
    this.continue = false;
    this.hasDecimalPoint = false;
    this.numsAfterDecimal = -1;
  };
  this.toString = () =>
    !this.isEmpty()
      ? allDigits(this.value.toString())
        ? `${this.value}`
        : "Error"
      : "Empty";
}

function Operator() {
  // operator: 0 = "+", 1 = "-", 2 = "×", 3 = "÷"
  this.value = null;
  this.operatorEnum = null;
  this.locked = false;
  this.set = (c) => {
    if (c === "+") {
      this.operatorEnum = 0;
    } else if (c === "-") {
      this.operatorEnum = 1;
    } else if (c === "×") {
      this.operatorEnum = 2;
    } else if (c === "÷") {
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
  this.majorDisplayElement = document.querySelector(".display .major-display");
  this.minorDisplayElement = document.querySelector(".display .minor-display");
  this.reset = () => {
    this.value = "";
    this.majorDisplayElement.textContent = this.value;
    this.minorDisplayValue = "";
    this.minorDisplayElement.textContent = this.minorDisplayValue;
  };
  this.setMajor = (operand) => {
    this.value = operand.toString();
    this.majorDisplayElement.textContent = this.value;
  };
  this.setMinor = () => {
    this.minorDisplayValue = "";
    if (!leftOperand.isEmpty())
      this.minorDisplayValue = this.minorDisplayValue.concat(
        `${leftOperand.toString()}`
      );
    if (!operator.isEmpty())
      this.minorDisplayValue = this.minorDisplayValue.concat(
        ` ${operator.toString()}`
      );
    if (!rightOperand.isEmpty())
      this.minorDisplayValue = this.minorDisplayValue.concat(
        ` ${rightOperand.toString()}`
      );

    this.minorDisplayElement.textContent = this.minorDisplayValue;
  };
}

function buttonClick(e) {
  buttonEvent(e.target.textContent);
}

function buttonEvent(buttonContent) {
  console.log(buttonContent);
  // if active operand is a continued left operand (created by previous calculation and not by input), entering a digit or dec point overruns it
  if (
    (isDigit(buttonContent) || isDecimalPoint(buttonContent)) &&
    activeOperand.isContinued()
  ) {
    activeOperand.reset();
    activeOperand.set("0");
  }
  // push digits into active operand and update major display
  if (isDigit(buttonContent)) {
    activeOperand.pushDigit(buttonContent);
    display.setMajor(activeOperand);
  }
  // process decimal point a single time only
  else if (isDecimalPoint(buttonContent) && !activeOperand.hasDecimalPoint) {
    activeOperand.hasDecimalPoint = true;
    activeOperand.pushDigit(buttonContent);
  }
  // immediately operate on active operand for percentage, negate, and sqrt and flag "continued"
  else if (isOneOperandOperator(buttonContent)) {
    let enumOperation;
    if (buttonContent === "%") enumOperation = 4;
    else if (buttonContent === "√") enumOperation = 5;
    else if (buttonContent === "+/-") enumOperation = 6;
    const calculated = operate(activeOperand, null, enumOperation);
    activeOperand.set(calculated);
    display.setMajor(activeOperand);
    activeOperand.flagContinued();
  }
  // process left operand as identity when equal sign is pressed with no operator or right operand
  else if (
    !leftOperand.isEmpty() &&
    operator.isEmpty() &&
    rightOperand.isEmpty() &&
    isEqualSign(buttonContent)
  ) {
    display.setMinor();
    display.setMajor(leftOperand);
    leftOperand.flagContinued();
  }
  // calculate if two operands and operator exist, initiated by equal sign or another operator
  else if (
    !rightOperand.isEmpty() &&
    !operator.isEmpty() &&
    (isEqualSign(buttonContent) || isOperator(buttonContent))
  ) {
    const calculated = operate(
      leftOperand.getValue(),
      rightOperand.getValue(),
      operator.getEnum()
    );
    display.setMinor();
    leftOperand.set(calculated);
    display.setMajor(leftOperand);

    // if calculation is NaN reset left operand and operator and prepare for new input (display still shows Error)
    if (isNaN(leftOperand.getValue())) {
      operator.reset();
      leftOperand.set("0");
      activeOperand = leftOperand;
    }
    // if an operator other than the equal sign triggered calculation, set operator and active operand for further input
    else if (isOperator(buttonContent)) {
      operator.set(buttonContent);
      activeOperand = rightOperand;
    }
    // if calculation was initiated by the equal sign, flag left operand as "continued", with any new input reseting it
    else {
      operator.reset();
      leftOperand.flagContinued();
      activeOperand = leftOperand;
    }

    rightOperand.reset();
  }
  // process operator and switch activeOperand to right if needed
  else if (isOperator(buttonContent)) {
    operator.set(buttonContent);
    display.setMinor();
    activeOperand = rightOperand;
  }
  // joke content for m buttons
  else if (buttonContent === "mrc") {
    activeOperand.set("1337");
    display.setMajor(activeOperand);
    activeOperand.flagContinued();
  } else if (buttonContent === "m-") {
    activeOperand.set("71070");
    display.setMajor(activeOperand);
    activeOperand.flagContinued();
  } else if (buttonContent === "m+") {
    activeOperand.set("80085");
    display.setMajor(activeOperand);
    activeOperand.flagContinued();
  }
}

function runCalc() {
  onButton.addEventListener("click", () => initCalc());
  offButton.addEventListener("click", () => offCalc());
  initCalc();
}

// function resets calc when first run and every on/c click
function initCalc() {
  leftOperand.reset();
  leftOperand.set("0");
  activeOperand = leftOperand;
  rightOperand.reset();
  operator.reset();
  display.reset();
  display.setMajor(activeOperand);
  // rightOperand.reset();
  buttons.forEach((button) => {
    if (button.textContent !== "off" && button.textContent != "on/c") {
      button.removeEventListener("click", buttonClick);
      button.addEventListener("click", buttonClick);
    }
  });
  window.addEventListener("keydown", keyDownEvent);
}

// initiates a buttonEvent only for digits and operators (addition, subtraction, multiplication, division, and equal)
function keyDownEvent(key) {
  key = key.key;
  if (key === "Enter") {
    key = "=";
  } else if (key === "x" || key === "X" || key === "*") {
    key = "×";
  } else if (key === "/") {
    key = "÷";
  }

  if (
    isDigit(key) ||
    key === "+" ||
    key === "-" ||
    key === "×" ||
    key === "÷" ||
    key === "=" ||
    key === "."
  ) {
    buttonEvent(key);
  }
}

// clear calc display and remove all events except for on/c button
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

function isDecimalPoint(c) {
  return c === ".";
}

function isOperator(c) {
  return c === "+" || c === "-" || c === "×" || c === "÷";
}

function isOneOperandOperator(c) {
  return c === "%" || c === "√" || c === "+/-";
}

function allDigits(str) {
  if (str.charAt(0) === "-") str = str.slice(1);
  str = str.split(".");
  if (str.length > 2) return false;
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

function percentage(a) {
  return a / 100;
}

function sqrt(a) {
  return Math.sqrt(a);
}

function negate(a) {
  return -a;
}

function operate(a, b, operator) {
  a = parseFloat(a);
  if (b) b = parseFloat(b);
  let res;
  switch (operator) {
    case 0:
      res = add(a, b);
      break;
    case 1:
      res = subtract(a, b);
      break;
    case 2:
      res = multiply(a, b);
      break;
    case 3:
      res = divide(a, b);
      break;
    case 4:
      res = percentage(a);
      break;
    case 5:
      res = sqrt(a);
      break;
    case 6:
      res = negate(a);
      break;
    default:
      return "Unidentified operation";
      break;
  }

  const roundingFactor = 10 ** ROUNDINGDIGITS;
  return Math.round(res * roundingFactor) / roundingFactor;
}

runCalc();

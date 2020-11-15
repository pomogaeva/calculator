const btns = document.querySelectorAll('.btn');
const btnsOps = document.querySelectorAll('.btn.operator');
const toggleExpand = document.querySelector('.expand-toggle');
const toggleCollapse = document.querySelector('.collapse-toggle');
const expandCols = document.querySelectorAll('.expand-col');
const calcWrapper = document.querySelector('.calc-wrapper');
const toggleTheme = document.querySelector('.theme-toggle');

toggleExpand.addEventListener('click', () => {
  toggleExpand.classList.toggle('hidden');
  toggleCollapse.classList.toggle('hidden');
  expandCols.forEach(function (expandCol) {
    expandCol.classList.toggle('hidden');
  });
  calcWrapper.classList.toggle('extended');
})

toggleCollapse.addEventListener('click', () => {
  toggleExpand.classList.toggle('hidden');
  toggleCollapse.classList.toggle('hidden');
  expandCols.forEach(function (expandCol) {
    expandCol.classList.toggle('hidden');
  });
  calcWrapper.classList.toggle('extended');
});


toggleTheme.addEventListener('click', () => {
  btns.forEach(function (btn) {
    btn.classList.toggle('light');
  });
  btnsOps.forEach(function (btnOps) {
    btnOps.classList.remove('light');
  });
  calcWrapper.classList.toggle('light');
})


let display = "";
let result = 0;
let finished = false;
// to detect inserting two operators in row
let operatorInput = false;
// to detect if we have unary operator
let uOperator = false;
// equals clicked
let equalsClicked = false;

let num1 = "0",
  num2 = "0",
  operator;

btns.forEach(function (btn) {
  btn.addEventListener('click', (event) => {
    const calculator = event.target;
    let num, ops, uops, res;
    // get number value
    num = calculator.getAttribute('data-num');
    if (num == null) {
      // ops here
      // get operator value
      ops = calculator.getAttribute('data-ops');
      uops = calculator.getAttribute('data-uops');
      if (ops == 'clear') {
        // clear button clicked
        reset();
        return;
      }
      if ((ops == '=' || (operator && !uOperator) || uops) && (!operatorInput || uops != undefined)) {
        // if we click equal or another operator so it should calculate the result
        if (uops) {
          operator = uops;
          uOperator = true;
        } else {
          uOperator = false;
        }
        if (ops == '=') {
          equalsClicked = true;
        } else {
          equalsClicked = false;
        }
        if (ops && ops == '%') {
          num2 = (parseFloat(num1) * parseFloat(num2)) / 100.0;
        }
        result = calculate();
        operator = null;
        // finished is true after calculate
        finished = true;
        num2 = 0;
        res = num1;
        num1 = result.toString();
      }
      if (ops != '=' || uops) {
        // if the operator is not equals or a unary operator
        operator = ops || uops;
        if (!operatorInput && !uops) {
          // if we don't have num1 it should show 0
          if (num1 == '0' && !display.length) {
            display += '0';
          }
          operatorInput = true;
        } else {
          // remove the last operator if we added another one
          display = display.slice(0, display.length - 1);
        }
        if (uops) {
          switch (operator) {
            case '+/-':
              display = `${-1 * res}`;
              break;
            default:
              display = `${uops}(${parseFloat(res)})`;
              break;
          }
        } else {
          // append operator to display
          display += ops || uops;
        }
      }
    } else {
      // numbers here
      operatorInput = false;
      if (equalsClicked) {
        reset();
        equalsClicked = false;
      }
      (operator) ? num2 += num: num1 += num;
      display += num;
    }
    if (finished) {
      // display the result
      document.getElementById('screen-result').value = result;
      finished = false;
    }
    document.getElementById('screen-calculation').value = display;
  });

});

function reset() {
  display = "";
  result = 0;
  finished = false;
  operatorInput = false;
  num1 = "0";
  num2 = "0";
  operator = "";
  document.getElementById('screen-calculation').value = display;
  document.getElementById('screen-result').value = result;
}

function calculate(currentOperation) {

  let number1 = parseFloat(num1),
    number2 = parseFloat(num2);

  switch (operator) {
    case '+':
      result = number1 + number2;
      break;
    case '-':
      result = number1 - number2;
      break;
    case '/':
      (number2 != 0) ? result = number1 / number2: result = 'Error';
      break;
    case '*':
      result = number1 * number2;
      break;
    case 'sin':
      result = Math.sin(number1);
      break;
    case 'cos':
      result = Math.cos(number1);
      break;
    case 'tan':
      result = Math.tan(number1);
      break;
    case 'ln':
      result = Math.log(number1);
      break;
    case 'square':
      result = Math.sqrt(number1);
      break;
    case '+/-':
      result = number1 * -1;
      break;
    case '%':
      number2 = (number1 * number2) / 100.0;
      result = (number1 * number2) / 100;
      break;
  }
  return result;

}
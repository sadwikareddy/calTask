const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');
let expr = '';

function updateDisplay(){
  displayEl.textContent = expr === '' ? '0' : expr;
}

const isOperator = ch => ['+','-','*','/'].includes(ch);
const lastChar = () => expr.slice(-1);

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    
    if(action === 'clear'){
      expr = '';
      historyEl.textContent = '';
      updateDisplay();
      return;
    }

    
    if(action === 'delete'){
      expr = expr.slice(0, -1);
      updateDisplay();
      return;
    }

    
    if(action === 'equals'){
      compute();
      return;
    }

   
    if(action === 'percent'){
      if(!expr) return;
      try {
        const result = Function('"use strict"; return (' + expr + ')')();
        expr = String(result / 100);
        updateDisplay();
      } catch {
        showError();
      }
      return;
    }

   
    if(typeof val !== 'undefined'){
      if(isOperator(val)){
        if(expr === '' && val !== '-') return;
        if(isOperator(lastChar())) expr = expr.slice(0, -1) + val;
        else expr += val;
      } else if(val === '.'){
        const parts = expr.split(/[\+\-\*\/]/);
        const lastNum = parts[parts.length - 1];
        if(lastNum.includes('.')) return;
        expr += '.';
      } else {
        expr += val;
      }
      updateDisplay();
    }
  });
});

function compute(){
  if(!expr) return;
  try {
    historyEl.textContent = expr;
    const result = Function('"use strict"; return (' + expr + ')')();
    if(result === Infinity || result === -Infinity || Number.isNaN(result)) throw 'err';
    expr = String(result);
    updateDisplay();
  } catch {
    showError();
  }
}

function showError(){
  displayEl.textContent = 'Error';
  expr = '';
  historyEl.textContent = '';
  setTimeout(updateDisplay, 900);
}

updateDisplay();
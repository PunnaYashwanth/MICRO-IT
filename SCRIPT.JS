let display = document.getElementById('display');

function appendValue(val) {
  if (display.innerText === "0") {
    display.innerText = val;
  } else {
    display.innerText += val;
  }
}

function clearDisplay() {
  display.innerText = "0";
}

function calculate() {
  try {
    display.innerText = eval(display.innerText);
  } catch (e) {
    display.innerText = "Error";
  }
}

function backspace() {
  let text = display.innerText;
  if (text.length <= 1) {
    display.innerText = "0";
  } else {
    display.innerText = text.slice(0, -1);
  }
}

const input = document.querySelector('#calc-screen');
const equationText = document.querySelector('p');
const allButtons = document.querySelectorAll('button');
const operations = document.querySelector('.calc-buttons__operations').children;
const functions = document.querySelector('.calc-buttons__functions').children;
const numbers = document.querySelector('.calc-buttons__numbers').children;
const minus = document.querySelector('span');
let plusMinus = "+";
let numbersArray = [];
let result;
let resultShown = false;

//functions for typing -----------------------------------

function resetFlags(){
	if(plusMinus == "-"){
		toggleMinus();
	}
}
function displayResults(){
	let length = input.value.length;
	if(length<=14 || (length === 15 && resultShown)){
		writeInput(this.textContent);
	}else{
		return;
	}
}

function longerThan(value){
	if(value.length > 15){
		value = "too many digits: " + value.substring(0,12);
		input.value = value;
		allButtons.forEach(button =>{
			if(button.textContent !== "CA"){
			  button.disabled = true;
			}
		})
		result = 0;
	}
}

function writeInput(button){
	let dotUsed = input.value.includes(".");

	if(button === '.' && !dotUsed && !resultShown){
		input.value += '.';
	 }else if(input.value === '0'){
		input.value = "";
		input.value = button;
		resultShown = false;
	 }else if(button === '.' && resultShown === true){
	 	input.value = "0.";
	 	resultShown = false;
	 }else if(button != '.' && resultShown == true){
	 	input.value = "";
		input.value += button;
		resultShown = false;
	 }else if(button != "."){
	 	input.value += button;
	 	resultShown = false;
	 }
	 
}
function numberWithSpace(x) {
	console.log('changed');
	x = this.textContent;
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}
function numberWithoutSpaces(x){
	let string = x.replace(/\s/g, "");
	return string;
}
// operation functions --------------------------------

function clearAll(){
	numbersArray = [];
	equationText.textContent = "";
	input.value = "0";
	resultShown = false;
	resetFlags();
	allButtons.forEach(button =>{		
	  button.disabled = false;
	})
}
function clearLine(){
	input.value = "0";
	resetFlags();
}
function dropLast(){
	let value = input.value;
	value = value.slice(0, -1);
	input.value = value;
	if(input.value === "" || input.value === "-"){
		input.value = '0';
	}
	resetFlags();
	resultShown = false;
}
function toggleMinus(){
	minus.style.top = ((input.offsetTop+input.offsetHeight/2)-minus.offsetHeight/2) + 'px';
	if(plusMinus=="+"){
		plusMinus = '-';
		minus.classList.toggle('minus');
	}else{
		plusMinus = '+';
		minus.classList.toggle('minus');
	}
}
// subsidiary functions for calculation -------------------------
function shortenFunction(item){
	if(item.includes(".") && item.length>15){
		item = item.substring(0, 15);
		if(item.includes(".") && item[item.length-1]!="."){
			return item;
		}else{
			return;
		}
	}	
}
function changeLastSign(item){
  let value = equationText.textContent;
  if(value[value.length-1] === "+" || 
  	 value[value.length-1] === "−" ||
  	 value[value.length-1] === "÷" ||
  	 value[value.length-1] === "∗"){
  	 
  	 value = value.slice(0, -1);
  	 value += item;
  	 equationText.textContent = value;
  }else if(equationText.innerHTML.length>0){
  	equationText.innerHTML += item;
  }
}
function checkNegative(number){
	if(plusMinus === "-"){
		number *= (-1);
		numbersArray.push(number);
	}else{
		numbersArray.push(number);
	}
	return number;
}

// calculation functions -----------------------------

function chooseEquation(sign, a, b){
	let equalsTo;
	switch(sign){
		case "+":
		  equalsTo = parseFloat(a + b).toFixed(5).replace(/\.?0+$/, "");
		  break;
		case "−":
		  equalsTo = parseFloat(a - b).toFixed(5).replace(/\.?0+$/, "");
		  break;
		case "∗":
		  equalsTo = parseFloat(a * b).toFixed(5).replace(/\.?0+$/, "");
		  break;
		case "÷":
		  equalsTo = parseFloat(a / b).toFixed(5).replace(/\.?0+$/, "");
		  break;
	}
	return equalsTo;
}
function doEquation(length, number, sign){
	if(length<2){
		result = numbersArray[0];
		input.value = number;
		equationText.textContent += number + sign;
		resultShown = true;
		resetFlags();
	}else{
		result = chooseEquation(sign, result, numbersArray[length-1]);
		input.value = result;
		resetFlags();
		resultShown = true;
		if(number<0){
			equationText.textContent += `(${number})${sign}`;
		}else {
			equationText.textContent += number + sign;
		}
	}
}

function newEquationResultShown(number, sign){
	number = checkNegative(number);
	numbersArray.push(number);
	result = numbersArray[0];
	input.value = parseFloat(number).toFixed(5);
	equationText.textContent += number + sign;
	resultShown = true;
	resetFlags();
}

function equation(sign){
	if( sign == "+" ||
		sign == "−" ||
		sign == "∗" ||
		sign == "÷"){		
	}else sign = this.textContent;
	changeLastSign(sign);
	if(sign == "÷" && input.value == 0){
		alert('You cannot divide by 0');
		clearAll();
		return;
	}
	if(!resultShown){
		let number = parseFloat(input.value);
		number = checkNegative(number);
		doEquation(numbersArray.length, number, sign);
	}else if(resultShown && numbersArray == ""){
		newEquationResultShown(parseFloat(input.value), sign);
	}
	input.value = shortenFunction(input.value) || input.value;
	longerThan(input.value);
	
}

function equals(){
	resultShown = false;
	let value = equationText.textContent;
	equation(value[value.length-1]);
	numbersArray = [];
	equationText.textContent = "";
    resetFlags();
    resultShown = true;
}
// keyboard click ----------------------------------------

function keyboardClick(event){
	if(!isNaN(event.key) || event.key === "."){
		for(let i = 0; i<numbers.length; i++){
			if(event.key == numbers[i].textContent){
				numbers[i].click();
			}
		}
	}else{
			switch(event.key){
				case "*":
				  functions[0].click();
				  break;
				case "/":
				  functions[1].click();
				  break;
				case "+":
				  functions[2].click();
				break;
				case "-":
				  functions[3].click();
				  break;
				case "=":
				  functions[4].click();
				  break;
				case "Enter":
				  functions[4].click();
				  break;
				case "Backspace":
				  operations[2].click();
				  break;
				case "Delete":
				  operations[0].click();
				  break;
			}
		}
}

//setting event listeners --------------------------------------

for(let i = 0; i<operations.length; i++){
	switch(operations[i].innerHTML){
		case "∓":
			operations[i].addEventListener('click', toggleMinus);
			break;
		case "CA":
			operations[i].addEventListener('click', clearAll);
			break;
		case "C":
			operations[i].addEventListener('click', clearLine);
			break;
		case "←":
			operations[i].addEventListener('click', dropLast);
			break;

	}
}
for(let i = 0; i<functions.length; i++){
	switch(functions[i].innerHTML){
		case "∗":
		  functions[i].addEventListener('click', equation);
		  break;
		case "÷":
		  functions[i].addEventListener('click', equation);
		  break;
		case "+":
		  functions[i].addEventListener('click', equation);
		  break;
		case "−":
		  functions[i].addEventListener('click', equation);
		  break;
		case "=":
		  functions[i].addEventListener('click', equals);
		  break;
	}
}
for(let i = 0; i<numbers.length; i++){
	numbers[i].addEventListener('click', displayResults);
}

window.addEventListener('keyup', keyboardClick);
window.addEventListener('load',()=>{
    const savedVal=localStorage.getItem("displayValue");
    if(savedVal){
        display.value=savedVal;
    }
})
function updateDisplay(value) {
    display.value = value;
    localStorage.setItem("displayValue", value);
}

const display=document.getElementById("display");
//добавить текст кнопки на экран
function addToDisplay(value){
    if(display.value==='' && value!=='^'&& value!=='='&& value!=='+'&& value!=='-'&& value!=='×'&& value!=='÷'&& value!=='.'){
        display.value="  "+value;
        updateDisplay(display.value);
    }else if (display.value!==''){
        if(!('+-×^÷.'.includes(display.value.slice(-1)) && '+-×^÷.'.includes(value))){
            display.value+=value;
            updateDisplay(display.value);
        }
    }
}
//вернуть строку в начальное состояние
function clearDisplay(){
    display.value="";
}
//обработчик нажатия кнопок чисел и операторов
const buttons=document.querySelectorAll(".numbers, .operators");
buttons.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        const buttonVal=event.target.textContent;
        if(buttonVal===","){
            addToDisplay('.');
        }else if(buttonVal==="()"){
            putParentheses();
        }else{
            addToDisplay(buttonVal);
        }
    })
})
//функция учета скобок
function putParentheses(){
    const lastChar=display.value.slice(-1);
    let openBr=countBr();
    const isLastCharOperator = ["+", "-", "×", "÷", "^", ""].includes(lastChar);
    if(isLastCharOperator){
        addToDisplay("(");
    }else if(!isLastCharOperator&&openBr!==0 &&(lastChar!=="" && !'+-×^÷('.includes(lastChar))){
        addToDisplay(")");
    }
}
//функция определения баланса скобок
function countBr(){
    let openBr=0;
    for(let i=0;i<display.value.length;i++){
        if(display.value[i]==='('){
            openBr++;
        }else if(display.value[i]===')'){
            openBr--;
        }
    }
    return openBr;
}
//обработчик нажатия кнопок действий
const actionButtons=document.querySelectorAll(".action");
actionButtons.forEach((button)=>{
    button.addEventListener("click", (event)=>{
        const buttonVal=event.target.textContent;
        if (buttonVal==="C"){
            clearDisplay();
            updateDisplay(display.value);
        }else if(buttonVal==="←"){
            if(display.value.trim().length <= 1){
                clearDisplay();
            }
            else{
                display.value = display.value.slice(0, -1);
                updateDisplay(display.value);}
        }else if(buttonVal==="="){
            if(!(display.value.length===0 ||countBr()!==0 || '+-×^÷(.'.includes(display.value.trim().slice(-1)))){
                display.value = "  "+calculate(display.value.trim());
                updateDisplay(display.value);            
            }
        }
    })
})
//основная функция вычисления
function calculate(expression){
    expression = expression.replace(/×/g, '*');
    expression = expression.replace(/÷/g, '/');
    expression = expression.replace(/,/g, '.');

    const values=[];
    const operators=[];
    const partitions=division(expression);
    partitions.forEach(part=>{
        if (!isNaN(part) && part.trim()!==''){
            values.push(parseFloat(part));
        }else if(part==='('){
            operators.push(part);
        }else if(part===')'){
            while(operators.length>0 && operators[operators.length-1]!=='('){
                const operator=operators.pop();
                const operand2=values.pop();
                const operand1=values.pop();
                values.push(applyOperator(operand1,operand2,operator))
            }
            operators.pop();
        }else {
            while(operators.length>0 && getPriority(operators[operators.length-1])>=getPriority(part)){
                const operator=operators.pop();
                const operand2=values.pop();
                const operand1=values.pop();
                values.push(applyOperator(operand1,operand2,operator));
            }
            operators.push(part);
        }
    })
    while (operators.length > 0) {
        const operator = operators.pop();
        const operand2 = values.pop();
        const operand1 = values.pop();
        values.push(applyOperator(operand1, operand2, operator));
    }
    return values.pop();
}
//определение приоритета
function getPriority(operator){
    if(operator==='+' || operator==='-'){
        return 1;
    }else if(operator==='*' || operator==='/'){
        return 2;
    }else if(operator==='^'){
        return 3;
    }
    return 0;
}
function applyOperator(operand1,operand2,operator){
    switch(operator){
        case '+': return operand1+operand2;
        case '-': return operand1-operand2;
        case '*': return operand1*operand2;
        case '/': 
        if (operand2===0) return 'Error';
        return operand1/operand2;
        case '^': return Math.pow(operand1,operand2);
        default: return 0;
    }
}
//разделение на элементы
function division(expression){
    const partitions=[];
    let currentPart='';
    for(let i=0; i<expression.length;i++){
        const char=expression[i];
        if(char===' '){
            continue;
        }
        if(char==='-' && (i===0 ||expression[i-1]==='(')){
            currentPart+=char;
        }else if('+-*^/()'.includes(char)){
            if (currentPart){
                partitions.push(currentPart);
                currentPart='';
            }
            partitions.push(char);
        }else{
            currentPart+=char;//сбор числа
        }
    }
    if(currentPart){
        partitions.push(currentPart);
    }
    return partitions;
}
